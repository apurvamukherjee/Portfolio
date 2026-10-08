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

const LACQUER = 'bg-gradient-to-r from-black/25 via-transparent to-black/30'

function Lantern({ side, reduced }: { side: 'l' | 'r'; reduced: boolean }) {
  return (
    <motion.div
      aria-hidden
      className={`absolute top-[78px] z-10 flex flex-col items-center ${side === 'l' ? 'left-7' : 'right-7'}`}
      style={{ originY: 0, translateZ: 30 }}
      initial={reduced ? false : { y: -60, opacity: 0 }}
      whileInView={reduced ? undefined : { y: 0, opacity: 1, rotate: side === 'l' ? [0, 9, -7, 9, 0] : [0, -9, 7, -9, 0] }}
      viewport={{ once: true }}
      transition={{ y: { type: 'spring', stiffness: 120, damping: 9, delay: 1.1 }, opacity: { delay: 1.1 }, rotate: { delay: 1.5, duration: 3.6, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <span className="h-3 w-px bg-black/60" />
      <span className="lantern-glow flex h-9 w-7 items-center justify-center rounded-[45%] border border-black/40 bg-accent font-serif text-[11px] text-white">
        祭
      </span>
      <span className="h-1.5 w-3 bg-black/60" />
    </motion.div>
  )
}

function Gate({ reduced }: { reduced: boolean }) {
  const rise = (delay: number) => ({
    initial: reduced ? false : { scaleY: 0 },
    whileInView: { scaleY: 1 },
    viewport: { once: true },
    transition: { type: 'spring' as const, stiffness: 90, damping: 14, delay },
    style: { originY: 1, translateZ: 20 },
  })
  const drop = (delay: number) => ({
    initial: reduced ? false : { y: -50, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true },
    transition: { type: 'spring' as const, stiffness: 140, damping: 12, delay },
  })

  return (
    <>
      <motion.span aria-hidden className={`absolute bottom-0 left-0 top-6 w-3.5 bg-accent ${LACQUER}`} {...rise(0)} />
      <motion.span aria-hidden className={`absolute bottom-0 right-0 top-6 w-3.5 bg-accent ${LACQUER}`} {...rise(0.1)} />
      <span aria-hidden className="absolute bottom-0 left-[-3px] h-3 w-5 bg-black/80" />
      <span aria-hidden className="absolute bottom-0 right-[-3px] h-3 w-5 bg-black/80" />

      <motion.svg aria-hidden viewBox="0 0 400 44" className="absolute -left-6 -right-6 -top-1 z-10 w-[calc(100%+3rem)] drop-shadow-lg" {...drop(0.5)}>
        <path d="M0 6 Q80 22 200 22 Q320 22 400 6 L394 20 Q320 34 200 34 Q80 34 6 20Z" fill="#111" />
        <path d="M10 22 Q90 32 200 32 L200 40 Q90 40 14 30Z M390 22 Q310 32 200 32 L200 40 Q310 40 386 30Z" className="fill-accent" />
      </motion.svg>

      <motion.span
        aria-hidden
        className="absolute left-1/2 top-[42px] z-10 flex h-[34px] w-8 -translate-x-1/2 items-center justify-center border border-amber-300/80 bg-black/85 font-serif text-[10px] leading-none text-amber-200 [writing-mode:vertical-rl]"
        {...drop(0.9)}
      >
        卒業
      </motion.span>
      <motion.span aria-hidden className={`absolute left-0 right-0 top-[78px] h-2.5 bg-accent ${LACQUER}`} initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }} />

      <Lantern side="l" reduced={reduced} />
      <Lantern side="r" reduced={reduced} />
    </>
  )
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
    <div style={{ perspective: 900 }} className="relative mx-auto w-full max-w-xs pb-3">
      <motion.div
        onPointerMove={reduced ? undefined : onMove}
        onPointerLeave={reset}
        onClick={() => setBursts((b) => b + 1)}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative cursor-pointer"
      >
        <Gate reduced={!!reduced} />
        <div className="relative mx-5 mt-[88px] overflow-hidden border border-accent/60 bg-surface">
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
          className="absolute -bottom-4 left-0 flex h-12 w-12 items-center justify-center rounded-sm bg-accent font-serif text-2xl font-bold text-white shadow-card"
          style={{ translateZ: 40 }}
        >
          卒
        </motion.span>

        <span
          aria-hidden
          className="absolute -right-9 top-24 font-serif text-sm tracking-[0.3em] text-accent"
          style={{ writingMode: 'vertical-rl' }}
        >
          卒業 · 二〇二六
        </span>
      </motion.div>
    </div>
  )
}
