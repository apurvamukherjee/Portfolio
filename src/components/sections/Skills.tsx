import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { skillCategories } from '../../data/skills'
import { SectionHeading } from '../shared/SectionHeading'
import { Dragon } from './Dragon'
import { SkillMarquee } from './SkillMarquee'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'

const total = skillCategories.reduce((n, c) => n + c.skills.length, 0)

export function Skills() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const scrollReveal = useTransform(scrollYProgress, [0.05, 0.7], [-18, 100])
  const scrollDrift = useTransform(scrollYProgress, [0, 1], [40, -40])
  const scrollGlow = useTransform(scrollYProgress, [0.1, 0.45, 0.85], [0.2, 1, 0.4])
  const fullGlow = useMotionValue(0.5)
  const fullReveal = useMotionValue(100)
  const noDrift = useMotionValue(0)

  return (
    <section ref={ref} id="skills" className="relative w-full overflow-hidden py-24">
      <Dragon reveal={reduced ? fullReveal : scrollReveal} drift={reduced ? noDrift : scrollDrift} glow={reduced ? fullGlow : scrollGlow} />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 md:px-16">
        <SectionHeading tag="Skills" />
        <p className="w-full font-mono text-xs text-muted md:text-sm">
          <span className="text-accent">$</span> stack --count <span className="text-accent">→</span> {total} tools / {skillCategories.length} lanes
          <span className="hidden sm:inline"> · hover to throttle</span>
        </p>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-5xl flex-col gap-10 px-6 md:px-16">
        {skillCategories.map((category, i) => (
          <motion.div
            key={category.heading}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={withMotionPreference(fadeUp, reduced)}
          >
            <div className="relative mb-1 flex items-center gap-4">
              <span
                aria-hidden
                className="w-14 select-none text-center text-5xl font-black leading-none text-transparent md:text-6xl"
                style={{ WebkitTextStroke: '1px var(--color-accent)', opacity: 0.7 }}
              >
                {category.kanji}
              </span>
              <div className="min-w-0">
                <h3 className="text-xl font-bold tracking-wide text-ink md:text-2xl">{category.heading}</h3>
                <p className="font-mono text-xs text-muted">
                  <span className="text-accent">0{i + 1}</span> · {category.reading}
                </p>
              </div>
              <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent" />
            </div>
            <SkillMarquee skills={category.skills} reverse={i % 2 === 1} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
