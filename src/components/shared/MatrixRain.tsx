import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Theme } from '../../hooks/useTheme'

const LETTERS = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const FRAME_INTERVAL_MS = 40

interface MatrixRainProps {
  theme: Theme
}

/**
 * The falling-code background is a dark-mode signature — its fade trail continuously
 * layers translucent black, which reads fine on a black canvas but fights a light
 * background over time. So it only animates in dark mode; light mode gets a static,
 * non-animated backdrop instead of a rain effect that's constantly muddying the page.
 */
export function MatrixRain({ theme }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const active = theme === 'dark' && !reduced

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
      if (time - lastTime < FRAME_INTERVAL_MS) return
      lastTime = time

      ctx.fillStyle = isMobile ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = isMobile ? '#7a0505' : '#4a0303'
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

  if (!active) {
    return <div className="fixed inset-0 -z-10 bg-surface" aria-hidden />
  }

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 opacity-90 md:opacity-70" aria-hidden />
}
