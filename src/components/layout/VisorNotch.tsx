import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { TbArrowUpRight } from 'react-icons/tb'
import { projects } from '../../data/projects'
import { useIntro } from '../../hooks/useIntro'
import { OpenBook } from '../sections/bookshelf/OpenBook'
import './VisorNotch.css'

const TRACK = {
  src: '/assets/visor-demo/on-and-on.mp3',
  cover: '/assets/visor-demo/cover.webp',
  title: 'On & On',
  artist: 'Cartoon feat. Daniel Levi',
}

const visor = projects.find((p) => p.name === 'Visor')

// Mirrors the Visor site's island: hover to open, a short grace period before it closes, so a
// pointer crossing the top edge on its way to the navbar doesn't flash it open.
const OPEN_DELAY_MS = 120
const CLOSE_DELAY_MS = 350
const SKIP_SECONDS = 15
const TRIED_KEY = 'portfolio-notch-tried'
const DAY_MS = 86_400_000

const OPEN = { w: 640, h: 196 }
const CLOSED = { w: 300, h: 32 }

const TABS = [
  { id: 'home', label: 'Home', path: 'M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z' },
  { id: 'shelf', label: 'Shelf', path: 'M4 13l2-8h12l2 8v6H4zm2.3 0H9a3 3 0 0 0 6 0h2.7l-1.4-6H7.7z' },
] as const
type Tab = (typeof TABS)[number]['id']

const ICON = {
  prev: <path d="M11 6v12L2 12zM21 6v12l-9-6z" />,
  next: <path d="M3 6v12l9-6zM13 6v12l9-6z" />,
  play: <path d="M7 4v16l13-8z" />,
  pause: <path d="M6 4h4v16H6zM14 4h4v16h-4z" />,
}

const SHELF_ITEMS = [
  { name: 'Visor.dmg', icon: '/assets/projects/logos/visor.png', thumb: false },
  { name: 'cover.jpg', icon: TRACK.cover, thumb: true },
  { name: 'Release notes.pdf', icon: '', thumb: false },
  { name: 'Screenshots', icon: '', thumb: false },
]

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

interface BatteryManager extends EventTarget {
  level: number
  charging: boolean
}

function useBattery(): { level: number; charging: boolean } | null {
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null)
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }
    if (!nav.getBattery) return
    let manager: BatteryManager | undefined
    const sync = () => manager && setBattery({ level: manager.level, charging: manager.charging })
    void nav.getBattery().then((m) => {
      manager = m
      sync()
      m.addEventListener('levelchange', sync)
      m.addEventListener('chargingchange', sync)
    })
    return () => {
      manager?.removeEventListener('levelchange', sync)
      manager?.removeEventListener('chargingchange', sync)
    }
  }, [])
  return battery
}

function Visualizer({ playing }: { playing: boolean }) {
  return (
    <span className={`visualizer${playing ? '' : ' is-paused'}`} aria-hidden>
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

function Control({ label, path, big, onClick }: { label: string; path: ReactNode; big?: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`player-btn${big ? ' is-big' : ''}`} aria-label={label} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        {path}
      </svg>
    </button>
  )
}

interface CalEvent {
  title: string
  at: Date
  minutes: number
  color: string
  call?: string
}

// Pinned to the visitor's clock so there is always something upcoming, same as the Visor site.
function eventsFor(now: Date): CalEvent[] {
  const quarter = 15 * 60_000
  const nextQuarter = Math.ceil(now.getTime() / quarter) * quarter
  const at = (hours: number) => new Date(nextQuarter + hours * 3_600_000)
  return [
    { title: 'Design review', at: at(-2), minutes: 45, color: '#a78bfa' },
    { title: 'Visor stand-up', at: at(0), minutes: 15, color: '#34d399', call: 'Meet' },
    { title: 'Ship the website', at: at(3), minutes: 60, color: '#fb923c' },
  ]
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
const hm = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

function Calendar() {
  const [now, setNow] = useState(() => new Date())
  const [picked, setPicked] = useState(0)
  const [joined, setJoined] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])
  const days = Array.from({ length: 6 }, (_, i) => new Date(now.getTime() + (i - 2) * DAY_MS))
  const day = days[picked + 2] ?? now
  const events = eventsFor(now).filter((e) => sameDay(e.at, day))

  return (
    <div className="calendar">
      <div className="calendar-top">
        <div className="calendar-month">
          <b>{now.toLocaleDateString('en-US', { month: 'short' })}</b>
          <span>{now.getFullYear()}</span>
        </div>
        <div className="calendar-days" role="listbox" aria-label="Days">
          {days.map((d, i) => (
            <button
              key={d.toDateString()}
              type="button"
              role="option"
              aria-selected={i - 2 === picked}
              className={`calendar-day${sameDay(d, now) ? ' is-today' : ''}`}
              onClick={() => setPicked(i - 2)}
            >
              <small>{d.toLocaleDateString('en-US', { weekday: 'short' })}</small>
              <span>{d.getDate()}</span>
            </button>
          ))}
        </div>
      </div>
      {events.length ? (
        <ul className="calendar-events">
          {events.map((e) => (
            <li key={e.title} className={e.at.getTime() + e.minutes * 60_000 < now.getTime() ? 'is-past' : ''}>
              <i style={{ background: e.color }} />
              <span className="calendar-event-title">{e.title}</span>
              {e.call && (
                <button type="button" className="calendar-join" onClick={() => setJoined(true)}>
                  {joined ? 'Joined ✓' : `Join ${e.call}`}
                </button>
              )}
              <time>{hm(e.at)}</time>
            </li>
          ))}
        </ul>
      ) : (
        <div className="calendar-empty">
          <b>No events</b>
          <span>Enjoy your free time!</span>
        </div>
      )}
    </div>
  )
}

