import type { NextApiRequest, NextApiResponse } from 'next'

import { getAllActivities } from '../../../lib/fitness/server/activityRepository'
import { isAuthorized } from '../../../lib/fitness/server/isAuthorized'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Allow', 'GET')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.CRON_SECRET
  if (!secret || secret.length < 32 || !process.env.REDIS_URL) {
    return res.status(503).json({ error: 'Fitness storage is not configured' })
  }
  if (!isAuthorized(req.headers.authorization, secret)) return res.status(401).json({ error: 'Unauthorized' })

  const { limit = '5' } = req.query
  if (typeof limit !== 'string' || !/^[1-9]\d*$/.test(limit) || !Number.isSafeInteger(Number(limit))) {
    return res.status(400).json({ error: 'limit must be a positive integer' })
  }
  try {
    return res.status(200).json({ activities: await getAllActivities(Number(limit)) })
  } catch {
    return res.status(503).json({ error: 'Unable to read fitness activities' })
  }
}
