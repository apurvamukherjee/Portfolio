import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

/** Degrades any movement-based variant to a fade-only equivalent under prefers-reduced-motion. */
export function withMotionPreference(variant: Variants, reduced: boolean): Variants {
  if (!reduced) return variant
  return fadeIn
}

export function staggerContainer(staggerChildren = 0.12, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

/**
 * A fast/instant scroll (anchor-link nav jump, scrollIntoView, a hard flick) can skip clean over
 * a narrow intersection window in a single frame, leaving whileInView content stuck at opacity:0
 * forever since `once: true` never gets a second chance. The large margin makes the detection zone
 * much bigger than the viewport itself so a big jump still has to pass through it.
 */
export const viewportOnce = { once: true, amount: 0, margin: '200px 0px 200px 0px' } as const
