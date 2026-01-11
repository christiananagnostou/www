import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import type { ArticleType } from '../../lib/articles'
import { fade, staggerFade } from '../animation'
import { HomepageBox } from './styles'

interface ArticlesProps {
  posts: ArticleType[]
}

export default function RecentArticles({ posts }: ArticlesProps) {
  return (
    <ArticlesContainer variants={staggerFade}>
      <LinkTitle className="homepage-box__title" href="/articles" variants={fade}>
        Articles
      </LinkTitle>

      <ul>
        {posts.slice(0, 3).map((article) => (
          <motion.li key={article.slug} variants={fade}>
            <Link href={`/article/${article.slug}`}>
              <p className="recent-article__title">{article.title}</p>
              <p className="recent-article__summary">{article.summary}</p>
            </Link>
          </motion.li>
        ))}
      </ul>
    </ArticlesContainer>
  )
}

const LinkTitle = styled(motion(Link))``

const ArticlesContainer = styled(HomepageBox)`
  flex: 1;
  min-width: 70%;
  color: var(--text);

  ul {
    padding-left: 1rem;
    list-style-type: circle;

    li {
      margin-bottom: 0.5rem;

      a {
        display: block;
        text-decoration: none;
      }

      .recent-article__title {
        text-decoration: underline solid var(--accent);
        transition: all 0.2s ease;
        text-underline-offset: 3px;

        &:hover,
        &:active {
          color: var(--heading);
          text-decoration: underline solid var(--text);
        }
      }

      .recent-article__summary {
        margin-top: 0.25rem;
        font-size: 0.8rem;
        color: var(--text-dark);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
`
