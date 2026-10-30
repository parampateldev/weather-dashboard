import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { describeWeather } from '../lib/weather'
import { dateLabel, dayName, hourLabel, localClock, percent, rain, temp, wind } from '../lib/format'
import HourlyChart, { COL } from './HourlyChart'
import Segmented from './Segmented'
import WeatherIcon from './WeatherIcon'

const FOCUSABLE = 'button, [href], input, select, [tabindex]:not([tabindex="-1"])'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One continuous hour by hour strip for the whole forecast. Scrolling past midnight rolls into the next day,
// and the heading, summary and facts follow whichever day is in the middle of the view.
export default function DayDetail({ days, initialDate, nowIso, unit, clock, onClockChange, onClose }) {
  const dialogRef = useRef(null)
  const scrollRef = useRef(null)
  const frameRef = useRef(0)
  const [activeDate, setActiveDate] = useState(initialDate)

  const { hours, starts } = useMemo(() => {
    const all = []
    const first = {}
    days.forEach((d) => {
      first[d.date] = all.length
      d.hours.forEach((h) => all.push({ ...h, date: d.date }))
    })
    return { hours: all, starts: first }
  }, [days])

  const todayDate = nowIso ? nowIso.slice(0, 10) : days[0].date
  const nowHour = nowIso ? nowIso.slice(0, 13) : null
  const day = days.find((d) => d.date === activeDate) || days[0]
  const dayIndex = days.indexOf(day)

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

  // Open on the chosen day: centered on the current hour for today, otherwise at the day's first hour.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const nowIndex = hours.findIndex((h) => h.time.slice(0, 13) === nowHour)
    const showNow = nowIndex >= 0 && hours[nowIndex].date === initialDate
    el.scrollLeft = showNow ? nowIndex * COL + COL / 2 - el.clientWidth / 2 : starts[initialDate] * COL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Let a mouse wheel move the strip sideways, but hand the wheel back at either end.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined
    function onWheel(e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const max = el.scrollWidth - el.clientWidth
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  function onScroll() {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (!el) return
      const middle = Math.floor((el.scrollLeft + el.clientWidth / 2) / COL)
      const h = hours[Math.min(Math.max(middle, 0), hours.length - 1)]
      setActiveDate((current) => (current === h.date ? current : h.date))
    })
  }

  function goToDay(date) {
    const el = scrollRef.current
    if (!el || starts[date] === undefined) return
    el.scrollTo({ left: starts[date] * COL, behavior: reduceMotion() ? 'auto' : 'smooth' })
    setActiveDate(date)
  }

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

  const avgHumidity = (() => {
    const vals = day.hours.map((h) => h.humidity).filter((v) => v !== null && v !== undefined)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  })()

  const chartValues = hours.map((h) => (unit === 'imperial' && h.temp != null ? (h.temp * 9) / 5 + 32 : h.temp))

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
          <div className="sheet-actions">
            <button type="button" className="close" onClick={() => goToDay(days[dayIndex - 1].date)} disabled={dayIndex === 0} aria-label="Previous day">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" className="close" onClick={() => goToDay(days[dayIndex + 1].date)} disabled={dayIndex === days.length - 1} aria-label="Next day">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button type="button" className="close" onClick={onClose} aria-label="Close hourly forecast">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
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
            <dd>{percent(avgHumidity)}</dd>
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

        <div className="day-tabs">
          <Segmented
            label="Jump to day"
            value={activeDate}
            onChange={goToDay}
            options={days.map((d) => ({ value: d.date, label: d.date === todayDate ? 'Today' : dateLabel(d.date, { weekday: 'short', day: 'numeric' }) }))}
          />
        </div>

        <div
          className="hourly-scroll"
          ref={scrollRef}
          onScroll={onScroll}
          tabIndex={0}
          aria-label="Hourly forecast for the whole week, scrolls horizontally"
        >
          <div className="hourly-inner" style={{ '--cols': hours.length }}>
            <ol className="hourly-days" aria-hidden="true">
              {days.map((d) => (
                <li key={d.date} style={{ '--n': d.hours.length }}>
                  <span>
                    {dayName(d.date, todayDate)}
                    <small>{dateLabel(d.date, { month: 'short', day: 'numeric' })}</small>
                  </span>
                </li>
              ))}
            </ol>
            <HourlyChart values={chartValues} />
            <ol className="hourly-list">
              {hours.map((h, i) => {
                const isNow = h.time.slice(0, 13) === nowHour
                const dayStart = i > 0 && h.date !== hours[i - 1].date
                const cls = [isNow && 'is-now', dayStart && 'is-day-start'].filter(Boolean).join(' ') || undefined
                return (
                  <li key={h.time} className={cls}>
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
        <p className="legend">Under each hour: chance of rain, then wind speed. Scroll sideways to move through the week.</p>
      </div>
    </div>
  )
}
