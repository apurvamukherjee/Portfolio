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
