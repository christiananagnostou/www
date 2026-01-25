import { connectRedis, redisClient } from '../../db/redis'

export interface BookmarkletMetrics {
  installs: number
}

const getInstallsKey = (bookmarkletId: string) => `bookmarklet:${bookmarkletId}:installs`
const getDedupeKey = (bookmarkletId: string, token: string) => `bookmarklet:${bookmarkletId}:installs:dedupe:${token}`

export async function getMetrics(bookmarkletId: string): Promise<BookmarkletMetrics> {
  await connectRedis()
  const installs = await redisClient.get(getInstallsKey(bookmarkletId))
  return { installs: Number(installs) || 0 }
}

export async function incrementInstalls(bookmarkletId: string, dedupeToken?: string): Promise<number> {
  await connectRedis()

  if (dedupeToken) {
    const dedupeKey = getDedupeKey(bookmarkletId, dedupeToken)
    const didSet = await redisClient.set(dedupeKey, '1', { EX: 60 * 60 * 24, NX: true })
    if (!didSet) {
      return getInstalls(bookmarkletId)
    }
  }

  return redisClient.incr(getInstallsKey(bookmarkletId))
}

// For backward compatibility - get just installs
export async function getInstalls(bookmarkletId: string): Promise<number> {
  await connectRedis()
  const installs = await redisClient.get(getInstallsKey(bookmarkletId))
  return Number(installs) || 0
}
