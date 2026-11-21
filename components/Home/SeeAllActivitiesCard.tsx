import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ride, run, swim, weight } from '../SVG/fitness/icons'

export default function SeeAllActivitiesCard() {
  const ref = useRef<HTMLLIElement>(null)
  const [seeAllInView, setSeeAllInView] = useState(false)

  useEffect(() => {
    const item = ref.current
    if (!item || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setSeeAllInView(entry.intersectionRatio >= 0.8), {
      root: item.parentElement,
      threshold: 0.8,
    })
    observer.observe(item)
    return () => observer.disconnect()
  }, [])

  return (
    <Item ref={ref}>
      <SeeAllContent data-in-view={seeAllInView} href="/fitness">
        <FloatingIcon aria-hidden="true" $delay={0} $position="top-left" $rotation={-15}>
          {run()}
        </FloatingIcon>
        <FloatingIcon aria-hidden="true" $delay={0.1} $position="top-right" $rotation={20}>
          {ride()}
        </FloatingIcon>
        <FloatingIcon aria-hidden="true" $delay={0.2} $position="bottom-left" $rotation={-25}>
          {swim()}
        </FloatingIcon>
        <FloatingIcon aria-hidden="true" $delay={0.3} $position="bottom-right" $rotation={15}>
          {weight()}
        </FloatingIcon>
        <SeeAllText>See All Activities</SeeAllText>
      </SeeAllContent>
    </Item>
  )
}

const Item = styled.li`
  display: flex;
  align-self: stretch;
  min-height: 5rem;
  max-width: 16rem;
`

const SeeAllContent = styled(Link)`
  position: relative;
  display: grid;
  grid-template:
    'top-left . top-right' 1fr
    'label label label' auto
    'bottom-left . bottom-right' 1fr / auto 1fr auto;
  align-items: center;
  row-gap: 0.25rem;
  padding: 0.5rem 0.85rem;
  width: 100%;
  border-radius: var(--border-radius-xl);
  color: inherit;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    border-radius: 50%;
    background:
      radial-gradient(circle at 70% 20%, rgb(255 255 255 / 6%), transparent 45%),
      linear-gradient(135deg, rgb(255 255 255 / 3%), transparent 55%);
    pointer-events: none;
    transform-origin: center center;
    transition: rotate 0.3s ease;
    mix-blend-mode: overlay;
    rotate: 0deg;
  }

  &:hover,
  &[data-in-view='true'] {
    border-color: rgb(255 255 255 / 15%);
    box-shadow: inset 0 0 0 1px var(--accent);

    &::before {
      rotate: 40deg;
    }
  }

  &:focus-visible {
    outline-offset: -3px;
  }
`

const FloatingIcon = styled.div<{
  $position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  $rotation: number
  $delay: number
}>`
  grid-area: ${(props) => props.$position};
  display: grid;
  place-items: center;
  z-index: 1;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8) rotate(${(props) => props.$rotation}deg);
  transition: all 0.4s ease;
  transition-delay: ${(props) => props.$delay}s;

  svg {
    width: 1.125rem;
    height: 1.125rem;
    filter: blur(0.5px);
    color: rgb(255 255 255 / 15%);
  }

  ${SeeAllContent}:hover &,
  ${SeeAllContent}:focus-visible &,
  ${SeeAllContent}[data-in-view='true'] & {
    opacity: 1;
    transform: scale(1) rotate(${(props) => props.$rotation}deg);
  }
`

const SeeAllText = styled.span`
  grid-area: label;
  justify-self: center;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  color: var(--text-dark);
  letter-spacing: 0.3px;
  transition: all 0.3s ease;

  ${SeeAllContent}:hover &,
  ${SeeAllContent}:focus-visible &,
  ${SeeAllContent}[data-in-view='true'] & {
    color: var(--heading);
  }
`
