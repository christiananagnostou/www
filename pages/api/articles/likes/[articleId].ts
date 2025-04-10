import type { NextApiRequest, NextApiResponse } from 'next'
import { getLikes, incrementLikes } from '../../../../lib/articles/likes'

type LikesResponse = { likes: number }
type ErrorResponse = { error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<LikesResponse | ErrorResponse>) {
  const { articleId } = req.query as { articleId: string }

  if (!articleId) {
    return res.status(400).json({ error: 'Article ID is required' })
  }

  try {
    if (req.method === 'GET') {
      const likes = await getLikes(articleId)
      return res.status(200).json({ likes })
    }

    if (req.method === 'POST') {
      const newLikes = await incrementLikes(articleId)
      return res.status(200).json({ likes: newLikes })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Error handling likes:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
