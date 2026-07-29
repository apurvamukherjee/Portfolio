import type { IconType } from 'react-icons'
import { motion } from 'framer-motion'
import { TbBrandGithub, TbBrandInstagram, TbBrandLinkedin, TbMail } from 'react-icons/tb'
import { SiLeetcode } from 'react-icons/si'
import { socialLinks, type SocialLink } from '../../data/social'
import { site } from '../../data/site'

const ICONS: Record<SocialLink['icon'], IconType> = {
  instagram: TbBrandInstagram,
  linkedin: TbBrandLinkedin,
  github: TbBrandGithub,
  leetcode: SiLeetcode,
  mail: TbMail,
}

interface FooterProps {
  onOpenTerminal: () => void
}

export function Footer({ onOpenTerminal }: FooterProps) {
  return (
    <footer className="relative w-full bg-black py-10 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 text-center">
        <p className="font-mono text-xl italic text-white/70 md:text-2xl">"{site.footerQuote}"</p>

        <div className="flex flex-col items-center gap-6">
          <span className="font-mono text-lg font-bold text-gradient-accent">GetinTouch();</span>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => {
              const Icon = ICONS[link.icon]
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                  className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white/80"
                >
                  <span className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
                  <Icon size={20} className="relative" />
                </motion.a>
              )
            })}
          </div>
        </div>

        <p className="font-mono text-sm text-white/50">{site.footerCopyright}</p>

        <button
          type="button"
          onClick={onOpenTerminal}
          aria-label="Open hidden terminal easter egg"
          className="min-h-11 rounded-full px-3 font-mono text-xs text-white/30 transition-colors hover:text-accent active:text-accent"
        >
          {'> type '}
          <span className="text-accent/70">sudo</span>
          {' to unlock a secret '}
          <span aria-hidden className="animate-pulse-dot">
            _
          </span>
        </button>
      </div>
    </footer>
  )
}
