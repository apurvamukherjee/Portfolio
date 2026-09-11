import { useState } from 'react'
import { TbChevronRight } from 'react-icons/tb'
import type { ExperienceRole } from '../../data/experience'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'
import { Modal } from '../shared/Modal'

export function ExperienceNode({ role, icon: Icon, time, status, points, tech }: ExperienceRole) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <GradientSweepCard className="h-full flex-1 rounded-lg p-6">
        <div
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-label={`${role} — view details`}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen(true)
            }
          }}
          className="group flex cursor-pointer flex-col gap-4 outline-none"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-deep text-white">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-lg font-bold text-ink">{role}</p>
                <p className="text-sm text-muted">{time}</p>
              </div>
            </div>
            <TbChevronRight className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1" />
          </div>

          <Chip variant={status === 'Current' ? 'accent' : 'outline'} dot={status === 'Current'}>
            {status}
          </Chip>
        </div>
      </GradientSweepCard>

      <Modal open={open} onClose={() => setOpen(false)} title={role}>
        <div className="mt-1 flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-deep text-white">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-sm text-muted">{time}</p>
            <Chip variant={status === 'Current' ? 'accent' : 'outline'} dot={status === 'Current'} className="mt-1">
              {status}
            </Chip>
          </div>
        </div>

        <ul className="mt-5 flex flex-col gap-2 text-sm text-muted">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <Chip key={t} variant="tech">
              {t}
            </Chip>
          ))}
        </div>
      </Modal>
    </>
  )
}
