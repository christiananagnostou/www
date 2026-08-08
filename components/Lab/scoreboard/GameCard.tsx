import dayjs from 'dayjs'
import { motion, useReducedMotion } from 'framer-motion'
import styled from 'styled-components'

import type { LineScore, ScheduleGame } from '../../../lib/mlb/types'
import { getTeamAbbreviation, rgba } from '../../../lib/mlb/utils'

const LINESCORE_INNINGS = 9
const getTeamPanelGradientAngle = (align: 'left' | 'right') => (align === 'left' ? '315deg' : '135deg')

const getInningArrow = (half: string | undefined) =>
  half === 'Top' ? '↑' : half === 'Bottom' ? '↓' : half === 'Middle' ? '↕' : ''

const getGameEyebrow = (game: ScheduleGame, lineScore: LineScore | null) => {
  if (game.status.abstractGameState === 'Live' && lineScore) {
    return `${lineScore.inningState} ${lineScore.currentInningOrdinal || lineScore.currentInning}`
  }

  if (game.status.abstractGameState === 'Final') return game.status.detailedState || 'Final'
  if (game.status.detailedState) return game.status.detailedState

  return dayjs(game.gameDate).format('MMM D, h:mm A')
}

interface GameCardProps {
  game: ScheduleGame
  lineScore: LineScore | null
  awayColor: string
  homeColor: string
}

