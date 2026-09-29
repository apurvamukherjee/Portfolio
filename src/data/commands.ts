import { navLinks } from './nav'
import { socialLinks, type SocialLink } from './social'
import { site } from './site'
import type { Theme } from '../hooks/useTheme'

export interface Command {
  id: string
  label: string
  keywords?: string
  action: () => void
}

interface BuildCommandsArgs {
  theme: Theme
  onToggleTheme: () => void
}

function openExternal(href: string) {
  window.open(href, '_blank', 'noopener,noreferrer')
}

function findSocial(icon: SocialLink['icon']) {
  return socialLinks.find((l) => l.icon === icon)
}

const SOCIAL_COMMANDS: { icon: SocialLink['icon']; label: string; keywords: string }[] = [
  { icon: 'github', label: 'Open GitHub', keywords: 'code repos' },
  { icon: 'linkedin', label: 'Open LinkedIn', keywords: 'career work' },
  { icon: 'leetcode', label: 'Open LeetCode', keywords: 'dsa problems coding practice' },
  { icon: 'instagram', label: 'Open Instagram', keywords: 'social photos' },
]

export function buildCommands({ theme, onToggleTheme }: BuildCommandsArgs): Command[] {
  const commands: Command[] = navLinks.map((link) => ({
    id: `nav-${link.id}`,
    label: `Go to ${link.label}`,
    keywords: `section jump navigate ${link.id}`,
    action: () => {
      window.location.hash = link.id
    },
  }))

  commands.push({
    id: 'toggle-theme',
    label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
    keywords: 'theme dark light appearance',
    action: onToggleTheme,
  })

  const mail = findSocial('mail')
  if (mail) {
    commands.push({
      id: 'copy-email',
      label: 'Copy email address',
      keywords: 'email contact gmail',
      action: () => {
        void navigator.clipboard.writeText(mail.href.replace('mailto:', ''))
      },
    })
  }

  commands.push({
    id: 'open-resume',
    label: 'Open resume',
    keywords: 'cv pdf resume download',
    action: () => openExternal(site.resumeHref),
  })

  for (const { icon, label, keywords } of SOCIAL_COMMANDS) {
    const link = findSocial(icon)
    if (link) commands.push({ id: `open-${icon}`, label, keywords, action: () => openExternal(link.href) })
  }

  return commands
}
