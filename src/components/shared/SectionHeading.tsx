import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'
interface SectionHeadingProps {
  tag: string
}

export function SectionHeading({ tag }: SectionHeadingProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="flex w-full min-w-0 items-center gap-3"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={withMotionPreference(fadeUp, reduced)}
    >
      <h2 className="flex-shrink-0 text-3xl font-medium text-gradient-accent md:text-4xl">{`</${tag}>`}</h2>
      <span className="h-px min-w-[1.5rem] max-w-48 flex-1 bg-gradient-to-r from-accent to-accent-deep md:max-w-72" />
    </motion.div>
  )
}
