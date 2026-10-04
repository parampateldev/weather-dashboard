import { useEffect, useId, useRef, useState } from 'react'
import { usePlaceSuggestions } from '../hooks/usePlaceSuggestions'

export default function SearchBox({ busy, locating, history, onPickPlace, onSubmitText, onLocate }) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const wrapRef = useRef(null)
  const listId = useId()

  const suggestions = usePlaceSuggestions(text, open)
  const showHistory = text.trim().length < 2
  const options = showHistory ? history : suggestions

  useEffect(() => {
    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function choose(place) {
    setText(place.name)
    setOpen(false)
    setActive(-1)
    onPickPlace(place)
  }

  function submit(e) {
    e.preventDefault()
    if (active >= 0 && options[active]) return choose(options[active])
    if (text.trim()) {
      setOpen(false)
      onSubmitText(text.trim())
    }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    }
  }

  const listVisible = open && options.length > 0

  return (
    <div className="search" ref={wrapRef}>
      <form onSubmit={submit} role="search">
        <label className="search-label" htmlFor="place-input">
          Find a place
        </label>
        <div className="search-row">
          <input
            id="place-input"
            className="search-input"
            type="text"
            autoComplete="off"
            spellCheck="false"
            placeholder="Detroit, Lisbon, Nairobi..."
            value={text}
            role="combobox"
            aria-expanded={listVisible}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            onChange={(e) => {
              setText(e.target.value)
              setOpen(true)
              setActive(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
          <button className="btn btn-solid" type="submit" disabled={busy}>
            {busy && !locating ? 'Loading' : 'Search'}
          </button>
        </div>

        {listVisible && (
          <ul className="suggestions" id={listId} role="listbox">
            <li className="suggestions-title" role="presentation">
              {showHistory ? 'Recent' : 'Matches'}
            </li>
            {options.map((place, i) => (
              <li
                key={`${place.name}-${place.latitude}-${place.longitude}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={i === active ? 'is-active' : undefined}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(place)
                }}
              >
                {place.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <button className="btn btn-ghost locate" type="button" onClick={onLocate} disabled={busy}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
        {locating ? 'Finding you...' : 'Use my location'}
      </button>
    </div>
  )
}
