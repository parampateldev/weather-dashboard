import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchForecast, resolvePlace } from './api/openMeteo'
import Current from './components/Current'
import DayDetail from './components/DayDetail'
import Forecast from './components/Forecast'
import SearchBox from './components/SearchBox'
import Segmented from './components/Segmented'
import Sky from './components/Sky'
import { useNow } from './hooks/useNow'
import { useStoredState } from './hooks/useStoredState'
import { nowAt } from './lib/format'
import { skyTheme } from './lib/weather'
import './App.css'

const isPlaceList = (v) =>
  Array.isArray(v) && v.every((p) => p && typeof p.name === 'string' && typeof p.latitude === 'number' && typeof p.longitude === 'number')

function geolocationMessage(err) {
  if (err && err.code === 1) return 'Location access was blocked. Allow it in your browser settings, or search for a place instead.'
  if (err && err.code === 3) return 'Finding your location took too long. Try again or search for a place.'
  return 'Your position could not be determined. Try again or search for a place.'
}

export default function App() {
  const [place, setPlace] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | locating | ready | error
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [unit, setUnit] = useStoredState('wd:unit', 'metric', (v) => v === 'metric' || v === 'imperial')
  const [clock, setClock] = useStoredState('wd:clock', '12', (v) => v === '12' || v === '24')
  const [history, setHistory] = useStoredState('wd:history', [], isPlaceList)
  const requestRef = useRef(null)

  const tick = useNow()

  const load = useCallback(
    async (getPlace, mode = 'loading') => {
      requestRef.current?.abort()
      const controller = new AbortController()
      requestRef.current = controller
      setStatus(mode)
      setError('')
      setSelectedDate(null)
      try {
        const nextPlace = await getPlace()
        const data = await fetchForecast(nextPlace.latitude, nextPlace.longitude, { signal: controller.signal })
        if (controller.signal.aborted) return
        setPlace(nextPlace)
        setForecast(data)
        setStatus('ready')
        if (!nextPlace.isGeo) {
          setHistory((prev) => [nextPlace, ...prev.filter((p) => p.name !== nextPlace.name)].slice(0, 5))
        }
      } catch (err) {
        if (controller.signal.aborted || err.name === 'AbortError') return
        setError(err.message || 'Something went wrong while loading the forecast.')
        setStatus('error')
      }
    },
    [setHistory],
  )

  const pickPlace = useCallback((p) => load(async () => p), [load])
  const searchText = useCallback((text) => load(() => resolvePlace(text)), [load])

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('This browser does not support location. Search for a place instead.')
      setStatus('error')
      return
    }
    load(
      () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) =>
              resolve({
                name: 'Your location',
                detail: `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
                latitude: coords.latitude,
                longitude: coords.longitude,
                isGeo: true,
              }),
            (err) => reject(new Error(geolocationMessage(err))),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
          )
        }),
      'locating',
    )
  }, [load])

  useEffect(() => () => requestRef.current?.abort(), [])

  const now = useMemo(
    () => (forecast ? nowAt(forecast.timezone, clock, tick) : null),
    [forecast, clock, tick],
  )

  const theme = forecast && status !== 'idle' ? skyTheme(forecast.current.code, forecast.current.isDay) : 'dawn'
  const busy = status === 'loading' || status === 'locating'
  const ready = forecast && now
  const selectedDay = ready && selectedDate ? forecast.days.find((d) => d.date === selectedDate) : null

  return (
    <>
      <Sky theme={theme} />
      <div className="page" data-view={ready ? 'results' : 'start'}>
        <div className="topbar">
          <span className="byline">by Param Patel</span>
          <Segmented
            label="Units"
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'metric', label: '\u00b0C' },
              { value: 'imperial', label: '\u00b0F' },
            ]}
          />
        </div>

        <header className="hero">
          <h1 className="wordmark">
            <span className="wm-line">
              <span>Weather</span>
            </span>
            <span className="wm-line wm-line-2">
              <span>Dashboard</span>
            </span>
          </h1>
          <p className="hero-tag">Hour by hour weather for anywhere on Earth, from open data.</p>
          <SearchBox
            busy={busy}
            locating={status === 'locating'}
            history={history}
            onPickPlace={pickPlace}
            onSubmitText={searchText}
            onLocate={locate}
          />
        </header>

        <main className="results" aria-live="polite">
          {busy && <p className="notice" role="status">{status === 'locating' ? 'Waiting for your location...' : 'Reading the sky...'}</p>}
          {status === 'error' && <p className="notice notice-error" role="alert">{error}</p>}
          {ready && (
            <div className={busy ? 'results-body is-stale' : 'results-body'} key={`${place.latitude},${place.longitude}`}>
              <Current place={place} forecast={forecast} unit={unit} clock={clock} now={now} />
              <Forecast days={forecast.days} todayDate={now.date} unit={unit} onSelect={setSelectedDate} />
            </div>
          )}
        </main>

        <footer className="footer">
          <p>
            Weather data from{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
              Open-Meteo.com
            </a>
            , licensed CC BY 4.0.
          </p>
          <a href="https://github.com/parampateldev" target="_blank" rel="noopener noreferrer">
            Param Patel on GitHub
          </a>
        </footer>
      </div>

      {selectedDay && (
        <DayDetail
          day={selectedDay}
          nowIso={now.iso}
          unit={unit}
          clock={clock}
          onClockChange={setClock}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </>
  )
}
