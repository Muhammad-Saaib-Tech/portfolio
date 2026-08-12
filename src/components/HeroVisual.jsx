// HeroVisual — photo with official brand icons and authentic IDE code cards.
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  SiAngular,
  SiBlazor,
  SiDocker,
  SiDotnet,
  SiGit,
  SiPostgresql,
  SiRabbitmq,
  SiSharp,
} from 'react-icons/si'
import profileImg from '../assets/profile.png'
import { ease } from '../lib/motion'

/** Official Simple Icons brand colors (required for recognizable logos). */
const ALL_ICONS = [
  {
    id: 'dotnet',
    Icon: SiDotnet,
    label: '.NET',
    brand: '#512BD4',
    className: 'top-[8%] left-[12%]',
    duration: 4.4,
    delay: 0.1,
    strength: 0.35,
    mobile: true,
  },
  {
    id: 'angular',
    Icon: SiAngular,
    label: 'Angular',
    brand: '#DD0031',
    className: 'top-[10%] right-[8%]',
    duration: 5.1,
    delay: 0.4,
    strength: 0.4,
    mobile: true,
  },
  {
    id: 'blazor',
    Icon: SiBlazor,
    label: 'Blazor',
    brand: '#512BD4',
    className: 'top-[40%] left-[8%]',
    duration: 3.8,
    delay: 0.8,
    strength: 0.3,
    mobile: false,
  },
  {
    id: 'docker',
    Icon: SiDocker,
    label: 'Docker',
    brand: '#2496ED',
    className: 'top-[38%] right-[4%]',
    duration: 4.8,
    delay: 0.2,
    strength: 0.45,
    mobile: true,
  },
  {
    id: 'postgres',
    Icon: SiPostgresql,
    label: 'PostgreSQL',
    brand: '#4169E1',
    className: 'bottom-[16%] left-[14%]',
    duration: 5.4,
    delay: 0.6,
    strength: 0.35,
    mobile: false,
  },
  {
    id: 'csharp',
    Icon: SiSharp,
    label: 'C#',
    brand: '#512BD4',
    className: 'bottom-[14%] right-[10%]',
    duration: 4.1,
    delay: 1.0,
    strength: 0.4,
    mobile: true,
  },
  {
    id: 'rabbit',
    Icon: SiRabbitmq,
    label: 'RabbitMQ',
    brand: '#FF6600',
    className: 'bottom-[40%] left-[16%] hidden xl:block',
    duration: 4.6,
    delay: 0.3,
    strength: 0.3,
    mobile: false,
  },
  {
    id: 'git',
    Icon: SiGit,
    label: 'Git',
    brand: '#F05032',
    className: 'top-[56%] right-[14%] hidden xl:block',
    duration: 3.9,
    delay: 0.7,
    strength: 0.35,
    mobile: false,
  },
]

/**
 * Short, valid snippets from ASP.NET Core / Blazor / EF Core patterns.
 * Token classes: kw | type | str | attr | prop | tag | punct | plain
 */
