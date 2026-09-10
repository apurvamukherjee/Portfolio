import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Project } from '../../../data/projects'
import { SHELF_ORDER } from '../../../data/projects'
import { Shelf } from './Shelf'
import { OpenBook } from './OpenBook'

interface BookshelfProps {
  projects: Project[]
}

export function Bookshelf({ projects }: BookshelfProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const shelves = useMemo(
    () =>
      SHELF_ORDER.map((category) => ({
        category,
        projects: projects.filter((p) => p.category === category),
      })).filter((shelf) => shelf.projects.length > 0),
    [projects],
  )

  const openProject = openId ? (projects.find((p) => p.name === openId) ?? null) : null

  return (
    <div className="flex w-full flex-col gap-11">
      {shelves.map((shelf) => (
        <Shelf
          key={shelf.category}
          category={shelf.category}
          projects={shelf.projects}
          openId={openId}
          onOpen={(name) => setOpenId((current) => current ?? name)}
        />
      ))}

      <AnimatePresence>
        {openProject && <OpenBook key={openProject.name} project={openProject} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
