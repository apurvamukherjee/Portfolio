import { useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Project } from '../../../data/projects'
import { SHELF_BOARDS } from '../../../data/projects'
import { useFinePointer } from '../../../hooks/useFinePointer'
import { Shelf } from './Shelf'
import { OpenBook } from './OpenBook'

interface BookshelfProps {
  projects: Project[]
  tech: string | null
}

export function Bookshelf({ projects, tech }: BookshelfProps) {
  const reduced = useReducedMotion() ?? false
  const fine = useFinePointer()
  const [openId, setOpenId] = useState<string | null>(null)

  const boards = SHELF_BOARDS.map((categories) =>
    categories
      .map((category) => ({ category, projects: projects.filter((p) => p.category === category) }))
      .filter((group) => group.projects.length > 0),
  ).filter((groups) => groups.length > 0)

  const openProject = openId ? (projects.find((p) => p.name === openId) ?? null) : null

  return (
    <div className="relative flex w-full flex-col gap-9 rounded-2xl border border-border bg-surface-raised pb-7 pt-4 shadow-card">
      <p className="px-4 font-mono text-[0.7rem] text-muted md:px-6">
        <span className="text-accent">$</span> open ~/projects/* <span className="text-accent">→</span>{' '}
        {fine ? 'hover a spine to turn its cover out, click the cover to read it' : 'tap a spine to turn its cover out, tap the cover to read it'}
      </p>

      {boards.map((groups) => (
        <Shelf
          key={groups[0].category}
          groups={groups}
          tech={tech}
          openId={openId}
          reduced={reduced}
          onOpen={(name) => setOpenId((current) => current ?? name)}
        />
      ))}

      <AnimatePresence>
        {openProject && <OpenBook key={openProject.name} project={openProject} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
