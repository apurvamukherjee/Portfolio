import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { HeroShell } from './HeroShell'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type TargetAndTransition, useReducedMotion } from 'framer-motion'
type Wobble = 'none' | 'close' | 'minimize' | 'maximize'

const WOBBLE_LABEL: Record<Exclude<Wobble, 'none'>, string> = {
  close: 'nice try — not closing that easily',
  minimize: 'staying right here',
  maximize: 'already living my best life',
}

const LIGHTS = [
  { kind: 'close', label: 'Close window', bg: 'bg-[#ff5f57]', glyph: '×' },
  { kind: 'minimize', label: 'Minimize window', bg: 'bg-[#febc2e]', glyph: '−' },
  { kind: 'maximize', label: 'Maximize window', bg: 'bg-[#28c840]', glyph: '+' },
] as const

const WOBBLE_ANIMATION: Record<Wobble, TargetAndTransition> = {
  none: { scale: 1, rotate: 0 },
  close: { rotate: [0, -2, 2, -1.5, 1.5, 0], transition: { duration: 0.5 } },
  minimize: { scale: [1, 0.94, 1], transition: { duration: 0.5 } },
  maximize: { scale: [1, 1.03, 1], transition: { duration: 0.5 } },
}

/**
 * The hero's terminal window: a clean macOS-style card with a gentle cursor-parallax tilt. The
 * traffic lights reveal their glyphs on hover (like the real thing) and answer back when clicked.
 */
export function HeroIllustration() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 150, damping: 20 })

  const [wobble, setWobble] = useState<Wobble>('none')

  useEffect(() => {
    if (wobble === 'none') return
    const timer = setTimeout(() => setWobble('none'), 1600)
    return () => clearTimeout(timer)
  }, [wobble])

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current || e.pointerType === 'touch') return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-xl"
      style={{ perspective: 1400 }}
    >
      <div aria-hidden className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/20 blur-[90px]" />

      <motion.div
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={WOBBLE_ANIMATION[wobble]}
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-black/40"
      >
        <div className="relative flex h-11 items-center border-b border-white/[0.06] bg-white/[0.03] px-4">
          <div className="group/lights flex items-center gap-2">
            {LIGHTS.map(({ kind, label, bg, glyph }) => (
              <button
                key={kind}
                type="button"
                aria-label={label}
                onClick={() => setWobble(kind)}
                className={`flex h-3 w-3 items-center justify-center rounded-full ${bg} text-[9px] font-bold leading-none text-black/60 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-white/70 active:scale-90`}
              >
                <span aria-hidden className="opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100">
                  {glyph}
                </span>
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-24">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={wobble}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                role={wobble === 'none' ? undefined : 'status'}
                className={`truncate font-mono text-xs ${wobble === 'none' ? 'text-white/40' : 'text-white/70'}`}
              >
                {wobble === 'none' ? 'apurva — zsh' : WOBBLE_LABEL[wobble]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <HeroShell />
      </motion.div>
    </div>
  )
}
