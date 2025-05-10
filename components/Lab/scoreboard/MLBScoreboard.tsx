import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimationControls } from 'framer-motion'
import dayjs from 'dayjs'
import styled from 'styled-components'

import { fetchTeams, resolveTeamId, fetchSchedule, fetchLineScore } from './utils'

import TeamSearch from './TeamSearch'
import LiveGameCard from './LiveGameCard'
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

  const controls = useAnimationControls()
  const pollRef = useRef<NodeJS.Timeout>(null)

  /** ---------- derived ---------- */
  const liveGame = useMemo(() => games.find((g) => g.status.abstractGameState === 'Live'), [games])
  const pastGames = useMemo(
    () =>
      games
        .filter((g) => g.status.abstractGameState === 'Final')
        .sort((a, b) => dayjs(b.gameDate).valueOf() - dayjs(a.gameDate).valueOf())
        .slice(0, 3)
        .toReversed(),
    [games]
  )
  const upcomingGames = useMemo(
    () =>
      games
        .filter((g) => g.status.abstractGameState === 'Preview')
        .sort((a, b) => dayjs(a.gameDate).valueOf() - dayjs(b.gameDate).valueOf())
        .slice(0, 3),
    [games]
  )

  /** ---------- effects ---------- */
  useEffect(() => {
    fetchTeams().then((list) => {
      setTeams(list)
      const id = resolveTeamId(String(defaultTeam), list)
      if (id) setTeamId(id)
    })
  }, [defaultTeam])

  useEffect(() => {
    if (!teamId) return
    ;(async () => setGames(await fetchSchedule(teamId)))()
  }, [teamId])

  useEffect(() => {
    if (!liveGame) {
      setLineScore(null)
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }
    const load = async () => {
      setLineScore(await fetchLineScore(liveGame.gamePk))
      controls.start({ scale: [1, 1.04, 1] })
    }
    load()
    pollRef.current = setInterval(load, 30_000)
    return () => {
      pollRef.current && clearInterval(pollRef.current)
    }
  }, [liveGame, controls])

  /** ---------- gradients ---------- */
  const base = teamId ? getTeamColor(teamId) : '#303030'
  const scheduleGradient = `linear-gradient(135deg, ${rgba(base, 0.25)} 0%, ${rgba(base, 0.65)} 100%)`
  const liveGradient =
    liveGame && lineScore
      ? `linear-gradient(135deg, ${getTeamColor(liveGame.teams.away.team.id)} 0%, ${getTeamColor(liveGame.teams.home.team.id)} 100%)`
      : scheduleGradient

  /** ---------- handlers ---------- */
  const handleSelectTeam = (t: TeamInfo) => {
    setTeamId(t.id)
    setTeamInput(t.name)
  }

  /** ---------- render ---------- */
  return (
    <Wrapper>
      <TeamSearch teams={teams} value={teamInput} onChange={setTeamInput} onSelect={handleSelectTeam} />

      {liveGame && lineScore ? (
        <LiveGameCard liveGame={liveGame} lineScore={lineScore} gradient={liveGradient} />
      ) : (
        <>
          <ScheduleSection title="Recent Games" games={pastGames} gradient={scheduleGradient} />
          <ScheduleSection title="Upcoming Games" games={upcomingGames} gradient={scheduleGradient} />
        </>
      )}
    </Wrapper>
  )
}

export default MLBScoreboard

const Wrapper = styled.div`
  color: var(--text);
`
