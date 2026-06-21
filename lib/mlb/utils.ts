import type { ScheduleGame, TeamInfo } from './types'

export function resolveTeamId(identifier: string | number, teams: TeamInfo[]): number | null {
  const normalizedIdentifier = String(identifier).trim().toLowerCase()

  if (/^\d+$/.test(normalizedIdentifier)) {
    const teamId = Number(normalizedIdentifier)
    return teams.some(({ id }) => id === teamId) ? teamId : null
  }

  const exactMatch = teams.find(
    ({ name, teamCode }) =>
      teamCode.toLowerCase() === normalizedIdentifier || name.toLowerCase() === normalizedIdentifier
  )
  const partialMatch = teams.find(({ name }) => name.toLowerCase().includes(normalizedIdentifier))

  return exactMatch?.id ?? partialMatch?.id ?? null
}

export function partitionSchedule(games: ScheduleGame[]) {
  const liveGame = games.find(({ status }) => status.abstractGameState === 'Live') ?? null
  const pastGames = games
    .filter(({ status }) => status.abstractGameState === 'Final')
    .toSorted((a, b) => Date.parse(b.gameDate) - Date.parse(a.gameDate))
    .slice(0, 3)
    .toReversed()
  const upcomingGames = games
    .filter(({ status }) => status.abstractGameState === 'Preview')
    .toSorted((a, b) => Date.parse(a.gameDate) - Date.parse(b.gameDate))
    .slice(0, 3)

  return { liveGame, pastGames, upcomingGames }
}
