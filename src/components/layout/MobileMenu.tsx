import { useEffect, useRef, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { NavLink } from '../../data/nav'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { site } from '../../data/site'
import { iosSpringSoft } from '../../lib/motion'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  links: NavLink[]
  activeId: string
}

export function MobileMenu({ open, onClose, links, activeId }: MobileMenuProps) {
  useLockBodyScroll(open)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const id = requestAnimationFrame(() => firstLinkRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      cancelAnimationFrame(id)
    }
  }, [open, onClose])

  // The browser's own hash jump fires while body overflow is still locked, which can leave the
  // page where it was. Close first, then scroll once the lock has been released.
  function go(e: MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    onClose()
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={iosSpringSoft}
          className="fixed inset-0 z-[45] flex flex-col items-center justify-center gap-10 bg-surface/90 vibrancy lg:hidden"
        >
          <ul className="flex flex-col items-center gap-8">
            {links.map((link, i) => (
              <li key={link.id}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${link.id}`}
                  onClick={(e) => go(e, link.id)}
                  aria-current={activeId === link.id ? 'location' : undefined}
                  className={`rounded-md px-2 py-1 font-mono text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
                className="rounded-md px-2 py-1 font-mono text-xl font-semibold text-accent outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
