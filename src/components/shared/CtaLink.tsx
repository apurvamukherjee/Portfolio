import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useMagnetic } from '../../hooks/useMagnetic'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface CtaLinkProps {
  href: string
  children: ReactNode
  className?: string
}

/** Circular glow arrow-link — "Visit Company", "Live view". */
export function CtaLink({ href, children, className = '' }: CtaLinkProps) {
  const reduced = useReducedMotion()
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLAnchorElement>(0.15)

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={reduced ? undefined : onMouseMove}
      onMouseLeave={reduced ? undefined : onMouseLeave}
      style={reduced ? undefined : { x, y }}
      whileTap={{ scale: 0.95 }}
      className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold text-accent transition-colors duration-300 hover:text-white ${className}`}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 -z-10 h-full w-11 rounded-full bg-border transition-all duration-300 ease-out group-hover:w-full group-hover:bg-accent"
      />
      <span className="relative">{children}</span>
      <svg
        viewBox="0 0 13 10"
        className="relative h-2.5 w-4 -translate-x-1 stroke-accent stroke-2 transition-all duration-300 group-hover:translate-x-0 group-hover:stroke-white"
        fill="none"
      >
        <path d="M1,5 L11,5" strokeLinecap="round" />
        <polyline points="8 1 12 5 8 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
  )
}
