import type { GetServerSideProps } from 'next'

import { SITE_ORIGIN } from '../lib/constants'
import { formatHomeActivityDate, HOME_ACTIVITY_LABELS, HOME_ACTIVITY_LIMIT } from '../lib/fitness/home'
import { getHomeContent, HOME_REVALIDATE_SECONDS } from '../lib/home/content'
import { MARKDOWN } from '../lib/http/pageFormat'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.setHeader('Allow', 'GET, HEAD')
    res.end()
    return { props: {} }
  }
  res.setHeader('Content-Type', MARKDOWN)
  res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${HOME_REVALIDATE_SECONDS}, stale-while-revalidate=60`)
  const { posts, fitnessActivities } = await getHomeContent()
  const recent = fitnessActivities.recent.slice(0, HOME_ACTIVITY_LIMIT)
  const rows = [
    '# Christian Anagnostou',
    '',
    'I’m a lead software engineer at [Vuori](https://vuoriclothing.com/), a photographer, and an SF Giants fan. This is where I share my projects, writing, and training.',
    '',
    `## [Projects](${SITE_ORIGIN}/projects)`,
    '',
    `- [Lift Club](${SITE_ORIGIN}/work/liftclub): A training log I started for my cousin and me.`,
    `- [Jukebox](${SITE_ORIGIN}/work/jukebox): A music player for my own library, at home or away.`,
    '',
    `## [Articles](${SITE_ORIGIN}/articles)`,
    '',
    ...posts.map(
      (p) =>
        `- [${p.title.replace(/[[\]\\]/g, '\\$&')}](${SITE_ORIGIN}/article/${encodeURIComponent(p.slug)})${p.summary ? ': ' + p.summary : ''}`
    ),
    '',
    `## [Fitness](${SITE_ORIGIN}/fitness)`,
    '',
    'My published training log groups sessions by discipline and date.',
    '',
    ...recent.map(
      (a) =>
        `- ${formatHomeActivityDate(a.startedAt)} · ${HOME_ACTIVITY_LABELS[a.category]} · ${a.metrics.map((m) => m.label + ': ' + m.value).join(' · ')}`
    ),
    '',
    `[Photography](${SITE_ORIGIN}/art) · [About](${SITE_ORIGIN}/about) · [Contact](${SITE_ORIGIN}/contact) · [Guide for agents](${SITE_ORIGIN}/llms.txt)`,
    '',
  ]
  res.end(rows.join('\n'))
  return { props: {} }
}

export default function MarkdownHome() {
  return null
}
