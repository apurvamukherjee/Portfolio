import { useEffect, useState } from 'react'

const GITHUB_USERNAME = 'apurvamukherjee'
const CACHE_KEY = 'portfolio-github-stats-cache'
const CACHE_TTL_MS = 60 * 60 * 1000

export interface GithubStats {
  publicRepos: number
  totalStars: number
  followers: number
  topLanguage: string | null
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

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CacheShape) : null
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
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
  ])

  if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed')

  const user = (await userRes.json()) as GithubUserResponse
  const repos = (await reposRes.json()) as GithubRepoResponse[]
  const ownRepos = repos.filter((repo) => !repo.fork)

  const totalStars = ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

  const languageCounts = new Map<string, number>()
  for (const repo of ownRepos) {
    if (!repo.language) continue
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1)
  }
  let topLanguage: string | null = null
  let topCount = 0
  for (const [language, count] of languageCounts) {
    if (count > topCount) {
      topLanguage = language
      topCount = count
    }
  }

  return { publicRepos: user.public_repos, totalStars, followers: user.followers, topLanguage }
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
