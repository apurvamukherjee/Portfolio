import { useEffect, useEffectEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { FACTS } from '../../data/facts'

const START_DELAY_MS = 500
const TYPE_MS = 20
const READ_MS = 1600
const ERASE_MS = 8
const EXIT_DELAY_MS = 150

interface PreloaderProps {
  onComplete: () => void
}

/** One-time intro: loader animation, "By Apurva", and a random fact that types in, holds, then erases before the site reveals. */
export function Preloader({ onComplete }: PreloaderProps) {
  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-surface px-6"
    >
      <DotLottieReact src="/assets/loader.lottie" autoplay loop className="h-44 w-44 sm:h-56 sm:w-56 [[data-theme=light]_&]:invert" />
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl font-semibold tracking-wide text-ink sm:text-2xl"
      >
        By <span className="text-accent">Apurva</span>
      </motion.p>
      <TypedFact onDone={onComplete} />
    </div>
  )
}

/** Owns the per-character state so each keystroke re-renders only this line, not the Lottie player. */
function TypedFact({ onDone }: { onDone: () => void }) {
  const [fact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)] ?? '')
  const [chars, setChars] = useState(0)
  // Effect event, so a re-render of App mid-intro (new onDone identity) doesn't restart the typing.
  const complete = useEffectEvent(onDone)

  useEffect(() => {
    let count = 0
    let timer: ReturnType<typeof setTimeout>

    const erase = () => {
      count -= 1
      setChars(count)
      timer = count > 0 ? setTimeout(erase, ERASE_MS) : setTimeout(complete, EXIT_DELAY_MS)
    }
    const type = () => {
      count += 1
      setChars(count)
      timer = count < fact.length ? setTimeout(type, TYPE_MS) : setTimeout(erase, READ_MS)
    }

    timer = setTimeout(fact ? type : complete, START_DELAY_MS)
    return () => clearTimeout(timer)
  }, [fact])

  return (
    <p
      aria-label={`Fact: ${fact}`}
      className="mt-4 min-h-[4.5rem] max-w-xl text-center font-mono text-xs leading-relaxed text-ink/70 sm:text-sm"
    >
      <span aria-hidden>
        <span className="text-accent">facts: </span>
        {fact.slice(0, chars)}
        <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse-dot bg-accent" />
      </span>
    </p>
  )
}
