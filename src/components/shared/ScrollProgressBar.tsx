import { motion, useScroll, useSpring } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  const smoothed = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX: reduced ? scrollYProgress : smoothed }}
      className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-accent to-accent-deep"
      aria-hidden
    />
  )
}
