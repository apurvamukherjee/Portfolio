import { motion } from 'framer-motion'
import { leadershipEvents } from '../../data/leadership'
import { SectionHeading } from '../shared/SectionHeading'
import { LeadershipCard } from './LeadershipCard'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Leadership() {
  const reduced = useReducedMotion()

  return (
    <section id="leadership" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <SectionHeading tag="Leadership" />

        <motion.div
          className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
        >
          {leadershipEvents.map((event) => (
            <motion.div key={event.title} variants={withMotionPreference(fadeUp, reduced)}>
              <LeadershipCard {...event} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
