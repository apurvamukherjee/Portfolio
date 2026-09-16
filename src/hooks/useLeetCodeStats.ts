import { useCachedStats } from '../lib/localCache'

const LEETCODE_USERNAME = 'apurvamukherjee'
const CACHE_KEY = 'portfolio-leetcode-stats-cache'
const CACHE_TTL_MS = 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 15_000

export interface LeetCodeStats {
  totalSolved: number
  totalSubmissions: number
}

interface SubmissionBucket {
  difficulty: string
  submissions: number
}

interface LeetCodeSolvedResponse {
  solvedProblem: number
  totalSubmissionNum: SubmissionBucket[]
}

function isValidStats(value: unknown): value is LeetCodeStats {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return typeof s.totalSolved === 'number' && typeof s.totalSubmissions === 'number'
}

async function fetchStats(): Promise<LeetCodeStats> {
  const res = await fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error('LeetCode stats request failed')

  const data = (await res.json()) as LeetCodeSolvedResponse
  const totalSubmissions = data.totalSubmissionNum.find((bucket) => bucket.difficulty === 'All')?.submissions ?? 0

  return { totalSolved: data.solvedProblem, totalSubmissions }
}

/** Client-side LeetCode stats via an unofficial public API, cached in localStorage for an hour. Never fabricates numbers — falls back to cache or nothing on failure (the upstream host can cold-start slowly). */
export function useLeetCodeStats(): LeetCodeStats | null {
  return useCachedStats({ key: CACHE_KEY, ttlMs: CACHE_TTL_MS, isValid: isValidStats, fetchStats })
}
