// CircularGallery — 3D rotating section cards for Presentation Mode (plain JSX).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Briefcase,
  Code2,
  FolderKanban,
  GraduationCap,
  Mail,
  User,
} from 'lucide-react'
import {
  about,
  education,
  experience,
  profile,
  projects,
  skills,
} from '../data/content'

/** Full circle duration in seconds (tune here) */
const AUTO_ROTATE_SECONDS = 25

const GALLERY_ITEMS = [
  {
    id: 'about',
    label: 'About',
    icon: User,
    lines: [
      about.bio.slice(0, 120) + (about.bio.length > 120 ? '…' : ''),
      about.techBadges
        .slice(0, 4)
        .map((b) => b.label)
        .join(' · '),
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Code2,
    lines: skills.slice(0, 3).map(
      (g) => `${g.category}: ${g.items.slice(0, 3).join(', ')}`,
    ),
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: Briefcase,
    lines: (() => {
      const job = experience[0]
      if (!job) return []
      const firstBullet = job.projects[0]?.bullets?.[0]
      return [
        `${job.role} · ${job.company}`,
        job.period,
        firstBullet
          ? firstBullet.length > 90
            ? `${firstBullet.slice(0, 90)}…`
            : firstBullet
          : null,
      ].filter(Boolean)
    })(),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    lines: projects.slice(0, 3).map((p) => `${p.name} — ${p.stack}`),
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    lines: [
      education.degree,
      education.institution,
      `${education.major} · ${education.period}`,
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Mail,
    lines: [profile.email, profile.phone, 'LinkedIn · Download CV'],
  },
]

function getLayout(width) {
  if (width < 480) return { radius: 150, cardW: 160, cardH: 210 }
  if (width < 768) return { radius: 210, cardW: 190, cardH: 240 }
  if (width < 1100) return { radius: 290, cardW: 220, cardH: 270 }
  return { radius: 350, cardW: 250, cardH: 290 }
}

function normalizeDeg(deg) {
  const m = ((deg % 360) + 360) % 360
  return m > 180 ? m - 360 : m
}

function frontIndex(rotation, count) {
  const step = 360 / count
  let best = 0
  let bestAbs = Infinity
  for (let i = 0; i < count; i += 1) {
    const abs = Math.abs(normalizeDeg(i * step - rotation))
    if (abs < bestAbs) {
      bestAbs = abs
      best = i
    }
  }
  return best
}

function cardFacingOpacity(index, rotation, count) {
  const step = 360 / count
  const relative = normalizeDeg(index * step - rotation)
  const facing = Math.cos((relative * Math.PI) / 180)
  return 0.2 + 0.8 * Math.max(0, facing)
}

function SectionCard({ item, onSelect, highlighted, style, suppressClickRef }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={(e) => {
        if (suppressClickRef?.current) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        onSelect(item.id)
      }}
      aria-label={`Open ${item.label} section`}
      className={`flex flex-col rounded-lg border bg-bg-elevated p-4 text-left shadow-[0_12px_40px_color-mix(in_srgb,var(--color-accent)_8%,transparent)] transition-[box-shadow,border-color] duration-300 ${
        highlighted
          ? 'border-accent/50 shadow-[0_16px_48px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]'
          : 'border-border'
      }`}
      style={style}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-accent">
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h3 className="font-display text-base font-semibold tracking-tight text-accent sm:text-lg">
          {item.label}
        </h3>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
        {item.lines.slice(0, 3).map((line) => (
          <li
            key={line}
            className="line-clamp-2 text-xs leading-snug text-fg-muted sm:text-[13px]"
          >
            {line}
          </li>
        ))}
      </ul>
      <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-fg-muted">
        Open section
      </span>
    </button>
  )
}

function StaticGrid({ items, onSelect }) {
  return (
    <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <SectionCard item={item} onSelect={onSelect} style={{ width: '100%' }} />
        </li>
      ))}
    </ul>
  )
}

