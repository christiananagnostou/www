import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useState, useMemo, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { type StravaActivity } from '../../lib/strava'

interface ActivityHeatmapProps {
  activities: StravaActivity[]
  onDateClick: (date: string) => void
  year: number
  availableYears?: number[]
  onYearChange?: (year: number) => void
}

interface DayData {
  date: string
  count: number
  activities: StravaActivity[]
}

const ActivityHeatmap = ({ activities, onDateClick, year, availableYears, onYearChange }: ActivityHeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const handleMouseEnter = useCallback((el: HTMLDivElement, day: DayData) => {
    setHoveredDay(day)
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const x = rect.left - containerRect.left + rect.width / 2
    const y = rect.top - containerRect.top - 8 // 8px gap above cell
    setTooltipPos({ x, y })
  }, [])
  const clearHover = useCallback(() => {
    setHoveredDay(null)
    setTooltipPos(null)
  }, [])
  // Determine available years from activities
  const years =
    availableYears ??
    useMemo(() => {
      const set = new Set<number>()
      activities.forEach((a) => set.add(dayjs(a.pubDate).year()))
      return Array.from(set).sort((a, b) => a - b)
    }, [activities])
  const currentYear = year

  // Build map of all activities for quick lookup (memoized)
  const activityMap = useMemo(() => {
    const m = new Map<string, StravaActivity[]>()
    activities.forEach((act) => {
      const date = dayjs(act.pubDate).format('YYYY-MM-DD')
      if (!m.has(date)) m.set(date, [])
      m.get(date)!.push(act)
    })
    return m
  }, [activities])

  // Compute days for current year with leading padding so first week starts on Monday (ISO week assumption)
  const { weeks } = useMemo(() => {
    const firstDayOfYear = dayjs().year(currentYear).startOf('year')
    const lastDayOfYear = dayjs().year(currentYear).endOf('year')
    // Determine how many padding days before first day to align Monday=0 index (dayjs weekday 0=Sunday)
    const weekday = firstDayOfYear.day() // 0 Sunday ... 6 Saturday
    const paddingDays = (weekday + 6) % 7 // converts Sunday(0)->6, Monday(1)->0, ... to number of days before
    const days: DayData[] = []
    // Add padding days from previous year as empty slots
    for (let p = 0; p < paddingDays; p++) {
      const date = firstDayOfYear.subtract(paddingDays - p, 'day')
      const dateStr = date.format('YYYY-MM-DD')
      days.push({ date: dateStr, count: 0, activities: [] })
    }
    // Add all days of current year
    for (let d = 0; d <= lastDayOfYear.diff(firstDayOfYear, 'day'); d++) {
      const date = firstDayOfYear.add(d, 'day')
      const dateStr = date.format('YYYY-MM-DD')
      const dayActivities = activityMap.get(dateStr) || []
      days.push({ date: dateStr, count: dayActivities.length, activities: dayActivities })
    }
    // Group into weeks
    const weeks: DayData[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }
    return { weeks }
  }, [activityMap, currentYear])

  const getIntensity = (count: number): number => {
    if (count === 0) return 0
    if (count === 1) return 1
    if (count === 2) return 2
    if (count >= 3) return 3
    return 0
  }

  const getTooltipText = (day: DayData): string => {
    const date = dayjs(day.date)
    const dateStr = date.format('MMM D, YYYY')

    if (day.count === 0) {
      return `No activities on ${dateStr}`
    }

    const activityTypes = day.activities.reduce<Record<string, number>>((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {})

    const typesList = Object.entries(activityTypes)
      .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
      .join(', ')

    return `${day.count} activit${day.count === 1 ? 'y' : 'ies'} on ${dateStr}: ${typesList}`
  }

  return (
    <HeatmapContainer ref={containerRef}>
      <HeaderRow>
        <HeatmapTitle>Training Calendar {currentYear}</HeatmapTitle>
        {years.length > 1 && onYearChange && (
          <YearNav>
            <YearButton
              onClick={() => onYearChange(Math.max(years[0], currentYear - 1))}
              disabled={currentYear === years[0]}
              aria-label="Previous Year"
            >
              ◀
            </YearButton>
            <YearSelect
              value={currentYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onYearChange(parseInt(e.target.value))}
              aria-label="Select Year"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </YearSelect>
            <YearButton
              onClick={() => onYearChange(Math.min(years[years.length - 1], currentYear + 1))}
              disabled={currentYear === years[years.length - 1]}
              aria-label="Next Year"
            >
              ▶
            </YearButton>
          </YearNav>
        )}
      </HeaderRow>
      <HeatmapGrid ref={gridRef}>
        {weeks.map((week, weekIndex) => (
          <Week key={weekIndex}>
            {week.map((day, dayIndex) => (
              <Day
                key={day.date}
                $intensity={getIntensity(day.count)}
                $hasActivities={day.count > 0}
                onClick={() => day.count > 0 && onDateClick(day.date)}
                onMouseEnter={(e) => handleMouseEnter(e.currentTarget, day)}
                onMouseLeave={clearHover}
                title={getTooltipText(day)}
              />
            ))}
          </Week>
        ))}
      </HeatmapGrid>

      <Legend>
        <LegendText>Less</LegendText>
        <LegendSquare $intensity={0} />
        <LegendSquare $intensity={1} />
        <LegendSquare $intensity={2} />
        <LegendSquare $intensity={3} />
        <LegendText>More</LegendText>
      </Legend>

      {hoveredDay && tooltipPos && (
        <Tooltip style={{ left: tooltipPos.x, top: tooltipPos.y }}>{getTooltipText(hoveredDay)}</Tooltip>
      )}
    </HeatmapContainer>
  )
}

export default ActivityHeatmap

const HeatmapContainer = styled.div`
  position: relative;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const HeatmapTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, var(--heading), #c0c0c0 70%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`

const HeatmapGrid = styled.div`
  display: flex;
  gap: 3px;
  overflow-x: auto;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  backdrop-filter: blur(4px);

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`

const Week = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const Day = styled.div<{ $intensity: number; $hasActivities: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  cursor: ${(props) => (props.$hasActivities ? 'pointer' : 'default')};
  transition: all 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.03);

  background-color: ${(props) => {
    switch (props.$intensity) {
      case 0:
        return 'rgba(255,255,255,0.04)'
      case 1:
        return 'hsl(140deg 60% 25%)'
      case 2:
        return 'hsl(140deg 65% 35%)'
      case 3:
        return 'hsl(140deg 70% 45%)'
      default:
        return 'rgba(255,255,255,0.04)'
    }
  }};

  &:hover {
    outline: ${(props) => (props.$hasActivities ? '2px solid rgba(255,255,255,0.3)' : 'none')};
    transform: ${(props) => (props.$hasActivities ? 'scale(1.15)' : 'none')};
    border-color: ${(props) => (props.$hasActivities ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.03)')};
    box-shadow: ${(props) => (props.$hasActivities ? '0 0 8px rgba(255,255,255,0.1)' : 'none')};
  }
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
`

const LegendText = styled.span`
  margin: 0 6px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: var(--text-dark);
  background: none;
`

const LegendSquare = styled.div<{ $intensity: number }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  background-color: ${(props) => {
    switch (props.$intensity) {
      case 0:
        return 'rgba(255,255,255,0.04)'
      case 1:
        return 'hsl(140deg 60% 25%)'
      case 2:
        return 'hsl(140deg 65% 35%)'
      case 3:
        return 'hsl(140deg 70% 45%)'
      default:
        return 'rgba(255,255,255,0.04)'
    }
  }};
`

const Tooltip = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(17, 17, 17, 0.95);
  color: var(--text);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 20;
  pointer-events: none;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    border-width: 6px 6px 0 6px;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.12) transparent transparent transparent;
  }
`

const YearNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 0.25rem;
`

const YearButton = styled.button`
  background: transparent;
  color: var(--text-dark);
  border: none;
  padding: 0.4rem 0.5rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.25s ease;

  &:hover:enabled {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const YearSelect = styled.select`
  background: transparent;
  color: var(--text);
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.3px;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
  }

  option {
    background: var(--dark-bg);
    color: var(--text);
  }
`
