import { useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { iosSpring } from '../../lib/motion'
import { navLinks } from '../../data/nav'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { useIntro } from '../../hooks/useIntro'
import type { Theme } from '../../hooks/useTheme'
import { Logo } from './Logo'
import { Hamburger } from './Hamburger'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from '../shared/ThemeToggle'
import { jumpToSection } from '../../lib/sectionTransition'
import { useUi } from '../../lib/ui'

const MOD_KEY = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'
const openPalette = () => useUi.getState().setOverlay('palette')

// Module-level so useScrollSpy's effect dependency stays referentially stable across renders.
const SECTION_IDS = navLinks.map((l) => l.id)

interface NavbarProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const activeId = useScrollSpy(SECTION_IDS)
  const introDone = useIntro()
  const reduced = useReducedMotion()

  return (
    <>
      <motion.header
        initial={reduced ? undefined : { opacity: 0, y: -16 }}
        animate={reduced || introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-50 w-[92%] max-w-5xl -translate-x-1/2 rounded-full border border-border bg-surface/60 px-4 py-2 shadow-card backdrop-blur-xl md:px-6 notch:top-11"
      >
        <div className="flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.id} className="relative">
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      if (jumpToSection(link.id)) e.preventDefault()
                    }}
                    className={`relative font-mono text-sm transition-colors duration-200 ${
                      activeId === link.id ? 'text-gradient-accent font-semibold' : 'text-ink/80 hover:text-ink'
                    }`}
                  >{`</${link.label}>`}</a>
                  {activeId === link.id && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      transition={iosSpring}
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-accent"
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* The one visible door to everything hidden: sections, music, terminal, the Matrix. */}
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open the command palette"
              data-cursor="commands"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 font-mono text-xs text-muted transition-colors hover:border-accent/60 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:flex"
            >
              <kbd className="font-mono">{MOD_KEY}</kbd>
              <kbd className="font-mono">K</kbd>
            </button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Hamburger open={menuOpen} controls="mobile-menu" onClick={() => setMenuOpen((o) => !o)} />
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} links={navLinks} activeId={activeId} onOpenPalette={openPalette} />
    </>
  )
}