export default function CircularGallery({ onSelect, reduceMotion = false }) {
  const items = useMemo(() => GALLERY_ITEMS, [])
  const count = items.length

  const [layout, setLayout] = useState(() =>
    getLayout(typeof window !== 'undefined' ? window.innerWidth : 1024),
  )
  const [hoverIndex, setHoverIndex] = useState(null)
  const [front, setFront] = useState(0)

  const rotationRef = useRef(0)
  const velocityBoostRef = useRef(0)
  const edgeBoostRef = useRef(0)
  const draggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const suppressClickRef = useRef(false)
  const pausedRef = useRef(false)
  const lastXRef = useRef(0)
  const lastTsRef = useRef(0)
  const rafRef = useRef(0)
  const ringRef = useRef(null)
  const frontRef = useRef(0)

  const baseSpeed = 360 / (AUTO_ROTATE_SECONDS * 1000)

  const applyTransforms = useCallback(() => {
    const ring = ringRef.current
    if (!ring) return
    const rotation = rotationRef.current
    ring.style.transform = `translateZ(0) rotateY(${-rotation}deg)`

    const cards = ring.children
    for (let i = 0; i < cards.length; i += 1) {
      const el = cards[i]
      const step = 360 / count
      const angle = i * step
      const opacity = cardFacingOpacity(i, rotation, count)
      const isHover = hoverIndex === i
      const scale = isHover ? 1.06 : 1
      el.style.opacity = String(opacity)
      el.style.transform = `rotateY(${angle}deg) translateZ(${layout.radius}px) scale(${scale})`
    }

    const nextFront = frontIndex(rotation, count)
    if (nextFront !== frontRef.current) {
      frontRef.current = nextFront
      setFront(nextFront)
    }
  }, [count, hoverIndex, layout.radius])

  useEffect(() => {
    const update = () => setLayout(getLayout(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (reduceMotion) return undefined

    lastTsRef.current = performance.now()

    const tick = (now) => {
      const dt = Math.min(48, now - lastTsRef.current)
      lastTsRef.current = now

      if (!draggingRef.current && !pausedRef.current) {
        velocityBoostRef.current *= 0.92
        if (Math.abs(velocityBoostRef.current) < 0.001) velocityBoostRef.current = 0
        const edge = edgeBoostRef.current
        rotationRef.current +=
          (baseSpeed + velocityBoostRef.current + edge) * dt
      }

      applyTransforms()
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [applyTransforms, baseSpeed, reduceMotion])

  useEffect(() => {
    if (!reduceMotion) applyTransforms()
  }, [applyTransforms, reduceMotion])

  const nudgeByCards = useCallback(
    (deltaCards) => {
      if (reduceMotion) return
      rotationRef.current += deltaCards * (360 / count)
      applyTransforms()
    },
    [applyTransforms, count, reduceMotion],
  )

  const selectFront = useCallback(() => {
    const item = items[frontRef.current]
    if (item) onSelect(item.id)
  }, [items, onSelect])

  useEffect(() => {
    if (reduceMotion) return undefined
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nudgeByCards(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        nudgeByCards(-1)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        selectFront()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nudgeByCards, reduceMotion, selectFront])

  const onPointerDown = (e) => {
    if (reduceMotion) return
    if (e.target.closest('button[aria-label^="Spin"]')) return
    draggingRef.current = true
    dragMovedRef.current = false
    suppressClickRef.current = false
    lastXRef.current = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    if (Math.abs(dx) > 2) dragMovedRef.current = true
    rotationRef.current += dx * 0.28
    velocityBoostRef.current = dx * 0.012
    applyTransforms()
  }

  const onPointerUp = () => {
    if (dragMovedRef.current) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
    draggingRef.current = false
  }

  if (reduceMotion) {
    return <StaticGrid items={items} onSelect={onSelect} />
  }

  const stageH = Math.max(
    layout.cardH + 96,
    layout.radius * 0.85 + layout.cardH * 0.4,
  )

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="relative w-full touch-none select-none"
        style={{
          height: stageH,
          perspective: Math.max(900, layout.radius * 3.2),
          perspectiveOrigin: '50% 45%',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Edge hold zones — spin faster while pressed */}
        <button
          type="button"
          aria-label="Spin left"
          className="absolute inset-y-8 left-0 z-20 w-10 opacity-0 sm:w-14 sm:opacity-100 sm:bg-transparent"
          onPointerDown={(e) => {
            e.stopPropagation()
            edgeBoostRef.current = -baseSpeed * 4
          }}
          onPointerUp={() => {
            edgeBoostRef.current = 0
          }}
          onPointerLeave={() => {
            edgeBoostRef.current = 0
          }}
        />
        <button
          type="button"
          aria-label="Spin right"
          className="absolute inset-y-8 right-0 z-20 w-10 opacity-0 sm:w-14 sm:opacity-100 sm:bg-transparent"
          onPointerDown={(e) => {
            e.stopPropagation()
            edgeBoostRef.current = baseSpeed * 4
          }}
          onPointerUp={() => {
            edgeBoostRef.current = 0
          }}
          onPointerLeave={() => {
            edgeBoostRef.current = 0
          }}
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            ref={ringRef}
            className="relative will-change-transform"
            style={{
              width: layout.cardW,
              height: layout.cardH,
              transformStyle: 'preserve-3d',
            }}
          >
            {items.map((item, index) => {
              const step = 360 / count
              const angle = index * step
              return (
                <div
                  key={item.id}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${layout.radius}px)`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                  onPointerEnter={() => {
                    pausedRef.current = true
                    setHoverIndex(index)
                  }}
                  onPointerLeave={() => {
                    pausedRef.current = false
                    setHoverIndex(null)
                  }}
                >
                  <SectionCard
                    item={item}
                    onSelect={onSelect}
                    suppressClickRef={suppressClickRef}
                    highlighted={index === front || hoverIndex === index}
                    style={{
                      width: layout.cardW,
                      height: layout.cardH,
                      pointerEvents: 'auto',
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-fg-muted" aria-live="polite">
        Viewing{' '}
        <span className="font-medium text-fg">{items[front]?.label}</span>
      </p>
    </div>
  )
}

export { GALLERY_ITEMS }
