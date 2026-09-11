import { Fragment, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { TbArrowNarrowRight } from 'react-icons/tb'
import { experience } from '../../data/experience'
import { SectionHeading } from '../shared/SectionHeading'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'
import { ExperienceNode } from './ExperienceNode'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Experience() {
  const reduced = useReducedMotion()
  const rolesRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: rolesRef, offset: ['start 0.8', 'end 0.3'] })
  const connectorFill = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 })

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
              ref={rolesRef}
              className="flex flex-col items-stretch gap-4 sm:flex-row"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.15)}
            >
              {experience.roles.map((role, i) => (
                <Fragment key={role.role}>
                  <motion.div variants={withMotionPreference(fadeUp, reduced)} className="flex-1">
                    <ExperienceNode {...role} />
                  </motion.div>
                  {i < experience.roles.length - 1 && (
                    <div aria-hidden className="flex items-center justify-center py-2 text-accent sm:py-0">
                      <div className="rotate-90 sm:rotate-0">
                        <motion.div
                          style={{ opacity: reduced ? 1 : connectorFill }}
                          animate={reduced ? undefined : { x: [0, 6, 0] }}
                          transition={reduced ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <TbArrowNarrowRight size={26} strokeWidth={2} />
                        </motion.div>
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </motion.div>
          </GradientSweepCard>
        </motion.div>
      </div>
    </section>
  )
}
