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

import { getActivitiesSince, getLatestActivities, saveActivities } from './activityRepository'

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
      keys: ['fitness:v2:activity:activity-1', 'fitness:v2:activities'],
      arguments: [JSON.stringify(activity), String(Date.parse(activity.startedAt)), activity.id],
    })
  })

  it('skips unchanged activities', async () => {
    redis.exec.mockResolvedValue([0])

    await expect(saveActivities([activity])).resolves.toBe(0)
  })

  it('bounds latest activity queries', async () => {
    const secondActivity = { ...activity, id: 'activity-2' }
    redis.zRange.mockResolvedValue(['activity-1', 'activity-2'])
    redis.mGet.mockResolvedValue([JSON.stringify(activity), JSON.stringify(secondActivity)])

    await expect(getLatestActivities(5)).resolves.toEqual([activity, secondActivity])

    expect(redis.zRange).toHaveBeenCalledWith('fitness:v2:activities', 0, 99, { REV: true })
  })

  it('continues through the index until it finds enough eligible activities', async () => {
    const excludedActivities = Array.from({ length: 100 }, (_, index) => ({
      ...activity,
      id: `strength-${index}`,
      kind: 'strength' as const,
    }))
    redis.zRange.mockResolvedValueOnce(excludedActivities.map(({ id }) => id)).mockResolvedValueOnce([activity.id])
    redis.mGet
      .mockResolvedValueOnce(excludedActivities.map((excludedActivity) => JSON.stringify(excludedActivity)))
      .mockResolvedValueOnce([JSON.stringify(activity)])

    await expect(getLatestActivities(1, ['cycle'])).resolves.toEqual([activity])

    expect(redis.zRange).toHaveBeenNthCalledWith(2, 'fitness:v2:activities', 100, 199, { REV: true })
  })

  it('isolates invalid stored records', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    redis.zRange.mockResolvedValue(['invalid'])
    redis.mGet.mockResolvedValue(['{"id":"invalid"}'])

    await expect(getLatestActivities(5)).resolves.toEqual([])
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

    expect(redis.zRangeByScore).toHaveBeenCalledWith('fitness:v2:activities', since.getTime(), '+inf')
  })
})
