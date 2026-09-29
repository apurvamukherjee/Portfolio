import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { ImageLightbox, type ZoomSource } from './ImageLightbox'

const INTERVAL_MS = 2200

interface ImageSlideshowProps {
  images: string[]
  alt: string
  fit: 'cover' | 'contain'
}

export function ImageSlideshow({ images, alt, fit }: ImageSlideshowProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [zoom, setZoom] = useState<ZoomSource | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const hasMultiple = images.length > 1
  const src = images[index]
  const screenAlt = `${alt} — screen ${index + 1} of ${images.length}`

  useEffect(() => {
    if (!hasMultiple || paused || zoom || reduced) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL_MS)
    return () => clearInterval(timer)
  }, [hasMultiple, paused, zoom, reduced, images.length])

  const goTo = (next: number) => setIndex((next + images.length) % images.length)

  function openZoom() {
    const container = containerRef.current
    if (!container || !src) return
    const from = container.getBoundingClientRect()
    const img = container.querySelector<HTMLImageElement>(`img[src="${CSS.escape(src)}"]`)
    // Not decoded yet: fall back to the box's own aspect so the zoom still has sane geometry.
    const loaded = img && img.naturalWidth > 0
    setZoom({
      src,
      alt: screenAlt,
      from,
      naturalWidth: loaded ? img.naturalWidth : from.width,
      naturalHeight: loaded ? img.naturalHeight : from.height,
      fit,
    })
  }

  return (
    <div
      ref={containerRef}
      className="group/slide relative h-full w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt={screenAlt}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`absolute inset-0 h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      </AnimatePresence>

      {/* Sits under the arrows and dots (later siblings), so those still get their own clicks. */}
      <button
        type="button"
        onClick={openZoom}
        aria-label={`View ${screenAlt} full size`}
        className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      />

      {createPortal(
        <AnimatePresence>{zoom && <ImageLightbox key={zoom.src} {...zoom} onClose={() => setZoom(null)} />}</AnimatePresence>,
        document.body,
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/slide:opacity-100"
          >
            <TbChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/slide:opacity-100"
          >
            <TbChevronRight size={18} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-accent' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
