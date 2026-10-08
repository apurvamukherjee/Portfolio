import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  TbArrowUpRight,
  TbHome,
  TbShoppingBag,
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
const OPEN = { width: 640, height: 196, radius: 26 }
const TABS = [
  { id: 'home', label: 'Home', Icon: TbHome },
  { id: 'shelf', label: 'Shelf', Icon: TbShoppingBag },
] as const
const VISOR_ACCENT = '#ff2d55'
const BAR_DELAYS = ['0s', '-0.45s', '-0.2s', '-0.7s']
const WAVE_BARS = 18
const WAVE_HEIGHT = 26

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

/** A playable web recreation of Visor — the notch app — pinned to the top of the page on tablets and desktops. */
export function VisorNotch() {
  const reduced = useReducedMotion() ?? false
  const introDone = useIntro()
  const audioRef = useRef<HTMLAudioElement>(null)
  const notchRef = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [expanded, setExpandedState] = useState(false)
  const [tried, setTried] = useState(readTried)
  const [bookOpen, setBookOpen] = useState(false)
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('home')
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [scrubbing, setScrubbing] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const waveRef = useRef<HTMLCanvasElement>(null)

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

  // Touch has no mouseleave, and iOS Safari doesn't focus tapped buttons, so blur never fires:
  // a tap anywhere outside the open island is what closes it on tablets.
  useEffect(() => {
    if (!expanded) return
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !notchRef.current?.contains(e.target)) setExpandedState(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [expanded])

  // Built on the first Play press: an AudioContext has to start inside a user gesture, and once the
  // element is routed through it, a suspended context would mean silence.
  const ensureAnalyser = (audio: HTMLAudioElement) => {
    if (analyserRef.current || typeof AudioContext === 'undefined') return
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.75
    ctx.createMediaElementSource(audio).connect(analyser)
    analyser.connect(ctx.destination)
    audioCtxRef.current = ctx
    analyserRef.current = analyser
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      ensureAnalyser(audio)
      void audio.play()
    } else {
      audio.pause()
    }
  }

  // Waveform over the cover art. Only runs while the island is open and music is playing.
  useEffect(() => {
    const canvas = waveRef.current
    const analyser = analyserRef.current
    if (!expanded || !playing || reduced || !canvas || !analyser) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * dpr
    canvas.height = WAVE_HEIGHT * dpr
    ctx.scale(dpr, dpr)
    const bins = new Uint8Array(analyser.frequencyBinCount)
    const barWidth = canvas.clientWidth / WAVE_BARS
    let raf = 0
    const draw = () => {
      analyser.getByteFrequencyData(bins)
      ctx.clearRect(0, 0, canvas.clientWidth, WAVE_HEIGHT)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      for (let i = 0; i < WAVE_BARS; i++) {
        const level = (bins[i + 1] ?? 0) / 255
        const h = Math.max(2, level * WAVE_HEIGHT)
        ctx.fillRect(i * barWidth + 1, WAVE_HEIGHT - h, barWidth - 2, h)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [expanded, playing, reduced])

  const startScrub = () => {
    setScrubbing(true)
    const stop = () => setScrubbing(false)
    window.addEventListener('pointerup', stop, { once: true })
    window.addEventListener('pointercancel', stop, { once: true })
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
          // Resumed from media keys / lock screen with no click: make sure the graph isn't asleep.
          void audioCtxRef.current?.resume()
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

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[61] hidden justify-center notch:flex">
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
            ref={notchRef}
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
            style={{ '--visor-accent': VISOR_ACCENT } as CSSProperties}
            className={`pointer-events-auto relative bg-black text-white ${
              expanded ? 'shadow-[0_12px_40px_rgba(0,0,0,0.45)]' : ''
            }`}
          >
            {/* Inverse corners flare the notch into the screen edge, like the real app. */}
            <span aria-hidden className="absolute -left-2.5 top-0 h-2.5 w-2.5 bg-[radial-gradient(circle_at_0_100%,transparent_9.5px,#000_10px)]" />
            <span aria-hidden className="absolute -right-2.5 top-0 h-2.5 w-2.5 bg-[radial-gradient(circle_at_100%_100%,transparent_9.5px,#000_10px)]" />
            <div className="absolute inset-0 overflow-hidden" style={{ borderBottomLeftRadius: size.radius, borderBottomRightRadius: size.radius }}>
            <AnimatePresence initial={false} mode="popLayout">
              {expanded ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : 0.06 }}
                  className="flex h-[196px] w-[640px] flex-col px-[22px] pb-4 pt-1.5"
                >
                  <div className="flex h-[30px] items-center justify-between">
                    <div role="tablist" className="flex gap-1">
                      {TABS.map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          role="tab"
                          aria-selected={tab === id}
                          aria-label={label}
                          onClick={() => setTab(id)}
                          className={`grid h-6 w-[38px] place-items-center rounded-xl transition-colors ${
                            tab === id ? 'bg-white/[0.12] text-white' : 'text-white/55 hover:text-white'
                          }`}
                        >
                          <Icon size={16} aria-hidden />
                        </button>
                      ))}
                    </div>
                    {visor?.liveUrl && (
                      <a
                        href={visor.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                      >
                        View project <TbArrowUpRight size={12} aria-hidden />
                      </a>
                    )}
                  </div>

                  {tab === 'shelf' ? (
                    <p className="mt-2 grid flex-1 place-items-center rounded-2xl border border-dashed border-white/20 text-[13px] text-white/50">
                      Drop files here to park them on the shelf
                    </p>
                  ) : (
                  <div className="mt-2 flex flex-1 gap-4">
                    <button
                      type="button"
                      onClick={openProject}
                      disabled={!visor}
                      aria-label="Open the Visor project"
                      className="group/cover relative h-[104px] w-[104px] flex-none overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <img src={TRACK.cover} alt="" className="h-full w-full object-cover" />
                      <canvas
                        ref={waveRef}
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-1.5 bottom-1.5 w-[calc(100%-0.75rem)] transition-opacity duration-300 ${
                          playing && !reduced ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ height: WAVE_HEIGHT }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] font-semibold opacity-0 transition-opacity group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100">
                        Open project
                      </span>
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-[15px] font-semibold leading-tight">{TRACK.title}</p>
                      <p className="truncate text-[13px] text-white/55">{TRACK.artist}</p>

                      <div className="relative mt-3">
                        {scrubbing && duration > 0 && (
                          <span
                            aria-hidden
                            className="pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-black"
                            style={{ left: `${(time / duration) * 100}%` }}
                          >
                            {formatTime(time)}
                          </span>
                        )}
                        <input
                          type="range"
                          min={0}
                          max={duration || 0}
                          step={0.1}
                          value={time}
                          onChange={(e) => seek(Number(e.target.value))}
                          onPointerDown={startScrub}
                          aria-label="Seek"
                          aria-valuetext={`${formatTime(time)} of ${duration ? formatTime(duration) : 'unknown'}`}
                          className="block h-1 w-full cursor-pointer accent-white"
                        />
                      </div>
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
                            className={`flex flex-col items-center rounded-lg py-1 ${i === 2 ? 'bg-[color-mix(in_srgb,var(--visor-accent)_35%,transparent)]' : ''}`}
                          >
                            <span className="text-[10px] text-white/50">
                              {d.toLocaleString('en', { weekday: 'short' })}
                            </span>
                            <span
                              className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                i === 2 ? 'bg-[var(--visor-accent)]' : 'text-white/80'
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
                  )}
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
                        className={`h-full w-[3px] origin-bottom rounded-full bg-[var(--visor-accent)] ${
                          playing ? 'animate-notch-bar motion-reduce:animate-none' : 'scale-y-[0.3]'
                        }`}
                        style={{ animationDelay: delay }}
                      />
                    ))}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
            </div>
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
