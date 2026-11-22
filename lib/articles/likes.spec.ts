// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { redisClient } from '../../db/redis'
import { getLikes, incrementLikes } from './likes'

// Only the build job (or an explicitly local Redis) runs the storage contract.
const redisUrl = process.env.REDIS_URL
const localRedis = redisUrl && ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(redisUrl).hostname)

describe.skipIf(!localRedis)('article likes with Redis', () => {
  const id = randomUUID()
  const legacyId = randomUUID()
  beforeAll(() => redisClient.connect())

  afterAll(async () => {
    if (!redisClient.isReady) return
    try {
      await redisClient.del([`likes:${id}`, `likes:${legacyId}`])
    } finally {
      await redisClient.close()
    }
  })

  it('counts each concurrent like exactly once', async () => {
    expect(await getLikes(id)).toBe(0)
    const counts = await Promise.all(Array.from({ length: 32 }, () => incrementLikes(id)))
    expect(counts.toSorted((a, b) => a - b)).toEqual(Array.from({ length: 32 }, (_, i) => i + 1))
    expect(await getLikes(id)).toBe(32)
  })

  it('still increments numeric strings and recovers unreadable counts', async () => {
    const key = `likes:${legacyId}`
    for (const [stored, expected] of [
      ['002', 3],
      ['2.5', 3.5],
      ['not-a-count', 1],
      ['NaN', 1],
    ] as const) {
      await redisClient.set(key, stored, { expiration: { type: 'EX', value: 60 } })
      expect(await incrementLikes(legacyId)).toBe(expected)
      expect(await getLikes(legacyId)).toBe(expected)
      expect(await redisClient.ttl(key)).toBe(-1)
    }
  })
})
