import { motion } from 'framer-motion'
import Head from 'next/head'
import { GetStaticProps } from 'next/types'
import { useState, useMemo } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import React from 'react'
import dynamic from 'next/dynamic'
import { pageAnimation, fade, staggerFade } from '../components/animation'
import { type StravaActivity, getStravaActivities, refreshAccessToken } from '../lib/strava'
import { BASE_URL } from '../lib/constants'
import { hike, ride, run, swim, weight, zwift } from '../components/SVG/strava/icons'
import MiniMap from '../components/Home/StravaMinimap'
import ActivityHeatmap from '../components/Fitness/ActivityHeatmap'
import { Section, SectionHeader, Grid, Button } from '../components/Shared/Section'

const PageTitle = 'Fitness | Christian Anagnostou'
const PageDescription = "Christian Anagnostou's fitness activities and workout history"
const PageUrl = `${BASE_URL}/fitness`

// Lazy load charts component (uPlot-based, very small once gzip)
const FitnessCharts = dynamic(() => import('../components/Fitness/FitnessCharts'), {
  ssr: false,
  loading: () => <div style={{ margin: '2rem 0', opacity: 0.5, fontSize: '.8rem' }}>Loading charts…</div>,
})

type Props = { activities: StravaActivity[] }

const ActivityIcons: Record<string, React.ReactElement> = {
  Swim: swim(),
  Ride: ride(),
  Run: run(),
  WeightTraining: weight(),
  Hike: hike(),
  Zwift: zwift(),
  Walk: run(),
  VirtualRide: zwift(),
  Workout: weight(),
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
      const e = map.get(wk)!
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
      m.set(a.type, (m.get(a.type) || 0) + 1)
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
        <meta name="description" content={PageDescription} />
        <link rel="canonical" href={PageUrl} />
      </Head>
      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
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
              <label>miles</label>
            </HeroStat>
            <HeroStat>
              <span>{stats.totalHours}</span>
              <label>hours</label>
            </HeroStat>
            <HeroStat>
              <span>{stats.totalElevation}k</span>
              <label>ft climbed</label>
            </HeroStat>
            <HeroStat>
              <span>{stats.currentStreak}</span>
              <label>day streak</label>
            </HeroStat>
          </div>
        </Hero>

        <CompactFilterSection variants={fade}>
          <FilterRow>
            <YearSelector>
              <label htmlFor="yearSelect">Year</label>
              <select id="yearSelect" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                {years.map((y) => (
                  <option value={y} key={y}>
                    {y}
                  </option>
                ))}
              </select>
            </YearSelector>

            <ActivityTypeFilters>
              <label>Activity Types</label>
              <ChipContainer>
                {uniqueActivityTypes.map((type) => {
                  const active = selectedTypes.includes(type)
                  return (
                    <Button
                      key={type}
                      type="button"
                      $variant="chip"
                      $size="sm"
                      $active={active}
                      onClick={() => toggleType(type)}
                    >
                      {type}
                    </Button>
                  )
                })}
              </ChipContainer>
              <FilterActions>
                <button type="button" disabled={!selectedTypes.length} onClick={() => setSelectedTypes([])}>
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
          <Grid $minWidth="320px" $gap="1.5rem">
            <FitnessCharts
              weekly={{ labels: weeklyLabels, miles: weeklyMilesSeries, hours: weeklyHoursSeries }}
              distribution={{ labels: typeLabels, counts: typeCounts }}
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
            onDateClick={handleDateClick}
            year={year}
            availableYears={years}
            onYearChange={setYear}
          />
        </Section>

        <Section variants={fade}>
          <SectionHeader>
            <h2>Activity Log</h2>
            <div className="section-meta">
              {
                activities.filter(
                  (a) =>
                    dayjs(a.pubDate).year() === year && (selectedTypes.length ? selectedTypes.includes(a.type) : true)
                ).length
              }{' '}
              activities
            </div>
          </SectionHeader>
          <ActivitiesList variants={staggerFade}>
            {activities
              .filter((a) => dayjs(a.pubDate).year() === year)
              .filter((a) => (selectedTypes.length ? selectedTypes.includes(a.type) : true))
              .map((activity, idx) => {
                const pubDate = dayjs(activity.pubDate)
                const isToday = pubDate.isSame(dayjs(), 'day')
                const isYesterday = pubDate.isSame(dayjs().subtract(1, 'day'), 'day')
                return (
                  <ActivityItem
                    key={activity.guid + idx}
                    variants={fade}
                    id={`activity-${pubDate.format('YYYY-MM-DD')}`}
                  >
                    <ActivityItemLeft>
                      <ActivityTypeIcon title={activity.type}>
                        {ActivityIcons[activity.type] || activity.type}
                      </ActivityTypeIcon>
                      <ActivityItemInfo>
                        <ActivityItemTitle>{activity.title}</ActivityItemTitle>
                        <ActivityItemDate>
                          {isToday ? 'Today' : isYesterday ? 'Yesterday' : pubDate.format('MMM D, YYYY')}
                        </ActivityItemDate>
                      </ActivityItemInfo>
                    </ActivityItemLeft>

                    <ActivityItemRight>
                      {activity.MapPolyline && (
                        <ActivityItemMap>
                          <MiniMap polyline={activity.MapPolyline} width={48} height={48} />
                        </ActivityItemMap>
                      )}
                      <ActivityItemStats>
                        {activity.Distance && <ActivityItemStat>{activity.Distance}</ActivityItemStat>}
                        {activity.MovingTime && <ActivityItemStat>{activity.MovingTime}</ActivityItemStat>}
                        {activity.Pace && <ActivityItemStat>{activity.Pace}</ActivityItemStat>}
                        {activity.AverageSpeed && <ActivityItemStat>{activity.AverageSpeed}</ActivityItemStat>}
                      </ActivityItemStats>
                    </ActivityItemRight>
                  </ActivityItem>
                )
              })}
          </ActivitiesList>
        </Section>
      </Container>
    </>
  )
}
export default FitnessPage

