import styled from 'styled-components'

import type { ScheduleGame } from '../../../lib/mlb/types'

const gameDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Los_Angeles',
})

interface ScheduleSectionProps {
  title: string
  games: ScheduleGame[]
  gradient: string
  onGameSelect: (game: ScheduleGame) => void
  emptyMessage?: string
}

export default function ScheduleSection({
  title,
  games,
  gradient,
  onGameSelect,
  emptyMessage = 'No games scheduled right now.',
}: ScheduleSectionProps) {
  const sectionId = `schedule-${title.toLowerCase().replaceAll(' ', '-')}`

  return (
    <SectionContainer aria-labelledby={sectionId}>
      <SectionHeading id={sectionId}>{title}</SectionHeading>
      <GameList $gradient={gradient}>
        {games.length === 0 ? (
          <EmptyItem>{emptyMessage}</EmptyItem>
        ) : (
          games.map((game) => {
            const gameTime = gameDateFormatter.format(new Date(game.gameDate))
            const teamsLabel = `${game.teams.away.team.name} at ${game.teams.home.team.name}`

            return (
              <GameListItem key={game.gamePk}>
                <GameButton onClick={() => onGameSelect(game)} aria-label={`${teamsLabel}, ${gameTime}`}>
                  <GameContent>
                    <GameDate dateTime={game.gameDate}>{gameTime}</GameDate>
                    <GameTeams>
                      {game.teams.away.team.name} <span>@</span> {game.teams.home.team.name}
                    </GameTeams>
                    {game.rescheduleDate && (
                      <GameExtra>
                        Rescheduled:{' '}
                        <time dateTime={game.rescheduleDate}>
                          {gameDateFormatter.format(new Date(game.rescheduleDate))}
                        </time>
                      </GameExtra>
                    )}
                  </GameContent>
                  <GameScore>{renderScore(game)}</GameScore>
                </GameButton>
              </GameListItem>
            )
          })
        )}
      </GameList>
    </SectionContainer>
  )
}

function renderScore(game: ScheduleGame) {
  const status = game.status.detailedState
  if (['postponed', 'canceled'].includes(status.toLowerCase())) {
    return <SmallScore>{game.status.reason ? `${status} — ${game.status.reason}` : status}</SmallScore>
  }

  if (game.status.abstractGameState === 'Final' && game.teams.away.score != null && game.teams.home.score != null) {
    return `${game.teams.away.score}‑${game.teams.home.score}`
  }

  return <SmallScore>{status || '—'}</SmallScore>
}

const SectionContainer = styled.section`
  margin-bottom: 1.75rem;
`

const SectionHeading = styled.h2`
  padding: 0 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--heading);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`

const GameList = styled.ul<{ $gradient: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.625rem;
  list-style: none;
  background: ${({ $gradient }) => $gradient};
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`

const GameListItem = styled.li`
  overflow: hidden;
  background: rgba(30, 30, 30, 0.18);
  border-radius: 0.75rem;
`

const GameButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
  gap: 1rem;

  &:hover {
    background: rgba(50, 50, 50, 0.25);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: 2px solid var(--heading);
    outline-offset: -2px;
  }
`

const EmptyItem = styled.li`
  padding: 1.25rem 1rem;
  color: var(--text-dark);
  font-size: 0.95rem;
  text-align: center;
  background: rgba(30, 30, 30, 0.18);
  border-radius: 0.75rem;
`

const GameContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`

const GameDate = styled.time`
  margin-bottom: 3px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85em;
`

const GameTeams = styled.div`
  overflow: hidden;
  color: var(--heading);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;

  span {
    margin: 0 0.35rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: normal;
  }
`

const GameExtra = styled.div`
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.75rem;
`

const GameScore = styled.div`
  min-width: 2.5em;
  color: var(--heading);
  font-size: 1.1em;
  font-weight: bold;
  text-align: right;
`

const SmallScore = styled.span`
  font-size: 0.85em;
  font-weight: normal;
  opacity: 0.85;
`
