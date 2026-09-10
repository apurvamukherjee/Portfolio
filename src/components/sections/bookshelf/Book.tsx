import { motion } from 'framer-motion'
import type { Project } from '../../../data/projects'
import { CAT_GRADIENT, CATEGORY_ICON } from '../../../lib/projectStyles'
import { useFinePointer } from '../../../hooks/useFinePointer'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

const TILTS = [-3, 2, -1, 3, -2]
const HEIGHTS = [172, 156, 182, 164]
const WIDTHS = [70, 70, 78, 70]

const PAGE_EDGE_STYLE = {
  background:
    'repeating-linear-gradient(to bottom, rgba(255,255,255,0.7) 0, rgba(255,255,255,0.7) 2px, rgba(255,255,255,0.32) 2px, rgba(255,255,255,0.32) 4px)',
}

const RIBBON_STYLE = {
  background: 'linear-gradient(180deg, #fff6e0, #e4cf9c)',
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
}

interface BookProps {
  project: Project
  index: number
  /** How many books share this shelf — a lone book uses the tallest spine so it reads as anchored to the shelf tag instead of floating below it with no taller neighbor to compare against. */
  shelfSize: number
  hidden: boolean
  onOpen: () => void
}

/** One spine on the shelf. Renders an inert placeholder (same footprint) while its OpenBook counterpart owns the shared layout transition, so neighboring books never reflow. */
export function Book({ project, index, shelfSize, hidden, onOpen }: BookProps) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const height = shelfSize === 1 ? Math.max(...HEIGHTS) : HEIGHTS[index % HEIGHTS.length]
  const width = WIDTHS[index % WIDTHS.length]

  if (hidden) {
    return <div aria-hidden className="flex-none" style={{ width, height }} />
  }

  const tilt = TILTS[index % TILTS.length]
  const CategoryIcon = CATEGORY_ICON[project.category]

  return (
    <motion.button
      type="button"
      layoutId={`book-${project.name}`}
      onClick={onOpen}
      aria-label={`Open ${project.name}`}
      style={{ height, width }}
      className={`group relative flex-none touch-manipulation snap-start overflow-visible rounded-t-md rounded-b-sm bg-gradient-to-br shadow-[0_2px_0_rgba(0,0,0,0.28),0_1px_1px_rgba(0,0,0,0.5)_inset] [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 ${CAT_GRADIENT[project.category]}`}
      whileHover={!reduced && fine ? { y: -18, rotate: tilt, zIndex: 5, filter: 'brightness(1.08)' } : undefined}
      whileFocus={!reduced ? { y: -18, rotate: tilt, zIndex: 5, filter: 'brightness(1.08)' } : undefined}
      whileTap={!reduced ? { y: -9, scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      {project.spineLogo && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-md rounded-b-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${project.spineLogo})` }}
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 overflow-hidden rounded-t-md rounded-b-sm bg-gradient-to-br opacity-60 ${CAT_GRADIENT[project.category]}`}
          />
        </>
      )}

      {project.status === 'Ongoing' && (
        <span aria-hidden className="absolute -top-2.5 right-2.5 z-10 h-5 w-3.5" style={RIBBON_STYLE} />
      )}

      {/* Hardcover foil bands */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2.5 rounded-t-md bg-white/20" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-black/15" />
      <span aria-hidden className="pointer-events-none absolute inset-x-1.5 top-3 h-px bg-white/25" />

      {/* Page block, right edge */}
      <span aria-hidden className="pointer-events-none absolute bottom-1.5 right-[3px] top-4 w-[5px] rounded-sm opacity-60" style={PAGE_EDGE_STYLE} />

      <span className="pointer-events-none absolute inset-x-0 bottom-6 top-4 flex items-center justify-center overflow-hidden text-xs font-bold uppercase tracking-wide text-white/95 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] [writing-mode:vertical-rl]">
        {project.name}
      </span>

      <span className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center text-white/45">
        <CategoryIcon size={13} aria-hidden />
      </span>
    </motion.button>
  )
}
