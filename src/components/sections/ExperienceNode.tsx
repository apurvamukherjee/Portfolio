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
      {/* Checkpoint: a hollow ring until the line arrives, then red fills it from the centre.
          Everything below animates transform/opacity only, so it stays on the compositor. */}
      <motion.span
        data-timeline-dot
        data-reached={reached}
        initial={false}
        animate={{ scale: reached ? 1 : 0.86 }}
        transition={{ type: 'spring', stiffness: 520, damping: 16 }}
        className="relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface ring-4 ring-surface-raised"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-accent blur-md"
          initial={false}
          animate={{ opacity: reached ? 0.45 : 0 }}
          transition={{ duration: 0.45 }}
        />
        <span aria-hidden className="absolute inset-0 rounded-full border-2 border-border" />
        <motion.span
          aria-hidden
          data-timeline-fill
          className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-accent-deep"
          initial={false}
          animate={{ scale: reached ? 1 : 0, opacity: reached ? 1 : 0 }}
          // Springs in for the pop; empties with a plain tween so it never overshoots past zero.
          transition={
            reached
              ? { scale: { type: 'spring', stiffness: 380, damping: 22 }, opacity: { duration: 0.2 } }
              : { duration: 0.25, ease: 'easeIn' }
          }
        />
        {!reduced &&
          reached &&
          [0, 0.18].map((delay) => (
            <motion.span
              key={delay}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 2.3, opacity: 0 }}
              transition={{ duration: 0.9, delay, ease: 'easeOut' }}
            />
          ))}
        <Icon size={20} className={`relative transition-colors duration-300 ${reached ? 'text-white' : 'text-muted'}`} />
      </motion.span>

      <GradientSweepCard tilt={false} className="flex-1 rounded-lg p-5">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent)_45%,transparent),inset_0_0_28px_-10px_var(--color-accent)]"
          initial={false}
          animate={{ opacity: reached ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
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
