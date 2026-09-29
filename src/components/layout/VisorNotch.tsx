import { useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  TbArrowUpRight,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbRewindForward15,
} from 'react-icons/tb'
import { projects } from '../../data/projects'
import { useIntro } from '../../hooks/useIntro'
import { OpenBook } from '../sections/bookshelf/OpenBook'

const TRACK = {
  src: '/assets/visor-demo/on-and-on.mp3',
  cover: '/assets/visor-demo/cover.webp',
  title: 'On & On',
  artist: 'Cartoon feat. Daniel Levi',
}

const visor = projects.find((p) => p.name === 'Visor')

// Same feel as the real app: opening needs a moment of hover intent and closing has a grace
// period, so a pointer crossing the top edge on its way to the navbar doesn't flash it open.
const OPEN_DELAY_MS = 120
const CLOSE_DELAY_MS = 300
const SKIP_SECONDS = 15
const TRIED_KEY = 'portfolio-notch-tried'

const CLOSED = { width: 200, height: 32, radius: 12 }
const OPEN = { width: 560, height: 188, radius: 28 }
const BAR_DELAYS = ['0s', '-0.45s', '-0.2s', '-0.7s']

function formatTime(seconds: number): string {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function readTried(): boolean {
  try {
    return localStorage.getItem(TRIED_KEY) === '1'
  } catch {
    return false
  }
}

/** A playable web recreation of Visor — the notch app — pinned to the top of the page on desktop. */
export function VisorNotch() {
  const reduced = useReducedMotion() ?? false
  const introDone = useIntro()
  const audioRef = useRef<HTMLAudioElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [expanded, setExpandedState] = useState(false)
  const [tried, setTried] = useState(readTried)
  const [bookOpen, setBookOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const setExpanded = (open: boolean) => {
    setExpandedState(open)
    if (!open || tried) return
    setTried(true)
    try {
      localStorage.setItem(TRIED_KEY, '1')
    } catch {
      // localStorage unavailable — the hint just shows again next visit
    }
  }

  const setExpandedAfterDelay = (open: boolean) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setExpanded(open), open ? OPEN_DELAY_MS : CLOSE_DELAY_MS)
  }

  const setExpandedNow = (open: boolean) => {
    clearTimeout(hoverTimer.current)
    setExpanded(open)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  const seek = (seconds: number) => {
    const audio = audioRef.current
    if (audio) audio.currentTime = Math.min(Math.max(seconds, 0), duration || seconds)
  }

  const openProject = () => {
    setExpandedNow(false)
    setBookOpen(true)
  }

  const today = new Date()
  const week = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i - 2)
    return d
  })

  const size = expanded ? OPEN : CLOSED
  const transition = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 34 }

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK.src}
        preload="none"
        onPlay={() => {
          setPlaying(true)
          if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: TRACK.title,
              artist: TRACK.artist,
              artwork: [{ src: TRACK.cover, sizes: '240x240', type: 'image/webp' }],
            })
          }
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[61] hidden justify-center lg:flex">
        <div className="relative">
          {introDone && !tried && !expanded && (
            <>
              <span
                aria-hidden
                className="absolute inset-x-6 -bottom-3 top-1 animate-pulse-dot rounded-full bg-accent/60 blur-xl motion-reduce:animate-none"
              />
              <motion.span
                aria-hidden
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: reduced ? 0 : 0.4 }}
                className="absolute left-full top-2 ml-3 whitespace-nowrap font-mono text-[11px] font-medium text-accent"
              >
                ← hover me, it plays music
              </motion.span>
            </>
          )}
          <motion.div
            initial={false}
            animate={{
              width: size.width,
              height: size.height,
              borderBottomLeftRadius: size.radius,
              borderBottomRightRadius: size.radius,
              opacity: introDone ? 1 : 0,
              y: introDone ? 0 : -CLOSED.height,
            }}
            transition={transition}
            onMouseEnter={() => setExpandedAfterDelay(true)}
            onMouseLeave={() => setExpandedAfterDelay(false)}
            onFocus={() => setExpandedNow(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setExpandedNow(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setExpandedNow(false)
            }}
            className={`pointer-events-auto relative overflow-hidden bg-black text-white ${
              expanded ? 'shadow-[0_18px_40px_rgba(0,0,0,0.45)]' : ''
            }`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {expanded ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, filter: reduced ? 'none' : 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : 0.06 }}
                  className="flex h-[188px] w-[560px] flex-col px-5 pb-4 pt-2"
                >
                  <div className="flex h-7 items-center justify-between text-[11px] text-white/50">
                    <span className="font-semibold text-white/80">Visor</span>
                    {visor && (
                      <button
                        type="button"
                        onClick={openProject}
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                      >
                        View project <TbArrowUpRight size={12} aria-hidden />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex flex-1 gap-4">
                    <button
                      type="button"
                      onClick={openProject}
                      disabled={!visor}
                      aria-label="Open the Visor project"
                      className="group/cover relative h-[104px] w-[104px] flex-none overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <img src={TRACK.cover} alt="" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] font-semibold opacity-0 transition-opacity group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100">
                        Open project
                      </span>
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-[15px] font-semibold leading-tight">{TRACK.title}</p>
                      <p className="truncate text-[13px] text-white/55">{TRACK.artist}</p>

                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={time}
                        onChange={(e) => seek(Number(e.target.value))}
                        aria-label="Seek"
                        className="mt-3 h-1 w-full cursor-pointer accent-white"
                      />
                      <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-white/45">
                        <span>{formatTime(time)}</span>
                        <span>{duration ? formatTime(duration) : '--:--'}</span>
                      </div>

                      <div className="mt-1 flex items-center justify-center gap-5">
                        <button
                          type="button"
                          onClick={() => seek(0)}
                          aria-label="Restart"
                          className="rounded-full p-1 text-white/80 transition-colors hover:text-white"
                        >
                          <TbPlayerSkipBackFilled size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={togglePlay}
                          aria-label={playing ? 'Pause' : 'Play'}
                          className="rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
                        >
                          {playing ? <TbPlayerPauseFilled size={26} /> : <TbPlayerPlayFilled size={26} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => seek(time + SKIP_SECONDS)}
                          aria-label={`Skip ${SKIP_SECONDS} seconds`}
                          className="rounded-full p-1 text-white/80 transition-colors hover:text-white"
                        >
                          <TbRewindForward15 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex w-[176px] flex-none flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold">{today.toLocaleString('en', { month: 'short' })}</span>
                        <span className="text-sm text-white/45">{today.getFullYear()}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-5 gap-1 text-center">
                        {week.map((d, i) => (
                          <div
                            key={d.toDateString()}
                            className={`flex flex-col items-center rounded-lg py-1 ${i === 2 ? 'bg-accent/25' : ''}`}
                          >
                            <span className="text-[10px] text-white/50">
                              {d.toLocaleString('en', { weekday: 'short' })}
                            </span>
                            <span
                              className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                i === 2 ? 'bg-accent' : 'text-white/80'
                              }`}
                            >
                              {d.getDate()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-auto text-center text-[11px] text-white/45">No events today</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="closed"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.15 }}
                  onClick={() => setExpandedNow(true)}
                  aria-label="Visor demo: open the notch player"
                  aria-expanded={false}
                  className="flex h-8 w-[200px] items-center justify-between px-2.5"
                >
                  <img src={TRACK.cover} alt="" className="h-5 w-5 rounded-[5px] object-cover" />
                  <span aria-hidden className="flex h-3.5 items-end gap-[2px]">
                    {BAR_DELAYS.map((delay) => (
                      <span
                        key={delay}
                        className={`h-full w-[3px] origin-bottom rounded-full bg-white/85 ${
                          playing ? 'animate-notch-bar motion-reduce:animate-none' : 'scale-y-[0.3]'
                        }`}
                        style={{ animationDelay: delay }}
                      />
                    ))}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Own layout namespace so the dialog doesn't try to morph out of the shelf's Visor spine. */}
      <LayoutGroup id="visor-notch">
        <AnimatePresence>
          {bookOpen && visor && <OpenBook key="visor" project={visor} onClose={() => setBookOpen(false)} />}
        </AnimatePresence>
      </LayoutGroup>
    </>
  )
}
