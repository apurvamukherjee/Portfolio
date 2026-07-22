import { AnimatePresence, motion } from 'framer-motion'
import { TbArrowUp } from 'react-icons/tb'
import { useScrollPastThreshold } from '../../hooks/useScrollPastThreshold'

export function BackToTopButton() {
  const visible = useScrollPastThreshold(400)

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.8 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          className="fixed z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface/80 text-ink shadow-card backdrop-blur-sm"
          style={{
            bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
            right: 'max(1.25rem, env(safe-area-inset-right))',
          }}
        >
          <TbArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
