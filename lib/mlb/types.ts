export interface TeamInfo {
  id: number
  name: string
  teamCode: string
}

interface TeamReference {
  id: number
  name: string
}

interface GameTeam {
  score?: number
  team: TeamReference
}

interface PlayerReference {
  fullName: string
}

interface InningTotals {
  runs?: number
}

interface GameTotals {
  runs: number
  hits: number
  errors: number
  leftOnBase: number
}

export interface LineScore {
  currentInning: number
  currentInningOrdinal?: string
  inningState: string
  inningHalf: string
  scheduledInnings: number
  innings: Array<{ away: InningTotals; home: InningTotals }>
  teams: { away: GameTotals; home: GameTotals }
  offense?: {
    batter?: PlayerReference
    onDeck?: PlayerReference
    inHole?: PlayerReference
    first?: PlayerReference
    second?: PlayerReference
    third?: PlayerReference
  }
  defense?: {
    pitcher?: PlayerReference
    catcher?: PlayerReference
  }
  balls?: number
  strikes?: number
  outs?: number
}

export interface ScheduleGame {
  gamePk: number
  gameDate: string
  status: {
    abstractGameState: string
    detailedState: string
    reason?: string
  }
  teams: {
    away: GameTeam
    home: GameTeam
  }
  linescore?: LineScore
  rescheduleDate?: string
}
