import { motion } from 'framer-motion'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import Bio from '../components/Home/Bio'
import TVBar from '../components/Home/TVBar'
import SocialLinks from '../components/SocialLinks'
import { ArticleType, getAllPosts } from '../lib/articles'

import Link from 'next/link'
import LatestSection from '../components/Home/LatestSection'

import JukeboxLogo from '/public/logo-jukebox.png'
import LiftClubLogo from '/public/logo-liftclub.png'

type Props = {
  posts: ArticleType[]
}

export const getStaticProps: GetStaticProps = () => {
  const posts = getAllPosts()
  return { props: { posts } }
}

const Home = ({ posts }: Props) => {
  return (
    <>
      <Head>
        <title>Christian Anagnostou</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Bio />

        <LatestSection posts={posts} />

        <SectionWrap>
          <ProjectLinks variants={staggerFade}>
            <Link href={'https://www.liftclub.app/'} title="Lift Club - your new favorite workout app" target="_blank">
              <motion.p variants={fade} className="project-link">
                <Image
                  src={LiftClubLogo}
                  alt="Latest photo posted on my website - found on the art page."
                  blurDataURL={LiftClubLogo.blurDataURL}
                  placeholder="blur"
                />
                Lift Club
              </motion.p>
            </Link>
            <Link
              href={'https://github.com/christiananagnostou/jukebox'}
              title="Jukebox - your new favorite desktop music player"
              target="_blank"
            >
              <motion.p variants={fade} className="project-link">
                <Image
                  src={JukeboxLogo}
                  alt="Latest photo posted on my website - found on the art page."
                  blurDataURL={JukeboxLogo.blurDataURL}
                  placeholder="blur"
                  className="darken"
                />
                Jukebox
              </motion.p>
            </Link>
          </ProjectLinks>

          <SocialLinks />
        </SectionWrap>
        <TVBar />
      </Container>
    </>
  )
}

export default Home

const Container = styled(motion.main)`
  max-width: var(--max-w-screen);
  min-height: calc(100vh - var(--nav-height));
  margin: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;

  .spacer {
    height: auto;
    flex: 1;
  }

  @media screen and (min-width: 768px) {
    padding: 3rem 1rem 1rem;
  }
`

const SectionWrap = styled(motion.section)`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
`

const ProjectLinks = styled(motion.section)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
  color: var(--text);

  .project-link {
    min-width: max-content;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border-radius: 5px;
    padding: 0.75rem 0.75rem 0.75rem 0.6rem;
    background: var(--bg);
    border: 1px solid var(--accent);
    cursor: alias;
    font-size: 0.85rem;
    letter-spacing: 0.03em;

    img {
      height: 1.25rem;
      width: 1.25rem;
      border-radius: 3rem;

      transition: filter 0.2s ease;

      filter: grayscale(1);

      &.darken {
        filter: grayscale(1) brightness(0.5);
      }
    }

    &:hover img {
      filter: none;
    }
  }
`
