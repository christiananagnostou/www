import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { type StravaActivity } from '../../lib/strava'
import { fade, staggerFade } from '../animation'
import { hike, ride, run, swim, weight, zwift } from '../SVG/strava/icons'
import MiniMap from './StravaMinimap'

interface Props {
  activities: StravaActivity[]
}

const ActivityIcons = {
  Swim: swim(),
  Ride: ride(),
  Run: run(),
  WeightTraining: weight(),
  Hike: hike(),
  Zwift: zwift(),
  Walk: run(),
} as const

const AlternateMetricTitles = {
  MovingTime: 'Time',
  Distance: 'Distance',
  Pace: 'Pace',
  AverageSpeed: 'Avg Speed',
  ElevationGain: 'Elevation Gain',
} as const

const StravaActivities = ({ activities }: Props) => {
  const [filter, setFilter] = useState('')
  const activityListRef = useRef<HTMLUListElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  if (!activities?.length) return null

  const activityCounts = activities.reduce<Record<string, number>>((acc, act) => {
    acc[act.type] = (acc[act.type] ?? 0) + 1
    return acc
  }, {})

  const renderFilterButton = (type: keyof typeof ActivityIcons) => (
    <ActivityFilter
      className={filter === type ? 'active' : ''}
      title={`${type} (${activityCounts[type] ?? 0})`}
      variants={fade}
      onClick={() => setFilter(filter === type ? '' : type)}
    >
      {ActivityIcons[type]}
    </ActivityFilter>
  )

  const renderActivityDetail = (type: keyof StravaActivity['best'], activity: StravaActivity) => (
    <ActivityDetail $best={activity.best[type] === 1}>
      {AlternateMetricTitles[type]}: <strong>{activity[type]}</strong>
    </ActivityDetail>
  )

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
        <LinkTitle className="homepage-box__title" href="/fitness" variants={fade}>
          Fitness
        </LinkTitle>

        <ActivityFilters>
          {renderFilterButton('Swim')}
          {renderFilterButton('Ride')}
          {renderFilterButton('Run')}
          {renderFilterButton('Zwift')}
        </ActivityFilters>
      </SectionHeader>

      <ActivityList ref={activityListRef} tabIndex={0} onMouseDown={handleMouseDown}>
        {activities
          .filter((activity) => (filter ? activity.type === filter : true))
          .map((activity, index) => {
            const pubDate = dayjs(activity.pubDate)
            const isToday = pubDate.isSame(dayjs(), 'day')
            const isYesterday = pubDate.isSame(dayjs().subtract(1, 'day'), 'day')

            return (
              <ActivityItem key={index} variants={fade}>
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
        <SeeAllItem variants={fade}>
          <SeeAllContent href="/fitness">
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
  width: 100%;
  position: relative;
  border-radius: var(--border-radius-md);
  padding: 1rem 0;
  background: var(--dark-bg);
  border: 1px solid var(--accent);
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

const LinkTitle = styled(motion.create(Link))``

const ActivityFilters = styled.div`
  display: flex;
  gap: 0.25rem;
`

const ActivityFilter = styled(motion.button)`
  padding: 0.15rem 0.25rem;
  border-radius: var(--border-radius-sm);
  color: inherit;
  font-size: 0.8rem;
  background: none;
  border: 1px solid var(--accent);
  cursor: pointer;

  &.active {
    background: var(--accent);
  }

  svg {
    margin-bottom: -0.15rem;
  }
`

const ActivityList = styled.ul`
  list-style: none;
  user-select: none;
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
  overflow-x: auto;
  cursor: grab;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &.grabbing {
    cursor: grabbing;
  }
`

const ActivityItem = styled(motion.li)`
  flex: 1;
  position: relative;
  background: var(--dark-bg);
  min-width: 200px;
`

const MapContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
  height: 100px;
`

const ActivityType = styled.div`
  margin-bottom: -0.25rem;
  svg {
    height: 1.25rem;
    width: 1.25rem;
  }
`

const ActivityDetail = styled.p<{ $best?: boolean }>`
  margin: 0.5rem 0;
  color: var(--text-dark);
  font-size: 0.8rem;
  position: relative;
  strong {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${(props) => (props.$best ? 'var(--text)' : 'inherit')};
  }
`

const ActivityDate = styled.p`
  font-size: 0.7rem;
  color: var(--text-dark);
`

const SeeAllItem = styled(motion.li)`
  flex: 1;
  position: relative;
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SeeAllContent = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-xl);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(8px);
  text-decoration: none !important;

  &:before {
    content: '';
    position: absolute;
    border-radius: 50%;
    height: 200%;
    width: 200%;
    left: -50%;
    top: -50%;
    background:
      radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.06), transparent 45%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.03), transparent 55%);
    mix-blend-mode: overlay;
    pointer-events: none;
    rotate: 0deg;
    transition: rotate 0.3s ease;
    transform-origin: center center;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px -12px rgba(0, 0, 0, 0.4);

    &:before {
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
  opacity: 0;
  transform: scale(0.8) rotate(${(props) => props.$rotation}deg);
  transition: all 0.4s ease;
  transition-delay: ${(props) => props.$delay}s;
  pointer-events: none;
  z-index: 1;

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
    color: rgba(255, 255, 255, 0.15);
    filter: blur(0.5px);
  }

  ${SeeAllContent}:hover & {
    opacity: 1;
    transform: scale(1) rotate(${(props) => props.$rotation}deg);
  }
`

const SeeAllText = styled.span`
  color: var(--text-dark);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${SeeAllContent}:hover & {
    color: var(--heading);
  }
`
