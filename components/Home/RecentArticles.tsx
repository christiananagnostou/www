import * as m from 'framer-motion/m'
import Link from 'next/link'

import type { ArticleSummary } from '../../lib/articles'
import { fade, staggerFade } from '../animation'

import styles from './RecentArticles.module.css'

interface ArticlesProps {
  posts: ArticleSummary[]
}

export default function RecentArticles({ posts }: ArticlesProps) {
  return (
    <m.div className={styles.articlesContainer} variants={staggerFade}>
      <m.h2 className={styles.title} variants={fade}>
        <Link href="/articles">Articles</Link>
      </m.h2>

      <ul>
        {posts.slice(0, 3).map((article, index) => (
          <m.li key={article.slug} variants={fade}>
            <Link href={`/article/${article.slug}`}>
              <p className={styles.recentArticle__title}>{article.title}</p>
              {index === 0 && <p className={styles.recentArticle__summary}>{article.summary}</p>}
            </Link>
          </m.li>
        ))}
      </ul>
    </m.div>
  )
}