const Container = styled(motion.section)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

const Hero = styled(motion.section)`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2.5rem clamp(1.25rem, 3vw, 3rem);
  margin: 1rem 0 2.75rem;
  padding: 2.25rem clamp(1.5rem, 3vw, 2.75rem) 2.4rem;
  background: linear-gradient(135deg, var(--dark-bg) 0%, #181818 40%, #1f1f1f 100%);
  border: 1px solid #202020;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow:
    0 4px 18px -8px rgba(0, 0, 0, 0.6),
    0 1px 0 rgba(255, 255, 255, 0.02) inset;

  &:before,
  &:after {
    content: '';
    position: absolute;
    pointer-events: none;
  }

  &:before {
    inset: 0;
    background:
      radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.06), transparent 55%),
      linear-gradient(160deg, rgba(255, 255, 255, 0.05), transparent 60%);
    mix-blend-mode: overlay;
    opacity: 0.85;
  }

  &:after {
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0) 35% 65%,
      rgba(255, 255, 255, 0.07)
    );
    mask:
      linear-gradient(#000, #000) content-box,
      linear-gradient(#000, #000);
    -webkit-mask:
      linear-gradient(#000, #000) content-box,
      linear-gradient(#000, #000);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.55;
  }

  .hero-left {
    max-width: 540px;
    position: relative;
    z-index: 2;
  }

  h1 {
    margin: 0 0 0.65rem;
    font-size: clamp(1.9rem, 5vw, 2.9rem);
    line-height: 1.05;
    background: linear-gradient(90deg, var(--heading), #d0d0d0 55%, #a7a7a7);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    letter-spacing: 0.5px;
  }
  p {
    margin: 0.4rem 0;
    color: var(--text-dark);
    font-weight: 300;
  }
  .streak-line {
    font-size: 0.8rem;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    opacity: 0.85;
    margin-top: 0.75rem;
  }

  .hero-grid {
    --tile-min: 92px;
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--tile-min), 1fr));
    gap: 0.85rem;
    flex: 1;
    min-width: 260px;
    z-index: 2;

    .hero-grid-header {
      display: flex;
      align-items: center;
      justify-content: left;
      grid-column: 1 / -1;
      margin-bottom: 0.5rem;
      width: 100%;

      .lifetime-label {
        font-size: 0.6rem;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: var(--text-dark);
        font-weight: 600;
        padding: 0.35rem 0.75rem;
      }
    }
  }
  @media (max-width: 880px) {
    gap: 2rem 1.75rem;
    padding: 1.8rem 1.5rem 2rem;
  }
  @media (max-width: 620px) {
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
  align-items: center;
  justify-content: center;
  padding: 0.85rem 0.65rem 0.9rem;
  background: var(--tile-bg);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-md);
  min-width: 86px;
  isolation: isolate;
  overflow: hidden;
  box-shadow:
    0 2px 6px -2px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.015) inset;
  backdrop-filter: blur(4px);
  transition:
    border-color 0.25s ease,
    transform 0.25s ease;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(140deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0) 40%),
      radial-gradient(circle at 30% 110%, rgba(255, 255, 255, 0.15), transparent 60%);
    mix-blend-mode: overlay;
    opacity: 0.9;
    pointer-events: none;
  }
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0) 35% 65%,
      rgba(255, 255, 255, 0.08)
    );
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }
  span {
    font-size: clamp(1.25rem, 2.8vw, 1.85rem);
    font-weight: 600;
    letter-spacing: 0.5px;
    color: var(--heading);
    line-height: 1.05;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.35));
  }
  label {
    margin-top: 0.4rem;
    font-size: 0.55rem;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-dark);
    font-weight: 500;
    opacity: 0.9;
  }
  &:hover {
    border-color: rgba(255, 255, 255, 0.16);
  }
  &:hover:after {
    opacity: 0.85;
  }
  @media (max-width: 620px) {
    padding: 0.75rem 0.55rem 0.8rem;
    span {
      font-size: clamp(1.15rem, 5vw, 1.6rem);
    }
  }
`

