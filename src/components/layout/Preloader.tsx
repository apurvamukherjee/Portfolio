import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const HOLD_DURATION = 2200

interface PreloaderProps {
  onComplete: () => void
}

/** Simple one-time intro: a small loader animation + "By Apurva", then fades to reveal the site. */
export function Preloader({ onComplete }: PreloaderProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, HOLD_DURATION)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-black"
      >
        <DotLottieReact src="/assets/loader.lottie" autoplay loop className="h-32 w-32 sm:h-40 sm:w-40" />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg font-semibold tracking-wide text-white"
        >
          By <span className="text-accent">Apurva</span>
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
