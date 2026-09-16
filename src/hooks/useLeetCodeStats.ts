import { useCachedStats } from '../lib/localCache'

const LEETCODE_USERNAME = 'apurvamukherjee'
// Bumped: the cached shape gained activeDays/streak — an older entry would render them undefined.
const CACHE_KEY = 'portfolio-leetcode-stats-cache-v2'
const CACHE_TTL_MS = 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 15_000

export interface LeetCodeStats {
  totalSolved: number
  totalSubmissions: number
  /** Distinct days with at least one submission. Null if the calendar endpoint is unreachable — never fabricated. */
  activeDays: number | null
  /** Current daily-submission streak, as LeetCode reports it. Null if unavailable. */
  streak: number | null
}

interface SubmissionBucket {
  difficulty: string
  submissions: number
}

interface LeetCodeSolvedResponse {
  solvedProblem: number
  totalSubmissionNum: SubmissionBucket[]
}

interface LeetCodeCalendarResponse {
  totalActiveDays: number
  streak: number
}

function isValidStats(value: unknown): value is LeetCodeStats {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return typeof s.totalSolved === 'number' && typeof s.totalSubmissions === 'number' && 'activeDays' in s
}

async function fetchStats(): Promise<LeetCodeStats> {
  const [solvedRes, calendarRes] = await Promise.allSettled([
    fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }),
    fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/calendar`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }),
  ])

  if (solvedRes.status !== 'fulfilled' || !solvedRes.value.ok) throw new Error('LeetCode stats request failed')

  const data = (await solvedRes.value.json()) as LeetCodeSolvedResponse
  const totalSubmissions = data.totalSubmissionNum.find((bucket) => bucket.difficulty === 'All')?.submissions ?? 0

  // The calendar is a separate call on the same slow free host — treat it as optional so a
  // cold start there never costs us the solved/submission numbers that did come back.
  let activeDays: number | null = null
  let streak: number | null = null
  if (calendarRes.status === 'fulfilled' && calendarRes.value.ok) {
    const calendar = (await calendarRes.value.json()) as LeetCodeCalendarResponse
    if (typeof calendar.totalActiveDays === 'number') activeDays = calendar.totalActiveDays
    if (typeof calendar.streak === 'number') streak = calendar.streak
  }

  return { totalSolved: data.solvedProblem, totalSubmissions, activeDays, streak }
}

/** Client-side LeetCode stats via an unofficial public API, cached in localStorage for an hour. Never fabricates numbers — falls back to cache or nothing on failure (the upstream host can cold-start slowly). */
export function useLeetCodeStats(): LeetCodeStats | null {
  return useCachedStats({ key: CACHE_KEY, ttlMs: CACHE_TTL_MS, isValid: isValidStats, fetchStats })
}
