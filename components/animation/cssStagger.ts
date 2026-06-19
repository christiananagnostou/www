import { css } from 'styled-components'

export const cssStaggerChild = (index: number, step = 0.06, duration = 0.5) => css`
  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;
    animation: staggerFadeIn ${duration}s ease forwards;
    animation-delay: calc(${index} * ${step}s);
  }

  @keyframes staggerFadeIn {
    to {
      opacity: 1;
    }
  }
`
