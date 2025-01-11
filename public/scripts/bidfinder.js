;(function () {
  // Class/ID constants
  const ID_TOOLBAR = 'bidfinder-toolbar'
  const BTN = 'bidfinder-btn'
  // Menu
  const ID_MENU_BTN = 'menuBtn'
  const ID_MENU_CLOSE = 'menuPanelCloseBtn'
  const ID_MENU_PANEL = 'menuPanel'
  const ID_TOGGLE_SOLD = 'toggleSoldBtn'
  const POP_LEFT_BTN = 'popToLeft'
  const POP_RIGHT_BTN = 'popToRight'
  const POP_TOP_BTN = 'popToTop'
  const POP_BOTTOM_BTN = 'popToBottom'
  // Positioning classes
  const POP_LEFT = 'pop-left'
  const POP_RIGHT = 'pop-right'
  const POP_TOP = 'pop-top'
  const POP_BOTTOM = 'pop-bottom'
  // Navigation
  const ID_PREV = 'prevBtn'
  const ID_NEXT = 'nextBtn'
  const ID_RETRY = 'retryBtn'
  const ID_MATCH_BOX = 'currentMatchBox'
  // Help
  const ID_HELP_BTN = 'helpBtn'
  const ID_HELP_CLOSE = 'helpPanelCloseBtn'
  const ID_HELP_PANEL = 'helpPanel'
  // Dragging
  const ID_DRAG_BTN = 'dragBtn'

  class BidFinder {
    constructor() {
      this.regexPattern = /([1-9]\d*)\s+bids?/i
      this.matches = []
      this.currentMatchIndex = -1
      this.isDragging = false
      this.dragOffsetX = 0
      this.dragOffsetY = 0

      this.injectStyles()
      this.collectMatches()
      this.createToolbar()
      this.scrollToNextMatch()
      document.addEventListener('keydown', this.handleKeyPress.bind(this))
    }

    injectStyles() {
      if (!document.getElementById('bidfinder-styles')) {
        const styleEl = document.createElement('style')
        styleEl.id = 'bidfinder-styles'
        styleEl.textContent = STYLESHEET
        document.head.appendChild(styleEl)
      }
    }

    collectMatches() {
      const els = document.querySelectorAll('.s-item__bids.s-item__bidCount, .str-item-card__property-bidCount')
      this.matches = []
      els.forEach((el) => {
        const txt = el.innerText || el.textContent
        if (this.regexPattern.test(txt)) this.matches.push(el)
      })
    }

    createToolbar() {
      const html = `
        <div id="${ID_TOOLBAR}" class="${POP_BOTTOM}">
          <div class="bidfinder-row left-row">
            <button id="${ID_MENU_BTN}" class="${BTN}">${THREE_DOTS_SVG}</button>
            <span id="${ID_MATCH_BOX}">${this.currentMatchIndex + 1}/${this.matches.length}</span>
          </div>

          <div class="bidfinder-row center-row">
            <button id="${ID_PREV}" class="${BTN}" aria-label="Previous bid">${LEFT_ARROW_SVG}</button>
            <button id="${ID_NEXT}" class="${BTN}" aria-label="Next bid">${RIGHT_ARROW_SVG}</button>
            <div class="vertical-separator"></div>
            <button id="${ID_RETRY}" class="${BTN}">${RETRY_ARROW_SVG}</button>
          </div>

          <div class="bidfinder-row right-row">
            <button id="${ID_HELP_BTN}" class="${BTN}">${QUESTION_SVG}</button>
            <button id="${ID_DRAG_BTN}" class="${BTN}">${DRAG_ARROWS_SVG}</button>
          </div> 
        </div>

        <div id="${ID_MENU_PANEL}" class="bidfinder-modal" aria-hidden="true">
          <button class="${BTN}" id="${ID_MENU_CLOSE}">${CLOSE_SVG}</button>
          <span><strong>Toolbar Position</strong></span><hr />
          <div class="pop-to-grid">
            <button class="${BTN}" id="${POP_LEFT_BTN}">◀</button>
            <button class="${BTN}" id="${POP_RIGHT_BTN}">▶</button>
            <button class="${BTN}" id="${POP_TOP_BTN}">▲</button>
            <button class="${BTN}" id="${POP_BOTTOM_BTN}">▼</button>
          </div>
          <span><strong>Tools</strong></span><hr />
          <button class="${BTN}" id="${ID_TOGGLE_SOLD}">Toggle Sold</button>
        </div>

        <div id="${ID_HELP_PANEL}" class="bidfinder-modal" aria-hidden="true">
          <button id=${ID_HELP_CLOSE} class="${BTN}">${CLOSE_SVG}</button>
          <span><strong>BidFinder Help</strong></span><hr />
          <p><strong>Keyboard Shortcuts:</strong><br/>n — Next Bid<br/>Shift+n — Previous Bid</p>
          <p><strong>Navigation:</strong><br/>Use arrows or Refresh.</p>
          <p><strong>Menu:</strong><br/>Hamburger for location or sold toggle.</p>
          <p><strong>Drag:</strong><br/>Hold fingerprint icon to move bar.</p>
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
      this.dragBtn = document.getElementById(ID_DRAG_BTN)
      // Menu panel elements
      this.menuPanel = document.getElementById(ID_MENU_PANEL)
      this.popLeftBtn = document.getElementById(POP_LEFT_BTN)
      this.popRightBtn = document.getElementById(POP_RIGHT_BTN)
      this.popTopBtn = document.getElementById(POP_TOP_BTN)
      this.popBottomBtn = document.getElementById(POP_BOTTOM_BTN)
      this.toggleSoldBtn = document.getElementById(ID_TOGGLE_SOLD)
      this.menuPanelCloseBtn = document.getElementById(ID_MENU_CLOSE)
      // Help panel elements
      this.helpPanel = document.getElementById(ID_HELP_PANEL)
      this.helpPanelCloseBtn = document.getElementById(ID_HELP_CLOSE)

      // Toolbar event listeners
      this.menuBtn.onclick = () => this.toggleModal(this.menuPanel)
      this.prevBtn.onclick = () => this.scrollToPreviousMatch()
      this.nextBtn.onclick = () => this.scrollToNextMatch()
      this.retryBtn.onclick = () => this.retryMatches()
      this.helpBtn.onclick = () => this.toggleModal(this.helpPanel)
      // Menu panel event listeners
      this.popLeftBtn.onclick = () => this.setLocationClass(POP_LEFT)
      this.popRightBtn.onclick = () => this.setLocationClass(POP_RIGHT)
      this.popTopBtn.onclick = () => this.setLocationClass(POP_TOP)
      this.popBottomBtn.onclick = () => this.setLocationClass(POP_BOTTOM)
      this.toggleSoldBtn.onclick = () => this.toggleSold()
      this.menuPanelCloseBtn.onclick = () => this.toggleModal(this.menuPanel)
      // Help panel event listeners
      this.helpPanelCloseBtn.onclick = () => this.toggleModal(this.helpPanel)

      // Dragging event listeners
      this.dragBtn.onmousedown = (e) => this.startDrag(e)
      document.onmousemove = (e) => this.onDrag(e)
      document.onmouseup = () => this.endDrag()

      if (!this.checkSoldCheckbox()) {
        this.toggleSoldBtn.disabled = true
        this.toggleSoldBtn.title = 'Sold checkbox not found'
      }
    }

    toggleModal(el) {
      if (!el) return
      const hidden = el.getAttribute('aria-hidden') === 'false'
      el.setAttribute('aria-hidden', hidden ? 'true' : 'false')
    }

    setLocationClass(cls) {
      this.toolbar.classList.remove(POP_LEFT, POP_RIGHT, POP_TOP, POP_BOTTOM)
      this.toolbar.removeAttribute('style') // reset inline styles from dragging
      this.toolbar.id = ID_TOOLBAR
      this.toolbar.style.position = 'fixed'
      this.toolbar.style.zIndex = 999999
      this.toolbar.style.maxHeight = 'min-content'
      this.toolbar.classList.add(cls)
    }

    startDrag(e) {
      if (e.target.id === ID_DRAG_BTN || e.target.closest('#' + ID_DRAG_BTN)) {
        this.isDragging = true
        this.toolbar.classList.remove(POP_LEFT, POP_RIGHT, POP_TOP, POP_BOTTOM)
        const rect = this.toolbar.getBoundingClientRect()
        this.dragOffsetX = e.clientX - rect.left
        this.dragOffsetY = e.clientY - rect.top
      }
    }
    onDrag(e) {
      if (!this.isDragging) return
      e.preventDefault()
      const x = e.clientX - this.dragOffsetX + this.toolbar.offsetWidth
      const y = e.clientY - this.dragOffsetY + this.toolbar.offsetHeight
      this.toolbar.style.transform = ''
      this.toolbar.style.left = x + 'px'
      this.toolbar.style.top = y + 'px'
      this.toolbar.style.right = ''
      this.toolbar.style.bottom = ''
      this.toolbar.style.width = 'auto'
      this.toolbar.style.maxWidth = 'none'
      this.toolbar.style.borderRadius = '6px'
    }
    endDrag() {
      this.isDragging = false
    }

    checkSoldCheckbox() {
      return document.querySelector('[name="LH_Sold"]')
    }
    toggleSold() {
      const link = document.querySelector('[name="LH_Sold"] a.cbx')
      if (link) link.click()
    }

    scrollToNextMatch() {
      if (!this.matches.length) return
      this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length
      this.highlightElement(this.matches[this.currentMatchIndex])
      this.matches[this.currentMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateToolbar()
    }
    scrollToPreviousMatch() {
      if (!this.matches.length) return
      this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length
      this.highlightElement(this.matches[this.currentMatchIndex])
      this.matches[this.currentMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateToolbar()
    }

    retryMatches() {
      this.currentMatchIndex = -1
      this.collectMatches()
      this.scrollToNextMatch()
    }

    updateToolbar() {
      if (this.currentMatch) {
        this.currentMatch.textContent = this.currentMatchIndex + 1 + '/' + this.matches.length
      }
    }

    highlightElement(el) {
      const old = document.querySelector('.bidfinder-highlighted')
      if (old) old.classList.remove('bidfinder-highlighted')
      el.classList.add('bidfinder-highlighted')
    }

    handleKeyPress(e) {
      if ((e.key === 'n' && !e.shiftKey) || e.key === 'ArrowRight') {
        this.scrollToNextMatch()
      } else if ((e.key === 'N' && e.shiftKey) || e.key === 'ArrowLeft') {
        this.scrollToPreviousMatch()
      }
    }
  }

  const STYLESHEET = `
    :root {
      --toolbar-bg: #111;
      --toolbar-fg: #eee;
      --toolbar-border: #333;
      --button-bg: #222;
      --button-bg-hover: #333;
      --highlight-color: #00ff00;
      --toolbar-width: 600px;
    }

    #${ID_TOOLBAR} {
      position: fixed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: var(--toolbar-width);
      padding: 0.5rem;
      background-color: var(--toolbar-bg);
      color: var(--toolbar-fg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      font-size: 1rem;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.5);
      z-index: 999999;
      flex-direction: var(--flex-direction, row);
    }

    .${POP_LEFT} {
      --flex-direction: column;
      top: 50% !important; left: 0 !important; right: auto !important;
      transform: translateY(-50%) !important;
      width: auto !important; max-width: none !important;
      height: 100% !important; max-height: var(--toolbar-width) !important;
      border-radius: 0 6px 6px 0 !important;
    }
    .${POP_RIGHT} {
      --flex-direction: column;
      top: 50% !important; right: 0 !important; left: auto !important;
      transform: translateY(-50%) !important;
      width: auto !important; max-width: none !important;
      height: 100% !important; max-height: var(--toolbar-width) !important;
      border-radius: 6px 0 0 6px !important;
    }
    .${POP_TOP} {
      --flex-direction: row;
      top: 0 !important; bottom: auto !important; left: 50% !important;
      transform: translateX(-50%) !important;
      width: 100% !important; max-width: var(--toolbar-width) !important;
      border-radius: 0 0 6px 6px !important;
    }
    .${POP_BOTTOM} {
      --flex-direction: row;
      bottom: 0 !important; top: auto !important; left: 50% !important;
      transform: translateX(-50%) !important;
      width: 100% !important; max-width: var(--toolbar-width) !important;
      border-radius: 6px 6px 0 0 !important;
    }

    .bidfinder-row { 
      display: flex;
      flex-direction: var(--flex-direction, row);
      align-items: center;
      gap: 0.5rem; 
    }
    .left-row   { flex: 1; justify-content: flex-start; }
    .center-row { flex: 1; justify-content: center; position: relative; }
    .right-row  { flex: 1; justify-content: flex-end; position: relative; }

    .bidfinder-modal {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: var(--toolbar-bg); 
      border: 1px solid var(--toolbar-border);
      color: var(--toolbar-fg);
      font-size: 0.85rem;
      width: 320px;
      padding: 0.75rem;
      border-radius: 8px;
      box-shadow: 0 0 16px rgba(0,0,0,0.4);
      z-index: 1000000;
      display: none;
    }
    .bidfinder-modal[aria-hidden="false"] {
      display: block;
    }

    .bidfinder-modal .${BTN}:not(#${ID_MENU_CLOSE}):not(#${ID_HELP_CLOSE}) {
      width: 100%;
    }

    .bidfinder-modal hr {
      border: none;
      border-top: 1px solid var(--toolbar-border);
    }

    .bidfinder-modal .pop-to-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: auto auto auto;
      gap: 0.5rem;
      grid-template-areas:
        ". . top top . ."
        ". left left right right ."
        ". . bottom bottom . .";
      }
    #${POP_LEFT_BTN} { grid-area: left; }
    #${POP_RIGHT_BTN} { grid-area: right; }
    #${POP_TOP_BTN} { grid-area: top; }
    #${POP_BOTTOM_BTN} { grid-area: bottom; }



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
      color: var(--toolbar-fg);
      cursor: pointer;
    }

    /* Vertical separator in center row */
    .vertical-separator {
      width: 1px; background: var(--toolbar-border);
      height: 1.6rem; margin: 0 0.5rem;
    }

    button.${BTN} {
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 4px; border: none;
      background: var(--button-bg); color: var(--toolbar-fg);
      transition: background 0.2s ease, opacity 0.2s ease;
      display: flex; align-items: center; justify-content: center;
    }
    button.${BTN}:hover,
    button.${BTN}:focus {
      background: var(--button-bg-hover);
      outline: none;
    }
    button.${BTN} svg { height: 1em; width: 1em; }

    #${ID_DRAG_BTN} { cursor: grab; }
    #${ID_DRAG_BTN}:active { cursor: grabbing; }

    .bidfinder-highlighted {
      outline: 2px solid var(--highlight-color) !important;
      outline-offset: 1px;
    }
  `

  const CLOSE_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>`
  const THREE_DOTS_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 14a2 2 0 1 1-.001-3.999A2 2 0 0 1 20 14ZM6 12a2 2 0 1 1-3.999.001A2 2 0 0 1 6 12Zm8 0a2 2 0 1 1-3.999.001A2 2 0 0 1 14 12Z"/></svg>`
  const LEFT_ARROW_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>`
  const RIGHT_ARROW_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>`
  const RETRY_ARROW_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32"><path d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13 13-5.832 13-13h-2c0 6.086-4.914 11-11 11S5 22.086 5 16 9.914 5 16 5c3.875 0 7.262 1.984 9.219 5H20v2h8V4h-2v3.719C23.617 4.844 20.02 3 16 3" stroke="none"/></svg>`
  const DRAG_ARROWS_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m12 22-4-4h8zm0-20 4 4H8zm0 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4M2 12l4-4v8zm20 0-4 4V8z" stroke="none"/></svg>`
  const QUESTION_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"></path></svg>`

  new BidFinder()
})()
