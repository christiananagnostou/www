import dayjs from 'dayjs'
import { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

type Discipline = 'swim' | 'bike' | 'run' | 'other'

interface HeatmapActivity {
  date: dayjs.Dayjs
  discipline: Discipline
  seconds: number
}

interface ActivityHeatmapProps {
  activities: HeatmapActivity[]
  startDate: dayjs.Dayjs
}

interface DayData {
  date: string
  totals: Record<Discipline, number>
}

const DISCIPLINE_COLORS: Record<Discipline, string> = {
  swim: '#47a8ff',
  bike: '#b5ff63',
  run: '#ff7b5f',
  other: '#9f9f9f',
}

const DISCIPLINE_ORDER: Discipline[] = ['swim', 'bike', 'run']

const getIntensity = (seconds: number) => {
  if (!seconds) return 0
  if (seconds < 1800) return 1
  if (seconds < 3600) return 2
  return 3
}

const ActivityHeatmap = ({ activities, startDate }: ActivityHeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const endDate = dayjs().endOf('day')
  const calendarStart = startDate.startOf('week')
  const calendarEnd = endDate.endOf('week')

  const activityMap = useMemo(() => {
    const map = new Map<string, Record<Discipline, number>>()
    activities.forEach((activity) => {
      const dateKey = activity.date.format('YYYY-MM-DD')
      if (!map.has(dateKey)) {
        map.set(dateKey, { swim: 0, bike: 0, run: 0, other: 0 })
      }
      const entry = map.get(dateKey) as Record<Discipline, number>
      entry[activity.discipline] += activity.seconds
    })
    return map
  }, [activities])

  const days = useMemo(() => {
    const totalDays = calendarEnd.diff(calendarStart, 'day') + 1
    return Array.from({ length: totalDays }, (_, i) => calendarStart.add(i, 'day'))
  }, [calendarEnd, calendarStart])

  const weeks = useMemo(() => {
    const rows: DayData[][] = []
    for (let i = 0; i < days.length; i += 7) {
      rows.push(
        days.slice(i, i + 7).map((date) => {
          const key = date.format('YYYY-MM-DD')
          return {
            date: key,
            totals: activityMap.get(key) ?? { swim: 0, bike: 0, run: 0, other: 0 },
          }
        })
      )
    }
    return rows
  }, [activityMap, days])

  const getTooltipText = (day: DayData) => {
    const dateStr = dayjs(day.date).format('MMM D, YYYY')
    const lines = DISCIPLINE_ORDER.map((discipline) => {
      const hours = day.totals[discipline] / 3600
      return `${DISCIPLINE_CONFIG[discipline]}: ${hours ? hours.toFixed(1) : '0'}h`
    })
    return `${dateStr}\n${lines.join('\n')}`
  }

  const handleMouseEnter = useCallback((el: HTMLButtonElement, day: DayData) => {
    setHoveredDay(day)
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const x = rect.left - containerRect.left + rect.width / 2
    const y = rect.top - containerRect.top - 8
    setTooltipPos({ x, y })
  }, [])

  const clearHover = useCallback(() => {
    setHoveredDay(null)
    setTooltipPos(null)
  }, [])

  return (
    <HeatmapContainer ref={containerRef}>
      <HeatmapHeader>
        <HeatmapTitle>Rolling Training Heatmap</HeatmapTitle>
        <HeatmapLegend>
          {DISCIPLINE_ORDER.map((discipline) => (
            <LegendItem key={discipline} $color={DISCIPLINE_COLORS[discipline]}>
              {DISCIPLINE_CONFIG[discipline]}
            </LegendItem>
          ))}
        </HeatmapLegend>
      </HeatmapHeader>
      <HeatmapGrid>
        <DayLabels>
          <DayLabel>S</DayLabel>
          <DayLabel />
          <DayLabel />
          <DayLabel>W</DayLabel>
          <DayLabel />
          <DayLabel />
          <DayLabel>S</DayLabel>
        </DayLabels>
        {weeks.map((week, weekIndex) => (
          <Week key={weekIndex}>
            {week.map((day) => {
              const date = dayjs(day.date)
              const isOutside = date.isBefore(startDate) || date.isAfter(endDate)
              return (
                <DayCell
                  key={day.date}
                  $isOutside={isOutside}
                  onMouseEnter={(event) => handleMouseEnter(event.currentTarget, day)}
                  onMouseLeave={clearHover}
                  title={getTooltipText(day)}
                  type="button"
                >
                  {DISCIPLINE_ORDER.map((discipline) => (
                    <DaySegment
                      key={discipline}
                      $color={DISCIPLINE_COLORS[discipline]}
                      $intensity={getIntensity(day.totals[discipline])}
                    />
                  ))}
                </DayCell>
              )
            })}
          </Week>
        ))}
      </HeatmapGrid>
      {hoveredDay && tooltipPos ? (
        <Tooltip style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          {getTooltipText(hoveredDay)
            .split('\n')
            .map((line) => (
              <span key={line}>{line}</span>
            ))}
        </Tooltip>
      ) : null}
    </HeatmapContainer>
  )
}

const DISCIPLINE_CONFIG: Record<Discipline, string> = {
  swim: 'Swim',
  bike: 'Bike',
  run: 'Run',
  other: 'Other',
}

export default ActivityHeatmap

const HeatmapContainer = styled.div`
  position: relative;
  color: var(--text);
`

const HeatmapHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

const HeatmapTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: var(--heading);
`

const HeatmapLegend = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const LegendItem = styled.span<{ $color: string }>`
  position: relative;
  padding-left: 1rem;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-dark);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
    transform: translateY(-50%);
  }
`

const HeatmapGrid = styled.div`
  display: flex;
  gap: 5px;
  padding: 1rem;
  border-radius: var(--border-radius-xl);
  border: 1px solid rgb(255 255 255 / 8%);
  background: linear-gradient(140deg, rgb(255 255 255 / 4%), transparent);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (width <= 640px) {
    padding: 0.75rem;
    gap: 4px;
  }
`

const Week = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const DayCell = styled.button<{ $isOutside: boolean }>`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  width: 18px;
  height: 18px;
  padding: 3px;
  border-radius: 7px;
  border: 1px solid rgb(255 255 255 / 6%);
  background: rgb(255 255 255 / 2%);
  opacity: ${({ $isOutside }) => ($isOutside ? 0.25 : 1)};
  cursor: default;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (width <= 640px) {
    width: 14px;
    height: 14px;
    padding: 2px;
  }
`

const DaySegment = styled.span<{ $color: string; $intensity: number }>`
  border-radius: 999px;
  background: ${({ $color }) => $color};
  opacity: ${({ $intensity }) => 0.15 + $intensity * 0.2};
`

const DayLabels = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 4px;
  margin-right: 0.5rem;
`

const DayLabel = styled.span`
  width: 14px;
  font-size: 0.55rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (width <= 640px) {
    width: 10px;
  }
`

const Tooltip = styled.div`
  position: absolute;
  z-index: 20;
  display: grid;
  gap: 0.2rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--border-radius-lg);
  border: 1px solid rgb(255 255 255 / 12%);
  background: rgb(17 17 17 / 95%);
  font-size: 0.65rem;
  color: var(--text);
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -100%);
`
