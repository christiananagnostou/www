import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { fetchLineScore, fetchLiveSchedule, fetchSchedule, fetchTeams } from '../../../lib/mlb/api'
import type { LineScore, ScheduleGame, TeamInfo } from '../../../lib/mlb/types'
import {
  createGameGradient,
  createGradient,
  getTeamColor,
  partitionSchedule,
  resolveTeamId,
  rgba,
} from '../../../lib/mlb/utils'

import GameCard from './GameCard'
import GameRibbon from './GameRibbon'
import TeamSearch from './TeamSearch'

const LIVE_SCORE_POLL_INTERVAL = 30_000
const LIVE_TEAMS_POLL_INTERVAL = 60_000

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
  const [selectedGame, setSelectedGame] = useState<ScheduleGame | null>(() => selectFeaturedGame(initialGames))
  const [leagueLiveTeamIds, setLeagueLiveTeamIds] = useState<Set<number>>(() => collectLiveTeamIds(initialGames))
  const [isLoadingTeams, setIsLoadingTeams] = useState(initialTeams.length === 0)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(!hasInitialSchedule)
  const [isLoadingLineScore, setIsLoadingLineScore] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const shouldUseInitialSchedule = useRef(hasInitialSchedule && initialTeamId !== null)

  const selectedTeam = teams.find(({ id }) => id === teamId) ?? null
  const { liveGame, pastGames, upcomingGames } = useMemo(() => partitionSchedule(games), [games])
  const liveTeamIds = useMemo(() => collectLiveTeamIds(games, new Set(leagueLiveTeamIds)), [games, leagueLiveTeamIds])
  const ribbonGames = useMemo(() => {
    const byGamePk = new Map<number, ScheduleGame>()
    ;[...pastGames, ...(liveGame ? [liveGame] : []), ...upcomingGames].forEach((game) =>
      byGamePk.set(game.gamePk, game)
    )

    return Array.from(byGamePk.values()).toSorted((a, b) => Date.parse(a.gameDate) - Date.parse(b.gameDate))
  }, [liveGame, pastGames, upcomingGames])
  const baseColor = teamId ? getTeamColor(teamId) : '#303030'
  const scheduleGradient = createGradient(baseColor, baseColor, 0.25, 0.65)
  const activeColors = getGameColors(selectedGame, baseColor)
  const isScheduleEmpty = !liveGame && pastGames.length === 0 && upcomingGames.length === 0
  const isScheduleLoading = isLoadingSchedule && games.length === 0
  const teamName = selectedTeam?.name ?? 'this team'
  const selectedGameCanRenderWithoutLineScore = selectedGame?.status.abstractGameState === 'Preview'
  const shouldShowScoreLoading =
    selectedGame && isLoadingLineScore && !lineScore && !selectedGameCanRenderWithoutLineScore

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
        setSelectedGame(selectFeaturedGame(fetchedGames))
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
    let isActive = true
    let controller: AbortController | undefined
    let pollTimer: ReturnType<typeof setTimeout> | undefined

    const loadLiveTeams = async () => {
      controller = new AbortController()

      try {
        const fetchedGames = await fetchLiveSchedule({ signal: controller.signal })
        if (isActive) setLeagueLiveTeamIds(collectLiveTeamIds(fetchedGames))
      } catch {
        // Keep the last known live-team state if the league schedule is temporarily unavailable.
      } finally {
        if (isActive) pollTimer = setTimeout(loadLiveTeams, LIVE_TEAMS_POLL_INTERVAL)
      }
    }

    void loadLiveTeams()

    return () => {
      isActive = false
      controller?.abort()
      if (pollTimer) clearTimeout(pollTimer)
    }
  }, [])

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

  const handleSelectTeam = (team: TeamInfo) => {
    setTeamId(team.id)
    setTeamInput(team.name)
  }

  return (
    <Wrapper $awayColor={activeColors.awayColor} $homeColor={activeColors.homeColor} $isLive={isLiveGame(selectedGame)}>
      <BallparkBackdrop aria-hidden="true" />
      <TeamSearch
        teams={teams}
        value={teamInput}
        liveTeamIds={liveTeamIds}
        onChange={setTeamInput}
        onSelect={handleSelectTeam}
      />

      {!isScheduleLoading && !isLoadingTeams && !isScheduleEmpty && (
        <GameRibbon games={ribbonGames} selectedGamePk={selectedGame?.gamePk} onGameSelect={setSelectedGame} />
      )}

      {selectedGame ? (
        shouldShowScoreLoading ? (
          <ScoreSkeleton $gradient={getGameGradient(selectedGame)} role="status" aria-live="polite">
            <StateTitle>Loading game center</StateTitle>
            <StateBody>Building the scoreboard, line score, and live situation.</StateBody>
          </ScoreSkeleton>
        ) : (
          <GameCard
            awayColor={activeColors.awayColor}
            game={selectedGame}
            homeColor={activeColors.homeColor}
            lineScore={lineScore}
          />
        )
      ) : isScheduleLoading || isLoadingTeams ? (
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
        <StateCard $gradient={scheduleGradient} role="status" aria-live="polite">
          <StateTitle>Select a game</StateTitle>
          <StateBody>Choose a game from the ribbon to open the full scoreboard.</StateBody>
        </StateCard>
      )}
    </Wrapper>
  )
}

