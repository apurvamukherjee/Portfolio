import type { ExperienceRole } from '../../data/experience'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'

export function ExperienceNode({ role, icon: Icon, time, status, points, tech }: ExperienceRole) {
  return (
    <div className="relative flex gap-5">
      <span className="relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-deep text-white ring-4 ring-surface-raised">
        <Icon size={20} />
      </span>

      <GradientSweepCard tilt={false} className="flex-1 rounded-lg p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-lg font-bold text-ink">{role}</p>
          <Chip variant={status === 'Current' ? 'accent' : 'outline'} dot={status === 'Current'}>
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
            <Chip key={t} variant="tech">
              {t}
            </Chip>
          ))}
        </div>
      </GradientSweepCard>
    </div>
  )
}
