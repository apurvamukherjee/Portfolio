import { useEffect, useEffectEvent, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TbX } from 'react-icons/tb'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { iosSpringSoft } from '../../lib/motion'

export interface ZoomSource {
  src: string
  alt: string
  /** On-screen box the image was shown in, so the zoom can grow out of it and shrink back. */
  from: DOMRect
  naturalWidth: number
  naturalHeight: number
  fit: 'cover' | 'contain'
}

interface ImageLightboxProps extends ZoomSource {
  onClose: () => void
}

const RADIUS = 12

/**
 * Full-screen view of one screenshot. The image is laid out once at its final size and only
 * transform + clip-path animate, so the zoom stays on the compositor — no width/height tweening.
 */
export function ImageLightbox({ src, alt, from, naturalWidth, naturalHeight, fit, onClose }: ImageLightboxProps) {
  const reduced = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const close = useEffectEvent(onClose)
  useLockBodyScroll(true)

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    // Capture phase on window runs before OpenBook's document-level Escape handler, so closing the
    // zoom doesn't also close the book underneath it.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      close()
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])

  const vw = window.innerWidth
  const vh = window.innerHeight
  const finalScale = Math.min((vw * 0.92) / naturalWidth, (vh * 0.84) / naturalHeight, 2)
  const width = naturalWidth * finalScale
  const height = naturalHeight * finalScale

  // Match what the thumbnail actually showed: contain-fit whole, or cover-fit cropped to its box.
  const fitScale = (fit === 'cover' ? Math.max : Math.min)(from.width / naturalWidth, from.height / naturalHeight)
  const startScale = (naturalWidth * fitScale) / width
  const cropX = Math.max(0, (naturalWidth * fitScale - from.width) / 2) / startScale
  const cropY = Math.max(0, (naturalHeight * fitScale - from.height) / 2) / startScale

  const collapsed = {
    x: from.left + from.width / 2 - vw / 2,
    y: from.top + from.height / 2 - vh / 2,
    scale: startScale,
    clipPath: `inset(${cropY}px ${cropX}px round ${RADIUS / startScale}px)`,
  }
  const expanded = { x: 0, y: 0, scale: 1, clipPath: `inset(0px 0px round ${RADIUS}px)` }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[110]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, delay: reduced ? 0 : 0.25 } }}
      transition={{ duration: 0.2 }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.img
        src={src}
        alt={alt}
        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
        style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2 }}
        initial={reduced ? { ...expanded, opacity: 0 } : collapsed}
        animate={{ ...expanded, opacity: 1 }}
        exit={reduced ? { opacity: 0 } : collapsed}
        transition={reduced ? { duration: 0.15 } : iosSpringSoft}
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close full-size image"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <TbX size={20} />
      </button>
    </motion.div>
  )
}
