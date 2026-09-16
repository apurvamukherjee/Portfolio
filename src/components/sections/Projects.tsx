import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TbBooks, TbList } from 'react-icons/tb'
import { projects } from '../../data/projects'
import { SectionHeading } from '../shared/SectionHeading'
import { ProjectCard } from './ProjectCard'
import { Bookshelf } from './bookshelf/Bookshelf'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
type ProjectsView = 'shelf' | 'list'
const VIEW_STORAGE_KEY = 'portfolio:projects-view'
const VIEW_OPTIONS = [
  { id: 'list', label: 'List', Icon: TbList },
  { id: 'shelf', label: 'Shelf', Icon: TbBooks },
] as const

function loadView(): ProjectsView {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === 'list' ? 'list' : 'shelf'
  } catch {
    return 'shelf'
  }
}

export function Projects() {
  const reduced = useReducedMotion()
  const [view, setView] = useState<ProjectsView>(loadView)

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view)
    } catch {
      // localStorage unavailable (private browsing, etc.) — view choice just won't persist
    }
  }, [view])

  return (
    <section id="projects" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <SectionHeading tag="Projects" />

          <div className="group relative flex-none">
            <div
              role="tooltip"
              className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full scale-95 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-ink opacity-0 shadow-card transition-[opacity,transform] duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 motion-reduce:transition-none"
            >
              Toggle for a detailed view
              <span className="absolute top-full left-1/2 -ml-1.5 h-0 w-0 border-x-6 border-t-6 border-x-transparent border-t-border" />
            </div>

            <div role="radiogroup" aria-label="Projects view" className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-raised p-1">
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
        </div>

        {view === 'shelf' ? (
          <div className="mt-8 w-full">
            <Bookshelf projects={projects} />
          </div>
        ) : (
          <motion.div
            className="mt-8 flex w-full flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
          >
            {projects.map((project) => (
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
