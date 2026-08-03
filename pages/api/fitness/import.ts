import { timingSafeEqual } from 'node:crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import { HealthAutoExportPayloadError, parseHealthAutoExport } from '../../../lib/fitness/providers/healthAutoExport'
import { saveActivities } from '../../../lib/fitness/server/activityRepository'

interface ImportResponse {
  received: number
  saved: number
}

interface ErrorResponse {
  error: string
}

class ImportRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

const isAuthorized = (authorization: string | undefined, expectedToken: string) => {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  const actual = Buffer.from(token)
  const expected = Buffer.from(expectedToken)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

const MAX_BODY_BYTES = 4 * 1024 * 1024

const readJsonBody = async (req: NextApiRequest): Promise<unknown> => {
  if (!req.headers['content-type']?.toLowerCase().includes('application/json')) {
    throw new ImportRequestError('Content-Type must be application/json', 415)
  }

  const contentLength = Number(req.headers['content-length'])
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new ImportRequestError('Request body is too large', 413)
  }

  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new ImportRequestError('Request body is too large', 413)
    chunks.push(buffer)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw new ImportRequestError('Request body must contain valid JSON', 400)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ImportResponse | ErrorResponse>) {
  res.setHeader('Allow', 'POST')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const importToken = process.env.FITNESS_IMPORT_TOKEN
  if (!importToken || importToken.length < 32) {
    return res.status(503).json({ error: 'Fitness import is not configured' })
  }
  if (!isAuthorized(req.headers.authorization, importToken)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const activities = parseHealthAutoExport(await readJsonBody(req))
    const saved = await saveActivities(activities)
    if (saved > 0) {
      const revalidations = await Promise.allSettled([res.revalidate('/'), res.revalidate('/fitness')])
      const failedRevalidations = revalidations.filter((result) => result.status === 'rejected')
      if (failedRevalidations.length) {
        console.error(`Failed to revalidate ${failedRevalidations.length} fitness page(s)`)
      }
    }
    return res.status(200).json({ received: activities.length, saved })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to import workouts'
    const status =
      error instanceof ImportRequestError ? error.status : error instanceof HealthAutoExportPayloadError ? 400 : 500
    if (status === 500) console.error('Failed to import fitness activities', message)
    return res.status(status).json({ error: status < 500 ? message : 'Unable to import workouts' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
