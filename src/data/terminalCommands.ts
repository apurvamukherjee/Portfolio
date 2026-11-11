import { site } from './site'
import { socialLinks } from './social'
import { skillCategories } from './skills'
import { projectBlurb, projects } from './projects'
import { experience } from './experience'
import type { Command } from './commands'

const COMMAND_DESCRIPTIONS: Record<string, string> = {
  help: 'list available commands',
  whoami: 'who you are talking to',
  about: 'a short bio',
  skills: "tech stack, by category",
  projects: "things I've built",
  experience: 'work history',
  contact: 'ways to reach me',
  clear: 'clear the terminal',
  exit: 'close this terminal',
}

function helpLines(commands: Command[]): string[] {
  const width = Math.max(...commands.map((c) => c.alias.length))
  return [
    'Available commands:',
    ...Object.entries(COMMAND_DESCRIPTIONS).map(([name, desc]) => `  ${name.padEnd(width)} — ${desc}`),
    '',
    'Actions (the same ones as ⌘K):',
    ...commands.map((c) => `  ${c.alias.padEnd(width)} — ${c.label.toLowerCase()}`),
  ]
}

function whoamiLines(): string[] {
  return [site.name, site.tagline]
}

function aboutLines(): string[] {
  return [site.summary]
}

function skillsLines(): string[] {
  return skillCategories.map((category) => `${category.heading}: ${category.skills.map((s) => s.name).join(', ')}`)
}

function projectsLines(): string[] {
  return projects.map((project) => `${project.name} — ${projectBlurb(project)}`)
}

function experienceLines(): string[] {
  const lines = [`${experience.name} — ${experience.duration}`]
  experience.roles.forEach((role) => {
    lines.push(`  ${role.role} (${role.time}) [${role.status}]`)
  })
  return lines
}

function contactLines(): string[] {
  return socialLinks.map((link) => `${link.label}: ${link.href.replace('mailto:', '')}`)
}

function sudoLines(args: string): string[] {
  if (args.trim() === 'hire-me') {
    const mail = socialLinks.find((l) => l.icon === 'mail')
    const linkedin = socialLinks.find((l) => l.icon === 'linkedin')
    return [
      '[sudo] password for guest: ********',
      'Access granted.',
      `→ ${mail ? mail.href.replace('mailto:', '') : ''}`,
      `→ ${linkedin ? linkedin.href : ''}`,
      "Let's build something.",
    ]
  }
  return ['sudo: permission denied']
}

/** The site action a line of input names, if any: `theme`, `play`, `cd projects`… */
export function findAction(input: string, commands: Command[]): Command | undefined {
  const typed = input.trim().toLowerCase().replace(/\s+/g, ' ')
  return commands.find((c) => c.alias === typed)
}

/** `clear`, `exit` and site actions are handled by the Terminal component itself before reaching here. */
export function runTerminalCommand(input: string, commands: Command[]): string[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  const [name, ...rest] = trimmed.split(/\s+/)
  const args = rest.join(' ')

  switch (name.toLowerCase()) {
    case 'help':
      return helpLines(commands)
    case 'whoami':
      return whoamiLines()
    case 'about':
      return aboutLines()
    case 'skills':
      return skillsLines()
    case 'projects':
      return projectsLines()
    case 'experience':
      return experienceLines()
    case 'contact':
      return contactLines()
    case 'sudo':
      return sudoLines(args)
    default:
      return [`bash: ${name}: command not found`]
  }
}
