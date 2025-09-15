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

  const columns: Array<typeof filteredImagesWithIndex> = Array.from({ length: NUM_COLUMNS }, () => [])
  filteredImagesWithIndex.forEach((item) => {
    columns[item.index % NUM_COLUMNS].push(item)
  })

  const [modalIndex, setModalIndex] = useState<number | null>(null)

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
        <meta content="website" property="og:type" />
        <meta content={PageTitle} property="og:title" />
        <meta content={PageDescription} property="og:description" />
        <meta content={PageUrl} property="og:url" />
        {ogImage ? <meta content={ogImage} property="og:image" /> : null}
        {/* Twitter Card */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={PageTitle} name="twitter:title" />
        <meta content={PageDescription} name="twitter:description" />
        {ogImage ? <meta content={ogImage} name="twitter:image" /> : null}
        {/* Structured Data */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getArtStructuredData()) }}
          type="application/ld+json"
        />
      </Head>

      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
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
                    alt={`${item.title} - ${item.date}`}
                    aria-label={`Open full screen image: ${item.title}`}
                    blurDataURL={item.image.blurDataURL}
                    layout="responsive"
                    placeholder="blur"
                    role="button"
                    src={item.image}
                    tabIndex={0}
                    onClick={() => setModalIndex(item.index)}
                    onKeyDown={(e) => e.key === 'Enter' && setModalIndex(item.index)}
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
            currentIndex={modalIndex}
            images={filteredImages}
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
    border-radius: var(--border-radius-sm);
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
