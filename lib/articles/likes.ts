import { connectRedis, redisClient } from '../../db/redis'

const parseLikes = (value: string | null) => Number(value) || 0

// Up to 15 decimal digits are exact in both Lua and JavaScript.
// Other strings go back to JS; commit its result only if the stored value still matches.
const INCREMENT_LIKES = `
  local current = redis.call('GET', KEYS[1]) or '0'
  local updated
  if current == ARGV[1] then
    updated = ARGV[2]
  elseif #current <= 15 and current:match('^%d+$') then
    updated = string.format('%.0f', tonumber(current) + 1)
  else
    return {current}
  end
  redis.call('SET', KEYS[1], updated)
  return updated
`

export async function getLikes(articleId: string): Promise<number> {
  try {
    const isConnected = await connectRedis()
    if (!isConnected) return 0
    const key = `likes:${articleId}`
    const likes = await redisClient.get(key)
    return parseLikes(likes)
  } catch {
    return 0
  }
}

export async function incrementLikes(articleId: string): Promise<number> {
  try {
    const isConnected = await connectRedis()
    if (!isConnected) return 0
    const keys = [`likes:${articleId}`]
    let compareAndSet: string[] = []
    for (;;) {
      const result = await redisClient.eval(INCREMENT_LIKES, { keys, arguments: compareAndSet })
      if (!Array.isArray(result)) return Number(result)
      const current = String(result[0])
      compareAndSet = [current, String(parseLikes(current) + 1)]
    }
  } catch {
    return 0
  }
}
