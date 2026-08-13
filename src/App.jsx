import { useCallback, useState } from 'react'
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
import PresentationMode from './components/PresentationMode'
import { ThemeProvider } from './context/ThemeContext'
import { PresentationProvider, usePresentation } from './context/PresentationContext'

function AppShell() {
  const [introReady, setIntroReady] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroReady(true), [])
  const { isActive } = usePresentation()

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <PageLoader onComplete={handleIntroComplete} />
      {!isActive ? <ScrollProgress /> : null}
      <CustomCursor />
      {!isActive ? <Navbar /> : null}
      <main aria-hidden={isActive || undefined}>
        <Hero introReady={introReady} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <PresentationMode />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PresentationProvider>
        <AppShell />
      </PresentationProvider>
    </ThemeProvider>
  )
}

export default App
