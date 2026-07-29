import { navLinks } from './nav'
import { socialLinks } from './social'
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

function findSocial(icon: (typeof socialLinks)[number]['icon']) {
  return socialLinks.find((l) => l.icon === icon)
}

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

  const github = findSocial('github')
  if (github) {
    commands.push({ id: 'open-github', label: 'Open GitHub', keywords: 'code repos', action: () => openExternal(github.href) })
  }

  const linkedin = findSocial('linkedin')
  if (linkedin) {
    commands.push({ id: 'open-linkedin', label: 'Open LinkedIn', keywords: 'career work', action: () => openExternal(linkedin.href) })
  }

  const leetcode = findSocial('leetcode')
  if (leetcode) {
    commands.push({ id: 'open-leetcode', label: 'Open LeetCode', keywords: 'dsa problems coding practice', action: () => openExternal(leetcode.href) })
  }

  const instagram = findSocial('instagram')
  if (instagram) {
    commands.push({ id: 'open-instagram', label: 'Open Instagram', keywords: 'social photos', action: () => openExternal(instagram.href) })
  }

  return commands
}
