import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { introImages, introHeroImage } from '../../data/introImages'

type Phase = 'grid' | 'zoom' | 'reveal' | 'done'

const ZOOM_EASE = [0.83, 0, 0.17, 1] as const
const GRID_DURATION = 2800
const ZOOM_DURATION = 1000
const REVEAL_DURATION = 600

interface PreloaderProps {
  onComplete: () => void
}

const COLUMN_COUNT = 4
const backgroundImages = introImages.filter((src) => src !== introHeroImage)

function splitIntoColumns(images: string[], columns: number): string[][] {
  const cols: string[][] = Array.from({ length: columns }, () => [])
  images.forEach((src, i) => cols[i % columns].push(src))
  return cols
}

const columns = splitIntoColumns(backgroundImages, COLUMN_COUNT)
const SIGNATURE = ['B', 'y', ' ', 'A', 'p', 'u', 'r', 'v', 'a']

/** One-time cinematic intro: shuffling photo grid → a chosen tile zooms fullscreen → fades to reveal the real page. */
export function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<Phase>('grid')
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const p = Math.min(100, Math.round(((now - start) / GRID_DURATION) * 100))
      setPercent(p)
      if (p < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('zoom'), GRID_DURATION)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase !== 'zoom') return
    const t = setTimeout(() => setPhase('reveal'), ZOOM_DURATION)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'reveal') return
    const t = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, REVEAL_DURATION)
    return () => clearTimeout(t)
  }, [phase, onComplete])

  const showChrome = phase === 'grid'
  const zoomedIn = phase === 'zoom' || phase === 'reveal'

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pointer-events-none absolute inset-6 sm:inset-10 md:inset-16">
            <AnimatePresence>
              {showChrome && (
                <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-white/30" />
                  <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-white/30" />
                  <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/30" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/30" />
                  <div className="absolute -bottom-8 left-0 text-[11px] tracking-widest text-white/50">
                    [ APURVA MUKHERJEE ]
                  </div>
                  <div className="absolute -bottom-8 right-0 text-[11px] tracking-widest text-white/50">
                    [ {String(percent).padStart(2, '0')} PERCENT ]
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex h-[72vh] w-[85vw] max-w-5xl items-center justify-center">
            <motion.div
              animate={{ opacity: showChrome ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4"
            >
              {columns.map((col, i) => (
                <div key={i} className="relative overflow-hidden rounded-md">
                  <motion.div
                    animate={{ y: i % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                    transition={{ duration: 7 + i, repeat: Infinity, ease: 'linear' }}
                    className="flex flex-col gap-2 sm:gap-3"
                  >
                    {[...col, ...col].map((src, j) => (
                      <img
                        key={j}
                        src={src}
                        alt=""
                        aria-hidden
                        className="h-40 w-full flex-shrink-0 rounded-md object-cover sm:h-48"
                      />
                    ))}
                  </motion.div>
                </div>
              ))}
            </motion.div>

            <motion.div
              layout
              animate={{ opacity: phase === 'reveal' ? 0 : 1 }}
              transition={{ layout: { duration: 0.9, ease: ZOOM_EASE }, opacity: { duration: 0.5 } }}
              className={
                zoomedIn
                  ? 'fixed inset-0 z-10 overflow-hidden'
                  : 'relative z-10 h-2/3 w-1/2 overflow-hidden rounded-lg border-2 border-white/20 shadow-2xl sm:w-2/5'
              }
            >
              <img src={introHeroImage} alt="" aria-hidden className="h-full w-full object-cover" />
            </motion.div>

            <AnimatePresence>
              {zoomedIn && (
                <motion.div
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
                >
                  <div className="flex text-3xl font-black tracking-wide text-white sm:text-4xl">
                    {SIGNATURE.map((letter, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                        className={i >= 3 ? 'text-accent' : undefined}
                      >
                        {letter === ' ' ? ' ' : letter}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
