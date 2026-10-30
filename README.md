# Weather Dashboard

A small weather web app. Search for a place or use your current location to see current conditions, a seven day outlook, and an hour by hour breakdown for any day.

All weather and place data comes from [Open-Meteo](https://open-meteo.com/), which is free to use for non-commercial projects and needs no API key. There is no backend, no account, and no map. The browser talks to Open-Meteo directly.

## Features

- Place search with suggestions, from the Open-Meteo geocoding API
- "Use my location" button that uses the browser geolocation API
- Current temperature, feels like, humidity, wind, rain, sunrise and sunset
- Seven day forecast with daily highs, lows and chance of rain
- One continuous hour by hour strip for the whole week. Open any day and keep scrolling past midnight into the next day, with no need to close and reopen. Day chips and previous or next buttons jump between days, and the heading and daily facts follow the day in view
- Places sidebar with starred and recent places. Star a place to pin it, forget one you no longer want, and the app reopens the place you looked at last
- Local time shown for the forecast location, using the timezone returned by the API
- Celsius or Fahrenheit, and 12 hour or 24 hour clock, remembered between visits
- Saved places, units and clock format are kept in localStorage on your device only
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
.github/workflows/deploy.yml   builds the app and publishes it to GitHub Pages
client/
  index.html
  public/favicon.svg
  src/
    main.jsx            entry point and font imports
    App.jsx             state, data loading, page layout
    api/                geocoding and forecast requests (openMeteo.js)
    components/         search, sidebar, current conditions, forecast, hourly sheet, icons
    hooks/              clock, stored state, saved places and debounced suggestions
    lib/                weather code mapping, formatting, unit and saved place helpers
    styles/             index.css (base and sky themes), App.css, sidebar.css
```

Fonts are Fraunces and Bricolage Grotesque, installed from npm through Fontsource and bundled with the build, so no request is made to a font host.

## Saved places

Places live in `localStorage` under `wd:places` as a list of `{ key, name, latitude, longitude, starred, lastUsed }`. The 15 newest unstarred places are kept and starred places are never trimmed. Nothing is sent to a server. Clearing site data for the page clears the list.

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

The Vite `base` is `/weather-dashboard/`, matching the GitHub Pages project URL. Pushing to `main` runs the workflow in `.github/workflows/deploy.yml`, which lints, builds and publishes `client/dist`. Build output is not committed. In the repository settings, Pages must use "GitHub Actions" as its source.

## Limits

- Open-Meteo asks that free use stay non-commercial and within its fair use limits. See their terms before using this in a commercial setting.
- Forecasts depend on Open-Meteo models and can be wrong, especially several days out. Do not rely on this app for safety decisions.
- Place search matches only what the geocoding API returns, so very small places may not appear.

## Credits

Weather data by [Open-Meteo.com](https://open-meteo.com/), licensed under CC BY 4.0.
