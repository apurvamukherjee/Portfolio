import { useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { TbArrowUpRight } from 'react-icons/tb'
import { projectBlurb, SHELF_LABELS, type Project } from '../../../data/projects'
import { CATEGORY_ICON, CLOTH } from '../../../lib/projectStyles'
import { bookSize, COVER_TURN, COVER_W, nameSeed, SPINE_SHOWN, SPINE_TURN } from './geometry'

const TURN = 'transform 520ms cubic-bezier(0.32, 0.72, 0, 1), margin 520ms cubic-bezier(0.32, 0.72, 0, 1)'

/** Spine build. Bindings differ in how the boards are decorated: how many foil rules bracket
 *  the title, whether there is a ridged headband at the crown, whether the title sits in a
 *  recessed panel. Structure, not color, is what keeps a run of spines from going flat. */
const BUILDS = [
  { rules: 2, headband: true, panel: false },
  { rules: 1, headband: false, panel: true },
  { rules: 3, headband: false, panel: false },
  { rules: 2, headband: true, panel: true },
  { rules: 1, headband: true, panel: false },
  { rules: 3, headband: true, panel: true },
] as const

/** Woven cloth: two hairline gratings at opposing angles, at an opacity you read as texture
 *  rather than see as stripes. */
const CLOTH_WEAVE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)',
}

/** The spine's own curvature: lit along the front edge, falling into shadow at both sides. */
const SPINE_CURVE = {
  backgroundImage:
    'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 12%, rgba(255,255,255,0.07) 38%, rgba(255,255,255,0.03) 62%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.5) 100%)',
}

const HEADBAND_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(90deg, var(--color-gilt) 0 1px, transparent 1px 3px), linear-gradient(180deg, rgba(0,0,0,0.3), transparent)',
  opacity: 0.22,
}

/** Light catching the front board, plus the groove where it hinges on the spine. */
const COVER_LIGHT = {
  backgroundImage:
    'linear-gradient(90deg, rgba(0,0,0,0.5) 0, rgba(0,0,0,0.12) 7px, rgba(255,255,255,0.1) 9px, transparent 16px), linear-gradient(112deg, transparent 32%, rgba(255,255,255,0.1) 50%, transparent 68%)',
}

interface BookProps {
  project: Project
  /** Cover turned out toward the reader. Exactly one book per board is. */
  open: boolean
  /** Filtered out by the tech filter: stays on the shelf, pushed back. */
  dimmed: boolean
  /** Its OpenBook dialog is showing, so the shared layout transition owns this book. */
  hidden: boolean
  reduced: boolean
  onActivate: () => void
  onOpen: () => void
}

/**
 * One book. Closed it shows its spine; pulled, the spine swings away and the front board turns
 * out with a screenshot, the name and a one-line blurb, so a project can be read without opening
 * anything. A click on the cover opens the full spread.
 */
