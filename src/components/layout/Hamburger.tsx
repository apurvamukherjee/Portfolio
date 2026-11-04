interface HamburgerProps {
  open: boolean
  controls?: string
  onClick: () => void
}

export function Hamburger({ open, controls, onClick }: HamburgerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls={controls}
      className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
    >
      <span
        className={`h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`}
      />
      <span className={`h-0.5 w-6 bg-ink transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
      <span
        className={`h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`}
      />
    </button>
  )
}
