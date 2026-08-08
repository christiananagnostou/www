import type { ScheduleGame, TeamInfo } from './types'

const TEAM_COLORS: Record<number, string> = {
  108: '#ba0021',
  109: '#a71930',
  110: '#df4601',
  111: '#bd3039',
  112: '#0e3386',
  113: '#c6011f',
  114: '#e31937',
  115: '#33006f',
  116: '#0c2340',
  117: '#002d62',
  118: '#004687',
  119: '#005a9c',
  120: '#ba0c2f',
  121: '#002d72',
  133: '#003831',
  134: '#fdb827',
  135: '#362415',
  136: '#005c5c',
  137: '#fd5a1e',
  138: '#c41e3a',
  139: '#092c5c',
  140: '#003278',
  141: '#134a8e',
  142: '#002b5c',
  143: '#e81828',
  144: '#ce1141',
  145: '#27251f',
  146: '#00a3e0',
  147: '#003087',
  158: '#192f50',
}

const TEAM_ABBREVIATIONS: Record<number, string> = {
  108: 'LAA',
  109: 'ARI',
  110: 'BAL',
  111: 'BOS',
  112: 'CHC',
  113: 'CIN',
  114: 'CLE',
  115: 'COL',
  116: 'DET',
  117: 'HOU',
  118: 'KC',
  119: 'LAD',
  120: 'WSH',
  121: 'NYM',
  133: 'ATH',
  134: 'PIT',
  135: 'SD',
  136: 'SEA',
  137: 'SF',
  138: 'STL',
  139: 'TB',
  140: 'TEX',
  141: 'TOR',
  142: 'MIN',
  143: 'PHI',
  144: 'ATL',
  145: 'CWS',
  146: 'MIA',
  147: 'NYY',
  158: 'MIL',
}

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

export function getTeamColor(teamId: number) {
  return TEAM_COLORS[teamId] ?? '#303030'
}

export function getTeamAbbreviation(teamId: number, name: string) {
  const abbreviation = TEAM_ABBREVIATIONS[teamId]
  if (abbreviation) return abbreviation

  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

export function rgba(hex: string, alpha: number) {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function createGradient(from: string, to: string, fromAlpha: number, toAlpha: number) {
  return `linear-gradient(135deg, ${rgba(from, fromAlpha)} 0%, ${rgba(to, toAlpha)} 100%)`
}

export function createGameGradient(awayColor: string, homeColor: string) {
  return `${createGradient(awayColor, homeColor, 0.45, 0.45)}, linear-gradient(45deg, ${rgba(
    awayColor,
    0.45
  )} 10%, ${rgba(homeColor, 0.45)} 100%)`
}
