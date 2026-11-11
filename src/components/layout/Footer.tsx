import { useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { motion, useInView } from 'framer-motion'
import { TbBrandGithub, TbBrandInstagram, TbBrandLinkedin, TbCheck, TbCopy, TbFileDescription, TbMail } from 'react-icons/tb'
import { SiLeetcode } from 'react-icons/si'
import { socialLinks, type SocialLink } from '../../data/social'
import { site } from '../../data/site'
import { ScrambleText } from '../sections/HeroEffects'
import { iosSpring } from '../../lib/motion'

const ICONS: Record<SocialLink['icon'], IconType> = {
  instagram: TbBrandInstagram,
  linkedin: TbBrandLinkedin,
  github: TbBrandGithub,
  leetcode: SiLeetcode,
  mail: TbMail,
}

const MAIL_HREF = socialLinks.find((l) => l.icon === 'mail')?.href ?? ''
const EMAIL = MAIL_HREF.replace('mailto:', '')
const LINKEDIN = socialLinks.find((l) => l.icon === 'linkedin')?.href ?? ''
// Mail already has its own button above; the row below is everything else.
const ELSEWHERE = socialLinks.filter((l) => l.icon !== 'mail')
const COPIED_MS = 1800

const ACTION =
  'inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2'

interface FooterProps {
  onOpenTerminal: () => void
}

/** Where the page pays off: the contact actions, stated plainly, before the playful sign-off. */
export function Footer({ onOpenTerminal }: FooterProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(
      () => {
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), COPIED_MS)
      },
      // Clipboard blocked (insecure context, denied permission): the mail app is the next best thing.
      () => {
        window.location.href = MAIL_HREF
      },
    )
  }

  return (
    <footer ref={ref} id="contact" className="relative w-full bg-black py-16 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-2xl font-bold text-gradient-accent md:text-4xl">
            <ScrambleText text="getInTouch();" play={inView} />
          </p>
          <p className="max-w-md text-sm text-white/60 md:text-base">{site.summary}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.button
            type="button"
            onClick={copyEmail}
            data-cursor="copy"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={iosSpring}
            className={`${ACTION} border-transparent bg-gradient-to-r from-accent to-accent-deep text-white`}
          >
            {copied ? <TbCheck size={18} aria-hidden /> : <TbCopy size={18} aria-hidden />}
            <span aria-live="polite">{copied ? 'Copied to clipboard' : EMAIL}</span>
          </motion.button>
          <motion.a
            href={site.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={iosSpring}
            className={`${ACTION} border-white/25 text-white hover:border-accent hover:text-accent`}
          >
            <TbFileDescription size={18} aria-hidden />
            Resume
          </motion.a>
          <motion.a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={iosSpring}
            className={`${ACTION} border-white/25 text-white hover:border-accent hover:text-accent`}
          >
            <TbBrandLinkedin size={18} aria-hidden />
            LinkedIn
          </motion.a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {ELSEWHERE.map((link) => {
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
                transition={iosSpring}
                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/40"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
                <Icon size={18} className="relative" />
              </motion.a>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-sm italic text-white/50">"{site.footerQuote}"</p>
          <p className="font-mono text-xs text-white/40">{site.footerCopyright}</p>
        </div>

        <button
          type="button"
          onClick={onOpenTerminal}
          data-cursor="sudo"
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
