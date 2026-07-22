import { useState } from 'react'
import { navLinks } from '../../data/nav'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import type { Theme } from '../../hooks/useTheme'
import { Logo } from './Logo'
import { Hamburger } from './Hamburger'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from '../shared/ThemeToggle'

interface NavbarProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(navLinks.map((l) => l.id))

  return (
    <>
      <header
        className="fixed left-1/2 z-50 w-[92%] max-w-5xl -translate-x-1/2 rounded-full border border-border bg-surface/60 px-4 py-2 shadow-card backdrop-blur-xl md:px-6"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`font-mono text-sm transition-colors duration-200 ${
                      activeId === link.id ? 'text-gradient-accent font-semibold' : 'text-ink/80 hover:text-ink'
                    }`}
                  >{`</${link.label}>`}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Hamburger open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} activeId={activeId} />
    </>
  )
}