function selectFeaturedGame(games: ScheduleGame[]) {
  const { liveGame, pastGames, upcomingGames } = partitionSchedule(games)
  return liveGame ?? upcomingGames[0] ?? pastGames.at(-1) ?? null
}

function getGameColors(game: ScheduleGame | null, fallbackColor: string) {
  if (!game) return { awayColor: fallbackColor, homeColor: fallbackColor }

  return {
    awayColor: getTeamColor(game.teams.away.team.id),
    homeColor: getTeamColor(game.teams.home.team.id),
  }
}

function isLiveGame(game: ScheduleGame | null) {
  return game?.status.abstractGameState === 'Live'
}

function collectLiveTeamIds(games: ScheduleGame[], teamIds = new Set<number>()) {
  games.forEach((game) => {
    if (!isLiveGame(game)) return

    teamIds.add(game.teams.away.team.id)
    teamIds.add(game.teams.home.team.id)
  })

  return teamIds
}

function getGameGradient(game: ScheduleGame) {
  return createGameGradient(getTeamColor(game.teams.away.team.id), getTeamColor(game.teams.home.team.id))
}

const Wrapper = styled.div<{ $awayColor: string; $homeColor: string; $isLive: boolean }>`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  max-width: 100%;
  padding: 0.75rem;
  color: var(--text);
  background:
    radial-gradient(circle at 16% 0, ${({ $awayColor }) => rgba($awayColor, 0.34)}, transparent 30%) padding-box,
    radial-gradient(circle at 100% 10%, ${({ $homeColor }) => rgba($homeColor, 0.28)}, transparent 34%) padding-box,
    linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025)) padding-box,
    linear-gradient(135deg, ${({ $awayColor }) => rgba($awayColor, 0.34)}, ${({ $homeColor }) => rgba($homeColor, 0.3)})
      border-box;
  border: 1px solid transparent;
  border-radius: 1.2rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, ${({ $isLive }) => ($isLive ? 0.16 : 0.09)});

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

  @media (width <= 768px) {
    padding: 0.6rem;
    border-radius: 1rem;
  }
`

const BallparkBackdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: -18%;
  }

  &::before {
    background:
      linear-gradient(110deg, transparent 22%, rgba(255, 255, 255, 0.13) 48%, transparent 72%),
      repeating-linear-gradient(
        96deg,
        rgba(255, 255, 255, 0.035) 0,
        rgba(255, 255, 255, 0.035) 1px,
        transparent 1px,
        transparent 18px
      );
    filter: blur(18px);
    opacity: 0.34;
    transform: translateX(-18%) rotate(-7deg);
  }

  &::after {
    background:
      radial-gradient(circle at 20% 12%, rgba(255, 255, 255, 0.22), transparent 10%),
      radial-gradient(circle at 52% 0, rgba(255, 255, 255, 0.18), transparent 12%),
      radial-gradient(circle at 84% 16%, rgba(255, 255, 255, 0.2), transparent 11%);
    filter: blur(28px);
    opacity: 0.28;
  }

  @media (prefers-reduced-motion: no-preference) {
    &::before {
      animation: stadium-sweep 12s ease-in-out infinite alternate;
    }
  }

  @keyframes stadium-sweep {
    to {
      transform: translateX(12%) rotate(-7deg);
    }
  }
`

const StateCard = styled.div<{ $gradient: string }>`
  padding: 1.35rem;
  margin-top: 0.75rem;
  color: var(--text);
  text-align: center;
  background: ${({ $gradient }) => $gradient};
  border-radius: 0.85rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
`

const ScoreSkeleton = styled(StateCard)`
  position: relative;
  display: grid;
  min-height: 20rem;
  overflow: hidden;
  align-content: center;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.1) 50%, transparent 80%);
    transform: translateX(-100%);
  }

  @media (prefers-reduced-motion: no-preference) {
    &::after {
      animation: scoreboard-loading 1.8s ease-in-out infinite;
    }
  }

  @keyframes scoreboard-loading {
    to {
      transform: translateX(100%);
    }
  }
`

const StateTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: var(--heading);
  font-size: 1.05rem;
  font-weight: 600;
`

const StateBody = styled.p`
  max-width: 32rem;
  margin: 0 auto 0.75rem;
  color: var(--text);
  font-size: 0.82rem;
`

const StateHint = styled.p`
  margin: 0;
  color: var(--text-dark);
  font-size: 0.75rem;
`