const CODE_SNIPPETS = [
  {
    id: 'api',
    file: 'DocumentsController.cs',
    lang: 'C#',
    className: 'top-[4%] right-[6%] w-[min(92%,14.5rem)] -rotate-2',
    duration: 10,
    delay: 0,
    lines: [
      [
        { c: 'attr', t: '[HttpGet(' },
        { c: 'str', t: '"{id:guid}"' },
        { c: 'attr', t: ')]' },
      ],
      [
        { c: 'kw', t: 'public' },
        { c: 'plain', t: ' ' },
        { c: 'kw', t: 'async' },
        { c: 'plain', t: ' ' },
        { c: 'type', t: 'Task' },
        { c: 'punct', t: '<' },
        { c: 'type', t: 'ActionResult' },
        { c: 'punct', t: '<' },
        { c: 'type', t: 'DocumentDto' },
        { c: 'punct', t: '>>' },
      ],
      [
        { c: 'plain', t: '    GetByIdAsync(' },
        { c: 'type', t: 'Guid' },
        { c: 'plain', t: ' id)' },
      ],
    ],
  },
  {
    id: 'blazor',
    file: 'SkillCard.razor',
    lang: 'Razor',
    className: 'bottom-[8%] left-[10%] w-[min(88%,13rem)] rotate-2',
    duration: 11.5,
    delay: 1.2,
    lines: [
      [
        { c: 'tag', t: '<h3' },
        { c: 'plain', t: ' ' },
        { c: 'attr', t: 'class' },
        { c: 'punct', t: '=' },
        { c: 'str', t: '"title"' },
        { c: 'tag', t: '>' },
        { c: 'plain', t: '@Title' },
        { c: 'tag', t: '</h3>' },
      ],
      [
        { c: 'kw', t: '@code' },
        { c: 'plain', t: ' {' },
      ],
      [
        { c: 'plain', t: '  ' },
        { c: 'attr', t: '[Parameter]' },
        { c: 'plain', t: ' ' },
        { c: 'kw', t: 'public' },
        { c: 'plain', t: ' ' },
        { c: 'type', t: 'string' },
        { c: 'plain', t: ' Title { ' },
        { c: 'kw', t: 'get' },
        { c: 'punct', t: ';' },
        { c: 'plain', t: ' ' },
        { c: 'kw', t: 'set' },
        { c: 'punct', t: ';' },
        { c: 'plain', t: ' }' },
      ],
    ],
  },
  {
    id: 'ef',
    file: 'DocumentService.cs',
    lang: 'C#',
    className: 'top-[56%] right-[2%] w-[min(90%,14rem)] -rotate-1 hidden sm:block',
    duration: 9.2,
    delay: 0.6,
    lines: [
      [
        { c: 'kw', t: 'return' },
        { c: 'plain', t: ' ' },
        { c: 'kw', t: 'await' },
        { c: 'plain', t: ' _db.Documents' },
      ],
      [
        { c: 'plain', t: '    .' },
        { c: 'prop', t: 'AsNoTracking' },
        { c: 'plain', t: '()' },
      ],
      [
        { c: 'plain', t: '    .' },
        { c: 'prop', t: 'Where' },
        { c: 'plain', t: '(d => d.' },
        { c: 'prop', t: 'IsActive' },
        { c: 'plain', t: ')' },
        { c: 'punct', t: ';' },
      ],
    ],
  },
]

const TOKEN_CLASS = {
  kw: 'text-ide-keyword',
  type: 'text-ide-type',
  str: 'text-ide-string',
  attr: 'text-ide-attribute',
  prop: 'text-ide-property',
  tag: 'text-ide-tag',
  punct: 'text-ide-punct',
  plain: 'text-fg',
}

function canUsePointerParallax() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(min-width: 1024px)').matches
  )
}

function useMediaFlags() {
  const [parallax, setParallax] = useState(false)
  const [compact, setCompact] = useState(true)

  useEffect(() => {
    const update = () => {
      setParallax(canUsePointerParallax())
      setCompact(!window.matchMedia('(min-width: 1024px)').matches)
    }
    update()
    const fine = window.matchMedia('(pointer: fine)')
    const hover = window.matchMedia('(hover: hover)')
    const lg = window.matchMedia('(min-width: 1024px)')
    fine.addEventListener('change', update)
    hover.addEventListener('change', update)
    lg.addEventListener('change', update)
    return () => {
      fine.removeEventListener('change', update)
      hover.removeEventListener('change', update)
      lg.removeEventListener('change', update)
    }
  }, [])

  return { parallax, compact }
}

