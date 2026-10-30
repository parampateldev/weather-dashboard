export default function StarButton({ starred, name, onToggle, size = 18 }) {
  return (
    <button
      type="button"
      className={starred ? 'star is-on' : 'star'}
      aria-pressed={starred}
      aria-label={starred ? `Remove ${name} from starred` : `Star ${name}`}
      title={starred ? 'Starred' : 'Star this place'}
      onClick={onToggle}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z" />
      </svg>
    </button>
  )
}
