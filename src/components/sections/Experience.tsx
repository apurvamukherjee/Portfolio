import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { experience } from '../../data/experience'
import { SectionHeading } from '../shared/SectionHeading'
import { GradientSweepCard } from '../shared/GradientSweepCard'
import { Chip } from '../shared/Chip'
import { ExperienceNode } from './ExperienceNode'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Experience() {
  const reduced = useReducedMotion()

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
                      <svg viewBox="0 0 24 13" className="h-4 w-8 rotate-90 fill-none stroke-accent stroke-2 sm:rotate-0">
                        <motion.path
                          d="M1,6.5 L20,6.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={viewportOnce}
                          transition={{ duration: 0.6, delay: 0.3, ease: 'easeInOut' }}
                        />
                        <polyline points="16 1 23 6.5 16 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
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
