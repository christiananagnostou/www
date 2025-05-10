import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ScheduleGame, LineScore } from './types'

const LINESCORE_INNINGS = 9

const getInningArrow = (half: string) =>
  half === 'Top' ? '↑' : half === 'Bottom' ? '↓' : half === 'Middle' ? '↕' : ''

interface LiveGameCardProps {
  liveGame: ScheduleGame
  lineScore: LineScore
  gradient: string
}

const LiveGameCard: React.FC<LiveGameCardProps> = ({ liveGame, lineScore, gradient }) => (
  <ScoreboardCard $gradient={gradient} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <TeamsScoreRow>
      <div className="team" style={{ textAlign: 'left' }}>
        <h3 className="name">{liveGame.teams.away.team.name}</h3>
        <div className="score">{lineScore.teams.away.runs}</div>
      </div>
      <div className="center-inning">
        <span style={{ fontSize: 22, lineHeight: 1 }}>{getInningArrow(lineScore.inningHalf)}</span>
        <span>
          {lineScore.inningState} {lineScore.currentInningOrdinal || lineScore.currentInning}
        </span>
      </div>
      <div className="team" style={{ textAlign: 'right' }}>
        <h3 className="name">{liveGame.teams.home.team.name}</h3>
        <div className="score">{lineScore.teams.home.runs}</div>
      </div>
    </TeamsScoreRow>

    {/* linescore table */}
    <div style={{ overflowX: 'auto', marginBottom: 14 }}>
      <LinescoreTable>
        <thead>
          <tr>
            <th>Inning</th>
            {Array.from({ length: lineScore.scheduledInnings || LINESCORE_INNINGS }, (_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
            <th>R</th>
            <th>H</th>
            <th>E</th>
            <th>LOB</th>
          </tr>
        </thead>
        <tbody>
          {(['away', 'home'] as const).map((side) => (
            <tr key={side}>
              <td style={{ fontWeight: 600 }}>{liveGame.teams[side].team.name.split(' ').pop()}</td>
              {Array.from({ length: lineScore.scheduledInnings || LINESCORE_INNINGS }, (_, i) => (
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
    </div>

    {/* counts */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 14 }}>
      <span>
        <strong>B</strong>: {lineScore.balls ?? 0}
      </span>
      <span>
        <strong>S</strong>: {lineScore.strikes ?? 0}
      </span>
      <span>
        <strong>O</strong>: {lineScore.outs ?? 0}
      </span>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, fontSize: 13 }}>
      <div>
        <div style={{ fontWeight: 600 }}>At Bat</div>
        <div>{lineScore.offense?.batter?.fullName ?? '—'}</div>
        <div style={{ color: '#e0e0e0' }}>
          On Deck: {lineScore.offense?.onDeck?.fullName ?? '—'}
          <br />
          In Hole: {lineScore.offense?.inHole?.fullName ?? '—'}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>Pitcher</div>
        <div>{lineScore.defense?.pitcher?.fullName ?? '—'}</div>
        <div style={{ color: '#e0e0e0' }}>Catcher: {lineScore.defense?.catcher?.fullName ?? '—'}</div>
      </div>
    </div>
  </ScoreboardCard>
)

export default LiveGameCard

// Dynamic gradient background based on props
const ScoreboardCard = styled(motion.div)<{ $gradient: string }>`
  background: ${(p) => p.$gradient};
  border-radius: 1rem;
  padding: 1.75rem 1.25rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  margin-bottom: 1.5rem;
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

  th,
  td {
    padding: 0.25rem 0.5rem;
    text-align: center;
    border: none;
  }
  th {
    font-weight: 500;
    color: var(--heading);
    background: rgba(255, 255, 255, 0.02);
  }
  td {
    color: var(--text);
  }
  tr:nth-child(even) td {
    background: rgba(255, 255, 255, 0.01);
  }
`
