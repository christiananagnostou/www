import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import type { GetStaticProps } from 'next/types'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import ActivityHeatmap from '../components/Fitness/ActivityHeatmap'
import { Grid } from '../components/Shared/Section'
import { BASE_URL } from '../lib/constants'
import { type StravaActivity, getStravaActivities, refreshAccessToken } from '../lib/strava'

const PageTitle = 'Fitness | Christian Anagnostou'
const PageDescription = "Christian Anagnostou's triathlon training dashboard"
const PageUrl = `${BASE_URL}/fitness`

const WINDOW_OPTIONS = [6, 12, 24]
const EVEREST_HEIGHT_FT = 29029
const OLYMPIC_POOL_MILES = 0.0311

const FitnessCharts = dynamic(async () => import('../components/Fitness/FitnessCharts'), {
  ssr: false,
  loading: () => <div>Loading charts…</div>,
})

const FitnessLaneChart = dynamic(async () => import('../components/Fitness/FitnessLaneChart'), {
  ssr: false,
  loading: () => <div>Loading chart…</div>,
})

interface Props {
  activities: StravaActivity[]
  error?: string
}

type Discipline = 'swim' | 'bike' | 'run' | 'other'

type BikeKind = 'road' | 'zwift'

interface ParsedActivity {
  activity: StravaActivity
  date: dayjs.Dayjs
  miles: number
  seconds: number
  elevation: number
  heartRate: number | null
  watts: number | null
  discipline: Discipline
  bikeKind?: BikeKind
}

interface ZoneStat {
  label: string
  seconds: number
}

interface LaneStats {
  discipline: Discipline
  label: string
  color: string
  miles: number
  hours: number
  elevation: number
  avgPace: number | null
  avgSpeed: number | null
  avgHeartRate: number | null
  avgWatts: number | null
  zones: ZoneStat[]
  weeklyMiles: number[]
  weeklyHours: number[]
  weeklyLabels: number[]
  weeklyHeartRate: Array<number | null>
  weeklyWatts: Array<number | null>
  bikeMix?: { roadHours: number; zwiftHours: number }
}

const DISCIPLINE_CONFIG: Record<Discipline, { label: string; color: string; accent: string }> = {
  swim: { label: 'Swim', color: '#47a8ff', accent: '#5fd3ff' },
  bike: { label: 'Bike', color: '#b5ff63', accent: '#f4ff7a' },
  run: { label: 'Run', color: '#ff7b5f', accent: '#ffb36a' },
  other: { label: 'Other', color: '#9f9f9f', accent: '#d4d4d4' },
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const requiredEnv = ['STRAVA_REFRESH_TOKEN', 'STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET', 'STRAVA_REDIRECT_URI']
  const missing = requiredEnv.filter((key) => !process.env[key])

  if (missing.length) {
    return {
      props: { activities: [], error: 'Strava credentials are not configured; fitness data is unavailable.' },
      revalidate: 60 * 30,
    }
  }

  try {
    await refreshAccessToken()
    const activities = await getStravaActivities()
    return { props: { activities }, revalidate: 60 * 60 * 12 }
  } catch (error) {
    console.error('Failed to load Strava activities', error)
    return {
      props: { activities: [], error: 'Unable to load Strava activities right now. Please try again soon.' },
      revalidate: 60 * 30,
    }
  }
}

const parseMiles = (distance?: string) => (distance ? Number(distance.replace(/ mi$/, '')) || 0 : 0)

