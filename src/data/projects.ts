export interface CaseStudy {
  problem: string;
  approach: string;
  impact: string;
}

export interface ProjectBase {
  name: string;
  description: string;
  /** When true, `description` is trusted HTML (author-authored) and rendered as-is instead of escaped text. */
  descriptionIsHtml?: boolean;
  tech: string[];
  status?: "Ongoing";
  githubUrl?: string;
  liveUrl?: string;
}

export type Project =
  | (ProjectBase & {
      kind: "placeholder";
      badge: string;
      placeholderText: string;
      accent: "red" | "blue" | "violet";
    })
  | (ProjectBase & {
      kind: "gallery";
      /** 'app' = tall phone screenshots (shown uncropped in a phone-shaped frame); 'web' = landscape browser screenshots (cropped to fill). */
      variant?: "app" | "web";
      logoSrc?: string;
      images: string[];
      caseStudy?: CaseStudy;
    });

export const projects: Project[] = [
  {
    kind: "gallery",
    name: "Monopolis",
    description:
      "Real-time multiplayer, Kolkata-themed property trading game for 2-8 players — no login, no database, no downloads. Pick a name, share a 6-character room code, and every roll, trade, and rent payment syncs live. Full Monopoly ruleset (houses/hotels with even-building enforcement, mortgages, bankruptcy with auto-liquidation) plus four host-toggleable <strong>chaos modes</strong>: Speed Round, Auction Mode, Double Rent Events, and Market Crash.",
    descriptionIsHtml: true,
    tech: ["React", "TypeScript", "Fastify", "Socket.io", "Zustand", "Tailwind CSS", "Three.js", "Zod"],
    status: "Ongoing",
    githubUrl: "https://github.com/apurvamukherjee/Monopolis",
    liveUrl: "https://monopolis-client.vercel.app/",
    caseStudy: {
      problem:
        "A full Monopoly ruleset — rent tiers, even-building house rules, mortgages, trades, bankruptcy — is a lot of interlocking state to keep consistent across 2-8 live players with zero tolerance for desync.",
      approach:
        "Server-authoritative game engine over Socket.io: clients only ever send intent (roll_dice, buy_property, ...) and render whatever the server broadcasts, never computing outcomes locally. Every socket handler validates against a Zod schema shared between server and client via a single @monopolis/shared package, so the two sides can't drift apart. A reconnect flow with a grace window survives a backgrounded mobile tab, and four chaos modes (Speed Round, Auction Mode, Double Rent Events, Market Crash) layer on as toggleable modifiers on top of the core rules engine.",
      impact:
        "A fully playable, signup-free Monopoly clone for up to 8 concurrent players with real-time sync, backed by 99 passing tests including full room-to-bankruptcy integration runs over real sockets.",
    },
    images: [
      "/assets/projects/monopolis/home.png",
      "/assets/projects/monopolis/lobby.png",
      "/assets/projects/monopolis/live-board.png",
      "/assets/projects/monopolis/trade-market.png",
    ],
  },
  {
    kind: "gallery",
    name: "KeyStrike",
    description:
      "Browser typing-rhythm game — one word at a time, centered on screen, with a shrinking timer underneath. Every song is synthesized live via the Web Audio API, no audio files shipped. <strong>Battle mode</strong> pits up to 4 players in a real-time car race driven by typing speed, with a 2v2 <strong>team mode</strong> where teammates share one car and the server sums both players' progress to call the win, plus session-token reconnect so a refresh mid-race doesn't cost you your seat.",
    descriptionIsHtml: true,
    tech: ["React 18", "TypeScript", "Vite", "Socket.IO", "Web Audio API", "PWA"],
    status: "Ongoing",
    githubUrl: "https://github.com/apurvamukherjee/KeyStrike-The-Battle-Begins",
    caseStudy: {
      problem:
        "Syncing every keystroke of a 4-player typing race over the network would be both slow and unfair to players with worse latency — but the race still needs to feel live, and a 2v2 team mode needs a combined-progress win condition no single client can see on its own.",
      approach:
        "Each client stays fully authoritative for its own run — the same local judging engine as solo play — with the server only relaying room membership, a synchronized start signal, and periodic progress snapshots. The two exceptions where the server has to act on its own: in team mode it sums both teammates' progress and declares the win itself once their combined total crosses the finish line, and it matches a reconnecting client back to its existing seat by a client-generated session id so a refresh mid-lobby or mid-battle doesn't lose the player's spot.",
      impact:
        "A signup-free 4-player typing race with a car-track visualization, 2v2 team play, and reconnect resilience, all synthesized live in-browser with zero shipped audio files.",
    },
    images: [
      "/assets/projects/keystrike/11-battle.png",
      "/assets/projects/keystrike/04-gameplay.png",
      "/assets/projects/keystrike/16-team-battle.png",
      "/assets/projects/keystrike/17-team-results.png",
    ],
  },
  {
    kind: "gallery",
    name: "Kiwami",
    description:
      "Local-first calendar PWA that fuses full Month/Week/Day/Agenda views with a routine/streak engine and food-time adherence tracking — no account, no server, your data never leaves your device. The signature <strong>Ember Chain</strong> visualizes streaks as a chain of beads that glows amber when done and goes cold ash the day it's missed. Drag-to-create/move/resize on the time grid, a from-scratch recurrence engine backed by <strong>18 unit tests</strong>, and a genuinely offline-first installable PWA.",
    descriptionIsHtml: true,
    tech: ["React 19", "TypeScript", "Vite", "Ant Design", "Dexie", "Framer Motion", "PWA"],
    status: "Ongoing",
    githubUrl: "https://github.com/apurvamukherjee/Kiwami---The-Calender",
    liveUrl: "https://kiwami-kappa.vercel.app/",
    caseStudy: {
      problem:
        "Most calendar apps force an account and a server just to track recurring routines and habit streaks, and treat the Month/Week/Day views as an afterthought squeezed into a phone-sized card.",
      approach:
        "Built local-first on Dexie/IndexedDB with a from-scratch recurrence engine (daily, weekly with a weekday picker, monthly with fixed-day clamping, custom every-N-days/weeks) anchored so the cadence never drifts, covered by 18 unit tests for edge cases like month-end clamping and exclusion dates. Routines and food-time slots get their own visual language — the Ember Chain streak visualization and teal fork/knife food blocks — layered on full Month/Week/Day/Agenda views with drag-to-create/move/resize, collapsing cleanly to a Day+Agenda layout on mobile.",
      impact:
        "A genuinely offline-first calendar, verified end-to-end with the network disabled, that's built desktop-first rather than a phone card stretched wide — with zero backend and zero account required.",
    },
    images: [
      "/assets/projects/kiwami/month-dark.png",
      "/assets/projects/kiwami/routine-detail-dark.png",
      "/assets/projects/kiwami/agenda-dark.png",
    ],
  },
  {
    kind: "gallery",
    name: "Pixelpanic",
    description:
      "Real-time multiplayer drawing-and-guessing game for up to 12 players — no accounts, just a name and a room code. <strong>Live incremental stroke sync</strong> so everyone watches the picture happen stroke by stroke, time-decayed scoring with progressive hint reveals, team mode, round-robin tournaments, and seven host-toggleable <strong>chaos modes</strong> (Momentum, Bounty Round, Reverse Mode, Sabotage &amp; more).",
    descriptionIsHtml: true,
    tech: ["React", "TypeScript", "Fastify", "Socket.IO", "Zustand", "Tailwind CSS", "SQLite"],
    status: "Ongoing",
    githubUrl: "https://github.com/apurvamukherjee/PixelPanic",
    liveUrl: "https://pixelpanic.onrender.com/",
    caseStudy: {
      problem:
        "Real-time drawing-and-guessing sync for up to 12 concurrent players, with no accounts, needed to actually feel live rather than laggy.",
      approach:
        "Incremental stroke-delta broadcast over Socket.IO instead of full canvas snapshots, a time-decayed scoring engine with progressive hint reveals, and a 7-mode chaos-mode plugin layer on top of the core game loop, backed by Fastify + SQLite for lightweight room and session state.",
      impact:
        "A fully playable, signup-free party game with near-instant draw sync and replayable variety via chaos modes and round-robin tournaments.",
    },
    images: [
      "/assets/projects/Menu-PixelPanic.png",
      "/assets/projects/wordpicker-pixelpanic.png",
      "/assets/projects/paint-pixelpanic.png",
      "/assets/projects/correct-pixelpanic.png",
      "/assets/projects/ScoreBoard-PixelPanic.png",
    ],
  },
  {
    kind: "gallery",
    variant: "app",
    name: "Zenith",
    description:
      "Local-first personal tracker PWA — training, nutrition, sleep, hydration, study & bike fuel. Zero backend, data never leaves your device. XP leveling system, 84 achievement badges, 125-exercise library, social leaderboard via share codes.",
    tech: ["React 19", "TypeScript", "Ant Design", "Dexie", "Framer Motion"],
    status: "Ongoing",
    liveUrl: "https://zenith-own-the-peak.vercel.app/",
    caseStudy: {
      problem:
        "Fitness and habit trackers usually require an account and a backend, adding friction and privacy concerns for a tool meant for daily use.",
      approach:
        "Built local-first on Dexie/IndexedDB as the only persistence layer — zero backend, data never leaves the device — with an XP/leveling system, 84 achievement badges, a 125-exercise library, and a share-code based leaderboard so friends can compare progress with no server accounts.",
      impact:
        "A zero-backend PWA that works offline, keeps all health data on-device, and turns daily tracking into a habit-forming game loop.",
    },
    images: [
      "/assets/projects/zenith.jpeg",
      "/assets/projects/zenith1.jpeg",
      "/assets/projects/zenith3.jpeg",
    ],
  },
  {
    kind: "gallery",
    variant: "app",
    name: "FitCart",
    description:
      "AI-powered meal planning app with Gemini 1.5 Flash chat interface. Generates personalized recipes & grocery lists respecting allergies and dietary preferences. Animated 5-step health profile, 52-week planner, nearby store map with custom bottom-sheet.",
    tech: [
      "React Native",
      "TypeScript",
      "Gemini 1.5 Flash",
      "react-native-maps",
    ],
    status: "Ongoing",
    githubUrl: "https://github.com/apurvamukherjee",
    images: [
      "/assets/projects/fitcart1.jpeg",
      "/assets/projects/fitcart2.jpeg",
      "/assets/projects/fitcart3.jpeg",
    ],
    caseStudy: {
      problem:
        "Meal planning that actually respects allergies and dietary preferences normally means manually cross-referencing recipes.",
      approach:
        "Integrated Gemini 1.5 Flash as a conversational meal-planning assistant, an animated 5-step health-profile onboarding flow, a 52-week planner, and a nearby-store map with a custom bottom-sheet.",
      impact:
        "Collapses meal planning and grocery discovery into a single chat-driven flow in a cross-platform React Native app.",
    },
  },
  {
    kind: "gallery",
    name: "Code Synth",
    description:
      "Synthesis engine that converts code into real-time audio via Web Audio API with sub-10ms latency. Gemini-powered natural-language-to-music generation — describe a sound, get music.",
    tech: ["React", "Web Audio API", "Gemini API"],
    status: "Ongoing",
    githubUrl: "https://github.com/apurvamukherjee",
    images: ["/assets/projects/code-synth.png"],
    caseStudy: {
      problem: "Turning code or plain text into audio isn't natively supported by any common tool.",
      approach:
        "Built a Web Audio API synthesis engine tuned for sub-10ms latency, paired with Gemini-powered natural-language-to-music generation — describe a sound, get music.",
      impact:
        "A working proof-of-concept bridging LLM prompting and real-time browser audio synthesis, with no native plugins.",
    },
  },
  {
    kind: "gallery",
    name: "Chat App",
    description:
      "Built a real-time chat application enabling seamless user communication.",
    tech: [],
    logoSrc: "/assets/projects/clogo.jpg",
    images: ["/assets/projects/screenshot-12.png"],
    githubUrl: "https://github.com/apurvamukherjee/chat-app",
    liveUrl: "https://chat-app-alpha-ivory-12.vercel.app/",
  },
  {
    kind: "gallery",
    name: "Aim Trainer Game",
    description:
      "A Aim Trainer Game to improve your aim. made with different levels and difficulty levels.",
    tech: [],
    logoSrc: "/assets/projects/aimlogo.png",
    images: ["/assets/projects/aimss.png"],
    githubUrl: "https://github.com/apurvamukherjee/AIm-Trainer-Game",
    liveUrl: "https://apurvamukherjee.github.io/AIm-Trainer-Game/",
  },
  {
    kind: "gallery",
    name: "Gemini Clone",
    description:
      "Developed a web application replicating core features of the Gemini platform.",
    tech: [],
    logoSrc: "/assets/projects/gemini.png",
    images: ["/assets/projects/ss-gemini.png"],
    githubUrl: "https://github.com/apurvamukherjee/gemini-clone",
    liveUrl: "https://gemini-clone-eg27sqwhf-sameapurvas-projects.vercel.app/",
  },
];
