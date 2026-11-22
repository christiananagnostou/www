import * as m from 'framer-motion/m'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { fade, pageAnimation } from '../../components/animation'
import { usePageTransitionInitial } from '../../components/animation/MotionProvider'
import FullscreenModal from '../../components/Art/FullScreenModal'
import PhotoGrid from '../../components/Art/PhotoGrid'
import { ButtonRow } from '../../components/Shared/ButtonRow'
import { Heading } from '../../components/Shared/Heading'
import type { ArtImage } from '../../lib/art'
import { photoTags, photosForTag } from '../../lib/art/gallery'
import { BASE_URL } from '../../lib/constants'
import { getArtStructuredData } from '../../lib/structured/art'

type Props = { initialTag: string | null }
type Params = { category?: string[] }

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: [[], ...photoTags.map((tag) => [tag])].map((category) => ({ params: { category } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props, Params> = ({ params }) => ({
  props: { initialTag: params?.category?.[0] ?? null },
})

const PageTitle = 'Photography | Christian Anagnostou'
const PageDescription = 'A gallery of photography capturing moments by Christian Anagnostou.'
const PageUrl = `${BASE_URL}/art`

export default function Art({ initialTag }: Props) {
  const router = useRouter()
  const pageTransitionInitial = usePageTransitionInitial()
  const tag = router.isReady ? (router.query.category?.[0] ?? null) : initialTag
  const photos = useMemo(() => photosForTag(tag), [tag])
  const structuredData = useMemo(() => JSON.stringify(getArtStructuredData(photos)), [photos])
  const ogImage = photos[0] && `${BASE_URL}${photos[0].image.src}`
  const [openPhoto, setOpenPhoto] = useState<ArtImage | null>(null)
  const filters = useRef<HTMLDivElement>(null)
  const closeViewer = useCallback(() => setOpenPhoto(null), [])
  useEffect(() => {
    const row = filters.current
    const selected = row?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
    if (!row || !selected || row.scrollWidth <= row.clientWidth) return
    const bounds = row.getBoundingClientRect()
    const button = selected.getBoundingClientRect()
    const left = Math.min(0, button.left - bounds.left) + Math.max(0, button.right - bounds.right)
    if (left) row.scrollBy({ left, behavior: 'instant' })
  }, [tag])

  useEffect(() => {
    router.events.on('routeChangeStart', closeViewer)
    return () => router.events.off('routeChangeStart', closeViewer)
  }, [router.events, closeViewer])

  const selectTag = useCallback(
    async (next: string | null, fromPhoto = false) => {
      const selected = next === tag ? null : next
      const changed = await router.push({ pathname: '/art', query: selected ? { tag: selected } : {} }, undefined, {
        shallow: true,
        scroll: false,
      })
      if (changed && fromPhoto) {
        filters.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus({ preventScroll: true })
        // Smooth-scrolling through a newly filtered grid would request every photo on the way up.
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    },
    [router, tag]
  )

  const index = openPhoto ? photos.indexOf(openPhoto) : -1

  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta content={PageDescription} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href={PageUrl} rel="canonical" />
        <meta content="index, follow" name="robots" />
        <meta content="art, photography, gallery, Christian Anagnostou" name="keywords" />
        {/* Open Graph */}
        <meta key="og:type" content="website" property="og:type" />
        <meta key="og:title" content={PageTitle} property="og:title" />
        <meta key="og:description" content={PageDescription} property="og:description" />
        <meta key="og:url" content={PageUrl} property="og:url" />
        {ogImage ? <meta content={ogImage} property="og:image" /> : null}
        {/* Twitter Card */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={PageTitle} name="twitter:title" />
        <meta content={PageDescription} name="twitter:description" />
        {ogImage ? <meta content={ogImage} name="twitter:image" /> : null}
        <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
      </Head>

      <Container animate="show" exit="exit" initial={pageTransitionInitial} variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Photography</h1>
          <p>
            There&apos;s something profound about capturing the world around us. Not necessarily to share it with
            others, but to remember it. To recall the way the light hit the trees or the way the snowflakes fell from
            the sky. It creates moments you can revisit, even if only in your mind.
          </p>
        </Heading>

        <m.div variants={fade}>
          <Filters ref={filters} role="group" aria-label="Filter photographs">
            {[null, ...photoTags].map((category) => (
              <button
                key={category ?? 'All'}
                type="button"
                aria-pressed={tag === category}
                className={tag === category ? 'selected' : ''}
                onClick={() => selectTag(category)}
              >
                {category ?? 'All'}
              </button>
            ))}
          </Filters>
        </m.div>

        <PhotoGrid photos={photos} tag={tag} onOpen={setOpenPhoto} onSelectTag={selectTag} />
      </Container>

      {index !== -1 && <FullscreenModal initialIndex={index} images={photos} onClose={closeViewer} />}
    </>
  )
}

const Container = styled(m.section)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

const Filters = styled(ButtonRow)`
  button {
    transition:
      background-color 100ms ease,
      color 100ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
  }
`
