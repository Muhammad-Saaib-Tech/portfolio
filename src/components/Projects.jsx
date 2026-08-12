// Projects — card grid with layoutId expand-to-detail modal overlay.
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { projects } from '../data/content'
import Heading from './Heading'
import {
  duration,
  ease,
  fadeUpVariants,
  headerVariants,
  revealTransition,
  revealTransitionFast,
  staggerContainerVariants,
} from '../lib/motion'

function canUseLayoutMorph() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(pointer: coarse)').matches) return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(min-width: 768px)').matches
  )
}

function ProjectCardFace({ project, compact = false }) {
  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="inline-flex max-w-[70%] rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium wrap-break-word text-accent">
          {project.stack}
        </span>
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
    </>
  )
}

function ProjectDetail({ project, onClose, layoutId, useMorph }) {
  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center p-0 sm:items-center sm:p-8">
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
        className="relative z-10 flex max-h-[min(92dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-bg-elevated p-6 shadow-[0_24px_80px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] sm:rounded-lg sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-accent-muted hover:text-accent sm:right-4 sm:top-4"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div id={`project-dialog-${project.id}`} className="pr-10">
          <ProjectCardFace project={project} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...revealTransition, delay: useMorph ? 0.15 : 0 }}
          className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6"
        >
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-fg-muted">
            Tech stack
          </span>
          <span className="inline-flex rounded-full border border-accent/40 bg-accent-muted px-3 py-1 text-sm font-medium text-accent">
            {project.stack}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...revealTransition, delay: useMorph ? 0.22 : 0.05 }}
          className="mt-6"
        >
          {project.url && project.url !== '#' ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
            >
              Open project
              <ArrowUpRight size={15} strokeWidth={2} />
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-fg-muted">
              Link coming soon
              <ArrowUpRight size={15} strokeWidth={1.75} />
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Projects() {
  const [selectedId, setSelectedId] = useState(null)
  const [useMorph, setUseMorph] = useState(false)
  const reduceMotion = useReducedMotion()

  const selected = projects.find((p) => p.id === selectedId) ?? null
  const morphEnabled = useMorph && !reduceMotion

  const close = useCallback(() => setSelectedId(null), [])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (!selected) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [selected, close])

  return (
    <section
      id="projects"
      className="relative scroll-mt-20 py-24 sm:py-28"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Projects
          </p>
          <Heading
            as="h2"
            id="projects-heading"
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
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project) => {
            const isOpen = selectedId === project.id
            const layoutId = `project-card-${project.id}`

            return (
              <motion.li key={project.id} variants={fadeUpVariants} className="min-h-46 min-w-0">
                {isOpen ? (
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
