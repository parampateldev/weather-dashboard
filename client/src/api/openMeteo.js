const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export function formatPlace({ name, admin1, country }) {
  return [name, admin1, country].filter(Boolean).filter((part, i, all) => all.indexOf(part) === i).join(', ')
}

export async function searchPlaces(query, { count = 6, signal } = {}) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Place search failed (${res.status}).`)
  const data = await res.json()
  return (data.results || []).map((r) => ({
    name: formatPlace(r),
    shortName: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}

// Picks the result that best matches a "City, Region" style query.
export async function resolvePlace(query) {
  const trimmed = query.trim()
  let results = await searchPlaces(trimmed, { count: 20 })
  if (results.length === 0 && trimmed.includes(',')) {
    results = await searchPlaces(trimmed.split(',')[0].trim(), { count: 20 })
  }
  if (results.length === 0) {
    throw new Error(`No place found for "${trimmed}". Try a city name, or add a region such as "Canton, Michigan".`)
  }
  const lower = trimmed.toLowerCase()
  return results.find((r) => r.name.toLowerCase().includes(lower) || lower.includes(r.name.toLowerCase())) || results[0]
}

const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'is_day',
  'weather_code',
  'wind_speed_10m',
  'precipitation',
]

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'sunrise',
  'sunset',
]

const HOURLY_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'is_day',
]

// All values are requested in metric units; conversion to imperial happens in the UI.
export async function fetchForecast(latitude, longitude, { signal } = {}) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(','),
    daily: DAILY_FIELDS.join(','),
    hourly: HOURLY_FIELDS.join(','),
    forecast_days: '7',
    timezone: 'auto',
  })
  const res = await fetch(`${FORECAST_URL}?${params}`, { signal })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json()).reason || ''
    } catch {
      /* response was not JSON */
    }
    throw new Error(`Forecast request failed (${res.status}). ${detail}`.trim())
  }
  return normalizeForecast(await res.json())
}

function normalizeForecast(raw) {
  const { current, daily, hourly } = raw

  const days = daily.time.map((date, i) => {
    const hours = []
    hourly.time.forEach((t, h) => {
      if (t.startsWith(date)) {
        hours.push({
          time: t,
          hour: Number(t.slice(11, 13)),
          temp: hourly.temperature_2m[h],
          feelsLike: hourly.apparent_temperature[h],
          humidity: hourly.relative_humidity_2m[h],
          precipChance: hourly.precipitation_probability[h],
          precip: hourly.precipitation[h],
          code: hourly.weather_code[h],
          wind: hourly.wind_speed_10m[h],
          isDay: hourly.is_day[h] === 1,
        })
      }
    })
    return {
      date,
      code: daily.weather_code[i],
      max: daily.temperature_2m_max[i],
      min: daily.temperature_2m_min[i],
      precipSum: daily.precipitation_sum[i],
      precipChance: daily.precipitation_probability_max[i],
      windMax: daily.wind_speed_10m_max[i],
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i],
      hours,
    }
  })

  return {
    timezone: raw.timezone,
    timezoneAbbreviation: raw.timezone_abbreviation,
    latitude: raw.latitude,
    longitude: raw.longitude,
    current: {
      time: current.time,
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      isDay: current.is_day === 1,
      code: current.weather_code,
      wind: current.wind_speed_10m,
      precip: current.precipitation,
    },
    days,
  }
}
