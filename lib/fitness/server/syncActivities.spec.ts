import { beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ fetchIntervalsIcuActivities: vi.fn() }))
const repository = vi.hoisted(() => ({ saveActivities: vi.fn() }))

vi.mock('../providers/intervalsIcu', () => provider)
vi.mock('./activityRepository', () => repository)

import { syncRecentActivities } from './syncActivities'

describe('syncRecentActivities', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches a recent overlap window and saves the returned activities', async () => {
    const activities = [{ id: 'intervals-icu:activity-1' }]
    provider.fetchIntervalsIcuActivities.mockResolvedValue(activities)
    repository.saveActivities.mockResolvedValue(1)

    await expect(syncRecentActivities(new Date('2026-08-03T12:00:00.000Z'))).resolves.toEqual({
      received: 1,
      saved: 1,
    })

    expect(provider.fetchIntervalsIcuActivities).toHaveBeenCalledWith({
      oldest: '2024-07-24',
      newest: '2026-08-04',
    })
    expect(repository.saveActivities).toHaveBeenCalledWith(activities)
  })
})
