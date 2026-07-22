import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const LETTERS = ['B', 'y', ' ', 'A', 'p', 'u', 'r', 'v', 'a']

export function Preloader() {
  const [visible, setVisible] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), reduced ? 250 : 1500)
    return () => clearTimeout(timer)
  }, [reduced])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
        >
          <div className="flex text-2xl font-semibold text-white">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : i * 0.08, duration: 0.3 }}
                className="inline-block"
              >
                {letter === ' ' ? ' ' : letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
