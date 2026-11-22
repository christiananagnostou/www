import assert from 'node:assert/strict'
import { after, before, it } from 'node:test'
import { JSDOM } from 'jsdom'

import { startBuiltApp } from './helpers/builtApp.mjs'

const canonical = 'https://www.christiancodes.co'
let site
before(async () => {
  site = process.env.SITE_TEST_ORIGIN ? { origin: new URL(process.env.SITE_TEST_ORIGIN).origin } : await startBuiltApp()
})
after(() => site?.close?.())

const request = (path, accept, method = 'GET') => fetch(site.origin + path, { headers: { accept }, method })
const documentAt = async (path) => {
  const response = await request(path, 'text/html')
  assert.equal(response.status, 200, path)
  return new JSDOM(await response.text()).window.document
}
const varies = (res) => assert.match(res.headers.get('vary') ?? '', /(?:^|,)\s*accept\s*(?:,|$)/i)
const postings = (doc) => {
  const items = []
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    JSON.parse(script.textContent, (_, value) => {
      if (value?.['@type'] === 'BlogPosting') items.push(value)
      return value
    })
  }
  return items
}

it('negotiates the same homepage URL without mixing cached variants', async () => {
  const doc = await documentAt('/')
  const titles = postings(doc).map((p) => p.headline)
  assert.ok(titles.length)
  for (const [accept, type] of [
    ['text/markdown', 'text/markdown'],
    ['text/html', 'text/html'],
    ['text/html;q=0.4, text/markdown;q=0.9', 'text/markdown'],
    ['text/markdown;q=0, */*', 'text/html'],
    ['*/*', 'text/html'],
    ['text/markdown; charset=utf-8', 'text/markdown'],
  ]) {
    const res = await request('/', accept)
    assert.equal(res.status, 200, accept)
    varies(res)
    assert.equal(res.headers.get('content-type').split(';')[0], type)
    const body = await res.text()
    if (type === 'text/html') assert.match(body, /<!doctype html>/i)
    else {
      assert.match(body, /^# Christian Anagnostou\n/)
      for (const title of titles) assert.ok(body.includes(title), title)
      for (const time of doc.querySelectorAll('#main-content time')) assert.ok(body.includes(time.textContent))
      assert.doesNotMatch(body, /<html|<script/i)
    }
  }
  const unsupported = await request('/', 'application/xml')
  assert.equal(unsupported.status, 406)
  varies(unsupported)
  for (const [path, accept] of [
    ['/', 'text/markdown'],
    ['/index.md', '*/*'],
  ]) {
    const head = await request(path, accept, 'HEAD')
    assert.equal(head.status, 200)
    assert.match(head.headers.get('content-type'), /^text\/markdown\b/)
    assert.equal(await head.text(), '')
    assert.match(await (await request(path, accept)).text(), /^# Christian/)
  }
  const disallowed = await request('/index.md', 'text/markdown', 'POST')
  assert.equal(disallowed.status, 405)
  assert.match(disallowed.headers.get('allow'), /GET, HEAD/)
})

it('keeps genuine 404 status and provides recovery links in the requested format', async () => {
  for (const path of [
    '/no-such-agent-page',
    '/nested/no-such-page',
    '/work/no-such-page',
    '/article/no-such-page',
    '/art/no-such-page',
    '/404',
    '/404.md',
    '/api/no-such-page',
  ]) {
    for (const accept of ['text/html', 'text/markdown']) {
      const res = await request(path, accept)
      assert.equal(res.status, 404, path)
      assert.equal(res.headers.get('content-type').split(';')[0], accept, path)
      varies(res)
      const body = await res.text()
      if (accept === 'text/html') assert.match(body, /<!doctype html>/i)
      else {
        assert.match(body, /^# Page not found\n\n[^\n]{20,}/)
        assert.match(body, /\[[^\]]+\]\(https:\/\/www\.christiancodes\.co\/llms\.txt\)/)
      }
    }
  }
  const head = await request('/no-such-agent-page', 'text/markdown', 'HEAD')
  assert.equal(head.status, 404)
  assert.match(head.headers.get('content-type'), /^text\/markdown/)
  assert.equal(await head.text(), '')
})

it('publishes a usable llms.txt, sitemap and trust pages in initial HTML', async () => {
  const guide = await request('/llms.txt', '*/*')
  assert.equal(guide.status, 200)
  assert.match(guide.headers.get('content-type'), /^text\/plain/)
  const text = await guide.text()
  assert.match(text, /^# Christian Anagnostou\n\n> /)
  assert.match(text, /Accept: text\/markdown/)
  assert.match(text, /## When to use this site\n\n- \[/)
  const urls = Array.from(text.matchAll(/^- \[[^\]]+\]\(([^)]+)\): .+$/gm), (m) => new URL(m[1]))
  assert.ok(urls.length >= 6)
  for (const url of urls) {
    assert.equal(url.origin, canonical)
    assert.equal((await request(url.pathname, '*/*', 'HEAD')).status, 200, url.pathname)
  }
  const sitemap = await request('/sitemap.xml', 'application/xml')
  assert.equal(sitemap.status, 200)
  assert.match(sitemap.headers.get('content-type'), /xml/)
  const xml = new JSDOM(await sitemap.text(), { contentType: 'text/xml' }).window.document
  const locations = Array.from(xml.querySelectorAll('loc'), (loc) => loc.textContent)
  for (const route of ['/about', '/contact', '/privacy']) {
    assert.ok(locations.includes(canonical + route), route)
    const main = (await documentAt(route)).querySelector('main')
    assert.equal(main.querySelector('h1').textContent.toLowerCase(), route.slice(1))
    assert.ok(
      Array.from(main.querySelectorAll('p'))
        .map((p) => p.textContent)
        .join(' ').length >= 500,
      route
    )
  }
})

it('publishes the canonical identity, an actual share image and named BlogPosting entities', async () => {
  const home = await documentAt('/')
  assert.equal(home.documentElement.lang, 'en')
  assert.equal(new URL(home.querySelector('link[rel="canonical"]').href).href, canonical + '/')
  assert.equal(home.querySelector('meta[property="og:type"]').content, 'website')
  const url = new URL(home.querySelector('meta[property="og:image"]').content)
  assert.equal(url.origin, canonical)
  const image = await request(url.pathname, 'image/png')
  assert.equal(image.status, 200)
  assert.match(image.headers.get('content-type'), /^image\/png/)
  assert.equal(
    Buffer.from(await image.arrayBuffer())
      .subarray(0, 8)
      .toString('hex'),
    '89504e470d0a1a0a'
  )
  const article = new URL(postings(home)[0].url).pathname
  for (const doc of [home, await documentAt('/articles'), await documentAt(article)]) {
    const posts = postings(doc)
    assert.ok(posts.length)
    for (const post of posts) {
      assert.ok(post.name?.trim())
      assert.equal(post.name, post.headline)
    }
  }
  const buildId = JSON.parse(home.querySelector('#__NEXT_DATA__').textContent).buildId
  const data = await request('/_next/data/' + buildId + '/index.json', 'application/json')
  assert.equal(data.status, 200)
  assert.ok(Array.isArray((await data.json()).pageProps.posts))
})
