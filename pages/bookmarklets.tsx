import { motion } from 'framer-motion'
import Head from 'next/head'
import { useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import DownArrow from '../components/SVG/DownArrow'
import Github from '../components/SVG/GitHub'
import UpArrow from '../components/SVG/UpArrow'
import { bookmarkletsData } from '../lib/bookmarklets'

export default function Bookmarklets() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <>
      <Head>
        <title>Bookmarklets</title>
        <meta name="description" content="A handy list of Bookmarklets by Christian Anagnostou" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        {/* <PageTitle titleLeft="Handy" titleRight="Bookmarklets" /> */}

        <Heading variants={fade}>
          <h1>Bookmarklets</h1>
          <p>
            A bookmarklet is a special bookmark that runs JavaScript code directly in your browser. Drag the links below
            into your bookmarks bar to use them on any page.
          </p>
        </Heading>

        <BookmarkletsContainer variants={staggerFade}>
          {bookmarkletsData.map(({ title, description, code, icon, githubUrl, instructions }, index) => {
            const isOpen = openIndexes.includes(index)

            return (
              <BookmarkletItem key={title} variants={fade}>
                <div className="main-content">
                  {/* Top row: icon + "title link" */}
                  <div className="top-row">
                    <div className="icon" aria-hidden="true">
                      {icon}
                    </div>
                    <h2 className="title">
                      <TitleLink
                        href={code}
                        draggable="true"
                        aria-label={`Drag or click to use the ${title} bookmarklet.`}
                      >
                        {title}
                      </TitleLink>
                    </h2>

                    {/* GitHub link */}
                    <a
                      href={githubUrl}
                      aria-label={`View the ${title} bookmarklet on GitHub.`}
                      className="github-url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github />
                      Code
                    </a>
                  </div>

                  {/* Toggleable description (button) */}
                  <button
                    className="toggle-area"
                    onClick={() => toggleOpen(index)}
                    aria-expanded={isOpen}
                    aria-controls={`instructions-${index}`}
                  >
                    <p className="summary">{description}</p>
                    <span className="toggle-arrow">{isOpen ? <UpArrow /> : <DownArrow />}</span>
                  </button>

                  {/* Instructions panel, if open */}
                  {isOpen && (
                    <div
                      className="instructions"
                      id={`instructions-${index}`}
                      role="region"
                      aria-label={`${title} instructions`}
                    >
                      {instructions.split('\n').map((line, i) => (
                        <p key={`${title}-line-${i}`}>{line}</p>
                      ))}
                    </div>
                  )}
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
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

const BookmarkletsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  margin: auto;
  gap: 2rem;
`

const BookmarkletItem = styled(motion.div)`
  width: 100%;
  display: flex;

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .top-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
      font-size: 1.25rem;
      min-width: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title {
      margin: 0;
      font-size: 1rem;
      font-weight: 400;

      & * {
        cursor: -webkit-grab;
        cursor: grab;
      }
      & *:active {
        cursor: -webkit-grabbing;
        cursor: grabbing;
      }
    }

    .github-url {
      margin-left: auto;
      display: flex;
      align-items: center;
      color: var(--text-dark);
      gap: 0.25rem;
      font-size: 0.85rem;
      text-decoration: none;
      transition: color 0.2s ease;
      cursor: alias;

      &:hover,
      &:focus {
        color: var(--text);
      }
    }
  }

  .toggle-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 5px;
    width: 100%;
    text-align: left;
    background: transparent;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover,
    &:focus {
      outline: none;
      background: #262626;

      .toggle-arrow {
        color: var(--text);
      }
    }

    .summary {
      font-size: 0.9rem;
      margin: 0;
      font-weight: 300;
      color: var(--text);
    }

    .toggle-arrow {
      margin-left: 1rem;
      color: var(--text-dark);
      transition: color 0.2s ease;

      svg {
        height: 1.2em;
        width: 1.2em;
      }
    }
  }

  .instructions {
    padding: 0.75rem;
    background: var(--dark-bg);
    border: 1px solid var(--accent);
    border-radius: 5px;

    p {
      margin: 0.25rem 0;
      font-size: 0.8rem;
      line-height: 1.3;
      font-weight: 300;
    }
  }

  @media screen and (max-width: 500px) {
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

const TitleLink = styled.a`
  color: var(--heading);
  text-decoration: none;
  font-weight: 300;
  transition: text-decoration 0.2s ease;

  &:hover,
  &:focus {
    text-decoration: underline;
    outline: none;
  }
`
