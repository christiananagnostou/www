export interface Directory {
  title: string
  intro: string
  heading: string
  nav: string
  list: string
  categories: { key: string; href: string; html: string }[]
  rows: { slug: string; tags: string[]; color: string; html: string }[]
}

// Read the build-owned, already-rendered illustrations and labels, not a second JSON copy.
export function readDirectory(root: HTMLElement): Directory {
  const heading = root.querySelector('header')!
  const nav = heading.querySelector('nav')!
  const list = root.querySelector('ul')!
  return {
    title: heading.querySelector('h1')!.textContent!,
    intro: heading.querySelector('p')!.textContent!,
    heading: heading.className,
    nav: nav.className,
    list: list.className,
    categories: Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'), (a) => ({
      key: a.dataset.tag!,
      href: a.getAttribute('href')!,
      html: a.innerHTML,
    })),
    rows: Array.from(list.children, (el) => {
      const li = el as HTMLElement
      return {
        slug: li.dataset.slug!,
        tags: li.dataset.tags!.split(' '),
        color: li.style.getPropertyValue('--project-color').trim(),
        html: li.innerHTML,
      }
    }),
  }
}

export function readPage() {
  const root = document.getElementById('directory')!
  return { root, data: readDirectory(root), selected: root.dataset.selected! }
}

export function positions(data: Directory, selected: string) {
  return new Map(data.rows.filter((r) => selected === 'all' || r.tags.includes(selected)).map((r, i) => [r.slug, i]))
}

export function rowStyle(color: string, index: number | undefined) {
  return {
    '--project-color': color,
    '--project-accent': 'color-mix(in srgb, var(--project-color) 52%, #c4c5c8)',
    '--order': String(Math.min(index ?? 0, 5)),
  }
}

export function selectCategory(event: MouseEvent, update: (category: string) => void) {
  const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>('a[data-tag]')
  if (
    !link ||
    event.defaultPrevented ||
    event.button ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  event.preventDefault()
  if (location.href !== link.href) history.pushState(null, '', link.href)
  update(link.dataset.tag!)
}

export function listen(data: Directory, update: (category: string) => void) {
  const pop = () => update(data.categories.find((c) => c.href === location.pathname)?.key ?? 'all')
  window.addEventListener('popstate', pop)
  document.getElementById('directory')!.dataset.ready = 'true'
  return () => window.removeEventListener('popstate', pop)
}
