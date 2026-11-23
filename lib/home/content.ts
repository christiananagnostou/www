import { getArticleSummaries } from '../articles'
import { getHomeActivityPreview } from '../fitness/home'
import { getAllActivities } from '../fitness/server/activityRepository'

export const HOME_REVALIDATE_SECONDS = 60 * 60 * 12

export async function getHomeContent() {
  const posts = getArticleSummaries().slice(0, 3)
  try {
    return { posts, fitnessActivities: getHomeActivityPreview(await getAllActivities()) }
  } catch (error) {
    console.error(
      'Failed to load homepage fitness activities',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return { posts, fitnessActivities: getHomeActivityPreview([]) }
  }
}
