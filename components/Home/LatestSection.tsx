import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { ArticleType } from '../../lib/articles'
import { fade, photoAnim, staggerFade } from '../animation'

import StairShadow from '/public/img/art/photography/stair_shadow.jpg'

type Props = {
  posts: ArticleType[]
}

const LatestSection = ({ posts }: Props) => {
  return (
    <MiddleSection>
      <RecentArt variants={staggerFade}>
        <Link href="/art">
          <motion.p variants={fade} className="homepage-box__title">
            Latest Art
          </motion.p>

          <div className="recent-art__hover-box">
            <p>
              Through the lens,
              <br />
              reality becomes art.
            </p>
          </div>

          <RecentImage key={StairShadow.src} variants={photoAnim}>
            <Image
              src={StairShadow}
              alt="Latest photo posted on my website - found on the art page."
              blurDataURL={StairShadow.blurDataURL}
              placeholder="blur"
              width={750}
            />
          </RecentImage>
        </Link>
      </RecentArt>

      <RecentArticles variants={staggerFade}>
        <motion.p variants={fade} className="homepage-box__title">
          Latest Articles
        </motion.p>

        <ul>
          {posts.slice(0, 3).map((article) => (
            <motion.li key={article.slug} variants={fade}>
              <Link href={`/article/${article.slug}`}>
                <p>{article.title}</p>
                <p className="recent-article__summary">{article.summary}</p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </RecentArticles>
    </MiddleSection>
  )
}

export default LatestSection

const MiddleSection = styled.section`
  display: flex;
  width: 100%;
  gap: 1rem;

  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
  }
`

const HomepageBox = styled(motion.div)`
  position: relative;
  flex: 1;
  border-radius: 7px;
  padding: 1rem;
  background: var(--bg);
  border: 1px solid var(--accent);

  * {
    font-weight: 200;
    font-size: 0.95rem;
  }

  .homepage-box__title {
    display: block;
    margin-bottom: 1rem;
    width: fit-content;
    position: relative;
    z-index: 1;
  }
`

const RecentArt = styled(HomepageBox)`
  overflow: hidden;

  * {
    text-decoration: none !important;
  }

  .recent-art__hover-box {
    position: absolute;
    left: 0;
    bottom: -50px;
    height: 50px;
    width: 100%;
    transition: bottom 0.25s ease-in-out;
    display: flex;
    align-items: end;
    justify-content: center;
    z-index: 2;
    text-align: center;
    opacity: 0.65;

    p {
      font-size: 0.8rem;
      padding-bottom: 3px;
    }
  }

  ::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: linear-gradient(to bottom, transparent 20%, #171717);
    transition: top 0.28s ease-in-out;
    pointer-events: none;
  }

  &:hover {
    ::after {
      top: 0;
    }

    .recent-art__hover-box {
      bottom: 0;
    }
  }
`

const RecentImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  filter: brightness(0.25);
  width: 100%;
  height: 100%;

  img {
    min-height: 100%;
    min-width: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
  }
`

const RecentArticles = styled(HomepageBox)`
  min-width: 70%;
  flex: 1;

  ul {
    padding-left: 1rem;
    list-style-type: circle;
    color: var(--text);
    li {
      margin-bottom: 0.5rem;

      .recent-article__summary {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 0.25rem;
        opacity: 0.55;
        font-size: 0.8rem;
      }
    }
  }
`
