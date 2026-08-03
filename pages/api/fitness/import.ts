import { timingSafeEqual } from 'node:crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  FitnessPayloadError,
  parseHealthAutoExport,
  parsePrivacyZones,
  saveFitnessActivities,
} from '../../../lib/fitness'

interface ImportResponse {
  imported: number
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ImportResponse | ErrorResponse>) {
  res.setHeader('Allow', 'POST')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const importToken = process.env.FITNESS_IMPORT_TOKEN
  if (!importToken) return res.status(503).json({ error: 'Fitness import is not configured' })
  if (!isAuthorized(req.headers.authorization, importToken)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const privacyZones = parsePrivacyZones(process.env.FITNESS_PRIVACY_ZONES)
    const activities = parseHealthAutoExport(req.body, privacyZones)
    const imported = await saveFitnessActivities(activities)
    const revalidations = await Promise.allSettled([res.revalidate('/'), res.revalidate('/fitness')])
    const failedRevalidations = revalidations.filter((result) => result.status === 'rejected')
    if (failedRevalidations.length) {
      console.error(`Failed to revalidate ${failedRevalidations.length} fitness page(s)`)
    }
    return res.status(200).json({ imported })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to import workouts'
    const status = error instanceof FitnessPayloadError ? 400 : 500
    console.error('Failed to import fitness activities', message)
    return res.status(status).json({ error: status === 400 ? message : 'Unable to import workouts' })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}
