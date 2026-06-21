import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { fetchLineScore, fetchSchedule, fetchTeams } from '../../../lib/mlb/api'
import type { LineScore, ScheduleGame, TeamInfo } from '../../../lib/mlb/types'
import { partitionSchedule, resolveTeamId } from '../../../lib/mlb/utils'

import GameCard from './GameCard'
import ScheduleSection from './ScheduleSection'
import TeamSearch from './TeamSearch'

const LIVE_SCORE_POLL_INTERVAL = 30_000
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

interface MLBScoreboardProps {
  defaultTeam: string | number
  initialGames: ScheduleGame[]
  initialTeams: TeamInfo[]
  hasInitialSchedule: boolean
}

export default function MLBScoreboard({
  defaultTeam,
  initialGames,
  initialTeams,
  hasInitialSchedule,
}: MLBScoreboardProps) {
  const initialTeamId = resolveTeamId(defaultTeam, initialTeams)
  const initialTeam = initialTeams.find(({ id }) => id === initialTeamId)
  const [teams, setTeams] = useState(initialTeams)
  const [teamId, setTeamId] = useState<number | null>(initialTeamId)
  const [teamInput, setTeamInput] = useState(initialTeam?.name ?? String(defaultTeam))
  const [games, setGames] = useState(initialGames)
  const [lineScore, setLineScore] = useState<LineScore | null>(null)
  const [selectedGame, setSelectedGame] = useState<ScheduleGame | null>(
    initialGames.find(({ status }) => status.abstractGameState === 'Live') ?? null
  )
  const [isLoadingTeams, setIsLoadingTeams] = useState(initialTeams.length === 0)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(!hasInitialSchedule)
  const [isLoadingLineScore, setIsLoadingLineScore] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const shouldUseInitialSchedule = useRef(hasInitialSchedule && initialTeamId !== null)

  const selectedTeam = teams.find(({ id }) => id === teamId) ?? null
  const { liveGame, pastGames, upcomingGames } = useMemo(() => partitionSchedule(games), [games])
  const baseColor = teamId ? getTeamColor(teamId) : '#303030'
  const scheduleGradient = createGradient(baseColor, baseColor, 0.25, 0.65)

  useEffect(() => {
    if (initialTeams.length > 0) return

    let isActive = true
    fetchTeams()
      .then((fetchedTeams) => {
        if (!isActive) return

        const resolvedTeamId = resolveTeamId(defaultTeam, fetchedTeams)
        const resolvedTeam = fetchedTeams.find(({ id }) => id === resolvedTeamId)
        setTeams(fetchedTeams)
        setTeamId(resolvedTeamId)
        if (resolvedTeam) setTeamInput(resolvedTeam.name)
      })
      .catch(() => {
        if (isActive) setScheduleError('Teams are unavailable. Try again in a moment.')
      })
      .finally(() => {
        if (isActive) setIsLoadingTeams(false)
      })

    return () => {
      isActive = false
    }
  }, [defaultTeam, initialTeams.length])

  useEffect(() => {
    if (!teamId) return
    if (shouldUseInitialSchedule.current) {
      shouldUseInitialSchedule.current = false
      return
    }

    const controller = new AbortController()
    setIsLoadingSchedule(true)
    setScheduleError(null)
    setSelectedGame(null)

    fetchSchedule(teamId, { signal: controller.signal })
      .then((fetchedGames) => {
        setGames(fetchedGames)
        setSelectedGame(fetchedGames.find(({ status }) => status.abstractGameState === 'Live') ?? null)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setGames([])
        setScheduleError('Schedule unavailable. Try again in a moment.')
        console.error(error)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingSchedule(false)
      })

    return () => controller.abort()
  }, [teamId])

  useEffect(() => {
    if (!selectedGame) {
      setLineScore(null)
      return
    }

    const controller = new AbortController()
    const isLive = selectedGame.status.abstractGameState === 'Live'
    let pollTimer: ReturnType<typeof setTimeout> | undefined
    setLineScore(selectedGame.linescore ?? null)
    setIsLoadingLineScore(!selectedGame.linescore)

    const loadLineScore = async () => {
      try {
        setLineScore(await fetchLineScore(selectedGame.gamePk, controller.signal))
      } catch {
        if (!controller.signal.aborted && !selectedGame.linescore) setLineScore(null)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingLineScore(false)
          if (isLive) pollTimer = setTimeout(loadLineScore, LIVE_SCORE_POLL_INTERVAL)
        }
      }
    }

    void loadLineScore()

    return () => {
      controller.abort()
      if (pollTimer) clearTimeout(pollTimer)
    }
  }, [selectedGame])

  const getGameGradient = (game: ScheduleGame) =>
    createGameGradient(getTeamColor(game.teams.away.team.id), getTeamColor(game.teams.home.team.id))

  const handleSelectTeam = (team: TeamInfo) => {
    setTeamId(team.id)
    setTeamInput(team.name)
  }

  const isScheduleEmpty = !liveGame && pastGames.length === 0 && upcomingGames.length === 0
  const teamName = selectedTeam?.name ?? 'this team'

  return (
    <Wrapper>
      <TeamSearch teams={teams} value={teamInput} onChange={setTeamInput} onSelect={handleSelectTeam} />

      {selectedGame && <BackButton onClick={() => setSelectedGame(null)}>← Back to Schedule</BackButton>}

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
      ) : (isLoadingSchedule && games.length === 0) || isLoadingTeams ? (
        <StateCard $gradient={scheduleGradient} role="status" aria-live="polite">
          <StateTitle>Loading schedule</StateTitle>
          <StateBody>Fetching the latest games for {teamName}.</StateBody>
        </StateCard>
      ) : isScheduleEmpty ? (
        <StateCard $gradient={scheduleGradient} role="status" aria-live="polite">
          <StateTitle>{scheduleError ? 'Schedule unavailable' : 'Offseason mode'}</StateTitle>
          <StateBody>
            {scheduleError ??
              `No games are scheduled for ${teamName} right now. Check back when the season kicks back up.`}
          </StateBody>
          <StateHint>Try another team or check back closer to spring training.</StateHint>
        </StateCard>
      ) : (
        <>
          <ScheduleSection
            title="Recent Games"
            games={pastGames}
            gradient={scheduleGradient}
            onGameSelect={setSelectedGame}
            emptyMessage="No recent games on the books."
          />
          {liveGame && (
            <ScheduleSection
              title="Live Game"
              games={[liveGame]}
              gradient={getGameGradient(liveGame)}
              onGameSelect={setSelectedGame}
            />
          )}
          <ScheduleSection
            title="Upcoming Games"
            games={upcomingGames}
            gradient={scheduleGradient}
            onGameSelect={setSelectedGame}
            emptyMessage="No upcoming games scheduled yet."
          />
        </>
      )}
    </Wrapper>
  )
}

