import * as m from 'framer-motion/m'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { fade, pageAnimation } from '../../components/animation'
import { usePageTransitionInitial } from '../../components/animation/MotionProvider'
import FullscreenModal from '../../components/Art/FullScreenModal'
import PhotoFilters from '../../components/Art/PhotoFilters'
import PhotoGrid from '../../components/Art/PhotoGrid'
import { Heading } from '../../components/Shared/Heading'
import type { ArtImage } from '../../lib/art'
import { photoFilters, photosForTag } from '../../lib/art/gallery'
import { BASE_URL } from '../../lib/constants'
import { getArtStructuredData } from '../../lib/structured/art'

import styles from '../../styles/pages/Photography.module.css'

type Props = { initialTag: string | null }
type Params = { category?: string[] }

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: photoFilters.map((tag) => ({ params: { category: tag ? [tag] : [] } })),
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
  const activeButton = useRef<HTMLButtonElement>(null)
  const closeViewer = useCallback(() => setOpenPhoto(null), [])

  useEffect(() => {
    router.events.on('routeChangeStart', closeViewer)
    return () => router.events.off('routeChangeStart', closeViewer)
  }, [router.events, closeViewer])

  const selectTag = useCallback(
    (next: string | null) =>
      router.push({ pathname: '/art', query: next ? { tag: next } : {} }, undefined, {
        shallow: true,
        scroll: false,
      }),
    [router]
  )
  const selectPhotoTag = useCallback(
    async (next: string | null) => {
      if (!(await selectTag(next))) return
      activeButton.current?.focus({ preventScroll: true })
      // Smooth-scrolling through a newly filtered grid would request every photo on the way up.
      window.scrollTo({ top: 0, behavior: 'instant' })
    },
    [selectTag]
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

      <m.section
        className={styles.container}
        animate="show"
        exit="exit"
        initial={pageTransitionInitial}
        variants={pageAnimation}
      >
        <Heading variants={fade}>
          <h1>Photography</h1>
          <p>
            There&apos;s something profound about capturing the world around us. Not necessarily to share it with
            others, but to remember it. To recall the way the light hit the trees or the way the snowflakes fell from
            the sky. It creates moments you can revisit, even if only in your mind.
          </p>
        </Heading>

        <PhotoFilters activeTag={tag} activeButtonRef={activeButton} onSelect={selectTag} />
        <PhotoGrid photos={photos} tag={tag} onOpen={setOpenPhoto} onSelectTag={selectPhotoTag} />
      </m.section>

      {index !== -1 && <FullscreenModal initialIndex={index} images={photos} onClose={closeViewer} />}
    </>
  )
}
