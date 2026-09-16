/**
 * Zero-dependency self-check for readCache's reject branches. No test runner installed and one
 * parser does not justify adding one — run with `npx tsx src/lib/localCache.selfcheck.ts`.
 */
import assert from 'node:assert/strict'
import { readCache, writeCache } from './localCache'

const store = new Map<string, string>()
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size
  },
} as Storage

interface Stats {
  n: number
}
const isValid = (v: unknown): v is Stats => typeof v === 'object' && v !== null && typeof (v as Stats).n === 'number'

const K = 'k'

// round-trips a valid entry
writeCache(K, { n: 1 })
assert.equal(readCache(K, isValid)?.stats.n, 1)
assert.equal(typeof readCache(K, isValid)?.fetchedAt, 'number')

// missing key
assert.equal(readCache('absent', isValid), null)

// malformed JSON
store.set(K, '{not json')
assert.equal(readCache(K, isValid), null)

// non-number fetchedAt
store.set(K, JSON.stringify({ fetchedAt: 'yesterday', stats: { n: 1 } }))
assert.equal(readCache(K, isValid), null)

// stats failing the validator
store.set(K, JSON.stringify({ fetchedAt: Date.now(), stats: { n: 'nope' } }))
assert.equal(readCache(K, isValid), null)

// stats absent entirely
store.set(K, JSON.stringify({ fetchedAt: Date.now() }))
assert.equal(readCache(K, isValid), null)

// stale entries still return — callers own the TTL
store.set(K, JSON.stringify({ fetchedAt: 0, stats: { n: 7 } }))
assert.equal(readCache(K, isValid)?.stats.n, 7)

// writeCache swallows a throwing localStorage rather than breaking the caller
const ok = globalThis.localStorage
globalThis.localStorage = {
  ...ok,
  setItem: () => {
    throw new Error('quota')
  },
} as Storage
writeCache(K, { n: 2 })
globalThis.localStorage = ok

console.log('localCache self-check passed')
