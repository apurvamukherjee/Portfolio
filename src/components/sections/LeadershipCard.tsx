import type { LeadershipEvent } from '../../data/leadership'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'

export function LeadershipCard({ icon: Icon, rolePill, title, org, description }: LeadershipEvent) {
  return (
    <GradientSweepCard className="flex h-full flex-col gap-3 rounded-lg p-6">
      <div className="flex items-center justify-between gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-deep text-white"
        >
          <Icon size={20} />
        </span>
        <Chip variant="outline">{rolePill}</Chip>
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="text-sm font-medium text-muted">{org}</p>
      <p className="text-sm text-muted">{description}</p>
    </GradientSweepCard>
  )
}
