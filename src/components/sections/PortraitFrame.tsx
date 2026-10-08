import { useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const PETALS = 9
const BURST = 16

function Petals({ count, burst }: { count: number; burst?: boolean }) {
  return Array.from({ length: count }, (_, i) => (
    <span
      key={i}
      aria-hidden
      className="sakura-petal"
      style={{
        left: `${(i * 37 + (burst ? 11 : 5)) % 100}%`,
        animationDelay: `${burst ? (i % 4) * 0.08 : i * 0.9}s`,
        animationDuration: `${burst ? 2.2 : 7 + (i % 4)}s`,
        animationIterationCount: burst ? 1 : 'infinite',
        ['--drift' as string]: `${(i % 2 ? 1 : -1) * (20 + (i % 5) * 12)}px`,
      }}
    />
  ))
}

/** Torii-gate portrait frame: tilts toward the cursor, drifts sakura, and bursts petals on click. */
export function PortraitFrame({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion()
  const [bursts, setBursts] = useState(0)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div style={{ perspective: 900 }} className="relative mx-auto w-full max-w-xs">
      <motion.div
        onPointerMove={reduced ? undefined : onMove}
        onPointerLeave={reset}
        onClick={() => setBursts((b) => b + 1)}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative cursor-pointer"
      >
        <span aria-hidden className="absolute -left-4 -right-4 -top-6 h-2.5 rounded-sm bg-accent shadow-card" style={{ transform: 'skewX(-6deg)' }} />
        <span aria-hidden className="absolute -left-2 -right-2 -top-3 h-1.5 bg-accent/80" />
        <span aria-hidden className="absolute -bottom-3 -left-3 -top-3 w-2 rounded-sm bg-accent/90" />
        <span aria-hidden className="absolute -bottom-3 -right-3 -top-3 w-2 rounded-sm bg-accent/90" />

        <div className="relative overflow-hidden border border-accent/60 bg-surface">
          <img src={src} alt={alt} className="aspect-[9/14] w-full object-cover" style={{ objectPosition: '50% 60%' }} />
          <span aria-hidden className="shoji-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span aria-hidden className="pointer-events-none absolute inset-2 border border-white/30" />
          {!reduced && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <Petals count={PETALS} />
              {bursts > 0 && <Petals key={bursts} count={BURST} burst />}
            </div>
          )}
        </div>

        <motion.span
          aria-hidden
          initial={reduced ? false : { scale: 2.4, opacity: 0, rotate: -20 }}
          whileInView={{ scale: 1, opacity: 1, rotate: -8 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.4 }}
          className="absolute -bottom-4 -left-4 flex h-12 w-12 items-center justify-center rounded-sm bg-accent font-serif text-2xl font-bold text-white shadow-card"
          style={{ translateZ: 40 }}
        >
          卒
        </motion.span>

        <span
          aria-hidden
          className="absolute -right-8 top-4 font-serif text-sm tracking-[0.3em] text-accent"
          style={{ writingMode: 'vertical-rl' }}
        >
          卒業 · 二〇二六
        </span>
      </motion.div>
    </div>
  )
}
