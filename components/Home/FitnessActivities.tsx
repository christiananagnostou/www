import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import { HOME_ACTIVITY_LIMIT, type HomeActivity, type HomeActivityCategory } from '../../lib/fitness/home'

interface Props {
  activities: HomeActivity[]
  totalCounts: Record<HomeActivityCategory, number>
}

const filters = ['all', 'run', 'cycle', 'indoorCycle', 'swim'] as const
const labels = { all: 'All', run: 'Run', cycle: 'Ride', indoorCycle: 'Indoor ride', swim: 'Swim' }
const date = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
})

export default function FitnessActivities({ activities, totalCounts }: Props) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  if (!activities.length) return null
  const recent = (filter === 'all' ? activities : activities.filter((a) => a.category === filter)).slice(
    0,
    HOME_ACTIVITY_LIMIT
  )

  return (
    <Log aria-labelledby="training-title">
      <header>
        <h2 id="training-title">Recent training</h2>
        <Link href="/fitness">View training</Link>
      </header>
      <div role="group" aria-label="Filter training by sport">
        {filters.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            aria-label={key === 'all' ? 'All sports' : `${labels[key]} (${totalCounts[key]} recorded)`}
            onClick={() => setFilter(key)}
          >
            {labels[key]}
          </button>
        ))}
      </div>
      {recent.length ? (
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
        </ul>
      ) : (
        <p>No {labels[filter].toLowerCase()} activities recorded yet.</p>
      )}
    </Log>
  )
}

const Log = styled.section`
  width: 100%;
  padding: 1rem;
  border-block: 1px solid var(--accent);
  background: var(--dark-bg);

  header,
  [role='group'],
  ul {
    display: flex;
    align-items: baseline;
  }
  header {
    justify-content: space-between;
    gap: 1rem;
  }
  h2 {
    font-size: 1.1rem;
    font-weight: 500;
  }
  header a,
  p,
  button {
    font-size: 0.85rem;
  }
  [role='group'] {
    gap: 0.75rem;
    flex-wrap: wrap;
    margin: 0.5rem 0 1rem;
  }
  button {
    background: none;
    color: var(--text);
    border: 0;
    padding: 0.5rem 0;
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    text-decoration: underline;
    text-underline-offset: 0.35em;
    color: var(--heading);
  }
  ul {
    gap: 1rem;
    overflow-x: auto;
    list-style: none;
    margin: 0;
    padding: 0 0 0.5rem;
  }
  li {
    flex: 1 0 8.5rem;
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
