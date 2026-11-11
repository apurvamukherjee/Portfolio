import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { TbArrowUpRight, TbBrandLinkedin, TbCheck, TbGitBranch, TbMail } from 'react-icons/tb'
import { skillCategories } from '../../data/skills'
import { projectBlurb, projects } from '../../data/projects'
import { experience } from '../../data/experience'
import { socialLinks } from '../../data/social'
import { jumpToSection } from '../../lib/sectionTransition'
import { fuzzyScore } from '../../lib/fuzzyMatch'
import { appleEase } from '../../lib/motion'
import { useUi } from '../../lib/ui'
import { useCommands } from '../../hooks/useCommands'
import { useIntro } from '../../hooks/useIntro'

/** Commands that render a designed view rather than text. Also the chips under the screen. */
const VIEWS = ['whoami', 'skills', 'projects', 'experience', 'sudo hire-me'] as const
type View = (typeof VIEWS)[number]
const isView = (text: string): text is View => (VIEWS as readonly string[]).includes(text)

const VIEW_HELP: Record<View, string> = {
  whoami: 'who you are talking to',
  skills: 'the stack, by lane',
  projects: 'pinned work',
  experience: 'where I have worked',
  'sudo hire-me': 'how to reach me',
}

type Output =
  | { kind: 'view'; view: View }
  | { kind: 'help' }
  | { kind: 'done'; label: string }
  | { kind: 'missing'; name: string; guess: string | null }

interface Entry {
  id: number
  text: string
  output: Output | null
  /** Typed out by the shell (a chip, the idle demo) rather than by the visitor. */
  animate: boolean
}

const TYPE_MS = 42
// How long the idle demo holds each view before typing the next command.
const DEMO_MS = 5200
const PINNED = ['Visor', 'Zenith', 'KeyStrike', 'Pixelpanic', 'Monopolis', 'Kiwami']

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const WHOAMI: [string, ReactNode][] = [
  ['role', 'Full-stack engineer'],
  ['stack', 'React · React Native · Node · MongoDB'],
  ['edu', "CSE, KIIT '26"],
  ['base', 'Kolkata, IN'],
  ['ride', 'Honda CBR250R, Stage 2'],
  ['github', '3,349 contributions this year'],
  [
    'status',
    <span key="s" className="inline-flex items-center gap-1.5 text-[#5ee07a]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
      shipping
    </span>,
  ],
]

const PROJECT_ROWS = PINNED.flatMap((n) => projects.filter((p) => p.name === n)).map((p) => ({
  name: p.name,
  blurb: projectBlurb(p).replace(/\.$/, ''),
  open: p.openSource,
}))
const MORE_PROJECTS = projects.length - PROJECT_ROWS.length
const mail = socialLinks.find((l) => l.icon === 'mail')?.href ?? ''
const linkedin = socialLinks.find((l) => l.icon === 'linkedin')?.href ?? ''

const list: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.045 } } }
const row: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

const normalise = (raw: string) => raw.trim().toLowerCase().replace(/\s+/g, ' ')

/** The nearest real command to a mistyped one, or null when nothing is close. */
function closest(name: string, names: string[]): string | null {
  let best: string | null = null
  let bestScore = 0
  for (const candidate of names) {
    // Both directions: "proj" is inside "projects", and "skils" is a subsequence of nothing but "skills" contains most of it.
    const score = Math.max(fuzzyScore(name, candidate), fuzzyScore(candidate, name))
    if (score > bestScore) {
      best = candidate
      bestScore = score
    }
  }
  return best
}

interface HeroShellProps {
  /** Maximised window: a taller screen. */
  tall: boolean
}

/**
 * The hero's shell, and a real one: it takes typed input with history and tab completion, runs
 * every site action the command palette has, and renders designed views for the commands about
 * me. Until someone touches it, it demos itself by typing through those views.
 */