export default function GameCard({ game, lineScore, awayColor, homeColor }: GameCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const totalInnings = Math.max(
    lineScore?.currentInning || 0,
    lineScore?.scheduledInnings || LINESCORE_INNINGS,
    LINESCORE_INNINGS
  )
  const isLive = game.status.abstractGameState === 'Live'
  const isPreview = game.status.abstractGameState === 'Preview'
  const awayScore = lineScore?.teams.away.runs ?? game.teams.away.score ?? '—'
  const homeScore = lineScore?.teams.home.runs ?? game.teams.home.score ?? '—'
  const awayAbbreviation = getTeamAbbreviation(game.teams.away.team.id, game.teams.away.team.name)
  const homeAbbreviation = getTeamAbbreviation(game.teams.home.team.id, game.teams.home.team.name)
  const gameMeta = dayjs(game.gameDate).format('MMM D, h:mm A')

  return (
    <ScoreboardCard
      $awayColor={awayColor}
      $homeColor={homeColor}
      $isLive={isLive}
      aria-label={`Game details: ${game.teams.away.team.name} vs ${game.teams.home.team.name}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <HeroHeader>
        <StatusCluster>
          <LiveDot $isLive={isLive} aria-hidden="true" />
          <span>{isLive ? 'Live game' : getGameEyebrow(game, lineScore)}</span>
        </StatusCluster>
        <VenueMeta>{gameMeta}</VenueMeta>
      </HeroHeader>

      <HeroGrid>
        <TeamPanel $align="left" $teamColor={awayColor}>
          <TeamCode>{awayAbbreviation}</TeamCode>
          <TeamName>{game.teams.away.team.name}</TeamName>
          <ScoreValue
            key={`away-${awayScore}`}
            aria-label={`${game.teams.away.team.name} score: ${awayScore}`}
            initial={shouldReduceMotion ? false : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {awayScore}
          </ScoreValue>
        </TeamPanel>

        <SituationPanel>
          <InningBadge>
            {isLive && <span aria-hidden="true">{getInningArrow(lineScore?.inningHalf)}</span>}
            <strong>{getGameEyebrow(game, lineScore)}</strong>
          </InningBadge>
          <Diamond lineScore={lineScore} />
          <CountBoard lineScore={lineScore} />
        </SituationPanel>

        <TeamPanel $align="right" $teamColor={homeColor}>
          <TeamCode>{homeAbbreviation}</TeamCode>
          <TeamName>{game.teams.home.team.name}</TeamName>
          <ScoreValue
            key={`home-${homeScore}`}
            aria-label={`${game.teams.home.team.name} score: ${homeScore}`}
            initial={shouldReduceMotion ? false : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {homeScore}
          </ScoreValue>
        </TeamPanel>
      </HeroGrid>

      {lineScore ? (
        <>
          <LineScoreLedger>
            <caption className="visually-hidden">
              Line score for {game.teams.away.team.name} at {game.teams.home.team.name}
            </caption>
            <thead>
              <tr>
                <th scope="col">Team</th>
                {Array.from({ length: totalInnings }, (_, i) => (
                  <th key={i} scope="col" className={i + 1 === lineScore.currentInning ? 'current-inning' : undefined}>
                    {i + 1}
                  </th>
                ))}
                <th scope="col" className="total runs">
                  R
                </th>
                <th scope="col" className="total">
                  H
                </th>
                <th scope="col" className="total">
                  E
                </th>
              </tr>
            </thead>
            <tbody>
              {(['away', 'home'] as const).map((side) => (
                <tr key={side}>
                  <th scope="row">{side === 'away' ? awayAbbreviation : homeAbbreviation}</th>
                  {Array.from({ length: totalInnings }, (_, i) => {
                    const runs = lineScore.innings[i]?.[side]?.runs

                    return (
                      <td
                        key={i}
                        className={[
                          runs && runs > 0 ? 'scoring-inning' : '',
                          i + 1 === lineScore.currentInning ? 'current-inning' : '',
                          i >= lineScore.innings.length ? 'future-inning' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {runs ?? ''}
                      </td>
                    )
                  })}
                  <td className="total runs">{lineScore.teams[side].runs}</td>
                  <td className="total">{lineScore.teams[side].hits}</td>
                  <td className="total">{lineScore.teams[side].errors}</td>
                </tr>
              ))}
            </tbody>
          </LineScoreLedger>

          <PlayersSection>
            <PlayerColumn
              title="At bat"
              primary={lineScore.offense?.batter?.fullName}
              secondary={[
                `On deck: ${lineScore.offense?.onDeck?.fullName ?? '—'}`,
                `In hole: ${lineScore.offense?.inHole?.fullName ?? '—'}`,
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
        </>
      ) : (
        <PreviewPanel>
          <PreviewTitle>{game.status.detailedState || (isPreview ? 'Pregame' : 'Score unavailable')}</PreviewTitle>
          <PreviewBody>
            {isPreview ? (
              <>
                {'First pitch at '}
                <time dateTime={dayjs(game.gameDate).format()}>{dayjs(game.gameDate).format('h:mm A')}</time>
                {'. Line score and live situation will appear here when MLB publishes game data.'}
              </>
            ) : (
              'MLB has not published a usable line score for this game yet.'
            )}
          </PreviewBody>
        </PreviewPanel>
      )}
    </ScoreboardCard>
  )
}

function Diamond({ lineScore }: { lineScore: LineScore | null }) {
  const occupiedBases = {
    first: Boolean(lineScore?.offense?.first),
    second: Boolean(lineScore?.offense?.second),
    third: Boolean(lineScore?.offense?.third),
  }
  const baseState = [
    occupiedBases.first ? 'runner on first' : 'first base empty',
    occupiedBases.second ? 'runner on second' : 'second base empty',
    occupiedBases.third ? 'runner on third' : 'third base empty',
  ].join(', ')

  return (
    <DiamondField aria-label={`Base runner state: ${baseState}`}>
      <BaseNode aria-hidden="true" className="second" $isOccupied={occupiedBases.second} />
      <BaseNode aria-hidden="true" className="third" $isOccupied={occupiedBases.third} />
      <BaseNode aria-hidden="true" className="first" $isOccupied={occupiedBases.first} />
      <HomePlate aria-hidden="true" />
    </DiamondField>
  )
}

function CountBoard({ lineScore }: { lineScore: LineScore | null }) {
  const balls = lineScore?.balls ?? 0
  const strikes = lineScore?.strikes ?? 0
  const outs = lineScore?.outs ?? 0

  return (
    <CountGrid aria-label={`${balls} balls, ${strikes} strikes, ${outs} outs`}>
      <CountMetric>
        <span>B</span>
        <PipRow>
          {Array.from({ length: 4 }, (_, index) => (
            <Pip key={index} $isActive={index < balls} />
          ))}
        </PipRow>
      </CountMetric>
      <CountMetric>
        <span>S</span>
        <PipRow>
          {Array.from({ length: 3 }, (_, index) => (
            <Pip key={index} $isActive={index < strikes} />
          ))}
        </PipRow>
      </CountMetric>
      <CountMetric>
        <span>O</span>
        <PipRow>
          {Array.from({ length: 3 }, (_, index) => (
            <Pip key={index} $isActive={index < outs} />
          ))}
        </PipRow>
      </CountMetric>
    </CountGrid>
  )
}

function PlayerColumn({
  title,
  primary,
  secondary,
  align,
}: {
  title: string
  primary: string | undefined
  secondary: string[]
  align: 'left' | 'right'
}) {
  return (
    <PlayerColumnContainer $align={align}>
      <h4>{title}</h4>
      <div className="primary-player">{primary ?? '—'}</div>
      <div className="secondary-players">
        {secondary.map((text) => (
          <div key={text}>{text}</div>
        ))}
      </div>
    </PlayerColumnContainer>
  )
}

const ScoreboardCard = styled(motion.article)<{
  $awayColor: string
  $homeColor: string
  $isLive: boolean
}>`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 0.85rem;
  background:
    radial-gradient(circle at 18% 12%, ${({ $awayColor }) => rgba($awayColor, 0.34)}, transparent 34%) padding-box,
    radial-gradient(circle at 84% 18%, ${({ $homeColor }) => rgba($homeColor, 0.32)}, transparent 36%) padding-box,
    linear-gradient(
        135deg,
        ${({ $awayColor }) => rgba($awayColor, 0.24)},
        ${({ $homeColor }) => rgba($homeColor, 0.22)}
      )
      padding-box,
    linear-gradient(135deg, ${({ $awayColor }) => rgba($awayColor, 0.5)}, ${({ $homeColor }) => rgba($homeColor, 0.5)})
      border-box;
  border: 1px solid transparent;
  border-radius: 1.1rem;
  box-shadow:
    0 18px 54px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, ${({ $isLive }) => ($isLive ? 0.1 : 0.055)}),
        transparent
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.035) 0,
        rgba(255, 255, 255, 0.035) 1px,
        transparent 1px,
        transparent 28px
      );
    opacity: 0.42;
    transform: skewX(-12deg);
  }

  @media (width <= 620px) {
    padding: 0.75rem;
  }
