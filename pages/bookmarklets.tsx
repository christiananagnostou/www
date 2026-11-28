import { AnimatePresence } from 'framer-motion'
import * as m from 'framer-motion/m'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'

import { dropdown, fade, pageAnimation, staggerFade } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import { Heading } from '../components/Shared/Heading'
import { BookWithBookmark } from '../components/SVG/bookmarklets/BookWithBookmark'
import { FilledBookmark } from '../components/SVG/bookmarklets/FilledBookmark'
import DownArrow from '../components/SVG/DownArrow'
import Github from '../components/SVG/GitHub'
import UpArrow from '../components/SVG/UpArrow'
import { bookmarkletsData } from '../lib/bookmarklets'
import BookmarkletLink from '../lib/bookmarklets/BookmarkletLink'
import { getMetrics } from '../lib/bookmarklets/metrics'
import { BASE_URL } from '../lib/constants'
import { getBookmarkletsStructuredData } from '../lib/structured/bookmarklets'

import styles from '../styles/pages/Bookmarklets.module.css'

const PageTitle = 'Bookmarklets | Christian Anagnostou'
const PageDescription = 'A handy list of Bookmarklets by Christian Anagnostou'
const PageUrl = `${BASE_URL}/bookmarklets`

interface BookmarkletWithMetrics {
  id: string
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
      const metrics = await getMetrics(bookmarklet.id)
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
  const pageTransitionInitial = usePageTransitionInitial()
  const [openIndexes, setOpenIndexes] = useState<number[]>([])
  const [installedStates, setInstalledStates] = useState<{ [key: string]: boolean }>({})
  const [localInstallCounts, setLocalInstallCounts] = useState<{ [key: string]: number }>({})
  const initialCounts = useMemo(() => {
    const counts: { [key: string]: number } = {}
    bookmarkletsWithMetrics.forEach((bookmarklet) => {
      counts[bookmarklet.id] = bookmarklet.installs
    })
    return counts
  }, [bookmarkletsWithMetrics])
  const [installCounts, setInstallCounts] = useState<{ [key: string]: number }>(initialCounts)

  useEffect(() => {
    setInstallCounts((prev) => (Object.keys(prev).length ? prev : initialCounts))

    const storedCounts = JSON.parse(localStorage.getItem('installedBookmarkletCounts') || '{}')
    setLocalInstallCounts(storedCounts)

    // Load installed states from localStorage (supports legacy title keys)
    const installedBookmarklets = JSON.parse(localStorage.getItem('installedBookmarklets') || '{}')
    const installedById: { [key: string]: boolean } = {}
    bookmarkletsWithMetrics.forEach((bookmarklet) => {
      installedById[bookmarklet.id] =
        installedBookmarklets[bookmarklet.id] ?? installedBookmarklets[bookmarklet.title] ?? false
    })
    setInstalledStates(installedById)
  }, [bookmarkletsWithMetrics, initialCounts])

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleInstallClick = async (bookmarkletId: string) => {
    if (!installedStates[bookmarkletId]) {
      try {
        const res = await fetch(`/api/bookmarklets/metrics/${encodeURIComponent(bookmarkletId)}?type=installs`, {
          method: 'POST',
        })
        if (!res.ok) {
          throw new Error(`Failed to track install (${res.status})`)
        }
        const data = await res.json()
        if (typeof data.installs !== 'number') {
          throw new Error('Invalid metrics response')
        }
        setInstallCounts((prev) => ({ ...prev, [bookmarkletId]: data.installs }))
        setInstalledStates((prev) => ({ ...prev, [bookmarkletId]: true }))

        const updatedLocalCounts = { ...localInstallCounts, [bookmarkletId]: data.installs }
        setLocalInstallCounts(updatedLocalCounts)

        // Save to localStorage
        const installedBookmarklets = JSON.parse(localStorage.getItem('installedBookmarklets') || '{}')
        installedBookmarklets[bookmarkletId] = true
        localStorage.setItem('installedBookmarklets', JSON.stringify(installedBookmarklets))
        localStorage.setItem('installedBookmarkletCounts', JSON.stringify(updatedLocalCounts))
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
        <meta key="og:type" content="website" property="og:type" />
        <meta key="og:title" content={PageTitle} property="og:title" />
        <meta key="og:description" content={PageDescription} property="og:description" />
        <meta key="og:url" content={PageUrl} property="og:url" />

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

      <m.section
        className={styles.container}
        animate="show"
        exit="exit"
        initial={pageTransitionInitial}
        variants={pageAnimation}
      >
        <Heading variants={fade}>
          <h1>Bookmarklets</h1>
          <p>
            A bookmarklet is a special bookmark that runs JavaScript code directly in your browser. Drag the links below
            into your bookmarks bar to use them on any page.
          </p>
        </Heading>

        <m.div className={styles.bookmarkletsContainer} variants={staggerFade}>
          {bookmarkletsWithMetrics.map((bookmarklet, index) => {
            const { id, title, description, code, githubUrl, instructions } = bookmarklet
            const originalBookmarklet = bookmarkletsData.find((b) => b.id === id)
            const icon = originalBookmarklet?.icon
            const isOpen = openIndexes.includes(index)
            const isInstalled = installedStates[id]
            const serverCount = installCounts[id] || 0
            const localCount = localInstallCounts[id] || 0
            const installCount = isInstalled ? Math.max(serverCount, localCount) : serverCount

            return (
              <m.div className={styles.bookmarkletItem} key={id} variants={fade}>
                <div className="main-content">
                  {/* Top row: icon + "title link" */}
                  <div className={styles.topRow}>
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

                    <div className={styles.rightSide}>
                      {/* GitHub link */}
                      {githubUrl ? (
                        <a
                          aria-label={`View the ${title} bookmarklet on GitHub.`}
                          className={styles.githubUrl}
                          href={githubUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Github />
                          Source
                        </a>
                      ) : null}

                      {/* Install tracking button */}
                      <button
                        className={`${styles.installButton} ${isInstalled ? 'installed' : ''}`}
                        disabled={isInstalled}
                        title={isInstalled ? 'Already marked as installed' : 'Mark as installed'}
                        onClick={() => handleInstallClick(id)}
                      >
                        {isInstalled ? <FilledBookmark /> : <BookWithBookmark />}
                        <span>{installCount}</span>
                      </button>
                    </div>
                  </div>

                  {/* Toggleable description (button) */}
                  <button
                    aria-controls={`instructions-${index}`}
                    aria-expanded={isOpen}
                    className={styles.toggleArea}
                    onClick={() => toggleOpen(index)}
                  >
                    <p className="summary">{description}</p>
                    <span className={styles.toggleArrow}>{isOpen ? <UpArrow /> : <DownArrow />}</span>
                  </button>

                  {/* Instructions panel, if open */}
                  <AnimatePresence>
                    {isOpen ? (
                      <m.div
                        key={title}
                        animate="show"
                        aria-label={`${title} instructions`}
                        exit="exit"
                        id={`instructions-${index}`}
                        initial="hidden"
                        role="region"
                        variants={dropdown}
                      >
                        <div className={styles.instructions}>
                          {instructions.split('\n').map((line, i) => (
                            <p key={`${title}-line-${i}`}>{line}</p>
                          ))}
                        </div>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </m.div>
            )
          })}
        </m.div>
      </m.section>
    </>
  )
}
