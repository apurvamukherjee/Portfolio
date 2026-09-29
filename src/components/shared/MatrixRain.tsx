import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Theme } from '../../hooks/useTheme'

const LETTERS = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const FRAME_INTERVAL_MS = 40
const UNLOCKED_FRAME_INTERVAL_MS = 28

interface MatrixRainProps {
  theme: Theme
  /** Konami code: classic green rain, a little faster, shown even in light mode. */
  unlocked: boolean
}

/**
 * The falling-code background is a dark-mode signature — its fade trail continuously
 * layers translucent black, which reads fine on a black canvas but fights a light
 * background over time. So it only animates in dark mode; light mode gets a static,
 * non-animated backdrop instead of a rain effect that's constantly muddying the page.
 */
export function MatrixRain({ theme, unlocked }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const active = (theme === 'dark' || unlocked) && !reduced
  // Read inside the draw loop, so toggling the palette never restarts the animation.
  const unlockedRef = useRef(unlocked)
  unlockedRef.current = unlocked
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let fontSize = window.innerWidth < 768 ? 13 : 14
    let isMobile = window.innerWidth < 768
    let drops: number[] = []
    let rafId = 0
    let lastTime = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      isMobile = window.innerWidth < 768
      fontSize = isMobile ? 13 : 14
      const columns = Math.ceil(canvas.width / fontSize)
      drops = Array.from({ length: columns }, () => 1)
    }
    resize()

    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw)
      const green = unlockedRef.current
      if (time - lastTime < (green ? UNLOCKED_FRAME_INTERVAL_MS : FRAME_INTERVAL_MS)) return
      lastTime = time

      // Light mode only ever runs unlocked; fading toward the paper colour keeps text readable.
      const light = themeRef.current === 'light'
      ctx.fillStyle = light ? 'rgba(242, 237, 228, 0.08)' : isMobile ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = green ? (light ? '#1f9d4c' : '#00d04a') : isMobile ? '#7a0505' : '#4a0303'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = LETTERS[Math.floor(Math.random() * LETTERS.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    rafId = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  const toast = (
    <AnimatePresence>
      {unlocked && (
        <motion.p
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#00d04a]/40 bg-black/80 px-4 py-2 font-mono text-xs text-[#00d04a]"
        >
          ↑↑↓↓←→←→BA — welcome to the real Matrix
        </motion.p>
      )}
    </AnimatePresence>
  )

  if (!active) {
    return (
      <>
        <div className="fixed inset-0 -z-10 bg-surface" aria-hidden />
        {toast}
      </>
    )
  }

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 opacity-90 md:opacity-70" aria-hidden />
      {toast}
    </>
  )
}