const parseSeconds = (moving?: string) => {
  if (!moving) return 0
  const parts = moving.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

const parseElevation = (elev?: string) => (elev ? Number(elev.replace(/ ft$/, '')) || 0 : 0)

const classifyActivity = (activity: StravaActivity): { discipline: Discipline; bikeKind?: BikeKind } => {
  if (activity.type === 'Swim') return { discipline: 'swim' }
  if (activity.type === 'Run') return { discipline: 'run' }
  if (activity.type === 'Zwift' || activity.type === 'VirtualRide') {
    return { discipline: 'bike', bikeKind: 'zwift' }
  }
  if (activity.type === 'Ride') return { discipline: 'bike', bikeKind: 'road' }
  return { discipline: 'other' }
}

const getWeekIndex = (date: dayjs.Dayjs, start: dayjs.Dayjs) => date.diff(start, 'week')

const fillSparseSeries = (values: Array<number | null>) => {
  if (!values.length) return values
  const result = [...values]
  let lastIndex = -1

  values.forEach((value, index) => {
    if (value == null) return
    if (lastIndex === -1) {
      for (let i = 0; i < index; i += 1) {
        result[i] = value
      }
    } else {
      const previous = values[lastIndex] as number
      const gap = index - lastIndex
      for (let i = 1; i < gap; i += 1) {
        const t = i / gap
        result[lastIndex + i] = previous + (value - previous) * t
      }
    }
    lastIndex = index
  })

  if (lastIndex === -1) return values
  for (let i = lastIndex + 1; i < values.length; i += 1) {
    result[i] = values[lastIndex]
  }

  return result
}

const buildWeeklySeries = (items: ParsedActivity[], start: dayjs.Dayjs, weeks: number) => {
  const miles = Array.from({ length: weeks }, () => 0)
  const hours = Array.from({ length: weeks }, () => 0)
  const labels = Array.from({ length: weeks }, (_, i) => i + 1)

  const heartRateTotals = Array.from({ length: weeks }, () => 0)
  const heartRateSeconds = Array.from({ length: weeks }, () => 0)
  const wattsTotals = Array.from({ length: weeks }, () => 0)
  const wattsSeconds = Array.from({ length: weeks }, () => 0)

  items.forEach((item) => {
    const idx = getWeekIndex(item.date, start)
    if (idx < 0 || idx >= weeks) return
    miles[idx] += item.miles
    hours[idx] += item.seconds / 3600

    if (item.heartRate) {
      heartRateTotals[idx] += item.heartRate * item.seconds
      heartRateSeconds[idx] += item.seconds
    }

    if (item.watts) {
      wattsTotals[idx] += item.watts * item.seconds
      wattsSeconds[idx] += item.seconds
    }
  })

  const weeklyHeartRateRaw = heartRateTotals.map((total, idx) =>
    heartRateSeconds[idx] ? total / heartRateSeconds[idx] : null
  )
  const weeklyWattsRaw = wattsTotals.map((total, idx) => (wattsSeconds[idx] ? total / wattsSeconds[idx] : null))

  const weeklyHeartRate = fillSparseSeries(weeklyHeartRateRaw)
  const weeklyWatts = fillSparseSeries(weeklyWattsRaw)

  return { miles, hours, labels, weeklyHeartRate, weeklyWatts }
}

const buildZones = (items: ParsedActivity[], discipline: Discipline): ZoneStat[] => {
  const zones: ZoneStat[] =
    discipline === 'run'
      ? [
          { label: 'Easy 10+', seconds: 0 },
          { label: 'Steady 8-10', seconds: 0 },
          { label: 'Tempo 7-8', seconds: 0 },
          { label: 'Fast <7', seconds: 0 },
        ]
      : discipline === 'swim'
        ? [
            { label: 'Easy <1.5', seconds: 0 },
            { label: 'Steady 1.5-2', seconds: 0 },
            { label: 'Strong 2-2.5', seconds: 0 },
            { label: 'Sprint 2.5+', seconds: 0 },
          ]
        : [
            { label: 'Cruise <15', seconds: 0 },
            { label: 'Endurance 15-20', seconds: 0 },
            { label: 'Tempo 20-25', seconds: 0 },
            { label: 'Fast 25+', seconds: 0 },
          ]

  items.forEach((item) => {
    if (!item.miles || !item.seconds) return
    const hours = item.seconds / 3600
    const speed = item.miles / hours
    const pace = item.seconds / 60 / item.miles

    if (discipline === 'run') {
      if (pace >= 10) zones[0].seconds += item.seconds
      else if (pace >= 8) zones[1].seconds += item.seconds
      else if (pace >= 7) zones[2].seconds += item.seconds
      else zones[3].seconds += item.seconds
      return
    }

    if (discipline === 'swim') {
      if (speed < 1.5) zones[0].seconds += item.seconds
      else if (speed < 2) zones[1].seconds += item.seconds
      else if (speed < 2.5) zones[2].seconds += item.seconds
      else zones[3].seconds += item.seconds
      return
    }

    if (speed < 15) zones[0].seconds += item.seconds
    else if (speed < 20) zones[1].seconds += item.seconds
    else if (speed < 25) zones[2].seconds += item.seconds
    else zones[3].seconds += item.seconds
  })

  return zones
}

const formatHours = (hours: number) => hours.toFixed(0)

const FitnessPage = ({ activities, error }: Props) => {
  const [windowMonths, setWindowMonths] = useState(12)

  const parsedActivities = useMemo<ParsedActivity[]>(
    () =>
      activities.map((activity) => {
        const { discipline, bikeKind } = classifyActivity(activity)
        return {
          activity,
          date: dayjs(activity.pubDate),
          miles: parseMiles(activity.Distance),
          seconds: parseSeconds(activity.MovingTime),
          elevation: parseElevation(activity.ElevationGain),
          heartRate: activity.AverageHeartRate ?? null,
          watts: activity.AverageWatts ?? null,
          discipline,
          bikeKind,
        }
      }),
    [activities]
  )

  const windowEnd = dayjs().endOf('day')
  const windowStart = useMemo(() => windowEnd.subtract(windowMonths, 'month').startOf('day'), [windowEnd, windowMonths])

  const windowedActivities = useMemo(
    () => parsedActivities.filter((item) => item.date.isAfter(windowStart) && item.date.isBefore(windowEnd)),
    [parsedActivities, windowEnd, windowStart]
  )

  const weeksInWindow = Math.max(windowEnd.diff(windowStart, 'week') + 1, 1)

  const laneStats = useMemo(() => {
    const result: LaneStats[] = []

    ;(['swim', 'bike', 'run'] as Discipline[]).forEach((discipline) => {
      const laneItems = windowedActivities.filter((item) => item.discipline === discipline)
      const miles = laneItems.reduce((acc, item) => acc + item.miles, 0)
      const hours = laneItems.reduce((acc, item) => acc + item.seconds / 3600, 0)
      const elevation = laneItems.reduce((acc, item) => acc + item.elevation, 0)
      const weekly = buildWeeklySeries(laneItems, windowStart, weeksInWindow)
      const zones = buildZones(laneItems, discipline)
      const avgSpeed = hours ? miles / hours : null
      const avgPace = miles ? (hours * 60) / miles : null
      const heartRateSeconds = laneItems.reduce((acc, item) => (item.heartRate ? acc + item.seconds : acc), 0)
      const heartRateTotal = laneItems.reduce(
        (acc, item) => (item.heartRate ? acc + item.heartRate * item.seconds : acc),
        0
      )
      const wattsSeconds = laneItems.reduce((acc, item) => (item.watts ? acc + item.seconds : acc), 0)
      const wattsTotal = laneItems.reduce((acc, item) => (item.watts ? acc + item.watts * item.seconds : acc), 0)
      const avgHeartRate = heartRateSeconds ? heartRateTotal / heartRateSeconds : null
      const avgWatts = wattsSeconds ? wattsTotal / wattsSeconds : null

      const bikeMix =
        discipline === 'bike'
          ? {
              roadHours: laneItems
                .filter((item) => item.bikeKind === 'road')
                .reduce((acc, item) => acc + item.seconds / 3600, 0),
              zwiftHours: laneItems
                .filter((item) => item.bikeKind === 'zwift')
                .reduce((acc, item) => acc + item.seconds / 3600, 0),
            }
          : undefined

      result.push({
        discipline,
        label: DISCIPLINE_CONFIG[discipline].label,
        color: DISCIPLINE_CONFIG[discipline].color,
        miles,
        hours,
        elevation,
        avgPace,
        avgSpeed,
        avgHeartRate,
        avgWatts,
        zones,
        weeklyMiles: weekly.miles,
        weeklyHours: weekly.hours,
        weeklyLabels: weekly.labels,
        weeklyHeartRate: weekly.weeklyHeartRate,
        weeklyWatts: weekly.weeklyWatts,
        bikeMix,
      })
    })

    return result
  }, [weeksInWindow, windowStart, windowedActivities])

  const otherActivities = useMemo(
    () => windowedActivities.filter((item) => item.discipline === 'other'),
    [windowedActivities]
  )

  const totalHours = useMemo(
    () => windowedActivities.reduce((acc, item) => acc + item.seconds / 3600, 0),
    [windowedActivities]
  )

  const totalMiles = useMemo(() => windowedActivities.reduce((acc, item) => acc + item.miles, 0), [windowedActivities])

  const totalSessions = windowedActivities.length

  const totalElevation = useMemo(
    () => windowedActivities.reduce((acc, item) => acc + item.elevation, 0),
    [windowedActivities]
  )

  const everestCount = totalElevation / EVEREST_HEIGHT_FT

  const totalWeeklySeries = useMemo(
    () => buildWeeklySeries(windowedActivities, windowStart, weeksInWindow),
    [windowedActivities, windowStart, weeksInWindow]
  )

  const disciplineMix = useMemo(() => {
    const mix = { swim: 0, bike: 0, run: 0, other: 0 }
    windowedActivities.forEach((item) => {
      mix[item.discipline] += item.seconds / 3600
    })
    return mix
  }, [windowedActivities])

  const distributionLabels = ['Swim', 'Bike', 'Run', 'Other']
  const distributionCounts = [disciplineMix.swim, disciplineMix.bike, disciplineMix.run, disciplineMix.other]

  const bikeMixCounts = laneStats.find((lane) => lane.discipline === 'bike')?.bikeMix
  const bikeMixLabels = ['Road', 'Zwift']
  const bikeMixValues = bikeMixCounts ? [bikeMixCounts.roadHours, bikeMixCounts.zwiftHours] : [0, 0]

  const hasData = windowedActivities.length > 0

  if (!hasData) {
    return (
      <>
        <Head>
          <title>{PageTitle}</title>
          <meta content={PageDescription} name="description" />
          <link href={PageUrl} rel="canonical" />
        </Head>
        <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
          <SectionCard variants={fade}>
            <SectionHeaderText>
              <h2>Fitness</h2>
              <span>{error ?? 'Fitness data is not available right now. Please try again later.'}</span>
            </SectionHeaderText>
          </SectionCard>
        </Container>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta content={PageDescription} name="description" />
        <link href={PageUrl} rel="canonical" />
      </Head>
      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <HeroPanel variants={fade}>
          <HeroGlow />
          <HeroBadge>Rolling {windowMonths} months</HeroBadge>
          <HeroTitle>Triathlon Dashboard</HeroTitle>
          <HeroSubtitle>Swim · Bike · Run</HeroSubtitle>
          <HeroStats>
            <HeroStat>
              <span>{formatHours(totalHours)}</span>
              <small>training hours</small>
            </HeroStat>
            <HeroStat>
              <span>{totalMiles.toFixed(0)}</span>
              <small>miles covered</small>
            </HeroStat>
            <HeroStat>
              <span>{totalSessions}</span>
              <small>sessions logged</small>
            </HeroStat>
            <HeroStat>
              <span>{everestCount.toFixed(1)}x</span>
              <small>Everest climbed</small>
            </HeroStat>
          </HeroStats>
          <HeroControls>
            {WINDOW_OPTIONS.map((months) => (
              <ToggleButton key={months} $active={windowMonths === months} onClick={() => setWindowMonths(months)}>
                {months}m
              </ToggleButton>
            ))}
          </HeroControls>
        </HeroPanel>

        <LaneGrid variants={staggerFade}>
          {laneStats.map((lane) => (
            <LaneCard key={lane.discipline} variants={fade} $accent={lane.color}>
              <LaneHeader>
                <LaneBadge $accent={lane.color}>{lane.label}</LaneBadge>
                <LaneMeta>
                  {lane.hours.toFixed(0)} hrs · {lane.miles.toFixed(0)} mi
                </LaneMeta>
              </LaneHeader>
              <LaneChart>
                <FitnessLaneChart
                  labels={lane.weeklyLabels}
                  primaryColor={lane.color}
                  primaryLabel="Miles"
                  primarySeries={lane.weeklyMiles}
                  title="Weekly volume"
                />
                <FitnessLaneChart
                  labels={lane.weeklyLabels}
                  primaryColor={lane.color}
                  primaryLabel="Avg HR"
                  primarySeries={lane.weeklyHeartRate}
                  secondaryColor={DISCIPLINE_CONFIG[lane.discipline].accent}
                  secondaryLabel="Avg Watts"
                  secondarySeries={lane.weeklyWatts}
                  title="Performance trend"
                />
              </LaneChart>
              <LaneStats>
                <StatBlock>
                  <span>{lane.avgSpeed ? lane.avgSpeed.toFixed(1) : '—'}</span>
                  <small>avg speed</small>
                </StatBlock>
                <StatBlock>
                  <span>{lane.avgPace ? lane.avgPace.toFixed(1) : '—'}</span>
                  <small>avg pace (min/mi)</small>
                </StatBlock>
                <StatBlock>
                  <span>{lane.avgHeartRate ? lane.avgHeartRate.toFixed(0) : '—'}</span>
                  <small>avg HR (bpm)</small>
                </StatBlock>
                <StatBlock>
                  <span>{lane.avgWatts ? lane.avgWatts.toFixed(0) : '—'}</span>
                  <small>avg watts</small>
                </StatBlock>
              </LaneStats>
              <ZoneRow>
                <ZoneLabel>{lane.discipline === 'bike' ? 'Speed zones' : 'Pace zones'}</ZoneLabel>
                <ZoneBar>
                  {lane.zones.map((zone) => (
                    <ZoneSegment
                      key={zone.label}
                      $color={lane.color}
                      $weight={zone.seconds}
                      title={`${zone.label}: ${(zone.seconds / 3600).toFixed(1)}h`}
                    />
                  ))}
                </ZoneBar>
                <ZoneLegend>
                  {lane.zones.map((zone) => (
                    <ZoneLegendItem key={zone.label} $color={lane.color}>
                      {zone.label}
                    </ZoneLegendItem>
                  ))}
                </ZoneLegend>
              </ZoneRow>
              {lane.discipline === 'bike' && lane.bikeMix ? (
                <MixRow>
                  <ZoneLabel>Bike mix</ZoneLabel>
                  <ZoneBar>
                    <ZoneSegment
                      $color={DISCIPLINE_CONFIG.bike.accent}
                      $weight={lane.bikeMix.roadHours}
                      title={`Road: ${lane.bikeMix.roadHours.toFixed(1)}h`}
                    />
                    <ZoneSegment
                      $color={lane.color}
                      $weight={lane.bikeMix.zwiftHours}
                      title={`Zwift: ${lane.bikeMix.zwiftHours.toFixed(1)}h`}
                    />
                  </ZoneBar>
                  <ZoneLegend>
                    <ZoneLegendItem $color={DISCIPLINE_CONFIG.bike.accent}>Road</ZoneLegendItem>
                    <ZoneLegendItem $color={lane.color}>Zwift</ZoneLegendItem>
                  </ZoneLegend>
                </MixRow>
              ) : null}
              <FunStat>
                {lane.discipline === 'swim'
                  ? `${(lane.miles / OLYMPIC_POOL_MILES).toFixed(0)} Olympic pools`
                  : lane.discipline === 'run'
                    ? `${(lane.elevation / EVEREST_HEIGHT_FT).toFixed(2)} Everests`
                    : lane.discipline === 'bike'
                      ? `${(lane.miles / 112).toFixed(1)} Ironman rides`
                      : null}
              </FunStat>
            </LaneCard>
          ))}
        </LaneGrid>

        <SectionCard variants={fade}>
          <SectionHeaderText>
            <h2>Shared timeline</h2>
            <span>Volume trends and discipline mix (rolling {windowMonths} months)</span>
          </SectionHeaderText>
          <Grid $gap="1.5rem" $minWidth="320px">
            <FitnessCharts
              distribution={{ labels: distributionLabels, counts: distributionCounts }}
              distributionTitle="Discipline Mix (Hours)"
              modeLabels={{ primary: 'Miles', secondary: 'Hours' }}
              weekly={{
                labels: totalWeeklySeries.labels,
                miles: totalWeeklySeries.miles,
                hours: totalWeeklySeries.hours,
              }}
              weeklyTitle="Weekly Volume"
            />
            <FitnessCharts
              distribution={{ labels: bikeMixLabels, counts: bikeMixValues }}
              distributionTitle="Bike Mix (Hours)"
              modeLabels={{ primary: 'Miles', secondary: 'Hours' }}
              weekly={{
                labels: totalWeeklySeries.labels,
                miles: totalWeeklySeries.miles,
                hours: totalWeeklySeries.hours,
              }}
              weeklyTitle="All Training"
            />
          </Grid>
        </SectionCard>

        <SectionCard variants={fade}>
          <SectionHeaderText>
            <h2>Training heatmap</h2>
            <span>Daily intensity bands by discipline</span>
          </SectionHeaderText>
          <ActivityHeatmap
            activities={windowedActivities.map((item) => ({
              date: item.date,
              discipline: item.discipline,
              seconds: item.seconds,
            }))}
            startDate={windowStart}
          />
        </SectionCard>

        <SectionCard variants={fade}>
          <SectionHeaderText>
            <h2>Other training</h2>
            <span>Everything outside the swim-bike-run core</span>
          </SectionHeaderText>
          <OtherGrid>
            <OtherStat>
              <strong>{otherActivities.length}</strong>
              <span>sessions</span>
            </OtherStat>
            <OtherStat>
              <strong>{otherActivities.reduce((acc, item) => acc + item.seconds / 3600, 0).toFixed(1)}</strong>
              <span>hours</span>
            </OtherStat>
            <OtherStat>
              <strong>{otherActivities.reduce((acc, item) => acc + item.miles, 0).toFixed(0)}</strong>
              <span>miles</span>
            </OtherStat>
          </OtherGrid>
        </SectionCard>
      </Container>
    </>
  )
}

export default FitnessPage

const Container = styled(motion.main)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
  color: var(--text);
`

const HeroPanel = styled(motion.section)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(2rem, 6vw, 3.5rem);
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: var(--border-radius-xl);
  background: radial-gradient(circle at top left, rgb(255 255 255 / 6%), transparent 60%),
    linear-gradient(140deg, #151515, #1f1f1f);
  overflow: hidden;
`

const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgb(79 163 255 / 20%), transparent 45%),
    radial-gradient(circle at 80% 20%, rgb(181 255 99 / 15%), transparent 45%),
    radial-gradient(circle at 50% 80%, rgb(255 123 95 / 20%), transparent 55%);
  opacity: 0.6;
  pointer-events: none;
`

const HeroBadge = styled.div`
  position: relative;
  z-index: 1;
  width: fit-content;
  padding: 0.35rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 999px;
  background: rgb(255 255 255 / 6%);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-dark);
