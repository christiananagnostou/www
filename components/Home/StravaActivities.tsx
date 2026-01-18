import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import styled from 'styled-components'
import { type StravaActivity, type StravaActivityType } from '../../lib/strava'
import { fade, staggerFade } from '../animation'
import { hike, ride, run, swim, weight, zwift } from '../SVG/strava/icons'
import MiniMap from './StravaMinimap'

interface Props {
  activities: StravaActivity[]
}

const ActivityIcons: Record<StravaActivityType, ReactElement> = {
  Swim: swim(),
  Ride: ride(),
  Run: run(),
  WeightTraining: weight(),
  Hike: hike(),
  Zwift: zwift(),
  VirtualRide: zwift(),
  Walk: run(),
}

const AlternateMetricTitles = {
  MovingTime: 'Time',
  Distance: 'Distance',
  Pace: 'Pace',
  AverageSpeed: 'Avg Speed',
  ElevationGain: 'Elevation Gain',
} as const

const StravaActivities = ({ activities }: Props) => {
  const [filter, setFilter] = useState<keyof typeof ActivityIcons | ''>('')
  const [seeAllInView, setSeeAllInView] = useState(false)
  const activityListRef = useRef<HTMLUListElement>(null)
  const seeAllRef = useRef<HTMLLIElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  if (!activities?.length) return null

  const activityCounts = activities.reduce<Record<string, number>>((acc, act) => {
    acc[act.type] = (acc[act.type] ?? 0) + 1
    return acc
  }, {})

  const getFilterCount = (type: keyof typeof ActivityIcons) => {
    if (type === 'Zwift') return (activityCounts.Zwift ?? 0) + (activityCounts.VirtualRide ?? 0)
    return activityCounts[type] ?? 0
  }

  const matchesFilter = (activity: StravaActivity) => {
    if (!filter) return true
    if (filter === 'Zwift') return activity.type === 'Zwift' || activity.type === 'VirtualRide'
    return activity.type === filter
  }

  const filteredActivities = useMemo(() => {
    const matching = activities.filter(matchesFilter)
    return filter ? matching : matching.slice(0, 5)
  }, [activities, filter])

  const renderFilterButton = (type: keyof typeof ActivityIcons) => {
    const isActive = filter === type
    const count = getFilterCount(type)
    const label = `${type} (${count})`

    return (
      <ActivityFilter
        aria-label={label}
        aria-pressed={isActive}
        className={isActive ? 'active' : ''}
        title={label}
        variants={fade}
        onClick={() => setFilter((current) => (current === type ? '' : type))}
      >
        {ActivityIcons[type]}
      </ActivityFilter>
    )
  }

  const renderActivityDetail = (type: keyof StravaActivity['best'], activity: StravaActivity) => (
    <ActivityDetail $best={activity.best[type] === 1}>
      {AlternateMetricTitles[type]}: <strong>{activity[type]}</strong>
    </ActivityDetail>
  )

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
          {renderFilterButton('Swim')}
          {renderFilterButton('Ride')}
          {renderFilterButton('Run')}
          {renderFilterButton('Zwift')}
        </ActivityFilters>
      </SectionHeader>

      <ActivityList ref={activityListRef} tabIndex={0} onMouseDown={handleMouseDown}>
        {filteredActivities.map((activity) => {
          const pubDate = dayjs(activity.pubDate)
          const isToday = pubDate.isSame(dayjs(), 'day')
          const isYesterday = pubDate.isSame(dayjs().subtract(1, 'day'), 'day')

          return (
            <ActivityItem key={activity.guid}>
              <ActivityType title={activity.type}>{ActivityIcons[activity.type] || activity.type}</ActivityType>

              {activity.MapPolyline ? (
                <MapContainer>
                  <MiniMap height={100} polyline={activity.MapPolyline} width={100} />
                </MapContainer>
              ) : null}

              {activity.MovingTime ? renderActivityDetail('MovingTime', activity) : null}
              {activity.Distance ? renderActivityDetail('Distance', activity) : null}
              {activity.Pace ? renderActivityDetail('Pace', activity) : null}
              {activity.AverageSpeed ? renderActivityDetail('AverageSpeed', activity) : null}
              {activity.ElevationGain ? renderActivityDetail('ElevationGain', activity) : null}

              {isToday ? <ActivityDate>Today</ActivityDate> : null}
              {isYesterday ? <ActivityDate>Yesterday</ActivityDate> : null}
              {!isToday && !isYesterday && <ActivityDate>{pubDate.format('MMM D, YYYY')}</ActivityDate>}
            </ActivityItem>
          )
        })}

        {/* See All Link */}
        <SeeAllItem ref={seeAllRef} $compact={filteredActivities.length === 0}>
          <SeeAllContent data-in-view={seeAllInView} href="/fitness">
            <FloatingIcon $delay={0} $position="top-left" $rotation={-15}>
              {ActivityIcons.Run}
            </FloatingIcon>
            <FloatingIcon $delay={0.1} $position="top-right" $rotation={20}>
              {ActivityIcons.Ride}
            </FloatingIcon>
            <FloatingIcon $delay={0.2} $position="bottom-left" $rotation={-25}>
              {ActivityIcons.Swim}
            </FloatingIcon>
            <FloatingIcon $delay={0.3} $position="bottom-right" $rotation={15}>
              {ActivityIcons.WeightTraining}
            </FloatingIcon>
            <SeeAllText>See All Activities</SeeAllText>
          </SeeAllContent>
        </SeeAllItem>
      </ActivityList>
    </ActivitiesSection>
  )
}

export default StravaActivities

const ActivitiesSection = styled(motion.section)`
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

const Title = styled(motion.h2)`
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

const ActivityFilter = styled(motion.button)`
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

const ActivityItem = styled(motion.li)`
  position: relative;
  flex: 1;
  min-width: 200px;
  background: var(--dark-bg);
`

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
`

const ActivityType = styled.div`
  margin-bottom: -0.25rem;
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const ActivityDetail = styled.p<{ $best?: boolean }>`
  position: relative;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  color: var(--text-dark);
  strong {
    font-weight: 600;
    font-size: 0.75rem;
    color: ${(props) => (props.$best ? 'var(--text)' : 'inherit')};
  }
`

const ActivityDate = styled.p`
  font-size: 0.7rem;
  color: var(--text-dark);
`

const SeeAllItem = styled(motion.li)<{ $compact?: boolean }>`
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
