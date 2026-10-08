import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const PETALS = 9
const BURST = 18
const LANTERNS = [
  { x: 112, delay: 1.2, swing: 1 },
  { x: 288, delay: 1.35, swing: -1 },
] as const

function Petals({ count, burst }: { count: number; burst?: boolean }) {
  return Array.from({ length: count }, (_, i) => (
    <span
      key={i}
      aria-hidden
      className="sakura-petal"
      style={{
        left: `${(i * 37 + (burst ? 11 : 5)) % 100}%`,
        animationDelay: `${burst ? (i % 5) * 0.07 : i * 0.9}s`,
        animationDuration: `${burst ? 2.2 : 7 + (i % 4)}s`,
        animationIterationCount: burst ? 1 : 'infinite',
        ['--drift' as string]: `${(i % 2 ? 1 : -1) * (20 + (i % 5) * 12)}px`,
      }}
    />
  ))
}

function Lantern({ x, delay, swing, ring, lit, reduced }: { x: number; delay: number; swing: number; ring: number; lit: boolean; reduced: boolean }) {
  return (
    <motion.g
      initial={reduced ? false : { y: -70, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 110, damping: 10, delay }}
    >
      <motion.g
        animate={reduced ? undefined : { rotate: [0, 3 * swing, -3 * swing, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ originX: 0.5, originY: 0 }}
      >
        <motion.g
          key={ring}
          animate={ring && !reduced ? { rotate: [0, 20 * swing, -15 * swing, 9 * swing, -4 * swing, 0] } : undefined}
          transition={{ duration: 2.4, ease: 'easeOut' }}
          style={{ originX: 0.5, originY: 0 }}
        >
          <line x1={x} y1="192" x2={x} y2="206" stroke="#111" strokeWidth="1.5" />
          <motion.ellipse
            cx={x}
            cy="226"
            rx="30"
            ry="30"
            fill="#ffb347"
            animate={reduced ? { opacity: lit ? 0.45 : 0.2 } : { opacity: lit ? [0.35, 0.65, 0.35] : [0.12, 0.28, 0.12] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'blur(9px)' }}
          />
          <rect x={x - 8} y="204" width="16" height="5" rx="1" fill="#111" />
          <ellipse cx={x} cy="226" rx="14" ry="18" className="fill-accent" stroke="#111" strokeWidth="1" />
          <path d={`M${x - 14} 226 H${x + 14} M${x - 12} 217 H${x + 12} M${x - 12} 235 H${x + 12}`} stroke="#111" strokeOpacity="0.35" strokeWidth="0.8" />
          <rect x={x - 8} y="241" width="16" height="5" rx="1" fill="#111" />
          <text x={x} y="230" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="serif">祭</text>
        </motion.g>
      </motion.g>
    </motion.g>
  )
}

function Gate({ reduced, ring, lit }: { reduced: boolean; ring: number; lit: boolean }) {
  const uid = useId()
  const grad = `lacquer-${uid}`
  const view = { once: true } as const
  const rise = (delay: number) => ({
    initial: reduced ? false : { scaleY: 0 },
    whileInView: { scaleY: 1 },
    viewport: view,
    transition: { type: 'spring' as const, stiffness: 80, damping: 15, delay },
    style: { originX: 0.5, originY: 1 },
  })
  const drop = (delay: number) => ({
    initial: reduced ? false : { y: -60, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: view,
    transition: { type: 'spring' as const, stiffness: 130, damping: 13, delay },
  })

  return (
    <svg viewBox="0 0 400 620" className="absolute inset-0 z-10 h-full w-full overflow-visible transition-[filter] duration-300 group-has-focus-visible:[filter:drop-shadow(0_0_8px_var(--color-accent))]" aria-hidden focusable="false">
      <defs>
        <linearGradient id={grad} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="600" rx="170" ry="9" fill="#000" opacity="0.22" />

      {[
        'M48 100 L72 100 L58 582 L34 582Z',
        'M328 100 L352 100 L366 582 L342 582Z',
      ].map((d) => (
        <motion.g key={d} {...rise(d.startsWith('M48') ? 0 : 0.12)}>
          <path d={d} className="fill-accent" />
          <path d={d} fill={`url(#${grad})`} />
        </motion.g>
      ))}
      <rect x="30" y="580" width="32" height="14" rx="2" fill="#111" />
      <rect x="338" y="580" width="32" height="14" rx="2" fill="#111" />

      <motion.g {...(reduced ? {} : { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: view, transition: { duration: 0.7, delay: 0.7, ease: 'easeOut' as const } })}>
        <rect x="18" y="172" width="364" height="20" className="fill-accent" />
        <rect x="18" y="172" width="364" height="20" fill="#000" opacity="0.14" />
        <path d="M52 192 L72 192 L72 202Z M348 192 L328 192 L328 202Z" fill="#111" />
      </motion.g>

      <motion.g {...drop(0.9)}>
        <rect x="182" y="124" width="36" height="48" fill="#111" stroke="#f5c542" strokeWidth="1.5" />
        <text x="200" y="146" textAnchor="middle" fontSize="15" fill="#f5c542" fontFamily="serif">卒</text>
        <text x="200" y="164" textAnchor="middle" fontSize="15" fill="#f5c542" fontFamily="serif">業</text>
      </motion.g>

      <motion.g {...drop(0.5)}>
        <path d="M14 78 C70 92 130 95 200 95 C270 95 330 92 386 78 L382 106 C330 120 270 122 200 122 C130 122 70 120 18 106Z" className="fill-accent" />
        <path d="M14 78 C70 92 130 95 200 95 C270 95 330 92 386 78 L382 106 C330 120 270 122 200 122 C130 122 70 120 18 106Z" fill="#000" opacity="0.1" />
        <path d="M-6 30 C44 56 120 62 200 62 C280 62 356 56 406 30 L400 58 C350 82 280 86 200 86 C120 86 50 82 0 58Z" fill="#141414" />
        <path d="M-6 30 C44 56 120 62 200 62 C280 62 356 56 406 30" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.2" />
      </motion.g>

      {LANTERNS.map((l) => (
        <Lantern key={l.x} {...l} ring={ring} lit={lit} reduced={reduced} />
      ))}

      <motion.g
        initial={reduced ? false : { scale: 2.6, opacity: 0, rotate: -24 }}
        whileInView={{ scale: 1, opacity: 1, rotate: -8 }}
        viewport={view}
        transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 1.6 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <rect x="84" y="528" width="46" height="46" rx="3" className="fill-accent" />
        <text x="107" y="561" textAnchor="middle" fontSize="32" fontWeight="700" fill="#fff" fontFamily="serif">卒</text>
      </motion.g>
    </svg>
  )
}

/** Torii portrait: gate parts follow real shinmei/ise anatomy. Tilt is mouse-only (a finger can't hover and tilt fights scroll); tap/Enter rings the lanterns. */
export function PortraitFrame({ src, alt }: { src: string; alt: string }) {
  const reduced = !!useReducedMotion()
  const [bursts, setBursts] = useState(0)
  const [lit, setLit] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 140, damping: 16 }
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), spring)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), spring)
  const photoX = useSpring(useTransform(mx, [-0.5, 0.5], [6, -6]), spring)
  const photoY = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), spring)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const settle = () => {
    mx.set(0)
    my.set(0)
    setLit(false)
  }
  const ring = () => setBursts((b) => b + 1)
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    ring()
  }

  return (
    <div className="group relative mx-auto w-full" style={{ perspective: 1000 }}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Graduation portrait — activate to ring the lanterns"
        onPointerMove={onMove}
        onPointerEnter={(e) => e.pointerType !== 'touch' && setLit(true)}
        onPointerLeave={settle}
        onFocus={() => setLit(true)}
        onBlur={settle}
        onClick={ring}
        onKeyDown={onKey}
        style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, touchAction: 'pan-y' }}
        className="relative aspect-[400/620] w-full cursor-pointer select-none outline-none"
      >
        <motion.div className="absolute overflow-hidden bg-surface" style={{ left: '17%', right: '17%', top: '30.8%', bottom: '4.5%', x: reduced ? 0 : photoX, y: reduced ? 0 : photoY, scale: 1.06 }}>
          <img src={src} alt={alt} draggable={false} className="h-full w-full object-cover" style={{ objectPosition: '50% 60%' }} />
          <span aria-hidden className="shoji-grid pointer-events-none absolute inset-0 transition-opacity duration-500" style={{ opacity: lit ? 1 : 0 }} />
        </motion.div>

        <Gate reduced={reduced} ring={bursts} lit={lit} />

        {!reduced && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            <Petals count={PETALS} />
            {bursts > 0 && <Petals key={bursts} count={BURST} burst />}
          </div>
        )}
      </motion.div>
      <p aria-hidden className="mt-3 text-center font-serif text-xs tracking-[0.4em] text-accent">卒業 · 二〇二六</p>
    </div>
  )
}
