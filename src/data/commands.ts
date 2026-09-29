import { navLinks } from './nav'
import { socialLinks, type SocialLink } from './social'
import { site } from './site'
import { skillCategories } from './skills'
import { experience } from './experience'
import { projects } from './projects'
import { leadershipEvents } from './leadership'
import type { Theme } from '../hooks/useTheme'

export interface CommandPreview {
  heading: string
  lines: string[]
}

export interface Command {
  id: string
  label: string
  keywords?: string
  /** What the palette shows about the destination while this row is highlighted. */
  preview?: CommandPreview
  action: () => void
}

const SECTION_PREVIEWS: Record<string, CommandPreview> = {
  home: { heading: site.name, lines: [site.tagline, site.summary] },
  about: { heading: 'About me', lines: [site.summary, 'Live GitHub and LeetCode stats'] },
  skills: {
    heading: `${skillCategories.reduce((n, c) => n + c.skills.length, 0)} skills`,
    lines: skillCategories.map((c) => `${c.heading} · ${c.skills.length}`),
  },
  experience: {
    heading: `${experience.name} · ${experience.duration}`,
    lines: experience.roles.map((r) => `${r.role} · ${r.time}`),
  },
  projects: {
    heading: `${projects.length} projects`,
    lines: [projects.slice(0, 5).map((p) => p.name).join(' · ')],
  },
  leadership: { heading: 'Leadership', lines: leadershipEvents.map((e) => e.title) },
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
    preview: SECTION_PREVIEWS[link.id],
    action: () => {
      window.location.hash = link.id
    },
  }))

  commands.push({
    id: 'toggle-theme',
    label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
    keywords: 'theme dark light appearance',
    preview: { heading: 'Appearance', lines: [`Currently ${theme}. Also on the navbar's sun/moon button.`] },
    action: onToggleTheme,
  })

  const mail = findSocial('mail')
  if (mail) {
    commands.push({
      id: 'copy-email',
      label: 'Copy email address',
      keywords: 'email contact gmail',
      preview: { heading: 'Copies to clipboard', lines: [mail.href.replace('mailto:', '')] },
      action: () => {
        void navigator.clipboard.writeText(mail.href.replace('mailto:', ''))
      },
    })
  }

  commands.push({
    id: 'open-resume',
    label: 'Open resume',
    keywords: 'cv pdf resume download',
    preview: { heading: 'Opens in a new tab', lines: ['Résumé on Google Drive'] },
    action: () => openExternal(site.resumeHref),
  })

  for (const { icon, label, keywords } of SOCIAL_COMMANDS) {
    const link = findSocial(icon)
    if (link) {
      commands.push({
        id: `open-${icon}`,
        label,
        keywords,
        preview: { heading: 'Opens in a new tab', lines: [link.href] },
        action: () => openExternal(link.href),
      })
    }
  }

  return commands
}
