import dayjs from 'dayjs'
import { LineScore, ScheduleGame, TeamInfo } from './types'

// Small cache to avoid refetching team dictionary frequently
const teamCache: { list: TeamInfo[] | null } = { list: null }

export async function fetchTeams(): Promise<TeamInfo[]> {
  if (teamCache.list) return teamCache.list
  const res = await fetch('https://statsapi.mlb.com/api/v1/teams?sportId=1')
  const json = await res.json()
  const list: TeamInfo[] = json.teams.map((t: any) => ({
    id: t.id,
    name: t.name,
    teamCode: t.abbreviation,
  }))
  teamCache.list = list
  return list
}

export function resolveTeamId(identifier: string, teams: TeamInfo[]): number | null {
  const id = parseInt(identifier, 10)
  if (!Number.isNaN(id)) return id
  const lowered = identifier.toLowerCase()
  const match = teams.find((t) => t.teamCode.toLowerCase() === lowered || t.name.toLowerCase().includes(lowered))
  return match ? match.id : null
}

export async function fetchSchedule(teamId: number): Promise<ScheduleGame[]> {
  const start = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  const end = dayjs().add(7, 'day').format('YYYY-MM-DD')
  const url = `https://statsapi.mlb.com/api/v1/schedule?teamId=${teamId}&sportId=1&startDate=${start}&endDate=${end}&hydrate=linescore`
  const res = await fetch(url)
  const json = await res.json()
  const dates = json.dates as { games: ScheduleGame[] }[]
  return dates.flatMap((d) => d.games)
}

export async function fetchLineScore(gamePk: number): Promise<LineScore | null> {
  const res = await fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/linescore`)
  if (!res.ok) return null
  return res.json()
}
