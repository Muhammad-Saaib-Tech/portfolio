import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { navLinks, profile } from '../data/content'
import { useTheme } from '../context/ThemeContext'
import { revealTransitionFast, stagger } from '../lib/motion'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sectionIds = ['home', ...navLinks.map((l) => l.id)]
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id === 'home' ? '' : visible[0].target.id)
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  const handleNavClick = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border,backdrop-filter] duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-border bg-nav backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('home')
          }}
          className="inline-flex min-h-11 items-center font-display text-lg font-bold tracking-tight text-fg transition-colors hover:text-accent"
        >
          <span className="text-accent">{profile.shortName.charAt(0)}</span>
          {profile.shortName.slice(1)}
        </a>

        {/* Desktop links from lg (1024px+) so tablets keep the hamburger */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeId === link.id
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.id)
                  }}
                  className={`relative inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-accent'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 bottom-2 h-0.5 rounded-full bg-accent"
                      transition={revealTransitionFast}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-accent-muted hover:text-accent"
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
          </button>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-accent-muted hover:text-accent lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={revealTransitionFast}
            className="overflow-hidden border-t border-border bg-bg lg:hidden"
          >
            <ul className="flex max-h-[min(70dvh,calc(100dvh-4rem))] flex-col gap-0.5 overflow-y-auto px-5 py-3">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: stagger.items * 0.65 * i,
                    ...revealTransitionFast,
                  }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.id)
                    }}
                    className={`flex min-h-11 items-center rounded-md px-3 text-base font-medium ${
                      activeId === link.id ? 'bg-accent-muted text-accent' : 'text-fg-muted'
                    }`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
