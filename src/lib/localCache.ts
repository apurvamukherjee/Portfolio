import { useEffect, useState } from 'react'

interface CacheEntry<T> {
  fetchedAt: number
  stats: T
}

/** Returns a cached value if present and structurally valid, regardless of age — callers decide TTL. */
export function readCache<T>(key: string, isValid: (stats: unknown) => stats is T): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { fetchedAt?: unknown; stats?: unknown }
    if (typeof parsed.fetchedAt !== 'number' || !isValid(parsed.stats)) return null
    return { fetchedAt: parsed.fetchedAt, stats: parsed.stats }
  } catch {
    return null
  }
}

export function writeCache<T>(key: string, stats: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ fetchedAt: Date.now(), stats }))
  } catch {
    // localStorage unavailable (private mode / disabled) — stats just won't persist across visits
  }
}

interface CachedStatsOptions<T> {
  key: string
  ttlMs: number
  isValid: (stats: unknown) => stats is T
  fetchStats: () => Promise<T>
}

/**
 * Shows the cached value immediately, refetches in the background once the TTL has lapsed, and keeps
 * the stale value on failure rather than blanking the UI. Never fabricates numbers.
 */
export function useCachedStats<T>({ key, ttlMs, isValid, fetchStats }: CachedStatsOptions<T>): T | null {
  const [stats, setStats] = useState<T | null>(() => readCache(key, isValid)?.stats ?? null)

  useEffect(() => {
    const cached = readCache(key, isValid)
    if (cached && Date.now() - cached.fetchedAt < ttlMs) return

    let cancelled = false
    fetchStats()
      .then((fresh) => {
        if (cancelled) return
        setStats(fresh)
        writeCache(key, fresh)
      })
      .catch(() => {
        // Network error, timeout, or rate-limit — keep showing whatever was already cached, if anything.
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ttlMs])

  return stats
}