export function HeroShell({ tall }: HeroShellProps) {
  const reduced = !!useReducedMotion()
  const introDone = useIntro()
  const commands = useCommands()
  const [entry, setEntry] = useState<Entry>({ id: 0, text: 'whoami', output: { kind: 'view', view: 'whoami' }, animate: true })
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  // The demo ends for good the first time the visitor does anything to the shell.
  const [touched, setTouched] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inView = useInView(root, { amount: 0.5 })

  const names = [...VIEWS, 'help', 'clear', ...commands.map((c) => c.alias)]
  const query = normalise(input)
  const completion = query ? names.find((n) => n.startsWith(query) && n !== query) : undefined

  useEffect(() => {
    let alive = true
    screen.current?.scrollTo({ top: 0 })
    async function play() {
      if (!entry.animate || reduced) {
        setTyped(entry.text)
        setDone(true)
        return
      }
      setDone(false)
      setTyped('')
      for (let i = 1; i <= entry.text.length; i++) {
        await sleep(TYPE_MS)
        if (!alive) return
        setTyped(entry.text.slice(0, i))
      }
      await sleep(160)
      if (alive) setDone(true)
    }
    void play()
    return () => {
      alive = false
    }
  }, [entry, reduced])

  useEffect(() => {
    if (touched || !done || !inView || !introDone || reduced) return
    const timer = setTimeout(() => {
      setEntry((e) => {
        const next = VIEWS[(VIEWS.indexOf(e.text as View) + 1) % VIEWS.length]
        return { id: e.id + 1, text: next, output: { kind: 'view', view: next }, animate: true }
      })
    }, DEMO_MS)
    return () => clearTimeout(timer)
  }, [touched, done, inView, introDone, reduced, entry.id])

  function run(raw: string, animate: boolean) {
    const text = normalise(raw)
    setTouched(true)
    if (!text) return
    if (text === 'clear') {
      setEntry((e) => ({ id: e.id + 1, text: '', output: null, animate: false }))
      return
    }

    let output: Output
    if (isView(text)) output = { kind: 'view', view: text }
    else if (text === 'help') output = { kind: 'help' }
    else {
      const action = commands.find((c) => c.alias === text)
      if (action) {
        action.action()
        output = { kind: 'done', label: action.label }
      } else {
        output = { kind: 'missing', name: text, guess: closest(text, names) }
      }
    }
    setEntry((e) => ({ id: e.id + 1, text, output, animate }))
  }

  function submit() {
    const text = normalise(input)
    setInput('')
    if (text) {
      setHistory((prev) => [...prev, text])
      setHistoryIndex(history.length + 1)
    }
    run(text, false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const atEnd = e.currentTarget.selectionStart === input.length
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if ((e.key === 'Tab' || (e.key === 'ArrowRight' && atEnd)) && completion) {
      e.preventDefault()
      setInput(completion)
    } else if (e.key === 'ArrowUp' && history.length > 0) {
      e.preventDefault()
      const next = Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown' && history.length > 0) {
      e.preventDefault()
      const next = Math.min(history.length, historyIndex + 1)
      setHistoryIndex(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'Escape') {
      e.currentTarget.blur()
    }
  }

  // Clicking the screen puts you at the prompt, like a real terminal, unless you were selecting
  // text or clicking something that is already a control.
  function focusPrompt(e: MouseEvent<HTMLDivElement>) {
    if (e.target instanceof Element && e.target.closest('a, button')) return
    if (window.getSelection()?.toString()) return
    inputRef.current?.focus({ preventScroll: true })
  }

  const demoing = !touched && done && inView && introDone && !reduced

  return (
    <div ref={root} className="relative flex flex-col" onPointerDown={() => setTouched(true)}>
      {/* A line of light crosses under the title bar each time a command runs. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
        {!reduced && (
          <motion.span
            key={entry.id}
            className="block h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 0.7, ease: appleEase }}
          />
        )}
      </div>

      <div
        ref={screen}
        role="log"
        aria-live={touched ? 'polite' : 'off'}
        aria-label="Terminal output"
        onClick={focusPrompt}
        className={`thin-scrollbar cursor-text overflow-y-auto px-4 py-4 font-mono text-[12px] leading-relaxed text-white/80 transition-[height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:px-5 sm:text-[13px] ${
          tall ? 'h-[420px]' : 'h-[264px]'
        }`}
      >
        {entry.text && (
          <p className="whitespace-nowrap">
            <Prompt />
            <span className="text-white">{typed}</span>
            {!done && <Caret />}
          </p>
        )}

        {done && entry.output && (
          <motion.div key={entry.id} className="mt-3" initial={reduced ? false : 'hidden'} animate="visible" variants={list}>
            {entry.output.kind === 'view' && entry.output.view === 'whoami' && <Whoami />}
            {entry.output.kind === 'view' && entry.output.view === 'skills' && <Skills />}
            {entry.output.kind === 'view' && entry.output.view === 'projects' && <Projects />}
            {entry.output.kind === 'view' && entry.output.view === 'experience' && <Experience />}
            {entry.output.kind === 'view' && entry.output.view === 'sudo hire-me' && <HireMe />}
            {entry.output.kind === 'help' && (
              <Help actions={commands.map((c) => [c.alias, c.label.toLowerCase()])} onRun={(name) => run(name, true)} />
            )}
            {entry.output.kind === 'done' && (
              <motion.p variants={row} className="inline-flex items-center gap-1.5 text-[#5ee07a]">
                <TbCheck aria-hidden className="h-3.5 w-3.5" /> {entry.output.label.toLowerCase()}
              </motion.p>
            )}
            {entry.output.kind === 'missing' && (
              <Missing name={entry.output.name} guess={entry.output.guess} onRun={(name) => run(name, true)} />
            )}
          </motion.div>
        )}
      </div>

      <label className="flex cursor-text items-center gap-2 border-t border-white/[0.06] px-4 py-2 font-mono text-[16px] sm:px-5 sm:text-[13px]">
        <span className="shrink-0 whitespace-nowrap text-[12px] sm:text-[13px]">
          <Prompt />
        </span>
        <span className="relative min-w-0 flex-1">
          {/* Completion ghost: the typed part is invisible and only holds the rest in position. */}
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre text-white/25">
            <span className="invisible">{input}</span>
            {completion ? completion.slice(query.length) : input ? '' : 'type a command, or help'}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setTouched(true)}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            enterKeyHint="go"
            aria-label="Terminal command"
            className="relative w-full bg-transparent text-white caret-accent outline-none"
          />
        </span>
        {completion && (
          <kbd className="hidden shrink-0 rounded border border-white/15 px-1 text-[10px] text-white/40 sm:block">tab</kbd>
        )}
      </label>

      <div
        role="toolbar"
        aria-label="Quick commands"
        className="thin-scrollbar flex gap-1 overflow-x-auto border-t border-white/[0.06] bg-white/[0.02] px-2 py-2 font-mono text-xs"
      >
        {VIEWS.map((c) => {
          const active = entry.text === c
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              data-cursor="run"
              onClick={() => run(c, true)}
              className={`relative flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                active ? 'bg-white/[0.07] text-white' : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80'
              }`}
            >
              <span aria-hidden className={active ? 'text-accent' : 'text-white/25'}>
                ❯
              </span>
              {c}
              {/* Demo countdown: fills while this view is held, then the next command types itself. */}
              {active && demoing && (
                <motion.span
                  aria-hidden
                  key={entry.id}
                  className="absolute inset-x-2 bottom-0.5 h-px origin-left bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: DEMO_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          )
        })}
        {/* Same list the prompt runs, for people who would rather pick than type. */}
        <button
          type="button"
          onClick={() => useUi.getState().setOverlay('palette')}
          data-cursor="commands"
          aria-label="Open the command palette"
          // Pinned to the right edge so it stays reachable when the chips scroll under it.
          className="sticky right-0 ml-auto flex min-h-9 shrink-0 items-center rounded-md bg-[#111116] px-2 text-accent/80 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <kbd className="rounded border border-white/15 px-1 font-mono text-[10px] text-white/60">⌘K</kbd>
        </button>
      </div>
    </div>
  )
}

function Prompt() {
  return (
    <>
      <span className="text-white/40">~/apurva</span>{' '}
      <span className="hidden text-[#5ee07a]/70 sm:inline">
        <TbGitBranch aria-hidden className="mb-0.5 inline h-3 w-3" />
        main{' '}
      </span>
      <span className="text-accent">❯</span>{' '}
    </>
  )
}

function Help({ actions, onRun }: { actions: string[][]; onRun: (name: string) => void }) {
  const rows = [...VIEWS.map((v) => [v, VIEW_HELP[v]]), ['clear', 'clear the screen'], ...actions]
  return (
    <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      {rows.map(([name, about]) => (
        <motion.li key={name} variants={row} className="min-w-0">
          <button
            type="button"
            data-cursor="run"
            onClick={() => onRun(name)}
            className="flex w-full min-w-0 items-baseline gap-2 rounded py-0.5 text-left hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
          >
            <span className="shrink-0 text-accent">{name}</span>
            <span className="truncate text-white/40">{about}</span>
          </button>
        </motion.li>
      ))}
    </ul>
  )
}

function Missing({ name, guess, onRun }: { name: string; guess: string | null; onRun: (name: string) => void }) {
  return (
    <>
      <motion.p variants={row} className="text-white/60">
        zsh: command not found: <span className="text-white">{name}</span>
      </motion.p>
      <motion.p variants={row} className="mt-1 text-white/45">
        {guess ? (
          <>
            did you mean{' '}
            <button type="button" data-cursor="run" onClick={() => onRun(guess)} className="text-accent underline-offset-2 hover:underline">
              {guess}
            </button>
            ?
          </>
        ) : (
          <>
            try{' '}
            <button type="button" data-cursor="run" onClick={() => onRun('help')} className="text-accent underline-offset-2 hover:underline">
              help
            </button>
          </>
        )}
      </motion.p>
    </>
  )
}

function Caret() {
  return <span aria-hidden className="ml-px inline-block h-[1.05em] w-[0.55ch] translate-y-[0.2em] bg-white/70" />
}

function Whoami() {
  return (
    <>
      <motion.div variants={row} className="flex items-center gap-3">
        <img
          src="/assets/img/circlepic.jpg"
          alt=""
          className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-white/15"
        />
        <div className="min-w-0">
          <p className="truncate font-sans text-sm font-semibold text-white">Apurva Mukherjee</p>
          <p className="truncate text-white/40">
            <span className="text-accent">apurva</span>@portfolio
          </p>
        </div>
      </motion.div>
      <motion.div variants={row} aria-hidden className="my-3 h-px bg-white/[0.07]" />
      <dl className="flex flex-col gap-0.5">
        {WHOAMI.map(([k, v]) => (
          <motion.div key={k} variants={row} className="grid grid-cols-[7ch_minmax(0,1fr)] gap-x-3">
            <dt className="text-white/35">{k}</dt>
            <dd className="truncate text-white/85">{v}</dd>
          </motion.div>
        ))}
      </dl>
    </>
  )
}

function Skills() {
  return (
    <div className="flex flex-col gap-3">
      {skillCategories.map((c) => (
        <motion.div key={c.heading} variants={row}>
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/35">
            {c.heading} <span className="text-white/20">· {c.skills.length}</span>
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {c.skills.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-white/75"
              >
                <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-white/50" />
                {name}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

function Projects() {
  return (
    <>
      <ul className="flex flex-col">
        {PROJECT_ROWS.map((p) => (
          <motion.li key={p.name} variants={row} className="flex min-w-0 items-baseline gap-3 py-0.5">
            <span className="w-[11ch] shrink-0 text-white">{p.name}</span>
            <span className="truncate text-white/45">{p.blurb}</span>
            {p.open && <span className="ml-auto shrink-0 text-[10px] text-[#5ee07a]/80">oss</span>}
          </motion.li>
        ))}
      </ul>
      <motion.a
        variants={row}
        href="#projects"
        onClick={(e) => {
          if (jumpToSection('projects')) e.preventDefault()
        }}
        className="mt-3 inline-flex items-center gap-1 text-accent hover:underline"
      >
        +{MORE_PROJECTS} more on the shelf below
        <TbArrowUpRight aria-hidden className="h-3.5 w-3.5 rotate-90" />
      </motion.a>
    </>
  )
}

function Experience() {
  return (
    <>
      <motion.p variants={row} className="flex items-baseline justify-between gap-3">
        <span className="font-sans text-sm font-semibold text-white">{experience.name}</span>
        <span className="shrink-0 text-white/35">{experience.duration}</span>
      </motion.p>
      <ol className="mt-3 flex flex-col gap-2.5 border-l border-white/10 pl-4">
        {[...experience.roles].reverse().map((r) => {
          const current = r.status === 'Current'
          return (
            <motion.li key={r.role} variants={row} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[21px] top-[0.45em] h-2 w-2 rounded-full ring-4 ring-[#0d0d12] ${current ? 'bg-[#28c840]' : 'bg-white/25'}`}
              />
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-white">{r.role}</span>
                {current && <span className="text-[10px] uppercase tracking-wider text-[#5ee07a]">now</span>}
              </p>
              <p className="text-white/40">{r.time}</p>
            </motion.li>
          )
        })}
      </ol>
    </>
  )
}

function HireMe() {
  return (
    <div className="flex flex-col gap-0.5">
      <motion.p variants={row} className="text-white/45">
        [sudo] password for guest: ••••••••
      </motion.p>
      <motion.p variants={row} className="inline-flex items-center gap-1.5 text-[#5ee07a]">
        <TbCheck aria-hidden className="h-3.5 w-3.5" /> access granted
      </motion.p>
      <motion.div variants={row} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={mail}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-white transition-colors hover:border-accent/60"
        >
          <TbMail aria-hidden className="h-4 w-4 text-accent" />
          {mail.replace('mailto:', '')}
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-white transition-colors hover:border-accent/60"
        >
          <TbBrandLinkedin aria-hidden className="h-4 w-4 text-accent" />
          LinkedIn
        </a>
      </motion.div>
      <motion.p variants={row} className="mt-3 text-white/60">
        Let's build something.
      </motion.p>
    </div>
  )
}
