const COL = 64
const H = 110
const PAD = 18

export default function HourlyChart({ values }) {
  const w = values.length * COL
  const valid = values.filter((v) => v !== null && v !== undefined)
  if (valid.length < 2) return null
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  const span = Math.max(max - min, 1)
  const pts = values.map((v, i) => [i * COL + COL / 2, H - PAD - (((v ?? min) - min) / span) * (H - PAD * 2)])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0]} ${H} L${pts[0][0]} ${H} Z`

  return (
    <svg className="hourly-chart" viewBox={`0 0 ${w} ${H}`} width={w} height={H} aria-hidden="true">
      <path d={area} className="chart-area" />
      <path d={line} className="chart-line" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" className="chart-dot" />
      ))}
    </svg>
  )
}
