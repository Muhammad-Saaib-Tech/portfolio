// Skills — category panels with icon headers and staggered skill chip tags.
import { motion, useReducedMotion } from 'framer-motion'
import { Server, Layout, Database, Container } from 'lucide-react'
import { skills } from '../data/content'
import Heading from './Heading'
import {
  getRevealProps,
  headerVariants,
  maskScaleVariants,
  scrollVariants,
  scrollViewport,
  skillChipVariants,
  skillsGridVariants,
  simpleFadeVariants,
  tourMaskScaleVariants,
} from '../lib/motion'

const categoryIcons = {
  Backend: Server,
  Frontend: Layout,
  Databases: Database,
  'DevOps / Tools': Container,
}

const CONDENSED_TAG_LIMIT = 4

function SkillsCondensed({ reduceMotion, tourActive }) {
  const panelV = scrollVariants(tourMaskScaleVariants, reduceMotion)
  const gridV = reduceMotion ? simpleFadeVariants : skillsGridVariants

  return (
    <>
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Skills
      </p>
      <Heading
        as="h2"
        className="text-2xl font-bold tracking-tight text-fg sm:text-3xl"
      >
        Tools I ship with
      </Heading>

      <motion.ul
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        variants={gridV}
        {...getRevealProps(true, scrollViewport, tourActive)}
      >
        {skills.map((group) => {
          const Icon = categoryIcons[group.category] ?? Server
          const visible = group.items.slice(0, CONDENSED_TAG_LIMIT)
          const extra = group.items.length - visible.length

          return (
            <motion.li
              key={group.category}
              variants={panelV}
              className="origin-center rounded-lg border border-border bg-bg-elevated p-4"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-accent">
                  <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="font-display text-sm font-semibold text-fg">
                  {group.category}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-1.5" aria-label={`${group.category} skills`}>
                {visible.map((skill) => (
                  <li key={skill}>
                    <span className="inline-flex rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg">
                      {skill}
                    </span>
                  </li>
                ))}
                {extra > 0 ? (
                  <li>
                    <span className="inline-flex rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg-muted">
                      +{extra}
                    </span>
                  </li>
                ) : null}
              </ul>
            </motion.li>
          )
        })}
      </motion.ul>
    </>
  )
}

export default function Skills({
  presentation = false,
  condensed = false,
  tourActive = true,
}) {
  const reduceMotion = useReducedMotion()

  if (presentation && condensed) {
    return (
      <section className="relative w-full py-6 sm:py-8" aria-label="Skills">
        <SkillsCondensed reduceMotion={reduceMotion} tourActive={tourActive} />
      </section>
    )
  }

  const headerV = scrollVariants(headerVariants, reduceMotion)
  const gridV = reduceMotion ? simpleFadeVariants : skillsGridVariants
  const panelV = scrollVariants(
    presentation ? tourMaskScaleVariants : maskScaleVariants,
    reduceMotion,
  )
  const chipV = scrollVariants(skillChipVariants, reduceMotion)
  const reveal = () => getRevealProps(presentation, scrollViewport, tourActive)

  return (
    <section
      id={presentation ? undefined : 'skills'}
      className={`relative ${
        presentation ? 'w-full py-16 sm:py-20' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div variants={headerV} {...reveal()} className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Skills
          </p>
          <Heading
            as="h2"
            id={presentation ? undefined : 'skills-heading'}
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
          >
            Tools I ship with
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            A focused stack for building secure APIs, rich front-ends, and
            reliable data platforms — end to end.
          </p>
        </motion.div>

        <motion.ul
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2"
          variants={gridV}
          {...reveal()}
        >
          {skills.map((group) => {
            const Icon = categoryIcons[group.category] ?? Server

            return (
              <motion.li
                key={group.category}
                variants={panelV}
                className="group origin-center rounded-lg border border-border bg-bg-elevated p-5 transition duration-300 hover:border-accent/40 hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] sm:p-7 [@media(hover:hover)]:hover:-translate-y-0.5"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-accent transition-colors group-hover:border-accent/40 group-hover:bg-accent-muted">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
                    {group.category}
                  </h3>
                </div>

                <ul className="flex flex-wrap gap-2.5" aria-label={`${group.category} skills`}>
                  {group.items.map((skill) => (
                    <motion.li key={skill} variants={chipV}>
                      <span className="inline-flex min-h-9 max-w-full items-center rounded-full border border-border bg-bg px-3.5 py-1.5 text-left text-sm font-medium wrap-break-word text-fg transition duration-300 hover:border-accent/50 hover:bg-accent-muted hover:text-accent hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] [@media(hover:hover)]:hover:scale-105">
                        {skill}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
