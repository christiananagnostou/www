const STYLESHEET = /*css*/ `
  #tcdb-scout-overlay {
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

  #tcdb-scout-panel {
    background: #111;
    border: 1px solid #2b2b2b;
    border-radius: 12px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    max-width: 920px;
    width: min(920px, 94vw);
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  #tcdb-scout-panel h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  #tcdb-scout-panel p {
    margin: 0.25rem 0 0;
    color: #bdbdbd;
    font-size: 0.9rem;
  }

  .tcdb-scout-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 1.25rem 0.75rem;
    border-bottom: 1px solid #222;
  }

  .tcdb-scout-close {
    background: transparent;
    border: none;
    color: #f5f5f5;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .tcdb-scout-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    padding: 0.6rem 1.25rem;
    border-bottom: 1px solid #222;
    --tcdb-control-height: 32px;
  }

  .tcdb-scout-meta-left,
  .tcdb-scout-meta-right {
    display: flex;
    align-items: stretch;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .tcdb-scout-limit,
  .tcdb-scout-search,
  .tcdb-scout-filter {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: #c7c7c7;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 999px;
    padding: 0.2rem 0.5rem;
    height: var(--tcdb-control-height);
  }

  .tcdb-scout-label {
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
  }

  .tcdb-scout-limit input,
  .tcdb-scout-search input {
    width: 60px;
    background: transparent;
    border: none;
    color: #f5f5f5;
    padding: 0.1rem 0.25rem;
    font-size: 0.8rem;
    height: 100%;
  }

  .tcdb-scout-filter select {
    background: transparent;
    border: none;
    color: #f5f5f5;
    padding: 0.1rem 0.25rem;
    font-size: 0.8rem;
    height: 100%;
  }

  .tcdb-scout-filter option {
    color: #111;
  }

  .tcdb-scout-search input {
    width: 150px;
  }

  .tcdb-scout-search input::placeholder {
    color: #6f6f6f;
  }

  .tcdb-scout-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #9fd0ff;
  }

  .tcdb-scout-icon svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .tcdb-scout-reset {
    background: #1e1e1e;
  }

  .tcdb-scout-btn {
    background: #232323;
    border: 1px solid #2f2f2f;
    color: #f5f5f5;
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
    cursor: pointer;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    transition: background 0.2s ease, border-color 0.2s ease;
    height: var(--tcdb-control-height);
  }

  .tcdb-scout-btn--compact {
    padding: 0.3rem 0.65rem;
  }

  .tcdb-scout-btn:hover {
    background: #2f2f2f;
    border-color: #3c3c3c;
  }

  .tcdb-scout-btn--opened {
    background: #1f3b2c;
    border-color: #2f6a4d;
    color: #d9ffe8;
  }

  .tcdb-scout-btn--opened::after {
    content: '✓';
    margin-left: 0.35rem;
    font-size: 0.75rem;
  }

  .tcdb-scout-note {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
    color: #d2d2d2;
    border-bottom: 1px solid #222;
    background: #161616;
  }

  .tcdb-scout-note a {
    color: #9fd0ff;
    text-decoration: none;
  }

  #tcdb-scout-list {
    overflow-y: auto;
    padding: 0.75rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tcdb-scout-empty {
    padding: 1rem;
    color: #bdbdbd;
    border: 1px dashed #2b2b2b;
    border-radius: 8px;
    text-align: center;
  }

  .tcdb-scout-item {
    background: #171717;
    border: 1px solid #262626;
    border-radius: 8px;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .tcdb-scout-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }


  .tcdb-scout-status-text {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #cfcfcf;
    line-height: 1.2;
  }

  .tcdb-scout-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    flex: 1;
  }

  .tcdb-scout-title {
    font-size: 0.9rem;
    color: #f0f0f0;
    line-height: 1.3;
    text-align: left;
  }

  .tcdb-scout-serial {
    margin-left: 0.4rem;
    color: #9fd0ff;
  }

  .tcdb-scout-variant {
    font-size: 0.8rem;
    color: #c7c7c7;
  }

  .tcdb-scout-actions {
    display: flex;
    gap: 0.5rem;
  }

  @media (max-width: 640px) {
    .tcdb-scout-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .tcdb-scout-open-all {
      width: 100%;
      flex-direction: column;
    }

    .tcdb-scout-actions {
      width: 100%;
    }

    .tcdb-scout-actions .tcdb-scout-btn {
      flex: 1;
    }
  }
`

