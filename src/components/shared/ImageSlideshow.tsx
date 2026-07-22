import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface ImageSlideshowProps {
  images: string[]
  alt: string
  className?: string
  intervalMs?: number
  fit?: 'cover' | 'contain'
}

export function ImageSlideshow({ images, alt, className = '', intervalMs = 4000, fit = 'cover' }: ImageSlideshowProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const hasMultiple = images.length > 1

  useEffect(() => {
    if (!hasMultiple || paused || reduced) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs)
    return () => clearInterval(timer)
  }, [hasMultiple, paused, reduced, images.length, intervalMs])

  const goTo = (next: number) => setIndex((next + images.length) % images.length)

  return (
    <div
      className={`group/slide relative h-full w-full overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`${alt} — screen ${index + 1} of ${images.length}`}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`absolute inset-0 h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      </AnimatePresence>

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
