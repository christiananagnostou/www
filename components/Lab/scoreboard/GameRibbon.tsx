import dayjs from 'dayjs'
import styled from 'styled-components'

import type { ScheduleGame } from '../../../lib/mlb/types'
import { getTeamAbbreviation, getTeamColor, rgba } from '../../../lib/mlb/utils'

interface GameRibbonProps {
  games: ScheduleGame[]
  selectedGamePk?: number
  onGameSelect: (game: ScheduleGame) => void
}

const getGameStatus = (game: ScheduleGame) => {
  if (game.status.abstractGameState === 'Live') return game.status.detailedState || 'Live'
  if (game.status.abstractGameState === 'Final') return 'Final'

  return dayjs(game.gameDate).format('h:mm A')
}

const getGameScore = (game: ScheduleGame) => {
  if (game.teams.away.score == null || game.teams.home.score == null) return '@'

  return `${game.teams.away.score}–${game.teams.home.score}`
}

export default function GameRibbon({ games, selectedGamePk, onGameSelect }: GameRibbonProps) {
  if (games.length === 0) return null

  return (
    <RibbonSection aria-label="Games">
      <RibbonTrack role="list">
        {games.map((game) => {
          const awayColor = getTeamColor(game.teams.away.team.id)
          const homeColor = getTeamColor(game.teams.home.team.id)
          const awayAbbreviation = getTeamAbbreviation(game.teams.away.team.id, game.teams.away.team.name)
          const homeAbbreviation = getTeamAbbreviation(game.teams.home.team.id, game.teams.home.team.name)
          const isSelected = selectedGamePk === game.gamePk
          const isLive = game.status.abstractGameState === 'Live'

          return (
            <RibbonItem key={game.gamePk} role="listitem">
              <RibbonButton
                $awayColor={awayColor}
                $homeColor={homeColor}
                $isLive={isLive}
                $isSelected={isSelected}
                aria-pressed={isSelected}
                onClick={() => onGameSelect(game)}
                type="button"
              >
                <RibbonStatus>
                  <StatusDot $isLive={isLive} />
                  {getGameStatus(game)}
                </RibbonStatus>
                <RibbonTeams>
                  <span>{awayAbbreviation}</span>
                  <strong>{getGameScore(game)}</strong>
                  <span>{homeAbbreviation}</span>
                </RibbonTeams>
                <RibbonMeta>
                  <time dateTime={dayjs(game.gameDate).format()}>{dayjs(game.gameDate).format('MMM D')}</time>
                </RibbonMeta>
              </RibbonButton>
            </RibbonItem>
          )
        })}
      </RibbonTrack>
    </RibbonSection>
  )
}

const RibbonSection = styled.nav`
  margin: 0.75rem 0;
`

const RibbonTrack = styled.ul`
  display: grid;
  grid-auto-columns: minmax(8.75rem, 10.75rem);
  grid-auto-flow: column;
  gap: 0.5rem;
  padding: 0 0 0.5rem;
  margin: 0;
  overflow-x: auto;
  list-style: none;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0.35rem;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.06);
    border-radius: 1rem;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.18);
    border-radius: 1rem;
  }
`

const RibbonItem = styled.li`
  scroll-snap-align: start;
`

const RibbonButton = styled.button<{
  $awayColor: string
  $homeColor: string
  $isLive: boolean
  $isSelected: boolean
}>`
  display: grid;
  width: 100%;
  min-height: 5rem;
  gap: 0.35rem;
  padding: 0.62rem;
  color: var(--heading);
  text-align: left;
  cursor: pointer;
  background:
    linear-gradient(
      135deg,
      ${({ $awayColor }) => rgba($awayColor, 0.32)},
      ${({ $homeColor }) => rgba($homeColor, 0.3)}
    ),
    rgba(255, 255, 255, 0.06);
  border: 1px solid ${({ $isSelected }) => ($isSelected ? 'rgba(248, 240, 200, 0.6)' : 'rgba(255, 255, 255, 0.12)')};
  border-radius: 0.75rem;
  box-shadow:
    ${({ $isSelected }) => ($isSelected ? '0 0 0 1px rgba(248, 240, 200, 0.28)' : '0 8px 24px rgba(0, 0, 0, 0.14)')},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover,
  &:focus-visible {
    border-color: ${({ $isLive }) => ($isLive ? 'rgba(117, 255, 141, 0.55)' : 'rgba(248, 240, 200, 0.48)')};
    box-shadow:
      ${({ $isSelected }) => ($isSelected ? '0 0 0 1px rgba(248, 240, 200, 0.34)' : '0 8px 24px rgba(0, 0, 0, 0.18)')},
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  &:focus-visible {
    outline: 2px solid rgba(248, 240, 200, 0.8);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const RibbonStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.54rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
`

const StatusDot = styled.span<{ $isLive: boolean }>`
  width: 0.32rem;
  height: 0.32rem;
  background: ${({ $isLive }) => ($isLive ? '#75ff8d' : 'rgba(255, 255, 255, 0.4)')};
  border-radius: 50%;
  box-shadow: ${({ $isLive }) => ($isLive ? '0 0 14px rgba(117, 255, 141, 0.64)' : 'none')};
`

const RibbonTeams = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.32rem;
  align-items: baseline;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.04em;

  strong {
    color: #f8f0c8;
    font-size: 0.98rem;
    letter-spacing: -0.04em;
  }
`

const RibbonMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.58rem;
`
