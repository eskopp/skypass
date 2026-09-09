# skypass

When to look up: visible passes of the ISS and bright satellites from a given
location. Everything runs in the browser; there is no backend.

## Status

Scaffold. The page loads the committed TLE snapshot and lists it. The
prediction engine is not written yet.

## How it will work

| Piece | Job |
|-------|-----|
| `data/tle/*.txt` | Orbital elements from CelesTrak, committed snapshot, refreshed by CI twice a day (`refresh-tle.yml`) |
| `lib/time.js` | Julian date, GMST |
| `lib/frames.js` | TEME -> ECEF -> topocentric, az/alt for the observer |
| `lib/sun.js` | Solar position, observer twilight, satellite illumination |
| `lib/sgp4.js` | SGP4 propagator |
| `lib/passes.js` | Scan the next N days, keep passes that are actually visible (satellite sunlit, observer in the dark, high enough above the horizon) |

The learning goal is the astrodynamics: reference frames, time systems, and
the visibility geometry, written out rather than pulled from a library.

## Running locally

```sh
python -m http.server 8000
# http://localhost:8000
```

## Deployment

Push to `main` -> GitHub Pages (`deploy-pages.yml`). The TLE refresh workflow
triggers a redeploy when it commits new elements.

## License

MIT (`LICENSE`). CelesTrak data is public domain.
