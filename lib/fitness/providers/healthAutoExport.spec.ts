import { describe, expect, it } from 'vitest'

import { parseHealthAutoExport } from './healthAutoExport'

describe('parseHealthAutoExport', () => {
  it('maps a Version 2 cycling workout to the canonical activity model', () => {
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
            heartRate: { avg: { qty: 148, units: 'bpm' } },
            cyclingPower: [
              { date: '2026-08-02 07:30:00 -0700', qty: 190, units: 'W', source: 'Garmin' },
              { date: '2026-08-02 07:31:00 -0700', qty: 210, units: 'W', source: 'Garmin' },
            ],
          },
        ],
      },
    })

    expect(activities).toEqual([
      {
        id: 'health-auto-export:workout-1',
        startedAt: '2026-08-02T14:30:00.000Z',
        endedAt: '2026-08-02T15:30:00.000Z',
        kind: 'cycle',
        indoor: false,
        durationSeconds: 3600,
        distanceMeters: 40000,
        elevationGainMeters: 500,
        averageHeartRateBpm: 148,
        averagePowerWatts: 200,
      },
    ])
  })

  it('classifies indoor cycling without persisting a vendor-specific activity kind', () => {
    const [activity] = parseHealthAutoExport({
      data: {
        workouts: [
          {
            id: 'workout-2',
            name: 'Indoor Cycling',
            start: '2026-08-02 12:00:00 +0000',
            duration: 1800,
            isIndoor: true,
            distance: { qty: 10, units: 'mi' },
          },
        ],
      },
    })

    expect(activity).toMatchObject({
      kind: 'cycle',
      indoor: true,
      distanceMeters: 16093.44,
      endedAt: '2026-08-02T12:30:00.000Z',
    })
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

  it('rejects quantities large enough to overflow canonical measurements', () => {
    expect(() =>
      parseHealthAutoExport({
        data: {
          workouts: [
            {
              id: 'workout-5',
              name: 'Running',
              start: '2026-08-02 12:00:00 +0000',
              duration: 1800,
              distance: { qty: 1e308, units: 'mi' },
            },
          ],
        },
      })
    ).toThrow('Invalid distance')
  })
})
