import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAnimationControls } from 'framer-motion'
import dayjs from 'dayjs'
import styled from 'styled-components'

import { fetchTeams, resolveTeamId, fetchSchedule, fetchLineScore } from './utils'

import TeamSearch from './TeamSearch'
import GameCard from './GameCard'
import ScheduleSection from './ScheduleSection'
import { TeamInfo, ScheduleGame, LineScore } from './types'

/* ------------------------------------------------------------------ */
/*  Simple MLB color palette + helpers                                */
/* ------------------------------------------------------------------ */
const TEAM_COLORS: Record<number, string> = {
  108: '#BA0021', // Los Angeles Angels
  109: '#A71930', // Arizona Diamondbacks
  110: '#DF4601', // Baltimore Orioles
  111: '#BD3039', // Boston Red Sox
  112: '#0E3386', // Chicago Cubs
  113: '#C6011F', // Cincinnati Reds
  114: '#E31937', // Cleveland Guardians
  115: '#33006F', // Colorado Rockies
  116: '#0C2340', // Detroit Tigers
  117: '#002D62', // Houston Astros
  118: '#004687', // Kansas City Royals
  119: '#005A9C', // Los Angeles Dodgers
  120: '#BA0C2F', // Washington Nationals (approx.)
  121: '#002D72', // New York Mets
  133: '#003831', // Athletics
  134: '#FDB827', // Pittsburgh Pirates
  135: '#362415', // San Diego Padres (brown)
  136: '#005C5C', // Seattle Mariners
  137: '#FD5A1E', // San Francisco Giants
  138: '#C41E3A', // St. Louis Cardinals
  139: '#092C5C', // Tampa Bay Rays
  140: '#003278', // Texas Rangers
  141: '#134A8E', // Toronto Blue Jays
  142: '#002B5C', // Minnesota Twins
  143: '#E81828', // Philadelphia Phillies
  144: '#CE1141', // Atlanta Braves
  145: '#27251F', // Chicago White Sox
  146: '#00A3E0', // Miami Marlins
  147: '#003087', // New York Yankees
  158: '#192F50', // Milwaukee Brewers
}
const getTeamColor = (id: number) => TEAM_COLORS[id] ?? '#303030'
const rgba = (hex: string, a: number) =>
  `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`

interface MLBScoreboardProps {
  defaultTeam?: string | number
  initialGames?: ScheduleGame[]
}

