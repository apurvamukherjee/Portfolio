import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbFileDescription } from 'react-icons/tb'
import { site } from '../../data/site'

/** A keycap-style button in the site's red/black palette — stamps like a hanko seal when clicked. */
export function FloatingResumeButton() {
  const [stamped, setStamped] = useState(false)

  return (
    <motion.a
      href={site.resumeHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open resume PDF"
      onClick={() => setStamped(true)}
      whileHover={{ y: -3 }}
      whileTap={{ y: 3 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className="fixed z-40 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-gradient-to-b from-accent to-accent-deep"
      style={{
        boxShadow: '0 4px 0 0 #1a0000, 0 10px 20px rgba(255,0,0,0.3)',
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        left: 'max(1.25rem, env(safe-area-inset-left))',
      }}
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 text-white">
        <TbFileDescription size={20} />
        <AnimatePresence>
          {stamped && (
            <motion.span
              initial={{ opacity: 0.6, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onAnimationComplete={() => setStamped(false)}
              className="absolute inset-0 rounded-full border-2 border-white"
            />
          )}
        </AnimatePresence>
      </span>
    </motion.a>
  )
}
