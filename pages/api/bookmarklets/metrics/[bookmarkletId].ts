import type { NextApiRequest, NextApiResponse } from 'next'
import { bookmarkletsData } from '../../../../lib/bookmarklets'
import { type BookmarkletMetrics, getMetrics, incrementInstalls } from '../../../../lib/bookmarklets/metrics'

type MetricsResponse = BookmarkletMetrics
interface ErrorResponse {
  error: string
}

const allowedBookmarkletIds = new Set(bookmarkletsData.map((bookmarklet) => bookmarklet.id))

const getClientToken = (req: NextApiRequest) => {
  const forwardedFor = req.headers['x-forwarded-for']
  const raw = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
  return (raw || req.socket.remoteAddress || '').split(',')[0].trim()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MetricsResponse | ErrorResponse>) {
  // Add CORS headers to allow bookmarklet requests from any domain (for installs tracking)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { bookmarkletId, type } = req.query as { bookmarkletId?: string | string[]; type?: string }
  const resolvedId = Array.isArray(bookmarkletId) ? bookmarkletId[0] : bookmarkletId
  const normalizedId = resolvedId?.trim()

  if (!normalizedId) {
    return res.status(400).json({ error: 'Bookmarklet ID is required' })
  }

  if (!allowedBookmarkletIds.has(normalizedId)) {
    return res.status(404).json({ error: 'Bookmarklet ID is not recognized' })
  }

  try {
    if (req.method === 'GET') {
      const metrics = await getMetrics(normalizedId)
      return res.status(200).json(metrics)
    }

    if (req.method === 'POST') {
      if (!type) {
        return res.status(400).json({ error: 'Type parameter is required for POST requests (installs)' })
      }

      if (type === 'installs') {
        const clientToken = getClientToken(req)
        await incrementInstalls(normalizedId, clientToken || undefined)
        const updatedMetrics = await getMetrics(normalizedId)
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
