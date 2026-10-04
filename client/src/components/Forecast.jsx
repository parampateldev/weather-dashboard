import { describeWeather } from '../lib/weather'
import { dateLabel, percent, temp } from '../lib/format'
import WeatherIcon from './WeatherIcon'

function dayName(date, todayDate) {
  if (date === todayDate) return 'Today'
  const diff = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${todayDate}T00:00:00Z`)) / 86400000)
  if (diff === 1) return 'Tomorrow'
  return dateLabel(date, { weekday: 'long' })
}

export default function Forecast({ days, todayDate, unit, onSelect }) {
  const lo = Math.min(...days.map((d) => d.min))
  const hi = Math.max(...days.map((d) => d.max))
  const span = Math.max(hi - lo, 1)

  return (
    <section className="forecast" aria-labelledby="forecast-title">
      <h3 id="forecast-title" className="section-title">
        This week
      </h3>
      <ul className="forecast-list">
        {days.map((day, i) => {
          const left = ((day.min - lo) / span) * 100
          const width = Math.max(((day.max - day.min) / span) * 100, 4)
          return (
            <li key={day.date} style={{ '--i': i }}>
              <button type="button" className="forecast-row" onClick={() => onSelect(day.date)}>
                <span className="fr-day">
                  <strong>{dayName(day.date, todayDate)}</strong>
                  <small>{dateLabel(day.date, { month: 'short', day: 'numeric' })}</small>
                </span>
                <span className="fr-icon">
                  <WeatherIcon code={day.code} size={34} title={describeWeather(day.code)} />
                </span>
                <span className="fr-desc">{describeWeather(day.code)}</span>
                <span className="fr-rain">{percent(day.precipChance)} rain</span>
                <span className="fr-temps">
                  <span className="fr-lo">{temp(day.min, unit)}</span>
                  <span className="fr-bar" aria-hidden="true">
                    <span style={{ left: `${left}%`, width: `${width}%` }} />
                  </span>
                  <span className="fr-hi">{temp(day.max, unit)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
