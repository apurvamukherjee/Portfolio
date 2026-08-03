import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useFinePointer } from '../../hooks/useFinePointer'

const RING_SIZE = 208

interface Ripple {
  id: number
  x: number
  y: number
}

let rippleId = 0

/**
 * Cursor-following glow: a bright core plus two laggier "ember trail" rings behind it for a
 * comet-tail feel (three radial-gradients layered in one background, each fed by a spring with
 * progressively less stiffness so they visibly drag behind fast mouse moves), a slowly rotating
 * conic energy ring riding along with the cursor, and a shockwave ripple burst on click. Every
 * piece is motion-value/CSS-animation driven so none of it triggers a React re-render on
 * mousemove — only clicks (for ripples) touch state, and those are infrequent.
 */
export function CursorSpotlight() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = fine && !reduced
  const [ripples, setRipples] = useState<Ripple[]>([])

  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const trailX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 })
  const trailY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 })
  const tailX = useSpring(x, { stiffness: 45, damping: 20, mass: 0.9 })
  const tailY = useSpring(y, { stiffness: 45, damping: 20, mass: 0.9 })

  const background = useMotionTemplate`radial-gradient(200px circle at ${x}px ${y}px, color-mix(in srgb, var(--color-accent) 32%, transparent), transparent 65%), radial-gradient(340px circle at ${trailX}px ${trailY}px, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 68%), radial-gradient(520px circle at ${tailX}px ${tailY}px, color-mix(in srgb, var(--color-accent-deep) 40%, transparent), transparent 70%)`
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
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-30" style={{ background }} />

      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 h-52 w-52" style={{ x: ringX, y: ringY }}>
        <div
          className="h-full w-full animate-spin rounded-full opacity-50 [animation-duration:4s]"
          style={{ backgroundImage: 'conic-gradient(from 0deg, transparent, color-mix(in srgb, var(--color-accent) 65%, transparent), transparent 40%)' }}
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
