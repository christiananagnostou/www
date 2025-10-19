import { motion } from 'framer-motion'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next/types'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { ButtonRow } from '../components/Shared/ButtonRow'
import { Heading } from '../components/Shared/Heading'
import type { ArticleType } from '../lib/articles'
import { getAllPosts } from '../lib/articles'
import { BASE_URL, X_HANDLE } from '../lib/constants'
import { getArticlesListStructuredData } from '../lib/structured/articles'

export const PageTitle = 'Articles | Christian Anagnostou'
export const PageDescription = 'Explore articles on technology, innovative ideas, and inspiration.'
const PageUrl = `${BASE_URL}/articles`

interface Props {
  posts: ArticleType[]
}

export const getStaticProps: GetStaticProps = () => {
  const posts = getAllPosts()
  return { props: { posts } }
}

const Articles = ({ posts }: Props) => {
  const router = useRouter()
  const { query } = router
  const queriedCategory = query.category?.toString() || ''

  return (
    <>
      <Head>
        {/* Primary SEO */}
        <title>{PageTitle}</title>
        <meta content={PageDescription} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="index, follow" name="robots" />
        <meta content="Christian Anagnostou" name="author" />
        <meta content="Christian Anagnostou" name="publisher" />
        <meta content={PageDescription} name="keywords" />
        <link href={PageUrl} rel="canonical" />

        {/* Open Graph / Facebook */}
        <meta content={PageTitle} property="og:title" />
        <meta content={PageDescription} property="og:description" />
        <meta content={PageUrl} property="og:url" />
        <meta content="website" property="og:type" />
        {/* <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} /> */}

        {/* Twitter */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={PageTitle} name="twitter:title" />
        <meta content={PageDescription} name="twitter:description" />
        {/* <meta name="twitter:image" content={`${BASE_URL}/og-image.jpg`} /> */}
        <meta content={X_HANDLE} name="twitter:site" />

        {/* Structured Data */}
        <script
          dangerouslySetInnerHTML={getArticlesListStructuredData(posts, PageDescription, PageUrl)}
          type="application/ld+json"
        />
      </Head>

      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
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

const Container = styled(motion.section)`
  max-width: var(--max-w-screen);
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text);
  overflow: hidden;
`

const PostsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin: auto;
  place-content: center center;
`

const PostItem = styled(motion.div)`
  display: flex;
  width: 100%;

  .date {
    min-width: 100px;
    margin-top: 0.7rem;
    font-weight: 300;
    font-size: 0.7rem;
  }

  .inner-link {
    display: block;
    flex: 1;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-sm);
    text-decoration: none;
    transition: all 0.25s ease;

    &:hover {
      background: #262626;
    }

    .content {
      display: flex;
      flex-direction: column;

      h2 {
        width: fit-content;
        font-weight: 300;
        font-size: 1rem;
        color: #ffffff;
      }

      p {
        margin: 0.5rem 0 0;
        font-weight: 300;
        font-size: 0.8rem;
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
