import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { TbBrandGithub, TbCheck, TbCode, TbFlame } from 'react-icons/tb'
import { knownLanguages } from '../../data/skills'
import { useGithubStats } from '../../hooks/useGithubStats'
import { useLeetCodeStats } from '../../hooks/useLeetCodeStats'
import { getLanguageIcon } from '../../lib/languageIcons'
import { appleEase, iosSpring, staggerContainer, viewportOnce, withMotionPreference } from '../../lib/motion'

/** Each tile owns one hue from the iOS system palette, defined per-theme in index.css. */
type Accent = 'repos' | 'solved' | 'days' | 'langs'

const ACCENT_VAR: Record<Accent, string> = {
  repos: 'var(--color-kpi-repos)',
  solved: 'var(--color-kpi-solved)',
  days: 'var(--color-kpi-days)',
  langs: 'var(--color-kpi-langs)',
}

interface Stat {
  icon: IconType
  value: number
  label: string
  accent: Accent
  /** Secondary line — the context that makes the headline number mean something. */
  detail?: string
}

/** Resume languages first (their preferred casing), then any GitHub-detected language not already covered. */
function mergeLanguages(resumeLanguages: string[], githubLanguages: string[] | undefined): string[] {
  const seen = new Set(resumeLanguages.map((lang) => lang.toLowerCase()))
  const extra = (githubLanguages ?? []).filter((lang) => !seen.has(lang.toLowerCase()))
  return [...resumeLanguages, ...extra]
}

/**
 * Counts from 0 to `value` once the tile scrolls into view. Framer's `animate` drives a plain
 * number here rather than a motion value bound to the DOM, because the digits need `toLocaleString`
 * formatting on every frame — cheap at four tiles, and it keeps the markup a normal text node
 * that screen readers and `sr-only` fallbacks can still read.
 */
function useCountUp(value: number, active: boolean, reduced: boolean | null): number {
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    if (!active) return
    // Larger numbers get a slightly longer run so 196 doesn't blur past while 10 crawls.
    const duration = Math.min(1.6, 0.7 + Math.log10(Math.max(value, 1)) * 0.28)
    const controls = animate(0, value, {
      duration,
      ease: appleEase,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value, active, reduced])

  return display
}

function StatTile({ icon: Icon, value, label, detail, accent, reduced }: Stat & { reduced: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const display = useCountUp(value, inView, reduced)
  const color = ACCENT_VAR[accent]

  return (
    <motion.div
      ref={ref}
      variants={withMotionPreference(
        {
          hidden: { opacity: 0, y: 20, scale: 0.97 },
          visible: { opacity: 1, y: 0, scale: 1, transition: iosSpring },
        },
        reduced,
      )}
      whileHover={reduced ? undefined : { y: -5, transition: iosSpring }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
      style={{ ['--tile-accent' as string]: color }}
      className="group relative isolate flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-surface-raised p-5 transition-[border-color,box-shadow] duration-300 hover:border-[var(--tile-accent)]/45 hover:shadow-[0_14px_34px_-18px_var(--tile-accent)]"
    >
      {/* Tint wash — sits behind content, blooms from the corner the icon lives in. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 -z-10 h-28 w-28 rounded-full opacity-[0.12] blur-2xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: color }}
      />

      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
      >
        <Icon size={17} />
      </span>

      <div>
        <div
          className="text-[1.75rem] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink"
          aria-label={String(value)}
        >
          {display.toLocaleString('en-US')}
        </div>
        <div className="mt-2 text-[0.8rem] font-medium text-ink/70">{label}</div>
        {detail && <div className="mt-0.5 text-[0.72rem] text-muted">{detail}</div>}
      </div>
    </motion.div>
  )
}

export function GithubStats() {
  const reduced = useReducedMotion()
  const stats = useGithubStats()
  const leetcode = useLeetCodeStats()

  if (!stats) return null

  const languages = mergeLanguages(knownLanguages, stats.allLanguages)

  const tiles: Stat[] = [
    {
      icon: TbBrandGithub,
      value: stats.publicRepos,
      label: 'Public repositories',
      accent: 'repos',
      detail:
        stats.totalContributions != null
          ? `${stats.totalContributions.toLocaleString('en-US')} all-time contributions`
          : undefined,
    },
  ]

  if (leetcode) {
    tiles.push({
      icon: TbCheck,
      value: leetcode.totalSolved,
      label: 'LeetCode problems solved',
      accent: 'solved',
      detail: `across ${leetcode.totalSubmissions.toLocaleString('en-US')} submissions`,
    })
  }

  if (leetcode?.activeDays != null) {
    tiles.push({
      icon: TbFlame,
      value: leetcode.activeDays,
      label: 'Days solving problems',
      accent: 'days',
      detail:
        stats.longestStreak != null ? `${stats.longestStreak}-day best commit streak` : undefined,
    })
  }

  tiles.push({
    icon: TbCode,
    value: languages.length,
    label: 'Languages shipped',
    accent: 'langs',
    detail: languages.slice(0, 3).join(' · '),
  })

  return (
    <motion.div
      className="mt-10 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08)}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <StatTile key={tile.label} {...tile} reduced={reduced} />
        ))}
      </div>

      <motion.ul
        className="mt-3 flex list-none flex-wrap gap-1.5 p-0"
        variants={staggerContainer(0.03, 0.25)}
      >
        {languages.map((lang) => {
          const LangIcon = getLanguageIcon(lang)
          return (
            <motion.li
              key={lang}
              variants={withMotionPreference(
                {
                  hidden: { opacity: 0, y: 8, scale: 0.94 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: iosSpring },
                },
                reduced,
              )}
              whileHover={reduced ? undefined : { y: -2, transition: iosSpring }}
              className="flex cursor-default items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[0.72rem] text-muted transition-colors duration-200 hover:border-ink/25 hover:text-ink"
            >
              <LangIcon size={12} aria-hidden />
              {lang}
            </motion.li>
          )
        })}
      </motion.ul>
    </motion.div>
  )
}
