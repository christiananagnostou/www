import { readFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'

// Build input only. No DOM emulator, static SVG compiler, _app, or Next router goes to either client.
export async function snapshot() {
  const dom = new JSDOM(await readFile('.next/server/pages/projects.html', 'utf8'))
  const doc = dom.window.document
  const props = JSON.parse(doc.querySelector('#__NEXT_DATA__').textContent).props.pageProps
  const root = doc.querySelector('#main-content').firstElementChild
  const heading = root.firstElementChild
  const nav = heading.querySelector('nav')
  const list = root.querySelector('ul[aria-label="Projects"]')
  const rows = Array.from(list.children, (li) => {
    const slug = li.querySelector('a').getAttribute('aria-labelledby')
    const { tags, themeColor: color } = props.projects.find((p) => p.slug === slug)
    return { slug, tags, color, html: li.innerHTML }
  })
  const categories = Array.from(nav.querySelectorAll('a'), (a) => ({
    key: new URL(a.getAttribute('href'), 'https://example.invalid').searchParams.get('tag') ?? 'all',
    html: a.innerHTML,
  }))
  const data = {
    title: heading.querySelector('h1').textContent,
    intro: heading.querySelector('p').textContent,
    heading: heading.className,
    nav: nav.className,
    list: list.className,
    rows,
    categories,
  }

  const siteMap = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'), (s) =>
    JSON.parse(s.textContent)
  ).find((s) => s['@type'] === 'SiteNavigationElement')
  const submenu = doc.createElement('ul')
  submenu.dataset.labSubmenu = ''
  submenu.id = 'works-submenu'
  submenu.hidden = true
  for (const entry of siteMap.hasPart.find((e) => e.hasPart).hasPart) {
    const a = doc.createElement('a')
    a.href = new URL(entry.url).pathname
    a.textContent = entry.name
    const li = doc.createElement('li')
    li.append(a)
    submenu.append(li)
  }
  const works = doc.querySelector('nav[aria-label="Main Navigation"] button[aria-haspopup]')
  works.setAttribute('aria-controls', submenu.id)
  works.after(submenu)
  const nojs = doc.createElement('noscript')
  nojs.innerHTML = submenu.innerHTML.replaceAll('<li>', ' ').replaceAll('</li>', ' ')
  doc.querySelector('main').before(nojs)
  doc
    .querySelectorAll('script:not([type="application/ld+json"]), link[as="script"], link[rel="modulepreload"]')
    .forEach((e) => e.remove())
  doc.querySelector('meta[name="robots"]')?.remove()
  const robots = doc.createElement('meta')
  robots.name = 'robots'
  robots.content = 'noindex, nofollow'
  doc.head.append(robots)
  doc.querySelector('#__next').removeAttribute('id')
  const inlineCss = Array.from(doc.querySelectorAll('style'), (e) => {
    const css = e.textContent
    e.remove()
    return css
  }).join('\n')
  root.id = 'directory'
  root.dataset.selected = '__SELECTED__'
  root.textContent = '__DIRECTORY__'
  const template = '<!doctype html>' + doc.documentElement.outerHTML
  dom.window.close()
  return { data, inlineCss, template }
}
