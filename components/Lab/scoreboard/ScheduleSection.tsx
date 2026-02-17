import dayjs from 'dayjs'
import styled from 'styled-components'
import { ScheduleGame } from './types'
import { useCallback } from 'react'

interface ScheduleSectionProps {
  title: string
  games: ScheduleGame[]
  gradient: string
  onGameSelect?: (game: ScheduleGame) => void
  emptyMessage?: string
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  title,
  games,
  gradient,
  onGameSelect,
  emptyMessage = 'No games scheduled right now.',
}) => {
  const renderScore = useCallback((g: ScheduleGame) => {
    // If postponed or canceled, show that status with reason if available
    if (g.status.detailedState && ['postponed', 'canceled'].includes(g.status.detailedState.toLowerCase())) {
      return (
        <span className="small-text">
          {g.status.detailedState}
          {g.status.reason && ` - ${g.status.reason}`}
        </span>
      )
    }
    // For final games when scores are defined, show the score
    if (g.status.abstractGameState === 'Final' && g.teams.away.score != null && g.teams.home.score != null) {
      return `${g.teams.away.score}‑${g.teams.home.score}`
    }
    // All other cases, show the detailed state
    return <span className="small-text">{g.status.detailedState || '—'}</span>
  }, [])

  const sectionId = `schedule-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionHeading id={sectionId}>{title}</SectionHeading>
      </SectionHeader>
      <GameList $gradient={gradient} role="list" aria-labelledby={sectionId}>
        {games.length === 0 ? (
          <EmptyItem role="listitem">
            <p>{emptyMessage}</p>
          </EmptyItem>
        ) : (
          games.map((g) => {
            const isToday = dayjs(g.gameDate).isSame(dayjs(), 'day')
            const gameTime = dayjs(g.gameDate).format('MMM D, h:mm A')
            const gameStatusText = isToday ? `${gameTime} (Today)` : gameTime
            const fullTeamsText = `${g.teams.away.team.name} at ${g.teams.home.team.name}`

            return (
              <GameListItem
                key={g.gamePk}
                role="button"
                tabIndex={onGameSelect ? 0 : -1}
                onKeyDown={(e) => e.key === 'Enter' && onGameSelect?.(g)}
                onClick={() => onGameSelect?.(g)}
                aria-label={`${fullTeamsText}, ${gameStatusText}`}
                $isInteractive={!!onGameSelect}
              >
                <GameContent>
                  <div className="game-date">
                    <time dateTime={dayjs(g.gameDate).format()}>
                      {gameTime}
                      {isToday && <TodayTag>Today</TodayTag>}
                    </time>
                  </div>
                  <div className="game-teams">
                    <span className="away-team">{g.teams.away.team.name}</span>
                    <span className="separator">@</span>
                    <span className="home-team">{g.teams.home.team.name}</span>
                  </div>
                  {g.rescheduleDate && (
                    <div className="game-extra">
                      Rescheduled:{' '}
                      <time dateTime={dayjs(g.rescheduleDate).format()}>
                        {dayjs(g.rescheduleDate).format('MMM D, h:mm A')}
                      </time>
                    </div>
                  )}
                </GameContent>
                <GameScore>{renderScore(g)}</GameScore>
              </GameListItem>
            )
          })
        )}
      </GameList>
    </SectionContainer>
  )
}

export default ScheduleSection

const SectionContainer = styled.section`
  margin-bottom: 1.75rem;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
`

const SectionHeading = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--heading);
  position: relative;
  letter-spacing: -0.01em;
`

const GameList = styled.ul<{ $gradient: string }>`
  background: ${({ $gradient }) => $gradient};
  border-radius: 1rem;
  padding: 0.625rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`

const GameListItem = styled.li<{ $isInteractive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(30, 30, 30, 0.18);
  cursor: ${(p) => (p.$isInteractive ? 'pointer' : 'default')};
  font-size: 1rem;
  transition: all 0.2s ease;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  &:hover,
  &:focus-visible {
    background: rgba(50, 50, 50, 0.25);
    box-shadow: ${(p) => (p.$isInteractive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none')};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--heading);
  }
`

const EmptyItem = styled.li`
  padding: 1.25rem 1rem;
  border-radius: 0.75rem;
  background: rgba(30, 30, 30, 0.18);
  color: var(--text-dark);
  text-align: center;
  font-size: 0.95rem;
`

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;

  .game-date {
    font-size: 0.85em;
    margin-bottom: 3px;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .game-teams {
    font-weight: 600;
    color: var(--heading);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .separator {
      color: rgba(255, 255, 255, 0.5);
      margin: 0 0.35rem;
      font-weight: normal;
    }
  }

  .game-extra {
    font-size: 0.75rem;
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.65);
  }
`

const GameScore = styled.div`
  font-size: 1.1em;
  font-weight: bold;
  color: var(--heading);
  min-width: 2.5em;
  text-align: right;

  .small-text {
    font-size: 0.85em;
    font-weight: normal;
    opacity: 0.85;
  }
`

const TodayTag = styled.span`
  background: rgba(255, 213, 79, 0.2);
  color: rgba(255, 213, 79, 0.95);
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75em;
  font-weight: 600;
  margin-left: 0.5rem;
`
