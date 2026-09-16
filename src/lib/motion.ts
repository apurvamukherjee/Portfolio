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
export function withMotionPreference(variant: Variants, reduced: boolean | null): Variants {
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

/**
 * Apple's UIKit-ish spring. Slightly underdamped so things settle with one small overshoot
 * instead of easing flatly to a stop — that overshoot is most of what reads as "iOS".
 */
export const iosSpring = { type: 'spring', stiffness: 380, damping: 30, mass: 0.9 } as const

/** Softer variant for larger surfaces (sheets, modals) where a bouncy overshoot looks cheap. */
export const iosSpringSoft = { type: 'spring', stiffness: 260, damping: 32, mass: 1 } as const

/** Apple's standard ease curve, for properties springs can't drive (opacity, colors, width). */
export const appleEase = [0.32, 0.72, 0, 1] as const
