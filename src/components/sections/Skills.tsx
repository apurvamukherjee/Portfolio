import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { skillCategories } from '../../data/skills'
import { SectionHeading } from '../shared/SectionHeading'
import { SkillMarquee } from './SkillMarquee'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'

/** Hand-drawn serpentine dragon, outline only. Drawn on as the section scrolls through. */
function Dragon({ progress }: { progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const draw = useTransform(progress, [0.05, 0.75], [0, 1])
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 1000"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="var(--color-accent)"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
    >
      <circle cx="930" cy="200" r="120" strokeWidth="1" opacity="0.6" />
      <motion.path
        style={{ pathLength: draw }}
        strokeWidth="2.2"
        d="M1140 80 C 980 40, 900 190, 760 170 C 600 150, 560 330, 420 330 C 260 330, 220 500, 340 560 C 470 625, 640 560, 700 660 C 770 780, 540 820, 380 800 C 220 780, 120 880, 60 960"
      />
      <motion.path
        style={{ pathLength: draw }}
        strokeWidth="1"
        strokeDasharray="2 14"
        d="M1130 105 C 975 70, 905 215, 760 195 C 600 175, 545 355, 420 355 C 285 355, 250 490, 350 535 C 475 595, 665 535, 730 650 C 800 790, 550 850, 385 825"
      />
      <motion.path
        style={{ pathLength: draw }}
        strokeWidth="1.6"
        d="M1140 80 l-34 -30 m34 30 l-52 -2 m52 2 c20 14 46 14 70 -4 m-70 4 c30 30 -10 52 -42 46"
      />
    </svg>
  )
}

export function Skills() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Rows drift against their marquee direction as you scroll, for a layered parallax.
  const driftA = useTransform(scrollYProgress, [0, 1], [60, -60])
  const driftB = useTransform(scrollYProgress, [0, 1], [-60, 60])

  return (
    <section ref={ref} id="skills" className="relative w-full overflow-hidden py-24">
      {!reduced && <Dragon progress={scrollYProgress} />}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 md:px-16">
        <SectionHeading tag="Skills" />
      </div>

      <div className="relative mt-12 flex flex-col gap-14">
        {skillCategories.map((category, i) => (
          <motion.div
            key={category.heading}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={withMotionPreference(fadeUp, reduced)}
          >
            <div className="relative mx-auto mb-4 flex max-w-5xl items-center gap-4 px-6 md:px-16">
              <span
                aria-hidden
                className="select-none text-5xl font-black leading-none text-transparent md:text-6xl"
                style={{ WebkitTextStroke: '1px var(--color-accent)', opacity: 0.55 }}
              >
                {category.kanji}
              </span>
              <div>
                <h3 className="text-gradient-accent text-xl font-black tracking-widest md:text-2xl">{category.heading}</h3>
                <p className="font-mono text-xs text-muted">{category.reading}</p>
              </div>
            </div>
            <motion.div style={reduced ? undefined : { x: i % 2 ? driftB : driftA }}>
              <SkillMarquee skills={category.skills} reverse={i % 2 === 1} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
