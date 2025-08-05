import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ScheduleGame, LineScore } from './types'

const LINESCORE_INNINGS = 9

const getInningArrow = (half: string) =>
  half === 'Top' ? '↑' : half === 'Bottom' ? '↓' : half === 'Middle' ? '↕' : ''

interface GameCardProps {
  game: ScheduleGame
  lineScore: LineScore
  gradient: string
}

const GameCard: React.FC<GameCardProps> = ({ game, lineScore, gradient }) => {
  const totalInnings = Math.max(lineScore.currentInning || 0, lineScore.scheduledInnings || LINESCORE_INNINGS)

  return (
    <ScoreboardCard
      $gradient={gradient}
      role="region"
      aria-label={`Game details: ${game.teams.away.team.name} vs ${game.teams.home.team.name}`}
    >
      <TeamsScoreRow>
        <div className="team" style={{ textAlign: 'left' }}>
          <h3 className="name">{game.teams.away.team.name}</h3>
          <div className="score" aria-label={`${game.teams.away.team.name} score: ${lineScore.teams.away.runs}`}>
            {lineScore.teams.away.runs}
          </div>
        </div>
        <div className="center-inning">
          <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">
            {getInningArrow(lineScore.inningHalf)}
          </span>
          <span>
            {lineScore.inningState} {lineScore.currentInningOrdinal || lineScore.currentInning}
          </span>
        </div>
        <div className="team" style={{ textAlign: 'right' }}>
          <h3 className="name">{game.teams.home.team.name}</h3>
          <div className="score" aria-label={`${game.teams.home.team.name} score: ${lineScore.teams.home.runs}`}>
            {lineScore.teams.home.runs}
          </div>
        </div>
      </TeamsScoreRow>

      {/* linescore table */}
      <TableContainer>
        <LinescoreTable>
          <caption className="visually-hidden">
            Line score for {game.teams.away.team.name} at {game.teams.home.team.name}
          </caption>
          <thead>
            <tr>
              <th scope="col">Inning</th>
              {Array.from({ length: totalInnings }, (_, i) => (
                <th key={i} scope="col">
                  {i + 1}
                </th>
              ))}
              <th scope="col">R</th>
              <th scope="col">H</th>
              <th scope="col">E</th>
              <th scope="col">LOB</th>
            </tr>
          </thead>
          <tbody>
            {(['away', 'home'] as const).map((side) => (
              <tr key={side}>
                <th scope="row" style={{ fontWeight: 600 }}>
                  {game.teams[side].team.name.split(' ').pop()}
                </th>
                {Array.from({ length: totalInnings }, (_, i) => (
                  <td key={i}>{lineScore.innings[i]?.[side]?.runs ?? ''}</td>
                ))}
                <td style={{ fontWeight: 600 }}>{lineScore.teams[side].runs}</td>
                <td>{lineScore.teams[side].hits}</td>
                <td>{lineScore.teams[side].errors}</td>
                <td>{lineScore.teams[side].leftOnBase}</td>
              </tr>
            ))}
          </tbody>
        </LinescoreTable>
      </TableContainer>

      {/* counts */}
      <GameStats>
        <div className="count-group">
          <span className="count">
            <strong>B</strong>: <span aria-label="Balls">{lineScore.balls ?? 0}</span>
          </span>
          <span className="count">
            <strong>S</strong>: <span aria-label="Strikes">{lineScore.strikes ?? 0}</span>
          </span>
          <span className="count">
            <strong>O</strong>: <span aria-label="Outs">{lineScore.outs ?? 0}</span>
          </span>
        </div>
      </GameStats>

      <PlayersSection>
        <PlayerColumn
          title="Batting"
          primary={lineScore.offense?.batter?.fullName}
          secondary={[
            `On Deck: ${lineScore.offense?.onDeck?.fullName ?? '—'}`,
            `In Hole: ${lineScore.offense?.inHole?.fullName ?? '—'}`,
          ]}
          align="left"
        />
        <PlayerColumn
          title="Pitching"
          primary={lineScore.defense?.pitcher?.fullName}
          secondary={[`Catcher: ${lineScore.defense?.catcher?.fullName ?? '—'}`]}
          align="right"
        />
      </PlayersSection>
    </ScoreboardCard>
  )
}

const PlayerColumn: React.FC<{
  title: string
  primary: string | undefined
  secondary: string[]
  align: 'left' | 'right'
}> = ({ title, primary, secondary, align }) => (
  <PlayerColumnContainer $align={align}>
    <h4>
      {align === 'left' ? <HelmetIcon /> : <BaseballIcon />} {title}
    </h4>
    <div className="primary-player">{primary ?? '—'}</div>
    <div className="secondary-players">
      {secondary.map((text, index) => (
        <div key={index}>{text}</div>
      ))}
    </div>
  </PlayerColumnContainer>
)

export default GameCard

// Dynamic gradient background based on props
const ScoreboardCard = styled(motion.div)<{ $gradient: string }>`
  background: ${(p) => p.$gradient};
  border-radius: 1rem;
  padding: 1.75rem 1.25rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  margin-bottom: 1.5rem;
`

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  -webkit-overflow-scrolling: touch;
`

const TeamsScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 1rem;

  .team {
    flex: 1 1 0;
    min-width: 0;
    text-align: left;
  }
  .score {
    font-size: 32px;
    font-weight: 800;
    margin-top: 2px;
  }
  .center-inning {
    flex: 0 0 auto;
    min-width: 90px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: var(--heading);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.5px;
    gap: 2px;
  }
`

const LinescoreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: transparent;
  table-layout: fixed;

  th,
  td {
    padding: 0.25rem 0.5rem;
    text-align: center;
    border: none;
    width: 1fr;
  }
  /* Team Names */
  th:first-child {
    text-align: left;
    width: 5rem;
  }
  th {
    font-weight: 500;
    color: var(--heading);
    background: rgba(255, 255, 255, 0.04);
  }
  td {
    color: var(--text);
  }

  /* Add a thin line after the last inning */
  th:nth-last-child(5),
  td:nth-last-child(5) {
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }
`

const GameStats = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;

  .count-group {
    display: flex;
    gap: 1.75rem;
  }

  .count {
    font-size: 1rem;
    display: inline-flex;
    gap: 0.25rem;
  }
`

const PlayersSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  font-size: 0.875rem;
`

const PlayerColumnContainer = styled.div<{ $align: 'left' | 'right' }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$align === 'left' ? 'flex-start' : 'flex-end')};
  text-align: ${(props) => props.$align};

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: ${(props) => (props.$align === 'left' ? 'row' : 'row-reverse')};
  }

  .primary-player {
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: ${(props) => (props.$align === 'left' ? 'row' : 'row-reverse')};
  }

  .secondary-players {
    font-size: 0.8rem;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`

const BaseballIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Baseball_Ball">
      <path d="M19.02,4.976A9.927,9.927,0,1,0,15.74,21.2,9.908,9.908,0,0,0,21.93,12,9.856,9.856,0,0,0,19.02,4.976Zm-13.34.71a8.9,8.9,0,0,1,6.04-2.61,8.461,8.461,0,0,1-.34,2.26l-.34-.19a.5.5,0,0,0-.5.86l.5.29a9.227,9.227,0,0,1-1.57,2.47l-.35-.35a.5.5,0,0,0-.7,0,.5.5,0,0,0,0,.71l.34.34a8.875,8.875,0,0,1-2.47,1.58L6,10.536a.5.5,0,0,0-.68-.19.505.505,0,0,0-.18.69l.2.34a8.2,8.2,0,0,1-2.26.35A8.827,8.827,0,0,1,5.68,5.686ZM11.74,17a.5.5,0,1,0-.5.87l.49.29a10.008,10.008,0,0,0-.45,2.74,8.9,8.9,0,0,1-8.18-8.17,9.378,9.378,0,0,0,2.75-.46l.29.5a.5.5,0,0,0,.43.25.475.475,0,0,0,.25-.07.493.493,0,0,0,.18-.68l-.21-.36a9.461,9.461,0,0,0,2.68-1.73l.36.36a.5.5,0,0,0,.35.15.508.508,0,0,0,.36-.15.513.513,0,0,0,0-.71l-.36-.36A9.665,9.665,0,0,0,11.9,6.8l.37.21a.475.475,0,0,0,.25.07.511.511,0,0,0,.44-.25.494.494,0,0,0-.19-.68l-.51-.29a9.789,9.789,0,0,0,.46-2.76,8.924,8.924,0,0,1,8.18,8.18,10.08,10.08,0,0,0-2.74.46l-.28-.49a.505.505,0,0,0-.69-.18.491.491,0,0,0-.18.68l.2.35a9.684,9.684,0,0,0-2.68,1.73l-.35-.35a.5.5,0,0,0-.71,0,.5.5,0,0,0,0,.7l.36.36a9.2,9.2,0,0,0-1.73,2.67Zm6.58,1.32a8.851,8.851,0,0,1-6.04,2.6,8.388,8.388,0,0,1,.34-2.25l.35.2a.451.451,0,0,0,.25.07.5.5,0,0,0,.43-.25.505.505,0,0,0-.18-.69l-.51-.29a8.7,8.7,0,0,1,1.57-2.47l.36.36a.5.5,0,0,0,.7-.71l-.36-.36a9.124,9.124,0,0,1,2.48-1.57l.3.52a.5.5,0,0,0,.43.25.451.451,0,0,0,.25-.07.505.505,0,0,0,.19-.68l-.21-.36a8.449,8.449,0,0,1,2.25-.34,8.992,8.992,0,0,1-.66,3.14A9.172,9.172,0,0,1,18.32,18.316Z"></path>
    </g>
  </svg>
)

const HelmetIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 256 256"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M88,130a26,26,0,1,0,26,26A26,26,0,0,0,88,130Zm0,40a14,14,0,1,1,14-14A14,14,0,0,1,88,170Zm160-48H221.83A102,102,0,0,0,18,128v24a70.08,70.08,0,0,0,70,70h40a70.08,70.08,0,0,0,70-70V134h50a6,6,0,0,0,0-12Zm-62,30a58.07,58.07,0,0,1-58,58h-.85A70,70,0,0,0,158,152V134h28Zm-34-30a6,6,0,0,0-6,6v24a58,58,0,0,1-116,0V128a90,90,0,0,1,179.8-6Z"></path>
  </svg>
)
