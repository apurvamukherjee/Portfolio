import { useEffect, useState } from 'react'

/** True once the page has scrolled past `threshold` px — drives the back-to-top button visibility. */
export function useScrollPastThreshold(threshold: number): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setPast(window.scrollY > threshold)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return past
}
