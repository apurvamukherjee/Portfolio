import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Skill } from '../../data/skills'

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
        className={`flex w-max py-3 ${reduced ? '' : 'marquee-track'}`}
        style={{
          ['--dur' as string]: `${half.length * secondsPerItem}s`,
          ['--dir' as string]: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map(({ name, icon: Icon }, i) => (
          <li key={i} aria-hidden={i >= skills.length || undefined} className="mr-4 shrink-0">
            <motion.div
              whileHover={reduced ? undefined : { y: -4, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="group flex items-center gap-3 rounded-full border border-border bg-surface-raised py-2 pl-2 pr-5 backdrop-blur transition-colors duration-300 hover:border-accent hover:shadow-[0_0_24px_-6px_var(--color-accent)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted transition-all duration-300 group-hover:rotate-[360deg] group-hover:bg-accent/15 group-hover:text-accent">
                <Icon size={20} />
              </span>
              <span className="whitespace-nowrap text-sm font-semibold text-ink">{name}</span>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  )
}
