import { motion, useReducedMotion } from 'framer-motion'
import type { Project } from '../../../data/projects'
import { CATEGORY_ICON, CLOTH } from '../../../lib/projectStyles'
import { useFinePointer } from '../../../hooks/useFinePointer'

const TILTS = [-1.5, 1, -0.5, 1.5, -1]
const HEIGHTS = [186, 168, 196, 176]
const WIDTHS = [46, 52, 44, 58]

/** Stable hash of the project name. Spine height/width/tilt are keyed to identity, not
 *  shelf position, so reordering a shelf or moving a project between shelves never
 *  reshuffles its neighbors' dimensions. */
function nameSeed(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Woven cloth: two hairline gratings at opposing angles, at an opacity you read as texture
 *  rather than see as stripes. This is what keeps a flat spine from looking like a CSS block. */
const CLOTH_WEAVE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
}

/** The spine's own curvature. A real book is a cylinder: lit along the front edge, falling
 *  into shadow at both sides. One gradient does the whole job. */
const SPINE_CURVE = {
  backgroundImage:
    'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 12%, rgba(255,255,255,0.07) 38%, rgba(255,255,255,0.03) 62%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.5) 100%)',
}

interface BookProps {
  project: Project
  /** How many books share this shelf — a lone book uses the tallest spine so it reads as anchored to the shelf tag instead of floating below it with no taller neighbor to compare against. */
  shelfSize: number
  hidden: boolean
  onOpen: () => void
}

/** One spine on the shelf. Renders an inert placeholder (same footprint) while its OpenBook counterpart owns the shared layout transition, so neighboring books never reflow. */
export function Book({ project, shelfSize, hidden, onOpen }: BookProps) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const seed = nameSeed(project.name)
  const height = shelfSize === 1 ? Math.max(...HEIGHTS) : HEIGHTS[seed % HEIGHTS.length]
  const width = WIDTHS[seed % WIDTHS.length]

  if (hidden) {
    return <div aria-hidden className="flex-none" style={{ width, height }} />
  }

  const tilt = TILTS[seed % TILTS.length]
  const CategoryIcon = CATEGORY_ICON[project.category]

  return (
    <motion.button
      type="button"
      layoutId={`book-${project.name}`}
      onClick={onOpen}
      aria-label={`Open ${project.name}`}
      style={{ height, width }}
      className={`group relative flex-none touch-manipulation snap-start overflow-hidden rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.45)] [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${CLOTH[seed % CLOTH.length]}`}
      whileHover={!reduced && fine ? { y: -14, rotate: tilt, zIndex: 5 } : undefined}
      whileFocus={!reduced ? { y: -14, rotate: tilt, zIndex: 5 } : undefined}
      whileTap={!reduced ? { y: -7, scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      {project.spineLogo && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.07] grayscale"
          style={{ backgroundImage: `url(${project.spineLogo})` }}
        />
      )}

      <span aria-hidden className="pointer-events-none absolute inset-0" style={CLOTH_WEAVE} />
      <span aria-hidden className="pointer-events-none absolute inset-0" style={SPINE_CURVE} />

      {/* Foil rules above and below the title — the one piece of hardcover detailing that survives. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-2 top-5 h-px bg-foil/40" />
      <span aria-hidden className="pointer-events-none absolute inset-x-2 bottom-11 h-px bg-foil/40" />

      <span className="pointer-events-none absolute inset-x-0 bottom-12 top-6 flex items-center justify-center overflow-hidden px-1 text-center text-[0.7rem] font-semibold uppercase leading-none tracking-[0.12em] text-foil [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] [writing-mode:vertical-rl]">
        {project.name}
      </span>

      <span className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center text-foil/50">
        <CategoryIcon size={12} aria-hidden />
      </span>

    </motion.button>
  )
}
