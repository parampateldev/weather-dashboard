// WMO weather interpretation codes used by Open-Meteo.
const DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Violent showers',
  85: 'Light snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm with hail',
}

export function describeWeather(code) {
  return DESCRIPTIONS[code] || 'Unknown conditions'
}

export function iconKind(code, isDay = true) {
  if (code === 0 || code === 1) return isDay ? 'sun' : 'moon'
  if (code === 2) return isDay ? 'partly-day' : 'partly-night'
  if (code === 3) return 'cloud'
  if (code === 45 || code === 48) return 'fog'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloud'
}

// Maps current conditions to a sky theme name, which drives the CSS gradient.
export function skyTheme(code, isDay) {
  if (code === undefined || code === null) return 'dawn'
  if (code >= 95) return 'storm'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  if (code === 45 || code === 48) return 'fog'
  if (code === 3) return 'overcast'
  return isDay ? 'clear-day' : 'clear-night'
}
