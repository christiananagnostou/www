import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import s from './ProjectDesigns.module.css'

type Project = {
  slug: string
  title: string
  year: string
  description: string
  image: string | null
  collection: string
}

const designs = [
  ['pairings', 'Pairings'],
  ['index', 'Illustrated index'],
  ['timeline', 'Timeline'],
  ['collections', 'Collections'],
  ['viewfinder', 'Viewfinder'],
] as const

function Art({ project, sizes }: { project: Project; sizes: string }) {
  return (
    <div className={s.art}>
      {project.image ? (
        <Image src={project.image} fill sizes={sizes} alt="" />
      ) : (
        <code>{project.slug === 'skillbox' ? 'skillbox list' : 'knip-html-reporter'}</code>
      )}
    </div>
  )
}

function Row({ project, illustrated = false }: { project: Project; illustrated?: boolean }) {
  return (
    <Link className={s.row} href={`/work/${project.slug}`}>
      {illustrated && <Art project={project} sizes="(max-width: 600px) 80px, 128px" />}
      <div>
        <strong>{project.title}</strong>
        <p>{project.description}</p>
      </div>
      <small>{project.year}</small>
    </Link>
  )
}

function Plate({ project }: { project: Project }) {
  return (
    <Link className={s.plate} href={`/work/${project.slug}`}>
      <Art project={project} sizes="(max-width: 800px) 50vw, 380px" />
      <strong>{project.title}</strong>
      <p>{project.description}</p>
    </Link>
  )
}

function Viewfinder({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(projects[0])
  return (
    <div className={s.viewer}>
      <div className={s.screen}>
        <Art project={active} sizes="(max-width: 600px) 90vw, 480px" />
        <div aria-live="polite">
          <h2>{active.title}</h2>
          <p>{active.description}</p>
          <Link href={`/work/${active.slug}`}>View project</Link>
        </div>
      </div>
      <div className={s.picker} role="group" aria-label="Choose a project to preview">
        {projects.map((p) => (
          <button key={p.slug} type="button" aria-pressed={p.slug === active.slug} onClick={() => setActive(p)}>
            {p.title}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ProjectDesigns({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const selected = designs.find(([id]) => id === router.query.design)?.[0] ?? 'pairings'
  const select = (design: string) => {
    void router.replace({ pathname: router.pathname, query: { ...router.query, design } }, undefined, {
      shallow: true,
      scroll: false,
    })
  }
  const rows = (items: Project[], illustrated = false) =>
    items.map((p) => <Row key={p.slug} project={p} illustrated={illustrated} />)
  const startYear = (p: Project) => p.year.slice(0, 4)

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
        {selected === 'pairings' && (
          <>
            <div className={s.pair}>
              {projects.slice(0, 2).map((p) => (
                <Plate key={p.slug} project={p} />
              ))}
            </div>
            {rows(projects.slice(2))}
          </>
        )}
        {selected === 'index' && <div className={s.illustrated}>{rows(projects, true)}</div>}
        {selected === 'timeline' &&
          [...new Set(projects.map(startYear))]
            .toSorted((a, b) => Number(b) - Number(a))
            .map((year) => (
              <section key={year} className={s.era}>
                <h2>{year}</h2>
                <div>{rows(projects.filter((p) => startYear(p) === year))}</div>
              </section>
            ))}
        {selected === 'collections' &&
          ['Personal apps', 'Open source', 'Client work'].map((name) => {
            const items = projects.filter((p) => p.collection === name)
            const cover = items.find((p) => p.image)
            return (
              <section className={s.collection} key={name}>
                <header>
                  {cover && <Art project={cover} sizes="(max-width: 600px) 180px, 240px" />}
                  <h2>{name}</h2>
                </header>
                <div>{rows(items)}</div>
              </section>
            )
          })}
        {selected === 'viewfinder' && <Viewfinder projects={projects} />}
      </div>
    </div>
  )
}
