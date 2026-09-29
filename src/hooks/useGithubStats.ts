import { useCachedStats } from '../lib/localCache'

const GITHUB_USERNAME = 'apurvamukherjee'
// Bumping this version invalidates any cache written by an older shape of GithubStats —
// a stale entry missing new fields (e.g. allLanguages) would otherwise crash the render.
const CACHE_KEY = 'portfolio-github-stats-cache-v2'
const CACHE_TTL_MS = 60 * 60 * 1000

export interface GithubStats {
  publicRepos: number
  /** All languages detected across own (non-fork) repos, sorted most- to least-used. */
  allLanguages: string[]
  /** All-time GitHub contributions. Null if the contributions API is unreachable — never fabricated. */
  totalContributions: number | null
}

interface GithubUserResponse {
  public_repos: number
}

interface GithubRepoResponse {
  fork: boolean
  language: string | null
}

interface ContributionsResponse {
  total: Record<string, number>
}

function isValidStats(value: unknown): value is GithubStats {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return typeof s.publicRepos === 'number' && Array.isArray(s.allLanguages)
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

  const languageCounts = new Map<string, number>()
  for (const repo of ownRepos) {
    if (!repo.language) continue
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1)
  }
  const allLanguages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([language]) => language)

  let totalContributions: number | null = null
  if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
    const contributions = (await contribRes.value.json()) as ContributionsResponse
    totalContributions = Object.values(contributions.total).reduce((sum, count) => sum + count, 0)
  }

  return { publicRepos: user.public_repos, allLanguages, totalContributions }
}

/** Client-side GitHub stats, cached in localStorage for an hour so repeat visits are instant and stay under the unauthenticated rate limit. Never fabricates numbers — falls back to cache or nothing on failure. */
export function useGithubStats(): GithubStats | null {
  return useCachedStats({ key: CACHE_KEY, ttlMs: CACHE_TTL_MS, isValid: isValidStats, fetchStats })
}
