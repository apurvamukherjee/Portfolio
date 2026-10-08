import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { runTerminalCommand } from '../../data/terminalCommands'

const COMMANDS = ['whoami', 'skills', 'projects', 'experience', 'sudo hire-me'] as const
const TYPE_MS = 45
const LINE_MS = 120
const NEXT_AUTO_MS = 3200
const RESUME_AFTER_CLICK_MS = 9000
const MAX_LINES = 6

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function format(cmd: string): string[] {
  const lines = runTerminalCommand(cmd)
  return lines.length > MAX_LINES ? [...lines.slice(0, MAX_LINES), `… +${lines.length - MAX_LINES} more`] : lines
}

interface Job {
  cmd: string
  auto: boolean
}

/** Live shell inside the hero laptop: autoplays real terminal commands, and the chips run them on demand. */
export function HeroShell() {
  const reduced = !!useReducedMotion()
  const [job, setJob] = useState<Job>({ cmd: COMMANDS[0], auto: !reduced })
  const [typed, setTyped] = useState('')
  const [out, setOut] = useState<string[]>([])
  const [busy, setBusy] = useState(true)
  const screen = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    const next = () => ({ cmd: COMMANDS[(COMMANDS.indexOf(job.cmd as (typeof COMMANDS)[number]) + 1) % COMMANDS.length], auto: true })
    const lines = format(job.cmd)

    async function play() {
      setBusy(true)
      setOut([])
      if (reduced) {
        setTyped(job.cmd)
        setOut(lines)
        setBusy(false)
        return
      }
      setTyped('')
      for (let i = 1; i <= job.cmd.length; i++) {
        await sleep(TYPE_MS)
        if (!alive) return
        setTyped(job.cmd.slice(0, i))
      }
      await sleep(180)
      for (const line of lines) {
        if (!alive) return
        setOut((prev) => [...prev, line])
        await sleep(LINE_MS)
      }
      if (!alive) return
      setBusy(false)
      await sleep(job.auto ? NEXT_AUTO_MS : RESUME_AFTER_CLICK_MS)
      if (alive) setJob(next())
    }
    void play()
    return () => {
      alive = false
    }
  }, [job, reduced])

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight })
  }, [out])

  return (
    <>
      <div
        ref={screen}
        role="log"
        aria-live="off"
        aria-label="Interactive terminal demo"
        className="thin-scrollbar h-[190px] overflow-y-auto rounded-lg bg-black/40 p-4 font-mono text-[13px] leading-relaxed sm:h-[210px] sm:text-sm"
      >
        <p className="whitespace-nowrap text-white/90">
          <span className="text-[#28c840]">~/apurva</span> <span className="text-accent">$</span> {typed}
          <span className={`ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-accent ${busy ? '' : 'animate-pulse-dot'}`} />
        </p>
        {out.map((line, i) => (
          <p key={i} className="truncate text-white/65">
            {line}
          </p>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            aria-label={`Run ${cmd}`}
            aria-pressed={job.cmd === cmd}
            onClick={() => setJob({ cmd, auto: false })}
            className={`min-h-9 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              job.cmd === cmd ? 'border-accent text-accent' : 'border-white/15 text-white/60'
            }`}
          >
            {cmd}
          </button>
        ))}
      </div>
    </>
  )
}
