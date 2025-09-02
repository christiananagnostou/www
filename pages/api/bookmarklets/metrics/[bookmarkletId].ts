import type { NextApiRequest, NextApiResponse } from 'next'
import { getMetrics, incrementInstalls, type BookmarkletMetrics } from '../../../../lib/bookmarklets/metrics'

type MetricsResponse = BookmarkletMetrics
type ErrorResponse = { error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<MetricsResponse | ErrorResponse>) {
  // Add CORS headers to allow bookmarklet requests from any domain (for installs tracking)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { bookmarkletId, type } = req.query as { bookmarkletId: string; type?: string }

  if (!bookmarkletId) {
    return res.status(400).json({ error: 'Bookmarklet ID is required' })
  }

  try {
    if (req.method === 'GET') {
      const metrics = await getMetrics(bookmarkletId)
      return res.status(200).json(metrics)
    }

    if (req.method === 'POST') {
      if (!type) {
        return res.status(400).json({ error: 'Type parameter is required for POST requests (installs)' })
      }

      if (type === 'installs') {
        await incrementInstalls(bookmarkletId)
        const updatedMetrics = await getMetrics(bookmarkletId)
        return res.status(200).json(updatedMetrics)
      } else {
        return res.status(400).json({ error: 'Type must be "installs"' })
      }
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Error handling bookmarklet metrics:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
