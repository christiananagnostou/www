import { connectRedis, redisClient } from '../../db/redis'

// Plain INCR rejects legacy numeric strings, and leaves unreadable counts stuck.
const INCREMENT_LIKES = `
  local count = tonumber(redis.call('GET', KEYS[1]))
  if not count or count ~= count then count = 0 end
  local nextCount = string.format('%.17g', count + 1)
  redis.call('SET', KEYS[1], nextCount)
  return nextCount
`

export async function getLikes(articleId: string): Promise<number> {
  try {
    const isConnected = await connectRedis()
    if (!isConnected) return 0
    const key = `likes:${articleId}`
    const likes = await redisClient.get(key)
    return Number(likes) || 0
  } catch {
    return 0
  }
}

export async function incrementLikes(articleId: string): Promise<number> {
  try {
    const isConnected = await connectRedis()
    if (!isConnected) return 0
    return Number(await redisClient.eval(INCREMENT_LIKES, { keys: [`likes:${articleId}`] }))
  } catch {
    return 0
  }
}
