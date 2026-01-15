import dayjs from 'dayjs'
import { useCallback, useMemo, useRef, useState } from 'react'
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

const getIntensity = (count: number): number => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count >= 3) return 3
  return 0
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
  const yearsFromActivities = useMemo(() => {
    const set = new Set<number>()
    activities.forEach((a) => set.add(dayjs(a.pubDate).year()))
    return Array.from(set).sort((a, b) => a - b)
  }, [activities])
  const years = availableYears ?? yearsFromActivities
  const currentYear = year

  // Build map of all activities for quick lookup (memoized)
  const activityMap = useMemo(() => {
    const m = new Map<string, StravaActivity[]>()
    activities.forEach((act) => {
      const date = dayjs(act.pubDate).format('YYYY-MM-DD')
      if (!m.has(date)) m.set(date, [])
      m.get(date)?.push(act)
    })
    return m
  }, [activities])

  // Compute days for current year with leading padding so Sunday is at top of each week column
  const { weeks } = useMemo(() => {
    const firstDayOfYear = dayjs().year(currentYear).startOf('year')
    const lastDayOfYear = dayjs().year(currentYear).endOf('year')
    // Determine how many padding days before first day to align Sunday=0 index
    const weekday = firstDayOfYear.day() // 0 Sunday ... 6 Saturday
    const paddingDays = weekday // Sunday(0)->0, Monday(1)->1, Tuesday(2)->2, etc.
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

  const isDateInFuture = (dateStr: string): boolean => {
    const today = dayjs()
    const date = dayjs(dateStr)
    return date.isAfter(today, 'day')
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
        {years.length > 1 && onYearChange ? (
          <YearNav>
            <YearButton
              aria-label="Previous Year"
              disabled={currentYear === years[0]}
              onClick={() => onYearChange(Math.max(years[0], currentYear - 1))}
            >
              ◀
            </YearButton>
            <YearSelect
              aria-label="Select Year"
              value={currentYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onYearChange(parseInt(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </YearSelect>
            <YearButton
              aria-label="Next Year"
              disabled={currentYear === years[years.length - 1]}
              onClick={() => onYearChange(Math.min(years[years.length - 1], currentYear + 1))}
            >
              ▶
            </YearButton>
          </YearNav>
        ) : null}
      </HeaderRow>
      <HeatmapGrid ref={gridRef}>
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
            {week.map((day) => (
              <Day
                key={day.date}
                $hasActivities={day.count > 0}
                $intensity={getIntensity(day.count)}
                $isFuture={isDateInFuture(day.date)}
                title={getTooltipText(day)}
                onClick={() => day.count > 0 && onDateClick(day.date)}
                onMouseEnter={(e) => handleMouseEnter(e.currentTarget, day)}
                onMouseLeave={clearHover}
              />
            ))}
          </Week>
        ))}
      </HeatmapGrid>

      {hoveredDay && tooltipPos ? (
        <Tooltip style={{ left: tooltipPos.x, top: tooltipPos.y }}>{getTooltipText(hoveredDay)}</Tooltip>
      ) : null}
    </HeatmapContainer>
  )
}

export default ActivityHeatmap

const HeatmapContainer = styled.div`
  position: relative;
`

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const HeatmapTitle = styled.h3`
  margin: 0;
  background: linear-gradient(90deg, var(--heading), #c0c0c0 70%);
  background-clip: text;
  font-weight: 600;
  font-size: 1rem;
  color: transparent;
  letter-spacing: 0.5px;
`

const HeatmapGrid = styled.div`
  display: flex;
  gap: 3px;
  padding: 1rem;
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: var(--border-radius-xl);
  background: linear-gradient(135deg, rgb(255 255 255 / 2%), rgb(255 255 255 / 1%));
  overflow-x: auto;
  backdrop-filter: blur(4px);
  -ms-overflow-style: none;

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Week = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const Day = styled.div<{ $intensity: number; $hasActivities: boolean; $isFuture: boolean }>`
  width: 12px;
  height: 12px;
  border: 1px solid rgb(255 255 255 / 3%);
  border-radius: var(--border-radius-xs);

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
  opacity: ${(props) => (props.$isFuture ? 0.3 : 1)};
  cursor: ${(props) => (props.$hasActivities ? 'pointer' : 'default')};
  transition: all 0.25s ease;

  &:hover {
    border-color: ${(props) => (props.$hasActivities ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.03)')};
    outline: ${(props) => (props.$hasActivities ? '2px solid rgba(255,255,255,0.3)' : 'none')};
    box-shadow: ${(props) => (props.$hasActivities ? '0 0 8px rgba(255,255,255,0.1)' : 'none')};
    transform: ${(props) => (props.$hasActivities ? 'scale(1.15)' : 'none')};
  }
`

const Tooltip = styled.div`
  position: absolute;
  z-index: 20;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: var(--border-radius-lg);
  background: rgb(17 17 17 / 95%);
  box-shadow: 0 8px 32px -8px rgb(0 0 0 / 60%);
  font-size: 0.7rem;
  color: var(--text);
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -100%);
  backdrop-filter: blur(8px);

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    border-width: 6px 6px 0;
    border-style: solid;
    border-color: rgb(255 255 255 / 12%) transparent transparent;
    transform: translateX(-50%);
  }
`

const YearNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: var(--border-radius-lg);
  background: rgb(255 255 255 / 4%);
`

const YearButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  padding: 0.4rem 0.5rem;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  font-size: 0.8rem;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.25s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background: rgb(255 255 255 / 8%);
    color: var(--text);
    transform: translateY(-1px);
  }
`

const YearSelect = styled.select`
  padding: 0.4rem 0.5rem;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  font-weight: 500;
  font-size: 0.75rem;
  color: var(--text);
  letter-spacing: 0.3px;
  cursor: pointer;

  &:focus {
    outline: none;
    background: rgb(255 255 255 / 8%);
  }

  option {
    background: var(--dark-bg);
    color: var(--text);
  }
`

const DayLabels = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-right: 0.5rem;
`

const DayLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12px;
  height: 12px;
  font-weight: 500;
  font-size: 0.65rem;
  color: var(--text-dark);
  letter-spacing: 0.3px;
`
