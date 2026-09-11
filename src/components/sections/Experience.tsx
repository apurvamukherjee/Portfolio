import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { experience } from '../../data/experience'
import { SectionHeading } from '../shared/SectionHeading'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'
import { ExperienceNode } from './ExperienceNode'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Experience() {
  const reduced = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.8', 'end 0.3'] })
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 })

  return (
    <section id="experience" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
        <SectionHeading tag="Experience" />

        <motion.div
          className="mt-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={withMotionPreference(fadeUp, reduced)}
        >
          <GradientSweepCard tilt={false} className="flex flex-col gap-6 rounded-lg p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-ink md:text-3xl">{experience.name}</h3>
              <a
                href={experience.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                {experience.site}
              </a>
              <Chip variant="outline" className="ml-auto">
                {experience.duration}
              </Chip>
            </div>

            <p className="text-muted">{experience.subtitle}</p>

            <motion.div
              ref={timelineRef}
              className="relative flex flex-col gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.15)}
            >
              <div
                aria-hidden
                className="absolute bottom-[22px] left-[22px] top-[22px] w-0.5 overflow-hidden rounded-full bg-border"
              >
                <motion.div
                  className="w-full origin-top bg-gradient-to-b from-accent to-accent-deep"
                  style={{ height: '100%', scaleY: reduced ? 1 : progress }}
                />
              </div>

              {experience.roles.map((role) => (
                <motion.div key={role.role} variants={withMotionPreference(fadeUp, reduced)}>
                  <ExperienceNode {...role} />
                </motion.div>
              ))}
            </motion.div>
          </GradientSweepCard>
        </motion.div>
      </div>
    </section>
  )
}
