import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { StravaActivity } from '../../lib/strava'
import { fade, staggerFade } from '../animation'
import { hike, ride, run, swim, weight } from '../SVG/strava/icons'

type Props = {
  activities: StravaActivity[]
}

const activityIcons: Record<string, JSX.Element> = {
  Swim: swim(),
  Ride: ride(),
  Run: run(),
  WeightTraining: weight(),
  Hike: hike(),
}

const splitCamelCase = (input: string): string => {
  return input.replace(/([a-z])([A-Z])/g, '$1 $2')
}

const StravaActivities = ({ activities }: Props) => {
  const [filter, setFilter] = useState('')
  const activityListRef = useRef<HTMLUListElement>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  if (!activities?.length) return null

  const renderFilterButton = (type: keyof typeof activityIcons) => (
    <ActivityFilter
      variants={fade}
      aria-label={type}
      title={type}
      className={filter === type ? 'active' : ''}
      onClick={() => setFilter(filter === type ? '' : type)}
    >
      {activityIcons[type]}
    </ActivityFilter>
  )

  const renderActivityDetail = (type: keyof StravaActivity['best'], activity: StravaActivity) => (
    <ActivityDetail best={activity.best[type] === 1}>
      {splitCamelCase(type)}: <strong>{activity[type]}</strong>
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
        <Title variants={fade}>Latest Feats</Title>
        <ActivityFilters>
          {renderFilterButton('Swim')}
          {renderFilterButton('Ride')}
          {renderFilterButton('Run')}
        </ActivityFilters>
      </SectionHeader>

      <ActivityList ref={activityListRef} onMouseDown={handleMouseDown}>
        {activities
          .filter((activity) => (filter ? activity.type === filter : true))
          .map((activity, index) => (
            <ActivityItem key={index} variants={fade}>
              <ActivityType title={activity.type} aria-label={activity.type}>
                {activityIcons[activity.type] || activity.type}
              </ActivityType>

              {activity.MovingTime && renderActivityDetail('MovingTime', activity)}
              {activity.Distance && renderActivityDetail('Distance', activity)}
              {activity.Pace && renderActivityDetail('Pace', activity)}
              {activity.AverageSpeed && renderActivityDetail('AverageSpeed', activity)}
              {activity.ElevationGain && renderActivityDetail('ElevationGain', activity)}

              <ActivityDate>{dayjs(activity.pubDate).format('MMM D, YYYY')}</ActivityDate>
            </ActivityItem>
          ))}
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
  padding: 0;
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
  min-width: max-content;
  max-width: max-content;
`

const ActivityType = styled.div`
  margin-bottom: -0.25rem;
  svg {
    height: 1.25rem;
    width: 1.25rem;
  }
`

const ActivityDetail = styled.p<{ best?: boolean }>`
  margin: 0.5rem 0;
  color: var(--text-dark);
  font-size: 0.8rem;
  strong {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${(props) => (props.best ? 'var(--text)' : 'inherit')};
  }
`

const ActivityDate = styled.p`
  font-size: 0.7rem;
  color: var(--text-dark);
`