const ActivitiesList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

// Year Statistics Components
const YearStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const PrimaryStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const PrimaryStatTile = styled(motion.div)`
  position: relative;
  background: linear-gradient(135deg, #1e1e1e 0%, #191919 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius-md);
  padding: 2rem 1.75rem 2.25rem;
  overflow: hidden;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.06), transparent 50%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 60%);
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 60%);
    -webkit-mask:
      linear-gradient(#000, #000) content-box,
      linear-gradient(#000, #000);
    mask:
      linear-gradient(#000, #000) content-box,
      linear-gradient(#000, #000);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.4);

    &:after {
      opacity: 0.7;
    }
  }
`

const PrimaryStatNumber = styled.div`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--heading);
  line-height: 1;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, var(--heading), var(--accent) 70%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`

const PrimaryStatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-dark);
  letter-spacing: 0.5px;
  font-weight: 500;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`

const StatProgress = styled.div<{ $percentage: number }>`
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius-xs);
  z-index: 2;
  margin-top: 0.25rem;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $percentage }) => Math.min($percentage, 100)}%;
    background: linear-gradient(90deg, var(--accent), #4fa3ff);
    border-radius: var(--border-radius-xs);
    transition: width 0.6s ease;
  }
`

const ProgressLabel = styled.div`
  position: absolute;
  right: 0;
  top: -1.25rem;
  font-size: 0.6rem;
  color: var(--text-dark);
  letter-spacing: 0.5px;
  opacity: 0.8;
  font-weight: 500;
`

const SecondaryStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
`

const SecondaryStatTile = styled(motion.div)`
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-sm);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
    box-shadow: 0 4px 20px -8px rgba(0, 0, 0, 0.3);
  }
`

const SecondaryStatNumber = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--heading);
  line-height: 1;
  margin-bottom: 0.25rem;
`

const SecondaryStatLabel = styled.div`
  font-size: 0.7rem;
  color: var(--text-dark);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.9;
`

// New Minimal Activity List Components
const ActivityItem = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-lg);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
    box-shadow: 0 4px 16px -8px rgba(0, 0, 0, 0.3);
  }

  &.pulse {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.3);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }
`

const ActivityItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
`

const ActivityTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, var(--accent), #404040);
  border-radius: var(--border-radius-lg);
  flex-shrink: 0;

  svg {
    width: 1rem;
    height: 1rem;
    color: var(--dark-bg);
  }
`

const ActivityItemInfo = styled.div`
  min-width: 0;
  flex: 1;
`

const ActivityItemTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--heading);
  line-height: 1.2;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ActivityItemDate = styled.div`
  font-size: 0.65rem;
  color: var(--text-dark);
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`

const ActivityItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`

const ActivityItemStats = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`

const ActivityItemStat = styled.div`
  font-size: 0.7rem;
  color: var(--text-dark);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.06);
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.3px;
`

const ActivityItemMap = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
`

// Compact Filter Section Components
const CompactFilterSection = styled(motion.section)`
  position: relative;
  background: linear-gradient(135deg, var(--dark-bg) 0%, #171717 50%, #1a1a1a 100%);
  border: 1px solid #242424;
  border-radius: var(--border-radius-md);
  padding: 1.5rem clamp(1.25rem, 3vw, 2.25rem);
  margin: 0 0 2rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 32px -12px rgba(0, 0, 0, 0.4),
    0 2px 0 rgba(255, 255, 255, 0.02) inset;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.04), transparent 45%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.03), transparent 55%);
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`

const FilterRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
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
    font-size: 0.6rem;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-dark);
    font-weight: 600;
  }

  select {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: var(--text);
    padding: 0.45rem 0.6rem;
    border-radius: var(--border-radius-md);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.25s ease;
    font-weight: 500;

    &:hover,
    &:focus {
      border-color: rgba(255, 255, 255, 0.15);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
      outline: none;
    }

    option {
      background: var(--dark-bg);
      color: var(--text);
    }
  }
`

const ActivityTypeFilters = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 280px;

  label {
    font-size: 0.6rem;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-dark);
    font-weight: 600;
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
    background: none;
    border: none;
    color: var(--text-dark);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: var(--border-radius-sm);
    transition: all 0.2s ease;

    &:hover:enabled {
      color: var(--text);
      background: rgba(255, 255, 255, 0.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`
