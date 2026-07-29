import { useEffect, useRef, useState } from 'react'

/** True while the page is actively scrolling, false again ~idleMs after it settles. */
export function useIsScrolling(idleMs = 150): boolean {
  const [isScrolling, setIsScrolling] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    function handleScroll() {
      setIsScrolling(true)
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setIsScrolling(false), idleMs)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.clearTimeout(timeoutRef.current)
    }
  }, [idleMs])

  return isScrolling
}
