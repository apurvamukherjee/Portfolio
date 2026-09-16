import type { CSSProperties } from 'react'
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

const ROW_H = 230

/** The shelf itself: a hairline rule with a short soft gradient under it standing in for the
 *  board's thickness. Replaces the old wood-grain plank, which read as clip art against a
 *  site that is otherwise flat surfaces and 1px borders. Tiled once per row so wrapped rows
 *  each stand on a board rather than floating. */
const BOARD_STYLE = {
  backgroundImage:
    'linear-gradient(180deg, var(--color-shelf-line) 0 1px, color-mix(in srgb, var(--color-shelf-line) 35%, transparent) 1px 2px, transparent 2px)',
  backgroundSize: `100% ${ROW_H}px`,
  backgroundPosition: `0 ${ROW_H - 2}px`,
  backgroundRepeat: 'repeat-y',
}

/** Hover halo. Sits on the li, not the button: the spine clips its own children with
 *  overflow-hidden, so a glow drawn inside it would never reach past the spine edge. */
const GLOW_STYLE = {
  background:
    'radial-gradient(60% 55% at 50% 78%, color-mix(in srgb, var(--color-accent) 42%, transparent) 0%, transparent 70%)',
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
          className="relative z-[1] flex list-none flex-wrap gap-x-[3px] px-1"
          style={{ ...BOARD_STYLE, '--shelf-row-h': `${ROW_H}px` } as CSSProperties}
        >
          {projects.map((project) => (
            <li key={project.name} className="group/book relative isolate flex h-[var(--shelf-row-h)] flex-none items-end">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-[-14px] bottom-0 top-[-10px] -z-[1] rounded-[10px] opacity-0 blur-[14px] transition-opacity duration-300 group-hover/book:opacity-100 group-focus-within/book:opacity-100"
                style={GLOW_STYLE}
              />
              <Book
                project={project}
                shelfSize={projects.length}
                hidden={project.name === openId}
                onOpen={() => onOpen(project.name)}
              />
            </li>
          ))}
          <li className="ml-3 flex h-[var(--shelf-row-h)] flex-none items-end gap-1">
            <ShelfOrnaments category={category} />
          </li>
        </ul>
      </div>
    </div>
  )
}
