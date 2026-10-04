// Fixed atmospheric background. The gradient colors come from CSS variables set by the
// data-theme attribute, so they can transition smoothly between conditions.
export default function Sky({ theme }) {
  return (
    <div className="sky" data-theme={theme} aria-hidden="true">
      <div className="sky-glow sky-glow-a" />
      <div className="sky-glow sky-glow-b" />
      <div className="sky-horizon" />
    </div>
  )
}
