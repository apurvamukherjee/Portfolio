/**
 * Jumps to a section behind a View Transition wipe. Returns false when the browser can't do it
 * (or the viewer prefers reduced motion) so the caller can let the anchor's default smooth
 * scroll happen instead.
 */
export function jumpToSection(id: string): boolean {
  const target = document.getElementById(id)
  if (!target || !('startViewTransition' in document) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  const root = document.documentElement
  // Scoped via data-vt so the theme toggle's circle reveal keeps its own ::view-transition rules.
  root.dataset.vt = target.getBoundingClientRect().top > 0 ? 'down' : 'up'
  const transition = document.startViewTransition(() => {
    target.scrollIntoView({ behavior: 'instant', block: 'start' })
    if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
  })
  const cleanup = () => delete root.dataset.vt
  // A throwing update callback still surfaces through updateCallbackDone; this only resets the flag.
  transition.finished.then(cleanup, cleanup)
  return true
}
