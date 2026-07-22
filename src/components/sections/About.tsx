import { motion } from 'framer-motion'
import { SectionHeading } from '../shared/SectionHeading'
import { fadeUp, fadeDown, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function About() {
  const reduced = useReducedMotion()

  return (
    <section id="about" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <SectionHeading tag="AboutMe" />

        <motion.div
          className="mt-8 flex w-full flex-col items-center gap-12 md:flex-row md:items-start"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.15)}
        >
          <motion.div variants={withMotionPreference(fadeUp, reduced)} className="flex flex-col gap-5 md:w-3/5">
            <p className="text-lg leading-relaxed text-ink md:text-xl">
              I'm Apurva — a full-stack engineer and product builder based in Kolkata. I design systems, write
              production-grade APIs, and ship end-to-end features across web and mobile. What started as curiosity in
              2022 at KIIT University became real-world engineering: 50+ reusable React components, live production
              apps, and full ownership from technical spec to deployment.
            </p>
            <p className="text-lg leading-relaxed text-muted md:text-xl">
              At Mind Webs Ventures I've worn multiple hats — UI/UX intern, Founder's Office associate leading
              cross-functional delivery, and now engineering intern building full-stack web and mobile apps with
              React, React Native, Node.js, and MongoDB. I also represented the company at India Mobile Congress 2025
              in Delhi, and mentored students as a judge at DriveBlaze Hackathon.
            </p>
          </motion.div>

          <motion.div
            variants={withMotionPreference(fadeDown, reduced)}
            className="group relative w-full max-w-xs flex-shrink-0 md:w-2/5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 border-l-2 border-t-2 border-accent transition-transform duration-500 group-hover:-translate-x-3 group-hover:-translate-y-3"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 border-b-2 border-r-2 border-accent transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3"
            />
            <img
              src="/assets/img/frontface_resized.jpg"
              alt="Apurva Mukherjee"
              className="relative w-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
