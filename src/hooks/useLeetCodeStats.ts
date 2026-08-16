import { useEffect, useState } from 'react'

const LEETCODE_USERNAME = 'apurvamukherjee'
const CACHE_KEY = 'portfolio-leetcode-stats-cache'
const CACHE_TTL_MS = 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 15_000

export interface LeetCodeStats {
  totalSolved: number
  totalSubmissions: number
}

interface CacheShape {
  fetchedAt: number
  stats: LeetCodeStats
}

interface SubmissionBucket {
  difficulty: string
  submissions: number
}

interface LeetCodeSolvedResponse {
  solvedProblem: number
  totalSubmissionNum: SubmissionBucket[]
}

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CacheShape) : null
  } catch {
    return null
  }
}

function writeCache(stats: LeetCodeStats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), stats }))
  } catch {
    // localStorage unavailable (private mode / disabled) — stats just won't persist across visits
  }
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
  const [stats, setStats] = useState<LeetCodeStats | null>(() => readCache()?.stats ?? null)

  useEffect(() => {
    const cached = readCache()
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return

    let cancelled = false
    fetchStats()
      .then((fresh) => {
        if (cancelled) return
        setStats(fresh)
        writeCache(fresh)
      })
      .catch(() => {
        // Network error, timeout, or cold-start failure — keep showing whatever was already cached, if anything.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return stats
}
