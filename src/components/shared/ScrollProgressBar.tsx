import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { trackSpring } from '../../lib/motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  const smoothed = useSpring(scrollYProgress, trackSpring)

  return (
    <motion.div
      style={{ scaleX: reduced ? scrollYProgress : smoothed }}
      className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-accent to-accent-deep"
      aria-hidden
    />
  )
}
