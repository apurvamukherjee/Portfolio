import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useFinePointer } from '../../hooks/useFinePointer'

const RING_SIZE = 208

// Radius of each glow layer (matches the old inline radial-gradient's explicit circle radius).
const CORE_RADIUS = 200
const TRAIL_RADIUS = 340
const TAIL_RADIUS = 520

const CORE_GRADIENT =
  'radial-gradient(circle 200px at center, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 65%)'
const TRAIL_GRADIENT =
  'radial-gradient(circle 340px at center, color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 68%)'
const TAIL_GRADIENT =
  'radial-gradient(circle 520px at center, color-mix(in srgb, var(--color-accent-deep) 20%, transparent), transparent 70%)'

interface Ripple {
  id: number
  x: number
  y: number
}

let rippleId = 0

/**
 * Cursor-following glow: a subtle core plus two trailing "ember" rings behind it for a light
 * comet-tail feel, a slowly rotating conic energy ring riding along with the cursor, and a
 * shockwave ripple burst on click. Every glow layer is its own fixed-size div with a *static*
 * radial-gradient background, positioned purely via a `transform: translate` motion value —
 * animating transform is GPU-compositor-only, so this never triggers a full-viewport repaint
 * the way animating the `background` position itself would on every cursor move. None of it
 * triggers a React re-render on mousemove either — only clicks (for ripples) touch state.
 */
export function CursorSpotlight() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = fine && !reduced
  const [ripples, setRipples] = useState<Ripple[]>([])

  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const trailX = useSpring(x, { stiffness: 220, damping: 30, mass: 0.5 })
  const trailY = useSpring(y, { stiffness: 220, damping: 30, mass: 0.5 })
  const tailX = useSpring(x, { stiffness: 100, damping: 28, mass: 0.7 })
  const tailY = useSpring(y, { stiffness: 100, damping: 28, mass: 0.7 })

  const coreOffsetX = useTransform(x, (v) => v - CORE_RADIUS)
  const coreOffsetY = useTransform(y, (v) => v - CORE_RADIUS)
  const trailOffsetX = useTransform(trailX, (v) => v - TRAIL_RADIUS)
  const trailOffsetY = useTransform(trailY, (v) => v - TRAIL_RADIUS)
  const tailOffsetX = useTransform(tailX, (v) => v - TAIL_RADIUS)
  const tailOffsetY = useTransform(tailY, (v) => v - TAIL_RADIUS)
  const ringX = useTransform(x, (v) => v - RING_SIZE / 2)
  const ringY = useTransform(y, (v) => v - RING_SIZE / 2)

  useEffect(() => {
    if (!active) return
    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const handleDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const id = rippleId++
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
      window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700)
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerdown', handleDown, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
    }
  }, [active, x, y])

  if (!active) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 rounded-full will-change-transform"
        style={{
          width: TAIL_RADIUS * 2,
          height: TAIL_RADIUS * 2,
          background: TAIL_GRADIENT,
          x: tailOffsetX,
          y: tailOffsetY,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 rounded-full will-change-transform"
        style={{
          width: TRAIL_RADIUS * 2,
          height: TRAIL_RADIUS * 2,
          background: TRAIL_GRADIENT,
          x: trailOffsetX,
          y: trailOffsetY,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 rounded-full will-change-transform"
        style={{
          width: CORE_RADIUS * 2,
          height: CORE_RADIUS * 2,
          background: CORE_GRADIENT,
          x: coreOffsetX,
          y: coreOffsetY,
        }}
      />

      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 h-52 w-52" style={{ x: ringX, y: ringY }}>
        <div
          className="h-full w-full animate-jelly-flow opacity-30"
          style={{ backgroundImage: 'conic-gradient(from 0deg, transparent, color-mix(in srgb, var(--color-accent) 40%, transparent), transparent 40%)' }}
        />
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
