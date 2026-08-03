import * as m from 'framer-motion/m'
import Link from 'next/link'
import { useEffect, useRef, useState, type ReactElement } from 'react'
import styled from 'styled-components'
import type { HomeActivity, HomeActivityCategory } from '../../lib/fitness/home'
import { fade, staggerFade } from '../animation'
import { ride, run, swim, zwift } from '../SVG/fitness/icons'

interface Props {
  activities: HomeActivity[]
}

const ACTIVITY_ICONS: Record<HomeActivityCategory, ReactElement> = {
  swim: swim(),
  cycle: ride(),
  run: run(),
  indoorCycle: zwift(),
}

const ACTIVITY_LABELS: Record<HomeActivityCategory, string> = {
  swim: 'Swim',
  cycle: 'Cycle',
  run: 'Run',
  indoorCycle: 'Indoor cycle',
}

const ACTIVITY_TIME_ZONE = 'America/Los_Angeles'
const activityDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  timeZone: ACTIVITY_TIME_ZONE,
  year: 'numeric',
})

const FitnessActivities = ({ activities }: Props) => {
  const [filter, setFilter] = useState<HomeActivityCategory | ''>('')
  const [seeAllInView, setSeeAllInView] = useState(false)
  const activityListRef = useRef<HTMLUListElement>(null)
  const seeAllRef = useRef<HTMLLIElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const activityCounts = activities.reduce<Record<string, number>>((acc, act) => {
    acc[act.category] = (acc[act.category] ?? 0) + 1
    return acc
  }, {})

  const getFilterCount = (category: HomeActivityCategory) => {
    return activityCounts[category] ?? 0
  }

  const filteredActivities = filter
    ? activities.filter((activity) => activity.category === filter)
    : activities.slice(0, 5)

  const renderFilterButton = (category: HomeActivityCategory) => {
    const isActive = filter === category
    const count = getFilterCount(category)
    const label = `${ACTIVITY_LABELS[category]} (${count})`

    return (
      <ActivityFilter
        aria-label={label}
        aria-pressed={isActive}
        className={isActive ? 'active' : ''}
        title={label}
        variants={fade}
        onClick={() => setFilter((current) => (current === category ? '' : category))}
      >
        {ACTIVITY_ICONS[category]}
      </ActivityFilter>
    )
  }

  useEffect(() => {
    if (!seeAllRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.8
        setSeeAllInView(isVisible)
      },
      { root: activityListRef.current, threshold: [0, 0.8, 1] }
    )

    observer.observe(seeAllRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!activities.length) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    activityListRef.current?.classList.add('grabbing')
    document.documentElement.style.cursor = 'grabbing'

    startX.current = e.pageX - (activityListRef.current?.offsetLeft || 0)
    scrollLeft.current = activityListRef.current?.scrollLeft || 0

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const x = e.pageX - (activityListRef.current?.offsetLeft || 0)
      const walk = x - startX.current
      if (activityListRef.current) {
        activityListRef.current.scrollLeft = scrollLeft.current - walk
      }
    }

    const handleMouseUp = () => {
      activityListRef.current?.classList.remove('grabbing')
      document.documentElement.style.cursor = 'auto'
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <ActivitiesSection variants={staggerFade}>
      <SectionHeader>
        <Title variants={fade}>
          <Link href="/fitness">Fitness</Link>
        </Title>

        <ActivityFilters>
          {renderFilterButton('swim')}
          {renderFilterButton('cycle')}
          {renderFilterButton('run')}
          {renderFilterButton('indoorCycle')}
        </ActivityFilters>
      </SectionHeader>

      <ActivityList ref={activityListRef} tabIndex={0} onMouseDown={handleMouseDown}>
        {filteredActivities.map((activity) => {
          const startedAt = new Date(activity.startedAt)

          return (
            <ActivityItem key={activity.id}>
              <ActivityType title={ACTIVITY_LABELS[activity.category]}>
                {ACTIVITY_ICONS[activity.category]}
              </ActivityType>

              {activity.metrics.map((metric) => (
                <ActivityDetail key={metric.label} $highlight={metric.highlight}>
                  {metric.label}: <strong>{metric.value}</strong>
                </ActivityDetail>
              ))}

              <ActivityDate>{activityDateFormatter.format(startedAt)}</ActivityDate>
            </ActivityItem>
          )
        })}

        {/* See All Link */}
        <SeeAllItem ref={seeAllRef} $compact={filteredActivities.length === 0}>
          <SeeAllContent data-in-view={seeAllInView} href="/fitness">
            <FloatingIcon $delay={0} $position="top-left" $rotation={-15}>
              {ACTIVITY_ICONS.run}
            </FloatingIcon>
            <FloatingIcon $delay={0.1} $position="top-right" $rotation={20}>
              {ACTIVITY_ICONS.cycle}
            </FloatingIcon>
            <FloatingIcon $delay={0.2} $position="bottom-left" $rotation={-25}>
              {ACTIVITY_ICONS.swim}
            </FloatingIcon>
            <FloatingIcon $delay={0.3} $position="bottom-right" $rotation={15}>
              {ACTIVITY_ICONS.indoorCycle}
            </FloatingIcon>
            <SeeAllText>See All Activities</SeeAllText>
          </SeeAllContent>
        </SeeAllItem>
      </ActivityList>
    </ActivitiesSection>
  )
}

