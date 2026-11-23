import * as m from 'framer-motion/m'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  formatHomeActivityDate,
  HOME_ACTIVITY_LABELS as labels,
  HOME_ACTIVITY_LIMIT,
  type HomeActivity,
  type HomeActivityCategory,
} from '../../lib/fitness/home'
import { fade, staggerFade } from '../animation'
import { indoorCycle, ride, run, swim } from '../SVG/fitness/icons'
import DistanceMedal from './DistanceMedal'
import SeeAllActivitiesCard from './SeeAllActivitiesCard'

interface Props {
  activities: HomeActivity[]
  totalCounts: Record<HomeActivityCategory, number>
}

const filters = ['swim', 'cycle', 'run', 'indoorCycle'] as const
const icons = { swim: swim(), cycle: ride(), run: run(), indoorCycle: indoorCycle() }
const inlineLabel = (category: HomeActivityCategory) =>
  category === 'indoorCycle' ? labels[category] : labels[category].toLowerCase()

export default function FitnessActivities({ activities, totalCounts }: Props) {
  const [filter, setFilter] = useState<HomeActivityCategory | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const fadeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const list = listRef.current
    const edge = fadeRef.current
    if (!list || !edge) return

    const updateFade = () => {
      const range = list.scrollWidth - list.clientWidth
      const remaining = range - list.scrollLeft
      edge.style.opacity = range <= 0 || remaining <= 1 ? '0' : String(Math.min(1, remaining / (range * 0.1)))
    }
    updateFade()
    const observer = new ResizeObserver(updateFade)
    observer.observe(list)
    list.addEventListener('scroll', updateFade, { passive: true })
    return () => {
      observer.disconnect()
      list.removeEventListener('scroll', updateFade)
    }
  }, [activities, filter])
  if (!activities.length) return null
  const recent = (filter === null ? activities : activities.filter((a) => a.category === filter)).slice(
    0,
    HOME_ACTIVITY_LIMIT
  )

  return (
    <Log aria-labelledby="training-title" variants={staggerFade}>
      <header>
        <m.h2 id="training-title" variants={fade}>
          <Link href="/fitness">Fitness</Link>
        </m.h2>
        <div role="group" aria-label="Filter training by sport">
          {filters.map((key) => (
            <m.button
              key={key}
              variants={fade}
              type="button"
              aria-pressed={filter === key}
              aria-label={`${labels[key]} (${totalCounts[key]} recorded)`}
              title={labels[key]}
              onClick={() => setFilter((current) => (current === key ? null : key))}
            >
              {icons[key]}
            </m.button>
          ))}
        </div>
      </header>
      {recent.length === 0 && filter && <p>No {inlineLabel(filter)} activities recorded yet.</p>}
      <ScrollTrack>
        <ul key={filter} ref={listRef} aria-label="Recent activities" tabIndex={0}>
          {recent.map((activity) => {
            const metric = (label: string) => activity.metrics.find((entry) => entry.label === label)
            const distance = metric('Distance')
            const sport = inlineLabel(activity.category)
            const details = [metric('Time')?.value, metric('Pace')?.value ?? metric('Avg Speed')?.value].filter(Boolean)
            return (
              <li key={activity.id}>
                <time dateTime={activity.startedAt}>{formatHomeActivityDate(activity.startedAt)}</time>
                <h3>
                  {distance ? `${distance.value} ${sport}` : labels[activity.category]}
                  {activity.distanceRank && <DistanceMedal rank={activity.distanceRank} sport={sport} />}
                </h3>
                {details.length > 0 && <p>{details.join(' · ')}</p>}
              </li>
            )
          })}
          <SeeAllActivitiesCard />
        </ul>
        <EdgeFade ref={fadeRef} aria-hidden="true" />
      </ScrollTrack>
    </Log>
  )
}

const Log = styled(m.section)`
  width: 100%;
  padding-block: 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);

  > header,
  > p,
  ul {
    padding-inline: 1rem;
  }
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
    align-items: center;
    gap: 0.75rem;
    overflow-x: auto;
    scrollbar-width: none;
    list-style: none;
    margin: 0;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  li {
    flex: 0 0 9rem;
  }
  li:last-child {
    margin-inline-start: auto;
  }
  h3 {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin: 0.35rem 0;
    font-size: 0.95rem;
    font-weight: 500;
  }
  h3 svg {
    flex: none;
  }
  time {
    font-size: 0.75rem;
  }
  p,
  time {
    color: var(--text-dark);
  }
`

const ScrollTrack = styled.div`
  position: relative;
`

const EdgeFade = styled.span`
  position: absolute;
  inset: 0 0 0 auto;
  width: 2rem;
  pointer-events: none;
  background: linear-gradient(to right, transparent, var(--dark-bg));
  opacity: 0;
`
