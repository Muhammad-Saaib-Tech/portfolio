// Contact — calm GSAP fades; plain string heading (no scramble / WordReveal).
import { useRef } from 'react'
import { Mail, Phone, Download } from 'lucide-react'
import { profile, languages } from '../data/content'
import ScrollHeading from './ScrollHeading'
import Magnetic from './Magnetic'
import SectionBackdrop from './SectionBackdrop'
import { useGsapScroll, SECTION_START, SECTION_END } from '../hooks/useGsapScroll'

function LinkedInIcon({ size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8.5z" />
    </svg>
  )
}

const CONTACT_TITLE = "Let's work together"

const contactLinks = [
  {
    id: 'email',
    label: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
  },
  {
    id: 'phone',
    label: profile.phone,
    href: `tel:${profile.phoneHref}`,
    icon: Phone,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: profile.linkedin,
    icon: LinkedInIcon,
  },
]

export default function Contact({
  presentation = false,
  condensed = false,
}) {
  const sectionRef = useRef(null)
  const year = new Date().getFullYear()
  void condensed
  const gsapEnabled = !presentation
  const title =
    typeof CONTACT_TITLE === 'string' ? CONTACT_TITLE : "Let's work together"

  useGsapScroll(
    sectionRef,
    ({ scrubReveal, reduced, root }) => {
      const heading = root.querySelector('[data-contact-heading]')
      const items = root.querySelectorAll('[data-contact-item]')
      const footer = root.querySelector('[data-contact-footer]')

      if (reduced) {
        scrubReveal([heading, ...items, footer], { y: 12, stagger: 0.04, duration: 0.32 }, {
          trigger: heading || root,
          start: 'top 88%',
          once: true,
        })
        return
      }

      if (heading) {
        scrubReveal(heading, { y: 14 }, { trigger: heading, start: SECTION_START, end: SECTION_END })
      }
      if (items.length) {
        scrubReveal(items, { y: 14, stagger: 0.055 }, {
          trigger: items[0],
          start: 'top 92%',
          end: 'top 68%',
        })
      }
      if (footer) {
        scrubReveal(footer, { y: 0 }, { trigger: footer, start: 'top 96%', end: 'top 85%' })
      }
    },
    [],
    { enabled: gsapEnabled },
  )

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'contact'}
      className={`relative overflow-hidden ${
        presentation
          ? 'w-full border-t border-border py-8 sm:py-10'
          : 'scroll-mt-20 border-t border-border pt-24 sm:pt-28'
      }`}
      aria-labelledby="contact-heading"
    >
      {!presentation ? <SectionBackdrop variant="circuit" /> : null}
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div data-contact-heading data-gsap-reveal className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Contact
          </p>
          <ScrollHeading
            text={title}
            id={presentation ? undefined : 'contact-heading'}
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
            animateWords={false}
            enabled={gsapEnabled}
          />
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            Open to full-stack .NET roles, consulting, and collaboration —
            reach out anytime.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <ul className="flex min-w-0 flex-col gap-2">
            {contactLinks.map(({ id, label, href, icon: Icon }) => (
              <li key={id} data-contact-item data-gsap-reveal>
                <a
                  href={href}
                  target={id === 'linkedin' ? '_blank' : undefined}
                  rel={id === 'linkedin' ? 'noopener noreferrer' : undefined}
                  className="group inline-flex min-h-11 max-w-full items-center gap-3 rounded-md py-1 text-fg-muted transition duration-300 hover:text-accent"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg-muted transition duration-300 group-hover:border-accent/50 group-hover:bg-accent-muted group-hover:text-accent">
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 break-all text-sm font-medium sm:break-normal">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div data-contact-item data-gsap-reveal className="w-full sm:w-auto">
            <Magnetic className="w-full sm:w-auto">
              <a
                href={profile.cvUrl}
                download
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover sm:w-auto"
              >
                <Download size={16} strokeWidth={2} aria-hidden="true" />
                Download CV
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {!presentation ? (
        <footer
          data-contact-footer
          data-gsap-reveal
          className="relative z-10 mt-16 border-t border-border py-8 sm:mt-20"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center text-sm text-fg-muted sm:flex-row sm:items-center sm:gap-4 sm:px-8 sm:text-left">
            <p className="order-1">
              © {year} {profile.name}
            </p>
            <ul
              className="order-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-fg-muted/80 sm:order-2"
              aria-label="Languages"
            >
              {languages.map((lang, i) => (
                <li key={lang.name} className="inline-flex items-center gap-x-2">
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <span>
                    {lang.name} — {lang.level}
                  </span>
                </li>
              ))}
            </ul>
            <p className="order-2 text-xs sm:order-3">Full-Stack .NET Developer · Islamabad</p>
          </div>
        </footer>
      ) : null}
    </section>
  )
}
