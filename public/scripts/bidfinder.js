;(function () {
  class BidFinder {
    constructor() {
      this.regexPattern = /([1-9]\d*)\s+bids?/i
      this.matches = []
      this.currentMatchIndex = -1

      this.injectStyles()
      this.collectMatches()
      this.createToolbar()
      this.scrollToNextMatch()

      document.addEventListener('keydown', this.handleKeyPress.bind(this))
    }

    /* -------------------------------------
       Inject global CSS for the toolbar
    ------------------------------------- */
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
          }

          #bidfinder-toolbar {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 600px;
            padding: 0.5rem 1rem;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background-color: var(--toolbar-bg);
            color: var(--toolbar-fg);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.5);
            z-index: 999999;
          }

          /* Common row styling */
          .bidfinder-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
          }

          .bidfinder-row.left {
            justify-content: flex-start;
          }

          .bidfinder-row.center {
            justify-content: center;
            position: relative;
          }
          .bidfinder-row.center .vertical-separator {
            width: 1px;
            background: var(--toolbar-border);
            height: 1.6rem;
            margin: 0 0.5rem;
          }

          .bidfinder-row.right {
            justify-content: flex-end;
            position: relative; /* so help panel can absolutely position */
          }

          /* Counter */
          #currentMatchBox {
            font-weight: 600;
          }

          /* Buttons */
          button.bidfinder-btn {
            cursor: pointer;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            border: none;
            background: var(--button-bg);
            color: var(--toolbar-fg);
            transition: background 0.2s ease, opacity 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          button.bidfinder-btn:hover,
          button.bidfinder-btn:focus {
            background: var(--button-bg-hover);
            outline: none;
          }
          button.bidfinder-btn svg {
            height: 1em;
            width: 1em;
          }

          /* Help panel (pop-down) */
          #helpPanel {
            display: none;
            position: absolute;
            bottom: 2.7rem; /* place above the toolbar */
            right: 0;
            background: var(--button-bg);
            border-radius: 4px;
            border: 1px solid var(--toolbar-border);
            color: var(--toolbar-fg);
            font-size: 0.85rem;
            width: 240px;
            padding: 0.75rem;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
          }
          #helpPanel p {
            margin: 0 0 0.5rem;
            line-height: 1.4;
          }

          /* Highlighted element */
          .bidfinder-highlighted {
            outline: 2px solid var(--highlight-color) !important;
            outline-offset: -2px;
          }
        `
        document.head.appendChild(styleEl)
      }
    }

    collectMatches() {
      const elements = document.querySelectorAll('.s-item__bids.s-item__bidCount, .str-item-card__property-bidCount')
      this.matches = [] // clear old matches
      elements.forEach((element) => {
        const textContent = element.innerText || element.textContent
        if (this.regexPattern.test(textContent)) {
          this.matches.push(element)
        }
      })
    }

    createToolbar() {
      const toolbarHTML = `
        <div id="bidfinder-toolbar">
          <!-- Left row: match counter -->
          <div class="bidfinder-row left">
            <span id="currentMatchBox">${this.currentMatchIndex + 1}/${this.matches.length}</span>
          </div>

          <!-- Middle row: nav buttons with vertical separator before Retry -->
          <div class="bidfinder-row center">
            <!-- Previous button -->
            <button id="prevBtn" class="bidfinder-btn" aria-label="Previous bid">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512">
                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                  d="M328 112L184 256l144 144"
                />
              </svg>
            </button>

            <!-- Next button -->
            <button id="nextBtn" class="bidfinder-btn" aria-label="Next bid">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512">
                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                  d="M184 112l144 144-144 144"
                />
              </svg>
            </button>

            <div class="vertical-separator"></div>

            <!-- Retry button -->
            <button id="retryBtn" class="bidfinder-btn" aria-label="Refresh matches">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32">
                <path d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13 13-5.832 13-13h-2c0 6.086-4.914 11-11 11S5 22.086 5 16 9.914 5 16 5c3.875 0 7.262 1.984 9.219 5H20v2h8V4h-2v3.719C23.617 4.844 20.02 3 16 3" stroke="none"/>
              </svg>
            </button>
          </div>

          <!-- Right row: help button + help panel -->
          <div class="bidfinder-row right">
            <button id="helpBtn" class="bidfinder-btn" aria-label="Show help">?</button>
            <div id="helpPanel" aria-hidden="true">
              <p><strong>BidFinder Help</strong></p>
              <p><strong>Keyboard Shortcuts:</strong><br/>
              <em>n</em> — Next Bid<br/>
              <em>Shift+n</em> — Previous Bid</p>
              <p><strong>Navigation Buttons:</strong><br/>
              Use the left/right arrows.</p>
              <p><strong>Refresh:</strong><br/>
              Click the retry icon if new items appear.</p>
            </div>
          </div>
        </div>
      `
      document.body.insertAdjacentHTML('beforeend', toolbarHTML)

      // Grab references
      this.toolbar = document.getElementById('bidfinder-toolbar')
      this.currentMatchBox = document.getElementById('currentMatchBox')
      this.prevBtn = document.getElementById('prevBtn')
      this.nextBtn = document.getElementById('nextBtn')
      this.retryBtn = document.getElementById('retryBtn')
      this.helpBtn = document.getElementById('helpBtn')
      this.helpPanel = document.getElementById('helpPanel')

      // Event listeners
      this.prevBtn.addEventListener('click', this.scrollToPreviousMatch.bind(this))
      this.nextBtn.addEventListener('click', this.scrollToNextMatch.bind(this))
      this.retryBtn.addEventListener('click', this.retryMatches.bind(this))
      this.helpBtn.addEventListener('click', this.toggleHelpPanel.bind(this))
    }

    toggleHelpPanel() {
      if (!this.helpPanel) return
      const isHidden = this.helpPanel.style.display === 'block'
      this.helpPanel.style.display = isHidden ? 'none' : 'block'
      this.helpPanel.setAttribute('aria-hidden', isHidden ? 'true' : 'false')
    }

    scrollToNextMatch() {
      if (!this.matches.length) return
      this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length
      this.highlightElement(this.matches[this.currentMatchIndex])
      this.matches[this.currentMatchIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      this.updateToolbar()
    }

    scrollToPreviousMatch() {
      if (!this.matches.length) return
      this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length
      this.highlightElement(this.matches[this.currentMatchIndex])
      this.matches[this.currentMatchIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      this.updateToolbar()
    }

    retryMatches() {
      this.currentMatchIndex = -1
      this.collectMatches()
      this.scrollToNextMatch()
    }

    updateToolbar() {
      if (this.currentMatchBox) {
        this.currentMatchBox.textContent = `${this.currentMatchIndex + 1}/${this.matches.length}`
      }
    }

    highlightElement(element) {
      // Remove highlight from any previously highlighted element
      const prev = document.querySelector('.bidfinder-highlighted')
      if (prev) {
        prev.classList.remove('bidfinder-highlighted')
        prev.style.outline = ''
        prev.style.outlineOffset = ''
      }

      // Add highlight to the current element
      element.classList.add('bidfinder-highlighted')
      element.style.outline = `2px solid var(--highlight-color)`
      element.style.outlineOffset = '-2px'
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
