import { describe, expect, it } from 'vitest'

import type { FitnessActivity } from './activity'
import { createHomeActivities, getHomeActivityPreview } from './home'

const activity: FitnessActivity = {
  id: 'cycle-1',
  startedAt: '2026-08-02T14:30:00.000Z',
  kind: 'cycle',
  indoor: true,
  durationSeconds: 3600,
  distanceMeters: 16093.44,
  elevationGainMeters: 500,
  averageHeartRateBpm: 148,
  averagePowerWatts: 200,
}

describe('createHomeActivities', () => {
  it('formats canonical measurements only at the presentation boundary', () => {
    expect(createHomeActivities([activity])).toEqual([
      {
        id: 'cycle-1',
        category: 'indoorCycle',
        startedAt: '2026-08-02T14:30:00.000Z',
        metrics: [
          { label: 'Time', value: '01:00:00', highlight: false },
          { label: 'Distance', value: '10.00 mi', highlight: true },
          { label: 'Avg Speed', value: '10.00 mph', highlight: true },
          { label: 'Elevation Gain', value: '1640.42 ft', highlight: true },
        ],
      },
    ])
  })

  it('keeps five recent activities per sport and counts the full history', () => {
    const rides = Array.from({ length: 7 }, (_, index) => ({ ...activity, id: String(index) }))
    const preview = getHomeActivityPreview([...rides, { ...activity, id: 'run', kind: 'run' }])
    expect(preview.recent.map(({ id }) => id)).toEqual(['0', '1', '2', '3', '4', 'run'])
    expect(preview.totalCounts).toEqual({ indoorCycle: 7, run: 1, swim: 0, cycle: 0 })
  })

  it('omits activity kinds that are not shown on the homepage', () => {
    expect(createHomeActivities([{ ...activity, kind: 'strength' }])).toEqual([])
  })

  it('does not show pace for a zero-duration activity', () => {
    const [homeActivity] = createHomeActivities([{ ...activity, kind: 'run', durationSeconds: 0 }])
    expect(homeActivity.metrics.map((metric) => metric.label)).toEqual(['Distance', 'Elevation Gain'])
  })
})
