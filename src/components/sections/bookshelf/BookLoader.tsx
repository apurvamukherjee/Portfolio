import { motion } from 'framer-motion'
import type { Project } from '../../../data/projects'
import { CAT_GRADIENT } from '../../../lib/projectStyles'
import { hashString, mulberry32 } from '../../../lib/seededRandom'

interface BookLoaderProps {
  project: Project
  settled: boolean
}

const COLS = 10
const ROWS = 7
const FILL_THRESHOLD = 0.55

/**
 * Cover shown while a book's shared-layout transition is still growing from the shelf to the
 * open spread. The fill pattern is seeded from the project name (not random per render), so each
 * project gets its own stable "fingerprint" instead of every book showing the same flat color.
 */
export function BookLoader({ project, settled }: BookLoaderProps) {
  const rand = mulberry32(hashString(project.name))
  const cells = Array.from({ length: COLS * ROWS }, () => rand())
  const jsxName = project.name.replace(/[^a-zA-Z0-9]/g, '') || 'Project'

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden bg-gradient-to-br ${CAT_GRADIENT[project.category]}`}
      style={{ transformOrigin: 'left center' }}
      initial={{ opacity: 1, rotateY: 0 }}
      animate={{ opacity: settled ? 0 : 1, rotateY: settled ? -28 : 0 }}
      transition={{ duration: 0.24 }}
    >
      <div
        aria-hidden
        className="animate-gradient-shift absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.4) 0 2px, transparent 2px 28px)',
          backgroundSize: '300% 300%',
        }}
      />

      <div className="absolute inset-0 grid gap-1 p-5 sm:p-8" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {cells.map((v, i) => (
          <motion.span
            key={i}
            className="rounded-[2px] bg-white"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: v > FILL_THRESHOLD ? 0.85 : 0, scale: v > FILL_THRESHOLD ? 1 : 0.4 }}
            transition={{ duration: 0.4, delay: (i % COLS) * 0.02 + Math.floor(i / COLS) * 0.03, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/40 bg-black/25 text-2xl font-extrabold backdrop-blur-sm">
          {project.name.charAt(0)}
        </div>
        <div className="max-w-full truncate rounded-md bg-black/30 px-3 py-1.5 font-mono text-[0.7rem] backdrop-blur-sm">
          <span className="text-white/60">{'> '}</span>
          {`mount(<${jsxName} />)`}
        </div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-black/30">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: settled ? '100%' : '85%' }}
            transition={{ duration: settled ? 0.2 : 0.65, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
