import Image from 'next/image'
import styled from 'styled-components'

import { motion } from 'framer-motion'
import Head from 'next/head'
import Link from 'next/link'
import { pageAnimation } from '../../components/animation'
import LeftArrow from '../../components/SVG/LeftArrow'
import { ArticleType, getAllPosts, getPostBySlug } from '../../static/articles'
import markdownToHtml from '../../static/articles/markdownToHtml'

interface Props {
  post: ArticleType
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  const content = await markdownToHtml(post.content || '')

  return { props: { post: { ...post, content } } }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  }
}

const ArticleSlug = ({ post: { title, coverImg, dateCreated, lastUpdated, content, summary } }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ArticleStyle variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Heading>
          <div className="top-bar">
            <Link href="/articles" className="go-back">
              <LeftArrow />
              <span>
                <em>Articles</em>
              </span>
            </Link>

            <p className="date">{dateCreated}</p>
          </div>

          {coverImg && (
            <div className="cover-img">
              <Image src={'/article-images/' + coverImg} alt={`${title} cover image`} fill />
            </div>
          )}
          <div className="title">
            <h1 className="heading-gradient">{title}</h1>
          </div>
        </Heading>

        <article className="content" dangerouslySetInnerHTML={{ __html: content }} />
      </ArticleStyle>
    </>
  )
}

export default ArticleSlug

const Heading = styled.header`
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    .go-back {
      display: flex;
      align-items: center;
      em {
        font-weight: 400;
      }
    }
    .date {
      font-weight: 400;
      font-size: 0.8em;
    }
  }

  .cover-img {
    width: 100%;
    max-width: 900px;
    aspect-ratio: 3.5 / 2;
    margin: auto;
    position: relative;

    img {
      max-width: 100%;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      object-fit: cover !important;
    }
  }

  .title {
    left: 1rem;
    border-radius: 5px;
    text-align: left;

    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    .title {
      padding: 0;

      h1 {
        font-size: 1.5rem;
      }
    }
  }
`

export const ArticleStyle = styled(motion.section)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;

  .content {
    text-align: left;
    margin: auto;
    text-align: justify;
    position: relative;

    nav {
      width: fit-content;
      display: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 2rem 0 0.5rem 0;
      font-weight: 400;
      color: var(--heading);
    }

    h1 {
      margin: 1rem 0;
    }

    nav {
      font-size: 0.9em;
      margin-bottom: 2rem;
    }

    p {
      font-weight: 300;
      line-height: 1.6rem;
      color: var(--text);

      &:not(:last-child) {
        margin-bottom: 1.5rem;
      }
    }

    strong {
      font-weight: 500;
    }

    hr {
      margin: 1rem auto;
      border: none;
      border-bottom: 1px solid var(--accent);
    }

    ul,
    ol {
      padding-left: 1rem;
      margin-left: 0.5rem;

      li {
        color: var(--text);
        font-weight: 300;
        margin-top: 0.5rem;

        a {
          display: flex;
          align-items: center;
          justify-content: start;
          width: fit-content;
          gap: 5px;
        }

        &::marker {
          margin: 0 1rem 0 1rem;
          font-weight: 300;
          color: var(--accent);
        }
      }
    }
    ul {
      list-style: disc;
    }
    ol {
      list-style: upper-roman;
    }
    nav ol {
      list-style: none;
      margin-left: 0;
      padding-left: 0.5rem;
      text-align: left;
    }
    nav ol ol {
      padding-left: 1.25rem;
    }

    img {
      border-radius: 5px;
      margin-left: -2rem;
      max-width: 100%;

      @media (min-width: 550px) {
        margin: auto;
      }
    }

    /*!
    Theme: GitHub Dark
    Description: Dark theme as seen on github.com
    Author: github.com
    Maintainer: @Hirse
    Updated: 2021-05-15

    Outdated base version: https://github.com/primer/github-syntax-dark
    Current colors taken from GitHub's CSS
    */
    pre code.hljs {
      display: block;
      overflow-x: auto;
      padding: 1em;
    }
    code.hljs {
      padding: 3px 5px;
      width: fit-content;
      max-width: 100%;
    }
    .hljs {
      color: #c9d1d9;
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 5px;
      overflow: auto;
      margin-bottom: 0.75rem;
    }
    .hljs-doctag,
    .hljs-keyword,
    .hljs-meta .hljs-keyword,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-type,
    .hljs-variable.language_ {
      color: #ff7b72;
    }
    .hljs-title,
    .hljs-title.class_,
    .hljs-title.class_.inherited__,
    .hljs-title.function_ {
      color: #d2a8ff;
    }
    .hljs-attr,
    .hljs-attribute,
    .hljs-literal,
    .hljs-meta,
    .hljs-number,
    .hljs-operator,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-id,
    .hljs-variable {
      color: #79c0ff;
    }
    .hljs-meta .hljs-string,
    .hljs-regexp,
    .hljs-string {
      color: #a5d6ff;
    }
    .hljs-built_in,
    .hljs-symbol {
      color: #ffa657;
    }
    .hljs-code,
    .hljs-comment,
    .hljs-formula {
      color: #8b949e;
    }
    .hljs-name,
    .hljs-quote,
    .hljs-selector-pseudo,
    .hljs-selector-tag {
      color: #7ee787;
    }
    .hljs-subst {
      color: #c9d1d9;
    }
    .hljs-section {
      color: #1f6feb;
      font-weight: 700;
    }
    .hljs-bullet {
      color: #f2cc60;
    }
    .hljs-emphasis {
      color: #c9d1d9;
      font-style: italic;
    }
    .hljs-strong {
      color: #c9d1d9;
      font-weight: 700;
    }
    .hljs-addition {
      color: #aff5b4;
      background-color: #033a16;
    }
    .hljs-deletion {
      color: #ffdcd7;
      background-color: #67060c;
    }
  }
  @media (max-width: 1000px) {
    padding: 0.5rem 1rem;

    .content {
      font-size: 90%;
    }
  }
`
