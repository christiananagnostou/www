import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { CSSProperties } from 'react'

import s from './ProjectDesigns.module.css'

type Project = {
  slug: string
  title: string
  year: string
  description: string
  image: string | null
  detail: string | null
  medium: string
}

const designs = [
  ['workbench', 'Workbench'],
  ['plates', 'Plates'],
  ['loupe', 'Loupe'],
  ['index', 'Original'],
] as const
type Design = (typeof designs)[number][0]

function Sample({ project, design }: { project: Project; design: Design }) {
  const sizes = {
    index: '(max-width:600px) 80px, 128px',
    workbench: '(max-width:600px) 100px, 160px',
    plates: '(max-width:600px) 90vw, 320px',
    loupe: '(max-width:600px) 85px, 230px',
  }
  const second = design === 'plates' && project.detail
  if (design === 'workbench' && project.slug === 'jukebox') {
    return (
      <div className={`${s.art} ${s.record}`} aria-hidden="true">
        <i />
        <div>
          <small>Now playing</small>
          <b>Room Tone</b>
        </div>
      </div>
    )
  }
  if (design === 'workbench' && project.slug === 'imgpress') {
    return (
      <div className={`${s.art} ${s.compression}`} aria-hidden="true">
        <small>Original</small>
        <i />
        <small>Export</small>
        <i />
      </div>
    )
  }
  return (
    <div className={s.art} aria-hidden="true" data-paired={Boolean(second)} data-slug={project.slug}>
      {project.image ? (
        <>
          <div className={s.primary}>
            <Image src={project.image} fill sizes={sizes[design]} alt="" />
          </div>
          {second && (
            <div className={s.secondary}>
              <Image src={second} fill sizes="100px" alt="" />
            </div>
          )}
        </>
      ) : (
        <div className={s.specimen}>
          {project.slug === 'skillbox' ? (
            <>
              <code>$ skillbox list</code>
              {design !== 'index' && <small>Global Skills</small>}
            </>
          ) : (
            <>
              <code>knip-html-reporter</code>
              {design !== 'index' && <small>Files · Exports · Dependencies</small>}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Detail({ project }: { project: Project }) {
  switch (project.slug) {
    case 'liftclub':
      return (
        <div className={s.detail}>
          <span>Workout log</span>
          <b>Bench press</b>
        </div>
      )
    case 'jukebox':
      return (
        <div className={s.detail}>
          <kbd>/</kbd> Search <kbd>q</kbd> Queue track
        </div>
      )
    case 'imgpress':
      return (
        <div className={s.detail}>
          <span>3 JPEGs</span>
          <b>566 kB → 228 kB</b>
        </div>
      )
    default:
      return <div className={s.detail}>{project.medium}</div>
  }
}

export default function ProjectDesigns({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const selected = designs.find(([id]) => id === router.query.design)?.[0] ?? 'workbench'
  const select = (design: string) => {
    void router.replace({ pathname: router.pathname, query: { ...router.query, design } }, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  return (
    <div className={s.preview}>
      <div className={s.tabs} role="tablist" aria-label="Compare project layouts">
        {designs.map(([id, name], i) => (
          <button
            key={id}
            id={'design-' + id}
            role="tab"
            type="button"
            aria-selected={id === selected}
            aria-controls="design-panel"
            tabIndex={id === selected ? 0 : -1}
            onClick={() => select(id)}
            onKeyDown={(event) => {
              const count = designs.length
              const next = { ArrowLeft: (i + count - 1) % count, ArrowRight: (i + 1) % count, Home: 0, End: count - 1 }[
                event.key
              ]
              if (next === undefined) return
              event.preventDefault()
              document.getElementById('design-' + designs[next][0])?.focus()
              select(designs[next][0])
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div id="design-panel" role="tabpanel" aria-labelledby={'design-' + selected} tabIndex={0}>
        <ul className={s.list} data-design={selected} key={selected}>
          {projects.map((p, index) => (
            <li key={p.slug} style={{ '--order': Math.min(index, 5) } as CSSProperties}>
              <Link className={s.row} href={`/work/${p.slug}`} aria-labelledby={'project-' + p.slug}>
                <Sample project={p} design={selected} />
                <div className={s.copy}>
                  <h2 id={'project-' + p.slug}>{p.title}</h2>
                  <p>{p.description}</p>
                  {selected === 'workbench' && <Detail project={p} />}
                </div>
                <small className={s.year}>{p.year}</small>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
