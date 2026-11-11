import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { useFinePointer } from '../../hooks/useFinePointer'
import { iosSpring } from '../../lib/motion'

const GLOW_RADIUS = 200
const GLOW =
  'radial-gradient(circle 200px at center, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 65%)'

interface Ripple {
  id: number
  x: number
  y: number
}

let rippleId = 0

/**
 * One soft glow under the cursor, a ripple on click, and a small label naming what the thing
 * under the pointer does. Anything with `data-cursor="open"` (or any other verb) gets the label,
 * which is how a visitor learns what is interactive without trying everything.
 *
 * The glow is a fixed-size div moved by transform only, so mousemove never repaints the viewport
 * or re-renders React; state changes only on click and when the label under the pointer changes.
 */
export function CursorSpotlight() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = fine && !reduced
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [label, setLabel] = useState<string | null>(null)

  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const glowX = useTransform(x, (v) => v - GLOW_RADIUS)
  const glowY = useTransform(y, (v) => v - GLOW_RADIUS)

  useEffect(() => {
    if (!active) return
    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const handleOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      setLabel(target?.getAttribute('data-cursor') ?? null)
    }
    const handleDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const id = rippleId++
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
      window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700)
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerover', handleOver, { passive: true })
    window.addEventListener('pointerdown', handleDown, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerover', handleOver)
      window.removeEventListener('pointerdown', handleDown)
    }
  }, [active, x, y])

  if (!active) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 rounded-full will-change-transform"
        style={{ width: GLOW_RADIUS * 2, height: GLOW_RADIUS * 2, background: GLOW, x: glowX, y: glowY }}
      />

      {/* Above every overlay (palette and terminal sit at z-100) so labels work inside them too. */}
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[110]" style={{ x, y }}>
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={iosSpring}
              className="absolute left-4 top-4 origin-top-left whitespace-nowrap rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-card"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            aria-hidden
            initial={{ opacity: 0.6, scale: 0 }}
            animate={{ opacity: 0, scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="pointer-events-none fixed z-30 h-10 w-10 rounded-full border-2 border-accent"
            style={{ left: ripple.x - 20, top: ripple.y - 20 }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
