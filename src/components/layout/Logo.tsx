import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useFinePointer } from '../../hooks/useFinePointer'
import { iosSpring, pointerSpring } from '../../lib/motion'

// Each click says the next line. After the hello they give away the site's hidden features.
const LINES = [
  "Hey! I'm Apurva",
  'psst — press ⌘K',
  'the notch up there plays music',
  'type sudo anywhere',
  'ok ok, that tickles',
]

// Pointer distance (px) at which the head is turned as far as it goes.
const LOOK_RANGE = 420

/**
 * The bitmoji in the navbar, behaving like it is alive: its head turns to follow the cursor
 * around the page, it leans into fast scrolling, perks up on hover, and hops and talks when
 * clicked. On touch and under reduced motion it falls back to the gentle idle sway.
 */
export function Logo() {
  const [clicks, setClicks] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const alive = fine && !reduced
  const ref = useRef<HTMLButtonElement>(null)

  const lookX = useSpring(useMotionValue(0), pointerSpring)
  const lookY = useSpring(useMotionValue(0), pointerSpring)
  const rotateY = useTransform(lookX, [-1, 1], [-24, 24])
  const rotateX = useTransform(lookY, [-1, 1], [18, -18])
  const x = useTransform(lookX, [-1, 1], [-3, 3])
  const y = useTransform(lookY, [-1, 1], [-2, 2])

  const { scrollY } = useScroll()
  const lean = useSpring(useTransform(useVelocity(scrollY), [-2600, 2600], [-14, 14], { clamp: true }), pointerSpring)

  useEffect(() => {
    if (!alive) return
    const clamp = (v: number) => Math.max(-1, Math.min(1, v))
    const follow = (e: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      lookX.set(clamp((e.clientX - (rect.left + rect.width / 2)) / LOOK_RANGE))
      lookY.set(clamp((e.clientY - (rect.top + rect.height / 2)) / LOOK_RANGE))
    }
    // Faces forward again when the pointer leaves the page.
    const rest = () => {
      lookX.set(0)
      lookY.set(0)
    }
    window.addEventListener('pointermove', follow, { passive: true })
    document.documentElement.addEventListener('pointerleave', rest)
    return () => {
      window.removeEventListener('pointermove', follow)
      document.documentElement.removeEventListener('pointerleave', rest)
    }
  }, [alive, lookX, lookY])

  const play = () => {
    setClicks((c) => c + 1)
    setSpeaking(true)
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Apurva's avatar — click and it talks"
      data-cursor="say hi"
      onClick={play}
      className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent md:h-14 md:w-14"
    >
      {speaking && (
        <span
          key={`say-${clicks}`}
          role="status"
          onAnimationEnd={() => setSpeaking(false)}
          className="animate-pop-up pointer-events-none absolute -top-3 left-14 z-10 whitespace-nowrap rounded-full bg-surface px-3 py-1 font-mono text-sm text-accent shadow-card"
        >
          {LINES[(clicks - 1) % LINES.length]}
        </span>
      )}

      {/* Keyed on the click count so every click replays the hop from the start. */}
      <motion.span
        key={`hop-${clicks}`}
        className="block h-full w-full origin-bottom"
        animate={clicks > 0 && !reduced ? { y: [0, -9, 0], scaleY: [1, 1.1, 0.9, 1], scaleX: [1, 0.94, 1.07, 1] } : undefined}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.img
          src="/assets/img/bitmojee-removebg-preview.png"
          alt=""
          draggable={false}
          style={alive ? { rotateX, rotateY, x, y, rotate: lean, transformPerspective: 260 } : undefined}
          whileHover={alive ? { scale: 1.16 } : undefined}
          whileTap={alive ? { scale: 0.92 } : undefined}
          transition={iosSpring}
          className={`h-full w-full origin-bottom object-contain ${alive || reduced ? '' : 'animate-headshake'}`}
        />
      </motion.span>
    </button>
  )
}
