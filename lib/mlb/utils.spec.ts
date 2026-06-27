import { describe, expect, it } from 'vitest'

import type { ScheduleGame, TeamInfo } from './types'
import { partitionSchedule, resolveTeamId } from './utils'

const teams: TeamInfo[] = [
  { id: 133, name: 'Athletics', teamCode: 'ATH' },
  { id: 137, name: 'San Francisco Giants', teamCode: 'SF' },
]

function game(gamePk: number, gameDate: string, abstractGameState: string): ScheduleGame {
  return {
    gamePk,
    gameDate,
    status: { abstractGameState, detailedState: abstractGameState },
    teams: {
      away: { team: { id: 133, name: 'Athletics' } },
      home: { team: { id: 137, name: 'San Francisco Giants' } },
    },
  }
}

describe('resolveTeamId', () => {
  it.each([
    ['137', 137],
    [' SF ', 137],
    ['san francisco giants', 137],
    ['Giants', 137],
  ])('resolves %s to %s', (identifier, expectedId) => {
    expect(resolveTeamId(identifier, teams)).toBe(expectedId)
  })

  it.each(['137abc', '999', 'unknown'])('rejects invalid identifier %s', (identifier) => {
    expect(resolveTeamId(identifier, teams)).toBeNull()
  })
})

describe('partitionSchedule', () => {
  it('sorts and limits final and preview games while preserving the live game', () => {
    const games = [
      game(1, '2026-06-01T19:00:00Z', 'Final'),
      game(2, '2026-06-02T19:00:00Z', 'Final'),
      game(3, '2026-06-03T19:00:00Z', 'Final'),
      game(4, '2026-06-04T19:00:00Z', 'Final'),
      game(5, '2026-06-05T19:00:00Z', 'Live'),
      game(6, '2026-06-08T19:00:00Z', 'Preview'),
      game(7, '2026-06-07T19:00:00Z', 'Preview'),
      game(8, '2026-06-09T19:00:00Z', 'Preview'),
      game(9, '2026-06-10T19:00:00Z', 'Preview'),
    ]

    const result = partitionSchedule(games)

    expect(result.liveGame?.gamePk).toBe(5)
    expect(result.pastGames.map(({ gamePk }) => gamePk)).toEqual([2, 3, 4])
    expect(result.upcomingGames.map(({ gamePk }) => gamePk)).toEqual([7, 6, 8])
  })
})
