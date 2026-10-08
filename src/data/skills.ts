import type { IconType } from 'react-icons'
import {
  SiAntdesign,
  SiApple,
  SiCapacitor,
  SiDocker,
  SiExpress,
  SiFastify,
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
  SiPwa,
  SiPython,
  SiReact,
  SiSocketdotio,
  SiSqlite,
  SiSupabase,
  SiSvelte,
  SiSwift,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiVite,
  SiXcode,
  SiZod,
} from 'react-icons/si'
import {
  TbApi,
  TbBrandReactNative,
  TbComponents,
  TbDatabase,
  TbDatabaseHeart,
  TbLayoutGrid,
  TbLetterC,
  TbPalette,
  TbStack2,
  TbWaveSquare,
} from 'react-icons/tb'

export interface Skill {
  name: string
  icon: IconType
}

/** Programming/markup languages from the resume — merged with GitHub-detected languages for the rotating stats tile. */
export const knownLanguages = ['JavaScript', 'TypeScript', 'HTML/CSS', 'Swift', 'Python', 'Java', 'C', 'SQL']

export interface SkillCategory {
  heading: string
  kanji: string
  reading: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    heading: 'Frontend',
    kanji: '匠',
    reading: 'takumi · craft',
    skills: [
      { name: 'HTML / CSS', icon: SiHtml5 },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'React.js', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Ant Design', icon: SiAntdesign },
      { name: 'Framer Motion', icon: SiFramer },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Svelte', icon: SiSvelte },
      { name: 'Three.js', icon: SiThreedotjs },
      { name: 'Zustand', icon: TbStack2 },
      { name: 'PWA', icon: SiPwa },
    ],
  },
  {
    heading: 'Mobile & Backend',
    kanji: '道',
    reading: 'michi · path',
    skills: [
      { name: 'React Native', icon: TbBrandReactNative },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'REST APIs', icon: TbApi },
      { name: 'SwiftUI', icon: SiSwift },
      { name: 'AppKit', icon: SiApple },
      { name: 'Capacitor', icon: SiCapacitor },
      { name: 'Fastify', icon: SiFastify },
      { name: 'Socket.IO', icon: SiSocketdotio },
      { name: 'Zod', icon: SiZod },
    ],
  },
  {
    heading: 'Tools & Infrastructure',
    kanji: '具',
    reading: 'gu · tools',
    skills: [
      { name: 'Git / GitHub', icon: SiGit },
      { name: 'Docker', icon: SiDocker },
      { name: 'Vite', icon: SiVite },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Firebase', icon: SiFirebase },
      { name: 'MySQL', icon: SiMysql },
      { name: 'Web Audio API', icon: TbWaveSquare },
      { name: 'Gemini API', icon: SiGooglegemini },
      { name: 'Supabase', icon: SiSupabase },
      { name: 'SQLite', icon: SiSqlite },
      { name: 'Dexie / IndexedDB', icon: TbDatabaseHeart },
      { name: 'Xcode', icon: SiXcode },
    ],
  },
  {
    heading: 'Languages & Design',
    kanji: '言',
    reading: 'kotoba · language',
    skills: [
      { name: 'C', icon: TbLetterC },
      { name: 'Java', icon: SiOpenjdk },
      { name: 'Swift', icon: SiSwift },
      { name: 'Python', icon: SiPython },
      { name: 'SQL', icon: TbDatabase },
      { name: 'Figma', icon: SiFigma },
      { name: 'UI/UX Design', icon: TbPalette },
      { name: 'Design Systems', icon: TbComponents },
      { name: 'Responsive Design', icon: TbLayoutGrid },
    ],
  },
]