function getTeamColor(teamId: number) {
  return TEAM_COLORS[teamId] ?? '#303030'
}

function toRgba(hex: string, alpha: number) {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function createGradient(from: string, to: string, fromAlpha: number, toAlpha: number) {
  return `linear-gradient(135deg, ${toRgba(from, fromAlpha)} 0%, ${toRgba(to, toAlpha)} 100%)`
}

function createGameGradient(awayColor: string, homeColor: string) {
  return `${createGradient(awayColor, homeColor, 0.45, 0.45)}, linear-gradient(45deg, ${toRgba(
    awayColor,
    0.45
  )} 10%, ${toRgba(homeColor, 0.45)} 100%)`
}

const Wrapper = styled.div`
  color: var(--text);
  max-width: 100%;

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
  font-size: 0.9rem;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.15s;

  &:hover {
    color: var(--text);
  }

  &:focus-visible {
    outline: 2px solid var(--heading);
    outline-offset: 2px;
  }
`

const StateCard = styled.div<{ $gradient: string }>`
  padding: 2rem;
  margin-top: 1rem;
  color: var(--text);
  text-align: center;
  background: ${({ $gradient }) => $gradient};
  border-radius: 1rem;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
`

const StateTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: var(--heading);
  font-size: 1.35rem;
  font-weight: 600;
`

const StateBody = styled.p`
  max-width: 32rem;
  margin: 0 auto 0.75rem;
  color: var(--text);
`

const StateHint = styled.p`
  margin: 0;
  color: var(--text-dark);
  font-size: 0.85rem;
`
