import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useFinePointer } from '../../hooks/useFinePointer'

/** Soft radial glow that follows the cursor site-wide — motion-value driven so it never triggers a React re-render per mousemove. */
export function CursorSpotlight() {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = fine && !reduced

  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const background = useMotionTemplate`radial-gradient(650px circle at ${x}px ${y}px, rgba(255,40,40,0.06), transparent 70%)`

  useEffect(() => {
    if (!active) return
    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [active, x, y])

  if (!active) return null

  return <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-30" style={{ background }} />
}
