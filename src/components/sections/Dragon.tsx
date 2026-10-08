import { motion, useTransform, type MotionValue } from 'framer-motion'

interface DragonProps {
  /** 0 → 100: how far down the art the soft wipe has travelled. */
  reveal: MotionValue<number>
  drift: MotionValue<number>
  /** 0 → 1: scroll-driven glow strength. */
  glow: MotionValue<number>
}

const SOFT_EDGE = 18

/** Line-art dragon used as a tinted alpha mask, so one asset follows the accent color in both themes. */
export function Dragon({ reveal, drift, glow }: DragonProps) {
  const filter = useTransform(
    glow,
    (g) => `drop-shadow(0 0 ${6 + 18 * g}px color-mix(in srgb, var(--color-accent) ${40 + 50 * g}%, transparent))`,
  )
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 aspect-[502/742] -translate-x-1/2"
      style={{
        y: drift,
        filter,
      }}
    >
      <motion.div
        className="h-full w-full"
        style={{
          ['--reveal' as string]: reveal,
          maskImage: `linear-gradient(to bottom, #000 calc(var(--reveal) * 1%), transparent calc(var(--reveal) * 1% + ${SOFT_EDGE}%))`,
          WebkitMaskImage: `linear-gradient(to bottom, #000 calc(var(--reveal) * 1%), transparent calc(var(--reveal) * 1% + ${SOFT_EDGE}%))`,
        }}
      >
        <div
          className="dragon-art h-full w-full bg-accent"
          style={{
            maskImage: 'url(/assets/img/dragon.webp)',
            WebkitMaskImage: 'url(/assets/img/dragon.webp)',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
