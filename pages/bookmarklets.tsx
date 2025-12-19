import { AnimatePresence, motion } from 'framer-motion'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { dropdown, fade, pageAnimation, staggerFade } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import { BookWithBookmark } from '../components/SVG/bookmarklets/BookWithBookmark'
import Checkmark from '../components/SVG/Checkmark'
import DownArrow from '../components/SVG/DownArrow'
import Github from '../components/SVG/GitHub'
import UpArrow from '../components/SVG/UpArrow'
import { bookmarkletsData } from '../lib/bookmarklets'
import BookmarkletLink from '../lib/bookmarklets/BookmarkletLink'
import { getMetrics } from '../lib/bookmarklets/metrics'
import { BASE_URL } from '../lib/constants'
import { getBookmarkletsStructuredData } from '../lib/structured/bookmarklets'

const PageTitle = 'Bookmarklets | Christian Anagnostou'
const PageDescription = 'A handy list of Bookmarklets by Christian Anagnostou'
const PageUrl = `${BASE_URL}/bookmarklets`

interface BookmarkletWithMetrics {
  title: string
  description: string
  code: string
  githubUrl?: string
  instructions: string
  installs: number
}

interface Props {
  bookmarkletsWithMetrics: BookmarkletWithMetrics[]
}

export async function getStaticProps() {
  const bookmarkletsWithMetrics = await Promise.all(
    bookmarkletsData.map(async (bookmarklet) => {
      const metrics = await getMetrics(bookmarklet.title)
      // Exclude the icon from serialization
      const { icon: _icon, ...serializableBookmarklet } = bookmarklet
      return { ...serializableBookmarklet, installs: metrics.installs }
    })
  )

  return {
    props: {
      bookmarkletsWithMetrics,
    },
    revalidate: 60 * 5, // Revalidate every 5 minutes
  }
}

