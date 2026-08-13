// Projects — card grid with layoutId expand-to-detail modal overlay.
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { projects } from '../data/content'
import Heading from './Heading'
import {
  duration,
  ease,
  getRevealProps,
  headerVariants,
  projectCardDelay,
  projectPopVariants,
  revealTransition,
  revealTransitionFast,
  scrollVariants,
  scrollViewport,
  simpleFadeVariants,
} from '../lib/motion'

function canUseLayoutMorph() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(pointer: coarse)').matches) return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(min-width: 768px)').matches
  )
}

function stackBadges(stack) {
  return String(stack)
    .split(/\s*\+\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function TypeTag({ type, className = '' }) {
  if (!type) return null
  return (
    <span
      className={`inline-flex rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg-muted ${className}`}
    >
      {type}
    </span>
  )
}

function ProjectCardFace({ project, compact = false }) {
  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <TypeTag type={project.type} className="max-w-[70%] wrap-break-word" />
        <span className="shrink-0 font-mono text-xs text-fg-muted">{project.year}</span>
      </div>

      <h3
        className={`font-display font-semibold tracking-tight text-fg ${
          compact ? 'text-lg' : 'text-2xl sm:text-3xl'
        }`}
      >
        {project.name}
      </h3>
      <p
        className={`mt-2 text-pretty leading-relaxed text-fg-muted ${
          compact ? 'flex-1 text-sm' : 'mt-4 text-base sm:text-lg'
        }`}
      >
        {project.description}
      </p>

      {compact ? (
        <span className="mt-4 inline-flex max-w-full rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium wrap-break-word text-accent">
          {project.stack}
        </span>
      ) : null}
    </>
  )
}

function ProjectsCondensed() {
  return (
    <>
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Projects
      </p>
      <Heading
        as="h2"
        className="text-2xl font-bold tracking-tight text-fg sm:text-3xl"
      >
        Selected work
      </Heading>

      <ul className="mt-5 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {projects.map((project) => (
          <li
            key={project.id}
            className="min-w-[200px] shrink-0 rounded-lg border border-border bg-bg-elevated p-3.5 sm:min-w-0"
          >
            <div className="flex items-start justify-between gap-2">
              <TypeTag type={project.type} className="text-[10px]" />
              <span className="shrink-0 font-mono text-[10px] text-fg-muted">
                {project.year}
              </span>
            </div>
            <h3 className="mt-2 font-display text-sm font-semibold text-fg">
              {project.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-fg-muted">
              {project.description}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1">
              {stackBadges(project.stack).map((tech) => (
                <li key={tech}>
                  <span className="inline-flex rounded-full border border-accent/30 bg-accent-muted px-2 py-0.5 text-[10px] font-medium text-accent">
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}

function ProjectDetail({ project, onClose, layoutId, useMorph }) {
  const tech = stackBadges(project.stack)
  const highlights = Array.isArray(project.highlights) ? project.highlights : []

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-8"
      data-project-dialog
    >
      <motion.div
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={revealTransitionFast}
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-dialog-${project.id}`}
        layoutId={useMorph ? layoutId : undefined}
        transition={
          useMorph
            ? { layout: { duration: duration.base, ease } }
            : { duration: duration.fast, ease }
        }
        initial={useMorph ? false : { opacity: 0, y: 24 }}
        animate={useMorph ? undefined : { opacity: 1, y: 0 }}
        exit={useMorph ? undefined : { opacity: 0, y: 16 }}
        className="relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-bg-elevated shadow-[0_24px_80px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-accent-muted hover:text-accent sm:right-4 sm:top-4"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="overflow-y-auto overscroll-contain p-6 sm:p-8">
          <div className="pr-10">
            <p className="mb-4 font-mono text-xs text-fg-muted">{project.year}</p>

            <h3
              id={`project-dialog-${project.id}`}
              className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl"
            >
              {project.name}
            </h3>

            <p className="mt-4 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              {project.description}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: useMorph ? 0.12 : 0 }}
            className="mt-8 border-t border-border pt-6"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-muted">
              Tech stack
            </p>
            <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Tech stack">
              {tech.map((item) => (
                <li key={item}>
                  <span className="inline-flex rounded-full border border-accent/40 bg-accent-muted px-3 py-1 text-sm font-medium text-accent">
                    {item}
                  </span>
                </li>
              ))}
              <li>
                <TypeTag type={project.type} />
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: useMorph ? 0.18 : 0.04 }}
            className="mt-8 border-t border-border pt-6"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-muted">
              Highlights
            </p>
            <ul className="mt-4 space-y-3">
              {highlights.map((item, index) => (
                <li
                  key={`${project.id}-highlight-${index}`}
                  className="relative pl-4 text-pretty text-sm leading-relaxed text-fg-muted before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-accent"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: useMorph ? 0.22 : 0.08 }}
            className="mt-8 border-t border-border pt-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-fg-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Close
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Projects({
  presentation = false,
  condensed = false,
  flowMode = false,
}) {
  const [selectedId, setSelectedId] = useState(null)
  const [useMorph, setUseMorph] = useState(false)
  const reduceMotion = useReducedMotion()

  const selected = projects.find((p) => p.id === selectedId) ?? null
  const morphEnabled = useMorph && !reduceMotion && !presentation && !condensed
  const skipMotion = flowMode
  const headerV = skipMotion
    ? undefined
    : scrollVariants(headerVariants, reduceMotion)
  const cardV = skipMotion
    ? undefined
    : scrollVariants(projectPopVariants, reduceMotion)
  const gridV = skipMotion
    ? undefined
    : reduceMotion
      ? simpleFadeVariants
      : {
          hidden: {},
          visible: {
            transition: { staggerChildren: 0, delayChildren: 0 },
          },
        }

  const close = useCallback(() => setSelectedId(null), [])

  useEffect(() => {
    if (presentation && condensed) return undefined
    const update = () => setUseMorph(canUseLayoutMorph())
    update()
    const fine = window.matchMedia('(pointer: fine)')
    const coarse = window.matchMedia('(pointer: coarse)')
    const md = window.matchMedia('(min-width: 768px)')
    fine.addEventListener('change', update)
    coarse.addEventListener('change', update)
    md.addEventListener('change', update)
    return () => {
      fine.removeEventListener('change', update)
      coarse.removeEventListener('change', update)
      md.removeEventListener('change', update)
    }
  }, [presentation, condensed])

  useEffect(() => {
    if (presentation && condensed) return undefined
    if (!selected) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    if (!presentation) document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      if (!presentation) document.body.style.overflow = prev
    }
  }, [selected, close, presentation, condensed])

  if (presentation && condensed) {
    return (
      <section className="relative w-full py-6 sm:py-8" aria-label="Projects">
        <ProjectsCondensed />
      </section>
    )
  }

  return (
    <section
      id={presentation ? undefined : 'projects'}
      className={`relative ${
        presentation ? 'w-full py-16 sm:py-20' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={headerV}
          initial={skipMotion ? false : 'hidden'}
          {...(skipMotion ? {} : getRevealProps(presentation, scrollViewport))}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Projects
          </p>
          <Heading
            as="h2"
            id={presentation ? undefined : 'projects-heading'}
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
          >
            Selected work
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            A mix of product builds, libraries, and client-facing platforms
            across .NET, Blazor, Angular, and Flutter.
          </p>
        </motion.div>

        <motion.ul
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          variants={gridV}
          initial={skipMotion ? false : 'hidden'}
          {...(skipMotion ? {} : getRevealProps(presentation, scrollViewport))}
        >
          {projects.map((project, index) => {
            const isOpen = selectedId === project.id
            const layoutId = `project-card-${project.id}`

            return (
              <motion.li
                key={project.id}
                variants={cardV}
                transition={
                  skipMotion || reduceMotion
                    ? undefined
                    : {
                        ...revealTransition,
                        delay: projectCardDelay(index, 3),
                      }
                }
                className="min-h-46 min-w-0 origin-center"
              >                {isOpen ? (
                  <div
                    className="h-full rounded-lg border border-transparent p-5 opacity-0 sm:p-6"
                    aria-hidden="true"
                  >
                    <ProjectCardFace project={project} compact />
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    layoutId={morphEnabled ? layoutId : undefined}
                    transition={
                      morphEnabled
                        ? { layout: { duration: duration.base, ease } }
                        : { duration: 0 }
                    }
                    onClick={() => setSelectedId(project.id)}
                    className="group flex h-full w-full flex-col rounded-lg border border-border bg-bg-elevated p-5 text-left transition duration-300 hover:border-accent/40 hover:shadow-[0_16px_40px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] sm:p-6 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:scale-[1.015]"
                  >
                    <ProjectCardFace project={project} compact />
                    <span className="mt-5 inline-flex min-h-9 items-center gap-1 text-sm font-medium text-fg-muted transition-colors group-hover:text-accent">
                      View details
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.75}
                        className="transition-transform [@media(hover:hover)]:group-hover:translate-x-0.5 [@media(hover:hover)]:group-hover:-translate-y-0.5"
                      />
                    </span>
                  </motion.button>
                )}
              </motion.li>
            )
          })}
        </motion.ul>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectDetail
            key={selected.id}
            project={selected}
            onClose={close}
            layoutId={`project-card-${selected.id}`}
            useMorph={morphEnabled}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
