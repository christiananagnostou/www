import dayjs from 'dayjs'
import styled from 'styled-components'
import { ScheduleGame } from './types'

interface ScheduleSectionProps {
  title: string
  games: ScheduleGame[]
  gradient: string
  onGameSelect?: (game: ScheduleGame) => void
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ title, games, gradient, onGameSelect }) => {
  const renderScore = (g: ScheduleGame) => {
    // If postponed or canceled, show that status with reason if available
    if (g.status.detailedState && ['postponed', 'canceled'].includes(g.status.detailedState.toLowerCase())) {
      return (
        <span className="small-text">
          {g.status.detailedState}
          {g.status.reason && ' - ' + g.status.reason}
        </span>
      )
    }
    // For final games when scores are defined, show the score
    if (g.status.abstractGameState === 'Final' && g.teams.away.score != null && g.teams.home.score != null) {
      return `${g.teams.away.score}‑${g.teams.home.score}`
    }
    // All other cases, show the detailed state
    return <span className="small-text">{g.status.detailedState || '—'}</span>
  }

  return (
    <>
      <SectionSubHeading>{title}</SectionSubHeading>
      <GameList $gradient={gradient}>
        {games.map((g) => {
          const isToday = dayjs(g.gameDate).isSame(dayjs(), 'day')
          return (
            <GameCard
              key={g.gamePk}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onGameSelect?.(g)}
              onClick={() => onGameSelect?.(g)}
              style={{ cursor: onGameSelect ? 'pointer' : 'default' }}
            >
              <div className="game-info">
                <span className="game-date">
                  {dayjs(g.gameDate).format('MMM D, h:mm A')}
                  {isToday && ' (Today)'}
                </span>
                <span className="game-teams">
                  {g.teams.away.team.name} <span style={{ color: '#888' }}>@</span> {g.teams.home.team.name}
                </span>
                <span className="game-extra">
                  {g.rescheduleDate && `Rescheduled: ${dayjs(g.rescheduleDate).format('MMM D, h:mm A')}`}
                </span>
              </div>
              <span className="game-score">{renderScore(g)}</span>
            </GameCard>
          )
        })}
      </GameList>
    </>
  )
}

export default ScheduleSection

const SectionSubHeading = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 1rem 0 0.5rem;
  color: var(--heading);
`

const GameList = styled.ul<{ $gradient: string }>`
  background: ${({ $gradient }) => $gradient};
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const GameCard = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  background: rgba(30, 30, 30, 0.18);
  transition: background 0.15s;
  font-size: 1rem;
  gap: 1rem;

  .game-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .game-date {
    font-size: 0.85em;
    margin-bottom: 2px;
    font-weight: normal;
  }
  .game-teams {
    font-weight: 500;
    color: var(--heading);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .game-extra {
    font-size: 0.75rem;
    margin-top: 2px;
  }
  .game-score {
    font-size: 1.1em;
    font-weight: bold;
    color: var(--heading);
    min-width: 2.5em;
    text-align: right;
  }
  .small-text {
    font-size: 0.85em;
    font-weight: normal;
  }
`
