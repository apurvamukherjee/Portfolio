import type { IconType } from 'react-icons'
import {
  SiAntdesign,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiTypescript,
  SiVercel,
  SiVite,
} from 'react-icons/si'
import {
  TbApi,
  TbBrandReactNative,
  TbComponents,
  TbDatabase,
  TbLayoutGrid,
  TbLetterC,
  TbPalette,
  TbWaveSquare,
} from 'react-icons/tb'

export interface Skill {
  name: string
  icon: IconType
}

export interface SkillCategory {
  heading: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    heading: 'Frontend',
    skills: [
      { name: 'HTML / CSS', icon: SiHtml5 },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'React.js', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Ant Design', icon: SiAntdesign },
      { name: 'Framer Motion', icon: SiFramer },
    ],
  },
  {
    heading: 'Mobile & Backend',
    skills: [
      { name: 'React Native', icon: TbBrandReactNative },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'REST APIs', icon: TbApi },
    ],
  },
  {
    heading: 'Tools & Infrastructure',
    skills: [
      { name: 'Git / GitHub', icon: SiGit },
      { name: 'Docker', icon: SiDocker },
      { name: 'Vite', icon: SiVite },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Firebase', icon: SiFirebase },
      { name: 'MySQL', icon: SiMysql },
      { name: 'Web Audio API', icon: TbWaveSquare },
      { name: 'Gemini API', icon: SiGooglegemini },
    ],
  },
  {
    heading: 'Languages & Design',
    skills: [
      { name: 'C', icon: TbLetterC },
      { name: 'Java', icon: SiOpenjdk },
      { name: 'Python', icon: SiPython },
      { name: 'SQL', icon: TbDatabase },
      { name: 'Figma', icon: SiFigma },
      { name: 'UI/UX Design', icon: TbPalette },
      { name: 'Design Systems', icon: TbComponents },
      { name: 'Responsive Design', icon: TbLayoutGrid },
    ],
  },
]
