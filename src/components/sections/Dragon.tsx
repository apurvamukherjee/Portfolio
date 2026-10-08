import { motion, type MotionValue } from 'framer-motion'

interface DragonProps {
  /** 0 → 100: how far down the art the soft wipe has travelled. */
  reveal: MotionValue<number>
  drift: MotionValue<number>
}

const SOFT_EDGE = 18

/** Line-art dragon used as a tinted alpha mask, so one asset follows the accent color in both themes. */
export function Dragon({ reveal, drift }: DragonProps) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 aspect-[502/742] -translate-x-1/2"
      style={{
        y: drift,
        ['--reveal' as string]: reveal,
        maskImage: `linear-gradient(to bottom, #000 calc(var(--reveal) * 1%), transparent calc(var(--reveal) * 1% + ${SOFT_EDGE}%))`,
        WebkitMaskImage: `linear-gradient(to bottom, #000 calc(var(--reveal) * 1%), transparent calc(var(--reveal) * 1% + ${SOFT_EDGE}%))`,
      }}
    >
      <div
        className="h-full w-full bg-accent opacity-[0.13] [[data-theme=light]_&]:opacity-[0.18]"
        style={{
          maskImage: 'url(/assets/img/dragon.webp)',
          WebkitMaskImage: 'url(/assets/img/dragon.webp)',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </motion.div>
  )
}
