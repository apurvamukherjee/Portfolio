import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useMagnetic } from '../../hooks/useMagnetic'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface NeuButtonProps {
  href: string
  children: ReactNode
  className?: string
}

/** Neubrutalist offset-shadow button (the "Let's Talk!" hero CTA) with a subtle magnetic hover pull. */
export function NeuButton({ href, children, className = '' }: NeuButtonProps) {
  const reduced = useReducedMotion()
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLAnchorElement>(0.2)

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={reduced ? undefined : onMouseMove}
      onMouseLeave={reduced ? undefined : onMouseLeave}
      style={reduced ? undefined : { x, y }}
      whileTap={{ x: 6, y: 6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`group relative inline-flex ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md bg-gradient-to-br from-accent to-black transition-transform duration-150 group-hover:translate-x-2 group-hover:translate-y-2 group-active:translate-x-0 group-active:translate-y-0"
      />
      <span className="relative rounded-md bg-ink px-7 py-3 text-sm font-bold tracking-wide text-surface">
        {children}
      </span>
    </motion.a>
  )
}
