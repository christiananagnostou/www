import { describe, expect, it } from 'vitest'

import { parseHealthAutoExport } from './healthAutoExport'

describe('parseHealthAutoExport', () => {
  it('maps a Version 2 cycling workout to the site activity format', () => {
    const activities = parseHealthAutoExport({
      data: {
        workouts: [
          {
            id: 'workout-1',
            name: 'Cycling',
            start: '2026-08-02 07:30:00 -0700',
            end: '2026-08-02 08:30:00 -0700',
            duration: 3600,
            isIndoor: false,
            distance: { qty: 40, units: 'km' },
            elevationUp: { qty: 500, units: 'm' },
            avgSpeed: { qty: 40, units: 'kmph' },
            heartRate: { avg: { qty: 148, units: 'bpm' } },
            cyclingPower: [
              { date: '2026-08-02 07:30:00 -0700', qty: 190, units: 'W', source: 'Garmin' },
              { date: '2026-08-02 07:31:00 -0700', qty: 210, units: 'W', source: 'Garmin' },
            ],
          },
        ],
      },
    })

    expect(activities).toHaveLength(1)
    expect(activities[0]).toMatchObject({
      guid: 'workout-1',
      type: 'Ride',
      pubDate: '2026-08-02T14:30:00.000Z',
      Distance: '24.85 mi',
      ElevationGain: '1640.42 ft',
      MovingTime: '01:00:00',
      AverageSpeed: '24.85 mph',
      AverageHeartRate: 148,
      AverageWatts: 200,
    })
  })

  it('classifies indoor cycling as Zwift and computes speed from distance', () => {
    const [activity] = parseHealthAutoExport({
      data: {
        workouts: [
          {
            id: 'workout-2',
            name: 'Indoor Cycling',
            start: '2026-08-02 12:00:00 +0000',
            end: '2026-08-02 12:30:00 +0000',
            duration: 1800,
            isIndoor: true,
            distance: { qty: 10, units: 'mi' },
          },
        ],
      },
    })

    expect(activity.type).toBe('Zwift')
    expect(activity.AverageSpeed).toBe('20.00 mph')
  })

  it('rejects payloads that are not workout exports', () => {
    expect(() => parseHealthAutoExport({ metrics: [] })).toThrow(
      'Expected a Health Auto Export payload with a data.workouts array'
    )
  })

  it('rejects malformed optional metrics instead of silently dropping them', () => {
    expect(() =>
      parseHealthAutoExport({
        data: {
          workouts: [
            {
              id: 'workout-3',
              name: 'Running',
              start: '2026-08-02 12:00:00 +0000',
              duration: 1800,
              distance: { qty: -1, units: 'mi' },
            },
          ],
        },
      })
    ).toThrow('Invalid distance')
  })

  it('rejects unsupported units', () => {
    expect(() =>
      parseHealthAutoExport({
        data: {
          workouts: [
            {
              id: 'workout-4',
              name: 'Running',
              start: '2026-08-02 12:00:00 +0000',
              duration: 1800,
              distance: { qty: 5, units: 'league' },
            },
          ],
        },
      })
    ).toThrow('Unsupported distance unit: league')
  })

  it('stores only geofenced encoded route segments', () => {
    const [activity] = parseHealthAutoExport(
      {
        data: {
          workouts: [
            {
              id: 'workout-5',
              name: 'Outdoor Cycling',
              start: '2026-08-02 12:00:00 +0000',
              duration: 1800,
              route: [
                { latitude: 0, longitude: -0.01 },
                { latitude: 0, longitude: -0.008 },
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 0.008 },
                { latitude: 0, longitude: 0.01 },
              ],
            },
          ],
        },
      },
      [{ latitude: 0, longitude: 0, radiusMeters: 500 }]
    )

    expect(activity.RoutePolylines).toHaveLength(2)
    expect(activity).not.toHaveProperty('route')
  })

  it('refuses route data when no privacy zone is configured', () => {
    expect(() =>
      parseHealthAutoExport({
        data: {
          workouts: [
            {
              id: 'workout-6',
              name: 'Running',
              start: '2026-08-02 12:00:00 +0000',
              duration: 1800,
              route: [
                { latitude: 0, longitude: 0 },
                { latitude: 0, longitude: 0.01 },
              ],
            },
          ],
        },
      })
    ).toThrow('Route data requires FITNESS_PRIVACY_ZONES')
  })
})
