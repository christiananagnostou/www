import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { category, launch, origin, paths, ready } from './browser.mjs'

const count = Number(process.env.COMPARISON_RUNS || 5)
assert.ok(Number.isInteger(count) && count > 0)
const engines = Object.keys(paths)
const samples = []
const browser = await launch('chromium')
const browserVersion = browser.version()

// Start observing before either the SSR document or a client-side router creates the detail heading.
function instrument() {
  window.labLcp = null
  new PerformanceObserver((list) => {
    window.labLcp = list.getEntries().at(-1).startTime
  }).observe({ type: 'largest-contentful-paint', buffered: true })
  const detail = new MutationObserver(() => {
    if (document.querySelector('main h1')?.textContent !== 'Lift Club') return
    detail.disconnect()
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        window.labDetailFrame = Date.now()
      })
    )
  })
  detail.observe(document, { childList: true, subtree: true })
}
function networkMeter(cdp) {
  const requests = new Map()
  const cached = new Set()
  let bytes = 0,
    js = 0
  cdp.on('Network.requestServedFromCache', ({ requestId }) => cached.add(requestId))
  cdp.on('Network.responseReceived', ({ requestId, response, type }) => {
    const url = new URL(response.url)
    if (url.origin !== origin || response.status >= 400 || response.fromDiskCache || response.fromServiceWorker) return
    requests.set(requestId, type === 'Script' || /\bm?javascript\b/.test(response.mimeType))
  })
  cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
    if (!requests.has(requestId) || cached.has(requestId)) return
    bytes += encodedDataLength
    if (requests.get(requestId)) js += encodedDataLength
    requests.delete(requestId)
  })
  return () => ({ bytes, js })
}
async function run(engine, profile) {
  const mobile = profile === 'mobile'
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 3 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: 'no-preference',
  })
  try {
    await context.addInitScript(instrument)
    const page = await context.newPage()
    await page.bringToFront()
    const cdp = await context.newCDPSession(page)
    const totals = networkMeter(cdp)
    await cdp.send('Network.enable')
    await cdp.send('Network.setBlockedURLs', {
      urls: ['*/insights/view*', '*/insights/event*', '*/speed-insights/vitals*'],
    })
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 65,
      downloadThroughput: 750000,
      uploadThroughput: 200000,
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 })
    await page.goto(origin + paths[engine])
    await ready(page)
    // Identical observation windows include visible-link prefetch; HTTP caching stays on for the second page.
    await page.waitForTimeout(1600)
    const cold = totals()
    const lcp = await page.evaluate(() => window.labLcp)
    await page.evaluate(() => {
      document.addEventListener(
        'click',
        () => {
          const start = performance.now()
          function sample() {
            if (
              document.querySelector('nav[aria-label="Project categories"] [aria-current]')?.textContent.trim() !==
                'Commercial' ||
              document.querySelector('main h2#liftclub')?.checkVisibility()
            )
              return requestAnimationFrame(sample)
            requestAnimationFrame(() => {
              window.labFilterMs = performance.now() - start
            })
          }
          requestAnimationFrame(sample)
        },
        { capture: true, once: true }
      )
    })
    await category(page, 'Commercial').press('Enter')
    await page.waitForFunction(() => window.labFilterMs > 0)
    const filter = await page.evaluate(() => window.labFilterMs)
    await category(page, 'All').press('Enter')
    await page.locator('a[href="/work/liftclub"]').waitFor()
    // An exposed callback saves the input time across document navigations without a network request.
    let click
    await page.exposeFunction('labSendStart', (t) => {
      click = t
    })
    await page.evaluate(() =>
      document.addEventListener('click', () => window.labSendStart(Date.now()), { once: true, capture: true })
    )
    await page.locator('a[href="/work/liftclub"]').press('Enter')
    await page.waitForFunction(() => window.labDetailFrame > 0)
    const detail = await page.evaluate(() => window.labDetailFrame)
    assert.ok(click && detail >= click, 'detail input and paint must both be recorded')
    await page.waitForTimeout(1600)
    return {
      engine,
      profile,
      directoryBytes: cold.bytes,
      directoryJS: cold.js,
      lcpMs: lcp,
      filterMs: filter,
      detailMs: detail - click,
      journeyBytes: totals().bytes,
    }
  } finally {
    await context.close()
  }
}
try {
  for (const profile of (process.env.COMPARISON_PROFILES || 'mobile,desktop').split(',')) {
    for (let round = 0; round <= count; round++) {
      for (let j = 0; j < engines.length; j++) {
        const engine = engines[(round + j) % engines.length]
        const sample = await run(engine, profile)
        if (round) samples.push(sample)
        console.log(
          profile,
          round || 'warm-up',
          engine,
          sample.directoryJS,
          sample.filterMs.toFixed(0),
          sample.detailMs
        )
      }
    }
  }
} finally {
  await browser.close()
}
function median(values) {
  const sorted = values.filter((v) => v != null).toSorted((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length ? (sorted[mid] + sorted[Math.floor((sorted.length - 1) / 2)]) / 2 : null
}
const result = []
for (const profile of new Set(samples.map((r) => r.profile))) {
  for (const engine of engines) {
    const group = samples.filter((r) => r.engine === engine && r.profile === profile)
    result.push({
      profile,
      engine,
      ...Object.fromEntries(
        Object.keys(group[0])
          .filter((k) => !['engine', 'profile'].includes(k))
          .map((k) => [k, median(group.map((r) => r[k]))])
      ),
    })
  }
}
console.table(result)
if (process.env.COMPARISON_OUTPUT)
  await writeFile(
    process.env.COMPARISON_OUTPUT,
    JSON.stringify({ origin, browser: browserVersion, runs: count, medians: result, samples }, null, 2) + '\n'
  )
