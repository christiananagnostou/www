import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchIntervalsIcuActivities, parseIntervalsIcuActivities } from './intervalsIcu'

const activity = {
  id: 'i172237313',
  start_date: '2026-08-01T15:21:19Z',
  type: 'GravelRide',
  moving_time: 8498,
  elapsed_time: 9683,
  distance: 58571.25,
  total_elevation_gain: 114,
  trainer: null,
  average_heartrate: 139,
  icu_average_watts: 141,
  icu_ignore_power: false,
  icu_ignore_time: false,
}

describe('parseIntervalsIcuActivities', () => {
  it('maps an Intervals.icu ride to the canonical activity model', () => {
    expect(parseIntervalsIcuActivities([activity])).toEqual([
      {
        id: 'intervals-icu:i172237313',
        startedAt: '2026-08-01T15:21:19.000Z',
        endedAt: '2026-08-01T18:02:42.000Z',
        kind: 'cycle',
        indoor: false,
        durationSeconds: 8498,
        distanceMeters: 58571.25,
        elevationGainMeters: 114,
        averageHeartRateBpm: 139,
        averagePowerWatts: 141,
      },
    ])
  })

  it('classifies virtual rides as indoor cycling', () => {
    const [parsed] = parseIntervalsIcuActivities([{ ...activity, type: 'VirtualRide', trainer: true }])
    expect(parsed).toMatchObject({ kind: 'cycle', indoor: true })
  })

  it('honors activities and power marked as ignored', () => {
    expect(parseIntervalsIcuActivities([{ ...activity, icu_ignore_time: true }])).toEqual([])
    expect(parseIntervalsIcuActivities([{ ...activity, icu_ignore_power: true }])[0].averagePowerWatts).toBeNull()
  })

  it('rejects malformed activity metrics', () => {
    expect(() => parseIntervalsIcuActivities([{ ...activity, moving_time: -1 }])).toThrow(
      'Invalid Intervals.icu moving time'
    )
  })
})

describe('fetchIntervalsIcuActivities', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.INTERVALS_ICU_API_KEY
  })

  it('authenticates with the configured API key', async () => {
    process.env.INTERVALS_ICU_API_KEY = 'secret-api-key'
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([activity]), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchIntervalsIcuActivities({ oldest: '2026-08-01', newest: '2026-08-03' })).resolves.toHaveLength(1)

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://intervals.icu/api/v1/athlete/0/activities?oldest=2026-08-01&newest=2026-08-03'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Basic ${Buffer.from('API_KEY:secret-api-key').toString('base64')}`,
        }),
      })
    )
  })
})
