import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import type { GetStaticProps } from 'next/types'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import ActivityHeatmap from '../components/Fitness/ActivityHeatmap'
import { Button, Grid, Section, SectionHeader } from '../components/Shared/Section'
import { BASE_URL } from '../lib/constants'
import { type StravaActivity, getStravaActivities, refreshAccessToken } from '../lib/strava'

const PageTitle = 'Fitness | Christian Anagnostou'
const PageDescription = "Christian Anagnostou's fitness activities and workout history"
const PageUrl = `${BASE_URL}/fitness`

// Lazy load charts component (uPlot-based, very small once gzip)
const FitnessCharts = dynamic(() => import('../components/Fitness/FitnessCharts'), {
  ssr: false,
  loading: () => <div>Loading charts…</div>,
})

interface Props {
  activities: StravaActivity[]
}

interface FitnessStats {
  totalDays: number
  totalMiles: number
  totalHours: number
  totalElevation: number
  yearMiles: number
  yearHours: number
  avgWeeklyMiles: number
  avgWeeklyHours: number
  currentStreak: number
  longestStreak: number
}

export const getStaticProps: GetStaticProps = async () => {
  await refreshAccessToken()
  const activities = await getStravaActivities()
  return { props: { activities }, revalidate: 60 * 60 * 12 }
}

// Parsing helpers (activities already store pre-formatted values like "12.34 mi")
const parseMiles = (distance?: string) => (distance ? Number(distance.replace(/ mi$/, '')) || 0 : 0)
const parseSeconds = (moving?: string) => {
  if (!moving) return 0
  const parts = moving.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}
const parseElevation = (elev?: string) => (elev ? Number(elev.replace(/ ft$/, '')) || 0 : 0)

// Helper: compute week number (1-based) without dayjs plugins
const getWeekNumber = (d: dayjs.Dayjs) => Math.floor(d.diff(d.startOf('year'), 'day') / 7) + 1

const calculateStats = (all: StravaActivity[], year: number, selectedTypes: string[]): FitnessStats => {
  const filtered = all.filter((a) => !selectedTypes.length || selectedTypes.includes(a.type))
  const uniqueDays = new Set<string>()
  let totalMiles = 0,
    totalSeconds = 0,
    totalElevation = 0,
    yearMiles = 0,
    yearSeconds = 0
  const yStart = dayjs().year(year).startOf('year')
  const yEnd = dayjs().year(year).endOf('year')
  filtered.forEach((a) => {
    const miles = parseMiles(a.Distance)
    const secs = parseSeconds(a.MovingTime)
    const elev = parseElevation(a.ElevationGain)
    totalMiles += miles
    totalSeconds += secs
    totalElevation += elev
    const d = dayjs(a.pubDate)
    uniqueDays.add(d.format('YYYY-MM-DD'))
    if (d.isAfter(yStart.subtract(1, 'day')) && d.isBefore(yEnd.add(1, 'day'))) {
      yearMiles += miles
      yearSeconds += secs
    }
  })
  // streaks
  const daysSorted = Array.from(uniqueDays).sort()
  let current = 0,
    longest = 0,
    prev: dayjs.Dayjs | null = null
  daysSorted.forEach((ds) => {
    const d = dayjs(ds)
    if (prev && d.diff(prev, 'day') === 1) current += 1
    else current = 1
    if (current > longest) longest = current
    prev = d
  })
  // weekly averages (week numbers inside year using helper)
  const weeksSet = new Set<number>()
  filtered.filter((a) => dayjs(a.pubDate).year() === year).forEach((a) => weeksSet.add(getWeekNumber(dayjs(a.pubDate))))
  const weekCount = weeksSet.size || 1
  const avgWeeklyMiles = yearMiles / weekCount
  const avgWeeklyHours = yearSeconds / 3600 / weekCount
  return {
    totalDays: uniqueDays.size,
    totalMiles: Math.round(totalMiles),
    totalHours: Math.round(totalSeconds / 3600),
    totalElevation: Math.round(totalElevation / 1000),
    yearMiles: Math.round(yearMiles),
    yearHours: Math.round(yearSeconds / 3600),
    avgWeeklyMiles: Math.round(avgWeeklyMiles * 10) / 10,
    avgWeeklyHours: Math.round(avgWeeklyHours * 10) / 10,
    currentStreak: current,
    longestStreak: longest,
  }
}

