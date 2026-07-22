import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useReducedMotion } from './hooks/useReducedMotion'
import { IntroContext } from './hooks/useIntro'
import { Preloader } from './components/layout/Preloader'
import { MatrixRain } from './components/shared/MatrixRain'
import { ScrollProgressBar } from './components/shared/ScrollProgressBar'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { FloatingResumeButton } from './components/layout/FloatingResumeButton'
import { BackToTopButton } from './components/layout/BackToTopButton'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Experience } from './components/sections/Experience'
import { Projects } from './components/sections/Projects'
import { Leadership } from './components/sections/Leadership'

const INTRO_SESSION_KEY = 'portfolio-intro-seen'

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function App() {
  const { theme, toggle } = useTheme()
  const reducedMotion = useReducedMotion()
  const [introDone, setIntroDone] = useState(() => reducedMotion || hasSeenIntro())

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {
      // sessionStorage unavailable — intro will just replay next load, acceptable fallback
    }
    setIntroDone(true)
  }

  return (
    <IntroContext.Provider value={introDone}>
      {!introDone && <Preloader onComplete={handleIntroComplete} />}
      <MatrixRain theme={theme} />
      <ScrollProgressBar />
      <Navbar theme={theme} onToggleTheme={toggle} />

      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Leadership />
      </main>

      <Footer />
      <FloatingResumeButton />
      <BackToTopButton />
    </IntroContext.Provider>
  )
}

export default App
