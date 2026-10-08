import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const TYPE_MS = 55
const ERASE_MS = 28
const HOLD_MS = 1500

/** Types each word, holds, erases, moves on. Static first word under reduced motion. */
export function TypedRoles({ words, className = '' }: { words: readonly string[]; className?: string }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    if (reduced) return
    const len = words[index].length
    let delay = erasing ? ERASE_MS : TYPE_MS
    if (!erasing && count === len) delay = HOLD_MS
    const id = setTimeout(() => {
      if (!erasing && count === len) setErasing(true)
      else if (!erasing) setCount(count + 1)
      else if (count > 0) setCount(count - 1)
      else {
        setErasing(false)
        setIndex((i) => (i + 1) % words.length)
      }
    }, delay)
    return () => clearTimeout(id)
  }, [count, erasing, index, words, reduced])

  const shown = reduced ? words[0] : words[index].slice(0, count)
  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden>
        {shown}
        {!reduced && <span className="animate-pulse-dot ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-accent" />}
      </span>
    </span>
  )
}
