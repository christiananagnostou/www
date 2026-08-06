import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { FitnessActivity } from '../activity'

const redis = vi.hoisted(() => ({
  connect: vi.fn(),
  mGet: vi.fn(),
  zRange: vi.fn(),
  zRangeByScore: vi.fn(),
  eval: vi.fn(),
  exec: vi.fn(),
  multi: vi.fn(),
}))

vi.mock('../../../db/redis', () => ({
  connectRedis: redis.connect,
  redisClient: {
    mGet: redis.mGet,
    zRange: redis.zRange,
    zRangeByScore: redis.zRangeByScore,
    multi: redis.multi,
  },
}))

import { getActivitiesSince, getAllActivities, saveActivities } from './activityRepository'

const activity: FitnessActivity = {
  id: 'activity-1',
  startedAt: '2026-08-02T14:30:00.000Z',
  kind: 'cycle',
  indoor: false,
  durationSeconds: 3600,
  distanceMeters: 40000,
  elevationGainMeters: 500,
  averageHeartRateBpm: 148,
  averagePowerWatts: 200,
}

describe('activityRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    redis.connect.mockResolvedValue(true)
    redis.multi.mockReturnValue({ eval: redis.eval, exec: redis.exec })
    redis.exec.mockResolvedValue([1])
  })

  it('atomically writes changed activities and their index entries', async () => {
    await expect(saveActivities([activity])).resolves.toBe(1)

    expect(redis.eval).toHaveBeenCalledWith(expect.stringContaining("redis.call('GET', KEYS[1])"), {
      keys: ['fitness:activity:activity-1', 'fitness:activity-index'],
      arguments: [JSON.stringify(activity), String(Date.parse(activity.startedAt)), activity.id],
    })
  })

  it('skips unchanged activities', async () => {
    redis.exec.mockResolvedValue([0])

    await expect(saveActivities([activity])).resolves.toBe(0)
  })

  it('loads complete activity history for homepage filters and best metrics', async () => {
    redis.zRange.mockResolvedValue(['activity-1'])
    redis.mGet.mockResolvedValue([JSON.stringify(activity)])

    await expect(getAllActivities()).resolves.toEqual([activity])

    expect(redis.zRange).toHaveBeenCalledWith('fitness:activity-index', 0, -1, { REV: true })
  })

  it('isolates invalid stored records', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    redis.zRange.mockResolvedValue(['invalid'])
    redis.mGet.mockResolvedValue(['{"id":"invalid"}'])

    await expect(getAllActivities()).resolves.toEqual([])
    expect(consoleError).toHaveBeenCalledWith('Ignoring an invalid fitness activity in Redis')

    consoleError.mockRestore()
  })

  it('queries the index by timestamp and returns newest activities first', async () => {
    const newerActivity = {
      ...activity,
      id: 'activity-2',
      startedAt: '2026-08-03T14:30:00.000Z',
    }
    redis.zRangeByScore.mockResolvedValue(['activity-1', 'activity-2'])
    redis.mGet.mockResolvedValue([JSON.stringify(activity), JSON.stringify(newerActivity)])
    const since = new Date('2026-08-01T00:00:00.000Z')

    await expect(getActivitiesSince(since)).resolves.toEqual([newerActivity, activity])

    expect(redis.zRangeByScore).toHaveBeenCalledWith('fitness:activity-index', since.getTime(), '+inf')
  })
})
