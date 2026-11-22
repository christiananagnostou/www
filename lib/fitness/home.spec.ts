import { describe, expect, it, vi } from 'vitest'

import type { FitnessActivity } from './activity'
import { getHomeActivityPreview } from './home'

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

describe('getHomeActivityPreview', () => {
  it('formats canonical measurements only at the presentation boundary', () => {
    expect(getHomeActivityPreview([activity]).recent).toEqual([
      {
        id: 'cycle-1',
        category: 'indoorCycle',
        startedAt: '2026-08-02T14:30:00.000Z',
        distanceRank: 1,
        metrics: [
          { label: 'Time', value: '1:00:00' },
          { label: 'Distance', value: '10.00 mi' },
          { label: 'Avg Speed', value: '10.00 mph' },
          { label: 'Elevation Gain', value: '1640.42 ft' },
        ],
      },
    ])
  })

  it('counts the full history but only formats five activities per sport', () => {
    const readElevation = vi.fn(() => activity.elevationGainMeters)
    const rides = Array.from({ length: 7 }, (_, index) => ({
      ...activity,
      id: String(index),
      get elevationGainMeters() {
        return readElevation()
      },
    }))
    const preview = getHomeActivityPreview([...rides, { ...activity, id: 'run', kind: 'run' }])
    expect(preview.recent.map(({ id }) => id)).toEqual(['0', '1', '2', '3', '4', 'run'])
    expect(preview.totalCounts).toEqual({ indoorCycle: 7, run: 1, swim: 0, cycle: 0 })
    expect(readElevation).toHaveBeenCalledTimes(5)
  })

  it('shows swim pace per 100 meters', () => {
    const [swim] = getHomeActivityPreview([
      { ...activity, kind: 'swim', distanceMeters: 500, durationSeconds: 600 },
    ]).recent
    expect(swim.metrics.find((metric) => metric.label === 'Pace')?.value).toBe('2:00/100m')
  })

  it('ranks raw distances before limiting the preview and separates rides from Zwift', () => {
    const rides = [1002, 1001, 1000, 999, 0, 1003].map((distanceMeters, i) => ({
      ...activity,
      id: String(i),
      distanceMeters,
    }))
    const { recent } = getHomeActivityPreview([...rides, { ...activity, indoor: false, distanceMeters: 500 }])
    expect(recent.map((a) => a.distanceRank)).toEqual([2, 3, null, null, null, 1])
  })

  it('shares medals for equal distances and skips the occupied places', () => {
    const runs = [500, 500, 400, 300].map((distanceMeters, i) => ({
      ...activity,
      kind: 'run' as const,
      id: String(i),
      distanceMeters,
    }))
    expect(getHomeActivityPreview(runs).recent.map((a) => a.distanceRank)).toEqual([1, 1, 3, null])
  })

  it('omits activity kinds that are not shown on the homepage', () => {
    expect(getHomeActivityPreview([{ ...activity, kind: 'strength' }]).recent).toEqual([])
  })

  it('does not show pace for a zero-duration activity', () => {
    const [homeActivity] = getHomeActivityPreview([{ ...activity, kind: 'run', durationSeconds: 0 }]).recent
    expect(homeActivity.metrics.map((metric) => metric.label)).toEqual(['Distance', 'Elevation Gain'])
  })
})
