import { describe, expect, it } from 'vitest'

import { dedupeFitnessActivities } from './activities'
import type { StoredFitnessActivity } from './types'

const activity: StoredFitnessActivity = {
  guid: 'source-a',
  title: 'Indoor Cycling',
  type: 'Zwift',
  pubDate: '2026-07-28T23:50:34.000Z',
  MovingTime: '01:22:51',
  Distance: '26.80 mi',
}

describe('dedupeFitnessActivities', () => {
  it('removes the same workout written by multiple HealthKit sources', () => {
    expect(dedupeFitnessActivities([activity, { ...activity, guid: 'source-b' }])).toEqual([activity])
  })

  it('keeps workouts with different start times', () => {
    const laterActivity = { ...activity, guid: 'source-b', pubDate: '2026-07-29T23:50:34.000Z' }
    expect(dedupeFitnessActivities([activity, laterActivity])).toEqual([activity, laterActivity])
  })

  it('prefers a duplicate that includes a sanitized route', () => {
    const activityWithRoute = { ...activity, guid: 'source-b', RoutePolylines: ['encoded-route'] }
    expect(dedupeFitnessActivities([activity, activityWithRoute])).toEqual([activityWithRoute])
  })
})
