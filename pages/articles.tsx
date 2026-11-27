import * as m from 'framer-motion/m'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next/types'

import { fade, pageAnimation, staggerFade } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import { Heading } from '../components/Shared/Heading'
import { type ArticleSummary, getArticleSummaries } from '../lib/articles'
import { X_HANDLE } from '../lib/constants'
import {
  articlesDescription,
  articlesTitle,
  articlesUrl,
  getArticlesListStructuredData,
} from '../lib/structured/articles'

import styles from '../styles/pages/Articles.module.css'
import controls from '../components/Shared/ButtonRow.module.css'

interface Props {
  posts: ArticleSummary[]
}

export const getStaticProps: GetStaticProps = () => {
  const posts = getArticleSummaries()
  return { props: { posts } }
}

const Articles = ({ posts }: Props) => {
  const router = useRouter()
  const pageTransitionInitial = usePageTransitionInitial()
  const { query } = router
  const queriedCategory = query.category?.toString() || ''

  return (
    <>
      <Head>
        {/* Primary SEO */}
        <title>{articlesTitle}</title>
        <meta content={articlesDescription} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="index, follow" name="robots" />
        <meta content="Christian Anagnostou" name="author" />
        <meta content="Christian Anagnostou" name="publisher" />
        <meta content={articlesDescription} name="keywords" />
        <link href={articlesUrl} rel="canonical" />

        {/* Open Graph / Facebook */}
        <meta key="og:title" content={articlesTitle} property="og:title" />
        <meta key="og:description" content={articlesDescription} property="og:description" />
        <meta key="og:url" content={articlesUrl} property="og:url" />
        <meta key="og:type" content="website" property="og:type" />

        {/* Twitter */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={articlesTitle} name="twitter:title" />
        <meta content={articlesDescription} name="twitter:description" />
        <meta content={X_HANDLE} name="twitter:site" />

        {/* Structured Data */}
        <script dangerouslySetInnerHTML={getArticlesListStructuredData(posts)} type="application/ld+json" />
      </Head>

      <m.section
        className={styles.container}
        animate="show"
        exit="exit"
        initial={pageTransitionInitial}
        variants={pageAnimation}
      >
        <Heading variants={fade}>
          <h1>Articles</h1>
          <p>
            I write about things that interest me. It&apos;s mostly tech related, but sometimes it&apos;s a new idea, or
            just a new way of looking at something old. Maybe, if you&apos;re lucky, you can find a small nugget of
            knowledge or a spark of inspiration.
          </p>
        </Heading>

        <div className={controls.buttonRow}>
          {Array.from(new Set(posts.flatMap((post) => post.categories))).map((category) => (
            <button
              key={category}
              className={`${queriedCategory === category && 'selected'}`}
              onClick={() =>
                router.push({
                  query: { category: queriedCategory === category ? '' : category },
                })
              }
            >
              {category}
            </button>
          ))}
        </div>

        <m.div className={styles.postsContainer} variants={staggerFade}>
          {posts
            .filter((post) => (queriedCategory ? post.categories?.includes(queriedCategory) : true))
            .map(({ title, dateCreated, slug, summary }) => (
              <m.div className={styles.postItem} key={slug} variants={fade}>
                <p className="date">{dateCreated}</p>
                <Link className={styles.innerLink} href={`/article/${slug}`}>
                  <div className="content">
                    <h2 className="title">{title}</h2>
                    {summary ? <p className="summary">{summary}</p> : null}
                  </div>
                </Link>
              </m.div>
            ))}
        </m.div>
      </m.section>
    </>
  )
}

export default Articles