export default function Bookmarklets({ bookmarkletsWithMetrics }: Props) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])
  const [installedStates, setInstalledStates] = useState<{ [key: string]: boolean }>({})
  const [installCounts, setInstallCounts] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    // Initialize install counts from props
    const initialCounts: { [key: string]: number } = {}
    bookmarkletsWithMetrics.forEach((bookmarklet) => {
      initialCounts[bookmarklet.title] = bookmarklet.installs
    })
    setInstallCounts(initialCounts)

    // Load installed states from localStorage
    const installedBookmarklets = JSON.parse(localStorage.getItem('installedBookmarklets') || '{}')
    setInstalledStates(installedBookmarklets)
  }, [bookmarkletsWithMetrics])

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleInstallClick = async (title: string) => {
    if (!installedStates[title]) {
      try {
        const res = await fetch(`/api/bookmarklets/metrics/${encodeURIComponent(title)}?type=installs`, {
          method: 'POST',
        })
        const data = await res.json()
        setInstallCounts((prev) => ({ ...prev, [title]: data.installs }))
        setInstalledStates((prev) => ({ ...prev, [title]: true }))

        // Save to localStorage
        const installedBookmarklets = JSON.parse(localStorage.getItem('installedBookmarklets') || '{}')
        installedBookmarklets[title] = true
        localStorage.setItem('installedBookmarklets', JSON.stringify(installedBookmarklets))
      } catch (error) {
        console.error('Failed to track install:', error)
      }
    }
  }

  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta content={PageDescription} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href={PageUrl} rel="canonical" />
        <meta content="index, follow" name="robots" />
        <meta content="bookmarklets, javascript, web tools, Christian Anagnostou" name="keywords" />

        {/* Open Graph */}
        <meta content="website" property="og:type" />
        <meta content={PageTitle} property="og:title" />
        <meta content={PageDescription} property="og:description" />
        <meta content={PageUrl} property="og:url" />

        {/* Twitter Card */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={PageTitle} name="twitter:title" />
        <meta content={PageDescription} name="twitter:description" />

        {/* Structured Data */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBookmarkletsStructuredData()) }}
          type="application/ld+json"
        />
      </Head>

      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Bookmarklets</h1>
          <p>
            A bookmarklet is a special bookmark that runs JavaScript code directly in your browser. Drag the links below
            into your bookmarks bar to use them on any page.
          </p>
        </Heading>

        <BookmarkletsContainer variants={staggerFade}>
          {bookmarkletsWithMetrics.map((bookmarklet, index) => {
            const { title, description, code, githubUrl, instructions } = bookmarklet
            const originalBookmarklet = bookmarkletsData.find((b) => b.title === title)
            const icon = originalBookmarklet?.icon
            const isOpen = openIndexes.includes(index)
            const isInstalled = installedStates[title]
            const installCount = installCounts[title] || 0

            return (
              <BookmarkletItem key={title} variants={fade}>
                <div className="main-content">
                  {/* Top row: icon + "title link" */}
                  <div className="top-row">
                    <div aria-hidden="true" className="icon">
                      {icon}
                    </div>
                    <h2 className="title">
                      <BookmarkletLink
                        aria-label={`Drag or click to use the ${title} bookmarklet.`}
                        code={code}
                        draggable="true"
                      >
                        {title}
                      </BookmarkletLink>
                    </h2>

                    <div className="right-side">
                      {/* GitHub link */}
                      {githubUrl ? (
                        <a
                          aria-label={`View the ${title} bookmarklet on GitHub.`}
                          className="github-url"
                          href={githubUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Github />
                          Source
                        </a>
                      ) : null}

                      {/* Install tracking button */}
                      <InstallButton
                        className={isInstalled ? 'installed' : ''}
                        disabled={isInstalled}
                        title={isInstalled ? 'Already marked as installed' : 'Mark as installed'}
                        onClick={() => handleInstallClick(title)}
                      >
                        {isInstalled ? <Checkmark /> : <BookWithBookmark />}
                        <span>{installCount}</span>
                      </InstallButton>
                    </div>
                  </div>

                  {/* Toggleable description (button) */}
                  <button
                    aria-controls={`instructions-${index}`}
                    aria-expanded={isOpen}
                    className="toggle-area"
                    onClick={() => toggleOpen(index)}
                  >
                    <p className="summary">{description}</p>
                    <span className="toggle-arrow">{isOpen ? <UpArrow /> : <DownArrow />}</span>
                  </button>

                  {/* Instructions panel, if open */}
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        key={title}
                        animate="show"
                        aria-label={`${title} instructions`}
                        exit="exit"
                        id={`instructions-${index}`}
                        initial="hidden"
                        role="region"
                        variants={dropdown}
                      >
                        <div className="instructions">
                          {instructions.split('\n').map((line, i) => (
                            <p key={`${title}-line-${i}`}>{line}</p>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </BookmarkletItem>
            )
          })}
        </BookmarkletsContainer>
      </Container>
    </>
  )
}

const Container = styled(motion.section)`
  max-width: var(--max-w-screen);
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text);
  overflow: hidden;
`

const BookmarkletsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: auto;
  place-content: center center;
`

const BookmarkletItem = styled(motion.div)`
  display: flex;
  width: 100%;

  .main-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.5rem;
  }

  .top-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 25px;
      font-size: 1.25rem;
    }

    .title {
      margin: 0;
      font-weight: normal;
      font-size: 1rem;

      & * {
        cursor: grab;
      }
      & *:active {
        cursor: grabbing;
      }
    }

    .github-url {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-left: auto;
      font-size: 0.85rem;
      color: var(--text-dark);
      text-decoration: none;
      cursor: alias;
      transition: color 0.2s ease;

      &:hover,
      &:focus {
        color: var(--text);
      }
    }

    .right-side {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
    }
  }

  .toggle-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: var(--border-radius-sm);
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease;

    .summary {
      margin: 0;
      font-weight: 300;
      font-size: 0.9rem;
      color: var(--text);
    }

    .toggle-arrow {
      margin-left: 1rem;
      color: var(--text-dark);
      transition: color 0.2s ease;

      svg {
        width: 1.2em;
        height: 1.2em;
      }
    }

    &:hover,
    &:focus {
      outline: none;
      background: #262626;

      .toggle-arrow {
        color: var(--text);
      }
    }
  }

  .instructions {
    padding: 0.75rem;
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    background: var(--dark-bg);

    p {
      margin: 0.25rem 0;
      font-weight: 300;
      font-size: 0.8rem;
      line-height: 1.3;
    }
  }

  @media screen and (width <= 500px) {
    flex-direction: column;

    .top-row {
      .icon {
        margin: 0 0.5rem 0 0;
      }
    }

    .toggle-area {
      padding: 0.4rem 0.6rem;
    }
  }
`

const InstallButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-sm);
  background: transparent;
  font-size: 0.8rem;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--accent);
    color: var(--text);
  }

  &:disabled,
  &.installed {
    background: var(--accent);
    opacity: 0.8;
    color: var(--text);
    cursor: default;
  }

  span {
    font-weight: 500;
    font-size: 0.75rem;
  }

  svg {
    max-width: 0.875rem;
    max-height: 0.875rem;
  }
`
