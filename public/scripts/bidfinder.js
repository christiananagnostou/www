;(function () {
  class BidFinder {
    constructor() {
      this.regexPattern = /[1-9]\d*\s+bids?/g
      this.matches = []
      this.currentMatchIndex = -1
      this.autoScrollInterval = null
      this.init()
    }

    async init() {
      document.addEventListener('DOMContentLoaded', async () => {
        this.collectMatches()
        this.createInfoBox()
        this.scrollToNextMatch()
        document.addEventListener('keydown', this.handleKeyPress.bind(this))
      })
    }

    collectMatches() {
      const elements = document.querySelectorAll('.s-item__bids.s-item__bidCount, .str-item-card__property-bidCount')
      elements.forEach((element) => {
        const textContent = element.innerText || element.textContent
        const elementMatches = textContent.match(this.regexPattern)
        if (elementMatches !== null) {
          this.matches.push(element)
        }
      })
    }

    scrollToNextMatch() {
      if (this.matches.length === 0) return
      const nextIndex = (this.currentMatchIndex + 1) % this.matches.length
      this.currentMatchIndex = nextIndex
      this.highlightElement(this.matches[this.currentMatchIndex])
      this.matches[this.currentMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateInfoBox()
    }

    scrollToPreviousMatch() {
      if (this.matches.length === 0) return

      this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length
      this.highlightElement(this.matches[this.currentMatchIndex])
      this.matches[this.currentMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateInfoBox()
    }

    updateInfoBox() {
      if (!this.infoBox) return
      this.currentMatchBox.textContent = `${this.currentMatchIndex + 1}/${this.matches.length}`
    }

    highlightElement(element) {
      const highlightedElement = document.querySelector('.highlighted')
      if (highlightedElement) {
        highlightedElement.style.border = ''
        highlightedElement.classList.remove('highlighted')
      }
      element.style.border = '2px solid red'
      element.classList.add('highlighted')
    }

    createInfoBox() {
      const infoBoxHTML = `
              <div id="infoBox" style="position: fixed; bottom: 0.5rem; right: 0.5rem; padding: 1rem; border-radius: 8px; background-color: white; border: 1px solid gray;">
                  <span id="currentMatchBox">${this.currentMatchIndex + 1}/${this.matches.length}</span> Matches
                  <br>
                  <label for="autoScrollToggle">Auto Scroll</label>
                  <input type="checkbox" id="autoScrollToggle">
                  <input type="number" id="autoScrollInterval" value="5" placeholder="Interval" style="width: 50px;">
              </div>
          `
      document.body.insertAdjacentHTML('beforeend', infoBoxHTML)
      this.currentMatchBox = document.getElementById('currentMatchBox')
      this.infoBox = document.getElementById('infoBox')
      this.autoScrollToggle = document.getElementById('autoScrollToggle')
      this.autoScrollIntervalInput = document.getElementById('autoScrollInterval')

      this.autoScrollToggle.addEventListener('change', () => {
        if (this.autoScrollToggle.checked) {
          this.startAutoScroll()
        } else {
          this.stopAutoScroll()
        }
      })
    }

    startAutoScroll() {
      if (this.autoScrollInterval) return

      const interval = parseInt(this.autoScrollIntervalInput.value) * 1000
      this.autoScrollInterval = setInterval(() => {
        this.scrollToNextMatch()
      }, interval)
    }

    stopAutoScroll() {
      clearInterval(this.autoScrollInterval)
      this.autoScrollInterval = null
    }

    handleKeyPress(event) {
      if (event.key === 'n' && !event.shiftKey) {
        this.scrollToNextMatch()
      } else if (event.key === 'N' && event.shiftKey) {
        this.scrollToPreviousMatch()
      }
    }
  }

  new BidFinder()
})()
