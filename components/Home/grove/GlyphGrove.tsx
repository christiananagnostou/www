import { useEffect, useRef } from 'react'
import styled from 'styled-components'

import keyframes from './keyframes.png'
import { mountGrove } from './motion'
import { makePainter } from './paint'

export default function GlyphGrove() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const layer = canvas?.parentElement
    if (!canvas || !layer) return
    let stop: (() => void) | undefined
    const map = new Image()
    map.decoding = 'async'
    const loaded = () => {
      const paint = makePainter(canvas, map)
      if (paint) stop = mountGrove(canvas, layer, paint)
    }
    map.addEventListener('load', loaded, { once: true })
    map.src = keyframes.src
    return () => {
      map.removeEventListener('load', loaded)
      stop?.()
    }
  }, [])

  return (
    <Layer aria-hidden="true">
      <canvas ref={ref} />
    </Layer>
  )
}

const Layer = styled.div`
  position: absolute;
  inset: 0 0 0 auto;
  width: clamp(18rem, calc(50% - var(--max-w-screen) / 2 + 11rem), 85%);
  pointer-events: none;
  user-select: none;

  canvas {
    position: sticky;
    top: 0;
    display: block;
    width: 100%;
    height: min(100%, 100vh);
    mask-image: linear-gradient(to right, transparent, #000000 25%);
  }
`
