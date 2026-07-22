import { useRef, type MouseEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface GradientSweepCardProps {
  children: ReactNode
  className?: string
  /** Disable the mouse-tracked 3D tilt — use on very large/full-width cards where it feels off. */
  tilt?: boolean
}

/**
 * Shared "gradient bar sweeps to full width on hover, card lifts + tilts toward the cursor" motif —
 * previously copy-pasted per section as ::before/::after CSS in the legacy site
 * (skill chips, project cards, experience nodes, leadership event cards).
 */
export function GradientSweepCard({ children, className = '', tilt = true }: GradientSweepCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const active = tilt && !reduced

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 22 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 22 })

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!active || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={active ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`group relative overflow-hidden bg-surface-raised shadow-card ${className}`}
    >
      <span
        aria-hidden
        className="animate-gradient-shift absolute left-0 top-0 h-0.5 w-[30%] bg-[length:300%_300%] transition-[width] duration-500 group-hover:w-full"
        style={{ backgroundImage: 'linear-gradient(-45deg, #000, var(--color-accent), #000, var(--color-accent))' }}
      />
      {children}
    </motion.div>
  )
}
