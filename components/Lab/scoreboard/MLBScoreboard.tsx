import React, { useEffect, useMemo, useRef, useState } from 'react'
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

  const controls = useAnimationControls()
  const pollRef = useRef<NodeJS.Timeout>(null)

  /** ---------- derived ---------- */
  const { liveGame, pastGames, upcomingGames } = useMemo(() => {
    const liveGame = games.find((g) => g.status.abstractGameState === 'Live')
    const pastGames = games
      .filter((g) => g.status.abstractGameState === 'Final')
      .sort((a, b) => dayjs(b.gameDate).valueOf() - dayjs(a.gameDate).valueOf())
      .slice(0, 3)
      .toReversed()
    const upcomingGames = games
      .filter((g) => g.status.abstractGameState === 'Preview')
      .sort((a, b) => dayjs(a.gameDate).valueOf() - dayjs(b.gameDate).valueOf())
      .slice(0, 3)

    return { liveGame, pastGames, upcomingGames }
  }, [games])

  /** ---------- effects ---------- */

  useEffect(() => {
    // Fetch the list of teams and resolve the default team ID
    fetchTeams().then((list) => {
      setTeams(list)
      const id = resolveTeamId(String(defaultTeam), list)
      if (id) {
        setTeamId(id)
        const team = list.find((t) => t.id === id)
        if (team) setTeamInput(team.name) // Set the full team name
      }
    })
  }, [defaultTeam])

  useEffect(() => {
    // Fetch the schedule for the selected team
    if (!teamId) return
    ;(async () => {
      const fetchedGames = await fetchSchedule(teamId)
      setGames(fetchedGames)

      // Reset selected game to live game or null
      const liveGame = fetchedGames.find((g) => g.status.abstractGameState === 'Live')
      setSelectedGame(liveGame || null)
    })()
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

    const load = async () => {
      setLineScore(await fetchLineScore(selectedGame.gamePk))
      if (selectedGame.status.abstractGameState === 'Live') {
        controls.start({ scale: [1, 1.04, 1] })
      }
    }

    load()
    // Only poll if game is live
    if (selectedGame.status.abstractGameState === 'Live') {
      pollRef.current = setInterval(load, 30_000)
    }

    return () => {
      pollRef.current && clearInterval(pollRef.current)
    }
  }, [selectedGame, controls])

  /** ---------- helpers ---------- */
  const base = teamId ? getTeamColor(teamId) : '#303030'
  const scheduleGradient = `linear-gradient(135deg, ${rgba(base, 0.25)} 0%, ${rgba(base, 0.65)} 100%)`

  const getGameGradient = (game: ScheduleGame) =>
    `linear-gradient(135deg, 
      ${rgba(getTeamColor(game.teams.away.team.id), 0.45)} 0%, 
      ${rgba(getTeamColor(game.teams.home.team.id), 0.45)} 100%),
      linear-gradient(45deg,
      ${rgba(getTeamColor(game.teams.away.team.id), 0.45)} 10%,
      ${rgba(getTeamColor(game.teams.home.team.id), 0.45)} 100%)`

  const handleSelectTeam = (t: TeamInfo) => {
    setTeamId(t.id)
    setTeamInput(t.name)
  }

  const handleGameSelect = async (game: ScheduleGame) => {
    const score = game.linescore || (await fetchLineScore(game.gamePk))
    setLineScore(score)
    setSelectedGame(game)
  }

  /** ---------- render ---------- */
  return (
    <Wrapper>
      <TeamSearch teams={teams} value={teamInput} onChange={setTeamInput} onSelect={handleSelectTeam} />

      {selectedGame && (
        <BackButton onClick={() => setSelectedGame(null)} aria-label="Back to schedule">
          ← Back to Schedule
        </BackButton>
      )}

      {selectedGame && lineScore ? (
        <GameCard game={selectedGame} lineScore={lineScore} gradient={getGameGradient(selectedGame)} />
      ) : (
        <>
          {/* Recent games */}
          <ScheduleSection
            title="Recent Games"
            games={pastGames}
            gradient={scheduleGradient}
            onGameSelect={handleGameSelect}
            selectedGameId={selectedGame?.gamePk}
          />
          {/* Live game */}
          {liveGame && (
            <ScheduleSection
              title="Live Game"
              games={[liveGame]}
              gradient={getGameGradient(liveGame)}
              onGameSelect={handleGameSelect}
              selectedGameId={selectedGame?.gamePk}
            />
          )}
          {/* Upcoming games */}
          <ScheduleSection
            title="Upcoming Games"
            games={upcomingGames}
            gradient={scheduleGradient}
            onGameSelect={handleGameSelect}
            selectedGameId={selectedGame?.gamePk}
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
    clip: rect(0, 0, 0, 0);
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
