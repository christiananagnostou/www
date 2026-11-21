import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import photo from '../../public/img/art/photography/bike_white_bg.webp'

export default function RecentArt() {
  return (
    <PhotoLink href="/art">
      <h2>Photos</h2>
      <figure>
        <Image
          alt="A bicycle at Byxbee Park"
          placeholder="blur"
          sizes="(max-width: 768px) 95vw, 340px"
          src={photo}
          fill
        />
        <figcaption>Byxbee Park · March 2025</figcaption>
      </figure>
    </PhotoLink>
  )
}

const PhotoLink = styled(Link)`
  position: relative;
  flex: 1;
  min-height: 13rem;
  overflow: hidden;
  border-radius: var(--border-radius-md);
  color: #ffffff;

  img {
    object-fit: cover;
    object-position: center 80%;
  }
  h2,
  figcaption {
    position: absolute;
    z-index: 1;
    left: 1rem;
    padding: 0.25rem 0.5rem;
    background: #171717;
  }
  h2 {
    top: 1rem;
    font-size: 0.95rem;
    font-weight: 500;
  }
  figcaption {
    bottom: 1rem;
    font-size: 0.8rem;
  }
`
