import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, type TargetAndTransition } from 'framer-motion'

const ACTIONS = [
  { say: "Hey! I'm Apurva 👋", body: { y: [0, -14, 0, -8, 0] } },
  { say: 'Whee! 🌀', body: { rotateY: [0, 360] } },
  { say: 'Analyst mode 📊', body: { scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] } },
  { say: 'Student for life 🎓', body: { y: [0, -6, 0] } },
  { say: 'Crunching the numbers… 🤔', body: { rotate: [0, 8, -8, 0] } },
] as const satisfies readonly { say: string; body: TargetAndTransition }[]

const CAP_TOSS_INDEX = 3
const THINK_INDEX = 4
const SKIN = '#f2c29b'
const HOODIE = '#ff3b3b'

/** 2D analyst-and-student mascot: waves, blinks, tracks the cursor, and cycles through actions on click. */
export function Logo() {
  const [step, setStep] = useState(-1)
  const [active, setActive] = useState(false)
  const reduced = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX / window.innerWidth - 0.1
      const dy = e.clientY / window.innerHeight - 0.05
      px.set(Math.max(-1.6, Math.min(1.6, dx * 3)))
      py.set(Math.max(-1, Math.min(1, dy * 2)))
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, px, py])

  const idx = step % ACTIONS.length
  const action = active ? ACTIONS[idx] : null
  const tossing = active && idx === CAP_TOSS_INDEX
  const thinking = active && idx === THINK_INDEX
  const play = () => {
    setStep((s) => s + 1)
    setActive(true)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Apurva mascot — click for an action"
      onClick={play}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          play()
        }
      }}
      className="relative flex h-12 w-12 cursor-pointer items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-14 md:w-14"
      style={{ perspective: 300 }}
    >
      {action && (
        <span
          key={step}
          onAnimationEnd={() => setActive(false)}
          className="animate-pop-up pointer-events-none absolute -top-3 left-14 z-10 whitespace-nowrap rounded-full bg-surface px-3 py-1 font-mono text-sm text-accent shadow-card"
        >
          {action.say}
        </span>
      )}
      <motion.svg
        key={step}
        viewBox="0 0 80 96"
        className="h-full w-full overflow-visible"
        animate={action && !reduced ? action.body : undefined}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <ellipse cx="40" cy="93" rx="18" ry="2.5" fill="#000" opacity="0.2" />
        <path d="M18 96 C18 72 26 64 40 64 C54 64 62 72 62 96 Z" fill={HOODIE} />
        <rect x="31" y="52" width="18" height="14" rx="6" fill={SKIN} />
        <path d="M22 70 Q18 84 22 90" stroke={HOODIE} strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="22" cy="91" r="4" fill={SKIN} />
        <rect x="28" y="80" width="24" height="12" rx="2" fill="#2b2b34" />
        <rect x="30" y="82" width="20" height="8" rx="1" fill="#0a84ff" opacity="0.8" />

        <g className={reduced ? '' : 'mascot-wave'}>
          <path d="M58 70 Q70 66 68 50" stroke={HOODIE} strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="68" cy="46" r="4.5" fill={SKIN} />
        </g>

        <circle cx="40" cy="38" r="16" fill={SKIN} />
        <path d="M24 36 Q24 20 40 20 Q56 20 56 36 Q50 28 40 28 Q30 28 24 36Z" fill="#2a1a12" />
        <g fill="none" stroke="#1a1a1a" strokeWidth="1.4">
          <circle cx="34" cy="39" r="4.5" />
          <circle cx="46" cy="39" r="4.5" />
          <path d="M38.5 39 H41.5" />
        </g>
        <g className={reduced ? '' : 'mascot-blink'}>
          <circle cx="34" cy="39" r="3.6" fill="#fff" />
          <circle cx="46" cy="39" r="3.6" fill="#fff" />
          <motion.circle cx="34" cy="39" r="1.8" fill="#1a1a1a" style={{ x: px, y: py }} />
          <motion.circle cx="46" cy="39" r="1.8" fill="#1a1a1a" style={{ x: px, y: py }} />
        </g>
        <path
          d={thinking ? 'M36 48 H44' : 'M35 46 Q40 52 45 46'}
          stroke="#7a3b2e"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        <motion.g
          style={{ originX: 0.5, originY: 0.5 }}
          animate={tossing && !reduced ? { y: [0, -34, 0], rotate: [0, 360, 720] } : { y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <path d="M30 24 L40 29 L50 24 V18 H30Z" fill="#17140f" />
          <path d="M40 8 L66 17 L40 26 L14 17Z" fill="#23232b" />
          <path d="M60 19 V29" stroke="#ffcc00" strokeWidth="1.4" />
          <circle cx="60" cy="30" r="2" fill="#ffcc00" />
        </motion.g>
      </motion.svg>
    </div>
  )
}
