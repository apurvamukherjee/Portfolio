import { motion } from 'framer-motion'
import { projects } from '../../data/projects'
import { SectionHeading } from '../shared/SectionHeading'
import { ProjectCard } from './ProjectCard'
import { fadeUp, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Projects() {
  const reduced = useReducedMotion()

  return (
    <section id="projects" className="w-full px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <SectionHeading tag="Projects" />

        <motion.div
          className="mt-8 flex w-full flex-col gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
        >
          {projects.map((project) => (
            <motion.div key={project.name} variants={withMotionPreference(fadeUp, reduced)}>
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
