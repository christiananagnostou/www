import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import type { ArtImage } from '../../lib/art'

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
    <Frame aria-hidden={!visible} inert={!visible}>
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
    </Frame>
  )
}

const Frame = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;

  &[aria-hidden='false'] {
    z-index: 1;
    opacity: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    dialog:not(:has(:focus-visible)) & {
      transition: opacity 150ms cubic-bezier(0.23, 1, 0.32, 1);
    }
  }

  div {
    text-align: center;
  }

  button {
    min-height: 44px;
    padding: 0 0.75rem;
    border: 0;
    border-radius: var(--border-radius-md);
    background: none;
    color: var(--text);
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
`
