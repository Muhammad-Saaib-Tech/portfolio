import { useRef } from 'react'
import { about, profile } from '../data/content'
import ScrollHeading from './ScrollHeading'
import ParallaxLayer from './ParallaxLayer'
import SectionBackdrop from './SectionBackdrop'
import { useGsapScroll, SECTION_START, SECTION_END } from '../hooks/useGsapScroll'

const stackPreview = ['.NET Core', 'Angular', 'Blazor', 'PostgreSQL', 'RabbitMQ']

function CodeEditorCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-elevated">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-fg-muted/35" />
          <span className="size-2.5 rounded-full bg-fg-muted/35" />
          <span className="size-2.5 rounded-full bg-accent/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center">
          <span className="truncate rounded-t-md border border-b-0 border-border bg-bg px-3 py-1 font-mono text-[11px] text-fg-muted">
            developer.json
          </span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-wider text-fg-muted sm:inline">
          UTF-8
        </span>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,color-mix(in_srgb,var(--color-fg-muted)_8%,transparent),transparent_60%)]"
          aria-hidden="true"
        />
        <pre className="relative max-w-full overflow-x-auto overscroll-x-contain p-4 font-mono text-[12px] leading-6 sm:p-6 sm:text-sm sm:leading-7">
          <code className="block min-w-0 whitespace-pre-wrap wrap-break-word text-fg sm:whitespace-pre sm:break-normal">
            <span className="text-fg-muted">{'{'}</span>
            {'\n'}
            <LineIndent />
            <Key>"name"</Key>
            <Punct>: </Punct>
            <Str>"{profile.name}"</Str>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"role"</Key>
            <Punct>: </Punct>
            <Str>"{profile.title}"</Str>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"location"</Key>
            <Punct>: </Punct>
            <Str>"{profile.location}"</Str>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"stack"</Key>
            <Punct>: [</Punct>
            {'\n'}
            {stackPreview.map((tech, i) => (
              <span key={tech}>
                <LineIndent depth={2} />
                <Str>"{tech}"</Str>
                {i < stackPreview.length - 1 ? <Punct>,</Punct> : null}
                {'\n'}
              </span>
            ))}
            <LineIndent />
            <span className="text-fg-muted">]</span>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"focus"</Key>
            <Punct>: </Punct>
            <Str>"scalable · secure · performant"</Str>
            {'\n'}
            <span className="text-fg-muted">{'}'}</span>
          </code>
        </pre>

        <div className="flex items-center justify-between border-t border-border bg-bg/60 px-4 py-2 font-mono text-[10px] text-fg-muted">
          <span className="text-accent">● JSON</span>
          <span>Ln 12, Col 2</span>
        </div>
      </div>
    </div>
  )
}

function LineIndent({ depth = 1 }) {
  return <span>{'  '.repeat(depth)}</span>
}

function Key({ children }) {
  return <span className="text-accent">{children}</span>
}

function Str({ children }) {
  return <span className="text-fg">{children}</span>
}

function Punct({ children }) {
  return <span className="text-fg-muted">{children}</span>
}

export default function About({
  presentation = false,
  condensed = false,
}) {
  const sectionRef = useRef(null)
  void condensed
  const gsapEnabled = !presentation

  useGsapScroll(
    sectionRef,
    ({ scrubReveal, reduced, root }) => {
      const header = root.querySelector('[data-about-header]')
      const bio = root.querySelector('[data-about-bio]')
      const chips = root.querySelectorAll('[data-about-chip]')
      const card = root.querySelector('[data-about-card]')

      if (reduced) {
        scrubReveal([header, bio, card, ...chips], { y: 16, stagger: 0.05, duration: 0.35 }, {
          trigger: header || root,
          start: 'top 88%',
          once: true,
        })
        return
      }

      if (header) {
        scrubReveal(header, { y: 22 }, { trigger: header, start: SECTION_START, end: SECTION_END })
      }
      if (bio) {
        scrubReveal(bio, { y: 28 }, { trigger: bio, start: 'top 90%', end: 'top 62%' })
      }
      if (chips.length) {
        scrubReveal(chips, { y: 12, stagger: 0.03 }, {
          trigger: chips[0],
          start: 'top 92%',
          end: 'top 68%',
        })
      }
      if (card) {
        scrubReveal(card, { y: 30, x: 16 }, { trigger: card, start: 'top 90%', end: 'top 58%' })
      }
    },
    [],
    { enabled: gsapEnabled },
  )

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'about'}
      className={`relative overflow-hidden ${
        presentation ? 'w-full py-8 sm:py-10' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="about-heading"
    >
      {!presentation ? <SectionBackdrop variant="diagonal" /> : null}
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <div data-about-header data-gsap-reveal>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
                About
              </p>
              <ScrollHeading
                text="Building systems that last"
                id={presentation ? undefined : 'about-heading'}
                className="text-[clamp(1.75rem,1.4rem+1.5vw,2.25rem)] font-bold tracking-tight text-fg sm:text-4xl"
                enabled={gsapEnabled}
              />
            </div>

            <p
              data-about-bio
              data-gsap-reveal
              className="mt-6 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              {about.bio}
            </p>

            <ul
              className="mt-8 flex flex-wrap gap-2.5"
              aria-label="Core technologies"
            >
              {about.techBadges.map((badge) => (
                <li key={badge.name} data-about-chip data-gsap-reveal>
                  <span className="inline-flex min-h-9 items-center rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-sm font-medium text-fg transition duration-300 hover:border-accent/50 hover:bg-accent-muted hover:text-accent hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] [@media(hover:hover)]:hover:scale-105">
                    {badge.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-w-0">
            {!presentation ? (
              <ParallaxLayer
                scrollRef={sectionRef}
                distance={36}
                offset={['start end', 'end start']}
                className="pointer-events-none absolute -inset-8"
              >
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-fg-muted)_12%,transparent),transparent_70%)] blur-2xl" />
              </ParallaxLayer>
            ) : (
              <div
                className="pointer-events-none absolute -inset-8 rounded-2xl bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-fg-muted)_12%,transparent),transparent_70%)] blur-2xl"
                aria-hidden="true"
              />
            )}
            <div data-about-card data-gsap-reveal className="relative">
              <CodeEditorCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
