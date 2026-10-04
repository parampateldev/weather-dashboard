import { describeWeather } from '../lib/weather'
import { dateLabel, localClock, percent, temp, timezoneLabel, wind, rain } from '../lib/format'
import WeatherIcon from './WeatherIcon'

export default function Current({ place, forecast, unit, clock, now }) {
  const { current, days, timezone } = forecast
  const today = days.find((d) => d.date === now.date) || days[0]
  const description = describeWeather(current.code)

  return (
    <section className="current" aria-labelledby="place-name">
      <p className="eyebrow">
        {dateLabel(now.date, { weekday: 'long', month: 'long', day: 'numeric' })}
        <span className="eyebrow-sep" aria-hidden="true" />
        <span className="eyebrow-time">
          {now.label} {timezoneLabel(timezone)}
        </span>
      </p>
      <h2 id="place-name" className="place-name">
        {place.name}
      </h2>
      {place.detail && <p className="place-detail">{place.detail}</p>}

      <div className="current-main">
        <p className="current-temp" aria-label={`${temp(current.temp, unit)} ${unit === 'imperial' ? 'Fahrenheit' : 'Celsius'}`}>
          {temp(current.temp, unit)}
        </p>
        <div className="current-summary">
          <WeatherIcon code={current.code} isDay={current.isDay} size={56} />
          <p>{description}</p>
          <p className="current-range">
            High {temp(today.max, unit)}, low {temp(today.min, unit)}
          </p>
        </div>
      </div>

      <dl className="facts">
        <div>
          <dt>Feels like</dt>
          <dd>{temp(current.feelsLike, unit)}</dd>
        </div>
        <div>
          <dt>Humidity</dt>
          <dd>{percent(current.humidity)}</dd>
        </div>
        <div>
          <dt>Wind</dt>
          <dd>{wind(current.wind, unit)}</dd>
        </div>
        <div>
          <dt>Rain now</dt>
          <dd>{rain(current.precip, unit)}</dd>
        </div>
        <div>
          <dt>Sunrise</dt>
          <dd>{localClock(today.sunrise, clock)}</dd>
        </div>
        <div>
          <dt>Sunset</dt>
          <dd>{localClock(today.sunset, clock)}</dd>
        </div>
      </dl>
    </section>
  )
}
