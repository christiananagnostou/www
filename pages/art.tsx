import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import FullscreenModal from '../components/Art/FullScreenModal'
import { ButtonRow } from '../components/Shared/ButtonRow'
import { Heading } from '../components/Shared/Heading'
import { SortedArtImages } from '../lib/art'
import { BASE_URL } from '../lib/constants'
import { getArtStructuredData } from '../lib/structured/art'

const NUM_COLUMNS = 2

const PageTitle = 'Photography | Christian Anagnostou'
const PageDescription = 'A gallery of photography capturing moments by Christian Anagnostou.'
const PageUrl = `${BASE_URL}/art`

// OG image: first image of the sorted list
const ogImage =
  SortedArtImages[0] && SortedArtImages[0].image ? `${BASE_URL}${SortedArtImages[0].image.src}` : undefined

const UNIQUE_TAGS = Array.from(new Set(SortedArtImages.flatMap((img) => img.tags))).sort((a, b) => a.localeCompare(b))

const Art = () => {
  const router = useRouter()
  const { query } = router
  const queriedTag = query.tag?.toString()

  const filteredImages = queriedTag ? SortedArtImages.filter((img) => img.tags.includes(queriedTag)) : SortedArtImages

  const filteredImagesWithIndex = filteredImages.map((item, index) => ({ ...item, index }))

  const columns: (typeof filteredImagesWithIndex)[] = Array.from({ length: NUM_COLUMNS }, () => [])
  filteredImagesWithIndex.forEach((item) => {
    columns[item.index % NUM_COLUMNS].push(item)
  })

  const [modalIndex, setModalIndex] = useState<number | null>(null)

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

        {UNIQUE_TAGS.length > 1 && (
          <ButtonRow>
            <button className={!queriedTag ? 'selected' : ''} onClick={() => router.push({ query: { tag: '' } })}>
              All
            </button>

            {UNIQUE_TAGS.map((tag) => (
              <button
                key={tag}
                className={queriedTag === tag ? 'selected' : ''}
                onClick={() => router.push({ query: { tag: queriedTag === tag ? '' : tag } })}
              >
                {tag}
              </button>
            ))}
          </ButtonRow>
        )}

        <Columns $numColumns={NUM_COLUMNS}>
          {columns.map((colImages, colIndex) => (
            <Column key={`column_${colIndex}`} $numColumns={NUM_COLUMNS}>
              {colImages.map((item) => (
                <ImageWrapper key={item.image.src}>
                  <Image
                    src={item.image}
                    alt={`${item.title} - ${item.date}`}
                    blurDataURL={item.image.blurDataURL}
                    placeholder="blur"
                    layout="responsive"
                    onClick={() => setModalIndex(item.index)}
                    onKeyDown={(e) => e.key === 'Enter' && setModalIndex(item.index)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open full screen image: ${item.title}`}
                  />

                  <HoverBox>
                    <div className="title-date">
                      <p className="title">{item.title}</p>
                      <p className="date">{dayjs(item.date).format(`MMM 'YY`)}</p>
                    </div>
                    <div className="tags">
                      {item.tags.map((tag) => (
                        <button
                          key={tag}
                          className={queriedTag === tag ? 'selected' : ''}
                          onClick={(e) => router.push({ query: { tag: queriedTag === tag ? '' : tag } })}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </HoverBox>
                </ImageWrapper>
              ))}
            </Column>
          ))}
        </Columns>
      </Container>

      <AnimatePresence>
        {modalIndex !== null && (
          <FullscreenModal
            images={filteredImages}
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

const HoverBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  transform: translateY(100%);
  transition: transform 0.25s ease-in-out;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9));
  padding: 50px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--heading);

  p,
  button {
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Subtle shadow for readability */
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
    background: var(--border);
    border: 1px solid var(--accent);
    border-radius: 3px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.25s ease;
    text-transform: capitalize;
    min-width: max-content;

    &.selected {
      color: #ffffff;
      background: var(--accent);
    }
  }
`
const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 5px;
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
