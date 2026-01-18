import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import StairShadow from '../../public/img/art/photography/stair_shadow.jpg'
import { fade, photoAnim, staggerFade } from '../animation'
import { HomepageBox } from './styles'

export default function RecentArt() {
  return (
    <ArtContainer variants={staggerFade}>
      <Title variants={fade}>
        <Link href="/art">Photos</Link>
      </Title>

      <Link href="/art">
        <div className="recent-art__hover-box">
          <p>
            Through the lens,
            <br />
            reality becomes art.
          </p>
        </div>

        <RecentImage key={StairShadow.src} variants={photoAnim}>
          <Image
            alt=""
            blurDataURL={StairShadow.blurDataURL}
            loading="eager"
            placeholder="blur"
            src={StairShadow}
            width={300}
          />
        </RecentImage>
      </Link>
    </ArtContainer>
  )
}

const ArtContainer = styled(HomepageBox)`
  overflow: hidden;


  .recent-art__hover-box {
    position: absolute;
    bottom: -50px;
    left: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: end;
    width: 100%;
    height: 50px;
    text-align: center;
    transition: bottom 0.25s ease-in-out;

    p {
      padding-bottom: 3px;
      font-size: 0.8rem;
      color: var(--text-dark);
      transition: scale 0.25s ease-in-out;
      scale: 0.8;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 20%, #171717);
    pointer-events: none;
    transition: top 0.28s ease-in-out;
  }

  &:hover {
    &::after {
      top: 0;
    }

    .recent-art__hover-box {
      bottom: 0;

      p {
        scale: 1;
      }
    }
  }
`

const Title = styled(motion.h2)`
  position: relative;
  z-index: 1;
  margin: 0 0 1rem;

  a {
    display: block;
    color: inherit;
  }
`

const RecentImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  filter: brightness(0.25);

  img {
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`
