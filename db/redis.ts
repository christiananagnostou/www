import { createClient } from 'redis'

// Create Redis client (cached for reuse across requests)
export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 1000,
    reconnectStrategy: false,
  },
})

let hasLoggedRedisError = false
let connectPromise: Promise<boolean> | null = null
let redisUnavailable = false

const logRedisError = (label: string, error: unknown) => {
  if (hasLoggedRedisError) return
  hasLoggedRedisError = true
  const message = error instanceof Error ? error.message : 'Unknown Redis error'
  console.error(label, message)
}

redisClient.on('error', (error) => logRedisError('Redis Client Error', error))

// Ensure client connects (only once in serverless env)
export async function connectRedis(): Promise<boolean> {
  if (!process.env.REDIS_URL || redisUnavailable) return false
  if (redisClient.isOpen) return true
  if (connectPromise) return connectPromise

  connectPromise = redisClient
    .connect()
    .then(() => true)
    .catch((error) => {
      redisUnavailable = true
      logRedisError('Failed to connect to Redis', error)
      return false
    })
    .finally(() => {
      connectPromise = null
    })

  return connectPromise
}
