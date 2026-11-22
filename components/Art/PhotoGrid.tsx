import * as m from 'framer-motion/m'
import Image from 'next/image'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import type { ArtImage } from '../../lib/art'
import { formatPhotoDate } from '../../lib/art/formatPhotoDate'
import { fade } from '../animation'
import { PhotoTags } from './PhotoFilters'

const THUMBNAIL_SIZES = '(min-width: 800px) 376px, calc(50vw - 1rem - 8.5px)'

type GridProps = {
  photos: ArtImage[]
  tag: string | null
  onOpen: (photo: ArtImage) => void
  onSelectTag: (tag: string | null) => void
}

export default function PhotoGrid({ photos, tag, onOpen, onSelectTag }: GridProps) {
  const grid = useRef<HTMLElement>(null)
  // null lets browsers without IntersectionObserver use native lazy loading for every photo.
  const [revealed, setRevealed] = useState<Set<string> | null>(() => new Set())
  const columns = useMemo(() => {
    const pair: ArtImage[][] = [[], []]
    photos.forEach((photo, index) => pair[index % 2].push(photo))
    return pair
  }, [photos])

  useEffect(() => {
    if (!grid.current) return
    const pending = grid.current.querySelectorAll<HTMLButtonElement>('[data-deferred-photo]')
    if (!pending.length) return
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(null)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const ids: string[] = []
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = (entry.target as HTMLElement).dataset.deferredPhoto
          if (id) ids.push(id)
          observer.unobserve(entry.target)
        }
        if (ids.length) setRevealed((previous) => new Set([...(previous ?? []), ...ids]))
      },
      { rootMargin: '80px 0px' }
    )

    pending.forEach((button) => observer.observe(button))
    return () => observer.disconnect()
  }, [photos])

  return (
    <Columns ref={grid} aria-label="Photographs" variants={fade}>
      {columns.map((column, side) => (
        <Column key={side}>
          {column.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              loading={revealed === null ? 'lazy' : index === 0 || revealed.has(photo.id) ? 'eager' : undefined}
              photo={photo}
              tag={tag}
              onOpen={onOpen}
              onSelectTag={onSelectTag}
            />
          ))}
        </Column>
      ))}
    </Columns>
  )
}

const PhotoCard = memo(function PhotoCard({
  photo,
  loading,
  tag,
  onOpen,
  onSelectTag,
}: Omit<GridProps, 'photos'> & {
  photo: ArtImage
  loading?: 'eager' | 'lazy'
}) {
  const thumbnail = (
    <Image alt={photo.title} loading={loading ?? 'lazy'} placeholder="blur" sizes={THUMBNAIL_SIZES} src={photo.image} />
  )

  return (
    <ImageWrapper>
      <PhotoButton
        type="button"
        aria-label={`Open full screen image: ${photo.title}`}
        data-deferred-photo={loading ? undefined : photo.id}
        style={{ aspectRatio: `${photo.image.width} / ${photo.image.height}` }}
        onClick={() => onOpen(photo)}
      >
        {loading ? thumbnail : <noscript>{thumbnail}</noscript>}
      </PhotoButton>
      <HoverBox>
        <div className="title-date">
          <p className="title">{photo.title}</p>
          <p className="date">{formatPhotoDate(photo.date)}</p>
        </div>
        <div className="tags">
          <PhotoTags tags={photo.tags} activeTag={tag} onSelect={onSelectTag} />
        </div>
      </HoverBox>
    </ImageWrapper>
  )
})

const Columns = styled(m.section)`
  display: flex;
  gap: 17px;
`

const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: inherit;
  min-width: 0;
`

const PhotoButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`

const HoverBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  transform: translateY(100%);
  transition: transform 0.25s ease-in-out;
  background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 90%));
  padding: 50px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--heading);

  p,
  button {
    text-shadow: 0 0 5px rgb(0 0 0 / 50%);
  }

  .title-date {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 5px;
  }

  .title {
    font-size: 1rem;
    color: #ffffff;
  }

  .date {
    font-size: 0.8rem;
    color: var(--text-light);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .tags button {
    padding: 2px 5px;
    font-size: 0.7rem;
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    text-transform: capitalize;
    min-width: max-content;
  }
`
const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-sm);
  cursor: pointer;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (hover: hover) {
    &:hover ${HoverBox}, &:focus ${HoverBox}, &:focus-within ${HoverBox} {
      transform: translateY(0);
    }
  }
`
