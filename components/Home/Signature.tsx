import * as m from 'framer-motion/m'
import { useEffect, useRef, useState } from 'react'
import type { ComponentType, PointerEvent } from 'react'

import { fade } from '../animation'

import styles from './Signature.module.css'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export default function Signature() {
  const [ink, setInk] = useState<'unseen' | 'rest' | 'hover' | 'touch'>('unseen')
  const [Lettering, setLettering] = useState<ComponentType | null>()
  const discovered = ink !== 'unseen'
  const name = useRef<HTMLButtonElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!discovered) return
    let mounted = true
    const preference = window.matchMedia?.(REDUCED_MOTION)
    const load = () =>
      import('./signature/Lettering').then(
        ({ default: art }) => {
          if (mounted) setLettering(() => art)
        },
        () => {
          if (mounted) setLettering(null) // An unavailable illustration must never hide the name.
        }
      )
    if (preference?.matches) preference.addEventListener('change', load, { once: true })
    else void load()
    return () => {
      mounted = false
      preference?.removeEventListener('change', load)
    }
  }, [discovered])

  useEffect(() => {
    if (ink !== 'touch') return
    if (Lettering === undefined && !window.matchMedia?.(REDUCED_MOTION).matches) return
    const timer = window.setTimeout(() => setInk('rest'), 2000)
    return () => window.clearTimeout(timer)
  }, [ink, Lettering])

  function brush(event: PointerEvent<HTMLHeadingElement>) {
    if (!touch.current || event.pointerType !== 'touch' || !event.isPrimary) return
    const dx = Math.abs(event.clientX - touch.current.x)
    const dy = Math.abs(event.clientY - touch.current.y)
    if (Math.max(dx, dy) < 8) return
    if (dy >= dx) {
      touch.current = null
      return
    }
    // Touch keeps its original event target even when a finger slides onto the name.
    const bounds = name.current?.getBoundingClientRect()
    if (
      bounds &&
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom
    ) {
      touch.current = null
      setInk('touch')
    }
  }

  return (
    <m.h1
      className={styles.title}
      onPointerCancel={() => (touch.current = null)}
      onPointerDown={(event) => {
        touch.current = event.pointerType === 'touch' && event.isPrimary ? { x: event.clientX, y: event.clientY } : null
      }}
      onPointerMove={brush}
      onPointerUp={() => (touch.current = null)}
      variants={fade}
    >
      <button
        className={styles.name}
        aria-description="Reveal my handwritten signature"
        data-ink={ink === 'hover' || ink === 'touch' || undefined}
        onClick={() => setInk((current) => (current === 'hover' ? current : 'touch'))}
        onFocus={() => setInk((current) => (current === 'unseen' ? 'rest' : current))}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') setInk('hover')
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') setInk('rest')
        }}
        ref={name}
        type="button"
      >
        {Lettering && <Lettering />}
        <span className="print">Christian Anagnostou</span>
      </button>
    </m.h1>
  )
}
