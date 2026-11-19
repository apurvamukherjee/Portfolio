import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { HeroShell } from './HeroShell'
import { iosSpring, iosSpringSoft, pointerSpring } from '../../lib/motion'

/** What the traffic lights have done to the window. */
type Mode = 'normal' | 'closed' | 'minimized' | 'maximized'

const TITLE: Record<Mode, string> = {
  normal: 'apurva — zsh',
  closed: '[process completed]',
  minimized: 'apurva — zsh — click to restore',
  maximized: 'apurva — zsh — 120×40',
}

const LIGHTS = [
  { mode: 'closed', label: 'Close window', bg: 'bg-[#ff5f57]', glyph: '×' },
  { mode: 'minimized', label: 'Minimize window', bg: 'bg-[#febc2e]', glyph: '−' },
  { mode: 'maximized', label: 'Maximize window', bg: 'bg-[#28c840]', glyph: '+' },
] as const

// A closed terminal would leave the hero empty, so the session restarts itself.
const REOPEN_MS = 1700
const MAX_TILT_X = 9
const MAX_TILT_Y = 11

/**
 * The hero's terminal window. It tilts toward the cursor, its edge lights up where the pointer
 * is, and the traffic lights do what they say: red ends the session (it restarts), yellow folds
 * the window down to its title bar, green gives the screen more rows.
 */
export function HeroIllustration() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [MAX_TILT_X, -MAX_TILT_X]), pointerSpring)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-MAX_TILT_Y, MAX_TILT_Y]), pointerSpring)

  // Layers inside the window read --dx/--dy (-1..1) to shift as if they sat in front of the glass.
  // Written straight to the element so the parallax costs no React render.
  useMotionValueEvent(rotateY, 'change', (v) => windowRef.current?.style.setProperty('--dx', (v / MAX_TILT_Y).toFixed(3)))
  useMotionValueEvent(rotateX, 'change', (v) => windowRef.current?.style.setProperty('--dy', (-v / MAX_TILT_X).toFixed(3)))

  // Grab the title bar and toss the window; it swings with the throw and springs home.
  const drag = useDragControls()
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const swing = useSpring(useTransform(useVelocity(dragX), [-2500, 2500], [-10, 10]), pointerSpring)

  const [mode, setMode] = useState<Mode>('normal')
  // Bumped on every reopen so the shell remounts and boots from whoami again.
  const [session, setSession] = useState(0)

  useEffect(() => {
    if (mode !== 'closed') return
    const timer = setTimeout(() => {
      setSession((n) => n + 1)
      setMode('normal')
    }, REOPEN_MS)
    return () => clearTimeout(timer)
  }, [mode])

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!ref.current || !windowRef.current || e.pointerType === 'touch') return
    const win = windowRef.current.getBoundingClientRect()
    windowRef.current.style.setProperty('--mx', `${e.clientX - win.left}px`)
    windowRef.current.style.setProperty('--my', `${e.clientY - win.top}px`)
    if (reduced) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  const toggle = (next: Mode) => setMode((m) => (m === next ? 'normal' : next))
  const closed = mode === 'closed'

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-xl"
      style={{ perspective: 1400 }}
    >
      <motion.div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/20 blur-[90px]"
        animate={{ opacity: closed ? 0.25 : 1, scale: mode === 'maximized' ? 1.08 : 1 }}
        transition={iosSpringSoft}
      />

      <AnimatePresence>
        {closed && (
          <motion.p
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted"
          >
            session ended — restarting
            <span aria-hidden className="animate-pulse-dot">
              …
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        ref={windowRef}
        style={reduced ? undefined : { rotateX, rotateY, rotateZ: swing, x: dragX, y: dragY }}
        drag={!reduced}
        dragListener={false}
        dragControls={drag}
        dragSnapToOrigin
        dragElastic={0.35}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
        whileDrag={{ scale: 1.03 }}
        // Stays in the layout while closed, so the hero does not jump when it comes back.
        animate={closed ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
        transition={reduced ? { duration: 0.15 } : iosSpring}
        inert={closed}
        className="hero-window relative overflow-hidden rounded-2xl bg-[#0d0d12] ring-1 ring-black/40"
      >
        <div
          data-cursor={reduced ? undefined : 'drag'}
          onPointerDown={(e) => {
            if (!reduced && !(e.target as HTMLElement).closest('button:not([tabindex="-1"])')) drag.start(e)
          }}
          className={`relative flex h-11 touch-none select-none items-center border-b border-white/[0.06] bg-white/[0.03] px-4 ${reduced ? '' : 'cursor-grab active:cursor-grabbing'}`}
        >
          <div className="group/lights relative z-[1] flex items-center gap-2">
            {LIGHTS.map(({ mode: target, label, bg, glyph }) => (
              <button
                key={target}
                type="button"
                aria-label={label}
                aria-pressed={mode === target}
                onClick={() => toggle(target)}
                className={`flex h-3 w-3 items-center justify-center rounded-full ${bg} text-[9px] font-bold leading-none text-black/60 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/70 active:scale-90`}
              >
                <span aria-hidden className="opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100">
                  {glyph}
                </span>
              </button>
            ))}
          </div>

          {/* The whole bar restores a minimised window, the way a dock tile would. */}
          <button
            type="button"
            tabIndex={mode === 'minimized' ? 0 : -1}
            aria-label="Restore window"
            onClick={() => setMode('normal')}
            className={`absolute inset-0 ${mode === 'minimized' ? 'cursor-pointer' : 'pointer-events-none'}`}
          />

          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-24">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mode}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="truncate font-mono text-xs text-white/40"
              >
                {TITLE[mode]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: mode === 'minimized' ? 0 : 'auto', opacity: mode === 'minimized' ? 0 : 1 }}
          transition={reduced ? { duration: 0.15 } : iosSpringSoft}
          inert={mode === 'minimized'}
          className="overflow-hidden"
        >
          <HeroShell key={session} tall={mode === 'maximized'} />
        </motion.div>

        <span aria-hidden className="hero-window-glare" />
        <span aria-hidden className="hero-window-edge" />
      </motion.div>
    </div>
  )
}
