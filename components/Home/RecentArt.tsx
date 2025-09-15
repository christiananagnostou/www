import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { fade, photoAnim, staggerFade } from '../animation'
import StairShadow from '../../public/img/art/photography/stair_shadow.jpg'
import { HomepageBox } from './styles'

export default function RecentArt() {
  return (
    <ArtContainer variants={staggerFade}>
      <Link href="/art">
        <motion.p variants={fade} className="homepage-box__title">
          Photos
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
            alt=""
            blurDataURL={StairShadow.blurDataURL}
            placeholder="blur"
            width={300}
            loading="eager"
          />
        </RecentImage>
      </Link>
    </ArtContainer>
  )
}

const ArtContainer = styled(HomepageBox)`
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

    p {
      font-size: 0.8rem;
      padding-bottom: 3px;
      scale: 0.8;
      transition: scale 0.25s ease-in-out;
      color: var(--text-dark);
    }
  }

  &::after {
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
