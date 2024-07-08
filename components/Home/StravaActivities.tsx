import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { StravaActivity } from '../../lib/strava'
import { fade, staggerFade } from '../animation'

type Props = {
  activities: StravaActivity[]
}

const StravaActivities = ({ activities }: Props) => {
  if (!activities?.length) return null
  return (
    <ActivitiesSection variants={staggerFade}>
      <Title variants={fade}>Latest Feats</Title>
      <ul>
        {activities.map((activity, index) => (
          <ActivityItem key={index} variants={fade}>
            {activity.type === 'Swim' && <ActivityType>{swim()}</ActivityType>}
            {activity.type === 'Ride' && <ActivityType>{ride()}</ActivityType>}
            {activity.type === 'WeightTraining' && <ActivityType>{weight()}</ActivityType>}

            {activity.MovingTime && (
              <ActivityDetail>
                Moving Time: <strong>{activity.MovingTime}</strong>
              </ActivityDetail>
            )}
            {activity.Distance && (
              <ActivityDetail>
                Distance: <strong>{activity.Distance}</strong>
              </ActivityDetail>
            )}
            {activity.AverageSpeed && (
              <ActivityDetail>
                Average Speed: <strong>{activity.AverageSpeed}</strong>
              </ActivityDetail>
            )}
            {activity.ElevationGain && (
              <ActivityDetail>
                Elevation Gain: <strong>{activity.ElevationGain}</strong>
              </ActivityDetail>
            )}

            <ActivityDate>{dayjs(activity.pubDate).format('MMM D, YYYY')}</ActivityDate>
          </ActivityItem>
        ))}
      </ul>
    </ActivitiesSection>
  )
}

export default StravaActivities

const swim = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 32 32"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 23.5 11 C 21.578125 11 20 12.578125 20 14.5 C 20 16.421875 21.578125 18 23.5 18 C 25.421875 18 27 16.421875 27 14.5 C 27 12.578125 25.421875 11 23.5 11 Z M 13.71875 11.03125 C 13.355469 11.054688 13.003906 11.175781 12.6875 11.40625 L 7.40625 15.1875 L 8.59375 16.8125 L 13.84375 13.03125 L 16.125 15.65625 L 8.71875 21.9375 C 9.125 21.972656 9.558594 22 10 22 C 10.675781 22 11.324219 21.929688 11.96875 21.8125 L 17.40625 17.15625 L 19.4375 19.5 C 20.175781 19.308594 20.933594 19.144531 21.71875 19.0625 L 15.34375 11.71875 C 14.917969 11.222656 14.324219 10.992188 13.71875 11.03125 Z M 23.5 13 C 24.339844 13 25 13.660156 25 14.5 C 25 15.34375 24.339844 16 23.5 16 C 22.65625 16 22 15.34375 22 14.5 C 22 13.660156 22.65625 13 23.5 13 Z M 23 20 C 20.5625 20 18.425781 20.816406 16.34375 21.5625 C 14.261719 22.308594 12.234375 23 10 23 C 4.503906 23 1.6875 20.28125 1.6875 20.28125 L 0.3125 21.71875 C 0.3125 21.71875 3.816406 25 10 25 C 12.644531 25 14.90625 24.191406 17 23.4375 C 19.09375 22.683594 21.015625 22 23 22 C 26.96875 22 30.34375 24.78125 30.34375 24.78125 L 31.65625 23.21875 C 31.65625 23.21875 27.875 20 23 20 Z"></path>
    </svg>
  )
}

const ride = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 256 256"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M54.46,164.71,82.33,126.5a48,48,0,1,1-12.92-9.44L41.54,155.29a8,8,0,1,0,12.92,9.42ZM208,112a47.81,47.81,0,0,0-16.93,3.09L214.91,156A8,8,0,1,1,201.09,164l-23.83-40.86A48,48,0,1,0,208,112ZM165.93,72H192a8,8,0,0,1,8,8,8,8,0,0,0,16,0,24,24,0,0,0-24-24H152a8,8,0,0,0-6.91,12l11.65,20H99.26L82.91,60A8,8,0,0,0,76,56H48a8,8,0,0,0,0,16H71.41L85.12,95.51,69.41,117.06a47.87,47.87,0,0,1,12.92,9.44l11.59-15.9L125.09,164A8,8,0,1,0,138.91,156l-30.32-52h57.48l11.19,19.17a48.11,48.11,0,0,1,13.81-8.08Z"></path>
    </svg>
  )
}

const weight = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.435,11.5h-.38V8.12a1.626,1.626,0,0,0-1.62-1.62h-.63V6.12a1.625,1.625,0,0,0-3.25,0V11.5H8.445V6.12a1.625,1.625,0,0,0-3.25,0V6.5h-.63a1.62,1.62,0,0,0-1.62,1.62V11.5h-.38a.5.5,0,1,0,0,1h.38v3.37a1.622,1.622,0,0,0,1.62,1.63H5.2v.37a1.625,1.625,0,1,0,3.25,0V12.5h7.11v5.37a1.625,1.625,0,1,0,3.25,0V17.5h.63a1.628,1.628,0,0,0,1.62-1.63V12.5h.38a.5.5,0,1,0,0-1ZM5.2,16.5h-.63a.625.625,0,0,1-.62-.63V8.12a.623.623,0,0,1,.62-.62H5.2Zm2.25,1.37a.634.634,0,0,1-.63.63.625.625,0,0,1-.62-.63V6.12a.623.623,0,0,1,.62-.62.632.632,0,0,1,.63.62Zm10.36,0a.625.625,0,1,1-1.25,0V6.12a.625.625,0,0,1,1.25,0Zm2.25-2a.625.625,0,0,1-.62.63h-.63v-9h.63a.623.623,0,0,1,.62.62Z"></path>
    </svg>
  )
}

const ActivitiesSection = styled(motion.section)`
  width: 100%;
  position: relative;
  border-radius: 7px;
  padding: 1rem 0 1rem 1rem;
  background: var(--dark-bg);
  border: 1px solid var(--accent);
  color: var(--text);

  * {
    font-weight: 200;
    font-size: 0.95rem;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 1rem;
    padding-right: 1rem;
    overflow-x: auto;
    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const Title = styled(motion.h2)`
  margin-bottom: 1rem;
  color: var(--text);
`

const ActivityItem = styled(motion.li)`
  flex: 1;
  min-width: max-content;
`

const ActivityType = styled.div`
  margin-bottom: -0.25rem;
  svg {
    height: 1.25rem;
    width: 1.25rem;
  }
`

const ActivityDetail = styled.p`
  margin: 0.5rem 0;
  color: var(--text-dark);
  font-size: 0.8rem;
  strong {
    font-size: 0.75rem;
    font-weight: 600;
  }
`

const ActivityDate = styled.p`
  font-size: 0.7rem;
  color: var(--text-dark);
`
