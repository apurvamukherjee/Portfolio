import { motion, useReducedMotion } from 'framer-motion'
import type { IconType } from 'react-icons'
import { TbBrandGithub, TbCheck, TbCode, TbFlame } from 'react-icons/tb'
import { knownLanguages } from '../../data/skills'
import { useGithubStats } from '../../hooks/useGithubStats'
import { useLeetCodeStats } from '../../hooks/useLeetCodeStats'
import { getLanguageIcon } from '../../lib/languageIcons'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'

interface Stat {
  icon: IconType
  value: string | number
  label: string
  /** Secondary line — the context that makes the headline number mean something. */
  detail?: string
}

/** Resume languages first (their preferred casing), then any GitHub-detected language not already covered. */
function mergeLanguages(resumeLanguages: string[], githubLanguages: string[] | undefined): string[] {
  const seen = new Set(resumeLanguages.map((lang) => lang.toLowerCase()))
  const extra = (githubLanguages ?? []).filter((lang) => !seen.has(lang.toLowerCase()))
  return [...resumeLanguages, ...extra]
}

function formatValue(value: string | number): string | number {
  return typeof value === 'number' ? value.toLocaleString('en-US') : value
}

function StatTile({ icon: Icon, value, label, detail }: Stat) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-5">
      <Icon className="text-muted" size={17} aria-hidden />
      <div>
        <div className="text-[1.75rem] font-semibold leading-none tracking-[-0.02em] text-ink">
          {formatValue(value)}
        </div>
        <div className="mt-2 text-[0.8rem] font-medium text-ink/70">{label}</div>
        {detail && <div className="mt-0.5 text-[0.72rem] text-muted">{detail}</div>}
      </div>
    </div>
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
      detail: `across ${leetcode.totalSubmissions.toLocaleString('en-US')} submissions`,
    })
  }

  if (stats.longestStreak != null) {
    tiles.push({
      icon: TbFlame,
      value: stats.longestStreak,
      label: 'Longest commit streak',
      detail: stats.currentStreak != null ? `${stats.currentStreak} days running now` : undefined,
    })
  }

  tiles.push({
    icon: TbCode,
    value: languages.length,
    label: 'Languages shipped',
    detail: languages.slice(0, 3).join(' · '),
  })

  return (
    <motion.div
      className="mt-10 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={withMotionPreference(fadeUp, reduced)}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <StatTile key={tile.label} {...tile} />
        ))}
      </div>

      <ul className="mt-3 flex list-none flex-wrap gap-1.5 p-0">
        {languages.map((lang) => {
          const LangIcon = getLanguageIcon(lang)
          return (
            <li
              key={lang}
              className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[0.72rem] text-muted"
            >
              <LangIcon size={12} aria-hidden />
              {lang}
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