function Shelf() {
  return (
    <div className="shelf">
      <div className="shelf-zone shelf-airdrop">
        <span className="shelf-airdrop-circle">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3v12M8 7l4-4 4 4" />
            <path d="M8 10H6v10h12V10h-2" />
          </svg>
        </span>
        <b>AirDrop</b>
      </div>
      <ul className="shelf-zone shelf-files" aria-label="Files on the shelf">
        {SHELF_ITEMS.map((it) => (
          <li key={it.name} title={it.name}>
            {it.icon ? (
              <img className={it.thumb ? 'is-thumb' : ''} src={it.icon} alt="" width={46} height={46} />
            ) : (
              <span className="shelf-generic" aria-hidden />
            )}
            <span>{it.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The Visor website's notch island, pinned to the top of the page on tablets and desktops. */
export function VisorNotch() {
  const reduced = useReducedMotion() ?? false
  const introDone = useIntro()
  const battery = useBattery()
  const audioRef = useRef<HTMLAudioElement>(null)
  const islandRef = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [expanded, setExpandedState] = useState(false)
  const [tried, setTried] = useState(readTried)
  const [bookOpen, setBookOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('home')
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

  // Touch has no mouseleave, so a tap outside the open island is what closes it on tablets.
  useEffect(() => {
    if (!expanded) return
    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !islandRef.current?.contains(e.target)) setExpandedState(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [expanded])

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

  const size = expanded ? OPEN : CLOSED

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
          <div
            ref={islandRef}
            className={`island pointer-events-auto${expanded ? ' is-open' : ''}`}
            style={
              {
                width: size.w,
                height: size.h,
                maxWidth: 'calc(100vw - 16px)',
                opacity: introDone ? 1 : 0,
                transform: introDone ? 'none' : `translateY(-${CLOSED.h}px)`,
                transitionProperty: 'width, height, border-radius, box-shadow, opacity, transform',
              } as CSSProperties
            }
            onMouseEnter={() => setExpandedAfterDelay(true)}
            onMouseLeave={() => setExpandedAfterDelay(false)}
            onFocus={() => setExpandedNow(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setExpandedNow(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setExpandedNow(false)
            }}
          >
            {expanded ? (
              <div className="island-open">
                <div className="island-header">
                  <div className="island-tabs" role="tablist">
                    {TABS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.id}
                        aria-label={t.label}
                        className="island-tab"
                        onClick={() => setTab(t.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d={t.path} />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <div className="island-right">
                    {visor?.liveUrl && (
                      <a className="island-link" href={visor.liveUrl} target="_blank" rel="noopener noreferrer">
                        View project <TbArrowUpRight size={12} aria-hidden />
                      </a>
                    )}
                    {battery && (
                      <span className="island-battery">
                        {Math.round(battery.level * 100)}%
                        <span className={`island-battery-cell${battery.charging ? ' is-charging' : ''}`}>
                          <i style={{ width: `${battery.level * 100}%` }} />
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {tab === 'shelf' ? (
                  <Shelf />
                ) : (
                  <div className="home">
                    <div className="player">
                      <button
                        type="button"
                        className="cover"
                        style={{ width: 118, height: 118 }}
                        onClick={openProject}
                        disabled={!visor}
                        aria-label="Open the Visor project"
                      >
                        <img src={TRACK.cover} alt="" width={118} height={118} />
                      </button>
                      <div className="player-main">
                        <div className="player-title">{TRACK.title}</div>
                        <div className="player-artist">{TRACK.artist}</div>
                        <input
                          className="player-scrub"
                          type="range"
                          min={0}
                          max={duration || 0}
                          step={0.1}
                          value={time}
                          aria-label="Track position"
                          aria-valuetext={`${formatTime(time)} of ${duration ? formatTime(duration) : 'unknown'}`}
                          style={{ '--p': `${duration ? (time / duration) * 100 : 0}%` } as CSSProperties}
                          onChange={(e) => seek(Number(e.target.value))}
                        />
                        <div className="player-times">
                          <span>{formatTime(time)}</span>
                          <span>{duration ? formatTime(duration) : '--:--'}</span>
                        </div>
                        <div className="player-controls">
                          <Control label="Restart" path={ICON.prev} onClick={() => seek(0)} />
                          <Control label={playing ? 'Pause' : 'Play'} path={playing ? ICON.pause : ICON.play} big onClick={togglePlay} />
                          <Control label={`Skip ${SKIP_SECONDS} seconds`} path={ICON.next} onClick={() => seek(time + SKIP_SECONDS)} />
                        </div>
                      </div>
                    </div>
                    <Calendar />
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="island-hit"
                aria-label="Visor demo: open the notch player"
                aria-expanded={false}
                onClick={() => setExpandedNow(true)}
              >
                <div className="closed">
                  <span className="cover" style={{ width: 22, height: 22 }}>
                    <img src={TRACK.cover} alt="" width={22} height={22} />
                  </span>
                  <Visualizer playing={playing} />
                </div>
              </button>
            )}
          </div>
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
