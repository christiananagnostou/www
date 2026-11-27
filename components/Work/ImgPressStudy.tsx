import * as m from 'framer-motion/m'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import type { ProjectType } from '../../lib/projects'
import { formatKilobytes, IMG_PRESS_BATCH, IMG_PRESS_SAMPLES } from '../../lib/projects/imgPressBatch'
import bayBike from '../../public/img/art/photography/bay_bike.jpg'
import goldenGate from '../../public/img/art/photography/golden_gate.jpg'
import chess from '../../public/img/art/photography/hmb_chess.jpg'
import sonomaTruck from '../../public/img/art/photography/sonoma_truck.jpg'
import bayBikeExport from '../../public/img/projects/imgpress/bay-bike-export.jpg'
import goldenGateExport from '../../public/img/projects/imgpress/golden_gate.jpg'
import chessExport from '../../public/img/projects/imgpress/hmb_chess.jpg'
import sonomaTruckExport from '../../public/img/projects/imgpress/sonoma_truck.jpg'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'
import ProjectsBackLink from './ProjectsBackLink'
import { projectTheme } from './projectTheme'

import styles from './ImgPressStudy.module.css'

const featured = { title: 'Bay Bike', image: bayBike, exported: bayBikeExport, original: 177416, output: 64632 }
const images = {
  'sonoma_truck.jpg': { image: sonomaTruck, exported: sonomaTruckExport },
  'golden_gate.jpg': { image: goldenGate, exported: goldenGateExport },
  'hmb_chess.jpg': { image: chess, exported: chessExport },
}
const photos = IMG_PRESS_SAMPLES.map(({ file, ...sample }) => ({ ...sample, ...images[file] }))

export default function ImgPressStudy({ project }: { project: ProjectType }) {
  const initial = usePageTransitionInitial()
  const [photo, setPhoto] = useState(featured)
  const stage = useRef<HTMLElement>(null)
  function compare(next: typeof featured) {
    setPhoto(next)
    stage.current?.focus({ preventScroll: true })
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stage.current?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'instant' : 'smooth' })
  }
  const [panel, result] = project.desktopImgs
  const [batch, reflection] = project.details
  return (
    <m.article
      className={styles.study}
      style={projectTheme(project.themeColor)}
      initial={initial}
      animate="show"
      exit="exit"
      variants={pageAnimation}
    >
      <ProjectsBackLink />
      <header>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <a href={project.github}>View source on GitHub</a>
      </header>
      <figure className={styles.stage} ref={stage} id="imgpress-comparison" tabIndex={-1} aria-label="Photo comparison">
        <div className={styles.comparison}>
          <Image
            src={photo.image}
            alt={`${photo.title}: original on the left, ImgPress export on the right.`}
            unoptimized
            priority={photo === featured}
          />
          <Image src={photo.exported} alt="" className="export" unoptimized priority={photo === featured} />
          <dl className={styles.fileLabels}>
            <div>
              <dt>Original</dt>
              <dd>{formatKilobytes(photo.original)}</dd>
            </div>
            <div>
              <dt>Export</dt>
              <dd>{formatKilobytes(photo.output)}</dd>
            </div>
          </dl>
        </div>
        <a href={panel.src} aria-label="View the full-size ImgPress settings screenshot">
          <Image
            src={panel}
            alt="The ImgPress panel with JPEG selected, quality at 75% and resize scale at 50%."
            sizes="(min-width: 800px) 272px, 50vw"
            priority
          />
        </a>
      </figure>
      <section>
        <div className={styles.copy}>
          <h2>{batch.title}</h2>
          <p>{batch.description}</p>
        </div>
        <table className={styles.files} aria-label="Measured JPEG file sizes">
          <thead>
            <tr>
              <th scope="col">Photograph</th>
              <th scope="col">Original</th>
              <th scope="col">Export</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((item) => (
              <tr key={item.title}>
                <th scope="row">
                  <button
                    type="button"
                    aria-pressed={item === photo}
                    aria-controls="imgpress-comparison"
                    onClick={() => compare(item)}
                  >
                    <Image src={item.image} alt="" width={50} height={50} />
                    {item.title}
                  </button>
                </th>
                <td>{formatKilobytes(item.original)}</td>
                <td>{formatKilobytes(item.output)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Batch total</th>
              <td>{formatKilobytes(IMG_PRESS_BATCH.original)}</td>
              <td>{formatKilobytes(IMG_PRESS_BATCH.output)}</td>
            </tr>
          </tfoot>
        </table>
      </section>
      <section className={styles.result}>
        <div>
          <h2>{reflection.title}</h2>
          <p>{reflection.description}</p>
        </div>
        <Image
          src={result}
          alt="ImgPress reports that all three files converted, saving 338 kB, or 59.7%."
          unoptimized
        />
      </section>
      <footer>
        <Link href="/art">More of my photography</Link>
      </footer>
    </m.article>
  )
}
