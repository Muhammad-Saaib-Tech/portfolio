import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { registerGsap } from './lib/gsapSetup'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import PageLoader from './components/PageLoader'
import IntroTour, {
  hasSeenTour,
  markTourSeen,
  shouldSkipTourForDeepLink,
} from './components/IntroTour'
import { ThemeProvider } from './context/ThemeContext'

registerGsap()

function AppShell() {
  const [introReady, setIntroReady] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const reduceMotion = useReducedMotion()

  const handleIntroComplete = useCallback(() => {
    setIntroReady(true)
  }, [])

  // Start intro tour after PageLoader, once per session (unless deep-link / reduced-motion)
  useEffect(() => {
    if (!introReady) return undefined
    if (reduceMotion) {
      markTourSeen()
      return undefined
    }
    if (hasSeenTour() || shouldSkipTourForDeepLink()) {
      return undefined
    }

    // Small delay so Hero entrance can begin before the floating tour overlays
    const t = window.setTimeout(() => setTourActive(true), 200)
    return () => window.clearTimeout(t)
  }, [introReady, reduceMotion])

  const handleTourFinish = useCallback((sectionId) => {
    setTourActive(false)
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    })
  }, [])

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <PageLoader onComplete={handleIntroComplete} />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero introReady={introReady} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <IntroTour active={tourActive} onFinish={handleTourFinish} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

export default App
