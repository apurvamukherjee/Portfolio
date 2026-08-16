import { useEffect, useState } from 'react'

const GITHUB_USERNAME = 'apurvamukherjee'
// Bumping this version invalidates any cache written by an older shape of GithubStats —
// a stale entry missing new fields (e.g. allLanguages) would otherwise crash the render.
const CACHE_KEY = 'portfolio-github-stats-cache-v2'
const CACHE_TTL_MS = 60 * 60 * 1000

export interface GithubStats {
  publicRepos: number
  totalStars: number
  followers: number
  topLanguage: string | null
  /** All languages detected across own (non-fork) repos, sorted most- to least-used. */
  allLanguages: string[]
  /** All-time GitHub contributions. Null if the contributions API is unreachable — never fabricated. */
  totalContributions: number | null
}

interface CacheShape {
  fetchedAt: number
  stats: GithubStats
}

interface GithubUserResponse {
  public_repos: number
  followers: number
}

interface GithubRepoResponse {
  fork: boolean
  stargazers_count: number
  language: string | null
}

interface ContributionsResponse {
  total: Record<string, number>
}

function isValidCache(value: unknown): value is CacheShape {
  if (typeof value !== 'object' || value === null) return false
  const { fetchedAt, stats } = value as Record<string, unknown>
  if (typeof fetchedAt !== 'number' || typeof stats !== 'object' || stats === null) return false
  const s = stats as Record<string, unknown>
  return (
    typeof s.publicRepos === 'number' &&
    typeof s.totalStars === 'number' &&
    typeof s.followers === 'number' &&
    Array.isArray(s.allLanguages)
  )
}

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidCache(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeCache(stats: GithubStats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), stats }))
  } catch {
    // localStorage unavailable (private mode / disabled) — stats just won't persist across visits
  }
}

async function fetchStats(): Promise<GithubStats> {
  const [userRes, reposRes, contribRes] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=all`),
  ])

  if (userRes.status !== 'fulfilled' || !userRes.value.ok) throw new Error('GitHub user request failed')
  if (reposRes.status !== 'fulfilled' || !reposRes.value.ok) throw new Error('GitHub repos request failed')

  const user = (await userRes.value.json()) as GithubUserResponse
  const repos = (await reposRes.value.json()) as GithubRepoResponse[]
  const ownRepos = repos.filter((repo) => !repo.fork)

  const totalStars = ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

  const languageCounts = new Map<string, number>()
  for (const repo of ownRepos) {
    if (!repo.language) continue
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1)
  }
  const allLanguages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([language]) => language)
  const topLanguage = allLanguages[0] ?? null

  let totalContributions: number | null = null
  if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
    const contributions = (await contribRes.value.json()) as ContributionsResponse
    totalContributions = Object.values(contributions.total).reduce((sum, count) => sum + count, 0)
  }

  return {
    publicRepos: user.public_repos,
    totalStars,
    followers: user.followers,
    topLanguage,
    allLanguages,
    totalContributions,
  }
}

/** Client-side GitHub stats, cached in localStorage for an hour so repeat visits are instant and stay under the unauthenticated rate limit. Never fabricates numbers — falls back to cache or nothing on failure. */
export function useGithubStats(): GithubStats | null {
  const [stats, setStats] = useState<GithubStats | null>(() => readCache()?.stats ?? null)

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
        // Network error or rate-limited — keep showing whatever was already cached, if anything.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return stats
}
