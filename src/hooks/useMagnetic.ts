import { useRef, type MouseEvent } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { pointerSpring } from '../lib/motion'

/** Subtle "magnetic" pull toward the cursor — the button drifts slightly within its own bounds on hover. */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, pointerSpring)
  const y = useSpring(rawY, pointerSpring)

  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    rawX.set((e.clientX - rect.left - rect.width / 2) * strength)
    rawY.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  const onMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return { ref, x, y, onMouseMove, onMouseLeave }
}