;(function () {
  const ID_OVERLAY = 'tcdb-scout-overlay'
  const ID_PANEL = 'tcdb-scout-panel'
  const ID_STYLESHEET = 'tcdb-scout-styles'
  const ID_CLOSE = 'tcdb-scout-close'
  const ID_LIST = 'tcdb-scout-list'
  const ID_LIMIT = 'tcdb-scout-open-limit'
  const ID_SEARCH = 'tcdb-scout-search'
  const ID_RESET = 'tcdb-scout-reset'
  const ID_OPEN_ALL_ACTIVE = 'tcdb-scout-open-all-active'
  const ID_OPEN_ALL_SOLD = 'tcdb-scout-open-all-sold'
  const ID_STATUS_FILTER = 'tcdb-scout-status-filter'
  const ID_HOST_NOTE = 'tcdb-scout-host-note'
  const ID_EMPTY_NOTE = 'tcdb-scout-empty-note'
  const ID_MATCH_SORTER_SCRIPT = 'tcdb-scout-match-sorter'
  const LS_OPEN_LIMIT = 'tcdb-scout-open-limit'
  const LS_OPENED = 'tcdb-scout-opened'
  const LS_STATUS_FILTER = 'tcdb-scout-status-filter'
  const LS_SEARCH_QUERY = 'tcdb-scout-search-query'
  const DEFAULT_OPEN_LIMIT = 10
  const EBAY_SEARCH_URL = 'https://www.ebay.com/sch/i.html?_nkw='
  const EBAY_SOLD_PARAMS = '&LH_Sold=1&LH_Complete=1'
  const TCDB_COLLECTION_URL = 'https://www.tcdb.com/ViewCollectionMode.cfm'
  const ICON_SEARCH =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3a7 7 0 0 1 5.65 11.12l4.62 4.62-1.41 1.41-4.62-4.62A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>'
  const ICON_RESET =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5a7 7 0 1 1-6.32 4H3l3.5-3.5L10 9H7.84A5 5 0 1 0 12 7z"/></svg>'
  const EMPTY_STRING = ''
  const OPENED_KEY_SEPARATOR = ':'
  const DATE_KEY_LENGTH = 10
  const ARIA_PRESSED = 'aria-pressed'
  const MATCH_SORTER_KEY = 'matchSorter'
  const STATUS_CONFIG = {
    collection: { key: 'collection', label: 'Collection', color: '#d9edf7' },
    forSale: { key: 'forSale', label: 'For Sale', color: '#9dff9d' },
    wantlist: { key: 'wantlist', label: 'Wantlist', color: '#ffcece' },
    inTransaction: { key: 'inTransaction', label: 'Transaction', color: '#d6d6d6' },
    inbound: { key: 'inbound', label: 'Inbound', color: '#f2e28a' },
    outbound: { key: 'outbound', label: 'Outbound', color: '#f2e28a' },
    none: { key: 'none', label: 'None', color: '#ffffff' },
  }
  const STATUS_TITLE_MAP = {
    'For Sale / Trade': 'forSale',
    Wantlist: 'wantlist',
    'In-Transaction': 'inTransaction',
    'In-Transit (Inbound)': 'inbound',
    'In-Transit (Outbound)': 'outbound',
  }

  const ensureStyles = () => {
    if (document.getElementById(ID_STYLESHEET)) return
    const style = document.createElement('style')
    style.id = ID_STYLESHEET
    style.textContent = STYLESHEET
    document.head.appendChild(style)
  }

  const normalizeText = (value) => {
    const trimmed = value.replace(/\s+/g, ' ').trim()
    return trimmed || EMPTY_STRING
  }

  const getSerial = (text) => {
    const match = text.match(/SN\s*(\d+)/i)
    return match ? `/${match[1]}` : EMPTY_STRING
  }

  const getVariant = (cell, fallbackText) => {
    if (!cell) return ''
    const caption = cell.querySelector('figcaption')
    if (caption) {
      const captionText = normalizeText(caption.textContent || '')
      return captionText || ''
    }
    const match = fallbackText.match(/\bVAR\b:?\s*([^\n\r]*)/i)
    if (match) {
      const detail = normalizeText(match[1] || '')
      return detail ? `VAR: ${detail}` : 'VAR'
    }
    return ''
  }

  const getStatusFromRow = (row) => {
    if (!row) return STATUS_CONFIG.none
    const checkbox = row.querySelector('input.form-check-input[type="checkbox"]')
    if (checkbox) {
      return checkbox.checked ? STATUS_CONFIG.collection : STATUS_CONFIG.none
    }
    const icon = row.querySelector('i[title]')
    if (icon) {
      const title = normalizeText(icon.getAttribute('title') || '')
      const key = STATUS_TITLE_MAP[title]
      if (key && STATUS_CONFIG[key]) return STATUS_CONFIG[key]
    }
    return STATUS_CONFIG.none
  }

  const collectItems = () => {
    const links = Array.from(document.querySelectorAll('a[href*="/ViewCard.cfm"]'))
    return links
      .map((link) => {
        const title = normalizeText(link.textContent || '')
        if (!title) return null
        const cell = link.closest('td')
        const row = link.closest('tr')
        const cellText = normalizeText(cell ? cell.textContent || '' : title)
        const serial = getSerial(cellText)
        const variant = getVariant(cell, cellText)
        const query = serial ? `${title} ${serial}` : title
        const status = getStatusFromRow(row)
        return { title, serial, variant, query, status }
      })
      .filter(Boolean)
  }

  const getLimit = () => {
    const stored = parseInt(localStorage.getItem(LS_OPEN_LIMIT) || `${DEFAULT_OPEN_LIMIT}`, 10)
    if (Number.isNaN(stored)) return DEFAULT_OPEN_LIMIT
    return Math.max(1, stored)
  }

  const getStoredStatus = () => localStorage.getItem(LS_STATUS_FILTER) || 'all'

  const setStoredStatus = (value) => {
    if (!value) return
    localStorage.setItem(LS_STATUS_FILTER, value)
  }

  const getStoredSearch = () => localStorage.getItem(LS_SEARCH_QUERY) || ''

  const setStoredSearch = (value) => {
    if (typeof value !== 'string') return
    localStorage.setItem(LS_SEARCH_QUERY, value)
  }

  const setLimit = (value) => {
    const parsed = parseInt(value, 10)
    if (Number.isNaN(parsed) || parsed < 1) return
    localStorage.setItem(LS_OPEN_LIMIT, `${parsed}`)
  }

  const getTodayKey = () => new Date().toISOString().slice(0, DATE_KEY_LENGTH)

  const loadOpenedState = () => {
    const fallback = { date: getTodayKey(), opened: {} }
    try {
      const raw = localStorage.getItem(LS_OPENED)
      if (!raw) return fallback
      const parsed = JSON.parse(raw)
      if (!parsed || parsed.date !== fallback.date || typeof parsed.opened !== 'object') {
        return fallback
      }
      return parsed
    } catch (_error) {
      console.error(_error)
      return fallback
    }
  }

  const saveOpenedState = (state) => {
    localStorage.setItem(LS_OPENED, JSON.stringify(state))
  }

  const buildOpenedKey = (action, item) => `${action}${OPENED_KEY_SEPARATOR}${item.query}`

  const getMatchSorter = () => {
    const matchSorter = window[MATCH_SORTER_KEY]
    if (!matchSorter) return null
    return matchSorter.matchSorter || matchSorter.default || matchSorter
  }

  const ensureMatchSorter = (() => {
    let loader = null
    return () => {
      if (getMatchSorter()) return Promise.resolve(getMatchSorter())
      if (loader) return loader
      loader = new Promise((resolve) => {
        if (document.getElementById(ID_MATCH_SORTER_SCRIPT)) {
          resolve(getMatchSorter())
          return
        }
        const script = document.createElement('script')
        script.id = ID_MATCH_SORTER_SCRIPT
        script.src = 'https://unpkg.com/match-sorter@6.3.1/dist/match-sorter.umd.js'
        script.addEventListener('load', () => resolve(getMatchSorter()))
        script.addEventListener('error', () => resolve(null))
        document.head.appendChild(script)
      })
      return loader
    }
  })()

  const buildUrl = (query, sold) => {
    const base = `${EBAY_SEARCH_URL}${encodeURIComponent(query)}`
    return sold ? `${base}${EBAY_SOLD_PARAMS}` : base
  }

  const setButtonOpened = (button, opened) => {
    if (!button) return
    button.classList.toggle('tcdb-scout-btn--opened', opened)
    button.setAttribute(ARIA_PRESSED, opened ? 'true' : 'false')
  }

  const openSearch = (item, sold) => {
    window.open(buildUrl(item.query, sold), '_blank', 'noopener')
  }

  const openAll = (items, action, limit, openedSet, markOpened) => {
    const unopened = items.filter((item) => !openedSet.has(buildOpenedKey(action, item)))
    unopened.slice(0, limit).forEach((item) => {
      openSearch(item, action === 'open-sold')
      markOpened(action, item)
    })
  }

  const removeOverlay = () => {
    const existing = document.getElementById(ID_OVERLAY)
    if (existing) existing.remove()
  }

  const render = () => {
    removeOverlay()
    ensureStyles()

    const items = collectItems()
    const hostMatches = window.location.hostname.includes('tcdb.com')
    const limit = getLimit()
    const openedState = loadOpenedState()
    openedState.opened = openedState.opened || {}
    const openedSet = new Set(Object.keys(openedState.opened))
    const itemIndexMap = new Map(items.map((item, index) => [item, index]))
    let currentEntries = items.map((item, index) => ({ item, index }))
    let currentStatus = getStoredStatus()
    let currentQuery = getStoredSearch()

    const html = /*html*/ `
      <div id="${ID_OVERLAY}">
        <div id="${ID_PANEL}" role="dialog" aria-modal="true" aria-label="TCDB Scout">
          <div class="tcdb-scout-header">
            <div>
              <h2>TCDB Scout</h2>
              <p class="tcdb-scout-count">${items.length} item${items.length === 1 ? '' : 's'} found</p>
            </div>
            <button class="tcdb-scout-close" id="${ID_CLOSE}" aria-label="Close">×</button>
          </div>
          <div class="tcdb-scout-meta">
            <div class="tcdb-scout-meta-left">
              <label class="tcdb-scout-search">
                <span class="tcdb-scout-icon">${ICON_SEARCH}</span>
                <input type="text" id="${ID_SEARCH}" placeholder="Search cards" />
              </label>
            </div>
            <div class="tcdb-scout-meta-right">
              <label class="tcdb-scout-filter">
                <span class="tcdb-scout-label">Status</span>
                <select id="${ID_STATUS_FILTER}">
                  <option value="all">All</option>
                  ${Object.values(STATUS_CONFIG)
                    .map((status) => `<option value="${status.key}">${status.label}</option>`)
                    .join('')}
                </select>
              </label>
              <label class="tcdb-scout-limit">
                <span class="tcdb-scout-label">Max</span>
                <input type="number" min="1" id="${ID_LIMIT}" value="${limit}" />
              </label>
              <button class="tcdb-scout-btn tcdb-scout-reset" id="${ID_RESET}" type="button">
                <span class="tcdb-scout-icon">${ICON_RESET}</span>
                Clear opened
              </button>
              <button class="tcdb-scout-btn tcdb-scout-btn--compact" id="${ID_OPEN_ALL_ACTIVE}">
                Open active
              </button>
              <button class="tcdb-scout-btn tcdb-scout-btn--compact" id="${ID_OPEN_ALL_SOLD}">
                Open sold
              </button>
            </div>
          </div>
          <div class="tcdb-scout-note" id="${ID_HOST_NOTE}" style="display: ${hostMatches ? 'none' : 'block'};">
            This works best on a TCDB collection page. Visit
            <a href="${TCDB_COLLECTION_URL}" target="_blank" rel="noopener">${TCDB_COLLECTION_URL}</a>.
          </div>
          <div class="tcdb-scout-note" id="${ID_EMPTY_NOTE}" style="display: ${items.length ? 'none' : 'block'};">
            No TCDB collection items were detected on this page.
          </div>
          <div id="${ID_LIST}"></div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', html)

    const overlay = document.getElementById(ID_OVERLAY)
    const panel = document.getElementById(ID_PANEL)
    const closeButton = document.getElementById(ID_CLOSE)
    const openAllActive = document.getElementById(ID_OPEN_ALL_ACTIVE)
    const openAllSold = document.getElementById(ID_OPEN_ALL_SOLD)
    const limitInput = document.getElementById(ID_LIMIT)
    const resetButton = document.getElementById(ID_RESET)
    const searchInput = document.getElementById(ID_SEARCH)
    const statusFilter = document.getElementById(ID_STATUS_FILTER)
    const list = document.getElementById(ID_LIST)
    const countLabel = panel.querySelector('.tcdb-scout-count')

    const markOpened = (action, item) => {
      const key = buildOpenedKey(action, item)
      if (!openedSet.has(key)) {
        openedSet.add(key)
        openedState.opened[key] = true
        saveOpenedState(openedState)
      }
      const index = itemIndexMap.get(item)
      if (typeof index === 'number') {
        const selector = `button[data-action="${action}"][data-index="${index}"]`
        setButtonOpened(panel.querySelector(selector), true)
      }
    }

    const applyOpenedStates = () => {
      panel.querySelectorAll('button[data-action]').forEach((button) => {
        const index = parseInt(button.dataset.index, 10)
        if (Number.isNaN(index) || !items[index]) return
        const action = button.dataset.action
        const key = buildOpenedKey(action, items[index])
        setButtonOpened(button, openedSet.has(key))
      })
    }

    const updateCount = (visibleCount) => {
      if (!countLabel) return
      const suffix = visibleCount === 1 ? '' : 's'
      const totalSuffix = items.length === 1 ? '' : 's'
      const extra = visibleCount === items.length ? '' : ` (of ${items.length} item${totalSuffix})`
      countLabel.textContent = `${visibleCount} item${suffix} found${extra}`
    }

    const renderItems = (entries) =>
      entries
        .map(
          ({ item, index }) => /*html*/ `
            <div class="tcdb-scout-item">
              <div class="tcdb-scout-info">
                <div class="tcdb-scout-title" title="${item.title}">
                  ${item.title}${item.serial ? `<span class="tcdb-scout-serial">${item.serial}</span>` : EMPTY_STRING}
                </div>
                ${item.variant ? `<div class="tcdb-scout-variant">${item.variant}</div>` : EMPTY_STRING}
                <div class="tcdb-scout-status">
                  <span class="tcdb-scout-status-text">${item.status.label}</span>
                </div>
              </div>
              <div class="tcdb-scout-actions">
                <button class="tcdb-scout-btn" data-action="open-active" data-index="${index}">Active</button>
                <button class="tcdb-scout-btn" data-action="open-sold" data-index="${index}">Sold</button>
              </div>
            </div>
          `
        )
        .join('')

    const updateList = (entries, query, status) => {
      currentEntries = entries
      if (!list) return
      if (!entries.length) {
        const trimmed = query.trim()
        const statusLabel = status && status !== 'all' ? STATUS_CONFIG[status]?.label || STATUS_CONFIG.none.label : ''
        const message =
          trimmed && statusLabel
            ? `No matches for "${trimmed}" with ${statusLabel}.`
            : trimmed
              ? `No matches for "${trimmed}".`
              : statusLabel
                ? `No matches for ${statusLabel}.`
                : 'No matches found.'
        list.innerHTML = `<div class="tcdb-scout-empty">${message}</div>`
      } else {
        list.innerHTML = renderItems(entries)
      }
      applyOpenedStates()
      updateCount(entries.length)
    }

    const handleClose = () => {
      removeOverlay()
    }

    closeButton.addEventListener('click', handleClose)
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) handleClose()
    })

    const filterEntries = async (query, status) => {
      const trimmed = query.trim()
      const statusKey = status === 'all' ? '' : status
      const matchesStatus = (item) => (!statusKey ? true : item.status.key === statusKey)

      if (!trimmed) {
        updateList(
          items.map((item, index) => ({ item, index })).filter(({ item }) => matchesStatus(item)),
          '',
          status
        )
        return
      }

      const matchSorter = await ensureMatchSorter()
      if (matchSorter) {
        const ranked = matchSorter(items, trimmed, {
          keys: ['title', 'serial', 'variant'],
          threshold: matchSorter.rankings ? matchSorter.rankings.CONTAINS : undefined,
        })
        updateList(
          ranked.filter(matchesStatus).map((item) => ({ item, index: itemIndexMap.get(item) })),
          trimmed,
          status
        )
        return
      }

      const fallback = items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => {
          if (!matchesStatus(item)) return false
          const haystack = `${item.title} ${item.serial} ${item.variant || ''}`.toLowerCase()
          return haystack.includes(trimmed.toLowerCase())
        })
      updateList(fallback, trimmed, status)
    }

    const resetOpened = () => {
      openedSet.clear()
      openedState.opened = {}
      saveOpenedState(openedState)
      applyOpenedStates()
    }

    openAllActive.addEventListener('click', () =>
      openAll(
        currentEntries.map(({ item }) => item),
        'open-active',
        getLimit(),
        openedSet,
        markOpened
      )
    )
    openAllSold.addEventListener('click', () =>
      openAll(
        currentEntries.map(({ item }) => item),
        'open-sold',
        getLimit(),
        openedSet,
        markOpened
      )
    )
    limitInput.addEventListener('change', (event) => setLimit(event.target.value))
    if (resetButton) resetButton.addEventListener('click', resetOpened)
    if (searchInput) {
      searchInput.value = currentQuery
      searchInput.addEventListener('input', (event) => {
        currentQuery = event.target.value
        setStoredSearch(currentQuery)
        filterEntries(currentQuery, currentStatus)
      })
    }
    if (statusFilter) {
      statusFilter.value = currentStatus
      statusFilter.addEventListener('change', (event) => {
        currentStatus = event.target.value
        setStoredStatus(currentStatus)
        filterEntries(currentQuery, currentStatus)
      })
    }

    panel.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]')
      if (!button) return
      const index = parseInt(button.dataset.index, 10)
      if (Number.isNaN(index) || !items[index]) return
      const action = button.dataset.action
      openSearch(items[index], action === 'open-sold')
      markOpened(action, items[index])
    })

    if (currentStatus !== 'all' || currentQuery) {
      filterEntries(currentQuery, currentStatus)
    } else {
      updateList(currentEntries, '', currentStatus)
    }
  }

  window.TCDBScout = render
  render()
})()
