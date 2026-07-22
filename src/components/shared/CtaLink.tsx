import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useMagnetic } from '../../hooks/useMagnetic'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface CtaLinkProps {
  href: string
  children: ReactNode
  className?: string
}

/** Solid accent pill link with a sliding arrow — "Live view", etc. Always visible, no hover-reveal gimmick. */
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
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-deep px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(255,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_6px_20px_rgba(255,0,0,0.5)] ${className}`}
    >
      <span>{children}</span>
      <svg
        viewBox="0 0 13 10"
        className="h-2.5 w-4 stroke-white stroke-2 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
      >
        <path d="M1,5 L11,5" strokeLinecap="round" />
        <polyline points="8 1 12 5 8 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
  )
}
