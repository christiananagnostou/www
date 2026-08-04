import type { NextApiRequest, NextApiResponse } from 'next'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const sync = vi.hoisted(() => ({ syncRecentActivities: vi.fn() }))

vi.mock('./syncActivities', () => sync)

import handler from '../../../pages/api/fitness/sync'

const originalCronSecret = process.env.CRON_SECRET
const originalApiKey = process.env.INTERVALS_ICU_API_KEY
const cronSecret = 'a-secure-fitness-cron-secret-1234567890'

const createRequest = (authorization = `Bearer ${cronSecret}`) =>
  ({ method: 'GET', headers: { authorization } }) as NextApiRequest

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

describe('/api/fitness/sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.CRON_SECRET = cronSecret
    process.env.INTERVALS_ICU_API_KEY = 'intervals-api-key'
  })

  afterAll(() => {
    if (originalCronSecret === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = originalCronSecret
    if (originalApiKey === undefined) delete process.env.INTERVALS_ICU_API_KEY
    else process.env.INTERVALS_ICU_API_KEY = originalApiKey
  })

  it('rejects unauthorized sync requests', async () => {
    const response = createResponse()

    await handler(createRequest('Bearer wrong-token'), response)

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    expect(sync.syncRecentActivities).not.toHaveBeenCalled()
  })

  it('syncs recent activities and revalidates changed pages', async () => {
    const response = createResponse()
    sync.syncRecentActivities.mockResolvedValue({ received: 3, saved: 2, removed: 1 })

    await handler(createRequest(), response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ received: 3, saved: 2, removed: 1 })
    expect(response.revalidate).toHaveBeenCalledTimes(2)
  })

  it('skips revalidation when every activity is unchanged', async () => {
    const response = createResponse()
    sync.syncRecentActivities.mockResolvedValue({ received: 3, saved: 0, removed: 0 })

    await handler(createRequest(), response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.revalidate).not.toHaveBeenCalled()
  })
})
