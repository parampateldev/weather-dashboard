import { formatPlace } from './openMeteo'

const REVERSE_URL = 'https://api-bdc.io/data/reverse-geocode-client'

function countryName(code, fallback) {
  try {
    return new Intl.DisplayNames('en', { type: 'region' }).of(code) || fallback
  } catch {
    return fallback
  }
}

// Turns coordinates into a name like "Detroit, Michigan, United States".
// Returns null when the service is unreachable or the point is not in a named place, such as open ocean.
export async function reverseGeocode(latitude, longitude, { timeoutMs = 5000 } = {}) {
  try {
    const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), localityLanguage: 'en' })
    const res = await fetch(`${REVERSE_URL}?${params}`, { signal: AbortSignal.timeout(timeoutMs) })
    if (!res.ok) return null
    const data = await res.json()
    const name = data.city || data.locality
    if (!name || !data.countryName) return null
    return formatPlace({ name, admin1: data.principalSubdivision, country: countryName(data.countryCode, data.countryName) })
  } catch {
    return null
  }
}
