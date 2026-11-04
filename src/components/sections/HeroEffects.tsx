import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useMagnetic } from '../../hooks/useMagnetic'
import { iosSpring } from '../../lib/motion'

/** Writes the pointer position into --x / --y on the element, without re-rendering. */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--x', `${e.clientX - rect.left}px`)
  el.style.setProperty('--y', `${e.clientY - rect.top}px`)
}

const GLYPHS = '!<>-_\\/[]{}=+*^?#01'
const SCRAMBLE_MS = 650

/**
 * Text that "decodes" from random glyphs into itself: once when `play` turns true (after `delay`
 * ms), and again on every hover. The real text keeps its place in the layout and the scramble is
 * drawn over it, so even in a proportional font the line never reflows.
 */
export function ScrambleText({
  text,
  play = false,
  delay = 0,
  className = '',
}: {
  text: string
  play?: boolean
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const [out, setOut] = useState(text)
  const raf = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const run = useCallback(() => {
    if (reduced) return
    cancelAnimationFrame(raf.current)
    const t0 = performance.now()
    const duration = Math.max(SCRAMBLE_MS, text.length * 28)
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const settled = Math.floor(p * text.length)
      setOut(
        [...text]
          .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [reduced, text])

  useEffect(() => {
    if (play) timer.current = setTimeout(run, delay)
    return () => {
      clearTimeout(timer.current)
      cancelAnimationFrame(raf.current)
    }
  }, [play, delay, run])

  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`} onPointerEnter={run}>
      {/* The real words: they set the size and are what screen readers announce and what gets copied.
          Drawn transparent so only the overlay shows; selection colours them back in. */}
      <span className="text-transparent selection:text-white">{text}</span>
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 select-none">
        {out}
      </span>
    </span>
  )
}

/**
 * The name heading. A red spotlight follows the cursor across the letters (an accent copy of the
 * text, masked to a circle around the pointer), and the full stop hops when you hover.
 */
export function SpotlightName({ name }: { name: string }) {
  return (
    <span className="group/name relative inline-block cursor-default" onPointerMove={trackPointer}>
      <span>{name}</span>
      <span
        aria-hidden
        className="name-spotlight pointer-events-none absolute inset-0 text-gradient-accent opacity-0 transition-opacity duration-300 group-hover/name:opacity-100"
      >
        {name}
      </span>
      <span className="name-dot inline-block text-accent">.</span>
    </span>
  )
}

/** Primary CTA: drifts toward the cursor, and a band of light sweeps across on hover. */
export function MagneticButton({ href, onClick, children }: { href: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; children: ReactNode }) {
  const reduced = useReducedMotion()
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLAnchorElement>(0.25)
  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={reduced ? undefined : onMouseMove}
      onMouseLeave={reduced ? undefined : onMouseLeave}
      style={reduced ? undefined : { x, y }}
      whileTap={{ scale: 0.96 }}
      transition={iosSpring}
      className="hover-shine group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--color-accent)] transition-shadow duration-300 hover:shadow-[0_16px_44px_-8px_var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-6"
    >
      {children}
    </motion.a>
  )
}

/** Secondary CTA: a soft accent glow follows the cursor inside the pill. */
export function GlowButton({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onPointerMove={trackPointer}
      className="cursor-glow group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full border border-border bg-surface-raised px-5 text-sm font-semibold text-ink transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 sm:px-6"
    >
      {children}
    </a>
  )
}

/** Icon link that lifts, tints, and shows its name in a tooltip on hover/focus. */
export function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full text-muted transition-[color,background-color,transform] duration-300 hover:-translate-y-1 hover:bg-surface-raised hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 font-mono text-[10px] text-ink opacity-0 shadow-card transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </a>
  )
}

/** An inline tech name: lights up in its brand colour with an underline that draws in on hover. */
export function TechWord({ children, color, play, delay }: { children: string; color: string; play?: boolean; delay?: number }) {
  return (
    <span className="tech-word cursor-default font-medium text-ink/85" style={{ ['--brand' as string]: color }}>
      <ScrambleText text={children} play={play} delay={delay} />
    </span>
  )
}
