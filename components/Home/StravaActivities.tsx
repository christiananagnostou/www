import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { type StravaActivity } from '../../lib/strava'
import { fade, staggerFade } from '../animation'
import { hike, ride, run, swim, weight, zwift } from '../SVG/strava/icons'
import MiniMap from './StravaMinimap'

type Props = {
  activities: StravaActivity[]
}

const activityIcons = {
  Swim: swim(),
  Ride: ride(),
  Run: run(),
  WeightTraining: weight(),
  Hike: hike(),
  Zwift: zwift(),
  Walk: run(),
} as const

const StravaActivities = ({ activities }: Props) => {
  const [filter, setFilter] = useState('')
  const activityListRef = useRef<HTMLUListElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  if (!activities?.length) return null

  const renderFilterButton = (type: keyof typeof activityIcons) => (
    <ActivityFilter
      variants={fade}
      title={type}
      className={filter === type ? 'active' : ''}
      onClick={() => setFilter(filter === type ? '' : type)}
    >
      {activityIcons[type]}
    </ActivityFilter>
  )

  const AlternateMetricTitles = {
    MovingTime: 'Time',
    Distance: 'Distance',
    Pace: 'Pace',
    AverageSpeed: 'Avg Speed',
    ElevationGain: 'Elevation Gain',
  } as const

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
        <Title variants={fade}>Fitness</Title>
        <ActivityFilters>
          {renderFilterButton('Swim')}
          {renderFilterButton('Ride')}
          {renderFilterButton('Run')}
          {renderFilterButton('Zwift')}
        </ActivityFilters>
      </SectionHeader>

      <ActivityList ref={activityListRef} onMouseDown={handleMouseDown} tabIndex={0}>
        {activities
          .filter((activity) => (filter ? activity.type === filter : true))
          .map((activity, index) => {
            const pubDate = dayjs(activity.pubDate)
            const isToday = pubDate.isSame(dayjs(), 'day')
            const isYesterday = pubDate.isSame(dayjs().subtract(1, 'day'), 'day')

            return (
              <ActivityItem key={index} variants={fade}>
                <ActivityType title={activity.type}>{activityIcons[activity.type] || activity.type}</ActivityType>

                {activity.MapPolyline && (
                  <MapContainer>
                    <MiniMap polyline={activity.MapPolyline} width={100} height={100} />
                  </MapContainer>
                )}

                {activity.MovingTime && renderActivityDetail('MovingTime', activity)}
                {activity.Distance && renderActivityDetail('Distance', activity)}
                {activity.Pace && renderActivityDetail('Pace', activity)}
                {activity.AverageSpeed && renderActivityDetail('AverageSpeed', activity)}
                {activity.ElevationGain && renderActivityDetail('ElevationGain', activity)}

                {isToday && <ActivityDate>Today</ActivityDate>}
                {isYesterday && <ActivityDate>Yesterday</ActivityDate>}
                {!isToday && !isYesterday && <ActivityDate>{pubDate.format('MMM D, YYYY')}</ActivityDate>}
              </ActivityItem>
            )
          })}
      </ActivityList>
    </ActivitiesSection>
  )
}

export default StravaActivities

const ActivitiesSection = styled(motion.section)`
  width: 100%;
  position: relative;
  border-radius: 7px;
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

const Title = styled(motion.h2)`
  color: var(--text);
`

const ActivityFilters = styled.div`
  display: flex;
  gap: 0.25rem;
`

const ActivityFilter = styled(motion.button)`
  padding: 0.15rem 0.25rem;
  border-radius: 4px;
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
