import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TypedRoles } from '../shared/TypedRoles'
import { skillCategories } from '../../data/skills'
import { runTerminalCommand } from '../../data/terminalCommands'

const COMMANDS = ['whoami', 'skills', 'projects', 'experience', 'sudo hire-me'] as const
const TYPE_MS = 45
const LINE_MS = 120
const MAX_LINES = 6

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

type Row = string | { key: string; value: string }

const LOGO = [
  '▄▄▄▄▄▄▄▄▄▄▄',
  ' ▀▀▀▀▀▀▀▀▀ ',
  ' ██▄▄▄▄▄██ ',
  ' ██     ██ ',
  ' ██     ██ ',
  ' ██     ██ ',
]
const WHOAMI: Row[] = [
  { key: 'role', value: 'full-stack engineer' },
  { key: 'stack', value: 'React · React Native · Node · Mongo' },
  { key: 'edu', value: "CSE, KIIT '26" },
  { key: 'base', value: 'Kolkata, IN' },
  { key: 'ride', value: 'Honda CBR250R, Stage 2' },
  { key: 'github', value: '2,844 contributions in 2026' },
  { key: 'status', value: 'shipping' },
]
const SKILLS = skillCategories.flatMap((c) => c.skills)
const REEL_ROW_S = 0.9
const PROGRESS_STEPS = 10
const PROGRESS_MS = 40

function format(cmd: string): Row[] {
  if (cmd === 'whoami') return WHOAMI
  if (cmd === 'skills') return []
  const lines = runTerminalCommand(cmd)
  return lines.length > MAX_LINES ? [...lines.slice(0, MAX_LINES), `… +${lines.length - MAX_LINES} more`] : lines
}