function CodeCard({ snippet, reduceMotion }) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-0 ${snippet.className}`}
      aria-hidden="true"
      animate={reduceMotion ? undefined : { y: [0, -10, 0], x: [0, 4, 0] }}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: snippet.duration,
              delay: snippet.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }
      }
      style={{
        opacity: 0.55,
        filter: 'blur(0.6px)',
      }}
    >
      <div className="overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-[0_12px_40px_color-mix(in_srgb,var(--color-fg)_28%,transparent),0_2px_8px_color-mix(in_srgb,var(--color-fg)_14%,transparent)]">
        {/* Title bar — matches About IDE chrome */}
        <div className="flex items-center gap-2 border-b border-border px-2.5 py-1.5">
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-fg-muted/40" />
            <span className="size-1.5 rounded-full bg-fg-muted/40" />
            <span className="size-1.5 rounded-full bg-accent/80" />
          </div>
          <span className="min-w-0 truncate rounded-t border border-b-0 border-border bg-bg px-2 py-0.5 font-mono text-[9px] text-fg-muted">
            {snippet.file}
          </span>
        </div>

        <pre className="overflow-hidden px-2.5 py-2 font-mono text-[9px] leading-[1.45] sm:text-[10px]">
          <code>
            {snippet.lines.map((line, li) => (
              <div key={`${snippet.id}-L${li}`} className="whitespace-pre">
                {line.map((tok, ti) => (
                  <span key={`${snippet.id}-L${li}-T${ti}`} className={TOKEN_CLASS[tok.c]}>
                    {tok.t}
                  </span>
                ))}
              </div>
            ))}
          </code>
        </pre>

        <div className="flex items-center justify-between border-t border-border bg-bg/50 px-2.5 py-1 font-mono text-[8px] text-fg-muted">
          <span className="text-accent">● {snippet.lang}</span>
          <span>UTF-8</span>
        </div>
      </div>
    </motion.div>
  )
}

function TechIcon({ item, pointerX, pointerY, enableParallax, reduceMotion }) {
  const driftX = useTransform(
    pointerX,
    [-0.5, 0.5],
    [-6 * item.strength, 6 * item.strength],
  )
  const driftY = useTransform(
    pointerY,
    [-0.5, 0.5],
    [-5 * item.strength, 5 * item.strength],
  )
  const { Icon } = item

  return (
    <motion.div
      className={`absolute z-20 ${item.className}`}
      style={enableParallax ? { x: driftX, y: driftY } : undefined}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <div
          className="flex size-11 items-center justify-center rounded-xl border border-border bg-bg-elevated shadow-[0_10px_28px_color-mix(in_srgb,var(--color-fg)_22%,transparent),0_2px_6px_color-mix(in_srgb,var(--color-fg)_12%,transparent)] sm:size-12"
          title={item.label}
        >
          <Icon
            className="size-5 sm:size-[1.4rem]"
            style={{ color: item.brand }}
            aria-hidden="true"
          />
          <span className="sr-only">{item.label}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HeroVisual({ introReady = true }) {
  const reduceMotion = useReducedMotion()
  const { parallax, compact } = useMediaFlags()
  const stageRef = useRef(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.35 })
  const pointerY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.35 })

  const photoX = useTransform(pointerX, [-0.5, 0.5], [-12, 12])
  const photoY = useTransform(pointerY, [-0.5, 0.5], [-10, 10])

  const icons = useMemo(
    () => (compact ? ALL_ICONS.filter((i) => i.mobile) : ALL_ICONS),
    [compact],
  )

  const enableParallax = parallax && !reduceMotion

  const onMove = (e) => {
    if (!enableParallax || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rawX.set(Math.max(-0.5, Math.min(0.5, px)))
    rawY.set(Math.max(-0.5, Math.min(0.5, py)))
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={stageRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.65, ease, delay: introReady ? 0.15 : 0 }}
      className="relative mx-auto aspect-square w-full max-w-88 overflow-hidden sm:max-w-96 lg:mx-0 lg:w-full lg:max-w-104 lg:justify-self-end xl:max-w-md"
      aria-hidden="true"
    >
      {CODE_SNIPPETS.map((snippet) => (
        <CodeCard key={snippet.id} snippet={snippet} reduceMotion={!!reduceMotion} />
      ))}

      <div className="absolute top-1/2 left-1/2 z-10 size-[68%] -translate-x-1/2 -translate-y-1/2 rounded-4xl bg-accent/15 blur-3xl" />

      <motion.div
        className="absolute top-1/2 left-1/2 z-30 w-[58%] max-w-62 -translate-x-1/2 -translate-y-1/2"
        style={enableParallax ? { x: photoX, y: photoY } : undefined}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border-2 border-accent/50 bg-bg-elevated shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_22%,transparent),0_16px_40px_color-mix(in_srgb,var(--color-fg)_22%,transparent)]">
            <img
              src={profileImg}
              alt=""
              width={320}
              height={320}
              decoding="async"
              className="size-full object-cover object-[center_20%]"
            />
          </div>
        </motion.div>
      </motion.div>

      {icons.map((item) => (
        <TechIcon
          key={item.id}
          item={item}
          pointerX={pointerX}
          pointerY={pointerY}
          enableParallax={enableParallax}
          reduceMotion={!!reduceMotion}
        />
      ))}
    </motion.div>
  )
}
