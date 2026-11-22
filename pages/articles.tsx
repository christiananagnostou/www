import * as m from 'framer-motion/m'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next/types'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import { ButtonRow } from '../components/Shared/ButtonRow'
import { Heading } from '../components/Shared/Heading'
import { type ArticleSummary, getArticleSummaries } from '../lib/articles'
import { X_HANDLE } from '../lib/constants'
import {
  articlesDescription,
  articlesTitle,
  articlesUrl,
  getArticlesListStructuredData,
} from '../lib/structured/articles'

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

      <Container animate="show" exit="exit" initial={pageTransitionInitial} variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Articles</h1>
          <p>
            I write about things that interest me. It&apos;s mostly tech related, but sometimes it&apos;s a new idea, or
            just a new way of looking at something old. Maybe, if you&apos;re lucky, you can find a small nugget of
            knowledge or a spark of inspiration.
          </p>
        </Heading>

        <ButtonRow>
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
        </ButtonRow>

        <PostsContainer variants={staggerFade}>
          {posts
            .filter((post) => (queriedCategory ? post.categories?.includes(queriedCategory) : true))
            .map(({ title, dateCreated, slug, summary }) => (
              <PostItem key={slug} variants={fade}>
                <p className="date">{dateCreated}</p>
                <Link className="inner-link" href={`/article/${slug}`}>
                  <div className="content">
                    <h2 className="title">{title}</h2>
                    {summary ? <p className="summary">{summary}</p> : null}
                  </div>
                </Link>
              </PostItem>
            ))}
        </PostsContainer>
      </Container>
    </>
  )
}

export default Articles

const Container = styled(m.section)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

const PostsContainer = styled(m.div)`
  display: flex;
  flex-direction: column;
  place-content: center center;
  margin: auto;
  gap: 2.5rem;
`

const PostItem = styled(m.div)`
  display: flex;
  width: 100%;

  .date {
    font-size: 0.7rem;
    font-weight: 300;
    margin-top: 0.7rem;
    min-width: 100px;
  }

  .inner-link {
    display: block;
    text-decoration: none;
    transition: all 0.25s ease;
    border-radius: var(--border-radius-sm);
    padding: 0.5rem 1rem;
    flex: 1;

    &:hover {
      background: #262626;
    }

    .content {
      display: flex;
      flex-direction: column;

      h2 {
        font-weight: 300;
        width: fit-content;
        font-size: 1rem;
        color: #ffffff;
      }

      p {
        font-size: 0.8rem;
        margin: 0.5rem 0 0;
        font-weight: 300;
      }
    }
  }

  @media screen and (width <= 500px) {
    flex-direction: column-reverse;

    .date {
      margin-top: 0.25rem;
    }

    .inner-link {
      padding: 0.25rem 0;

      &:hover {
        background: none;
      }
    }
  }
`
