import { describe, expect, it } from 'vitest'

import type { FitnessActivity } from './activity'
import { createHomeActivities } from './home'

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

  it('omits activity kinds that are not shown on the homepage', () => {
    expect(createHomeActivities([{ ...activity, kind: 'strength' }])).toEqual([])
  })
})
