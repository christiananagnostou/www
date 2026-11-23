import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import styled from 'styled-components'

import { LETTERFORMS, NAME_ADVANCE } from './letterforms'

const RETURN = '430ms'

const glyphs = LETTERFORMS.map(([print, hand], index) => (
  <g
    key={index}
    style={
      {
        '--type': `path(evenodd, "${print}")`,
        '--hand': `path(evenodd, "${hand}")`,
        '--lag': `${index * 12}ms`,
        '--lift': `${Math.round(-22 - 10 * Math.sin(index * 0.75))}px`,
      } as CSSProperties
    }
  >
    <rect fill="currentColor" height="540" width={NAME_ADVANCE} />
  </g>
))

export default function Lettering() {
  const layer = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const root = layer.current
    const first = root?.querySelector('rect')
    if (!root || !first) return
    // Establish the printed contours before starting even the very first, on-demand hover.
    getComputedStyle(first).getPropertyValue('clip-path')
    root.setAttribute('data-ready', '')
  }, [])

  return (
    <Layer aria-hidden="true" focusable="false" ref={layer} viewBox={`0 0 ${NAME_ADVANCE} 540`}>
      {glyphs}
    </Layer>
  )
}

const Layer = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  visibility: hidden;
  pointer-events: none;

  @media screen and (prefers-reduced-motion: no-preference) {
    @supports (clip-path: path('M0 0L1 1Z')) {
      --return: ${RETURN};
      --flow: 650ms;
      --sweep: cubic-bezier(0.77, 0, 0.175, 1);
      transition: visibility 0s var(--return);

      &[data-ready] + .print {
        transition: opacity 0s ${RETURN};
      }
      g {
        transition: transform var(--return) cubic-bezier(0.23, 1, 0.32, 1);
      }
      rect {
        clip-path: var(--type);
        /* In the 200-unit em, this aligns the printed x-height with the lowercase pen strokes. */
        transform: translateY(128px);
        transition:
          clip-path var(--return) var(--sweep),
          transform var(--return) var(--sweep);
      }
      button:is([data-ink], :focus-visible) &[data-ready] {
        visibility: visible;
        transition-delay: 0s;
        & + .print {
          opacity: 0;
          transition-delay: 0s;
        }
        g,
        rect {
          transition-delay: var(--lag);
          transition-duration: var(--flow);
        }
        /* Equal, opposite travel with different easing bows the ink off the baseline only in mid-flight. */
        g {
          transform: translateY(var(--lift));
        }
        rect {
          clip-path: var(--hand);
          transform: translateY(calc(-1 * var(--lift)));
        }
      }
    }
  }
`
