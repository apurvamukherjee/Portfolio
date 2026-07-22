export interface ProjectBase {
  name: string
  description: string
  tech: string[]
  status?: 'Ongoing'
  githubUrl?: string
  liveUrl?: string
}

export type Project =
  | (ProjectBase & {
      kind: 'placeholder'
      badge: string
      placeholderText: string
      accent: 'red' | 'blue' | 'violet'
    })
  | (ProjectBase & {
      kind: 'gallery'
      /** 'app' = tall phone screenshots (shown uncropped in a phone-shaped frame); 'web' = landscape browser screenshots (cropped to fill). */
      variant?: 'app' | 'web'
      logoSrc?: string
      images: string[]
    })

export const projects: Project[] = [
  {
    kind: 'gallery',
    variant: 'app',
    name: 'Zenith',
    description:
      'Local-first personal tracker PWA — training, nutrition, sleep, hydration, study & bike fuel. Zero backend, data never leaves your device. XP leveling system, 84 achievement badges, 125-exercise library, social leaderboard via share codes.',
    tech: ['React 19', 'TypeScript', 'Ant Design', 'Dexie', 'Framer Motion'],
    status: 'Ongoing',
    liveUrl: 'https://zenith-own-the-peak.vercel.app/',
    images: [
      '/assets/projects/zenith.jpeg',
      '/assets/projects/zenith1.jpeg',
      '/assets/projects/zenith3.jpeg',
    ],
  },
  {
    kind: 'gallery',
    variant: 'app',
    name: 'FitCart',
    description:
      'AI-powered meal planning app with Gemini 1.5 Flash chat interface. Generates personalized recipes & grocery lists respecting allergies and dietary preferences. Animated 5-step health profile, 52-week planner, nearby store map with custom bottom-sheet.',
    tech: ['React Native', 'TypeScript', 'Gemini 1.5 Flash', 'react-native-maps'],
    status: 'Ongoing',
    githubUrl: 'https://github.com/apurvamukherjee',
    images: [
      '/assets/projects/fitcart1.jpeg',
      '/assets/projects/fitcart2.jpeg',
      '/assets/projects/fitcart3.jpeg',
    ],
  },
  {
    kind: 'placeholder',
    name: 'Code Synth',
    badge: '♫',
    accent: 'violet',
    description:
      'Synthesis engine that converts code into real-time audio via Web Audio API with sub-10ms latency. Gemini-powered natural-language-to-music generation — describe a sound, get music.',
    tech: ['React', 'Web Audio API', 'Gemini API'],
    status: 'Ongoing',
    githubUrl: 'https://github.com/apurvamukherjee',
    placeholderText: 'Code → music, sub-10ms latency',
  },
  {
    kind: 'gallery',
    name: 'Chat App',
    description: 'Built a real-time chat application enabling seamless user communication.',
    tech: [],
    logoSrc: '/assets/projects/clogo.jpg',
    images: ['/assets/projects/screenshot-12.png'],
    githubUrl: 'https://github.com/apurvamukherjee/chat-app',
    liveUrl: 'https://chat-app-alpha-ivory-12.vercel.app/',
  },
  {
    kind: 'gallery',
    name: 'Gemini Clone',
    description: 'Developed a web application replicating core features of the Gemini platform.',
    tech: [],
    logoSrc: '/assets/projects/gemini.png',
    images: ['/assets/projects/ss-gemini.png'],
    githubUrl: 'https://github.com/apurvamukherjee/gemini-clone',
    liveUrl: 'https://gemini-clone-eg27sqwhf-sameapurvas-projects.vercel.app/',
  },
  {
    kind: 'gallery',
    name: 'Aim Trainer Game',
    description: 'A Aim Trainer Game to improve your aim. made with different levels and difficulty levels.',
    tech: [],
    logoSrc: '/assets/projects/aimlogo.png',
    images: ['/assets/projects/aimss.png'],
    githubUrl: 'https://github.com/apurvamukherjee/AIm-Trainer-Game',
    liveUrl: 'https://apurvamukherjee.github.io/AIm-Trainer-Game/',
  },
]
