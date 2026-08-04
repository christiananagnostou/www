import { beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ fetchIntervalsIcuActivities: vi.fn() }))
const repository = vi.hoisted(() => ({ saveActivities: vi.fn(), removeMissingProviderActivities: vi.fn() }))

vi.mock('../providers/intervalsIcu', () => provider)
vi.mock('./activityRepository', () => repository)

import { syncRecentActivities } from './syncActivities'

describe('syncRecentActivities', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches a recent overlap window and saves the returned activities', async () => {
    const activities = [{ id: 'intervals-icu:activity-1' }]
    provider.fetchIntervalsIcuActivities.mockResolvedValue(activities)
    repository.saveActivities.mockResolvedValue(1)
    repository.removeMissingProviderActivities.mockResolvedValue(2)

    await expect(syncRecentActivities(new Date('2026-08-03T12:00:00.000Z'))).resolves.toEqual({
      received: 1,
      saved: 1,
      removed: 2,
    })

    expect(provider.fetchIntervalsIcuActivities).toHaveBeenCalledWith({
      oldest: '2024-08-03',
      newest: '2026-08-04',
    })
    expect(repository.saveActivities).toHaveBeenCalledWith(activities)
    expect(repository.removeMissingProviderActivities).toHaveBeenCalledWith(
      'intervals-icu:',
      new Date('2024-08-03T00:00:00.000Z'),
      new Date('2026-08-04T23:59:59.999Z'),
      ['intervals-icu:activity-1']
    )
  })
})
