import * as m from 'framer-motion/m'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import type { ProjectType } from '../../lib/projects'
import bayBike from '../../public/img/art/photography/bay_bike.jpg'
import coit from '../../public/img/art/photography/coit.jpg'
import goldenGate from '../../public/img/art/photography/golden_gate.jpg'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'

// Bytes on disk from one ImgPress batch: Shareable JPEG, 75% quality, 50% dimensions.
const photos = [
  { title: 'Bay Bike', image: bayBike, original: 177416, output: 64632 },
  { title: 'Golden Gate', image: goldenGate, original: 82211, output: 35465 },
  { title: 'Coit', image: coit, original: 80417, output: 33968 },
]
const kb = (bytes: number) => (bytes / 1000).toFixed(1) + ' kB'
const total = photos.reduce(
  (sum, photo) => ({ original: sum.original + photo.original, output: sum.output + photo.output }),
  { original: 0, output: 0 }
)

export default function ImgPressStudy({ project }: { project: ProjectType }) {
  const initial = usePageTransitionInitial()
  const [panel, result] = project.desktopImgs
  const [batch, reflection] = project.details
  return (
    <Study initial={initial} animate="show" exit="exit" variants={pageAnimation}>
      <Link href="/projects">/ Projects</Link>
      <header>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <a href={project.github}>View source on GitHub</a>
      </header>
      <Stage>
        <Image
          src={bayBike}
          alt="A blue road bike on the waterfront, one of the originals in this batch."
          className="photo"
          sizes="(min-width: 800px) 450px, 55vw"
          priority
        />
        <a href={panel.src} aria-label="View the full-size ImgPress settings screenshot">
          <Image
            src={panel}
            alt="The ImgPress panel with JPEG selected, quality at 75% and resize scale at 50%."
            sizes="(min-width: 800px) 272px, 50vw"
            priority
          />
        </a>
      </Stage>
      <section>
        <Copy>
          <h2>{batch.title}</h2>
          <p>{batch.description}</p>
        </Copy>
        <Files aria-label="Measured JPEG file sizes for the three photos">
          <thead>
            <tr>
              <th scope="col">Photograph</th>
              <th scope="col">Original</th>
              <th scope="col">Export</th>
            </tr>
          </thead>
          <tbody>
            {photos.map(({ title, image, original, output }) => (
              <tr key={title}>
                <th scope="row">
                  <div>
                    <Image src={image} alt="" width={50} height={50} />
                    {title}
                  </div>
                </th>
                <td>{kb(original)}</td>
                <td>{kb(output)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Batch total</th>
              <td>{kb(total.original)}</td>
              <td>{kb(total.output)}</td>
            </tr>
          </tfoot>
        </Files>
      </section>
      <Result>
        <div>
          <h2>{reflection.title}</h2>
          <p>{reflection.description}</p>
        </div>
        <Image
          src={result}
          alt="ImgPress reports that all three files converted, saving 206 kB, or 60.6%."
          sizes="(min-width: 800px) 360px, (min-width: 620px) 43vw, 88vw"
        />
      </Result>
      <footer>
        <Link href="/art">More of my photography</Link>
      </footer>
    </Study>
  )
}

const Study = styled(m.article)`
  max-width: var(--max-w-screen);
  margin: auto;
  padding: 2rem 1rem 4rem;
  header {
    margin: clamp(2rem, 6vw, 3rem) 0 1.5rem;
  }
  h1,
  h2 {
    letter-spacing: -0.04em;
    line-height: 1.08;
    font-weight: 500;
  }
  h1 {
    font-size: clamp(3.4rem, 9vw, 5rem);
  }
  h2 {
    font-size: clamp(1.5rem, 4vw, 2.05rem);
  }
  p {
    line-height: 1.6;
  }
  header p {
    max-width: 35rem;
    margin: 0.8rem 0;
    font-size: 1.1rem;
  }
  a {
    text-underline-offset: 0.25em;
  }
  > a,
  footer {
    color: var(--text-dark);
    font-size: 0.88rem;
  }
  header a {
    color: #b9d8ed;
    text-decoration-color: currentColor;
  }
  a:focus-visible {
    outline: 2px solid #b9d8ed;
    outline-offset: 4px;
  }
  footer {
    margin-top: 2rem;
  }
`

const Stage = styled.figure`
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  background: #86adbc;
  .photo {
    position: absolute;
    z-index: -1;
    inset: 0 auto 0 0;
    width: 62%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 68%;
  }
  a {
    display: block;
    width: min(48%, 17rem);
    margin: clamp(1rem, 3vw, 1.7rem) clamp(1rem, 5vw, 3rem) clamp(1rem, 3vw, 1.7rem) 0;
  }
  a:focus-visible {
    outline-color: #183545;
  }
  a img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-md);
    box-shadow: 0 8px 24px #13384855;
  }
`
const Copy = styled.div`
  display: grid;
  gap: 0.8rem;
  margin: clamp(2.2rem, 7vw, 3.6rem) 0 1.5rem;
  @media (width >= 620px) {
    grid-template-columns: 0.8fr 1.2fr;
    gap: 2.25rem;
  }
`
const Files = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: right;
  font-variant-numeric: tabular-nums;
  th,
  td {
    padding: 0.65rem 0;
    font-weight: normal;
    white-space: nowrap;
  }
  tr {
    border-bottom: 1px solid var(--accent);
  }
  :where(th:first-child) {
    text-align: left;
  }
  th div {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }
  img {
    display: block;
    width: 2.7rem;
    height: 2.7rem;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
  }
  thead th {
    color: var(--text-dark);
    font-size: 0.86rem;
  }
  td {
    padding-left: 0.5rem;
  }
  tfoot tr {
    border: 0;
  }
  tfoot th,
  tfoot td {
    color: var(--heading);
    font-weight: 600;
    padding-top: 1rem;
  }
`
const Result = styled.section`
  display: grid;
  align-items: center;
  gap: 1.35rem;
  margin-top: clamp(2rem, 6vw, 3rem);
  padding: clamp(1.15rem, 3vw, 1.65rem);
  background: #232b2b;
  border-radius: var(--border-radius-lg);
  p {
    margin-top: 0.8rem;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-md);
  }
  @media (width >= 620px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
`
