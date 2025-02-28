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

  const flatImages = queriedTag ? SortedArtImages.filter((img) => img.tags.includes(queriedTag)) : SortedArtImages

  const flatImagesWithIndex = flatImages.map((item, index) => ({ ...item, index }))

  const columns: typeof flatImagesWithIndex[] = Array.from({ length: NUM_COLUMNS }, () => [])
  flatImagesWithIndex.forEach((item) => {
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
                <ImageWrapper
                  key={item.image.src}
                  onClick={() => setModalIndex(item.index)}
                  onKeyDown={(e) => e.key === 'Enter' && setModalIndex(item.index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open full screen image: ${item.title}`}
                >
                  <Image
                    src={item.image}
                    alt={`${item.title} - ${item.date}`}
                    blurDataURL={item.image.blurDataURL}
                    placeholder="blur"
                    layout="responsive"
                  />
                  <HoverBox className="hover-box">
                    <p>{item.title}</p>
                    <p className="date">{dayjs(item.date).format(`MMM 'YY`)}</p>
                    {/* Tags */}
                    <p className="tags">
                      {item.tags.map((tag) => (
                        <button
                          key={tag}
                          className={queriedTag === tag ? 'selected' : ''}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (queriedTag !== tag) router.push({ query: { tag } })
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </p>
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
            images={flatImages.map((item) => item.image)}
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

  --hover-box-height: 100px;
  --hover-box-shadow-height: calc(var(--hover-box-height) * 1.5);

  ::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: var(--hover-box-shadow-height);
    z-index: 1;
    background: linear-gradient(to bottom, transparent, #171717);
    transition: top 0.28s ease-in-out;
    pointer-events: none;
  }

  &:hover {
    ::after {
      top: calc(100% - var(--hover-box-shadow-height) + 1px); /* 1px to fix gap */
    }

    .hover-box {
      bottom: 0;

      p {
        scale: 1;
      }
    }
  }
`

const HoverBox = styled.div`
  position: absolute;
  left: 0;
  bottom: calc(-1 * var(--hover-box-height));
  height: var(--hover-box-height);
  width: 100%;
  transition: bottom 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: end;
  z-index: 2;
  padding: 10px;

  p {
    font-size: 0.9rem;
    padding-bottom: 3px;
    scale: 0.8;
    transition: scale 0.25s ease-in-out;
    transform-origin: left;
    color: var(--text);
  }

  .date {
    font-size: 0.7rem;
  }

  .tags {
    display: flex;
    gap: 5px;
    justify-content: center;

    button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      font-size: 0.7rem;
      color: var(--text);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      &.selected {
        font-weight: bold;
      }
    }
  }
`
