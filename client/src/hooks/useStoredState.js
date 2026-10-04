import { useCallback, useState } from 'react'

function read(key, fallback, validate) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const value = JSON.parse(raw)
    return validate(value) ? value : fallback
  } catch {
    return fallback
  }
}

// useState backed by localStorage. Invalid or unreadable stored values fall back to `initial`.
export function useStoredState(key, initial, validate = () => true) {
  const [value, setValue] = useState(() => read(key, initial, validate))
  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          /* storage may be unavailable; the value still works for this session */
        }
        return resolved
      })
    },
    [key],
  )
  return [value, set]
}
