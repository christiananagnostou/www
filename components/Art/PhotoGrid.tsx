import * as m from 'framer-motion/m'
import Image from 'next/image'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

import type { ArtImage } from '../../lib/art'
import { formatPhotoDate } from '../../lib/art/formatPhotoDate'
import { fade } from '../animation'
import { PhotoTags } from './PhotoFilters'

import styles from './PhotoGrid.module.css'

const THUMBNAIL_SIZES = '(min-width: 800px) 376px, calc(50vw - 1rem - 8.5px)'

export type PhotoSelection = { photo: ArtImage; trigger: HTMLButtonElement }

type GridProps = {
  photos: ArtImage[]
  tag: string | null
  onOpen: (selection: PhotoSelection) => void
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
    <m.section className={styles.columns} ref={grid} aria-label="Photographs" variants={fade}>
      {columns.map((column, side) => (
        <div className={styles.column} key={side}>
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
        </div>
      ))}
    </m.section>
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
    <div className={styles.imageWrapper}>
      <button
        className={styles.photoButton}
        type="button"
        aria-label={`Open full screen image: ${photo.title}`}
        data-deferred-photo={loading ? undefined : photo.id}
        style={{ aspectRatio: `${photo.image.width} / ${photo.image.height}` }}
        onClick={(event) => onOpen({ photo, trigger: event.currentTarget })}
      >
        {loading ? thumbnail : <noscript>{thumbnail}</noscript>}
      </button>
      <div className={styles.hoverBox}>
        <div className="title-date">
          <p className="title">{photo.title}</p>
          <p className="date">{formatPhotoDate(photo.date)}</p>
        </div>
        <div className="tags">
          <PhotoTags tags={photo.tags} activeTag={tag} onSelect={onSelectTag} />
        </div>
      </div>
    </div>
  )
})
