import { motion, useReducedMotion } from 'framer-motion'
import { useIntro } from '../../hooks/useIntro'
import { Island } from './visor-notch/Island'
import { useNotch } from './visor-notch/store'

const TRIED_KEY = 'portfolio-notch-tried'

function readTried(): boolean {
  try {
    return localStorage.getItem(TRIED_KEY) === '1'
  } catch {
    return false
  }
}

function markTried() {
  try {
    localStorage.setItem(TRIED_KEY, '1')
  } catch {
    // localStorage unavailable — the hint just shows again next visit
  }
}

useNotch.subscribe((s, prev) => {
  if (s.open && !prev.open) markTried()
})

/** The Visor website's notch island (website/src/notch in visor-mac-island), pinned to the top of the page. */
export function VisorNotch() {
  const reduced = useReducedMotion() ?? false
  const introDone = useIntro()
  const open = useNotch((s) => s.open)
  const tried = open || readTried()

  return (
    <div style={{ opacity: introDone ? 1 : 0, transition: reduced ? 'none' : 'opacity 0.4s' }}>
      <Island />
      {introDone && !tried && (
        <div className="pointer-events-none fixed left-1/2 top-0 z-[60] hidden h-8 w-[300px] -translate-x-1/2 notch:block">
          <span
            aria-hidden
            className="absolute inset-x-6 -bottom-3 top-1 animate-pulse-dot rounded-full bg-accent/60 blur-xl motion-reduce:animate-none"
          />
          <motion.span
            aria-hidden
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: reduced ? 0 : 0.4 }}
            className="absolute left-full top-2 ml-3 whitespace-nowrap font-mono text-[11px] font-medium text-accent"
          >
            ← hover me, it plays music
          </motion.span>
        </div>
      )}
    </div>
  )
}
