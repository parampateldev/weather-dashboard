import { useCallback, useMemo, useState } from 'react'
import { isSavedPlaceList, byRecency, readLegacyHistory, toSaved, trim, placeKey } from '../lib/places'
import { useStoredState } from './useStoredState'

// Places the visitor has looked up, with the ability to star or forget them.
export function usePlaces() {
  const [seed] = useState(readLegacyHistory)
  const [places, setPlaces] = useStoredState('wd:places', seed, isSavedPlaceList)

  const record = useCallback(
    (place) => {
      const saved = toSaved(place)
      setPlaces((prev) => {
        const existing = prev.find((p) => p.key === saved.key)
        const next = { ...saved, starred: existing ? existing.starred : false, lastUsed: Date.now() }
        return trim([next, ...prev.filter((p) => p.key !== saved.key)].sort(byRecency))
      })
    },
    [setPlaces],
  )

  const toggleStar = useCallback(
    (key) => setPlaces((prev) => prev.map((p) => (p.key === key ? { ...p, starred: !p.starred } : p))),
    [setPlaces],
  )

  const remove = useCallback((key) => setPlaces((prev) => prev.filter((p) => p.key !== key)), [setPlaces])

  const clearRecent = useCallback(() => setPlaces((prev) => prev.filter((p) => p.starred)), [setPlaces])

  const sorted = useMemo(() => [...places].sort(byRecency), [places])
  const starred = useMemo(() => sorted.filter((p) => p.starred), [sorted])
  const recent = useMemo(() => sorted.filter((p) => !p.starred), [sorted])

  return { places: sorted, starred, recent, record, toggleStar, remove, clearRecent, keyOf: placeKey }
}
