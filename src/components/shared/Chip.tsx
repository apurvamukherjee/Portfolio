import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ChipProps {
  children: ReactNode
  variant?: 'tech' | 'accent' | 'outline'
  dot?: boolean
  className?: string
}

/** Generic pill — used for skill/tech tags, status badges ("● Ongoing"), and role pills. */
export function Chip({ children, variant = 'tech', dot = false, className = '' }: ChipProps) {
  const variants: Record<NonNullable<ChipProps['variant']>, string> = {
    tech: 'border border-border text-muted',
    accent: 'bg-gradient-to-r from-accent to-accent-deep text-white',
    outline: 'border border-border text-muted rounded-full',
  }

  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {dot && <span className="animate-pulse-dot h-2 w-2 rounded-full bg-white" aria-hidden />}
      {children}
    </motion.span>
  )
}
