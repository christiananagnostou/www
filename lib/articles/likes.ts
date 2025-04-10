import { connectRedis, redisClient } from '../../db/redis'

export async function getLikes(articleId: string): Promise<number> {
  await connectRedis()
  const key = `likes:${articleId}`
  const likes = await redisClient.get(key)
  return Number(likes) || 0
}

export async function incrementLikes(articleId: string): Promise<number> {
  await connectRedis()
  const key = `likes:${articleId}`
  const currentLikes = await redisClient.get(key)
  const newLikes = (Number(currentLikes) || 0) + 1
  await redisClient.set(key, newLikes)
  return newLikes
}
