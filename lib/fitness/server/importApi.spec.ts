import { Readable } from 'node:stream'
import type { NextApiRequest, NextApiResponse } from 'next'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const repository = vi.hoisted(() => ({ saveActivities: vi.fn() }))

vi.mock('./activityRepository', () => repository)

import handler from '../../../pages/api/fitness/import'

const originalImportToken = process.env.FITNESS_IMPORT_TOKEN
const importToken = 'a-secure-fitness-import-token-1234567890'

const createRequest = (body: string, authorization = `Bearer ${importToken}`) =>
  Object.assign(Readable.from([body]), {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      'content-length': String(Buffer.byteLength(body)),
    },
  }) as unknown as NextApiRequest

const createResponse = () => {
  const response = {
    setHeader: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
    revalidate: vi.fn().mockResolvedValue(undefined),
  }
  response.status.mockReturnValue(response)
  return response as unknown as NextApiResponse
}

describe('/api/fitness/import', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.FITNESS_IMPORT_TOKEN = importToken
  })

  afterAll(() => {
    if (originalImportToken === undefined) delete process.env.FITNESS_IMPORT_TOKEN
    else process.env.FITNESS_IMPORT_TOKEN = originalImportToken
  })

  it('rejects unauthorized requests before reading or saving the body', async () => {
    const bodyIterator = vi.fn()
    const request = {
      method: 'POST',
      headers: { authorization: 'Bearer wrong-token' },
      [Symbol.asyncIterator]: bodyIterator,
    } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    expect(bodyIterator).not.toHaveBeenCalled()
    expect(repository.saveActivities).not.toHaveBeenCalled()
  })

  it('imports a valid raw JSON request and revalidates changed pages', async () => {
    const request = createRequest(
      JSON.stringify({
        data: {
          workouts: [
            {
              id: 'workout-1',
              name: 'Running',
              start: '2026-08-02 12:00:00 +0000',
              duration: 1800,
              distance: { qty: 5, units: 'mi' },
            },
          ],
        },
      })
    )
    const response = createResponse()
    repository.saveActivities.mockResolvedValue(1)

    await handler(request, response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ received: 1, saved: 1 })
    expect(response.revalidate).toHaveBeenCalledTimes(2)
  })

  it('returns a client error for malformed JSON', async () => {
    const request = createRequest('{not-json')
    const response = createResponse()

    await handler(request, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ error: 'Request body must contain valid JSON' })
    expect(repository.saveActivities).not.toHaveBeenCalled()
  })

  it('returns 413 before reading a body declared above the size limit', async () => {
    const bodyIterator = vi.fn()
    const request = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${importToken}`,
        'content-type': 'application/json',
        'content-length': String(4 * 1024 * 1024 + 1),
      },
      [Symbol.asyncIterator]: bodyIterator,
    } as unknown as NextApiRequest
    const response = createResponse()

    await handler(request, response)

    expect(response.status).toHaveBeenCalledWith(413)
    expect(response.json).toHaveBeenCalledWith({ error: 'Request body is too large' })
    expect(bodyIterator).not.toHaveBeenCalled()
  })

  it('requires an application/json content type', async () => {
    const request = createRequest('{}')
    delete request.headers['content-type']
    const response = createResponse()

    await handler(request, response)

    expect(response.status).toHaveBeenCalledWith(415)
    expect(response.json).toHaveBeenCalledWith({ error: 'Content-Type must be application/json' })
    expect(repository.saveActivities).not.toHaveBeenCalled()
  })
})
