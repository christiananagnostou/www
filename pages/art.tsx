import { AnimatePresence, motion } from 'framer-motion'
import Head from 'next/head'
import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import FullscreenModal from '../components/Art/FullScreenModal'
import { ButtonRow } from '../components/Shared/ButtonRow'
import { Heading } from '../components/Shared/Heading'
import { ArtState } from '../lib/art'
import { BASE_URL } from '../lib/constants'
import { getArtStructuredData } from '../lib/structured/art'

const ART_CATEGORIES = Object.keys(ArtState)
const NUM_COLUMNS = 2

const PageTitle = 'Photography | Christian Anagnostou'
const PageDescription = 'A gallery of photography capturing moments by Christian Anagnostou.'
const PageUrl = `${BASE_URL}/art`

const Art = () => {
  const [selectedCategory, setSelectedCategory] = useState(ART_CATEGORIES[0])
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const flatImages: StaticImageData[] = ArtState[selectedCategory] || []

  // Open Graph image is the first image of the first category.
  const defaultImages = ArtState[ART_CATEGORIES[0]] || []
  const ogImage = defaultImages.length > 0 ? `${BASE_URL}${defaultImages[0].src}` : undefined

  // Distribute images into columns.
  const columns = Array.from({ length: NUM_COLUMNS }, () => [] as { image: StaticImageData; index: number }[])
  flatImages.forEach((img, i) => {
    columns[i % NUM_COLUMNS].push({ image: img, index: i })
  })

  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta name="description" content={PageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={PageUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="art, photography, gallery, Christian Anagnostou" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PageTitle} />
        <meta property="og:description" content={PageDescription} />
        <meta property="og:url" content={PageUrl} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PageTitle} />
        <meta name="twitter:description" content={PageDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getArtStructuredData()) }}
        />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Heading variants={fade}>
          <h1>Photography</h1>
          <p>
            There&apos;s something profound about capturing the world around us. Not necessarily to share it with
            others, but to remember it. To recall the way the light hit the trees or the way the snowflakes fell from
            the sky. It creates moments you can revisit, even if only in your mind.
          </p>
        </Heading>

        {ART_CATEGORIES.length > 1 && (
          <ButtonRow>
            {ART_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'highlight' : ''}
              >
                {category}
              </button>
            ))}
          </ButtonRow>
        )}

        <Columns $numColumns={NUM_COLUMNS}>
          {columns.map((colImages, col) => (
            <Column key={`column_${col}`} $numColumns={NUM_COLUMNS}>
              {colImages.map(({ image, index }) => (
                <ImageContainer
                  key={image.src}
                  onClick={() => setModalIndex(index)}
                  onKeyDown={(e) => e.key === 'Enter' && setModalIndex(index)}
                  role="button"
                  tabIndex={0}
                  aria-label="Open full screen image"
                >
                  <Image src={image} alt="" blurDataURL={image.blurDataURL} placeholder="blur" layout="responsive" />
                </ImageContainer>
              ))}
            </Column>
          ))}
        </Columns>
      </Container>

      <AnimatePresence>
        {modalIndex !== null && (
          <FullscreenModal
            images={flatImages}
            currentIndex={modalIndex}
            onClose={() => setModalIndex(null)}
            onNavigate={(newIndex) => setModalIndex(newIndex)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Art

const Container = styled(motion.section)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

const Columns = styled.section<{ $numColumns: number }>`
  display: flex;
  gap: ${({ $numColumns }) => 20 - $numColumns * 1.5}px;
`

const Column = styled.div<{ $numColumns: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $numColumns }) => 20 - $numColumns * 1.5}px;
  flex: 1;
`

const ImageContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
`
