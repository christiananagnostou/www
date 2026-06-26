import type { LineScore, ScheduleGame, TeamInfo } from './types'

const API_BASE_URL = 'https://statsapi.mlb.com/api/v1'
const SCHEDULE_WINDOW_DAYS = 7

interface TeamsResponse {
  teams: Array<{ id: number; name: string; abbreviation: string }>
}

interface ScheduleResponse {
  dates: Array<{ games: ScheduleGame[] }>
}

let teamsRequest: Promise<TeamInfo[]> | null = null

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`MLB Stats API request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function fetchTeams(): Promise<TeamInfo[]> {
  if (!teamsRequest) {
    teamsRequest = fetchJson<TeamsResponse>(`${API_BASE_URL}/teams?sportId=1`)
      .then(({ teams }) =>
        teams.map(({ id, name, abbreviation }) => ({
          id,
          name,
          teamCode: abbreviation,
        }))
      )
      .catch((error: unknown) => {
        teamsRequest = null
        throw error
      })
  }

  return teamsRequest
}

export async function fetchSchedule(
  teamId: number,
  options: { referenceDate?: Date; signal?: AbortSignal } = {}
): Promise<ScheduleGame[]> {
  const referenceDate = options.referenceDate ?? new Date()
  const startDate = shiftDate(referenceDate, -SCHEDULE_WINDOW_DAYS)
  const endDate = shiftDate(referenceDate, SCHEDULE_WINDOW_DAYS)
  const params = new URLSearchParams({
    teamId: String(teamId),
    sportId: '1',
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    hydrate: 'linescore',
  })
  const { dates } = await fetchJson<ScheduleResponse>(`${API_BASE_URL}/schedule?${params}`, options.signal)

  return dates.flatMap(({ games }) => games)
}

export async function fetchDailySchedule(
  options: { referenceDate?: Date; signal?: AbortSignal } = {}
): Promise<ScheduleGame[]> {
  const referenceDate = options.referenceDate ?? new Date()
  const params = new URLSearchParams({
    sportId: '1',
    date: formatDate(referenceDate),
  })
  const { dates } = await fetchJson<ScheduleResponse>(`${API_BASE_URL}/schedule?${params}`, options.signal)

  return dates.flatMap(({ games }) => games)
}

export function fetchLineScore(gamePk: number, signal?: AbortSignal): Promise<LineScore> {
  return fetchJson<LineScore>(`${API_BASE_URL}/game/${gamePk}/linescore`, signal)
}

function shiftDate(date: Date, days: number) {
  const shiftedDate = new Date(date)
  shiftedDate.setUTCDate(shiftedDate.getUTCDate() + days)
  return shiftedDate
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}
