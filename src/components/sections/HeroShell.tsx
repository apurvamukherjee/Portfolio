import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { TbArrowUpRight, TbBrandLinkedin, TbCheck, TbMail } from 'react-icons/tb'
import { skillCategories } from '../../data/skills'
import { projects } from '../../data/projects'
import { experience } from '../../data/experience'
import { socialLinks } from '../../data/social'
import { jumpToSection } from '../../lib/sectionTransition'

const COMMANDS = ['whoami', 'skills', 'projects', 'experience', 'sudo hire-me'] as const
type Command = (typeof COMMANDS)[number]

const TYPE_MS = 42
const PINNED = ['Visor', 'Zenith', 'KeyStrike', 'Pixelpanic', 'Monopolis', 'Kiwami']

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const WHOAMI: [string, ReactNode][] = [
  ['role', 'Full-stack engineer'],
  ['stack', 'React · React Native · Node · MongoDB'],
  ['edu', "CSE, KIIT '26"],
  ['base', 'Kolkata, IN'],
  ['ride', 'Honda CBR250R, Stage 2'],
  ['github', '2,844 contributions in 2026'],
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
  blurb: p.description.replace(/<[^>]+>/g, '').split(/(?<=[.!?])\s/)[0].replace(/\.$/, ''),
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

/**
 * The hero's interactive shell. Each command types itself out, then renders a small structured
 * view instead of raw text. Commands live in a tab bar so there's always an obvious next click.
 */
export function HeroShell() {
  const reduced = !!useReducedMotion()
  const [cmd, setCmd] = useState<Command>('whoami')
  const [run, setRun] = useState(0)
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const screen = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    screen.current?.scrollTo({ top: 0 })
    async function play() {
      setDone(false)
      if (reduced) {
        setTyped(cmd)
        setDone(true)
        return
      }
      setTyped('')
      for (let i = 1; i <= cmd.length; i++) {
        await sleep(TYPE_MS)
        if (!alive) return
        setTyped(cmd.slice(0, i))
      }
      await sleep(160)
      if (alive) setDone(true)
    }
    void play()
    return () => {
      alive = false
    }
  }, [cmd, run, reduced])

  return (
    <div className="flex flex-col">
      <div
        ref={screen}
        role="log"
        aria-live="polite"
        aria-label="Interactive terminal demo"
        className="thin-scrollbar h-[300px] overflow-y-auto px-4 py-4 font-mono text-[12px] leading-relaxed text-white/80 sm:px-5 sm:text-[13px]"
      >
        <p className="whitespace-nowrap">
          <Prompt />
          <span className="text-white">{typed}</span>
          {!done && <Caret />}
        </p>

        {done && (
          <motion.div key={`${cmd}-${run}`} className="mt-3" initial={reduced ? false : 'hidden'} animate="visible" variants={list}>
            {cmd === 'whoami' && <Whoami />}
            {cmd === 'skills' && <Skills />}
            {cmd === 'projects' && <Projects />}
            {cmd === 'experience' && <Experience />}
            {cmd === 'sudo hire-me' && <HireMe />}
            <motion.p variants={row} className="mt-4 whitespace-nowrap">
              <Prompt />
              <Caret blink />
            </motion.p>
          </motion.div>
        )}
      </div>

      <div
        role="toolbar"
        aria-label="Terminal commands"
        className="thin-scrollbar flex gap-1 overflow-x-auto border-t border-white/[0.06] bg-white/[0.02] px-2 py-2 font-mono text-xs"
      >
        {COMMANDS.map((c) => {
          const active = cmd === c
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setCmd(c)
                setRun((n) => n + 1)
              }}
              className={`relative flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                active ? 'bg-white/[0.07] text-white' : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80'
              }`}
            >
              <span aria-hidden className={active ? 'text-accent' : 'text-white/25'}>
                ❯
              </span>
              {c}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Prompt() {
  return (
    <>
      <span className="text-white/40">~/apurva</span> <span className="text-accent">❯</span>{' '}
    </>
  )
}

function Caret({ blink = false }: { blink?: boolean }) {
  return (
    <span
      aria-hidden
      className={`ml-px inline-block h-[1.05em] w-[0.55ch] translate-y-[0.2em] bg-white/70 ${blink ? 'animate-pulse-dot motion-reduce:animate-none' : ''}`}
    />
  )
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
