import { useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** The bitmoji avatar — subtle infinite headshake, plus a "Hey! I'm Apurva" popup on click/tap/Enter. */
export function Logo() {
  const [playCount, setPlayCount] = useState(0)
  const [showHey, setShowHey] = useState(false)
  const reduced = useReducedMotion()

  const play = () => {
    setPlayCount((c) => c + 1)
    setShowHey(true)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Apurva logo — click to say hey"
      onClick={play}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          play()
        }
      }}
      className="relative flex h-12 w-12 cursor-pointer items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-14 md:w-14"
    >
      {showHey && (
        <span
          key={playCount}
          onAnimationEnd={() => setShowHey(false)}
          className="animate-pop-up pointer-events-none absolute -top-3 left-14 z-10 whitespace-nowrap rounded-full bg-surface px-3 py-1 font-mono text-sm text-accent shadow-card"
        >
          Hey! I'm Apurva
        </span>
      )}
      <img
        src="/assets/img/bitmojee-removebg-preview.png"
        alt="Apurva animated avatar"
        className={`h-full w-full origin-bottom object-contain ${reduced ? '' : 'animate-headshake'}`}
      />
    </div>
  )
}
