import { describe, expect, it } from 'vitest'

import { dedupeFitnessActivities } from './activities'
import type { FitnessActivity } from './types'

const activity: FitnessActivity = {
  guid: 'source-a',
  title: 'Indoor Cycling',
  type: 'Zwift',
  pubDate: '2026-07-28T23:50:34.000Z',
  MovingTime: '01:22:51',
  Distance: '26.80 mi',
  link: '',
  description: '',
  MapPolyline: '',
  best: { MovingTime: 0, Distance: 0, Pace: 0, AverageSpeed: 0, ElevationGain: 0 },
}

describe('dedupeFitnessActivities', () => {
  it('removes the same workout written by multiple HealthKit sources', () => {
    expect(dedupeFitnessActivities([activity, { ...activity, guid: 'source-b' }])).toEqual([activity])
  })

  it('keeps workouts with different start times', () => {
    const laterActivity = { ...activity, guid: 'source-b', pubDate: '2026-07-29T23:50:34.000Z' }
    expect(dedupeFitnessActivities([activity, laterActivity])).toEqual([activity, laterActivity])
  })
})
