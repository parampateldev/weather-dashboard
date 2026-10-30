// Saved places live in localStorage on this device. There is no backend, so nothing leaves the browser.
export const MAX_RECENT = 15
export const MAX_STARRED = 50

export function placeKey(place) {
  return `${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`
}

export function isSavedPlaceList(v) {
  return (
    Array.isArray(v) &&
    v.every(
      (p) =>
        p &&
        typeof p.key === 'string' &&
        typeof p.name === 'string' &&
        typeof p.latitude === 'number' &&
        typeof p.longitude === 'number' &&
        typeof p.starred === 'boolean' &&
        typeof p.lastUsed === 'number',
    )
  )
}

// Recent searches from the first version were a plain list of places, newest first.
export function readLegacyHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem('wd:history'))
    if (!Array.isArray(raw)) return []
    const now = Date.now()
    return raw
      .filter((p) => p && typeof p.name === 'string' && typeof p.latitude === 'number' && typeof p.longitude === 'number')
      .map((p, i) => ({ ...toSaved(p), starred: false, lastUsed: now - i }))
  } catch {
    return []
  }
}

export function toSaved(place) {
  return {
    key: placeKey(place),
    name: place.name,
    shortName: place.shortName,
    latitude: place.latitude,
    longitude: place.longitude,
  }
}

// Keeps every starred place and only the newest unstarred ones.
export function trim(list) {
  const starred = list.filter((p) => p.starred).slice(0, MAX_STARRED)
  const recent = list.filter((p) => !p.starred).slice(0, MAX_RECENT)
  return [...starred, ...recent]
}

export function byRecency(a, b) {
  return b.lastUsed - a.lastUsed
}