`

const HeroTitle = styled.h1`
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  letter-spacing: -0.02em;
  color: var(--heading);
`

const HeroSubtitle = styled.p`
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.4rem);
  color: var(--text-dark);
`

const HeroStats = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`

const HeroStat = styled.div`
  display: grid;
  gap: 0.2rem;
  padding: 1rem 1.2rem;
  border-radius: var(--border-radius-lg);
  background: rgb(255 255 255 / 4%);
  border: 1px solid rgb(255 255 255 / 8%);
  span {
    font-size: clamp(1.2rem, 2vw, 1.7rem);
    font-weight: 600;
    color: var(--heading);
  }
  small {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: var(--text-dark);
    letter-spacing: 0.5px;
  }
`

const HeroControls = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const ToggleButton = styled.button<{ $active?: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 12%);
  background: ${({ $active }) => ($active ? 'rgb(255 255 255 / 18%)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--heading)' : 'var(--text-dark)')};
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  cursor: pointer;
`

const LaneGrid = styled(motion.section)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`

const LaneCard = styled(motion.div)<{ $accent: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: var(--border-radius-xl);
  border: 1px solid rgb(255 255 255 / 10%);
  background: linear-gradient(140deg, rgb(255 255 255 / 3%), transparent);
  box-shadow: 0 20px 40px -30px rgb(0 0 0 / 60%);
  overflow: hidden;
  color: var(--text);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, ${({ $accent }) => `${$accent}33`}, transparent 55%);
    pointer-events: none;
  }
