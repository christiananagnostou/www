import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import type { FitnessActivity } from '../activity'
import { dayNumber, type TrainingEntry } from '../training'

dayjs.extend(utc)
dayjs.extend(timezone)

const pacificTime = (instant?: string | Date) => dayjs(instant).tz('America/Los_Angeles')

export function trainingDates(now?: Date) {
  const today = pacificTime(now)
  return { endDay: today.format('YYYY-MM-DD'), since: today.subtract(24, 'month').startOf('day').toDate() }
}

export function toTrainingEntry(activity: FitnessActivity): TrainingEntry {
  const { kind } = activity
  return {
    day: dayNumber(pacificTime(activity.startedAt)),
    sport: kind === 'cycle' ? 'bike' : kind === 'run' || kind === 'swim' ? kind : 'other',
    seconds: activity.durationSeconds,
    meters: activity.distanceMeters,
    climb: activity.elevationGainMeters,
    bpm: activity.averageHeartRateBpm,
    watts: activity.averagePowerWatts,
    indoor: kind === 'cycle' && activity.indoor,
  }
}
