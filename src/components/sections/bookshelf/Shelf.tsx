import type { Project, ShelfCategory } from '../../../data/projects'
import { SHELF_LABELS } from '../../../data/projects'
import { Book } from './Book'
import { ShelfOrnaments } from './ShelfOrnament'

interface ShelfProps {
  category: ShelfCategory
  projects: Project[]
  openId: string | null
  onOpen: (name: string) => void
}

const WOOD_STYLE = {
  background: 'linear-gradient(180deg, var(--color-wood), var(--color-wood-deep))',
  boxShadow: '0 10px 18px -6px var(--color-shadow), inset 0 1px 0 var(--color-border)',
}

export function Shelf({ category, projects, openId, onOpen }: ShelfProps) {
  return (
    <div className="flex items-end gap-5 max-md:flex-col max-md:items-stretch max-md:gap-2.5">
      <div className="mb-3.5 inline-flex flex-none items-center gap-2 self-start whitespace-nowrap rounded border border-l-[3px] border-border border-l-accent bg-surface-raised px-3 py-1.5 max-md:mb-0">
        <span className="text-xs font-bold uppercase tracking-wider text-ink">{SHELF_LABELS[category]}</span>
        <span className="font-mono text-[0.7rem] tabular-nums text-muted">{projects.length}</span>
      </div>

      <div className="relative min-w-0 flex-1">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-3.5 rounded-sm" style={WOOD_STYLE} />
        <ul
          className="thin-scrollbar relative z-[1] flex h-[220px] list-none items-end gap-3.5 overflow-x-auto px-2 pb-3.5 pt-6"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {projects.map((project, i) => (
            <li key={project.name} className="flex-none">
              <Book
                project={project}
                index={i}
                shelfSize={projects.length}
                hidden={project.name === openId}
                onOpen={() => onOpen(project.name)}
              />
            </li>
          ))}
          <li className="flex flex-none items-end gap-2 self-end">
            <ShelfOrnaments category={category} />
          </li>
        </ul>
      </div>
    </div>
  )
}
