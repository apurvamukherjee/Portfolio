import { useNotch } from './store'

const FALLBACK_MS = 1500

/** Scrolls to the top where the island is pinned, then opens it once the page has settled. */
export function openNotch() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  let done = false
  const open = () => {
    if (done) return
    done = true
    window.removeEventListener('scroll', onScroll)
    useNotch.getState().setOpen(true)
  }
  const onScroll = () => {
    if (window.scrollY < 4) open()
  }
  if (window.scrollY < 4) return open()
  window.addEventListener('scroll', onScroll, { passive: true })
  // Scroll events can stop short of 0 (e.g. interrupted by the user); don't leave the listener dangling.
  setTimeout(open, FALLBACK_MS)
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}
