# Weather Dashboard

A small weather web app. Search for a place or use your current location to see current conditions, a seven day outlook, and an hour by hour breakdown for any day.

All weather and place data comes from [Open-Meteo](https://open-meteo.com/), which is free to use for non-commercial projects and needs no API key. There is no backend, no account, and no map. The browser talks to Open-Meteo directly.

## Features

- Place search with suggestions, from the Open-Meteo geocoding API
- "Use my location" button that uses the browser geolocation API
- Current temperature, feels like, humidity, wind, rain, sunrise and sunset
- Seven day forecast with daily highs, lows and chance of rain
- Day detail with real hourly data: temperature curve, conditions, rain chance and wind for each hour
- Local time shown for the forecast location, using the timezone returned by the API
- Celsius or Fahrenheit, and 12 hour or 24 hour clock, remembered between visits
- Recent searches stored in localStorage on your device only
- Sky colors that change with the current conditions and time of day

## Data sources

| Purpose | Endpoint |
| --- | --- |
| Place search | `https://geocoding-api.open-meteo.com/v1/search` |
| Forecast | `https://api.open-meteo.com/v1/forecast` |

The forecast request asks for `current`, `daily` and `hourly` fields in a single call with `timezone=auto`. Values are fetched in metric units, and the Fahrenheit, mph and inch displays are converted in the browser.

Geolocation does not use reverse geocoding, so a location found this way is labeled "Your location" with its rounded coordinates.

## Project layout

```
client/
  index.html
  public/favicon.svg
  src/
    main.jsx            entry point and font imports
    App.jsx             state, data loading, page layout
    App.css             component styles
    index.css           base styles and sky themes
    api/openMeteo.js    geocoding and forecast requests
    lib/                weather code mapping, formatting and unit helpers
    hooks/              clock, stored state and debounced suggestions
    components/         search, current conditions, forecast, day detail, icons
deploy.sh               build and copy to the repository root
```

Fonts are Fraunces and Bricolage Grotesque, installed from npm through Fontsource and bundled with the build, so no request is made to a font host.

## Development

You need Node.js 20 or newer.

```
cd client
npm install
npm run dev
```

Other scripts:

```
npm run lint      # ESLint
npm run build     # production build in client/dist
npm run preview   # serve the production build locally
```

## Deploying to GitHub Pages

The Vite `base` is `/weather-dashboard/`, matching the GitHub Pages project URL.

```
./deploy.sh
git add -A
git commit -m "Update build"
git push
```

`deploy.sh` installs dependencies, builds, and replaces `index.html` and `assets/` in the repository root with the new output. Set GitHub Pages to serve from the main branch root.


## Limits

- Open-Meteo asks that free use stay non-commercial and within its fair use limits. See their terms before using this in a commercial setting.
- Forecasts depend on Open-Meteo models and can be wrong, especially several days out. Do not rely on this app for safety decisions.
- Place search matches only what the geocoding API returns, so very small places may not appear.

## Credits

Weather data by [Open-Meteo.com](https://open-meteo.com/), licensed under CC BY 4.0.