const MLBScoreboard: React.FC<MLBScoreboardProps> = ({ defaultTeam = 'SF', initialGames = [] }) => {
  const [teams, setTeams] = useState<TeamInfo[]>([])
  const [teamId, setTeamId] = useState<number | null>(null)
  const [teamInput, setTeamInput] = useState(String(defaultTeam))
  const [games, setGames] = useState<ScheduleGame[]>(initialGames)
  const [lineScore, setLineScore] = useState<LineScore | null>(null)
  const [selectedGame, setSelectedGame] = useState<ScheduleGame | null>(null)
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [isLoadingLineScore, setIsLoadingLineScore] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)

  const controls = useAnimationControls()
  const pollRef = useRef<NodeJS.Timeout>(null)
  const lineScoreCache = useRef<Map<number, LineScore>>(new Map())

  /** ---------- derived ---------- */
  const selectedTeam = useMemo(() => teams.find((team) => team.id === teamId) ?? null, [teams, teamId])

  const { liveGame, pastGames, upcomingGames } = useMemo(() => {
    const liveGame = games.find((g) => g.status.abstractGameState === 'Live')
    const pastGames = games
      .filter((g) => g.status.abstractGameState === 'Final')
      .toSorted((a, b) => dayjs(b.gameDate).valueOf() - dayjs(a.gameDate).valueOf())
      .slice(0, 3)
      .toReversed()
    const upcomingGames = games
      .filter((g) => g.status.abstractGameState === 'Preview')
      .toSorted((a, b) => dayjs(a.gameDate).valueOf() - dayjs(b.gameDate).valueOf())
      .slice(0, 3)

    return { liveGame, pastGames, upcomingGames }
  }, [games])

  /** ---------- effects ---------- */

  useEffect(() => {
    // Fetch the list of teams and resolve the default team ID
    let isActive = true
    setIsLoadingTeams(true)
    fetchTeams()
      .then((list) => {
        if (!isActive) return
        setTeams(list)
        const id = resolveTeamId(String(defaultTeam), list)
        if (id) {
          setTeamId(id)
          const team = list.find((t) => t.id === id)
          if (team) setTeamInput(team.name)
        }
      })
      .catch(() => {
        if (!isActive) return
        setTeams([])
      })
      .finally(() => {
        if (!isActive) return
        setIsLoadingTeams(false)
      })
    return () => {
      isActive = false
    }
  }, [defaultTeam])

  useEffect(() => {
    // Fetch the schedule for the selected team
    if (!teamId) return
    let isActive = true
    setIsLoadingSchedule(true)
    setScheduleError(null)
    ;(async () => {
      try {
        const fetchedGames = await fetchSchedule(teamId)
        if (!isActive) return
        setGames(fetchedGames)

        const liveGame = fetchedGames.find((g) => g.status.abstractGameState === 'Live')
        setSelectedGame(liveGame || null)
        setIsLoadingSchedule(false)
      } catch {
        if (!isActive) return
        setScheduleError('Schedule unavailable. Try again in a moment.')
        setGames([])
        setIsLoadingSchedule(false)
      }
    })()
    return () => {
      isActive = false
    }
  }, [teamId])

  useEffect(() => {
    // Automatically select the live game if available
    if (liveGame && selectedGame?.gamePk !== liveGame.gamePk) {
      setSelectedGame(liveGame)
    }
  }, [liveGame])

  useEffect(() => {
    // Fetch the line score for the selected game and set up polling if the game is live
    if (!selectedGame) {
      setLineScore(null)
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }

    let isActive = true

    const load = async () => {
      setIsLoadingLineScore(true)
      const cached = lineScoreCache.current.get(selectedGame.gamePk)
      if (cached) {
        if (isActive) setLineScore(cached)
        setIsLoadingLineScore(false)
        return
      }
      const score = await fetchLineScore(selectedGame.gamePk)
      if (!isActive) return
      if (!score) {
        setLineScore(null)
        setIsLoadingLineScore(false)
        return
      }
      lineScoreCache.current.set(selectedGame.gamePk, score)
      setLineScore(score)
      setIsLoadingLineScore(false)
      if (selectedGame.status.abstractGameState === 'Live') {
        controls.start({ scale: [1, 1.04, 1] })
      }
    }

    load()
    if (selectedGame.status.abstractGameState === 'Live') {
      pollRef.current = setInterval(load, 30_000)
    }

    return () => {
      isActive = false
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [selectedGame, controls])

  /** ---------- helpers ---------- */
  const base = useMemo(() => (teamId ? getTeamColor(teamId) : '#303030'), [teamId])
  const scheduleGradient = useMemo(
    () => `linear-gradient(135deg, ${rgba(base, 0.25)} 0%, ${rgba(base, 0.65)} 100%)`,
    [base]
  )

  const gameGradientMap = useMemo(() => {
    const map = new Map<number, string>()
    games.forEach((game) => {
      const away = getTeamColor(game.teams.away.team.id)
      const home = getTeamColor(game.teams.home.team.id)
      map.set(
        game.gamePk,
        `linear-gradient(135deg, ${rgba(away, 0.45)} 0%, ${rgba(home, 0.45)} 100%),
        linear-gradient(45deg, ${rgba(away, 0.45)} 10%, ${rgba(home, 0.45)} 100%)`
      )
    })
    return map
  }, [games])

  const getGameGradient = useCallback(
    (game: ScheduleGame) => gameGradientMap.get(game.gamePk) ?? scheduleGradient,
    [gameGradientMap, scheduleGradient]
  )

  const handleSelectTeam = useCallback((team: TeamInfo) => {
    setTeamId(team.id)
    setTeamInput(team.name)
  }, [])

  const handleGameSelect = useCallback(
    async (game: ScheduleGame) => {
      const cached = lineScoreCache.current.get(game.gamePk)
      if (cached) {
        setLineScore(cached)
      } else if (game.linescore) {
        lineScoreCache.current.set(game.gamePk, game.linescore)
        setLineScore(game.linescore)
      } else {
        setLineScore(null)
      }
      setSelectedGame(game)
    },
    [setSelectedGame]
  )

  const handleBackToSchedule = useCallback(() => {
    setSelectedGame(null)
  }, [])

  const isScheduleEmpty = !liveGame && pastGames.length === 0 && upcomingGames.length === 0
  const isScheduleLoading = isLoadingSchedule && games.length === 0
  const teamName = selectedTeam?.name ?? 'this team'
  const emptyTitle = scheduleError ? 'Schedule unavailable' : 'Offseason mode'
  const emptyBody = scheduleError
    ? scheduleError
    : `No games are scheduled for ${teamName} right now. Check back when the season kicks back up.`

  /** ---------- render ---------- */
  return (
    <Wrapper>
      <TeamSearch teams={teams} value={teamInput} onChange={setTeamInput} onSelect={handleSelectTeam} />

      {selectedGame && (
        <BackButton onClick={handleBackToSchedule} aria-label="Back to schedule">
          ← Back to Schedule
        </BackButton>
      )}

      {selectedGame ? (
        lineScore ? (
          <GameCard game={selectedGame} lineScore={lineScore} gradient={getGameGradient(selectedGame)} />
        ) : (
          <StateCard $gradient={scheduleGradient} role="status" aria-live="polite">
            <StateTitle>{isLoadingLineScore ? 'Loading score' : 'Score unavailable'}</StateTitle>
            <StateBody>
              {isLoadingLineScore
                ? 'Gathering the latest line score...'
                : 'We could not load the latest line score for this game.'}
            </StateBody>
          </StateCard>
        )
      ) : isScheduleLoading || isLoadingTeams ? (
        <StateCard $gradient={scheduleGradient} role="status" aria-live="polite">
          <StateTitle>Loading schedule</StateTitle>
          <StateBody>Fetching the latest games for {teamName}.</StateBody>
        </StateCard>
      ) : isScheduleEmpty ? (
        <StateCard $gradient={scheduleGradient} role="status" aria-live="polite">
          <StateTitle>{emptyTitle}</StateTitle>
          <StateBody>{emptyBody}</StateBody>
          <StateHint>Try another team or check back closer to spring training.</StateHint>
        </StateCard>
      ) : (
        <>
          {/* Recent games */}
          <ScheduleSection
            title="Recent Games"
            games={pastGames}
            gradient={scheduleGradient}
            onGameSelect={handleGameSelect}
            emptyMessage="No recent games on the books."
          />
          {/* Live game */}
          {liveGame && (
            <ScheduleSection
              title="Live Game"
              games={[liveGame]}
              gradient={getGameGradient(liveGame)}
              onGameSelect={handleGameSelect}
            />
          )}
          {/* Upcoming games */}
          <ScheduleSection
            title="Upcoming Games"
            games={upcomingGames}
            gradient={scheduleGradient}
            onGameSelect={handleGameSelect}
            emptyMessage="No upcoming games scheduled yet."
          />
        </>
      )}
    </Wrapper>
  )
}

export default MLBScoreboard

const Wrapper = styled.div`
  color: var(--text);
  max-width: 100%;

  header {
    margin-bottom: 1rem;
  }

  main {
    position: relative;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--text-dark);
  font-size: 0.9rem;
  padding: 0.5rem 0;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: color 0.15s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: var(--text);
  }

  &:focus-visible {
    outline: 2px solid var(--heading);
    outline-offset: 2px;
  }
`

const StateCard = styled.div<{ $gradient: string }>`
  background: ${({ $gradient }) => $gradient};
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 1rem;
  text-align: center;
  color: var(--text);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
`

const StateTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--heading);
`

const StateBody = styled.p`
  margin: 0 auto 0.75rem;
  max-width: 32rem;
  color: var(--text);
`

const StateHint = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-dark);
`
