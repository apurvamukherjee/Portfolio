import { motion, useReducedMotion } from 'framer-motion'
import type { ExperienceRole } from '../../data/experience'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'

interface ExperienceNodeProps extends ExperienceRole {
  /** True once the timeline's progress line has reached this role's dot. */
  reached: boolean
}

export function ExperienceNode({ role, icon: Icon, time, status, points, tech, reached }: ExperienceNodeProps) {
  const reduced = useReducedMotion()

  return (
    <div className="relative flex gap-5">
      <motion.span
        data-timeline-dot
        initial={false}
        animate={reached ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.45 }}
        // Only scale gets the bouncy spring: an underdamped opacity would visibly flicker around 1.
        transition={{ scale: { type: 'spring', stiffness: 520, damping: 16 }, opacity: { duration: 0.25 } }}
        className="relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-deep text-white ring-4 ring-surface-raised"
      >
        {!reduced && reached && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        )}
        <Icon size={20} />
      </motion.span>

      <GradientSweepCard tilt={false} className="flex-1 rounded-lg p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-lg font-bold text-ink">{role}</p>
          <Chip variant={status === 'Current' ? 'accent' : 'tech'} dot={status === 'Current'}>
            {status}
          </Chip>
          <span className="ml-auto text-sm text-muted">{time}</span>
        </div>

        <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
          {points.map((point) => (
            <li key={point} className="flex gap-2.5">
              <span aria-hidden className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <Chip key={t}>
              {t}
            </Chip>
          ))}
        </div>
      </GradientSweepCard>
    </div>
  )
}
