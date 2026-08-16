import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { IconType } from 'react-icons'
import { TbBrandGithub, TbCheck, TbCode, TbFlame, TbStar, TbUsers } from 'react-icons/tb'
import { knownLanguages } from '../../data/skills'
import { useGithubStats } from '../../hooks/useGithubStats'
import { useLeetCodeStats } from '../../hooks/useLeetCodeStats'
import { getLanguageIcon } from '../../lib/languageIcons'
import { fadeUp, viewportOnce, withMotionPreference } from '../../lib/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface StatFrame {
  icon: IconType
  label: string
  value: string | number
}

interface StatGroup {
  key: string
  frames: StatFrame[]
  intervalMs: number
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

function StatTile({ frames, intervalMs, reduced, className }: StatGroup & { reduced: boolean; className?: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (frames.length <= 1 || reduced || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), intervalMs)
    return () => clearInterval(id)
  }, [frames.length, intervalMs, reduced, paused])

  const frame = frames[index]
  const Icon = frame.icon

  return (
    <div
      className={`relative flex min-h-[132px] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-border bg-surface-raised px-4 py-5 text-center ${className ?? ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="sr-only">
        {frames.map((f) => `${f.label}: ${formatValue(f.value)}`).join(', ')}
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center gap-2"
          aria-hidden
        >
          <Icon className="text-accent" size={20} />
          <span className="text-xl font-bold text-ink">{formatValue(frame.value)}</span>
          <span className="text-xs text-muted">{frame.label}</span>
        </motion.div>
      </AnimatePresence>
      {frames.length > 1 && (
        <div className="mt-1 flex gap-1" aria-hidden>
          {frames.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                i === index ? 'bg-accent' : 'bg-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function GithubStats() {
  const reduced = useReducedMotion()
  const stats = useGithubStats()
  const leetcode = useLeetCodeStats()

  if (!stats) return null

  const githubFrames: StatFrame[] = [
    { icon: TbBrandGithub, label: 'Public repos', value: stats.publicRepos },
    { icon: TbStar, label: 'Stars earned', value: stats.totalStars },
    { icon: TbUsers, label: 'Followers', value: stats.followers },
  ]
  if (stats.totalContributions != null) {
    githubFrames.push({ icon: TbCode, label: 'All-time contributions', value: stats.totalContributions })
  }

  const languages = mergeLanguages(knownLanguages, stats.allLanguages)
  const languageFrames: StatFrame[] = languages.map((lang) => ({
    icon: getLanguageIcon(lang),
    label: 'Language',
    value: lang,
  }))

  const leetcodeFrames: StatFrame[] = leetcode
    ? [
        { icon: TbCode, label: 'LeetCode submissions', value: leetcode.totalSubmissions },
        { icon: TbCheck, label: 'Problems solved', value: leetcode.totalSolved },
      ]
    : []

  const streakFrames: StatFrame[] =
    stats.currentStreak != null && stats.longestStreak != null
      ? [
          { icon: TbFlame, label: 'Day streak', value: stats.currentStreak },
          { icon: TbFlame, label: 'Best streak', value: stats.longestStreak },
        ]
      : []

  const groups: StatGroup[] = [
    { key: 'github', frames: githubFrames, intervalMs: 2600 },
    { key: 'languages', frames: languageFrames, intervalMs: 2000 },
    { key: 'leetcode', frames: leetcodeFrames, intervalMs: 3200 },
    { key: 'streak', frames: streakFrames, intervalMs: 2800 },
  ].filter((group) => group.frames.length > 0)

  const colsClass =
    { 4: 'sm:grid-cols-4', 3: 'sm:grid-cols-3', 2: 'sm:grid-cols-2' }[groups.length] ?? 'sm:grid-cols-2'
  // The 4th tile (streak) depends on a couple of live APIs, one of them a slow-to-cold-start
  // free host — if it doesn't answer in time, the grid can still land on an odd count. Rather
  // than hope every fetch lands, make the last tile span the full mobile row whenever the count
  // is odd, so the 2-column layout never leaves a lone card dangling next to empty space.
  const isOdd = groups.length % 2 === 1

  return (
    <motion.div
      className={`mt-10 grid w-full grid-cols-2 gap-4 ${colsClass}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={withMotionPreference(fadeUp, reduced)}
    >
      {groups.map((group, i) => (
        <StatTile
          key={group.key}
          frames={group.frames}
          intervalMs={group.intervalMs}
          reduced={reduced}
          className={isOdd && i === groups.length - 1 ? 'col-span-2 sm:col-span-1' : undefined}
        />
      ))}
    </motion.div>
  )
}
