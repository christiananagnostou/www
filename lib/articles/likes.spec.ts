// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { redisClient } from '../../db/redis'
import { getLikes, incrementLikes } from './likes'

// Only the build job (or an explicitly local Redis) runs the storage contract.
const redisUrl = process.env.REDIS_URL
const localRedis = redisUrl && ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(redisUrl).hostname)

describe.skipIf(!localRedis)('article likes with Redis', () => {
  const id = randomUUID()
  const key = `likes:${id}`
  beforeAll(() => redisClient.connect())
  beforeEach(() => redisClient.del(key))

  afterAll(async () => {
    if (!redisClient.isReady) return
    try {
      await redisClient.del(key)
    } finally {
      await redisClient.close()
    }
  })

  it.each([
    [null, 0],
    ['0b10', 2],
    ['2.5', 2.5],
  ] as const)('counts simultaneous likes once starting from %s', async (stored, initial) => {
    if (stored !== null) await redisClient.set(key, stored)
    expect(await getLikes(id)).toBe(initial)
    const counts = await Promise.all(Array.from({ length: 32 }, () => incrementLikes(id)))
    expect(counts.toSorted((a, b) => a - b)).toEqual(Array.from({ length: 32 }, (_, i) => initial + i + 1))
    expect(await getLikes(id)).toBe(initial + 32)
  })

  it('still increments numeric strings and recovers unreadable counts', async () => {
    for (const [stored, expected] of [
      ['002', 3],
      ['2.5', 3.5],
      ['not-a-count', 1],
      ['NaN', 1],
      ['inf', 1],
      ['0b10', 3],
      ['999999999999999', 1e15],
    ] as const) {
      await redisClient.set(key, stored, { expiration: { type: 'EX', value: 60 } })
      expect(await incrementLikes(id)).toBe(expected)
      expect(await getLikes(id)).toBe(expected)
      expect(await redisClient.ttl(key)).toBe(-1)
      expect(await incrementLikes(id)).toBe(expected + 1)
      expect(await getLikes(id)).toBe(expected + 1)
    }
  })
})
