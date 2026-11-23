import type { ArticleSummary } from '../articles'
import { SITE_ORIGIN } from '../constants'

export function blogPosting(post: ArticleSummary) {
  return {
    '@type': 'BlogPosting',
    name: post.title,
    headline: post.title,
    url: `${SITE_ORIGIN}/article/${post.slug}`,
    datePublished: post.dateCreated,
    description: post.summary,
  } as const
}
