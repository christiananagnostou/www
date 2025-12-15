;(function () {
  // Class/ID constants
  const ID_CONTAINER = 'hotbids-container'
  const ID_TOOLBAR = 'hotbids-toolbar'
  const CN_MODAL = 'hotbids-modal'
  const CN_BTN = 'hotbids-btn'
  // Menu
  const ID_MENU_BTN = 'menuBtn'
  const ID_MENU_CLOSE = 'menuPanelCloseBtn'
  const ID_MENU_PANEL = 'menuPanel'
  const ID_TOGGLE_SOLD = 'toggleSoldBtn'
  const CN_POP_LEFT_BTN = 'popToLeftBtn'
  const CN_POP_RIGHT_BTN = 'popToRightBtn'
  const CN_POP_TOP_BTN = 'popToTopBtn'
  const CN_POP_BOTTOM_BTN = 'popToBottomBtn'
  // Positioning classes
  const CN_POP_LEFT_POS = 'pop-left'
  const CN_POP_RIGHT_POS = 'pop-right'
  const CN_POP_TOP_POS = 'pop-top'
  const CN_POP_BOTTOM_POS = 'pop-bottom'
  // Navigation
  const ID_PREV = 'prevBtn'
  const ID_NEXT = 'nextBtn'
  const ID_RETRY = 'retryBtn'
  const ID_MATCH_BOX = 'currentMatchBox'
  // Help
  const ID_HELP_BTN = 'helpBtn'
  const ID_HELP_CLOSE = 'helpPanelCloseBtn'
  const ID_HELP_PANEL = 'helpPanel'
  // Highlight classes
  const CN_HIGHLIGHT_MATCH = 'hotbids-match'
  const CN_HIGHLIGHT_CURRENT = 'hotbids-current'
  const CN_SOLD_LINK = 'hotbids-sold-link'
  // LocalStorage keys
  const LS_MIN_BIDS = 'hotbids-min-bids'
  const LS_SORT_BY_BIDS = 'hotbids-sort-by-bids'
  const LS_POSITION = 'hotbids-position'
  const LS_HIDE_NON_RESULTS = 'hotbids-hide-non-results'
  // eBay selectors
  const SEL_BID_COUNT = '.s-item__bidCount, .str-item-card__property-bidCount'
  const SEL_ITEM_CONTAINER = '.s-item'
  const SEL_ITEM_TITLE = '.s-item__title'
  // Invalid containers (items within these containers will be ignored)
  const INVALID_CONTAINERS = ['srp-items-carousel__container']
  // URL constants
  const URL_EBAY_SEARCH = 'https://www.ebay.com/sch/i.html?'
  const PARAM_SOLD = 'LH_Sold=1'
  // Regex pattern
  const REGEX_BID_COUNT = /([1-9]\d*)\s+bids?/i
  // Stylesheet ID
  const ID_STYLESHEET = 'hotbids-styles'

  class HotBids {
    constructor() {
      this.regexPattern = REGEX_BID_COUNT
      this.matches = []
      this.currentMatchIndex = -1
      this.minBids = parseInt(localStorage.getItem(LS_MIN_BIDS) || '1') || 1
      this.sortByBids = localStorage.getItem(LS_SORT_BY_BIDS) === 'true'
      this.hideNonResults = localStorage.getItem(LS_HIDE_NON_RESULTS) === 'true'

      this.injectStyles()
      this.collectMatches()
      this.createToolbar()
      this.scrollToNextMatch()
      document.addEventListener('keydown', this.handleKeyPress.bind(this))
    }

    injectStyles() {
      if (!document.getElementById(ID_STYLESHEET)) {
        const styleEl = document.createElement('style')
        styleEl.id = ID_STYLESHEET
        styleEl.textContent = STYLESHEET
        document.head.appendChild(styleEl)
      }
    }

    collectMatches() {
      document.querySelectorAll(`.${CN_HIGHLIGHT_MATCH}`).forEach((el) => {
        el.classList.remove(CN_HIGHLIGHT_MATCH)
        el.style.removeProperty('--highlight-color')
      })
      document.querySelectorAll(`.${CN_SOLD_LINK}`).forEach((el) => el.remove())

      const els = document.querySelectorAll(SEL_BID_COUNT)
      this.matches = []
      els.forEach((el) => {
        // Check if element is within any invalid container
        const isInInvalidContainer = INVALID_CONTAINERS.some((className) => el.closest(`.${className}`))
        if (isInInvalidContainer) return // Skip this element

        const txt = el.innerText || el.textContent
        const match = txt.match(this.regexPattern)
        if (match) {
          const bidCount = parseInt(match[1])
          if (bidCount >= this.minBids) {
            this.matches.push({ element: el, bidCount })
          }
        }
      })

      if (this.sortByBids) {
        this.matches.sort((a, b) => b.bidCount - a.bidCount)
      }

      // Calculate max bids for color gradient
      this.maxBids = this.matches.length ? Math.max(...this.matches.map((m) => m.bidCount)) : this.minBids

      // Apply highlights and sold price links
      this.matches.forEach((m) => {
        const el = m.element
        el.classList.add(CN_HIGHLIGHT_MATCH)

        // Calculate hue for color gradient (green to red)
        let hue
        if (this.maxBids === this.minBids) {
          hue = 120 // Green if all bids are the same
        } else {
          const ratio = (m.bidCount - this.minBids) / (this.maxBids - this.minBids)
          hue = 120 - ratio * 120
        }
        el.style.setProperty('--highlight-color', `hsl(${hue}, 100%, 50%)`)

        // Add "Check Sold Prices" link
        const itemContainer = el.closest(SEL_ITEM_CONTAINER)
        if (itemContainer) {
          const titleEl = itemContainer.querySelector(SEL_ITEM_TITLE)
          if (titleEl) {
            const title = titleEl.textContent.trim()
            const soldUrl = `${URL_EBAY_SEARCH}_nkw=${encodeURIComponent(title)}&${PARAM_SOLD}`
            el.insertAdjacentHTML(
              'afterend',
              `<a href="${soldUrl}" target="_blank" rel="noopener" class="${CN_SOLD_LINK}">Check Sold Prices</a>`
            )
          }
        }
      })

      // Apply hide non-results functionality
      this.applyHideNonResults()
    }

    createToolbar() {
      const html = /*html*/ `
        <div id="${ID_CONTAINER}">
          <div id="${ID_TOOLBAR}" class="${CN_POP_BOTTOM_POS}">
            <div class="hotbids-row left-row">
              <button id="${ID_MENU_BTN}" class="${CN_BTN} rotatable">${THREE_DOTS_SVG}</button>
              <span id="${ID_MATCH_BOX}">${this.currentMatchIndex + 1}/${this.matches.length}</span>
            </div>

            <div class="hotbids-row center-row">
              <button id="${ID_PREV}" class="${CN_BTN} rotatable" aria-label="Previous bid">${LEFT_ARROW_SVG}</button>
              <button id="${ID_NEXT}" class="${CN_BTN} rotatable" aria-label="Next bid">${RIGHT_ARROW_SVG}</button>
              <div class="vertical-separator"></div>
              <button id="${ID_RETRY}" class="${CN_BTN}">${RETRY_ARROW_SVG}</button>
            </div>

            <div class="hotbids-row right-row">
              <button id="${ID_HELP_BTN}" class="${CN_BTN}">${QUESTION_SVG}</button>
            </div> 
          </div>

          <div id="${ID_MENU_PANEL}" class="${CN_MODAL}" aria-hidden="true">
            <button class="${CN_BTN}" id="${ID_MENU_CLOSE}">${CLOSE_SVG}</button>
            <span><strong>Toolbar Position</strong></span><hr/>
            <div class="pop-to-grid">
              <button class="${CN_BTN}" id="${CN_POP_LEFT_BTN}">◀</button>
              <button class="${CN_BTN}" id="${CN_POP_RIGHT_BTN}">▶</button>
              <button class="${CN_BTN}" id="${CN_POP_TOP_BTN}">▲</button>
              <button class="${CN_BTN}" id="${CN_POP_BOTTOM_BTN}">▼</button>
            </div>
            <span><strong>Tools</strong></span><hr/>
            <div class="tools-container">
              <div class="hotbids-option">
                <label class="custom-checkbox">
                  <input type="checkbox" id="${ID_TOGGLE_SOLD}" ${this.isSoldFilterActive() ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  Show sold items
                </label>
              </div>
              <div class="hotbids-option">
                <label class="custom-checkbox">
                  <input type="checkbox" id="sortByBidsCheckbox" ${this.sortByBids ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  Sort by bids descending
                </label>
              </div>
              <div class="hotbids-option">
                <label class="custom-checkbox">
                  <input type="checkbox" id="hideNonResultsCheckbox" ${this.hideNonResults ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  Hide items without bids
                </label>
              </div>
              <div class="hotbids-option">
                <label for="minBidsInput">Min bids:</label>
                <input type="number" id="minBidsInput" min="1" value="${this.minBids}">
              </div>
            </div>
          </div>

          <div id="${ID_HELP_PANEL}" class="${CN_MODAL}" aria-hidden="true">
            <button id="${ID_HELP_CLOSE}" class="${CN_BTN}">${CLOSE_SVG}</button>
            <h2>Hotbids Help</h2>
            <p>Hotbids enhances your eBay browsing experience by highlighting items with bids, allowing you to navigate them easily, and providing tools to filter and sort these items.</p>
            <h3>Features</h3>
            <ul>
              <li>Highlight items with bids using a color gradient based on bid count (green to red).</li>
              <li>Navigate through highlighted items with keyboard shortcuts.</li>
              <li>Filter items by minimum number of bids.</li>
              <li>Sort items by bid count descending.</li>
              <li>Each highlighted item has a "Check Sold Prices" link to compare with historical sold prices.</li>
            </ul>
            <h3>Navigation</h3>
            <p>
              <strong>Arrow Right</strong> or <strong>n</strong> - Next item<br/>
              <strong>Arrow Left</strong> or <strong>Shift + N</strong> - Previous item
            </p>
            <h3>Toolbar Positioning</h3>
            <p>
              <strong>Shift + W</strong> - Move toolbar to top<br/>
              <strong>Shift + A</strong> - Move toolbar to left<br/>
              <strong>Shift + S</strong> - Move toolbar to bottom<br/>
              <strong>Shift + D</strong> - Move toolbar to right
            </p>
            <h3>Feedback</h3>
            <p>If you like this tool, check out the source code on <a href="https://github.com/christiananagnostou/www/blob/master/public/scripts/hotbids.js" target="_blank">GitHub</a>.</p>
          </div>
        </div>
      `

      document.body.insertAdjacentHTML('beforeend', html)

      // Toolbar elements
      this.toolbar = document.getElementById(ID_TOOLBAR)
      this.menuBtn = document.getElementById(ID_MENU_BTN)
      this.currentMatch = document.getElementById(ID_MATCH_BOX)
      this.prevBtn = document.getElementById(ID_PREV)
      this.nextBtn = document.getElementById(ID_NEXT)
      this.retryBtn = document.getElementById(ID_RETRY)
      this.helpBtn = document.getElementById(ID_HELP_BTN)
      // Menu panel elements
      this.menuPanel = document.getElementById(ID_MENU_PANEL)
      this.popLeftBtn = document.getElementById(CN_POP_LEFT_BTN)
      this.popRightBtn = document.getElementById(CN_POP_RIGHT_BTN)
      this.popTopBtn = document.getElementById(CN_POP_TOP_BTN)
      this.popBottomBtn = document.getElementById(CN_POP_BOTTOM_BTN)
      this.toggleSoldBtn = document.getElementById(ID_TOGGLE_SOLD)
      this.menuPanelCloseBtn = document.getElementById(ID_MENU_CLOSE)
      // Help panel elements
      this.helpPanel = document.getElementById(ID_HELP_PANEL)
      this.helpPanelCloseBtn = document.getElementById(ID_HELP_CLOSE)
      this.minBidsInput = document.getElementById('minBidsInput')
      this.sortByBidsCheckbox = document.getElementById('sortByBidsCheckbox')
      this.hideNonResultsCheckbox = document.getElementById('hideNonResultsCheckbox')

      // Load saved position
      const savedPosition = localStorage.getItem(LS_POSITION) || CN_POP_BOTTOM_POS
      this.setLocationClass(savedPosition)

      // Toolbar event listeners
      this.menuBtn.onclick = () => this.toggleModal(this.menuPanel)
      this.prevBtn.onclick = () => this.scrollToPreviousMatch()
      this.nextBtn.onclick = () => this.scrollToNextMatch()
      this.retryBtn.onclick = () => this.retryMatches()
      this.helpBtn.onclick = () => this.toggleModal(this.helpPanel)
      // Menu panel event listeners
      this.popLeftBtn.onclick = () => this.setLocationClass(CN_POP_LEFT_POS)
      this.popRightBtn.onclick = () => this.setLocationClass(CN_POP_RIGHT_POS)
      this.popTopBtn.onclick = () => this.setLocationClass(CN_POP_TOP_POS)
      this.popBottomBtn.onclick = () => this.setLocationClass(CN_POP_BOTTOM_POS)
      this.toggleSoldBtn.addEventListener('change', () => this.toggleSold())
      this.menuPanelCloseBtn.onclick = () => this.toggleModal(this.menuPanel)
      // Help panel event listeners
      this.helpPanelCloseBtn.onclick = () => this.toggleModal(this.helpPanel)
      this.minBidsInput.addEventListener('change', (e) => {
        this.minBids = parseInt(e.target.value) || 1
        localStorage.setItem(LS_MIN_BIDS, this.minBids)
        this.retryMatches()
      })
      this.sortByBidsCheckbox.addEventListener('change', (e) => {
        this.sortByBids = e.target.checked
        localStorage.setItem(LS_SORT_BY_BIDS, this.sortByBids)
        this.retryMatches()
      })
      this.hideNonResultsCheckbox.addEventListener('change', (e) => {
        this.hideNonResults = e.target.checked
        localStorage.setItem(LS_HIDE_NON_RESULTS, this.hideNonResults)
        this.applyHideNonResults()
      })

      if (!this.checkSoldCheckbox()) {
        this.toggleSoldBtn.disabled = true
        this.toggleSoldBtn.closest('.custom-checkbox').title = 'Sold checkbox not found'
      }
    }

    toggleModal(el) {
      if (!el) return
      const hidden = el.getAttribute('aria-hidden') === 'false'
      el.setAttribute('aria-hidden', hidden ? 'true' : 'false')
    }

    setLocationClass(cls) {
      this.toolbar.classList.remove(CN_POP_LEFT_POS, CN_POP_RIGHT_POS, CN_POP_TOP_POS, CN_POP_BOTTOM_POS)
      this.toolbar.classList.add(cls)
      localStorage.setItem(LS_POSITION, cls)
    }

    isSoldFilterActive() {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.has('LH_Sold') && urlParams.get('LH_Sold') === '1'
    }

    checkSoldCheckbox() {
      return document.querySelector('[name="LH_Sold"] .checkbox__control')
    }

    toggleSold() {
      const soldCheckbox = this.checkSoldCheckbox()
      if (soldCheckbox) soldCheckbox.click()
    }

    applyHideNonResults() {
      const allItems = document.querySelectorAll(SEL_ITEM_CONTAINER)
      allItems.forEach((item) => {
        const bidElement = item.querySelector(SEL_BID_COUNT)
        const hasBids = bidElement && this.matches.some((match) => match.element === bidElement)

        if (this.hideNonResults && !hasBids) {
          item.style.display = 'none'
        } else {
          item.style.display = ''
        }
      })
    }

    scrollToNextMatch() {
      if (!this.matches.length) return
      this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length
      this.highlightElement()
      this.matches[this.currentMatchIndex].element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateToolbar()
    }

    scrollToPreviousMatch() {
      if (!this.matches.length) return
      this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length
      this.highlightElement()
      this.matches[this.currentMatchIndex].element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateToolbar()
    }

    retryMatches() {
      this.currentMatchIndex = -1
      this.collectMatches()
      this.scrollToNextMatch()
    }

    updateToolbar() {
      if (this.currentMatch) {
        this.currentMatch.textContent =
          this.matches.length === 0 ? '0/0' : `${this.currentMatchIndex + 1}/${this.matches.length}`
      }
    }

    highlightElement() {
      const old = document.querySelector(`.${CN_HIGHLIGHT_CURRENT}`)
      if (old) old.classList.remove(CN_HIGHLIGHT_CURRENT)
      const currentEl = this.matches[this.currentMatchIndex].element
      currentEl.classList.add(CN_HIGHLIGHT_CURRENT)
    }

    handleKeyPress(e) {
      const { target } = e
      const tagName = target.tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
        return // Don't trigger shortcuts while typing
      }

      // Navigation with arrows or n/N
      if ((e.key === 'n' && !e.shiftKey) || e.key === 'ArrowRight') this.scrollToNextMatch()
      if ((e.key === 'N' && e.shiftKey) || e.key === 'ArrowLeft') this.scrollToPreviousMatch()
      // Toolbar positioning with Shift + WASD
      if (e.shiftKey && e.key === 'W') this.setLocationClass(CN_POP_TOP_POS)
      if (e.shiftKey && e.key === 'A') this.setLocationClass(CN_POP_LEFT_POS)
      if (e.shiftKey && e.key === 'S') this.setLocationClass(CN_POP_BOTTOM_POS)
      if (e.shiftKey && e.key === 'D') this.setLocationClass(CN_POP_RIGHT_POS)
    }
  }

  const STYLESHEET = /*css*/ `
    :root {
      --toolbar-bg: #111;
      --toolbar-fg: #eee;
      --toolbar-border: #333;
      --button-bg: #222;
      --button-bg-hover: #333;
      --toolbar-width: 600px;
    }

    #${ID_CONTAINER} {
      color: var(--toolbar-fg);
    }

    #${ID_CONTAINER} p { 
      margin: 0; 
    }

    #${ID_CONTAINER} a { 
      font-family: inherit; 
      color: inherit; 
      text-decoration: underline solid var(--toolbar-border); 
      text-underline-offset: 3px; 
      transition: 0.2s; 
    }
    #${ID_CONTAINER} a:hover { 
      text-decoration-color: var(--toolbar-fg); 
    }

    #${ID_TOOLBAR} {
      position: fixed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: var(--toolbar-width);
      padding: 0.5rem;
      background-color: var(--toolbar-bg);
      font-size: 1rem;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
      z-index: 999999;
      flex-direction: var(--flex-direction, row);
    }

    #${ID_MATCH_BOX} {
      font-weight: 300;
    }

    .${CN_POP_LEFT_POS} {
      --flex-direction: column;
      top: 50% !important; left: 0 !important; right: auto !important;
      transform: translateY(-50%) !important;
      width: auto !important; max-width: none !important;
      height: 100% !important; max-height: var(--toolbar-width) !important;
      border-radius: 0 6px 6px 0 !important;
    }
    .${CN_POP_RIGHT_POS} {
      --flex-direction: column;
      top: 50% !important; right: 0 !important; left: auto !important;
      transform: translateY(-50%) !important;
      width: auto !important; max-width: none !important;
      height: 100% !important; max-height: var(--toolbar-width) !important;
      border-radius: 6px 0 0 6px !important;
    }
    .${CN_POP_TOP_POS} {
      --flex-direction: row;
      top: 0 !important; bottom: auto !important; left: 50% !important;
      transform: translateX(-50%) !important;
      width: 100% !important; max-width: var(--toolbar-width) !important;
      border-radius: 0 0 6px 6px !important;
    }
    .${CN_POP_BOTTOM_POS} {
      --flex-direction: row;
      bottom: 0 !important; top: auto !important; left: 50% !important;
      transform: translateX(-50%) !important;
      width: 100% !important; max-width: var(--toolbar-width) !important;
      border-radius: 6px 6px 0 0 !important;
    }

    .hotbids-row { 
      display: flex;
      flex-direction: var(--flex-direction, row);
      align-items: center;
      gap: 0.5rem; 
    }
    .left-row   { flex: 1; justify-content: flex-start; }
    .center-row { flex: 1; justify-content: center; position: relative; }
    .right-row  { flex: 1; justify-content: flex-end; position: relative; }

    .${CN_MODAL} {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: var(--toolbar-bg); 
      border: 1px solid var(--toolbar-border);
      font-size: 0.85rem;
      min-width: 300px;
      padding: 1.25rem; 
      border-radius: 8px;
      box-shadow: 0 0 16px rgba(0,0,0,0.4);
      z-index: 1000000;
      display: none;
    }
    .${CN_MODAL}[aria-hidden="false"] {
      display: block;
    }

    .${CN_MODAL} h2, 
    .${CN_MODAL} h3 {
      margin: 0.5rem 0;
      color: var(--toolbar-fg);
    }
    .${CN_MODAL} ul {
      list-style-type: disc;
      margin: 0;
      padding: 0 0 0 1rem;
    }
    .${CN_MODAL} p, 
    .${CN_MODAL} ul {
      margin-bottom: 1rem !important;
      color: lightgray;
    }

    .${CN_MODAL} .${CN_BTN}:not(#${ID_MENU_CLOSE}):not(#${ID_HELP_CLOSE}) {
      width: 100%; 
    }

    .${CN_MODAL} hr {
      border: none; 
      border-top: 1px solid var(--toolbar-border); 
      margin: .25rem 0 0.5rem; 
    }

    .${CN_MODAL} .pop-to-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: auto auto auto;
      gap: 0.5rem;
      grid-template-areas:
        ". . top top . ."
        ". left left right right ."
        ". . bottom bottom . .";
    }
    #${CN_POP_LEFT_BTN} { grid-area: left; }
    #${CN_POP_RIGHT_BTN} { grid-area: right; }
    #${CN_POP_TOP_BTN} { grid-area: top; }
    #${CN_POP_BOTTOM_BTN} { grid-area: bottom; }

    #${ID_TOGGLE_SOLD}:disabled {
      background: var(--toolbar-bg);
      color: var(--toolbar-border);
      cursor: not-allowed;
    }

    #${ID_MENU_CLOSE}, #${ID_HELP_CLOSE} {
      position: absolute;
      top: 0.25rem; right: 0.25rem;
      background: none;
      border: none;
      cursor: pointer;
    }

    .vertical-separator {
      width: 1px; 
      background: var(--toolbar-border);
      height: 1.6rem; 
      margin: 0 0.5rem;
    }

    button.${CN_BTN} {
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 4px; 
      border: none;
      background: var(--button-bg); 
      color: inherit;
      transition: background 0.2s ease, opacity 0.2s ease;
      display: flex; 
      align-items: center; 
      justify-content: center;
    }
    button.${CN_BTN}:hover, 
    button.${CN_BTN}:focus {
      background: var(--button-bg-hover);
      outline: none;
    }
    button.${CN_BTN} svg { 
      height: 1em; 
      width: 1em; 
    }

    .${CN_POP_LEFT_POS} .${CN_BTN}.rotatable svg,
    .${CN_POP_RIGHT_POS} .${CN_BTN}.rotatable svg {
      transform: rotate(90deg);
    }

    .${CN_HIGHLIGHT_MATCH} {
      outline: 2px solid var(--highlight-color) !important;
      outline-offset: 1px;
    }
    .${CN_HIGHLIGHT_CURRENT} {
      outline-width: 4px !important;
    }
    .${CN_SOLD_LINK} {
      font-size: 0.9em;
      color: var(--toolbar-fg);
      text-decoration: underline;
      margin-left: 0.5em;
      transition: color 0.2s;
    }
    .${CN_SOLD_LINK}:hover {
      color: #fff;
    }

    .tools-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .hotbids-option {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .custom-checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }

    .custom-checkbox input {
      display: none;
    }

    .custom-checkbox .checkmark {
      width: 18px;
      height: 18px;
      border: 2px solid var(--toolbar-border);
      border-radius: 4px;
      margin-right: 0.75rem;
      position: relative;
      background: var(--button-bg);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .custom-checkbox:hover .checkmark {
      border-color: var(--toolbar-fg);
      background: var(--button-bg-hover);
    }

    .custom-checkbox input:checked + .checkmark {
      background-color: #4CAF50;
      border-color: #4CAF50;
    }

    .custom-checkbox input:checked + .checkmark::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .custom-checkbox input:disabled + .checkmark {
      background: var(--toolbar-bg);
      border-color: var(--toolbar-border);
      cursor: not-allowed;
      opacity: 0.5;
    }

    .hotbids-option input[type="number"] {
      background: var(--button-bg);
      color: var(--toolbar-fg);
      border: 1px solid var(--toolbar-border);
      border-radius: 4px;
      padding: 0.25rem;
      width: 80px;
    }

    .hotbids-option input[type="number"]:hover {
      border-color: var(--toolbar-fg);
    }

    .hotbids-option input[type="number"]:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--toolbar-fg);
    }
  `

  const CLOSE_SVG = /*svg*/ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>`
  const THREE_DOTS_SVG = /*svg*/ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"></path></svg>`
  const LEFT_ARROW_SVG = /*svg*/ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>`
  const RIGHT_ARROW_SVG = /*svg*/ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>`
  const RETRY_ARROW_SVG = /*svg*/ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32"><path d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13 13-5.832 13-13h-2c0 6.086-4.914 11-11 11S5 22.086 5 16 9.914 5 16 5c3.875 0 7.262 1.984 9.219 5H20v2h8V4h-2v3.719C23.617 4.844 20.02 3 16 3" stroke="none"/></svg>`
  const QUESTION_SVG = /*svg*/ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"></path></svg>`

  new HotBids()
})()
