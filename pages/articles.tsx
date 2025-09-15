import { motion } from 'framer-motion'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next/types'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { ButtonRow } from '../components/Shared/ButtonRow'
import { Heading } from '../components/Shared/Heading'
import { ArticleType, getAllPosts } from '../lib/articles'
import { BASE_URL, X_HANDLE } from '../lib/constants'
import { getArticlesListStructuredData } from '../lib/structured/articles'

export const PageTitle = 'Articles | Christian Anagnostou'
export const PageDescription = 'Explore articles on technology, innovative ideas, and inspiration.'
const PageUrl = `${BASE_URL}/articles`

type Props = {
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
        <meta name="description" content={PageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Christian Anagnostou" />
        <meta name="publisher" content="Christian Anagnostou" />
        <meta name="keywords" content={PageDescription} />
        <link rel="canonical" href={PageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={PageTitle} />
        <meta property="og:description" content={PageDescription} />
        <meta property="og:url" content={PageUrl} />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} /> */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PageTitle} />
        <meta name="twitter:description" content={PageDescription} />
        {/* <meta name="twitter:image" content={`${BASE_URL}/og-image.jpg`} /> */}
        <meta name="twitter:site" content={X_HANDLE} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={getArticlesListStructuredData(posts, PageDescription, PageUrl)}
        />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
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
                <Link href={`/article/${slug}`} className="inner-link">
                  <div className="content">
                    <h2 className="title">{title}</h2>
                    {summary && <p className="summary">{summary}</p>}
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
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

const PostsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  margin: auto;
  gap: 2.5rem;
`

const PostItem = styled(motion.div)`
  width: 100%;
  display: flex;

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

  @media screen and (max-width: 500px) {
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
