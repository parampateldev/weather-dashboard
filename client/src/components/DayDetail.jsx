import { useEffect, useRef } from 'react'
import { describeWeather } from '../lib/weather'
import { dateLabel, hourLabel, localClock, percent, rain, temp, wind } from '../lib/format'
import HourlyChart from './HourlyChart'
import Segmented from './Segmented'
import WeatherIcon from './WeatherIcon'

const FOCUSABLE = 'button, [href], input, select, [tabindex]:not([tabindex="-1"])'

export default function DayDetail({ day, nowIso, unit, clock, onClockChange, onClose }) {
  const dialogRef = useRef(null)
  const nowRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('.close')?.focus()
    return () => {
      document.body.style.overflow = overflow
      if (previous && previous.focus) previous.focus()
    }
  }, [])

  useEffect(() => {
    nowRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Tab') {
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const hours = day.hours
  const avg = (key) => {
    const vals = hours.map((h) => h[key]).filter((v) => v !== null && v !== undefined)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }
  const nowHour = nowIso && nowIso.startsWith(day.date) ? nowIso.slice(0, 13) : null

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-title"
        ref={dialogRef}
        onKeyDown={onKeyDown}
      >
        <div className="sheet-head">
          <div>
            <p className="eyebrow">{dateLabel(day.date, { weekday: 'long' })}</p>
            <h3 id="day-title" className="sheet-title">
              {dateLabel(day.date, { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>
          <button type="button" className="close" onClick={onClose} aria-label="Close day detail">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <div className="sheet-summary">
          <WeatherIcon code={day.code} size={52} />
          <div>
            <p className="sheet-cond">{describeWeather(day.code)}</p>
            <p className="sheet-range">
              {temp(day.max, unit)} <span>/ {temp(day.min, unit)}</span>
            </p>
          </div>
        </div>

        <dl className="facts facts-sheet">
          <div>
            <dt>Rain chance</dt>
            <dd>{percent(day.precipChance)}</dd>
          </div>
          <div>
            <dt>Rain total</dt>
            <dd>{rain(day.precipSum, unit)}</dd>
          </div>
          <div>
            <dt>Avg humidity</dt>
            <dd>{percent(avg('humidity'))}</dd>
          </div>
          <div>
            <dt>Top wind</dt>
            <dd>{wind(day.windMax, unit)}</dd>
          </div>
          <div>
            <dt>Sunrise</dt>
            <dd>{localClock(day.sunrise, clock)}</dd>
          </div>
          <div>
            <dt>Sunset</dt>
            <dd>{localClock(day.sunset, clock)}</dd>
          </div>
        </dl>

        <div className="hourly-head">
          <h4 className="section-title">Hour by hour</h4>
          <Segmented
            label="Time format"
            value={clock}
            onChange={onClockChange}
            options={[
              { value: '12', label: '12H' },
              { value: '24', label: '24H' },
            ]}
          />
        </div>

        <div className="hourly-scroll" tabIndex={0} aria-label="Hourly forecast, scrolls horizontally">
          <div className="hourly-inner" style={{ '--cols': hours.length }}>
            <HourlyChart values={hours.map((h) => (unit === 'imperial' && h.temp != null ? (h.temp * 9) / 5 + 32 : h.temp))} />
            <ol className="hourly-list">
              {hours.map((h) => {
                const isNow = h.time.slice(0, 13) === nowHour
                return (
                  <li key={h.time} className={isNow ? 'is-now' : undefined} ref={isNow ? nowRef : undefined}>
                    <span className="hl-time">{isNow ? 'Now' : hourLabel(h.hour, clock)}</span>
                    <WeatherIcon code={h.code} isDay={h.isDay} size={26} title={describeWeather(h.code)} />
                    <strong className="hl-temp">{temp(h.temp, unit)}</strong>
                    <span className="hl-meta">{percent(h.precipChance)}</span>
                    <span className="hl-meta">{wind(h.wind, unit)}</span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
        <p className="legend">Under each hour: chance of rain, then wind speed.</p>
      </div>
    </div>
  )
}
