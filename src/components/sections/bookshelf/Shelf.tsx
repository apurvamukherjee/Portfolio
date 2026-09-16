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

/** The shelf itself: a hairline rule with a short soft gradient under it standing in for the
 *  board's thickness. Replaces the old wood-grain plank, which read as clip art against a
 *  site that is otherwise flat surfaces and 1px borders. */
const BOARD_STYLE = {
  background:
    'linear-gradient(180deg, var(--color-shelf-line) 0 1px, color-mix(in srgb, var(--color-shelf-line) 35%, transparent) 1px 2px, transparent 2px)',
}

export function Shelf({ category, projects, openId, onOpen }: ShelfProps) {
  return (
    <div className="flex items-end gap-6 max-md:flex-col max-md:items-stretch max-md:gap-2">
      <div className="mb-4 flex w-[var(--shelf-label-w)] flex-none items-baseline justify-between gap-3 self-start max-md:mb-0 max-md:w-auto">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">{SHELF_LABELS[category]}</span>
        <span className="text-[0.7rem] tabular-nums text-muted/60">
          {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      <div className="relative min-w-0 flex-1">
        <ul
          className="thin-scrollbar relative z-[1] flex h-[230px] list-none items-end gap-[3px] overflow-x-auto px-1 pt-6"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {projects.map((project) => (
            <li key={project.name} className="flex-none">
              <Book
                project={project}
                shelfSize={projects.length}
                hidden={project.name === openId}
                onOpen={() => onOpen(project.name)}
              />
            </li>
          ))}
          <li className="ml-3 flex flex-none items-end gap-1 self-end">
            <ShelfOrnaments category={category} />
          </li>
        </ul>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2" style={BOARD_STYLE} />
      </div>
    </div>
  )
}
