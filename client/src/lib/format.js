// Unit conversion. The API returns metric values; imperial is derived here.
export function temp(value, unit) {
  if (value === null || value === undefined) return '--'
  const v = unit === 'imperial' ? (value * 9) / 5 + 32 : value
  return `${Math.round(v)}\u00b0`
}

export function wind(value, unit) {
  if (value === null || value === undefined) return '--'
  return unit === 'imperial' ? `${Math.round(value * 0.621371)} mph` : `${Math.round(value)} km/h`
}

export function rain(value, unit) {
  if (value === null || value === undefined) return '--'
  if (unit === 'imperial') return `${(value / 25.4).toFixed(2)} in`
  return `${value.toFixed(1)} mm`
}

export function percent(value) {
  return value === null || value === undefined ? '--' : `${Math.round(value)}%`
}

// Open-Meteo returns local wall-clock strings such as "2026-10-04T14:00" for the
// requested location. These helpers read those strings without any timezone shift.
export function hourLabel(hour, clock) {
  if (clock === '24') return `${String(hour).padStart(2, '0')}:00`
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h} ${hour < 12 ? 'AM' : 'PM'}`
}

export function localClock(isoLocal, clock) {
  const hour = Number(isoLocal.slice(11, 13))
  const minute = isoLocal.slice(14, 16)
  if (clock === '24') return `${String(hour).padStart(2, '0')}:${minute}`
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:${minute} ${hour < 12 ? 'AM' : 'PM'}`
}

// A date-only string ("2026-10-04") formatted without depending on the viewer's timezone.
export function dateLabel(dateString, options) {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...options }).format(new Date(`${dateString}T00:00:00Z`))
}

// Current wall-clock time at the forecast location, using the timezone from the API.
export function nowAt(timezone, clock, now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now)
    const get = (type) => parts.find((p) => p.type === type).value
    const date = `${get('year')}-${get('month')}-${get('day')}`
    const iso = `${date}T${get('hour')}:${get('minute')}`
    return { date, iso, label: localClock(iso, clock) }
  } catch {
    return null
  }
}

export function timezoneLabel(timezone, now = new Date()) {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')
    return part ? part.value : timezone
  } catch {
    return timezone
  }
}
