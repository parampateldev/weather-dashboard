import { iconKind } from '../lib/weather'

const CLOUD = 'M15 35a7 7 0 0 1-.6-13.97A9.5 9.5 0 0 1 32.7 19.4 8 8 0 0 1 33 35Z'

function Rays({ cx, cy, r1, r2 }) {
  return Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * r1}
        y1={cy + Math.sin(a) * r1}
        x2={cx + Math.cos(a) * r2}
        y2={cy + Math.sin(a) * r2}
      />
    )
  })
}

const MOON = 'M30 10a14 14 0 1 0 8 25 11.5 11.5 0 0 1-8-25Z'

export default function WeatherIcon({ code, isDay = true, size = 40, title }) {
  const kind = iconKind(code, isDay)
  return (
    <svg
      className="wx-icon"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {kind === 'sun' && (
        <>
          <circle cx="24" cy="24" r="8" />
          <Rays cx={24} cy={24} r1={13} r2={18} />
        </>
      )}
      {kind === 'moon' && <path d={MOON} transform="translate(-2 2)" />}
      {kind === 'partly-day' && (
        <>
          <circle cx="17" cy="17" r="6" />
          <Rays cx={17} cy={17} r1={10} r2={13} />
          <path d={CLOUD} transform="translate(3 4)" className="wx-fill" />
        </>
      )}
      {kind === 'partly-night' && (
        <>
          <path d={MOON} transform="translate(-9 -7) scale(.7)" />
          <path d={CLOUD} transform="translate(3 4)" className="wx-fill" />
        </>
      )}
      {kind === 'cloud' && <path d={CLOUD} transform="translate(0 2)" />}
      {kind === 'fog' && (
        <>
          <path d="M15 28a7 7 0 0 1-.6-12A9.5 9.5 0 0 1 32.7 14.4 8 8 0 0 1 33 28" />
          <path d="M10 34h28M14 40h20" />
        </>
      )}
      {kind === 'rain' && (
        <>
          <path d={CLOUD} transform="translate(0 -3)" />
          <path d="M17 36l-2 6M25 36l-2 6M33 36l-2 6" />
        </>
      )}
      {kind === 'snow' && (
        <>
          <path d={CLOUD} transform="translate(0 -3)" />
          <path d="M17 38v.01M25 41v.01M33 38v.01M21 44v.01M29 37v.01" strokeWidth="3.5" />
        </>
      )}
      {kind === 'storm' && (
        <>
          <path d={CLOUD} transform="translate(0 -4)" />
          <path d="M26 29l-6 8h6l-3 7" />
        </>
      )}
    </svg>
  )
}
