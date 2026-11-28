import Image from 'next/image'
import { useEffect, useState } from 'react'

import type { ArtImage } from '../../lib/art'

import styles from './ViewerPhoto.module.css'

type Props = {
  index: number
  photo: ArtImage
  requested: boolean
  visible: boolean
  onPresent: (index: number) => void
}

export default function ViewerPhoto({ index, photo, requested, visible, onPresent }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // Next/Image calls onLoad after decode. A warm frame can be selected without mounting another image.
  useEffect(() => {
    if (requested && status !== 'loading') onPresent(index)
  }, [requested, status, index, onPresent])

  return (
    <div className={styles.frame} aria-hidden={!visible} inert={!visible}>
      {status === 'error' ? (
        <div>
          <p>This photo couldn’t load.</p>
          <button type="button" onClick={() => setStatus('loading')}>
            Try again
          </button>
        </div>
      ) : (
        <Image
          alt={visible ? photo.title : ''}
          fetchPriority={requested ? 'high' : 'low'}
          fill
          loading="eager"
          placeholder={photo.image.blurDataURL ? 'blur' : 'empty'}
          sizes="(min-width: 800px) 800px, 100vw"
          src={photo.image}
          style={{ objectFit: 'contain' }}
          onError={() => setStatus('error')}
          onLoad={() => setStatus('ready')}
        />
      )}
    </div>
  )
}
