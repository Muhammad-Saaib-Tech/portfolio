// Skills — category panels; scrubbed stagger via GSAP ScrollTrigger.
import { useRef } from 'react'
import { Server, Layout, Database, Container } from 'lucide-react'
import { skills } from '../data/content'
import ScrollHeading from './ScrollHeading'
import SectionBackdrop from './SectionBackdrop'
import { useGsapScroll, SECTION_START, SECTION_END } from '../hooks/useGsapScroll'

const categoryIcons = {
  Backend: Server,
  Frontend: Layout,
  Databases: Database,
  'DevOps / Tools': Container,
}

const CONDENSED_TAG_LIMIT = 4

function SkillsCondensed() {
  return (
    <>
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Skills
      </p>
      <ScrollHeading
        text="Tools I ship with"
        className="text-2xl font-bold tracking-tight text-fg sm:text-3xl"
        animateWords={false}
        enabled={false}
      />

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {skills.map((group) => {
          const Icon = categoryIcons[group.category] ?? Server
          const visible = group.items.slice(0, CONDENSED_TAG_LIMIT)
          const extra = group.items.length - visible.length

          return (
            <li
              key={group.category}
              className="rounded-lg border border-border bg-bg-elevated p-4"
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
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function Skills({
  presentation = false,
  condensed = false,
}) {
  const sectionRef = useRef(null)
  const gsapEnabled = !presentation

  useGsapScroll(
    sectionRef,
    ({ scrubReveal, reduced, root }) => {
      const header = root.querySelector('[data-skills-header]')
      const grid = root.querySelector('[data-skills-grid]')
      const panels = root.querySelectorAll('[data-skills-panel]')

      if (reduced) {
        scrubReveal([header, ...panels], { y: 16, stagger: 0.06, duration: 0.35 }, {
          trigger: header || root,
          start: 'top 88%',
          once: true,
        })
        return
      }

      if (header) {
        scrubReveal(header, { y: 22 }, {
          trigger: header,
          start: SECTION_START,
          end: SECTION_END,
        })
      }

      if (panels.length) {
        scrubReveal(panels, { y: 24, scale: 0.98, stagger: 0.07 }, {
          trigger: grid || panels[0],
          start: 'top 90%',
          end: 'top 62%',
        })
      }
    },
    [],
    { enabled: gsapEnabled },
  )

  if (presentation && condensed) {
    return (
      <section className="relative w-full py-6 sm:py-8" aria-label="Skills">
        <SkillsCondensed />
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'skills'}
      className={`relative overflow-hidden ${
        presentation ? 'w-full py-16 sm:py-20' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="skills-heading"
    >
      {!presentation ? <SectionBackdrop variant="dots" /> : null}
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div data-skills-header data-gsap-reveal className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Skills
          </p>
          <ScrollHeading
            text="Tools I ship with"
            id={presentation ? undefined : 'skills-heading'}
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
            enabled={gsapEnabled}
          />
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            A focused stack for building secure APIs, rich front-ends, and
            reliable data platforms — end to end.
          </p>
        </div>

        <ul
          data-skills-grid
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {skills.map((group) => {
            const Icon = categoryIcons[group.category] ?? Server

            return (
              <li
                key={group.category}
                data-skills-panel
                data-gsap-reveal
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
                    <li key={skill}>
                      <span className="inline-flex min-h-9 max-w-full items-center rounded-full border border-border bg-bg px-3.5 py-1.5 text-left text-sm font-medium wrap-break-word text-fg transition duration-300 hover:border-accent/50 hover:bg-accent-muted hover:text-accent hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] [@media(hover:hover)]:hover:scale-105">
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
