import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { brandColors, type Skill } from '../../data/skills'

interface SkillMarqueeProps {
  skills: Skill[]
  reverse?: boolean
  secondsPerItem?: number
}

const SLOW = 0.18
const EASE = 0.08

export function SkillMarquee({ skills, reverse = false, secondsPerItem = 3.2 }: SkillMarqueeProps) {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLUListElement>(null)
  const target = useRef(1)
  const raf = useRef(0)

  // Lerp playbackRate so hover decelerates/accelerates instead of snapping.
  function tick() {
    const anim = trackRef.current?.getAnimations()[0]
    if (!anim) return
    const next = anim.playbackRate + (target.current - anim.playbackRate) * EASE
    anim.playbackRate = Math.abs(next - target.current) < 0.005 ? target.current : next
    if (anim.playbackRate !== target.current) raf.current = requestAnimationFrame(tick)
  }

  function setSpeed(rate: number) {
    target.current = rate
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  // Each half repeats the list so one half always overflows wide screens.
  const half = [...skills, ...skills]
  const items = [...half, ...half]

  return (
    <div
      className={`marquee-mask ${reduced ? 'thin-scrollbar overflow-x-auto' : 'overflow-hidden'}`}
      onPointerEnter={reduced ? undefined : () => setSpeed(SLOW)}
      onPointerLeave={reduced ? undefined : () => setSpeed(1)}
    >
      <ul
        ref={trackRef}
        className={`flex w-max pb-8 pt-3 ${reduced ? '' : 'marquee-track'}`}
        style={{
          ['--dur' as string]: `${half.length * secondsPerItem}s`,
          ['--dir' as string]: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map(({ name, icon: Icon }, i) => (
          <li key={i} aria-hidden={i >= skills.length || undefined} className="mr-5 shrink-0">
            <motion.div
              title={name}
              aria-label={name}
              whileHover={reduced ? undefined : { y: -6, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              style={{ ['--brand' as string]: brandColors[name] ?? 'var(--color-ink)' }}
              className="skill-tile group relative flex h-24 w-24 items-center justify-center rounded-2xl border border-border md:h-28 md:w-28"
            >
              <span aria-hidden className="skill-tile-corner left-2 top-2 border-l border-t" />
              <span aria-hidden className="skill-tile-corner bottom-2 right-2 border-b border-r" />
              <Icon
                className="skill-tile-icon h-11 w-11 transition-all duration-300 group-hover:scale-110 md:h-12 md:w-12"
                aria-hidden
              />
              <span className="pointer-events-none absolute -bottom-6 whitespace-nowrap font-mono text-[11px] text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {name}
              </span>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  )
}
