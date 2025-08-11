import { connectRedis, redisClient } from '../../db/redis'

export interface BookmarkletMetrics {
  installs: number
}

export async function getMetrics(bookmarkletId: string): Promise<BookmarkletMetrics> {
  await connectRedis()
  const installsKey = `bookmarklet:${bookmarkletId}:installs`
  const installs = await redisClient.get(installsKey)
  return { installs: Number(installs) || 0 }
}

export async function incrementInstalls(bookmarkletId: string): Promise<number> {
  await connectRedis()
  const key = `bookmarklet:${bookmarkletId}:installs`
  const currentInstalls = await redisClient.get(key)
  const newInstalls = (Number(currentInstalls) || 0) + 1
  await redisClient.set(key, newInstalls)
  return newInstalls
}

// For backward compatibility - get just installs
export async function getInstalls(bookmarkletId: string): Promise<number> {
  await connectRedis()
  const key = `bookmarklet:${bookmarkletId}:installs`
  const installs = await redisClient.get(key)
  return Number(installs) || 0
}
