;(function () {
  // Class/ID constants for easy maintenance
  const ID_TOOLBAR = 'bidfinder-toolbar'
  const ID_MENU_PANEL = 'menuPanel'
  const ID_HELP_PANEL = 'helpPanel'
  const ID_DRAG_BTN = 'dragBtn'
  const ID_HAMBURGER = 'hamburgerBtn'
  const ID_TOGGLE_SOLD = 'toggleSoldBtn'
  const POP_LEFT = 'pop-left'
  const POP_RIGHT = 'pop-right'
  const POP_TOP = 'pop-top'
  const POP_BOTTOM = 'pop-bottom'

  const ID_PREV = 'prevBtn'
  const ID_NEXT = 'nextBtn'
  const ID_RETRY = 'retryBtn'
  const ID_HELP_BTN = 'helpBtn'
  const ID_MATCH_BOX = 'currentMatchBox'

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
        styleEl.textContent = `
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
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: var(--toolbar-width);
            padding: 0.5rem 1rem;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background-color: var(--toolbar-bg);
            color: var(--toolbar-fg);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.5);
            z-index: 999999;
            max-height: min-content;
            flex-direction: var(--flex-direction, row);
          }

          /* Pop-to classes for edges */
          .${POP_LEFT} {
            top: 50% !important; left: 0 !important; right: auto !important;
            transform: translateY(-50%) !important;
            width: auto !important; max-width: none !important;
            height: 100% !important; max-height: var(--toolbar-width) !important;
            border-top-right-radius: 6px !important;
            border-bottom-right-radius: 6px !important;

            --flex-direction: column;
          }
          .${POP_RIGHT} {
            top: 50% !important; right: 0 !important; left: auto !important;
            transform: translateY(-50%) !important;
            width: auto !important; max-width: none !important;
            height: 100% !important; max-height: var(--toolbar-width) !important;
            border-top-left-radius: 6px !important;
            border-bottom-left-radius: 6px !important;

            --flex-direction: column;
          }
          .${POP_TOP} {
            top: 0 !important; bottom: auto !important; left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100% !important; max-width: var(--toolbar-width) !important;
            border-bottom-left-radius: 6px !important;
            border-bottom-right-radius: 6px !important;

            --flex-direction: row;
          }
          .${POP_BOTTOM} {
            bottom: 0 !important; top: auto !important; left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100% !important; max-width: var(--toolbar-width) !important;
            border-top-left-radius: 6px !important;
            border-top-right-radius: 6px !important;

            --flex-direction: row;
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

          /* Modal-style for menu & help (center screen) */
          .bidfinder-modal {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: var(--button-bg);
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

          /* For the hamburger menu panel & help panel we reuse .bidfinder-modal */
          #${ID_MENU_PANEL}, #${ID_HELP_PANEL} { }

          /* Vertical separator in center row */
          .vertical-separator {
            width: 1px; background: var(--toolbar-border);
            height: 1.6rem; margin: 0 0.5rem;
          }

          button.bidfinder-btn {
            cursor: pointer;
            padding: 0.3rem 0.6rem;
            border-radius: 4px; border: none;
            background: var(--button-bg); color: var(--toolbar-fg);
            transition: background 0.2s ease, opacity 0.2s ease;
            display: flex; align-items: center; justify-content: center;
          }
          button.bidfinder-btn:hover,
          button.bidfinder-btn:focus {
            background: var(--button-bg-hover);
            outline: none;
          }
          button.bidfinder-btn svg { height: 1em; width: 1em; }

          #${ID_DRAG_BTN} { cursor: grab; }
          #${ID_DRAG_BTN}:active { cursor: grabbing; }

          .bidfinder-highlighted {
            outline: 2px solid var(--highlight-color) !important;
            outline-offset: -2px;
          }
        `
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
        <div id="${ID_TOOLBAR}">
          <div class="bidfinder-row left-row">
            <button id="${ID_HAMBURGER}" class="bidfinder-btn">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 14a2 2 0 1 1-.001-3.999A2 2 0 0 1 20 14ZM6 12a2 2 0 1 1-3.999.001A2 2 0 0 1 6 12Zm8 0a2 2 0 1 1-3.999.001A2 2 0 0 1 14 12Z"/>
              </svg>
            </button>
            <div id="${ID_MENU_PANEL}" class="bidfinder-modal" aria-hidden="true">
              <button id="popToLeft">◀ Left Side</button>
              <button id="popToRight">Right Side ▶</button>
              <button id="popToTop">▲ Top</button>
              <button id="popToBottom">Bottom ▼</button>
              <button id="${ID_TOGGLE_SOLD}">Toggle Sold</button>
            </div>

            <span id="${ID_MATCH_BOX}">${this.currentMatchIndex + 1}/${this.matches.length}</span>
          </div>

          <div class="bidfinder-row center-row">
            <button id="${ID_PREV}" class="bidfinder-btn" aria-label="Previous bid">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512">
                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                  d="M328 112L184 256l144 144"
                />
              </svg>
            </button>
            <button id="${ID_NEXT}" class="bidfinder-btn" aria-label="Next bid">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512">
                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                  d="M184 112l144 144-144 144"
                />
              </svg>
            </button>
            <div class="vertical-separator"></div>
            <button id="${ID_RETRY}" class="bidfinder-btn">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32">
                <path d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13 13-5.832 13-13h-2c0 6.086-4.914 11-11 11S5 22.086 5 16 9.914 5 16 5c3.875 0 7.262 1.984 9.219 5H20v2h8V4h-2v3.719C23.617 4.844 20.02 3 16 3" stroke="none"/>
              </svg>
            </button>
          </div>

          <div class="bidfinder-row right-row">
            <button id="${ID_HELP_BTN}" class="bidfinder-btn">?</button>
            <div id="${ID_HELP_PANEL}" class="bidfinder-modal" aria-hidden="true">
              <p><strong>BidFinder Help</strong></p>
              <p><strong>Keyboard Shortcuts:</strong><br/>
              n — Next Bid<br/>Shift+n — Previous Bid</p>
              <p><strong>Navigation:</strong><br/>Use arrows or Refresh.</p>
              <p><strong>Menu:</strong><br/>Hamburger for location or sold toggle.</p>
              <p><strong>Drag:</strong><br/>Hold fingerprint icon to move bar.</p>
            </div>

            <button id="${ID_DRAG_BTN}" class="bidfinder-btn">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m12 22-4-4h8zm0-20 4 4H8zm0 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4M2 12l4-4v8zm20 0-4 4V8z" stroke="none"/></svg>
            </button>
          </div>
        </div>
      `
      document.body.insertAdjacentHTML('beforeend', html)
      this.toolbar = document.getElementById(ID_TOOLBAR)
      this.currentMatch = document.getElementById(ID_MATCH_BOX)
      this.prevBtn = document.getElementById(ID_PREV)
      this.nextBtn = document.getElementById(ID_NEXT)
      this.retryBtn = document.getElementById(ID_RETRY)
      this.helpBtn = document.getElementById(ID_HELP_BTN)
      this.helpPanel = document.getElementById(ID_HELP_PANEL)
      this.dragBtn = document.getElementById(ID_DRAG_BTN)
      this.hamburgerBtn = document.getElementById(ID_HAMBURGER)
      this.menuPanel = document.getElementById(ID_MENU_PANEL)

      this.popLeftBtn = document.getElementById('popToLeft')
      this.popRightBtn = document.getElementById('popToRight')
      this.popTopBtn = document.getElementById('popToTop')
      this.popBottomBtn = document.getElementById('popToBottom')
      this.toggleSoldBtn = document.getElementById(ID_TOGGLE_SOLD)

      this.prevBtn.onclick = () => this.scrollToPreviousMatch()
      this.nextBtn.onclick = () => this.scrollToNextMatch()
      this.retryBtn.onclick = () => this.retryMatches()
      this.helpBtn.onclick = () => this.toggleModal(this.helpPanel)
      this.hamburgerBtn.onclick = () => this.toggleModal(this.menuPanel)

      this.popLeftBtn.onclick = () => this.setLocationClass(POP_LEFT)
      this.popRightBtn.onclick = () => this.setLocationClass(POP_RIGHT)
      this.popTopBtn.onclick = () => this.setLocationClass(POP_TOP)
      this.popBottomBtn.onclick = () => this.setLocationClass(POP_BOTTOM)
      this.toggleSoldBtn.onclick = () => this.toggleSold()

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
      this.toolbar.removeAttribute('style') // reset inline styles
      this.toolbar.id = ID_TOOLBAR
      this.toolbar.style.position = 'fixed'
      this.toolbar.style.zIndex = 999999
      this.toolbar.style.maxHeight = 'min-content'
      this.toolbar.classList.add(cls)
      this.toggleModal(this.menuPanel)
    }

    startDrag(e) {
      if (e.target.id === ID_DRAG_BTN || e.target.closest('#' + ID_DRAG_BTN)) {
        this.isDragging = true
        this.toolbar.classList.remove(POP_LEFT, POP_RIGHT, POP_TOP, POP_BOTTOM)
        this.toolbar.style.maxHeight = 'min-content'
        const rect = this.toolbar.getBoundingClientRect()
        this.dragOffsetX = e.clientX - rect.left
        this.dragOffsetY = e.clientY - rect.top
      }
    }
    onDrag(e) {
      if (!this.isDragging) return
      e.preventDefault()
      const x = e.clientX - this.dragOffsetX
      const y = e.clientY - this.dragOffsetY
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
      if (old) {
        old.classList.remove('bidfinder-highlighted')
        old.style.outline = ''
        old.style.outlineOffset = ''
      }
      el.classList.add('bidfinder-highlighted')
      el.style.outline = '2px solid var(--highlight-color)'
      el.style.outlineOffset = '-2px'
    }

    handleKeyPress(e) {
      if (e.key === 'n' && !e.shiftKey) {
        this.scrollToNextMatch()
      } else if (e.key === 'N' && e.shiftKey) {
        this.scrollToPreviousMatch()
      }
    }
  }
  new BidFinder()
})()
