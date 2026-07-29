import { AnimatePresence, motion } from 'framer-motion'
import type { NavLink } from '../../data/nav'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { site } from '../../data/site'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  links: NavLink[]
  activeId: string
}

export function MobileMenu({ open, onClose, links, activeId }: MobileMenuProps) {
  useLockBodyScroll(open)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[45] flex flex-col items-center justify-center gap-10 bg-surface lg:hidden"
        >
          <ul className="flex flex-col items-center gap-10">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={onClose}
                  className={`font-mono text-xl font-semibold ${
                    activeId === link.id ? 'text-gradient-accent' : 'text-ink'
                  }`}
                >{`</${link.label}>`}</a>
              </li>
            ))}
            <li>
              <a
                href={site.resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="font-mono text-xl font-semibold text-accent"
              >
                {'</Resume>'}
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
