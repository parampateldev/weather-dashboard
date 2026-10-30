import { useEffect, useRef } from 'react'
import StarButton from './StarButton'
import '../styles/sidebar.css'

function PlaceRow({ place, active, onPick, onToggleStar, onRemove }) {
  return (
    <li className={active ? 'sb-item is-active' : 'sb-item'}>
      <button type="button" className="sb-pick" onClick={() => onPick(place)} aria-current={active ? 'true' : undefined}>
        {place.name}
      </button>
      <StarButton starred={place.starred} name={place.name} size={16} onToggle={() => onToggleStar(place.key)} />
      <button type="button" className="sb-remove" aria-label={`Forget ${place.name}`} title="Forget" onClick={() => onRemove(place.key)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
    </li>
  )
}

export default function Sidebar({ open, starred, recent, activeKey, onPick, onToggleStar, onRemove, onClearRecent, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const rowProps = { onPick, onToggleStar, onRemove }
  const empty = starred.length === 0 && recent.length === 0

  return (
    <>
      {open && <div className="sb-scrim" onMouseDown={onClose} aria-hidden="true" />}
      <aside className="sidebar" id="places-panel" data-open={open} aria-label="Saved places" ref={ref} inert={!open}>
        <div className="sb-head">
          <h2 className="sb-title">Places</h2>
          <button type="button" className="close sb-close" onClick={onClose} aria-label="Close places panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {empty && <p className="sb-empty">Places you look up show up here. Star the ones you check often to keep them at the top.</p>}

        {starred.length > 0 && (
          <section aria-labelledby="sb-starred">
            <h3 className="sb-label" id="sb-starred">
              Starred
            </h3>
            <ul>
              {starred.map((p) => (
                <PlaceRow key={p.key} place={p} active={p.key === activeKey} {...rowProps} />
              ))}
            </ul>
          </section>
        )}

        {recent.length > 0 && (
          <section aria-labelledby="sb-recent">
            <div className="sb-label-row">
              <h3 className="sb-label" id="sb-recent">
                Recent
              </h3>
              <button type="button" className="sb-clear" onClick={onClearRecent}>
                Clear
              </button>
            </div>
            <ul>
              {recent.map((p) => (
                <PlaceRow key={p.key} place={p} active={p.key === activeKey} {...rowProps} />
              ))}
            </ul>
          </section>
        )}

        <p className="sb-note">Saved in this browser only.</p>
      </aside>
    </>
  )
}
