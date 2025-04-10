import { createClient } from 'redis'

// Create Redis client (cached for reuse across requests)
export const redisClient = createClient({ url: process.env.REDIS_URL })

redisClient.on('error', (err) => console.error('Redis Client Error', err))

// Ensure client connects (only once in serverless env)
let isConnected = false
export async function connectRedis() {
  if (!isConnected) {
    await redisClient.connect()
    isConnected = true
  }
}
