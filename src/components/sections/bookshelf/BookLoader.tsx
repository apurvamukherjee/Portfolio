import { motion } from 'framer-motion'
import type { Project } from '../../../data/projects'
import { CATEGORY_ICON } from '../../../lib/projectStyles'
import { SHELF_LABELS } from '../../../data/projects'

interface BookLoaderProps {
  project: Project
}

/**
 * Cover shown while a book's shared-layout transition is still growing from the shelf to the
 * open spread — a closed front board, in the same cloth as the spine it came from. Previously
 * a mock terminal and an animated dot grid, which advertised "generated portfolio" louder than
 * anything else on the page.
 *
 * Mounted by the parent only while `!settled`, inside an AnimatePresence — the fade/hinge below
 * is the `exit` animation, so this element actually leaves the DOM once it plays instead of
 * sitting around indefinitely at opacity 0. Firefox in particular would otherwise occasionally
 * paint a stale frame of this 3D-rotated layer as a ghost over the real content.
 */
export function BookLoader({ project }: BookLoaderProps) {
  const CategoryIcon = CATEGORY_ICON[project.category]

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden bg-cloth-2"
      style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
      initial={{ opacity: 1, rotateY: 0 }}
      /* Swings most of the way open before it goes: a real board clears ~100°, and holding
         opacity until the last third stops the whole thing reading as a cross-fade. */
      exit={{ opacity: 0, rotateY: -105 }}
      transition={{
        rotateY: { type: 'spring', stiffness: 170, damping: 24 },
        opacity: { duration: 0.22, delay: 0.2 },
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)',
        }}
      />

      {/* Hinge shadow along the left edge, where the board meets the spine. */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-10"
        style={{ backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.5), transparent)' }}
      />

      {/* Fore-edge: the stack of leaves at the opening edge, visible as the board swings. */}
      <div
        aria-hidden
        className="absolute inset-y-[3px] right-0 w-[6px]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, rgba(255,255,255,0.10) 1px 2px)',
        }}
      />

      {/* Specular sweep travelling across the cloth as the board turns toward the light. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.13) 50%, transparent 70%)',
        }}
        initial={{ x: '-60%', opacity: 0 }}
        exit={{ x: '60%', opacity: 1 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
        <CategoryIcon size={22} aria-hidden className="text-foil/45" />
        <div className="max-w-sm border-y border-foil/25 py-4">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-foil/50">
            {SHELF_LABELS[project.category]}
          </p>
          <p className="mt-2 text-lg font-semibold tracking-[0.06em] text-foil">{project.name}</p>
        </div>
      </div>
    </motion.div>
  )
}
