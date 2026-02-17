;(function () {
  const STYLESHEET = /*css*/ `
    #ebay-ph-overlay {
      position: fixed;
      inset: 0;
      background: rgba(8, 8, 8, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      color: #f5f5f5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    #ebay-ph-panel {
      background: #111111;
      border: 1px solid #2b2b2b;
      border-radius: 12px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.50);
      max-width: 980px;
      width: min(980px, 94vw);
      max-height: 82vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .ebay-ph-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem 1.25rem 0.75rem;
      border-bottom: 1px solid #222222;
      gap: 1rem;
    }

    .ebay-ph-header h2 {
      margin: 0;
      font-size: 1.15rem;
      line-height: 1.2;
    }

    .ebay-ph-header p {
      margin: 0.25rem 0 0;
      color: #bdbdbd;
      font-size: 0.9rem;
    }

    .ebay-ph-close {
      background: transparent;
      border: none;
      color: #f5f5f5;
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }

    .ebay-ph-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.6rem;
      padding: 0.6rem 1.25rem;
      border-bottom: 1px solid #222222;
      --ebay-ph-control-height: 32px;
    }

    .ebay-ph-meta-left,
    .ebay-ph-meta-right {
      display: flex;
      align-items: stretch;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .ebay-ph-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: #c7c7c7;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 999px;
      padding: 0.2rem 0.5rem;
      height: var(--ebay-ph-control-height);
      white-space: nowrap;
    }

    .ebay-ph-label {
      text-transform: uppercase;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: #9c9c9c;
    }

    .ebay-ph-search input {
      width: 220px;
      background: transparent;
      border: none;
      color: #f5f5f5;
      padding: 0.1rem 0.25rem;
      font-size: 0.8rem;
      height: 100%;
    }

    .ebay-ph-search input::placeholder {
      color: #6f6f6f;
    }

    .ebay-ph-select select {
      background: transparent;
      border: none;
      color: #f5f5f5;
      padding: 0.1rem 0.25rem;
      font-size: 0.8rem;
      height: 100%;
    }

    .ebay-ph-select option {
      color: #111111;
    }

    .ebay-ph-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      border: 1px solid #2a2a2a;
      background: #1a1a1a;
      color: #f5f5f5;
      height: var(--ebay-ph-control-height);
      padding: 0 0.75rem;
      border-radius: 999px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }

    .ebay-ph-btn:hover,
    .ebay-ph-btn:focus {
      outline: none;
      background: #232323;
      border-color: #343434;
    }

    .ebay-ph-btn--danger {
      border-color: #5a1f1f;
      background: #2a1212;
    }

    .ebay-ph-btn--danger:hover,
    .ebay-ph-btn--danger:focus {
      background: #351616;
      border-color: #6d2525;
    }

    .ebay-ph-btn--primary {
      border-color: #235e8c;
      background: #10324b;
    }

    .ebay-ph-btn--primary:hover,
    .ebay-ph-btn--primary:focus {
      background: #123a57;
      border-color: #2b74ad;
    }

    .ebay-ph-btn--muted {
      opacity: 0.85;
    }

    .ebay-ph-note {
      padding: 0.6rem 1.25rem;
      font-size: 0.85rem;
      color: #bdbdbd;
      border-bottom: 1px solid #222222;
    }

    .ebay-ph-note a {
      color: #9fd0ff;
    }

    #ebay-ph-list {
      overflow: auto;
      padding: 0;
    }

    .ebay-ph-table {
      width: 100%;
      border-collapse: collapse;
    }

    .ebay-ph-table thead th {
      position: sticky;
      top: 0;
      background: #121212;
      border-bottom: 1px solid #222222;
      text-align: left;
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #9c9c9c;
      padding: 0.6rem 1.25rem;
      z-index: 1;
    }

    .ebay-ph-table tbody td {
      border-bottom: 1px solid #1f1f1f;
      padding: 0.6rem 1.25rem;
      vertical-align: top;
      font-size: 0.9rem;
      color: #f0f0f0;
    }

    .ebay-ph-col-price {
      width: 140px;
      font-variant-numeric: tabular-nums;
      color: #d8f4d8;
    }

    .ebay-ph-title a {
      color: #f5f5f5;
      text-decoration: none;
    }

    .ebay-ph-title a:hover,
    .ebay-ph-title a:focus {
      outline: none;
      text-decoration: underline;
      text-decoration-color: #9fd0ff;
      text-underline-offset: 3px;
    }

    .ebay-ph-empty {
      padding: 1.25rem;
      color: #bdbdbd;
      font-size: 0.9rem;
    }

    @media (max-width: 520px) {
      .ebay-ph-search input {
        width: 160px;
      }

      .ebay-ph-col-price {
        width: 120px;
      }

      .ebay-ph-table thead th,
      .ebay-ph-table tbody td {
        padding: 0.55rem 0.85rem;
      }
    }
  `

  const ID_STYLESHEET = 'ebay-ph-styles'
  const ID_OVERLAY = 'ebay-ph-overlay'
  const ID_PANEL = 'ebay-ph-panel'
  const ID_CLOSE = 'ebay-ph-close'
  const ID_SEARCH = 'ebay-ph-search'
  const ID_SORT = 'ebay-ph-sort'
  const ID_CAPTURE_TOGGLE = 'ebay-ph-capture-toggle'
  const ID_CAPTURE_NOW = 'ebay-ph-capture-now'
  const ID_EXPORT = 'ebay-ph-export'
  const ID_CLEAR = 'ebay-ph-clear'
  const ID_LIST = 'ebay-ph-list'
  const ID_COUNT = 'ebay-ph-count'
  const ID_TOTAL = 'ebay-ph-total'
  const ID_VISIBLE_TOTAL = 'ebay-ph-visible-total'
  const ID_HOST_NOTE = 'ebay-ph-host-note'
  const ID_EMPTY_NOTE = 'ebay-ph-empty-note'

  const LS_ITEMS = 'ebay-ph:v1:items'
  const LS_UI = 'ebay-ph:v1:ui'

  const DEFAULT_UI = {
    searchQuery: '',
    sortMode: 'newest',
    captureEnabled: true,
  }

  const SEL_TITLE_LINK_PRIMARY = 'h3.title-heading a.nav-link[href*="/itm/"]'
  const SEL_TITLE_LINK_FALLBACK = 'a.nav-link[href*="/itm/"]'
  const SEL_PRICE_PRIMARY = '.container-item-col__info-item-info-additionalPrice span'
  const SEL_PRICE_FALLBACK =
    '.container-item-col__info-item-info-additionalPrice span, .container-item-col__info-item-info-additionalPrice'
  const SEL_CARD_ROOT_PRIMARY = '.m-container-item-layout-row__wrapper'
  const SEL_CARD_ROOT_FALLBACK = '.m-ph-card'

  let observer = null
  let escapeListener = null
  let scanDebounce = null

  const ensureStyles = () => {
    if (document.getElementById(ID_STYLESHEET)) return
    const style = document.createElement('style')
    style.id = ID_STYLESHEET
    style.textContent = STYLESHEET
    document.head.appendChild(style)
  }

  const normalizeText = (value) => {
    const trimmed = `${value || ''}`.replace(/\s+/g, ' ').trim()
    return trimmed
  }

  const safeParseJson = (raw, fallback) => {
    try {
      if (!raw) return fallback
      const parsed = JSON.parse(raw)
      return parsed ?? fallback
    } catch {
      return fallback
    }
  }

  const loadItems = () => {
    const raw = safeParseJson(localStorage.getItem(LS_ITEMS), [])
    if (!Array.isArray(raw)) return []
    return raw.filter((item) => item && typeof item.key === 'string')
  }

  const saveItems = (items) => {
    localStorage.setItem(LS_ITEMS, JSON.stringify(items))
  }

  const loadUi = () => {
    const raw = safeParseJson(localStorage.getItem(LS_UI), {})
    const ui = { ...DEFAULT_UI, ...(raw && typeof raw === 'object' ? raw : {}) }
    ui.searchQuery = typeof ui.searchQuery === 'string' ? ui.searchQuery : DEFAULT_UI.searchQuery
    ui.sortMode = typeof ui.sortMode === 'string' ? ui.sortMode : DEFAULT_UI.sortMode
    ui.captureEnabled = typeof ui.captureEnabled === 'boolean' ? ui.captureEnabled : DEFAULT_UI.captureEnabled
    return ui
  }

  const saveUi = (ui) => {
    localStorage.setItem(LS_UI, JSON.stringify(ui))
  }

  const parseItemId = (url) => {
    const match = `${url || ''}`.match(/\/itm\/(\d+)/)
    return match ? match[1] : null
  }

  const parseCurrency = (text) => {
    const t = normalizeText(text)
    if (!t) return null
    if (/^US\b/i.test(t)) return 'USD'
    if (t.includes('$')) return 'USD'
    return null
  }

  const parsePriceValue = (text) => {
    const t = normalizeText(text)
    if (!t) return null
    const match = t.match(/([0-9][0-9,]*\.?[0-9]*)/)
    if (!match) return null
    const numeric = match[1].replace(/,/g, '')
    const value = parseFloat(numeric)
    return Number.isFinite(value) ? value : null
  }

  const getTitleLinks = () => {
    const primary = Array.from(document.querySelectorAll(SEL_TITLE_LINK_PRIMARY))
    if (primary.length) return primary
    return Array.from(document.querySelectorAll(SEL_TITLE_LINK_FALLBACK))
  }

  const getCardRoot = (titleLink) => {
    if (!titleLink) return null
    return (
      titleLink.closest(SEL_CARD_ROOT_PRIMARY) ||
      titleLink.closest(SEL_CARD_ROOT_FALLBACK) ||
      titleLink.parentElement ||
      null
    )
  }

  const findNoteKey = (cardRoot) => {
    if (!cardRoot) return null
    const noteCandidate = cardRoot.querySelector('[class*="note-item-"]')
    if (noteCandidate) {
      for (const cls of Array.from(noteCandidate.classList)) {
        if (cls && cls.indexOf('note-item-') === 0) return cls
      }
    }

    const allWithClass = cardRoot.querySelectorAll('[class]')
    for (const el of Array.from(allWithClass)) {
      for (const cls of Array.from(el.classList)) {
        if (cls && cls.indexOf('note-item-') === 0) return cls
      }
    }

    return null
  }

  const extractRow = (titleLink) => {
    if (!titleLink) return null
    const cardRoot = getCardRoot(titleLink)
    if (!cardRoot) return null

    const title = normalizeText(titleLink.textContent || '')
    if (!title) return null

    const url = titleLink.href || titleLink.getAttribute('href') || ''
    const itemId = parseItemId(url)

    const priceEl = cardRoot.querySelector(SEL_PRICE_PRIMARY) || cardRoot.querySelector(SEL_PRICE_FALLBACK)
    const priceText = normalizeText(priceEl ? priceEl.textContent || '' : '')
    if (!priceText) return null

    const noteKey = findNoteKey(cardRoot)
    const fallbackKey = `${itemId || ''}|${title.toLowerCase()}|${priceText.toLowerCase()}`
    const key = noteKey || fallbackKey

    const currency = parseCurrency(priceText)
    const priceValue = parsePriceValue(priceText)

    return {
      key,
      title,
      url,
      itemId,
      priceText,
      priceValue,
      currency,
    }
  }

  const upsertItems = (currentItems, nextRows) => {
    const byKey = new Map(currentItems.map((item) => [item.key, item]))
    let didChange = false
    const now = new Date().toISOString()

    nextRows.forEach((row) => {
      if (!row || !row.key) return
      const existing = byKey.get(row.key)
      if (!existing) {
        const next = { ...row, firstSeenAt: now }
        currentItems.push(next)
        byKey.set(next.key, next)
        didChange = true
        return
      }

      const patched = { ...existing }
      let patchedAny = false

      ;['title', 'url', 'itemId', 'priceText', 'currency'].forEach((field) => {
        if (!patched[field] && row[field]) {
          patched[field] = row[field]
          patchedAny = true
        }
      })

      if ((patched.priceValue == null || Number.isNaN(patched.priceValue)) && row.priceValue != null) {
        patched.priceValue = row.priceValue
        patchedAny = true
      }

      if (patchedAny) {
        const index = currentItems.indexOf(existing)
        if (index >= 0) {
          currentItems[index] = patched
        }
        byKey.set(patched.key, patched)
        didChange = true
      }
    })

    return didChange
  }

  const scanPage = () => {
    const links = getTitleLinks()
    const rows = []
    links.forEach((link) => {
      const row = extractRow(link)
      if (row) rows.push(row)
    })
    return rows
  }

  const formatUsd = (value) => {
    if (!Number.isFinite(value)) return ''
    try {
      return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    } catch {
      return `$${value.toFixed(2)}`
    }
  }

  const sumPrices = (items) =>
    items.reduce((acc, item) => acc + (Number.isFinite(item.priceValue) ? item.priceValue : 0), 0)

  const filterItems = (items, query) => {
    const trimmed = normalizeText(query)
    if (!trimmed) return items
    const q = trimmed.toLowerCase()
    return items.filter((item) => {
      const haystack = `${item.title || ''} ${item.priceText || ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }

  const sortItems = (items, sortMode) => {
    const mode = sortMode || 'newest'
    const next = items.slice()
    const getTitle = (item) => `${item.title || ''}`.toLowerCase()
    const getPrice = (item) => (Number.isFinite(item.priceValue) ? item.priceValue : null)
    const getSeen = (item) => (item.firstSeenAt ? new Date(item.firstSeenAt).getTime() : 0)

    next.sort((a, b) => {
      if (mode === 'price-desc') {
        const ap = getPrice(a)
        const bp = getPrice(b)
        if (ap == null && bp == null) return getTitle(a).localeCompare(getTitle(b))
        if (ap == null) return 1
        if (bp == null) return -1
        return bp - ap
      }
      if (mode === 'price-asc') {
        const ap = getPrice(a)
        const bp = getPrice(b)
        if (ap == null && bp == null) return getTitle(a).localeCompare(getTitle(b))
        if (ap == null) return 1
        if (bp == null) return -1
        return ap - bp
      }
      if (mode === 'title-desc') return getTitle(b).localeCompare(getTitle(a))
      if (mode === 'title-asc') return getTitle(a).localeCompare(getTitle(b))
      if (mode === 'oldest') return getSeen(a) - getSeen(b)
      return getSeen(b) - getSeen(a)
    })
    return next
  }

  const toCsv = (rows) => {
    const escape = (value) => {
      const s = value == null ? '' : `${value}`
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
      return s
    }

    const header = ['Title', 'PriceText', 'PriceValue', 'Currency', 'URL', 'ItemId', 'FirstSeenAt', 'Key']
    const lines = [header.map(escape).join(',')]
    rows.forEach((row) => {
      lines.push(
        [row.title, row.priceText, row.priceValue, row.currency, row.url, row.itemId, row.firstSeenAt, row.key]
          .map(escape)
          .join(',')
      )
    })
    return `${lines.join('\n')}\n`
  }

  const downloadCsv = (rows) => {
    const csv = toCsv(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `baytally-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const removeOverlay = () => {
    const existing = document.getElementById(ID_OVERLAY)
    if (existing) existing.remove()
  }

  const disconnectObserver = () => {
    if (observer) observer.disconnect()
    observer = null
    if (scanDebounce) window.clearTimeout(scanDebounce)
    scanDebounce = null
    if (escapeListener) {
      document.removeEventListener('keydown', escapeListener, true)
      escapeListener = null
    }
  }

  const pickObserverRoot = () => {
    const firstLink = getTitleLinks()[0]
    const firstCard = firstLink ? getCardRoot(firstLink) : null
    if (firstCard && firstCard.parentElement) return firstCard.parentElement
    return document.body
  }

  const renderList = (listEl, items, ui) => {
    if (!listEl) return { visibleItems: items, visibleTotal: 0, total: 0 }

    const filtered = filterItems(items, ui.searchQuery)
    const sorted = sortItems(filtered, ui.sortMode)
    const total = sumPrices(items)
    const visibleTotal = sumPrices(sorted)

    if (!sorted.length) {
      const emptyMessage = ui.searchQuery
        ? `No matches for "${normalizeText(ui.searchQuery)}".`
        : 'No items captured yet.'
      listEl.innerHTML = `<div class="ebay-ph-empty">${emptyMessage}</div>`
      return { visibleItems: sorted, visibleTotal, total }
    }

    const rowsHtml = sorted
      .map((item) => {
        const price = item.priceText || (Number.isFinite(item.priceValue) ? formatUsd(item.priceValue) : '')
        const safeTitle = (item.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const safeUrl = (item.url || '').replace(/"/g, '&quot;')
        return /*html*/ `
          <tr>
            <td class="ebay-ph-col-price">${price}</td>
            <td class="ebay-ph-title">
              <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>
            </td>
          </tr>
        `
      })
      .join('')

    listEl.innerHTML = /*html*/ `
      <table class="ebay-ph-table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `

    return { visibleItems: sorted, visibleTotal, total }
  }

  const BayTally = () => {
    disconnectObserver()
    removeOverlay()
    ensureStyles()

    const items = loadItems()
    const ui = loadUi()

    const isEbay = window.location.hostname.includes('ebay.')
    const html = /*html*/ `
      <div id="${ID_OVERLAY}">
        <div id="${ID_PANEL}" role="dialog" aria-modal="true" aria-label="BayTally">
          <div class="ebay-ph-header">
            <div>
              <h2>BayTally</h2>
              <p id="${ID_COUNT}">0 captured</p>
            </div>
            <button class="ebay-ph-close" id="${ID_CLOSE}" aria-label="Close">×</button>
          </div>

          <div class="ebay-ph-meta">
            <div class="ebay-ph-meta-left">
              <label class="ebay-ph-pill ebay-ph-search">
                <span class="ebay-ph-label">Search</span>
                <input id="${ID_SEARCH}" type="text" placeholder="Title or price" />
              </label>
              <label class="ebay-ph-pill ebay-ph-select">
                <span class="ebay-ph-label">Sort</span>
                <select id="${ID_SORT}">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-desc">Price (High)</option>
                  <option value="price-asc">Price (Low)</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
              </label>
              <span class="ebay-ph-pill">
                <span class="ebay-ph-label">Total</span>
                <strong id="${ID_TOTAL}">$0.00</strong>
              </span>
              <span class="ebay-ph-pill" id="${ID_VISIBLE_TOTAL}" style="display:none;">
                <span class="ebay-ph-label">Visible</span>
                <strong>$0.00</strong>
              </span>
            </div>
            <div class="ebay-ph-meta-right">
              <button class="ebay-ph-btn ebay-ph-btn--muted" id="${ID_CAPTURE_TOGGLE}" type="button">Pause capture</button>
              <button class="ebay-ph-btn ebay-ph-btn--primary" id="${ID_CAPTURE_NOW}" type="button">Capture now</button>
              <button class="ebay-ph-btn" id="${ID_EXPORT}" type="button">Export CSV</button>
              <button class="ebay-ph-btn ebay-ph-btn--danger" id="${ID_CLEAR}" type="button">Clear</button>
            </div>
          </div>

          <div class="ebay-ph-note" id="${ID_HOST_NOTE}" style="display:${isEbay ? 'none' : 'block'};">
            This bookmarklet is intended for your eBay Purchase History page. Open it on ebay.com and run again.
          </div>
          <div class="ebay-ph-note" id="${ID_EMPTY_NOTE}" style="display:none;">
            No purchase history items detected on this page. Try scrolling or paging, then click <strong>Capture now</strong>.
            Data persists in your browser until you click <strong>Clear</strong>.
          </div>

          <div id="${ID_LIST}"></div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', html)

    const overlay = document.getElementById(ID_OVERLAY)
    const panel = document.getElementById(ID_PANEL)
    const closeButton = document.getElementById(ID_CLOSE)
    const searchInput = document.getElementById(ID_SEARCH)
    const sortSelect = document.getElementById(ID_SORT)
    const captureToggle = document.getElementById(ID_CAPTURE_TOGGLE)
    const captureNow = document.getElementById(ID_CAPTURE_NOW)
    const exportBtn = document.getElementById(ID_EXPORT)
    const clearBtn = document.getElementById(ID_CLEAR)
    const listEl = document.getElementById(ID_LIST)
    const countEl = document.getElementById(ID_COUNT)
    const totalEl = document.getElementById(ID_TOTAL)
    const visibleTotalPill = document.getElementById(ID_VISIBLE_TOTAL)
    const emptyNote = document.getElementById(ID_EMPTY_NOTE)

    const setCaptureToggleLabel = () => {
      if (!captureToggle) return
      captureToggle.textContent = ui.captureEnabled ? 'Pause capture' : 'Resume capture'
      captureToggle.classList.toggle('ebay-ph-btn--muted', ui.captureEnabled)
    }

    const updateCountsAndTotals = (visibleItems, totals) => {
      if (countEl) {
        const totalCount = items.length
        const visibleCount = visibleItems.length
        const suffix = totalCount === 1 ? '' : 's'
        const extra = visibleCount === totalCount ? '' : ` (${visibleCount} shown)`
        countEl.textContent = `${totalCount} item${suffix} captured${extra}`
      }
      if (totalEl) {
        totalEl.textContent = formatUsd(totals.total)
      }
      if (visibleTotalPill) {
        const show = Boolean(normalizeText(ui.searchQuery))
        visibleTotalPill.style.display = show ? 'inline-flex' : 'none'
        const strong = visibleTotalPill.querySelector('strong')
        if (strong) strong.textContent = formatUsd(totals.visibleTotal)
      }
    }

    const rerender = () => {
      const totals = renderList(listEl, items, ui)
      updateCountsAndTotals(totals.visibleItems, totals)
      if (emptyNote) {
        const hasAny = items.length > 0
        emptyNote.style.display = hasAny ? 'none' : 'block'
      }
    }

    const doScan = () => {
      const rows = scanPage()
      const didChange = upsertItems(items, rows)
      if (didChange) saveItems(items)
      rerender()
    }

    const scheduleScan = () => {
      if (scanDebounce) window.clearTimeout(scanDebounce)
      scanDebounce = window.setTimeout(() => {
        scanDebounce = null
        doScan()
      }, 250)
    }

    const handleClose = () => {
      disconnectObserver()
      removeOverlay()
    }

    setCaptureToggleLabel()

    if (searchInput) {
      searchInput.value = ui.searchQuery || ''
      searchInput.addEventListener('input', (event) => {
        ui.searchQuery = event.target.value
        saveUi(ui)
        rerender()
      })
    }

    if (sortSelect) {
      sortSelect.value = ui.sortMode || DEFAULT_UI.sortMode
      sortSelect.addEventListener('change', (event) => {
        ui.sortMode = event.target.value
        saveUi(ui)
        rerender()
      })
    }

    if (captureToggle) {
      captureToggle.addEventListener('click', () => {
        ui.captureEnabled = !ui.captureEnabled
        saveUi(ui)
        setCaptureToggleLabel()
      })
    }

    if (captureNow) captureNow.addEventListener('click', () => doScan())

    if (exportBtn) exportBtn.addEventListener('click', () => downloadCsv(items))

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const ok = window.confirm('Clear all captured purchase history items? This cannot be undone.')
        if (!ok) return
        items.splice(0, items.length)
        localStorage.removeItem(LS_ITEMS)
        rerender()
      })
    }

    if (closeButton) closeButton.addEventListener('click', handleClose)

    if (overlay) {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) handleClose()
      })
    }

    if (panel) {
      panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') handleClose()
      })
    }

    escapeListener = (event) => {
      if (event.key !== 'Escape') return
      if (!document.getElementById(ID_OVERLAY)) return
      handleClose()
    }
    document.addEventListener('keydown', escapeListener, true)

    observer = new MutationObserver(() => {
      if (!ui.captureEnabled) return
      scheduleScan()
    })
    observer.observe(pickObserverRoot(), { childList: true, subtree: true })

    doScan()
  }

  window.BayTally = BayTally
  BayTally()
})()
