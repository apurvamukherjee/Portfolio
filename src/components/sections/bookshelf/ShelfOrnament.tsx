import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GiBubblingFlask, GiCactusPot, GiCoffeeCup, GiRobotGolem } from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { ShelfCategory } from '../../../data/projects'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

interface Ornament {
  Icon: IconType
  label: string
  quip: string
}

/** Purely decorative knick-knacks standing at the end of each shelf — poke one for a one-line quip. */
const ORNAMENTS: Record<ShelfCategory, Ornament> = {
  games: { Icon: GiRobotGolem, label: 'a little figure standing watch', quip: 'beep. all servers nominal.' },
  apps: { Icon: GiCactusPot, label: 'a small desk plant', quip: "low-maintenance, like this app's backend." },
  native: { Icon: GiCoffeeCup, label: 'a coffee mug', quip: "still warm. don't tell React Native." },
  exp: { Icon: GiBubblingFlask, label: 'a bubbling flask', quip: 'do not shake. (already shaken.)' },
}

interface ShelfOrnamentProps {
  category: ShelfCategory
}

export function ShelfOrnament({ category }: ShelfOrnamentProps) {
  const { Icon, label, quip } = ORNAMENTS[category]
  const reduced = useReducedMotion()
  const [poked, setPoked] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  function poke() {
    setPoked(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setPoked(false), 1600)
  }

  return (
    <div className="relative flex-none">
      <motion.button
        type="button"
        onClick={poke}
        aria-label={`Poke ${label}`}
        className="flex h-12 w-12 items-center justify-center rounded-lg text-ink/50 transition-colors [-webkit-tap-highlight-color:transparent] hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        whileHover={reduced ? undefined : { scale: 1.1, rotate: -4 }}
        whileTap={reduced ? undefined : { scale: 0.92 }}
      >
        <Icon size={30} aria-hidden className={poked && !reduced ? 'animate-jello' : ''} />
      </motion.button>

      <AnimatePresence>
        {poked && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 w-max max-w-[9.5rem] rounded-lg border border-border bg-surface px-3 py-2 text-[0.7rem] leading-snug text-muted shadow-card"
          >
            {quip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