const FitnessPage = ({ activities }: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const years = useMemo(() => {
    const s = new Set<number>()
    activities.forEach((a) => s.add(dayjs(a.pubDate).year()))
    return Array.from(s).sort((a, b) => a - b)
  }, [activities])
  const [year, setYear] = useState(years[years.length - 1])
  const stats = useMemo(() => calculateStats(activities, year, selectedTypes), [activities, year, selectedTypes])

  // Weekly trend data
  interface WeeklyPoint {
    week: number
    miles: number
    hours: number
  }
  const weeklyTrend: WeeklyPoint[] = useMemo(() => {
    const map = new Map<number, { miles: number; seconds: number }>()
    activities.forEach((a) => {
      const d = dayjs(a.pubDate)
      if (d.year() !== year) return
      if (selectedTypes.length && !selectedTypes.includes(a.type)) return
      const wk = getWeekNumber(d)
      if (!map.has(wk)) map.set(wk, { miles: 0, seconds: 0 })
      const e = map.get(wk) as { miles: number; seconds: number }
      e.miles += parseMiles(a.Distance)
      e.seconds += parseSeconds(a.MovingTime)
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([week, v]) => ({ week, miles: v.miles, hours: v.seconds / 3600 }))
  }, [activities, year, selectedTypes])

  // Type distribution
  const typeDistribution = useMemo(() => {
    const m = new Map<string, number>()
    activities.forEach((a) => {
      if (dayjs(a.pubDate).year() !== year) return
      if (selectedTypes.length && !selectedTypes.includes(a.type)) return
      m.set(a.type, (m.get(a.type) ?? 0) + 1)
    })
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1])
  }, [activities, year, selectedTypes])

  const handleDateClick = (date: string) => {
    const el = document.getElementById(`activity-${date}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('pulse')
      setTimeout(() => el.classList.remove('pulse'), 1600)
    }
  }

  const activityCounts = useMemo(
    () =>
      activities.reduce<Record<string, number>>((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1
        return acc
      }, {}),
    [activities]
  )
  const uniqueActivityTypes = useMemo(() => {
    const priorityTypes = ['Ride', 'Run', 'Swim', 'Zwift']
    const allTypes = Object.keys(activityCounts).sort()
    const otherTypes = allTypes.filter((type) => !priorityTypes.includes(type))
    return [...priorityTypes.filter((type) => allTypes.includes(type)), ...otherTypes]
  }, [activityCounts])
  const toggleType = (type: string) =>
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))

  // earliest + timeline extents
  const earliest = useMemo(
    () =>
      activities.reduce(
        (min, a) => (dayjs(a.pubDate).isBefore(min) ? dayjs(a.pubDate) : min),
        dayjs(activities[0].pubDate)
      ),
    [activities]
  )
  const today = dayjs()
  const totalDaysActive = today.diff(earliest, 'day') + 1
  const yearsActive = Math.floor(totalDaysActive / 365)
  const monthsActive = Math.floor((totalDaysActive % 365) / 30)
  const daysRemainder = totalDaysActive - yearsActive * 365 - monthsActive * 30

  // Derived metrics
  const totalActivities = useMemo(
    () => activities.filter((a) => !selectedTypes.length || selectedTypes.includes(a.type)).length,
    [activities, selectedTypes]
  )
  const avgMilesPerActivity = totalActivities ? (stats.totalMiles / totalActivities).toFixed(1) : '0'
  const yearActivities = useMemo(
    () =>
      activities.filter(
        (a) => dayjs(a.pubDate).year() === year && (!selectedTypes.length || selectedTypes.includes(a.type))
      ).length,
    [activities, year, selectedTypes]
  )
  const daysElapsedThisYear =
    today.year() === year
      ? today.diff(dayjs().startOf('year'), 'day') + 1
      : dayjs(`${year}-12-31`).diff(dayjs(`${year}-01-01`), 'day') + 1
  const avgMilesPerDayYear = stats.yearMiles ? (stats.yearMiles / daysElapsedThisYear).toFixed(1) : '0'

  // Data for charts
  const weeklyLabels = weeklyTrend.map((p) => p.week)
  const weeklyMilesSeries = weeklyTrend.map((p) => p.miles)
  const weeklyHoursSeries = weeklyTrend.map((p) => p.hours)
  const typeLabels = typeDistribution.map((t) => t[0])
  const typeCounts = typeDistribution.map((t) => t[1])

  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta content={PageDescription} name="description" />
        <link href={PageUrl} rel="canonical" />
      </Head>
      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <Hero variants={fade}>
          <div className="hero-left">
            <h1>Fitness</h1>
            <p>Swim · Bike · Run · Strength — consolidated training history.</p>
            <p className="streak-line">
              Since {earliest.format('MMM D, YYYY')} · {yearsActive}y {monthsActive}m {daysRemainder}d ·{' '}
              {totalDaysActive} days
            </p>
          </div>
          <div className="hero-grid">
            <div className="hero-grid-header">
              <span className="lifetime-label">Lifetime Totals</span>
            </div>
            <HeroStat>
              <span>{stats.totalMiles}</span>
              <span className="stat-label">miles</span>
            </HeroStat>
            <HeroStat>
              <span>{stats.totalHours}</span>
              <span className="stat-label">hours</span>
            </HeroStat>
            <HeroStat>
              <span>{stats.totalElevation}k</span>
              <span className="stat-label">ft climbed</span>
            </HeroStat>
            <HeroStat>
              <span>{stats.currentStreak}</span>
              <span className="stat-label">day streak</span>
            </HeroStat>
          </div>
        </Hero>

        <CompactFilterSection variants={fade}>
          <FilterRow>
            <YearSelector>
              <label htmlFor="yearSelect">Year</label>
              <select id="yearSelect" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </YearSelector>

            <ActivityTypeFilters>
              <span className="filter-label">Activity Types</span>
              <ChipContainer>
                {uniqueActivityTypes.map((type) => {
                  const active = selectedTypes.includes(type)
                  return (
                    <Button
                      key={type}
                      $active={active}
                      $size="sm"
                      $variant="chip"
                      type="button"
                      onClick={() => toggleType(type)}
                    >
                      {type}
                    </Button>
                  )
                })}
              </ChipContainer>
              <FilterActions>
                <button disabled={!selectedTypes.length} type="button" onClick={() => setSelectedTypes([])}>
                  Clear
                </button>
                <button type="button" onClick={() => setSelectedTypes(uniqueActivityTypes)}>
                  All
                </button>
              </FilterActions>
            </ActivityTypeFilters>
          </FilterRow>
        </CompactFilterSection>

        <Section $variant="transparent" variants={staggerFade}>
          <SectionHeader>
            <h2>Year Statistics</h2>
            <div className="section-meta">{year}</div>
          </SectionHeader>

          <YearStatsContainer>
            {/* Primary Featured Stats */}
            <PrimaryStatsRow>
              <PrimaryStatTile variants={fade}>
                <PrimaryStatNumber>{stats.yearMiles}</PrimaryStatNumber>
                <PrimaryStatLabel>Miles in {year}</PrimaryStatLabel>
                <StatProgress $percentage={Math.min((stats.yearMiles / 3650) * 100, 100)}>
                  <ProgressLabel>3,650 mi</ProgressLabel>
                </StatProgress>
              </PrimaryStatTile>

              <PrimaryStatTile variants={fade}>
                <PrimaryStatNumber>{yearActivities}</PrimaryStatNumber>
                <PrimaryStatLabel>Activities in {year}</PrimaryStatLabel>
                <StatProgress $percentage={Math.min((yearActivities / 365) * 100, 100)}>
                  <ProgressLabel>365 activities</ProgressLabel>
                </StatProgress>
              </PrimaryStatTile>

              <PrimaryStatTile variants={fade}>
                <PrimaryStatNumber>{stats.yearHours}</PrimaryStatNumber>
                <PrimaryStatLabel>Hours in {year}</PrimaryStatLabel>
                <StatProgress $percentage={Math.min((stats.yearHours / 365) * 100, 100)}>
                  <ProgressLabel>365 hrs</ProgressLabel>
                </StatProgress>
              </PrimaryStatTile>
            </PrimaryStatsRow>

            {/* Secondary Stats Grid */}
            <SecondaryStatsGrid>
              <SecondaryStatTile variants={fade}>
                <div>
                  <SecondaryStatNumber>{stats.avgWeeklyMiles}</SecondaryStatNumber>
                  <SecondaryStatLabel>Avg Miles / Week</SecondaryStatLabel>
                </div>
              </SecondaryStatTile>

              <SecondaryStatTile variants={fade}>
                <div>
                  <SecondaryStatNumber>{stats.avgWeeklyHours}</SecondaryStatNumber>
                  <SecondaryStatLabel>Avg Hours / Week</SecondaryStatLabel>
                </div>
              </SecondaryStatTile>

              <SecondaryStatTile variants={fade}>
                <div>
                  <SecondaryStatNumber>{avgMilesPerActivity}</SecondaryStatNumber>
                  <SecondaryStatLabel>Avg Miles / Activity</SecondaryStatLabel>
                </div>
              </SecondaryStatTile>

              <SecondaryStatTile variants={fade}>
                <div>
                  <SecondaryStatNumber>{stats.longestStreak}</SecondaryStatNumber>
                  <SecondaryStatLabel>Longest Streak (Days)</SecondaryStatLabel>
                </div>
              </SecondaryStatTile>

              <SecondaryStatTile variants={fade}>
                <div>
                  <SecondaryStatNumber>{avgMilesPerDayYear}</SecondaryStatNumber>
                  <SecondaryStatLabel>Avg Miles / Day</SecondaryStatLabel>
                </div>
              </SecondaryStatTile>
            </SecondaryStatsGrid>
          </YearStatsContainer>
        </Section>

        <Section variants={fade}>
          <SectionHeader>
            <h2>Analytics</h2>
            <div className="section-meta">Performance Insights</div>
          </SectionHeader>
          <Grid $gap="1.5rem" $minWidth="320px">
            <FitnessCharts
              distribution={{ labels: typeLabels, counts: typeCounts }}
              weekly={{ labels: weeklyLabels, miles: weeklyMilesSeries, hours: weeklyHoursSeries }}
            />
          </Grid>
        </Section>

        <Section variants={fade}>
          <SectionHeader>
            <h2>Training Calendar</h2>
            <div className="section-meta">{year}</div>
          </SectionHeader>
          <ActivityHeatmap
            activities={activities.filter((a) => dayjs(a.pubDate).year() === year)}
            availableYears={years}
            year={year}
            onDateClick={handleDateClick}
            onYearChange={setYear}
          />
        </Section>
      </Container>
    </>
  )
}
export default FitnessPage

const Container = styled(motion.section)`
  max-width: var(--max-w-screen);
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text);
  overflow: hidden;
`

const Hero = styled(motion.section)`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2.5rem clamp(1.25rem, 3vw, 3rem);
  margin: 1rem 0 2.75rem;
  padding: 2.25rem clamp(1.5rem, 3vw, 2.75rem) 2.4rem;
  border: 1px solid #202020;
  border-radius: var(--border-radius-md);
  background: linear-gradient(135deg, var(--dark-bg) 0%, #181818 40%, #1f1f1f 100%);
  box-shadow:
    0 4px 18px -8px rgb(0 0 0 / 60%),
    0 1px 0 rgb(255 255 255 / 2%) inset;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
  }

  &::before {
    background:
      radial-gradient(circle at 85% 15%, rgb(255 255 255 / 6%), transparent 55%),
      linear-gradient(160deg, rgb(255 255 255 / 5%), transparent 60%);
    opacity: 0.85;
    inset: 0;
    mix-blend-mode: overlay;
  }

  &::after {
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(120deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 0%) 35% 65%, rgb(255 255 255 / 7%));
    opacity: 0.55;
    inset: 0;
    mask:
      linear-gradient(#000000, #000000) content-box,
      linear-gradient(#000000, #000000);
    mask-composite: xor;
    mask-composite: exclude;
  }

  .hero-left {
    position: relative;
    z-index: 2;
    max-width: 540px;
  }

  h1 {
    margin: 0 0 0.65rem;
    background: linear-gradient(90deg, var(--heading), #d0d0d0 55%, #a7a7a7);
    background-clip: text;
    font-size: clamp(1.9rem, 5vw, 2.9rem);
    line-height: 1.05;
    color: transparent;
    letter-spacing: 0.5px;
  }
  p {
    margin: 0.4rem 0;
    font-weight: 300;
    color: var(--text-dark);
  }
  .streak-line {
    margin-top: 0.75rem;
    opacity: 0.85;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .hero-grid {
    --tile-min: 92px;
    position: relative;
    z-index: 2;
    display: grid;
    flex: 1;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fit, minmax(var(--tile-min), 1fr));
    min-width: 260px;

    .hero-grid-header {
      display: flex;
      justify-content: left;
      align-items: center;
      width: 100%;
      margin-bottom: 0.5rem;
      grid-column: 1 / -1;

      .lifetime-label {
        padding: 0.35rem 0.75rem;
        font-weight: 600;
        font-size: 0.6rem;
        color: var(--text-dark);
        text-transform: uppercase;
        letter-spacing: 1.2px;
      }
    }
  }

  @media (width <= 880px) {
    gap: 2rem 1.75rem;
    padding: 1.8rem 1.5rem 2rem;
  }

  @media (width <= 620px) {
    .hero-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
`

const HeroStat = styled.div`
  --tile-bg: linear-gradient(180deg, #202020 0%, #181818 90%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 86px;
  padding: 0.85rem 0.65rem 0.9rem;
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: var(--border-radius-md);
  background: var(--tile-bg);
  box-shadow:
    0 2px 6px -2px rgb(0 0 0 / 60%),
    0 0 0 1px rgb(255 255 255 / 1.5%) inset;
  overflow: hidden;
  transition:
    border-color 0.25s ease,
    transform 0.25s ease;
  backdrop-filter: blur(4px);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    background:
      linear-gradient(140deg, rgb(255 255 255 / 12%), rgb(255 255 255 / 0%) 40%),
      radial-gradient(circle at 30% 110%, rgb(255 255 255 / 15%), transparent 60%);
    opacity: 0.9;
    pointer-events: none;
    inset: 0;
    mix-blend-mode: overlay;
  }
  &::after {
    content: '';
    position: absolute;
    background: linear-gradient(120deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 0%) 35% 65%, rgb(255 255 255 / 8%));
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
    inset: 0;
  }
  span {
    filter: drop-shadow(0 2px 2px rgb(0 0 0 / 35%));
    font-weight: 600;
    font-size: clamp(1.25rem, 2.8vw, 1.85rem);
    line-height: 1.05;
    color: var(--heading);
    letter-spacing: 0.5px;
  }
  .stat-label {
    margin-top: 0.4rem;
    opacity: 0.9;
    font-weight: 500;
    font-size: 0.55rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }
  &:hover {
    border-color: rgb(255 255 255 / 16%);
  }
  &:hover::after {
    opacity: 0.85;
  }

  @media (width <= 620px) {
    padding: 0.75rem 0.55rem 0.8rem;
    span {
      font-size: clamp(1.15rem, 5vw, 1.6rem);
    }
  }
`

// Year Statistics Components
const YearStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const PrimaryStatsRow = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

  @media (width <= 900px) {
    grid-template-columns: 1fr;
  }
`

const PrimaryStatTile = styled(motion.div)`
  position: relative;
  padding: 2rem 1.75rem 2.25rem;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: var(--border-radius-md);
  background: linear-gradient(135deg, #1e1e1e 0%, #191919 100%);
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    background:
      radial-gradient(circle at 80% 20%, rgb(255 255 255 / 6%), transparent 50%),
      linear-gradient(135deg, rgb(255 255 255 / 4%), transparent 60%);
    pointer-events: none;
    inset: 0;
    mix-blend-mode: overlay;
  }

  &::after {
    content: '';
    position: absolute;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgb(255 255 255 / 12%), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    inset: 0;
    mask:
      linear-gradient(#000000, #000000) content-box,
      linear-gradient(#000000, #000000);
    mask-composite: xor;
    mask-composite: exclude;
  }

  &:hover {
    border-color: rgb(255 255 255 / 15%);
    box-shadow: 0 12px 40px -8px rgb(0 0 0 / 40%);

    &::after {
      opacity: 0.7;
    }
  }
`

const PrimaryStatNumber = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, var(--heading), var(--accent) 70%);
  background-clip: text;
  filter: drop-shadow(0 4px 8px rgb(0 0 0 / 30%));
  font-weight: bold;
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  line-height: 1;
  color: var(--heading);
  color: transparent;
`

const PrimaryStatLabel = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 1rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-dark);
  letter-spacing: 0.5px;
`

const StatProgress = styled.div<{ $percentage: number }>`
  position: relative;
  z-index: 2;
  height: 4px;
  margin-top: 0.25rem;
  border-radius: var(--border-radius-xs);
  background: rgb(255 255 255 / 8%);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ $percentage }) => Math.min($percentage, 100)}%;
    height: 100%;
    border-radius: var(--border-radius-xs);
    background: linear-gradient(90deg, var(--accent), #4fa3ff);
    transition: width 0.6s ease;
  }
`

const ProgressLabel = styled.div`
  position: absolute;
  top: -1.25rem;
  right: 0;
  opacity: 0.8;
  font-weight: 500;
  font-size: 0.6rem;
  color: var(--text-dark);
  letter-spacing: 0.5px;
`

const SecondaryStatsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

  @media (width <= 640px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
`

const SecondaryStatTile = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: var(--border-radius-sm);
  background: linear-gradient(135deg, rgb(255 255 255 / 4%), rgb(255 255 255 / 2%));
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);

  &:hover {
    border-color: rgb(255 255 255 / 12%);
    background: linear-gradient(135deg, rgb(255 255 255 / 6%), rgb(255 255 255 / 3%));
    box-shadow: 0 4px 20px -8px rgb(0 0 0 / 30%);
  }
`

const SecondaryStatNumber = styled.div`
  margin-bottom: 0.25rem;
  font-weight: bold;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--heading);
`

const SecondaryStatLabel = styled.div`
  opacity: 0.9;
  font-weight: 500;
  font-size: 0.7rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

// Compact Filter Section Components
const CompactFilterSection = styled(motion.section)`
  position: relative;
  margin: 0 0 2rem;
  padding: 1.5rem clamp(1.25rem, 3vw, 2.25rem);
  border: 1px solid #242424;
  border-radius: var(--border-radius-md);
  background: linear-gradient(135deg, var(--dark-bg) 0%, #171717 50%, #1a1a1a 100%);
  box-shadow:
    0 8px 32px -12px rgb(0 0 0 / 40%),
    0 2px 0 rgb(255 255 255 / 2%) inset;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    background:
      radial-gradient(circle at 70% 20%, rgb(255 255 255 / 4%), transparent 45%),
      linear-gradient(145deg, rgb(255 255 255 / 3%), transparent 55%);
    pointer-events: none;
    inset: 0;
    mix-blend-mode: overlay;
  }
`

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 2rem;

  @media (width <= 768px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`

const YearSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 100px;

  label {
    font-weight: 600;
    font-size: 0.6rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }

  select {
    padding: 0.45rem 0.6rem;
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: var(--border-radius-md);
    background: linear-gradient(135deg, rgb(255 255 255 / 4%), rgb(255 255 255 / 2%));
    font-weight: 500;
    font-size: 0.75rem;
    color: var(--text);
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover,
    &:focus {
      border-color: rgb(255 255 255 / 15%);
      outline: none;
      background: linear-gradient(135deg, rgb(255 255 255 / 6%), rgb(255 255 255 / 3%));
    }

    option {
      background: var(--dark-bg);
      color: var(--text);
    }
  }
`

const ActivityTypeFilters = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 280px;

  .filter-label {
    font-weight: 600;
    font-size: 0.6rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }
`

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.25rem 0 0.5rem;
`

const FilterActions = styled.div`
  display: flex;
  gap: 0.6rem;

  button {
    padding: 0.2rem 0.4rem;
    border: none;
    border-radius: var(--border-radius-sm);
    background: none;
    font-weight: 600;
    font-size: 0.6rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:enabled {
      background: rgb(255 255 255 / 5%);
      color: var(--text);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`
