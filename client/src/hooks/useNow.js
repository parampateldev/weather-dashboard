import { useEffect, useState } from 'react'

// Re-renders every `interval` ms so wall-clock displays stay current.
export function useNow(interval = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}
