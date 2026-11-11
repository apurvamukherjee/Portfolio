import { projects, type Project } from '../data/projects'
import { jumpToSection } from './sectionTransition'
import { useUi } from './ui'

/**
 * Skills, experience and projects each spell the same tool differently ("React.js", "React 19",
 * "Socket.io" / "Socket.IO", "Dexie / IndexedDB"). This folds them onto one key.
 */
export function techKey(name: string): string {
  return name
    .toLowerCase()
    .split(' / ')[0]
    .replace(/\.js$/, '')
    .replace(/\s+v?\d+$/, '')
    .replace(/[^a-z0-9]/g, '')
}

const USED = new Set(projects.flatMap((p) => p.tech.map(techKey)))

/** Whether any project is built with this tech, i.e. whether filtering by it shows anything. */
export function hasProjects(name: string): boolean {
  return USED.has(techKey(name))
}

export function usesTech(project: Project, tech: string | null): boolean {
  if (!tech) return true
  const key = techKey(tech)
  return project.tech.some((t) => techKey(t) === key)
}

/** From another section: filter Projects to one tech and take the visitor there. */
export function filterByTech(name: string) {
  useUi.getState().setTech(name)
  if (!jumpToSection('projects')) document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
}