export function Book({ project, open, dimmed, hidden, reduced, onActivate, onOpen }: BookProps) {
  // Covers load their screenshot the first time they turn out, not all sixteen up front.
  const [seen, setSeen] = useState(open)
  if (open && !seen) setSeen(true)

  if (hidden) return null

  const seed = nameSeed(project.name)
  const { width } = bookSize(project.name)
  const build = BUILDS[seed % BUILDS.length]
  const cloth = CLOTH[seed % CLOTH.length]
  const CategoryIcon = CATEGORY_ICON[project.category]
  const turn = reduced ? undefined : TURN

  const spineStyle: CSSProperties = {
    width,
    transformOrigin: 'right center',
    transform: `rotateY(${open ? -SPINE_TURN : 0}deg)`,
    // Pulls the turned spine's empty left half out of the row so neighbours close the gap.
    marginLeft: open ? -Math.round(width * (1 - SPINE_SHOWN)) : 0,
    transition: turn,
  }
  const coverStyle: CSSProperties = {
    width: COVER_W,
    transformOrigin: 'left center',
    transform: `rotateY(${open ? COVER_TURN : 89}deg)`,
    transition: turn,
  }

  return (
    <motion.button
      type="button"
      layoutId={`book-${project.name}`}
      onClick={open ? onOpen : onActivate}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onActivate()}
      // Keyboard focus only: a tap also focuses on Android, which would open the cover and the spread in one touch.
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && onActivate()}
      aria-label={open ? `Open ${project.name}` : `Show the cover of ${project.name}`}
      data-cursor={open ? 'open' : undefined}
      style={{ perspective: 1100 }}
      className={`group absolute inset-0 flex touch-manipulation text-left transition-[opacity,filter] duration-300 [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${
        dimmed ? 'opacity-30 saturate-0' : ''
      }`}
    >
      <span
        style={spineStyle}
        className="relative h-full flex-none overflow-hidden rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
      >
        <span aria-hidden className={`absolute inset-0 ${cloth}`} />
        <span aria-hidden className="absolute inset-0" style={CLOTH_WEAVE} />
        <span aria-hidden className="absolute inset-0" style={SPINE_CURVE} />

        {build.headband && <span aria-hidden className="absolute inset-x-0 top-0 h-[7px]" style={HEADBAND_STYLE} />}
        {build.panel && (
          <span aria-hidden className="absolute inset-x-[5px] bottom-10 top-8 rounded-[1px] border border-gilt/15 bg-black/10" />
        )}

        {/* Foil rules bracketing the title. Count is part of the binding's identity. */}
        {Array.from({ length: build.rules }, (_, i) => (
          <span key={`top-${i}`} aria-hidden className="absolute inset-x-2 h-px bg-gilt/40" style={{ top: 20 + i * 3 }} />
        ))}
        {Array.from({ length: build.rules }, (_, i) => (
          <span key={`bottom-${i}`} aria-hidden className="absolute inset-x-2 h-px bg-gilt/40" style={{ bottom: 44 + i * 3 }} />
        ))}

        <span className="absolute inset-x-0 bottom-12 top-6 flex items-center justify-center overflow-hidden px-1 text-center text-[0.7rem] font-semibold uppercase leading-none tracking-[0.12em] text-gilt [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] [writing-mode:vertical-rl]">
          {project.name}
        </span>

        <span className="absolute inset-x-0 bottom-3 flex items-center justify-center text-gilt/70">
          {project.spineLogo ? (
            <img
              src={project.spineLogo}
              alt=""
              className="h-6 w-6 rounded-full bg-black/25 object-contain p-0.5 ring-1 ring-gilt/40"
            />
          ) : (
            <CategoryIcon size={12} aria-hidden />
          )}
        </span>

        {/* The turned spine faces away from the light. */}
        <span
          aria-hidden
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${open ? 'opacity-45' : 'opacity-0'}`}
        />
      </span>

      <span
        style={coverStyle}
        aria-hidden={!open}
        className="relative flex h-full flex-none flex-col overflow-hidden rounded-r-[3px] shadow-[6px_8px_18px_-6px_rgba(0,0,0,0.6)]"
      >
        <span aria-hidden className={`absolute inset-0 ${cloth}`} />
        <span aria-hidden className="absolute inset-0" style={CLOTH_WEAVE} />

        <span className="relative flex h-full flex-col p-2.5 pl-4">
          <span className="relative block h-[50%] flex-none overflow-hidden rounded-[2px] bg-black/45 ring-1 ring-gilt/35">
            {seen && (
              <img
                src={project.images[0]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            )}
          </span>

          <span className="mt-2.5 block truncate text-[0.82rem] font-semibold leading-tight tracking-[0.01em] text-gilt">
            {project.name}
          </span>
          <span className="mt-1 line-clamp-3 text-[0.6rem] leading-[1.45] text-white/75">{projectBlurb(project)}</span>

          <span className="mt-auto flex items-center justify-between gap-2 border-t border-gilt/25 pt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-gilt/70">
            <span className="flex min-w-0 items-center gap-1">
              <CategoryIcon size={10} aria-hidden className="flex-none" />
              <span className="truncate">{SHELF_LABELS[project.category]}</span>
            </span>
            <span className="flex flex-none items-center gap-0.5 text-gilt transition-transform duration-300 group-hover:translate-x-0.5">
              open
              <TbArrowUpRight size={10} aria-hidden />
            </span>
          </span>
        </span>

        <span aria-hidden className="pointer-events-none absolute inset-0" style={COVER_LIGHT} />
      </span>
    </motion.button>
  )
}
