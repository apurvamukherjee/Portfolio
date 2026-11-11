import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'

interface SectionHeadingProps {
  tag: string
  /** Chapter number, 1-based. Drawn as a kanji numeral: the one Japanese mark every section carries. */
  index: number
}

const KANJI = ['一', '二', '三', '四', '五', '六']

export function SectionHeading({ tag, index }: SectionHeadingProps) {
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
      <span aria-hidden className="ml-auto flex flex-shrink-0 items-center gap-2">
        <span className="font-mono text-xs text-muted">0{index}</span>
        <span className="select-none text-2xl font-black leading-none text-accent/80 md:text-3xl">{KANJI[index - 1]}</span>
      </span>
    </motion.div>
  )
}
