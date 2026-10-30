import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchForecast, resolvePlace } from './api/openMeteo'
import Current from './components/Current'
import DayDetail from './components/DayDetail'
import Forecast from './components/Forecast'
import SearchBox from './components/SearchBox'
import Segmented from './components/Segmented'
import Sidebar from './components/Sidebar'
import Sky from './components/Sky'
import { useNow } from './hooks/useNow'
import { usePlaces } from './hooks/usePlaces'
import { useStoredState } from './hooks/useStoredState'
import { nowAt } from './lib/format'
import { placeKey } from './lib/places'
import { skyTheme } from './lib/weather'
import './styles/App.css'

const WIDE = '(min-width: 72rem)'
const isWide = () => typeof window !== 'undefined' && window.matchMedia(WIDE).matches

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
  const { places, starred, recent, record, toggleStar, remove, clearRecent } = usePlaces()
  const [panelPref, setPanelPref] = useStoredState('wd:panel', 'open', (v) => v === 'open' || v === 'closed')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const requestRef = useRef(null)
  const lastPlaceRef = useRef(places[0] ?? null)

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
        if (!nextPlace.isGeo) record(nextPlace)
      } catch (err) {
        if (controller.signal.aborted || err.name === 'AbortError') return
        setError(err.message || 'Something went wrong while loading the forecast.')
        setStatus('error')
      }
    },
    [record],
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

  // Reopen the place the visitor looked at last time.
  useEffect(() => {
    if (lastPlaceRef.current) pickPlace(lastPlaceRef.current)
  }, [pickPlace])

  const wide = isWide()
  const panelOpen = wide ? panelPref === 'open' : drawerOpen
  const togglePanel = () => (wide ? setPanelPref(panelPref === 'open' ? 'closed' : 'open') : setDrawerOpen((o) => !o))
  const closePanel = useCallback(() => (isWide() ? setPanelPref('closed') : setDrawerOpen(false)), [setPanelPref])
  const activeKey = place && !place.isGeo ? placeKey(place) : null
  const activeSaved = activeKey ? places.find((p) => p.key === activeKey) : null

  const openSaved = (saved) => {
    if (!isWide()) setDrawerOpen(false)
    pickPlace(saved)
  }

  const now = useMemo(
    () => (forecast ? nowAt(forecast.timezone, clock, tick) : null),
    [forecast, clock, tick],
  )

  const theme = forecast && status !== 'idle' ? skyTheme(forecast.current.code, forecast.current.isDay) : 'dawn'
  const busy = status === 'loading' || status === 'locating'
  const ready = forecast && now
  const selectedDay = ready && selectedDate ? forecast.days.find((d) => d.date === selectedDate) : null

  return (
    <div className="shell" data-sidebar={wide && panelOpen ? 'open' : 'closed'}>
      <Sky theme={theme} />
      <Sidebar
        open={panelOpen}
        starred={starred}
        recent={recent}
        activeKey={activeKey}
        onPick={openSaved}
        onToggleStar={toggleStar}
        onRemove={remove}
        onClearRecent={clearRecent}
        onClose={closePanel}
      />
      <div className="page" data-view={ready ? 'results' : 'start'}>
        <div className="topbar">
          <div className="topbar-left">
            <button type="button" className="places-toggle" aria-expanded={panelOpen} aria-controls="places-panel" onClick={togglePanel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              Places
              {places.length > 0 && <span className="places-count">{places.length}</span>}
            </button>
            <span className="byline">by Param Patel</span>
          </div>
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
            history={places.slice(0, 8)}
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
              <Current
                place={place}
                forecast={forecast}
                unit={unit}
                clock={clock}
                now={now}
                starred={Boolean(activeSaved?.starred)}
                onToggleStar={activeKey ? () => toggleStar(activeKey) : null}
              />
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
          days={forecast.days}
          initialDate={selectedDay.date}
          nowIso={now.iso}
          unit={unit}
          clock={clock}
          onClockChange={setClock}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
