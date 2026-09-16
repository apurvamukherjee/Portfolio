import { motion, useReducedMotion } from 'framer-motion'
import type { Project } from '../../../data/projects'
import { CATEGORY_ICON, CLOTH } from '../../../lib/projectStyles'
import { useFinePointer } from '../../../hooks/useFinePointer'

const TILTS = [-1.5, 1, -0.5, 1.5, -1]
const HEIGHTS = [186, 168, 196, 176]
const WIDTHS = [46, 52, 44, 58]

/** Per-spine hue nudge, in degrees. Small enough that the shelf still reads as one graphite
 *  family at a glance — this individuates a spine up close, it does not make color a key. */
const HUES = [-9, 5, -4, 8, 0, -6, 3]

/** Spine build. Bindings differ in how the boards are decorated: how many foil rules bracket
 *  the title, whether there is a ridged headband at the crown, whether the title sits in a
 *  recessed panel. Structure, not color, is what keeps a run of graphite from going flat. */
const BUILDS = [
  { rules: 2, headband: true, panel: false },
  { rules: 1, headband: false, panel: true },
  { rules: 3, headband: false, panel: false },
  { rules: 2, headband: true, panel: true },
  { rules: 1, headband: true, panel: false },
  { rules: 3, headband: true, panel: true },
] as const

/** Hover character. A heavier book settles slower and lifts less; a slim one springs. Keyed
 *  to identity so a given spine always moves the same way. */
const MOTIONS = [
  { lift: -16, stiffness: 420, damping: 24 },
  { lift: -11, stiffness: 300, damping: 30 },
  { lift: -18, stiffness: 500, damping: 22 },
  { lift: -13, stiffness: 360, damping: 27 },
] as const

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

/** Ridged headband at the crown, as on a sewn hardcover. */
const HEADBAND_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, var(--color-foil) 0 1px, transparent 1px 3px), linear-gradient(180deg, rgba(0,0,0,0.3), transparent)',
  opacity: 0.22,
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
  const hue = HUES[seed % HUES.length]
  const build = BUILDS[seed % BUILDS.length]
  const motionChar = MOTIONS[seed % MOTIONS.length]
  const lifted = { y: motionChar.lift, rotate: tilt, zIndex: 5 }

  return (
    <motion.button
      type="button"
      layoutId={`book-${project.name}`}
      onClick={onOpen}
      aria-label={`Open ${project.name}`}
      style={{ height, width }}
      className="group relative z-10 flex-none touch-manipulation snap-start overflow-hidden rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.45)] [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      whileHover={!reduced && fine ? lifted : undefined}
      whileFocus={!reduced ? lifted : undefined}
      whileTap={!reduced ? { y: motionChar.lift / 2, scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: motionChar.stiffness, damping: motionChar.damping }}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${CLOTH[seed % CLOTH.length]}`}
        style={hue === 0 ? undefined : { filter: `hue-rotate(${hue}deg)` }}
      />

      {project.spineLogo && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.07] grayscale"
          style={{ backgroundImage: `url(${project.spineLogo})` }}
        />
      )}

      <span aria-hidden className="pointer-events-none absolute inset-0" style={CLOTH_WEAVE} />
      <span aria-hidden className="pointer-events-none absolute inset-0" style={SPINE_CURVE} />

      {build.headband && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[7px]"
          style={HEADBAND_STYLE}
        />
      )}

      {build.panel && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[5px] bottom-10 top-8 rounded-[1px] border border-foil/15 bg-black/10"
        />
      )}

      {/* Foil rules bracketing the title. Count is part of the binding's identity. */}
      {Array.from({ length: build.rules }, (_, i) => (
        <span
          key={`top-${i}`}
          aria-hidden
          className="pointer-events-none absolute inset-x-2 h-px bg-foil/40"
          style={{ top: 20 + i * 3 }}
        />
      ))}
      {Array.from({ length: build.rules }, (_, i) => (
        <span
          key={`bottom-${i}`}
          aria-hidden
          className="pointer-events-none absolute inset-x-2 h-px bg-foil/40"
          style={{ bottom: 44 + i * 3 }}
        />
      ))}

      <span className="pointer-events-none absolute inset-x-0 bottom-12 top-6 flex items-center justify-center overflow-hidden px-1 text-center text-[0.7rem] font-semibold uppercase leading-none tracking-[0.12em] text-foil [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] [writing-mode:vertical-rl]">
        {project.name}
      </span>

      <span className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center text-foil/50">
        <CategoryIcon size={12} aria-hidden />
      </span>

    </motion.button>
  )
}
