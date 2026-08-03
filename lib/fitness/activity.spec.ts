import { describe, expect, it } from 'vitest'

import { deduplicateActivities, type FitnessActivity } from './activity'

const activity: FitnessActivity = {
  id: 'source-a',
  startedAt: '2026-07-28T23:50:34.000Z',
  endedAt: '2026-07-29T01:13:25.000Z',
  kind: 'cycle',
  indoor: true,
  durationSeconds: 4971,
  distanceMeters: 43130,
  elevationGainMeters: 0,
  averageHeartRateBpm: 140,
  averagePowerWatts: 180,
}

describe('deduplicateActivities', () => {
  it('removes the same workout written by multiple HealthKit sources', () => {
    expect(deduplicateActivities([activity, { ...activity, id: 'source-b' }])).toEqual([activity])
  })

  it('keeps workouts with different start times', () => {
    const laterActivity = { ...activity, id: 'source-b', startedAt: '2026-07-29T23:50:34.000Z' }
    expect(deduplicateActivities([activity, laterActivity])).toEqual([activity, laterActivity])
  })

  it('deterministically keeps the more complete duplicate record', () => {
    const incompleteActivity = {
      ...activity,
      elevationGainMeters: 0,
      averageHeartRateBpm: null,
      averagePowerWatts: null,
    }
    const completeActivity = { ...activity, id: 'source-b' }

    expect(deduplicateActivities([incompleteActivity, completeActivity])).toEqual([completeActivity])
    expect(deduplicateActivities([completeActivity, incompleteActivity])).toEqual([completeActivity])
  })
})
