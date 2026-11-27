/** @jsxImportSource @solidjs/web */
import { createMemo, createSignal, For, onSettled } from 'solid-js'
import { listen, positions, rowStyle, selectCategory, type Directory } from '../directory'

export default function SolidDirectory(props: { data: Directory; initial: string }) {
  const [selected, setSelected] = createSignal(props.initial)
  const indices = createMemo(() => positions(props.data, selected()))
  onSettled(() => listen(props.data, setSelected))
  return (
    <>
      <header class={props.data.heading}>
        <h1>{props.data.title}</h1>
        <p>{props.data.intro}</p>
        <nav class={props.data.nav} aria-label="Project categories" onClick={(e) => selectCategory(e, setSelected)}>
          <For each={props.data.categories}>
            {(c) => (
              <a
                data-tag={c.key}
                href={c.href}
                aria-current={selected() === c.key ? 'page' : undefined}
                innerHTML={c.html}
              />
            )}
          </For>
        </nav>
      </header>
      <ul class={props.data.list} aria-label="Projects">
        <For each={props.data.rows}>
          {(r) => (
            <li
              data-slug={r.slug}
              data-tags={r.tags.join(' ')}
              hidden={!indices().has(r.slug)}
              data-first={indices().get(r.slug) === 0 ? '' : undefined}
              style={rowStyle(r.color, indices().get(r.slug))}
              innerHTML={r.html}
            />
          )}
        </For>
      </ul>
    </>
  )
}
