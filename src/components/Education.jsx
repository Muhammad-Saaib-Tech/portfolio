// Education — calm scrubbed fade + slight upward motion (no clip-path).
import { useRef } from 'react'
import { GraduationCap } from 'lucide-react'
import { education } from '../data/content'
import ScrollHeading from './ScrollHeading'
import { useGsapScroll, SCRUB, SECTION_START, SECTION_END } from '../hooks/useGsapScroll'

export default function Education({
  presentation = false,
  condensed = false,
}) {
  const sectionRef = useRef(null)
  void condensed
  const gsapEnabled = !presentation

  useGsapScroll(
    sectionRef,
    ({ gsap, reduced, root }) => {
      const header = root.querySelector('[data-edu-header]')
      const card = root.querySelector('[data-edu-card]')

      if (reduced) {
        gsap.from([header, card].filter(Boolean), {
          opacity: 0,
          y: 14,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        })
        return
      }

      if (header) {
        gsap.from(header, {
          opacity: 0,
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: SECTION_START,
            end: SECTION_END,
            scrub: SCRUB,
          },
        })
      }

      if (card) {
        gsap.from(card, {
          opacity: 0,
          y: 28,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            end: 'top 45%',
            scrub: SCRUB,
          },
        })
      }
    },
    [],
    { enabled: gsapEnabled },
  )

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'education'}
      className={`relative ${
        presentation ? 'w-full py-8 sm:py-10' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="education-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-edu-header data-gsap-reveal className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Education
          </p>
          <ScrollHeading
            text="Academic foundation"
            id={presentation ? undefined : 'education-heading'}
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
            animateWords={false}
            enabled={gsapEnabled}
          />
        </div>

        {/* Always in the DOM and visible by default — GSAP only tweaks opacity/y */}
        <div
          data-edu-card
          data-gsap-reveal
          className="mt-6 max-w-3xl rounded-lg border border-border bg-bg-elevated p-5 sm:mt-8 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-accent sm:size-12">
              <GraduationCap size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-lg font-semibold tracking-tight text-fg sm:text-xl">
                  {education.degree}
                </h3>
                <span className="text-sm font-medium text-accent">{education.period}</span>
              </div>
              <p className="mt-1 text-sm text-fg-muted">{education.major}</p>
              <p className="mt-1.5 text-sm text-fg sm:text-base">{education.institution}</p>

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-fg-muted">
                  Coursework
                </p>
                <ul className="flex flex-wrap gap-2" aria-label="Coursework">
                  {education.coursework.map((course) => (
                    <li key={course}>
                      <span className="inline-flex rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-fg sm:text-sm">
                        {course}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