/** Live shell inside the hero laptop. Stays on `whoami` until a chip is clicked; while idle, a ghost prompt and chip glow keep inviting a click. */
export function HeroShell() {
  const reduced = !!useReducedMotion()
  const [cmd, setCmd] = useState<string>(COMMANDS[0])
  const [typed, setTyped] = useState('')
  const [out, setOut] = useState<Row[]>([])
  const [progress, setProgress] = useState(0)
  const [runs, setRuns] = useState(0)
  const [busy, setBusy] = useState(true)
  const screen = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    const lines = format(cmd)

    async function play() {
      setBusy(true)
      setOut([])
      if (reduced) {
        setTyped(cmd)
        setOut(lines)
        setBusy(false)
        return
      }
      setTyped('')
      setProgress(0)
      for (let i = 1; i <= cmd.length; i++) {
        await sleep(TYPE_MS)
        if (!alive) return
        setTyped(cmd.slice(0, i))
      }
      await sleep(180)
      if (cmd === 'whoami') {
        for (let p = 1; p <= PROGRESS_STEPS; p++) {
          setProgress(p)
          await sleep(PROGRESS_MS)
          if (!alive) return
        }
        setProgress(0)
      }
      for (const line of lines) {
        if (!alive) return
        setOut((prev) => [...prev, line])
        await sleep(LINE_MS)
      }
      if (!alive) return
      setBusy(false)
    }
    void play()
    return () => {
      alive = false
    }
  }, [cmd, runs, reduced])

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight })
  }, [out, busy])

  return (
    <>
      <div className="relative">
        <div
          ref={screen}
          role="log"
          aria-live="off"
          aria-label="Interactive terminal demo"
          className="thin-scrollbar h-[280px] overflow-y-auto rounded-lg bg-black/40 p-4 font-mono text-[13px] leading-relaxed sm:text-sm"
        >
          <p className="whitespace-nowrap text-white/90">
            <span className="text-[#28c840]">~/apurva</span> <span className="text-accent">$</span> {typed}
            <span className={`ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-accent ${busy ? '' : 'animate-pulse-dot'}`} />
          </p>
          {progress > 0 && (
            <p className="whitespace-nowrap text-white/50">
              resolving profile [{'█'.repeat(progress)}
              {'░'.repeat(PROGRESS_STEPS - progress)}] {progress * 10}%
            </p>
          )}
          {cmd === 'skills' && !busy && <SkillReel reduced={reduced} />}
          {cmd === 'whoami' && out.length > 0 ? <Whoami rows={out} reduced={reduced} /> : out.map((line, i) => <Line key={i} row={line} reduced={reduced} />)}
          {!busy && (
            <p aria-hidden className="mt-2 whitespace-nowrap text-white/35">
              <span className="text-[#28c840]/60">~/apurva</span> $ <TypedRoles words={COMMANDS.filter((c) => c !== cmd)} />
            </p>
          )}
        </div>
        {!reduced && <span aria-hidden className="shell-scan pointer-events-none absolute inset-0 overflow-hidden rounded-lg" />}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {COMMANDS.map((c, i) => (
          <button
            key={c}
            type="button"
            aria-label={`Run ${c}`}
            aria-pressed={cmd === c}
            onClick={() => {
              setCmd(c)
              setRuns((n) => n + 1)
            }}
            style={{ animationDelay: `${i * 1.2}s` }}
            className={`min-h-9 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              cmd === c ? 'border-accent text-accent' : `border-white/15 text-white/60 ${busy ? '' : 'chip-nudge motion-reduce:animate-none'}`
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  )
}

function Line({ row, reduced }: { row: Row; reduced: boolean }) {
  return (
    <motion.p
      initial={reduced ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="truncate text-white/65"
    >
      {typeof row === 'string' ? row : `${row.key}: ${row.value}`}
    </motion.p>
  )
}

function Whoami({ rows, reduced }: { rows: Row[]; reduced: boolean }) {
  return (
    <div className="mt-2 flex gap-5">
      <pre aria-hidden className="hidden shrink-0 leading-tight text-accent sm:block">
        {LOGO.map((line, i) => (
          <motion.span
            key={i}
            className="block"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
          >
            {line}
          </motion.span>
        ))}
      </pre>
      <div className="min-w-0 flex-1">
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-1 border-b border-white/10 pb-1"
        >
          <span className="text-accent">apurva</span>
          <span className="text-white/40">@</span>
          <span className="text-[#28c840]">portfolio</span>
        </motion.p>
        {rows.map((row, i) =>
          typeof row === 'string' ? null : (
            <motion.p
              key={i}
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="truncate"
            >
              <span className="inline-block w-[7ch] text-accent">{row.key}</span>
              {row.key === 'status' && <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#28c840] motion-reduce:animate-none" />}
              <span className="text-white/85">{row.value}</span>
            </motion.p>
          ),
        )}
      </div>
    </div>
  )
}

/** One skill per row, endlessly scrolling: the list is doubled and translated by exactly half. Monochrome icons via currentColor. */
function SkillReel({ reduced }: { reduced: boolean }) {
  const rows = (hidden: boolean) =>
    SKILLS.map(({ name, icon: Icon }, i) => (
      <li key={`${hidden}-${name}`} className="flex h-7 items-center gap-3 text-white/85" aria-hidden={hidden || undefined}>
        <span className="w-5 text-right text-white/25">{String(i + 1).padStart(2, '0')}</span>
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate">{name}</span>
      </li>
    ))

  return (
    <div className="mt-1">
      <p className="text-white/50">
        {SKILLS.length} skills loaded <span className="text-accent">∞</span>
      </p>
      <div
        className={`skill-reel-wrap mt-1 h-[150px] ${reduced ? 'thin-scrollbar overflow-y-auto' : 'overflow-hidden'}`}
        style={
          reduced
            ? undefined
            : { WebkitMaskImage: 'linear-gradient(transparent, #000 18%, #000 82%, transparent)', maskImage: 'linear-gradient(transparent, #000 18%, #000 82%, transparent)' }
        }
      >
        <ul className={reduced ? '' : 'skill-reel'} style={{ ['--dur' as string]: `${SKILLS.length * REEL_ROW_S}s` }}>
          {rows(false)}
          {!reduced && rows(true)}
        </ul>
      </div>
    </div>
  )
}
