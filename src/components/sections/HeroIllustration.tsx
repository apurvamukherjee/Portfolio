import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
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
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), pointerSpring)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), pointerSpring)

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
        style={reduced ? undefined : { rotateX, rotateY }}
        // Stays in the layout while closed, so the hero does not jump when it comes back.
        animate={closed ? { opacity: 0, scale: 0.9, y: 18 } : { opacity: 1, scale: 1, y: 0 }}
        transition={reduced ? { duration: 0.15 } : iosSpring}
        inert={closed}
        className="hero-window relative overflow-hidden rounded-2xl bg-[#0d0d12] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-black/40"
      >
        <div className="relative flex h-11 items-center border-b border-white/[0.06] bg-white/[0.03] px-4">
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
