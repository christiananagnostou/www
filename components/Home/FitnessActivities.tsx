import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import { HOME_ACTIVITY_LIMIT, type HomeActivity, type HomeActivityCategory } from '../../lib/fitness/home'
import { indoorCycle, ride, run, swim } from '../SVG/fitness/icons'
import SeeAllActivitiesCard from './SeeAllActivitiesCard'

interface Props {
  activities: HomeActivity[]
  totalCounts: Record<HomeActivityCategory, number>
}

const filters = ['swim', 'cycle', 'run', 'indoorCycle'] as const
const icons = { swim: swim(), cycle: ride(), run: run(), indoorCycle: indoorCycle() }
const labels = { run: 'Run', cycle: 'Ride', indoorCycle: 'Indoor ride', swim: 'Swim' }
const date = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
})

export default function FitnessActivities({ activities, totalCounts }: Props) {
  const [filter, setFilter] = useState<HomeActivityCategory | null>(null)
  if (!activities.length) return null
  const recent = (filter === null ? activities : activities.filter((a) => a.category === filter)).slice(
    0,
    HOME_ACTIVITY_LIMIT
  )

  return (
    <Log aria-labelledby="training-title">
      <header>
        <h2 id="training-title">
          <Link href="/fitness">Fitness</Link>
        </h2>
        <div role="group" aria-label="Filter training by sport">
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              aria-label={`${labels[key]} (${totalCounts[key]} recorded)`}
              title={labels[key]}
              onClick={() => setFilter((current) => (current === key ? null : key))}
            >
              {icons[key]}
            </button>
          ))}
        </div>
      </header>
      {recent.length === 0 && filter && <p>No {labels[filter].toLowerCase()} activities recorded yet.</p>}
      <ul key={filter} aria-label="Recent activities" tabIndex={0}>
        {recent.map((activity) => {
          const metric = (label: string) => activity.metrics.find((m) => m.label === label)
          const distance = metric('Distance')
          const sport = labels[activity.category]
          const details = [metric('Time')?.value, metric('Pace')?.value ?? metric('Avg Speed')?.value].filter(Boolean)
          return (
            <li key={activity.id}>
              <time dateTime={activity.startedAt}>{date.format(new Date(activity.startedAt))}</time>
              <h3>{distance ? `${distance.value} ${sport.toLowerCase()}` : sport}</h3>
              {details.length > 0 && <p>{details.join(' · ')}</p>}
              {distance?.highlight && <small>Longest {sport.toLowerCase()} on record</small>}
            </li>
          )
        })}
        <SeeAllActivitiesCard />
      </ul>
    </Log>
  )
}

const Log = styled.section`
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);

  header,
  [role='group'],
  ul {
    display: flex;
    align-items: baseline;
  }
  header {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  h2 {
    font-size: 0.95rem;
    font-weight: 200;
  }
  p,
  button {
    font-size: 0.85rem;
  }
  header a {
    color: var(--text);
  }
  [role='group'] {
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  button {
    background: none;
    color: var(--text);
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    padding: 0.25rem;
    display: grid;
    place-items: center;
    min-width: 1.75rem;
    min-height: 1.75rem;
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    background: var(--accent);
    color: var(--heading);
  }
  ul {
    gap: 1rem;
    overflow-x: auto;
    list-style: none;
    margin: 0;
    padding: 0.25rem 0.5rem 0.5rem 0;
  }
  li {
    flex: 1 0 12.5rem;
  }
  h3 {
    margin: 0.35rem 0;
    font-size: 1rem;
    font-weight: 500;
  }
  li:first-child h3 {
    font-size: 1.15rem;
  }
  time,
  small {
    font-size: 0.75rem;
  }
  p,
  time {
    color: var(--text-dark);
  }
`
