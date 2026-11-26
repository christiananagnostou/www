import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import keyframes from './keyframes.png'
import { mountGrove, type Playback } from './motion'
import { makePainter } from './paint'

export default function GlyphGrove() {
  const ref = useRef<HTMLCanvasElement>(null)
  const controls = useRef<ReturnType<typeof mountGrove> | null>(null)
  const [playback, setPlayback] = useState<Playback>('still')

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const map = new Image()
    map.decoding = 'async'
    const loaded = () => {
      const paint = makePainter(canvas, map)
      if (paint) controls.current = mountGrove(canvas, paint, setPlayback)
    }
    map.addEventListener('load', loaded, { once: true })
    map.src = keyframes.src
    return () => {
      map.removeEventListener('load', loaded)
      controls.current?.destroy()
      controls.current = null
    }
  }, [])

  return (
    <>
      <Print aria-hidden="true" ref={ref} />
      {playback !== 'still' && (
        <Control
          aria-label={actions[playback].label}
          onClick={() => controls.current?.toggle()}
          title={actions[playback].label}
          type="button"
        >
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 20 20">
            <path d={actions[playback].path} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Control>
      )}
    </>
  )
}

const actions = {
  playing: { label: 'Pause background animation', path: 'M7.5 5.5v9m5-9v9' },
  paused: { label: 'Resume background animation', path: 'm7 5 8 5-8 5z' },
  finished: { label: 'Replay background animation', path: 'M4 8a6 6 0 1 1 .6 5.5M4 4.5v4h4' },
} as const

const Print = styled.canvas`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
`

const Control = styled.button`
  position: absolute;
  z-index: 1;
  top: calc((var(--grove-opening) - 2.75rem) / 2);
  right: max(1rem, calc((100% - var(--max-w-screen)) / 2 + 1rem));
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  color: var(--text-dark);
  background: none;
  border: 0;
  border-radius: var(--border-radius-md);
  cursor: pointer;

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
  &:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: -3px;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--heading);
    }
  }
`
