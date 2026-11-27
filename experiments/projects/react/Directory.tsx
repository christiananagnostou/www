import { useEffect, useState, type CSSProperties } from 'react'
import { listen, positions, rowStyle, selectCategory, type Directory } from '../directory'

export default function ReactDirectory({ data, initial }: { data: Directory; initial: string }) {
  const [selected, setSelected] = useState(initial)
  useEffect(() => listen(data, setSelected), [data])
  const indices = positions(data, selected)
  return (
    <>
      <header className={data.heading}>
        <h1>{data.title}</h1>
        <p>{data.intro}</p>
        <nav
          className={data.nav}
          aria-label="Project categories"
          onClick={(e) => selectCategory(e.nativeEvent, setSelected)}
        >
          {data.categories.map((c) => (
            <a
              key={c.key}
              data-tag={c.key}
              href={c.href}
              aria-current={selected === c.key ? 'page' : undefined}
              dangerouslySetInnerHTML={{ __html: c.html }}
            />
          ))}
        </nav>
      </header>
      <ul className={data.list} aria-label="Projects">
        {data.rows.map((r) => (
          <li
            key={r.slug}
            data-slug={r.slug}
            data-tags={r.tags.join(' ')}
            hidden={!indices.has(r.slug)}
            data-first={indices.get(r.slug) === 0 ? '' : undefined}
            style={rowStyle(r.color, indices.get(r.slug)) as CSSProperties}
            dangerouslySetInnerHTML={{ __html: r.html }}
          />
        ))}
      </ul>
    </>
  )
}
