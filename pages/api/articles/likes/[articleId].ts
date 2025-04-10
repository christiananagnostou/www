import type { NextApiRequest, NextApiResponse } from 'next'
import { connectRedis, redisClient } from '../../../../db/redis'

type LikesResponse = {
  likes: number
}

type ErrorResponse = {
  error: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<LikesResponse | ErrorResponse>) {
  const { articleId } = req.query as { articleId: string }

  if (!articleId) {
    return res.status(400).json({ error: 'Article ID is required' })
  }

  try {
    await connectRedis()
    const key = `likes:${articleId}`

    if (req.method === 'GET') {
      const likes = await redisClient.get(key)
      return res.status(200).json({ likes: Number(likes) || 0 })
    }

    if (req.method === 'POST') {
      const currentLikes = await redisClient.get(key)
      const newLikes = (Number(currentLikes) || 0) + 1
      await redisClient.set(key, newLikes)
      return res.status(200).json({ likes: newLikes })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Error handling likes:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
