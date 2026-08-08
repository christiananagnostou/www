import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchLineScore, fetchLiveSchedule, fetchSchedule } from './api'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MLB Stats API', () => {
  it('builds a deterministic schedule window and flattens its games', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ dates: [{ games: [{ gamePk: 1 }] }, { games: [{ gamePk: 2 }] }] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const games = await fetchSchedule(137, { referenceDate: new Date('2026-06-15T12:00:00Z') })

    const requestUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestUrl.searchParams.get('startDate')).toBe('2026-06-08')
    expect(requestUrl.searchParams.get('endDate')).toBe('2026-06-22')
    expect(requestUrl.searchParams.get('teamId')).toBe('137')
    expect(games.map(({ gamePk }) => gamePk)).toEqual([1, 2])
  })

  it('throws a useful error for unsuccessful responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

    await expect(fetchLineScore(123)).rejects.toThrow('status 503')
  })

  it('fetches a two-day league schedule so UTC rollover does not hide live games', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ dates: [{ games: [{ gamePk: 1 }] }] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const games = await fetchLiveSchedule({ referenceDate: new Date('2026-06-15T12:00:00Z') })

    const requestUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestUrl.searchParams.get('startDate')).toBe('2026-06-14')
    expect(requestUrl.searchParams.get('endDate')).toBe('2026-06-15')
    expect(requestUrl.searchParams.get('sportId')).toBe('1')
    expect(requestUrl.searchParams.has('teamId')).toBe(false)
    expect(games.map(({ gamePk }) => gamePk)).toEqual([1])
  })
})