`

const HeroHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;

  @media (width <= 620px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
  }
`

const StatusCluster = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--heading);
  font-size: 0.64rem;
  font-weight: bold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const LiveDot = styled.span<{ $isLive: boolean }>`
  width: 0.36rem;
  height: 0.36rem;
  background: ${({ $isLive }) => ($isLive ? '#75ff8d' : 'rgba(255, 255, 255, 0.45)')};
  border-radius: 50%;
  box-shadow: ${({ $isLive }) => ($isLive ? '0 0 18px rgba(117, 255, 141, 0.72)' : 'none')};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${({ $isLive }) => ($isLive ? 'live-pulse 1.8s ease-in-out infinite' : 'none')};
  }

  @keyframes live-pulse {
    50% {
      opacity: 0.55;
      transform: scale(1.45);
    }
  }
`

const VenueMeta = styled.div`
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.68rem;
  text-align: right;

  @media (width <= 620px) {
    text-align: left;
  }
`

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(7.75rem, 0.62fr) minmax(0, 1fr);
  gap: 0.6rem;
  align-items: stretch;
  margin-bottom: 0.7rem;

  @media (width <= 620px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const TeamPanel = styled.div<{ $align: 'left' | 'right'; $teamColor: string }>`
  min-width: 0;
  padding: 0.65rem;
  text-align: ${({ $align }) => $align};
  background:
    ${({ $align, $teamColor }) =>
      `linear-gradient(${getTeamPanelGradientAngle($align)}, ${rgba($teamColor, 0.3)}, rgba(0, 0, 0, 0.16)) padding-box`},
    ${({ $align, $teamColor }) =>
      `linear-gradient(${getTeamPanelGradientAngle($align)}, ${rgba($teamColor, 0.42)}, rgba(255, 255, 255, 0.1)) border-box`};
  border: 1px solid transparent;
  border-radius: 0.8rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);

  @media (width <= 620px) {
    &:first-child {
      grid-row: 1;
      grid-column: 1;
    }

    &:last-child {
      grid-row: 1;
      grid-column: 2;
    }
  }
`

const TeamCode = styled.div`
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.16em;
`

const TeamName = styled.h3`
  margin: 0.18rem 0 0;
  color: var(--heading);
  font-size: clamp(0.78rem, 2vw, 1.18rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
`

const ScoreValue = styled(motion.div)`
  margin-top: 0.38rem;
  color: var(--heading);
  font-size: clamp(2.6rem, 8vw, 4.8rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.08em;
  text-shadow: 0 10px 26px rgba(0, 0, 0, 0.24);
`

const SituationPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  padding: 0.6rem;
  background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.1), transparent 48%), rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.8rem;

  @media (width <= 620px) {
    grid-row: 2;
    grid-column: 1 / -1;
  }
`

const InningBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.25rem;
  color: var(--heading);
  font-size: 0.66rem;
  text-align: center;
  letter-spacing: -0.01em;
  gap: 0.22rem;
`

const DiamondField = styled.div`
  position: relative;
  width: 5.45rem;
  height: 4.45rem;
  color: rgba(255, 255, 255, 0.72);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3.15rem;
    height: 3.15rem;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 0.2rem;
    transform: translate(-50%, -50%) rotate(45deg);
  }
`

