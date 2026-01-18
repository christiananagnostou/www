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
const ogImage = SortedArtImages[0]?.image ? `${BASE_URL}${SortedArtImages[0].image.src}` : undefined

const UNIQUE_TAGS = Array.from(new Set(SortedArtImages.flatMap((img) => img.tags))).toSorted((a, b) =>
  a.localeCompare(b)
)

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
                          onClick={() => router.push({ query: { tag: queriedTag === tag ? '' : tag } })}
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
  max-width: var(--max-w-screen);
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text);
  overflow: hidden;
`

const Columns = styled.section<{ $numColumns: number }>`
  display: flex;
  gap: ${({ $numColumns }) => 20 - $numColumns * 1.5}px;
`

const Column = styled.div<{ $numColumns: number }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ $numColumns }) => 20 - $numColumns * 1.5}px;
`

const HoverBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 50px 10px 10px;
  background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 90%));
  color: var(--heading);
  transform: translateY(100%);
  transition: transform 0.25s ease-in-out;

  p,
  button {
    text-shadow: 0 0 5px rgb(0 0 0 / 50%); /* Subtle shadow for readability */
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
    min-width: max-content;
    padding: 2px 5px;
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    background: var(--border);
    font-size: 0.7rem;
    color: var(--text);
    text-transform: capitalize;
    cursor: pointer;
    transition: all 0.25s ease;

    &.selected {
      background: var(--accent);
      color: #ffffff;
    }
  }
`
const ImageWrapper = styled.div`
  position: relative;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  overflow: hidden;

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
