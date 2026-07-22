import type { IconType } from 'react-icons'
import { TbBriefcase, TbCode } from 'react-icons/tb'

export interface ExperienceRole {
  role: string
  icon: IconType
  time: string
  status: 'Completed' | 'Current'
  points: string[]
  tech: string[]
}

export interface ExperienceCompany {
  name: string
  site: string
  siteUrl: string
  duration: string
  subtitle: string
  roles: ExperienceRole[]
}

export const experience: ExperienceCompany = {
  name: 'Mind Webs Venture',
  site: 'mindwebs.org',
  siteUrl: 'https://mindwebs.org',
  duration: '1 yr 2 mo',
  subtitle: 'My professional journey — growing from design into full-stack & app development.',
  roles: [
    {
      role: "Founder's Office",
      icon: TbBriefcase,
      time: '4 months',
      status: 'Completed',
      points: [
        'Led client meetings, translating user needs into technical specs.',
        'Managed engineers & designers across Agile sprints, owning features from ideation to deployment.',
        'Represented the company at India Mobile Congress 2025 in Delhi — 4 days of product pitching.',
      ],
      tech: ['Product Strategy', 'Agile', 'Team Leadership', 'Client Relations'],
    },
    {
      role: 'Full Stack / App Dev Intern',
      icon: TbCode,
      time: '10 months',
      status: 'Current',
      points: [
        'Building full-stack web & mobile apps end to end.',
        'Developing REST APIs, auth and database-driven features.',
        'Shipping responsive, theme-consistent front-ends.',
      ],
      tech: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native'],
    },
  ],
}
