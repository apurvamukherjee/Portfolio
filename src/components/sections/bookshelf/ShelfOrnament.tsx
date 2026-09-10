import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type Transition } from 'framer-motion'
import type { IconType } from 'react-icons'
import {
  GiBubblingFlask,
  GiCactusPot,
  GiCat,
  GiCoffeeCup,
  GiDeskLamp,
  GiDna1,
  GiJoystick,
  GiMicroscope,
  GiNotebook,
  GiOwl,
  GiPerspectiveDiceSixFacesRandom,
  GiRobotGolem,
} from 'react-icons/gi'
import type { ShelfCategory } from '../../../data/projects'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

type IdleKind = 'bob' | 'sway' | 'pulse' | 'glow' | 'spin'

interface Ornament {
  Icon: IconType
  label: string
  quip: string
  idle: IdleKind
}

/** Purely decorative knick-knacks standing at the end of each shelf — poke one for a one-line quip. */
const ORNAMENTS: Record<ShelfCategory, Ornament[]> = {
  games: [
    { Icon: GiRobotGolem, label: 'a little figure standing watch', quip: 'beep. all servers nominal.', idle: 'bob' },
    { Icon: GiPerspectiveDiceSixFacesRandom, label: 'a lucky die', quip: "rolled a 1. rent's due anyway.", idle: 'sway' },
    { Icon: GiJoystick, label: 'an old joystick', quip: 'insert coin to continue.', idle: 'sway' },
  ],
  apps: [
    { Icon: GiCactusPot, label: 'a small desk plant', quip: "low-maintenance, like this app's backend.", idle: 'sway' },
    { Icon: GiDeskLamp, label: 'a desk lamp', quip: 'burning the midnight build.', idle: 'glow' },
    { Icon: GiNotebook, label: 'a notebook', quip: 'todo: ship it. (checked.)', idle: 'bob' },
  ],
  native: [
    { Icon: GiCoffeeCup, label: 'a coffee mug', quip: "still warm. don't tell React Native.", idle: 'pulse' },
    { Icon: GiOwl, label: 'a small owl', quip: 'up since the last hot reload.', idle: 'sway' },
    { Icon: GiCat, label: 'a desk cat', quip: 'walked across the keyboard. twice.', idle: 'bob' },
  ],
  exp: [
    { Icon: GiBubblingFlask, label: 'a bubbling flask', quip: 'do not shake. (already shaken.)', idle: 'pulse' },
    { Icon: GiMicroscope, label: 'a microscope', quip: 'peer review: pending.', idle: 'bob' },
    { Icon: GiDna1, label: 'a spinning model', quip: '99% caffeine, 1% code.', idle: 'spin' },
  ],
}

function idlePreset(kind: IdleKind): { animate: Record<string, (number | string)[] | number>; transition: Transition } {
  switch (kind) {
    case 'bob':
      return { animate: { y: [0, -4, 0] }, transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }
    case 'sway':
      return { animate: { rotate: [-6, 6, -6] }, transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } }
    case 'pulse':
      return { animate: { scale: [1, 1.08, 1] }, transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
    case 'glow':
      return {
        animate: {
          filter: [
            'drop-shadow(0 0 0px rgba(255,255,255,0))',
            'drop-shadow(0 0 6px rgba(255,255,255,0.85))',
            'drop-shadow(0 0 0px rgba(255,255,255,0))',
          ],
        },
        transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
      }
    case 'spin':
      return { animate: { rotate: 360 }, transition: { duration: 6, repeat: Infinity, ease: 'linear' } }
  }
}

interface ShelfOrnamentsProps {
  category: ShelfCategory
}

/** Renders the small cluster of knick-knacks for one shelf's category. */
export function ShelfOrnaments({ category }: ShelfOrnamentsProps) {
  return (
    <>
      {ORNAMENTS[category].map((ornament) => (
        <OrnamentPiece key={ornament.label} ornament={ornament} />
      ))}
    </>
  )
}

function OrnamentPiece({ ornament }: { ornament: Ornament }) {
  const { Icon, label, quip, idle } = ornament
  const reduced = useReducedMotion()
  const [poked, setPoked] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const preset = idlePreset(idle)

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
        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink/50 transition-colors [-webkit-tap-highlight-color:transparent] hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        animate={reduced ? undefined : preset.animate}
        transition={reduced ? undefined : preset.transition}
        whileHover={reduced ? undefined : { scale: 1.18 }}
        whileTap={reduced ? undefined : { scale: 0.9 }}
      >
        <Icon size={26} aria-hidden className={poked && !reduced ? 'animate-jello' : ''} />
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
