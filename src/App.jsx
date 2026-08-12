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
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [introReady, setIntroReady] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroReady(true), [])

  return (
    <ThemeProvider>
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
      </div>
    </ThemeProvider>
  )
}

export default App
