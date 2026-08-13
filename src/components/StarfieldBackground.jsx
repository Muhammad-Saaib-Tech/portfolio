// StarfieldBackground — subtle Three.js particle field for Hero (optional enhancement).
// Self-contained rAF loop only — no scroll-linked camera. Toggle: ENABLE_HERO_STARFIELD.
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ENABLE_HERO_STARFIELD } from '../config/features'

const STAR_COUNT = 2000
const ROTATE_SPEED = 0.00012
const MAX_DPR = 1.5
const MOBILE_MAX_WIDTH = 768
const MIN_CPU_CORES = 4

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isLowEndDevice() {
  if (typeof window === 'undefined') return true
  if (window.innerWidth < MOBILE_MAX_WIDTH) return true
  const cores = navigator.hardwareConcurrency
  if (typeof cores === 'number' && cores > 0 && cores < MIN_CPU_CORES) return true
  return false
}

/** Gate Three.js — false means Hero keeps CSS gradient/grid background only */
export function shouldEnableStarfield(reduceMotion) {
  if (!ENABLE_HERO_STARFIELD) return false
  if (typeof window === 'undefined') return false
  if (reduceMotion || prefersReducedMotion()) return false
  if (isLowEndDevice()) return false
  return true
}

function readAccentColor() {
  if (typeof window === 'undefined') return { r: 0.545, g: 0.361, b: 0.965 }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-accent')
    .trim()
  const hex = raw.startsWith('#') ? raw.slice(1) : '8b5cf6'
  if (hex.length < 6) return { r: 0.545, g: 0.361, b: 0.965 }
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
  }
}

/**
 * Lazy-loaded Three.js starfield. Renders nothing when disabled / mobile / reduced-motion.
 */
export default function StarfieldBackground({ className = '' }) {
  const mountRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(false)

  // Re-evaluate on reduced-motion, viewport width, and system motion preference
  useEffect(() => {
    const update = () => setActive(shouldEnableStarfield(reduceMotion))
    update()

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionMq.addEventListener('change', update)
    window.addEventListener('resize', update)

    return () => {
      motionMq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [reduceMotion])

  useEffect(() => {
    if (!active) return undefined
    const mount = mountRef.current
    if (!mount) return undefined

    let cancelled = false
    let renderer
    let scene
    let camera
    let points
    let geometry
    let material
    let rafId = 0
    let resizeObserver

    const run = async () => {
      const THREE = await import('three')
      if (cancelled || !mountRef.current) return

      const width = mount.clientWidth || window.innerWidth
      const height = mount.clientHeight || window.innerHeight

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200)
      camera.position.z = 28

      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
      renderer.setSize(width, height, false)
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)
      renderer.domElement.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'

      const positions = new Float32Array(STAR_COUNT * 3)
      const colors = new Float32Array(STAR_COUNT * 3)
      const accent = readAccentColor()

      for (let i = 0; i < STAR_COUNT; i += 1) {
        const i3 = i * 3
        const radius = 8 + Math.random() * 42
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i3 + 2] = radius * Math.cos(phi)

        // Theme only: ~70% white/off-white, ~30% accent purple — no red/blue variation
        const useAccent = Math.random() < 0.3
        const brightness = 0.45 + Math.random() * 0.45
        if (useAccent) {
          colors[i3] = accent.r * brightness
          colors[i3 + 1] = accent.g * brightness
          colors[i3 + 2] = accent.b * brightness
        } else {
          colors[i3] = brightness
          colors[i3 + 1] = brightness
          colors[i3 + 2] = brightness * 0.98
        }
      }

      geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      material = new THREE.PointsMaterial({
        size: 0.085,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      points = new THREE.Points(geometry, material)
      scene.add(points)

      const onResize = () => {
        if (!renderer || !camera || !mount) return
        const w = mount.clientWidth
        const h = mount.clientHeight
        if (w < 1 || h < 1) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
        renderer.setSize(w, h, false)
      }

      resizeObserver = new ResizeObserver(onResize)
      resizeObserver.observe(mount)

      const animate = () => {
        if (cancelled) return
        rafId = requestAnimationFrame(animate)
        // Slow continuous rotation — not tied to scroll
        if (points) {
          points.rotation.y += ROTATE_SPEED
          points.rotation.x += ROTATE_SPEED * 0.25
        }
        renderer.render(scene, camera)
      }
      animate()
    }

    run()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()

      if (points && scene) scene.remove(points)
      geometry?.dispose()
      material?.dispose()
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement?.parentNode === mount) {
          mount.removeChild(renderer.domElement)
        }
      }
      points = null
      geometry = null
      material = null
      renderer = null
      scene = null
      camera = null
    }
  }, [active])

  if (!active) return null

  return (
    <div
      ref={mountRef}
      data-starfield="active"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-60 dark:opacity-80 ${className}`}
      aria-hidden="true"
    />
  )
}