`

const LaneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LaneBadge = styled.span<{ $accent: string }>`
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  background: ${({ $accent }) => `${$accent}26`};
  color: ${({ $accent }) => $accent};
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

const LaneMeta = styled.span`
  font-size: 0.7rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

const LaneChart = styled.div`
  position: relative;
  display: grid;
  gap: 0.5rem;

  .sparkline {
    width: 100%;
    height: 80px;
  }
`

const LaneStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
`

const StatBlock = styled.div`
  display: grid;
  gap: 0.15rem;
  span {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--heading);
  }
  small {
    font-size: 0.65rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
`

const ZoneRow = styled.div`
  display: grid;
  gap: 0.5rem;
`

const MixRow = styled(ZoneRow)``

const ZoneLabel = styled.span`
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-dark);
`

const ZoneBar = styled.div`
  display: flex;
  gap: 0.25rem;
  height: 12px;
`

const ZoneLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
`

const ZoneLegendItem = styled.span<{ $color: string }>`
  position: relative;
  padding-left: 0.75rem;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-dark);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
    transform: translateY(-50%);
  }
`

const ZoneSegment = styled.span<{ $color: string; $weight: number }>`
  flex: ${({ $weight }) => Math.max($weight, 0.1)};
  border-radius: 999px;
  background: ${({ $color }) => $color};
  opacity: 0.6;
`

const FunStat = styled.div`
  margin-top: 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-dark);
`

const SectionCard = styled(motion.section)`
  display: grid;
  gap: 1.5rem;
  padding: 1.75rem;
  border-radius: var(--border-radius-xl);
  border: 1px solid rgb(255 255 255 / 10%);
  background: linear-gradient(140deg, rgb(255 255 255 / 2%), transparent);
  color: var(--text);
`

const SectionHeaderText = styled.div`
  display: grid;
  gap: 0.35rem;
  h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--heading);
  }
  span {
    font-size: 0.7rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
`

const OtherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`

const OtherStat = styled.div`
  display: grid;
  gap: 0.25rem;
  padding: 1rem;
  border-radius: var(--border-radius-lg);
  border: 1px solid rgb(255 255 255 / 8%);
  background: rgb(255 255 255 / 4%);
  strong {
    font-size: 1.4rem;
  }
  span {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: var(--text-dark);
    letter-spacing: 0.4px;
  }
`
