import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbChevronDown } from 'react-icons/tb'
import type { ExperienceRole } from '../../data/experience'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'

export function ExperienceNode({ role, icon: Icon, time, status, points, tech }: ExperienceRole) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((o) => !o)

  return (
    <GradientSweepCard className="h-full flex-1 rounded-lg p-6">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`${role} — tap to view details`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        className="flex cursor-pointer flex-col gap-4 outline-none"
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
          <TbChevronDown
            className={`shrink-0 text-accent transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </div>

        <Chip variant={status === 'Current' ? 'accent' : 'outline'} dot={status === 'Current'}>
          {status}
        </Chip>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
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
          </motion.div>
        )}
      </AnimatePresence>
    </GradientSweepCard>
  )
}
