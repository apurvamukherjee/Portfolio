import { useId, useLayoutEffect, useRef } from 'react'
import { motion, useMotionValueEvent, type MotionValue } from 'framer-motion'

// Tail tip → neck. Each curve is its own segment so the body can taper from tail to neck.
const CURVES = [
  { d: 'M1150 60 C1020 20 930 150 820 190', w: 6 },
  { d: 'M820 190 C700 235 640 120 520 160', w: 12 },
  { d: 'M520 160 C380 205 300 330 360 440', w: 18 },
  { d: 'M360 440 C420 545 640 520 760 590', w: 26 },
  { d: 'M760 590 C900 670 880 820 740 860', w: 34 },
  { d: 'M740 860 C600 900 420 800 290 860', w: 40 },
  { d: 'M290 860 C260 880 230 860 200 830', w: 46 },
]
const SPINE = CURVES.map((c, i) => (i === 0 ? c.d : c.d.replace(/^M\S+ \S+ /, ''))).join(' ')

const LEGS = [0.46, 0.7]
const SPIKE = 16
const EDGE = 3

interface DragonProps {
  draw: MotionValue<number>
}

/** Eastern dragon, outline art. The body reveals tail→neck via a mask while the head rides the spine tip. */
export function Dragon({ draw }: DragonProps) {
  const maskId = useId()
  const spine = useRef<SVGPathElement>(null)
  const head = useRef<SVGGElement>(null)
  const pearl = useRef<SVGGElement>(null)
  const legs = useRef<(SVGGElement | null)[]>([])

  function pose(d: number) {
    const path = spine.current
    const h = head.current
    if (!path || !h) return
    const len = path.getTotalLength()
    const at = len * d
    const p = path.getPointAtLength(at)
    const q = path.getPointAtLength(Math.max(at - 4, 0))
    const a = (Math.atan2(p.y - q.y, p.x - q.x) * 180) / Math.PI
    const flip = Math.cos((a * Math.PI) / 180) < 0
    // Small scroll-driven sway so the head looks alive while it travels.
    const sway = 5 * Math.sin(d * 50)
    h.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${a + sway})${flip ? ' scale(1 -1)' : ''}`)
    h.style.opacity = d > 0.02 ? '1' : '0'
    legs.current.forEach((g, i) => {
      if (g) g.style.opacity = d >= LEGS[i] ? '1' : '0'
    })
    if (pearl.current) pearl.current.style.opacity = d > 0.88 ? '1' : '0'
  }

  useLayoutEffect(() => {
    const path = spine.current
    if (!path) return
    const len = path.getTotalLength()
    LEGS.forEach((f, i) => {
      const p = path.getPointAtLength(len * f)
      const q = path.getPointAtLength(len * f - 4)
      const a = (Math.atan2(p.y - q.y, p.x - q.x) * 180) / Math.PI
      legs.current[i]?.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${a})`)
    })
    pose(draw.get())
  }, [draw])

  useMotionValueEvent(draw, 'change', pose)

  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 1000"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="var(--color-accent)"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.55] [[data-theme=light]_&]:opacity-[0.7]"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="1000">
          <motion.path d={SPINE} stroke="white" strokeWidth="160" strokeLinecap="butt" style={{ pathLength: draw }} />
        </mask>
      </defs>
      <path ref={spine} d={SPINE} stroke="none" />

      <g mask={`url(#${maskId})`}>
        {CURVES.map((c) => (
          <path key={`s${c.d}`} d={c.d} strokeWidth={c.w + SPIKE} strokeDasharray="1.6 15" strokeLinecap="butt" opacity="0.7" />
        ))}
        {CURVES.map((c) => (
          <path key={`e${c.d}`} d={c.d} strokeWidth={c.w} />
        ))}
        {CURVES.map((c) => (
          <path key={`i${c.d}`} d={c.d} strokeWidth={c.w - EDGE} stroke="var(--color-surface)" />
        ))}
        {CURVES.map((c) => (
          <path key={`p${c.d}`} d={c.d} strokeWidth={c.w * 0.55} strokeDasharray="2.5 10" strokeLinecap="butt" opacity="0.55" />
        ))}
        <path d="M1150 60 c18 -4 34 -16 44 -34 M1150 60 c20 4 40 2 56 -8 M1150 60 c14 10 26 24 30 40" strokeWidth="2" />
      </g>

      {LEGS.map((f, i) => (
        <g key={f} ref={(el) => void (legs.current[i] = el)} className="transition-opacity duration-500">
          {[1, -1].map((side) => (
            <g key={side} transform={`scale(1 ${side})`}>
              <path d="M0 16 C8 34 -10 48 -2 66 C2 74 8 80 10 88" strokeWidth="11" />
              <path d="M0 16 C8 34 -10 48 -2 66 C2 74 8 80 10 88" strokeWidth={11 - EDGE} stroke="var(--color-surface)" />
              <path d="M10 88 l-6 10 M10 88 l6 11 M10 88 l16 6" strokeWidth="2" />
            </g>
          ))}
        </g>
      ))}

      <g ref={pearl} className="transition-opacity duration-700" style={{ opacity: 0 }}>
        <circle cx="70" cy="640" r="26" strokeWidth="2" />
        <path d="M58 640 a12 12 0 1 1 12 12" strokeWidth="1.4" />
        <path d="M70 600 v-14 M70 680 v14 M30 640 h-14 M110 640 h14 M42 612 l-10 -10 M98 612 l10 -10 M42 668 l-10 10 M98 668 l10 10" strokeWidth="1.4" />
      </g>

      <g ref={head} style={{ opacity: 0 }}>
        <path d="M-12 -24 C-40 -42 -62 -32 -92 -50 M-12 -8 C-50 -14 -78 0 -112 -12 M-12 8 C-46 16 -70 32 -98 30" strokeWidth="2" />
        <path d="M16 -48 C6 -80 -22 -104 -60 -108 M-6 -84 C-6 -100 -20 -112 -36 -118 M8 -66 C20 -90 44 -104 70 -102" strokeWidth="3" />
        <path d="M6 6 C-4 22 -2 36 -14 44 M20 10 C12 28 14 40 2 50" strokeWidth="1.8" />
        <path d="M10 14 C50 22 96 30 142 34 C148 38 144 44 134 44 C98 46 52 40 14 30 Z" fill="var(--color-surface)" strokeWidth="2.2" />
        <path d="M136 34 l3 -11 l5 11 M40 18 C70 24 100 26 126 28" strokeWidth="1.6" />
        <path
          d="M-12 -24 C4 -52 40 -62 74 -50 C92 -44 100 -36 112 -34 C128 -34 142 -40 154 -34 C164 -30 164 -18 152 -14 C138 -10 122 -8 106 -4 C80 4 40 6 10 12 C0 16 -6 20 -12 24 Z"
          fill="var(--color-surface)"
          strokeWidth="2.2"
        />
        <path d="M128 -9 l4 14 l5 -16 M100 -2 l3 11 l5 -13" strokeWidth="1.6" />
        <path d="M52 -34 Q66 -48 84 -36 Q68 -26 52 -34 Z" fill="var(--color-accent)" strokeWidth="1" />
        <path d="M68 -43 v14" stroke="var(--color-surface)" strokeWidth="1.8" />
        <path d="M46 -44 Q70 -62 98 -44 l8 4 M146 -26 q4 -5 9 -1" strokeWidth="2" />
        <g className="dragon-whisker">
          <path d="M152 -18 C190 -60 230 -30 270 -76 C278 -84 284 -82 288 -74" strokeWidth="1.6" />
          <path d="M140 38 C180 72 226 52 266 100" strokeWidth="1.6" />
        </g>
      </g>
    </svg>
  )
}
