import { timingSafeEqual } from 'node:crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import { syncRecentActivities } from '../../../lib/fitness/server/syncActivities'

interface SyncResponse {
  received: number
  saved: number
}

interface ErrorResponse {
  error: string
}

const isAuthorized = (authorization: string | undefined, expectedToken: string) => {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  const actual = Buffer.from(token)
  const expected = Buffer.from(expectedToken)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SyncResponse | ErrorResponse>) {
  res.setHeader('Allow', 'GET')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || cronSecret.length < 32 || !process.env.INTERVALS_ICU_API_KEY) {
    return res.status(503).json({ error: 'Fitness sync is not configured' })
  }
  if (!isAuthorized(req.headers.authorization, cronSecret)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const result = await syncRecentActivities()
    if (result.saved > 0) {
      const revalidations = await Promise.allSettled([res.revalidate('/'), res.revalidate('/fitness')])
      const failedRevalidations = revalidations.filter((revalidation) => revalidation.status === 'rejected')
      if (failedRevalidations.length) {
        console.error(`Failed to revalidate ${failedRevalidations.length} fitness page(s)`)
      }
    }
    return res.status(200).json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown fitness sync error'
    console.error('Failed to sync fitness activities', message)
    return res.status(502).json({ error: 'Unable to sync fitness activities' })
  }
}
