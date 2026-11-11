import { motion, useReducedMotion } from 'framer-motion'
import type { LeadershipEvent } from '../../data/leadership'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'
import { iosSpring } from '../../lib/motion'

export function LeadershipCard({ icon: Icon, rolePill, seal, title, org, description }: LeadershipEvent) {
  const reduced = useReducedMotion()

  return (
    <GradientSweepCard className="flex h-full flex-col gap-3 rounded-lg p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-deep text-white"
        >
          <Icon size={20} />
        </span>

        {/* Hanko: comes down oversized and settles a few degrees off square, the way a hand stamps.
            Its own in-view trigger so it lands when the card is actually on screen. */}
        <motion.span
          aria-hidden
          initial={reduced ? false : { opacity: 0, scale: 2.2, rotate: -24 }}
          whileInView={{ opacity: 0.9, scale: 1, rotate: -8 }}
          viewport={{ once: true, margin: '0px 0px -18% 0px' }}
          transition={{ ...iosSpring, delay: 0.25 }}
          className="flex h-12 w-12 flex-none select-none items-center justify-center rounded-md border-2 border-accent text-2xl font-black leading-none text-accent shadow-[inset_0_0_0_2px_var(--color-surface),inset_0_0_0_3px_var(--color-accent)]"
        >
          {seal}
        </motion.span>
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Chip>{rolePill}</Chip>
        <p className="text-sm font-medium text-muted">{org}</p>
      </div>
      <p className="text-sm text-muted">{description}</p>
    </GradientSweepCard>
  )
}