const BaseNode = styled.span<{ $isOccupied: boolean }>`
  position: absolute;
  z-index: 1;
  display: grid;
  width: 1.36rem;
  height: 1.36rem;
  color: ${({ $isOccupied }) => ($isOccupied ? '#101010' : 'rgba(255, 255, 255, 0.58)')};
  font-size: 0.46rem;
  font-weight: 900;
  background: ${({ $isOccupied }) => ($isOccupied ? '#f8f0c8' : 'rgba(255, 255, 255, 0.08)')};
  border: 1px solid ${({ $isOccupied }) => ($isOccupied ? 'rgba(248, 240, 200, 0.92)' : 'rgba(255, 255, 255, 0.18)')};
  border-radius: 0.3rem;
  box-shadow: ${({ $isOccupied }) => ($isOccupied ? '0 0 14px rgba(248, 240, 200, 0.38)' : 'none')};
  transform: rotate(45deg);
  place-items: center;

  &.first {
    top: 1.52rem;
    right: 0.32rem;
  }

  &.second {
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }

  &.third {
    top: 1.52rem;
    left: 0.32rem;
  }
`

const HomePlate = styled.span`
  position: absolute;
  bottom: 0;
  left: 50%;
  display: grid;
  width: 1.36rem;
  height: 0.92rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.44rem;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.22rem 0.22rem 0.4rem 0.4rem;
  transform: translateX(-50%);
  place-items: center;
`

const CountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 0.45rem;
`

const CountMetric = styled.div`
  display: grid;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.52rem;
  font-weight: 900;
  text-align: center;
  letter-spacing: 0.12em;
  gap: 0.24rem;
`

const PipRow = styled.div`
  display: flex;
  gap: 0.14rem;
`

const Pip = styled.span<{ $isActive: boolean }>`
  width: 0.3rem;
  height: 0.3rem;
  background: ${({ $isActive }) => ($isActive ? '#f8f0c8' : 'rgba(255, 255, 255, 0.16)')};
  border-radius: 50%;
  box-shadow: ${({ $isActive }) => ($isActive ? '0 0 12px rgba(248, 240, 200, 0.44)' : 'none')};
`

const LineScoreLedger = styled.table`
  width: 100%;
  overflow: hidden;
  font-size: 0.68rem;
  table-layout: fixed;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-spacing: 0;
  border-radius: 0.75rem;

  th,
  td {
    min-width: 1.55rem;
    padding: 0.34rem 0.28rem;
    color: rgba(255, 255, 255, 0.76);
    text-align: center;
  }

  thead th {
    color: rgba(255, 255, 255, 0.52);
    font-size: 0.54rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: rgba(255, 255, 255, 0.055);
  }

  tbody th {
    width: 2.25rem;
    color: var(--heading);
    font-weight: 900;
    text-align: left;
    letter-spacing: 0.08em;
  }

  tbody tr + tr th,
  tbody tr + tr td {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  .current-inning {
    background: rgba(255, 255, 255, 0.075);
  }

  .scoring-inning {
    color: #101010;
    font-weight: 900;
    background: rgba(248, 240, 200, 0.92);
  }

  .future-inning {
    color: rgba(255, 255, 255, 0.26);
  }

  .total {
    color: var(--heading);
    font-weight: 800;
    background: rgba(255, 255, 255, 0.07);
  }

  .runs {
    color: #f8f0c8;
  }

  @media (width <= 720px) {
    th,
    td {
      min-width: 0;
      padding-right: 0.16rem;
      padding-left: 0.16rem;
    }

    tbody th {
      width: 1.9rem;
    }

    th:last-child,
    td:last-child {
      padding-right: 0.16rem;
    }
  }
`

const PlayersSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin-top: 0.65rem;
`

const PlayerColumnContainer = styled.div<{ $align: 'left' | 'right' }>`
  min-width: 0;
  padding: 0.65rem;
  text-align: ${(props) => props.$align};
  background: rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.7rem;

  h4 {
    margin: 0 0 0.3rem;
    color: rgba(255, 255, 255, 0.56);
    font-size: 0.54rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .primary-player {
    margin-bottom: 0.25rem;
    color: var(--heading);
    font-size: 0.78rem;
    font-weight: bold;
  }

  .secondary-players {
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.66rem;
    line-height: 1.45;
  }

  @media (width <= 620px) {
    text-align: left;
  }
`

const PreviewPanel = styled.div`
  padding: 0.75rem;
  margin-top: 0.65rem;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 0.75rem;
`

const PreviewTitle = styled.h4`
  margin: 0 0 0.35rem;
  color: var(--heading);
  font-size: 0.86rem;
`

const PreviewBody = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.74rem;
  line-height: 1.55;
`
