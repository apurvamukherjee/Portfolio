import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { iosSpring } from '../../lib/motion'

interface ChipProps {
  children: ReactNode
  variant?: 'tech' | 'accent'
  dot?: boolean
  className?: string
  /** Makes the chip a button. Used by tech tags that filter the Projects section. */
  onClick?: () => void
  /** For a clickable chip that is a toggle. */
  pressed?: boolean
}

const VARIANTS: Record<NonNullable<ChipProps['variant']>, string> = {
  tech: 'border border-border text-muted',
  accent: 'bg-gradient-to-r from-accent to-accent-deep text-white',
}

/** Generic pill — used for skill/tech tags, status badges ("● Ongoing"), and role pills. */
export function Chip({ children, variant = 'tech', dot = false, className = '', onClick, pressed }: ChipProps) {
  const classes = `inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold ${VARIANTS[variant]} ${className}`
  const content = (
    <>
      {dot && <span className="animate-pulse-dot h-2 w-2 rounded-full bg-white" aria-hidden />}
      {children}
    </>
  )

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-pressed={pressed}
        data-cursor="filter"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        transition={iosSpring}
        className={`${classes} cursor-pointer transition-colors hover:border-accent/60 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${pressed ? 'border-accent text-accent' : ''}`}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <motion.span whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={iosSpring} className={classes}>
      {content}
    </motion.span>
  )
}
