import { useEffect, useState } from 'react'
import { searchPlaces } from '../api/openMeteo'

// Debounced place lookup. Older requests are aborted when the query changes.
export function usePlaceSuggestions(query, enabled) {
  const [results, setResults] = useState([])

  useEffect(() => {
    const q = query.trim()
    if (!enabled || q.length < 2) {
      setResults([])
      return undefined
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        setResults(await searchPlaces(q, { count: 6, signal: controller.signal }))
      } catch (err) {
        if (err.name !== 'AbortError') setResults([])
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, enabled])

  return results
}