export default FitnessActivities

const ActivitiesSection = styled(m.section)`
  position: relative;
  width: 100%;
  padding: 1rem 0;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);
  color: var(--text);

  * {
    font-weight: 200;
    font-size: 0.95rem;
  }
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 1rem;
`

const Title = styled(m.h2)`
  margin: 0;

  a {
    display: block;
    color: inherit;
  }
`

const ActivityFilters = styled.div`
  display: flex;
  gap: 0.25rem;
`

const ActivityFilter = styled(m.button)`
  padding: 0.15rem 0.25rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-sm);
  background: none;
  font-size: 0.8rem;
  color: inherit;
  cursor: pointer;

  &.active {
    background: var(--accent);
  }

  svg {
    margin-bottom: -0.15rem;
  }
`

const ActivityList = styled.ul`
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
  list-style: none;
  cursor: grab;
  user-select: none;
  overflow-x: auto;
  -ms-overflow-style: none;

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &.grabbing {
    cursor: grabbing;
  }
`

const ActivityItem = styled.li`
  position: relative;
  flex: 1;
  min-width: 200px;
  background: var(--dark-bg);
`

const ActivityType = styled.div`
  margin-bottom: -0.25rem;
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const ActivityDetail = styled.p<{ $highlight: boolean }>`
  position: relative;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  color: var(--text-dark);
  strong {
    font-weight: 600;
    font-size: 0.75rem;
    color: ${({ $highlight }) => ($highlight ? 'var(--text)' : 'inherit')};
  }
`

const ActivityDate = styled.p`
  font-size: 0.7rem;
  color: var(--text-dark);
`

const SeeAllItem = styled.li<{ $compact?: boolean }>`
  position: relative;
  display: flex;
  flex: ${({ $compact }) => ($compact ? '0 0 200px' : '1')};
  justify-content: center;
  align-items: center;
  min-width: 200px;
`

const SeeAllContent = styled(Link)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
    box-shadow: 0 8px 32px -12px rgb(0 0 0 / 40%);

    &::before {
      rotate: 40deg;
    }
  }
`

const FloatingIcon = styled.div<{
  $position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  $rotation: number
  $delay: number
}>`
  position: absolute;
  z-index: 1;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8) rotate(${(props) => props.$rotation}deg);
  transition: all 0.4s ease;
  transition-delay: ${(props) => props.$delay}s;

  ${(props) => {
    switch (props.$position) {
      case 'top-left':
        return 'top: 15%; left: 15%;'
      case 'top-right':
        return 'top: 20%; right: 15%;'
      case 'bottom-left':
        return 'bottom: 20%; left: 20%;'
      case 'bottom-right':
        return 'bottom: 15%; right: 20%;'
      default:
        return ''
    }
  }}

  svg {
    width: 24px;
    height: 24px;
    filter: blur(0.5px);
    color: rgb(255 255 255 / 15%);
  }

  ${SeeAllContent}:hover &,
  ${SeeAllContent}[data-in-view='true'] & {
    opacity: 1;
    transform: scale(1) rotate(${(props) => props.$rotation}deg);
  }
`

const SeeAllText = styled.span`
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
  ${SeeAllContent}[data-in-view='true'] & {
    color: var(--heading);
  }
`
