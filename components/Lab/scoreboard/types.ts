export interface TeamInfo {
  id: number
  name: string
  teamCode: string // three‑letter code (e.g. "SF")
}

export interface LeagueRecord {
  wins: number
  losses: number
  pct: string
}

export interface GameStatus {
  abstractGameState: string
  codedGameState: string
  detailedState: string
  statusCode: string
  startTimeTBD: boolean
  abstractGameCode: string
  reason?: string
}

export interface ScheduleGame {
  gamePk: number
  gameGuid: string
  link: string
  gameType: string
  season: string
  gameDate: string // ISO
  officialDate: string
  status: GameStatus
  teams: {
    away: {
      leagueRecord?: LeagueRecord
      score?: number
      team: { id: number; name: string; link: string }
      isWinner?: boolean
      splitSquad?: boolean
      seriesNumber?: number
    }
    home: {
      leagueRecord?: LeagueRecord
      score?: number
      team: { id: number; name: string; link: string }
      isWinner?: boolean
      splitSquad?: boolean
      seriesNumber?: number
    }
  }
  linescore?: LineScore
  venue: {
    id: number
    name: string
    link: string
  }
  content: {
    link: string
  }
  isTie: boolean
  gameNumber: number
  publicFacing: boolean
  doubleHeader: string // "Y" or "N"
  gamedayType: string
  tiebreaker: string
  calendarEventID: string
  seasonDisplay: string
  dayNight: string
  scheduledInnings: number
  reverseHomeAwayStatus: boolean
  inningBreakLength: number
  gamesInSeries: number
  seriesGameNumber: number
  seriesDescription: string
  recordSource: string
  ifNecessary: string
  ifNecessaryDescription: string
  // Optional rescheduling fields and description
  rescheduleDate?: string
  rescheduleGameDate?: string
  rescheduledFrom?: string
  rescheduledFromDate?: string
  description?: string
}

/**
 * Minimal but self‑descriptive types for the MLB StatsAPI `/linescore` response
 * shown in the example payload. Properties that may be absent (e.g. `runs`
 * inside a partial inning) are declared optional with `?`.
 */

export interface Person {
  id: number
  fullName: string
  link: string
}

export interface TeamRef {
  id: number
  name: string
  link: string
}

export interface HalfInningTotals {
  /** Runs scored in the half‑inning (optional for the current inning). */
  runs?: number
  hits?: number
  errors?: number
  leftOnBase?: number
}

export interface Inning {
  num: number
  ordinalNum: string // e.g. "4th"
  home: HalfInningTotals
  away: HalfInningTotals
}

export interface GameTotals {
  runs: number
  hits: number
  errors: number
  leftOnBase: number
}

export interface DefenseState {
  pitcher: Person
  catcher: Person
  first: Person
  second: Person
  third: Person
  shortstop: Person
  left: Person
  center: Person
  right: Person
  /** Current hitter from the defensive team’s point of view */
  batter: Person
  onDeck: Person
  inHole: Person
  battingOrder: number
  team: TeamRef
}

export interface OffenseState {
  batter: Person
  onDeck: Person
  inHole: Person
  /** Pitcher the offense is facing */
  pitcher: Person
  battingOrder: number
  team: TeamRef
}

export interface LineScore {
  copyright: string

  /* inning & game situation */
  currentInning: number
  currentInningOrdinal: string
  inningState: 'Top' | 'Middle' | 'Bottom' | string
  inningHalf: 'Top' | 'Bottom' | 'Middle' | string
  isTopInning: boolean
  scheduledInnings: number

  /* per‑inning line score */
  innings: Inning[]

  /* game totals */
  teams: {
    home: GameTotals
    away: GameTotals
  }

  /* defensive & offensive alignments */
  defense: DefenseState
  offense: OffenseState

  /* count */
  balls: number
  strikes: number
  outs: number
}
