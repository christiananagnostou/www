import { fetchIntervalsIcuActivities } from '../providers/intervalsIcu'
import { removeMissingProviderActivities, saveActivities } from './activityRepository'

const DAY_MS = 24 * 60 * 60 * 1000
const SYNC_LOOKBACK_DAYS = 730

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

export const syncRecentActivities = async (now = new Date()) => {
  const oldest = formatDate(new Date(now.getTime() - SYNC_LOOKBACK_DAYS * DAY_MS))
  const newest = formatDate(new Date(now.getTime() + DAY_MS))
  const activities = await fetchIntervalsIcuActivities({
    oldest,
    newest,
  })
  const saved = await saveActivities(activities)
  const removed = await removeMissingProviderActivities(
    'intervals-icu:',
    new Date(`${oldest}T00:00:00.000Z`),
    new Date(`${newest}T23:59:59.999Z`),
    activities.map((activity) => activity.id)
  )
  return { received: activities.length, saved, removed }
}
