import * as m from 'framer-motion/m'
import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import styled from 'styled-components'

import { fade } from '../animation'

// The three outlines are the real signature. The guides underneath reveal them in pen order.
const LETTERING = [
  {
    id: 'initial',
    strokes: [{ guide: 'M171 79 C157 -17 53 -4 24 101 S29 304 97 310 Q152 318 173 258', width: 48, ms: 235 }],
  },
  { id: 'given', strokes: [{ guide: 'M110 185 H274', width: 142, ms: 155 }] },
  {
    id: 'surname',
    strokes: [
      { guide: 'M220 328 Q288 290 310 9', width: 70, ms: 110 },
      { guide: 'M309 8 Q317 229 364 310', width: 54, ms: 100 },
      { guide: 'M261 202 Q292 172 339 179', width: 32, ms: 45 },
      { guide: 'M332 237 H565', width: 172, ms: 185 },
    ],
  },
] as const

function Handwriting() {
  const prefix = useId()
  let delay = 0

  return (
    <span aria-hidden="true" className="ink">
      <svg fill="currentColor" focusable="false" viewBox="7 8 556 320">
        {LETTERING.map(({ id, strokes }) => {
          const mask = `${prefix}-${id}`
          return (
            <g key={id}>
              <mask height="320" id={mask} maskUnits="userSpaceOnUse" width="556" x="7" y="8">
                {strokes.map(({ guide, width, ms }) => {
                  const timing = { '--draw': `${ms}ms`, '--start': `${delay}ms` } as CSSProperties
                  delay += ms
                  return (
                    <path
                      d={guide}
                      fill="none"
                      key={guide}
                      pathLength="1"
                      stroke="#ffffff"
                      strokeWidth={width}
                      style={timing}
                    />
                  )
                })}
              </mask>
              <use href={`/signature.svg#${id}`} mask={`url(#${mask})`} />
            </g>
          )
        })}
      </svg>
    </span>
  )
}

export default function Signature() {
  const [ink, setInk] = useState<'rest' | 'hover' | 'touch'>('rest')
  const name = useRef<HTMLButtonElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (ink !== 'touch') return
    const timer = window.setTimeout(() => setInk('rest'), 2000)
    return () => window.clearTimeout(timer)
  }, [ink])

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
    <Title
      onPointerCancel={() => (touch.current = null)}
      onPointerDown={(event) => {
        touch.current = event.pointerType === 'touch' && event.isPrimary ? { x: event.clientX, y: event.clientY } : null
      }}
      onPointerMove={brush}
      onPointerUp={() => (touch.current = null)}
      variants={fade}
    >
      <Name
        aria-description="Reveal my handwritten signature"
        data-ink={ink !== 'rest' || undefined}
        onClick={() => setInk((current) => (current === 'hover' ? current : 'touch'))}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') setInk('hover')
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') setInk('rest')
        }}
        ref={name}
        type="button"
      >
        <span className="print">Christian Anagnostou</span>
        <Handwriting />
      </Name>
    </Title>
  )
}

const Title = styled(m.h1)`
  touch-action: pan-y pinch-zoom;
`

const Name = styled.button`
  position: relative;
  display: inline-block;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-align: start;
  cursor: pointer;

  &::before {
    position: absolute;
    inset: -0.55em 0 -1.15em;
    content: '';
  }

  &:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: 0.4rem;
  }

  .print,
  .ink {
    display: block;
    font-weight: inherit;
    pointer-events: none;
  }

  .ink {
    position: absolute;
    top: -0.45em;
    left: 0;
    height: 2.7em;
    aspect-ratio: 556 / 320;
    opacity: 0;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media screen {
    &:is([data-ink], :focus-visible) {
      .print {
        opacity: 0;
      }
      .ink {
        opacity: 1;
      }
    }
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    .print {
      mask-image: linear-gradient(to right, transparent 40%, #000000 60%);
      mask-position: 100% 0;
      mask-size: 250% 100%;
      transition:
        mask-position 180ms ease,
        opacity 180ms ease;
    }
    .ink {
      transition: opacity 140ms ease;
    }
    path {
      stroke-dasharray: 1 1;
      stroke-dashoffset: 1;
      transition: stroke-dashoffset 140ms ease;
    }
    &:is([data-ink], :focus-visible) {
      .print {
        mask-position: 0 0;
        transition-duration: 340ms;
      }
      path {
        stroke-dashoffset: 0;
        transition: stroke-dashoffset var(--draw) linear var(--start);
      }
    }
  }
`
