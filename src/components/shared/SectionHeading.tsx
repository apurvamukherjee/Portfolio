import { motion } from 'framer-motion'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface SectionHeadingProps {
  tag: string
  as?: 'h2' | 'h1'
}

export function SectionHeading({ tag, as: As = 'h2' }: SectionHeadingProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="flex w-full min-w-0 items-center gap-3"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={withMotionPreference(fadeUp, reduced)}
    >
      <As className="flex-shrink-0 text-3xl font-medium text-gradient-accent md:text-4xl">{`</${tag}>`}</As>
      <span className="h-px min-w-[1.5rem] max-w-48 flex-1 bg-gradient-to-r from-accent to-accent-deep md:max-w-72" />
    </motion.div>
  )
}
