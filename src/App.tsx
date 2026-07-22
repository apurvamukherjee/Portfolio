import { useTheme } from './hooks/useTheme'
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

function App() {
  const { theme, toggle } = useTheme()

  return (
    <>
      <Preloader />
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
    </>
  )
}

export default App
