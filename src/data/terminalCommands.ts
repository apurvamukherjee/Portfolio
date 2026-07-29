import { site } from './site'
import { socialLinks } from './social'
import { skillCategories } from './skills'
import { projects } from './projects'
import { experience } from './experience'

const COMMAND_DESCRIPTIONS: Record<string, string> = {
  help: 'list available commands',
  whoami: 'who you are talking to',
  about: 'a short bio',
  skills: "tech stack, by category",
  projects: "things I've built",
  experience: 'work history',
  resume: 'open the resume in a new tab',
  contact: 'ways to reach me',
  clear: 'clear the terminal',
  exit: 'close this terminal',
}

function helpLines(): string[] {
  return ['Available commands:', ...Object.entries(COMMAND_DESCRIPTIONS).map(([name, desc]) => `  ${name.padEnd(10)} — ${desc}`)]
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
  return projects.map((project) => {
    const plainDescription = project.description.replace(/<[^>]+>/g, '')
    const firstSentence = plainDescription.split(/(?<=[.!?])\s/)[0]
    return `${project.name} — ${firstSentence}`
  })
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

/** `clear` and `exit` are handled by the Terminal component itself before reaching here. */
export function runTerminalCommand(input: string): string[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  const [name, ...rest] = trimmed.split(/\s+/)
  const args = rest.join(' ')

  switch (name.toLowerCase()) {
    case 'help':
      return helpLines()
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
    case 'resume':
      window.open(site.resumeHref, '_blank', 'noopener,noreferrer')
      return ['Opening resume…']
    case 'contact':
      return contactLines()
    case 'sudo':
      return sudoLines(args)
    default:
      return [`bash: ${name}: command not found`]
  }
}
