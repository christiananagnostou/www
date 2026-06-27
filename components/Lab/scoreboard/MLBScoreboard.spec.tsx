import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ScheduleGame, TeamInfo } from '../../../lib/mlb/types'

import MLBScoreboard from './MLBScoreboard'

vi.mock('../../../lib/mlb/api', () => ({
  fetchLineScore: vi.fn().mockResolvedValue(null),
  fetchLiveSchedule: vi.fn().mockResolvedValue([]),
  fetchSchedule: vi.fn().mockResolvedValue([]),
  fetchTeams: vi.fn().mockResolvedValue([]),
}))

const teams: TeamInfo[] = [
  { id: 133, name: 'Athletics', teamCode: 'ATH' },
  { id: 137, name: 'San Francisco Giants', teamCode: 'SF' },
]

const games: ScheduleGame[] = [
  {
    gamePk: 1,
    gameDate: '2026-06-25T19:00:00Z',
    status: { abstractGameState: 'Final', detailedState: 'Final' },
    teams: {
      away: { score: 2, team: { id: 133, name: 'Athletics' } },
      home: { score: 4, team: { id: 137, name: 'San Francisco Giants' } },
    },
  },
  {
    gamePk: 2,
    gameDate: '2026-06-26T19:00:00Z',
    status: { abstractGameState: 'Live', detailedState: 'In Progress' },
    teams: {
      away: { score: 1, team: { id: 137, name: 'San Francisco Giants' } },
      home: { score: 0, team: { id: 133, name: 'Athletics' } },
    },
  },
]

afterEach(cleanup)

describe('MLBScoreboard', () => {
  it('keeps a ribbon game selected when another game is live', async () => {
    render(<MLBScoreboard defaultTeam={137} initialGames={games} initialTeams={teams} hasInitialSchedule />)

    const ribbon = screen.getByRole('navigation', { name: 'Games' })
    const gameButtons = within(ribbon).getAllByRole('button')

    expect(gameButtons[1].getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(gameButtons[0])

    await waitFor(() => expect(gameButtons[0].getAttribute('aria-pressed')).toBe('true'))
    expect(gameButtons[1].getAttribute('aria-pressed')).toBe('false')
  })
})
