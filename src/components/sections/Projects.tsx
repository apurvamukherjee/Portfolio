import { motion, useReducedMotion } from 'framer-motion'
import { TbBooks, TbList, TbX } from 'react-icons/tb'
import { projects } from '../../data/projects'
import { SectionHeading } from '../shared/SectionHeading'
import { ProjectCard } from './ProjectCard'
import { Bookshelf } from './bookshelf/Bookshelf'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { usesTech } from '../../lib/tech'
import { useUi } from '../../lib/ui'

// Mirrors the GitHub pinned repos; List view only, the shelf keeps its category order.
const PINNED = ['Visor', 'Zenith', 'KeyStrike', 'Pixelpanic', 'Monopolis', 'Kiwami']
const listProjects = [
  ...PINNED.flatMap((n) => projects.filter((p) => p.name === n)),
  ...projects.filter((p) => !PINNED.includes(p.name)),
]

const VIEW_OPTIONS = [
  { id: 'list', label: 'List', Icon: TbList },
  { id: 'shelf', label: 'Shelf', Icon: TbBooks },
] as const

export function Projects() {
  const reduced = useReducedMotion()
  const view = useUi((s) => s.view)
  const tech = useUi((s) => s.tech)
  const { setView, setTech } = useUi.getState()
  const shown = listProjects.filter((p) => usesTech(p, tech))

  return (
    <section id="projects" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <SectionHeading tag="Projects" index={4} />

          {/* Same voice as the Skills readout: the section reports its own state like a shell would. */}
          <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted md:text-sm" aria-live="polite">
            {tech ? (
              <>
                <span>
                  <span className="text-accent">$</span> grep -l <span className="text-ink">"{tech}"</span> ~/projects{' '}
                  <span className="text-accent">→</span> {shown.length} of {projects.length}
                </span>
                <button
                  type="button"
                  onClick={() => setTech(null)}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <TbX size={12} aria-hidden />
                  clear
                </button>
              </>
            ) : (
              <span>
                <span className="text-accent">$</span> ls ~/projects <span className="text-accent">→</span> {projects.length} projects
                <span className="hidden sm:inline"> · click any tech tag to filter</span>
              </span>
            )}
          </p>

          <div role="radiogroup" aria-label="Projects view" className="inline-flex flex-none items-center gap-1 rounded-full border border-border bg-surface-raised p-1">
            {VIEW_OPTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={view === id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 ${
                  view === id ? 'bg-gradient-to-r from-accent to-accent-deep text-white' : 'text-muted hover:text-ink'
                }`}
              >
                <Icon size={15} aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === 'shelf' ? (
          <div className="mt-8 w-full">
            <Bookshelf projects={projects} />
          </div>
        ) : (
          <motion.div
            // Remount per filter so the cards that remain replay their entrance instead of sitting where they were.
            key={tech ?? 'all'}
            className="mt-8 flex w-full flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
          >
            {shown.map((project) => (
              <motion.div key={project.name} variants={withMotionPreference(fadeUp, reduced)}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
