/* skypass — scaffold.
 *
 * Next steps (the actual project):
 *   1. lib/time.js      — Julian date, GMST
 *   2. lib/frames.js    — TEME -> ECEF -> topocentric (ENU) -> az/alt
 *   3. lib/sun.js       — low-precision solar position, observer twilight,
 *                         satellite illumination (in Earth's shadow?)
 *   4. lib/sgp4.js      — vendored propagator (satellite.js) or own
 *   5. lib/passes.js    — coarse scan + refine for rise/culmination/set,
 *                         keep only passes that are visible (sat sunlit,
 *                         observer in the dark, max elevation above threshold)
 *
 * For now this just loads the committed TLE snapshot and lists what is in it.
 */

"use strict";

var statusEl = document.getElementById("status");
var formEl = document.getElementById("controls");
var resultsEl = document.getElementById("results");
var passesEl = document.getElementById("passes");

var TLE_GROUPS = ["stations", "visual"];

function parseTle(text) {
  var lines = text.split(/\r?\n/).filter(function (l) { return l.trim().length; });
  var out = [];
  for (var i = 0; i + 2 < lines.length + 1; i += 3) {
    if (!lines[i + 1] || !lines[i + 2]) break;
    out.push({ name: lines[i].trim(), l1: lines[i + 1], l2: lines[i + 2] });
  }
  return out;
}

function loadTle() {
  return Promise.all(TLE_GROUPS.map(function (g) {
    return fetch("data/tle/" + g + ".txt").then(function (r) {
      if (!r.ok) throw new Error("TLE snapshot missing: " + g);
      return r.text();
    }).then(parseTle);
  })).then(function (groups) {
    var seen = {}, all = [];
    groups.forEach(function (sats) {
      sats.forEach(function (s) {
        var id = s.l1.slice(2, 7);
        if (!seen[id]) { seen[id] = true; all.push(s); }
      });
    });
    return all;
  });
}

formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  statusEl.textContent = "The prediction engine is not wired up yet — see app.js.";
});

loadTle().then(function (sats) {
  statusEl.textContent = sats.length + " satellites loaded from the TLE snapshot.";
  resultsEl.hidden = false;
  passesEl.innerHTML = "";
  sats.slice(0, 40).forEach(function (s) {
    var li = document.createElement("li");
    li.textContent = s.name;
    passesEl.appendChild(li);
  });
}).catch(function (err) {
  statusEl.textContent = err.message;
});
