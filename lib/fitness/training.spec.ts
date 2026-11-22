import { describe, expect, it } from 'vitest'

import { heartRate, pace, power, toTrainingEntry, trainingLog, type TrainingEntry } from './training'
import { METERS_PER_MILE } from './units'

const ride: TrainingEntry = {
  day: '2025-03-09',
  sport: 'bike',
  indoor: false,
  seconds: 3600,
  meters: 20 * METERS_PER_MILE,
  climb: 30.48,
  bpm: 120,
  watts: 200,
}

describe('training log', () => {
  it('uses the Pacific training day and omits IDs and exact start times from the public log', () => {
    const activity = {
      id: 'test-ride',
      kind: 'cycle' as const,
      indoor: true,
      durationSeconds: 3600,
      distanceMeters: 1500,
      elevationGainMeters: 0,
      averageHeartRateBpm: null,
      averagePowerWatts: null,
    }
    expect(toTrainingEntry({ ...activity, startedAt: '2025-11-02T06:59:59Z' })).toEqual({
      day: '2025-11-01',
      sport: 'bike',
      indoor: true,
      seconds: 3600,
      meters: 1500,
      climb: 0,
      bpm: null,
      watts: null,
    })
    expect(toTrainingEntry({ ...activity, startedAt: '2025-11-02T07:00:00Z' }).day).toBe('2025-11-02')
  })

  it('counts both boundary days once across DST and excludes records on either side', () => {
    const days = ['2025-03-04', '2025-03-05', '2025-03-09', '2025-03-11', '2025-03-12']
    const log = trainingLog(
      days.map((day) => ({ ...ride, day })),
      '2025-03-11',
      '1w'
    )
    expect(log.daily).toBe(true)
    expect(log.buckets.map((b) => b.sports.bike.sessions)).toEqual([1, 0, 0, 0, 1, 0, 1])
    expect(log.total).toMatchObject({ sessions: 3, hours: 3, miles: 60, feet: 300 })
  })

  it('weights sensors by recorded duration, keeps genuine zeroes, and does not invent missing readings', () => {
    const log = trainingLog(
      [
        ride,
        { ...ride, indoor: true, seconds: 7200, bpm: 150, watts: 0 },
        { ...ride, day: '2025-03-10', bpm: null, watts: null },
        { ...ride, sport: 'other', day: '2025-03-10', watts: null },
      ],
      '2025-03-11',
      '1w'
    )
    expect(log.sports.bike).toMatchObject({ sessions: 3, hours: 4, indoorHours: 2 })
    expect(log.total.sessions).toBe(4)
    expect(heartRate(log.sports.bike)).toBe(140)
    expect(power(log.sports.bike)).toBeCloseTo(200 / 3)
    expect(heartRate(log.buckets[5].sports.bike)).toBeNull()
    expect(power(log.buckets[5].sports.bike)).toBeNull()
  })

  it('clamps month ends and labels the last partial week with its actual end date', () => {
    expect(trainingLog([], '2024-03-31', '1m').buckets[0].label).toBe('Feb 29, 2024')
    const log = trainingLog([], '2025-03-31', '3m')
    expect(log.daily).toBe(false)
    expect(log.dateRange).toBe('Dec 31, 2024 – Mar 31, 2025')
    expect(log.buckets.at(-1)?.label).toBe('Mar 25–31, 2025')
    expect(trainingLog([], '2025-03-09', '12m').buckets.at(-1)?.label).toBe('Mar 8–9, 2025')
  })

  it('formats pace as minutes and seconds, with no pace for a stationary activity', () => {
    expect(pace(0.55, 4)).toBe('8:15 /mi')
    expect(pace(1, 0)).toBe('—')
  })
})
