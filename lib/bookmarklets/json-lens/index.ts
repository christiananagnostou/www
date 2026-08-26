const JSON_LENS_SOURCE = String.raw`(function () {
  'use strict'

  if (window.JSONLens) {
    window.JSONLens()
    return
  }

  var ROOT_ID = 'json-lens-root'
  var STYLE_ID = 'json-lens-styles'
  var sourceText = ''
  var sourceData
  var keyHandler
  var styleSheet

  function create(tag, className, text) {
    var element = document.createElement(tag)
    if (className) element.className = className
    if (text !== undefined) element.textContent = String(text)
    return element
  }

  function humanize(key) {
    return String(key)
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/^./, function (letter) {
        return letter.toUpperCase()
      })
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  function isIsoDate(value) {
    return (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(value)
    )
  }

  function formatDate(value) {
    var date = new Date(value.length === 10 ? value + 'T00:00:00' : value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: value.length === 10 ? undefined : 'short',
    }).format(date)
  }

  function valueType(value) {
    if (value === null) return 'null'
    if (isIsoDate(value)) return 'date'
    return typeof value
  }

  function renderPrimitive(key, value) {
    var row = create('dl', 'jl-field')
    var label = create('dt', 'jl-key', humanize(key))
    label.title = key
    var output = create('dd', 'jl-value jl-' + valueType(value))

    if (typeof value === 'boolean') {
      output.appendChild(create('span', 'jl-bool-dot ' + (value ? 'jl-bool-true' : 'jl-bool-false')))
      output.appendChild(document.createTextNode(value ? 'Yes' : 'No'))
    } else if (value === null) {
      output.textContent = 'Null'
    } else if (isIsoDate(value)) {
      output.appendChild(create('span', 'jl-date-friendly', formatDate(value)))
      output.appendChild(create('span', 'jl-date-source', value))
    } else {
      output.textContent = String(value)
    }

    row.appendChild(label)
    row.appendChild(output)
    return row
  }

  function summaryFor(value) {
    if (Array.isArray(value)) return value.length + (value.length === 1 ? ' item' : ' items')
    if (isObject(value)) {
      var count = Object.keys(value).length
      return count + (count === 1 ? ' field' : ' fields')
    }
    return ''
  }

  function renderGroup(key, value) {
    var details = create('details', 'jl-group ' + (Array.isArray(value) ? 'jl-group-array' : 'jl-group-object'))
    var summary = create('summary', 'jl-group-summary')
    var marker = create('span', 'jl-chevron', '›')
    var token = create('span', 'jl-token', Array.isArray(value) ? '[' : '{')
    var heading = create('span', 'jl-group-name', humanize(key))
    var count = create('span', 'jl-count', summaryFor(value))
    summary.appendChild(marker)
    summary.appendChild(token)
    summary.appendChild(heading)
    summary.appendChild(count)
    details.appendChild(summary)

    var content = create('div', 'jl-group-content')
    if (Array.isArray(value)) {
      content.appendChild(renderArray(value))
    } else {
      content.appendChild(renderObject(value))
    }
    details.appendChild(content)
    return details
  }

  function renderObject(object) {
    var container = create('div', 'jl-object')
    var ledger = create('div', 'jl-ledger')

    Object.keys(object).forEach(function (key) {
      var value = object[key]
      if (Array.isArray(value) || isObject(value)) {
        ledger.appendChild(renderGroup(key, value))
      } else {
        ledger.appendChild(renderPrimitive(key, value))
      }
    })

    if (ledger.childNodes.length) container.appendChild(ledger)
    else container.appendChild(create('p', 'jl-empty', 'Empty object'))
    return container
  }

  function renderArray(array) {
    var list = create('div', 'jl-array')
    if (!array.length) {
      list.appendChild(create('p', 'jl-empty', 'No items'))
      return list
    }

    array.forEach(function (item, index) {
      var card = create('article', 'jl-array-item')
      card.appendChild(create('div', 'jl-item-number', String(index + 1).padStart(2, '0')))
      var body = create('div', 'jl-item-body')
      if (isObject(item)) body.appendChild(renderObject(item))
      else if (Array.isArray(item)) body.appendChild(renderArray(item))
      else body.appendChild(renderPrimitive('Value', item))
      card.appendChild(body)
      list.appendChild(card)
    })
    return list
  }

  function findPrimaryRecord(data) {
    if (!isObject(data)) return data
    var keys = Object.keys(data)
    if (keys.length === 1 && (isObject(data[keys[0]]) || Array.isArray(data[keys[0]]))) return data[keys[0]]
    return data
  }

  function countNodes(value) {
    var counts = { fields: 0, groups: 0 }
    function walk(item) {
      if (Array.isArray(item)) {
        counts.groups += 1
        item.forEach(walk)
      } else if (isObject(item)) {
        counts.groups += 1
        Object.keys(item).forEach(function (key) {
          var child = item[key]
          if (child !== null && typeof child === 'object') walk(child)
          else counts.fields += 1
        })
      } else {
        counts.fields += 1
      }
    }
    walk(value)
    return counts
  }

  function injectStyles() {
    if (styleSheet || document.getElementById(STYLE_ID)) return
    var css = [
      ':root{color-scheme:light;--jl-ink:#1e2625;--jl-muted:#5b6663;--jl-line:#dce2df;--jl-paper:#f4f6f5;--jl-white:#ffffff;--jl-accent:#6254d8;--jl-accent-soft:#e7e4fb;--jl-amber:#b75d16;--jl-green:#168258;--jl-red:#c34455}',
      '*{box-sizing:border-box}',
      'html,body{min-height:100%;margin:0;background:var(--jl-paper)!important;color:var(--jl-ink)!important}',
      'body{font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;line-height:1.45}',
      '#' + ROOT_ID + '{min-height:100vh}',
      '.jl-shell{width:min(1080px,calc(100% - 32px));margin:0 auto;padding:20px 0 64px}',
      '.jl-header{position:sticky;top:10px;z-index:10;display:flex;align-items:center;gap:12px;padding:10px;border:1px solid var(--jl-line);border-radius:12px;background:rgba(255,255,255,.96);box-shadow:0 8px 24px rgba(30,38,37,.07);backdrop-filter:blur(12px)}',
      '.jl-brand{display:grid;grid-template-columns:30px minmax(0,auto);grid-template-rows:auto auto;align-items:center;min-width:180px}',
      '.jl-logo{display:grid;grid-row:1/3;width:30px;height:30px;margin-right:9px;border:1px solid var(--jl-accent-soft);border-radius:7px;background:#f7f6ff;color:var(--jl-accent);font:700 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;place-items:center}',
      '.jl-title{overflow:hidden;margin:0;color:var(--jl-ink);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}',
      '.jl-subtitle{overflow:hidden;margin:2px 0 0;color:var(--jl-muted);font:10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;text-overflow:ellipsis;white-space:nowrap}',
      '.jl-search-wrap{position:relative;flex:1}',
      '.jl-search{width:100%;padding:8px 34px 8px 10px;border:1px solid transparent;border-radius:7px;background:var(--jl-paper);color:var(--jl-ink);font:13px/1.2 inherit;outline:none}',
      '.jl-search:focus{border-color:var(--jl-accent);background:var(--jl-white);box-shadow:0 0 0 3px var(--jl-accent-soft)}',
      '.jl-shortcut{position:absolute;top:50%;right:9px;color:var(--jl-muted);font:10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;transform:translateY(-50%);pointer-events:none}',
      '.jl-actions{display:flex;gap:5px;margin-left:auto}',
      '.jl-button{min-height:32px;padding:7px 9px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--jl-muted);font:650 11px/1.2 inherit;cursor:pointer}',
      '.jl-button:hover,.jl-button:focus-visible{outline:none;background:var(--jl-paper);color:var(--jl-ink)}',
      '.jl-button:disabled{opacity:.45;cursor:default}',
      '.jl-button[aria-pressed="true"]{background:#f0eefc;color:var(--jl-accent)}',
      '.jl-meta{display:flex;align-items:center;gap:0;padding:12px 4px 10px;color:var(--jl-muted);font:10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-pill+.jl-pill::before{content:"·";padding:0 7px;color:#a9b1af}',
      '.jl-search-status{margin-left:auto}',
      '.jl-document{overflow:hidden;border:1px solid var(--jl-line);border-radius:12px;background:var(--jl-white)}',
      '.jl-content{padding:6px 18px 22px}',
      '.jl-ledger{margin:0}',
      '.jl-ledger>.jl-field,.jl-ledger>.jl-group{border-top:1px solid #edf0ef}',
      '.jl-ledger>:first-child{border-top:0}',
      '.jl-field{display:grid;grid-template-columns:minmax(140px,220px) minmax(0,1fr);gap:24px;min-width:0;margin:0;padding:10px 8px}',
      '.jl-key{overflow:hidden;margin:2px 0 0;color:var(--jl-muted);font:650 9px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.04em;text-overflow:ellipsis;white-space:nowrap}',
      '.jl-value{min-width:0;overflow-wrap:anywhere;margin:0;color:var(--jl-ink);font-size:13px}',
      '.jl-boolean{display:flex;align-items:center;gap:7px;font-weight:600}',
      '.jl-bool-dot{width:6px;height:6px;border-radius:50%}',
      '.jl-bool-true{background:var(--jl-green);box-shadow:0 0 0 2px rgba(22,130,88,.1)}',
      '.jl-bool-false{background:var(--jl-red);box-shadow:0 0 0 2px rgba(195,68,85,.1)}',
      '.jl-date{color:var(--jl-amber)}',
      '.jl-date-friendly{display:block;font-weight:600}',
      '.jl-date-source{display:block;margin-top:2px;color:var(--jl-muted);font:9px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-null{color:var(--jl-muted);font-style:italic}',
      '.jl-group{min-width:0}',
      '.jl-group-summary{display:grid;grid-template-columns:16px minmax(140px,220px) minmax(0,1fr);align-items:center;column-gap:12px;padding:10px 8px;list-style:none;cursor:pointer}',
      '.jl-group-summary::-webkit-details-marker{display:none}',
      '.jl-group-summary:hover{background:#fafbfa}',
      '.jl-group-summary:hover .jl-group-name{color:var(--jl-accent)}',
      '.jl-chevron{color:var(--jl-muted);font:700 16px/1 monospace;transition:transform .16s ease}',
      '.jl-group[open]>.jl-group-summary .jl-chevron{transform:rotate(90deg)}',
      '.jl-token{display:none;color:var(--jl-accent);font:700 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-group-name{overflow:hidden;color:var(--jl-ink);font:700 11px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;text-overflow:ellipsis;white-space:nowrap}',
      '.jl-count{color:var(--jl-muted);font:600 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-count::before{content:"{";margin-right:6px;color:var(--jl-accent)}',
      '.jl-group-array>.jl-group-summary .jl-count::before{content:"["}',
      '.jl-group-content{position:relative;margin:0 0 10px 15px;padding:0 0 14px 15px;border-left:1px solid var(--jl-accent-soft)}',
      '.jl-group-content::after{position:absolute;bottom:-2px;left:-5px;padding:0 2px;background:var(--jl-white);color:var(--jl-accent);font:700 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-group-object>.jl-group-content::after{content:"}"}',
      '.jl-group-array>.jl-group-content::after{content:"]"}',
      '.jl-array{margin:0}',
      '.jl-array-item{display:grid;grid-template-columns:30px minmax(0,1fr);min-width:0;border-top:1px solid #edf0ef;background:var(--jl-white)}',
      '.jl-array-item:first-child{border-top:0}',
      '.jl-item-number{padding-top:13px;color:var(--jl-accent);font:700 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;text-align:center}',
      '.jl-item-body{min-width:0;padding-left:8px;border-left:1px solid #edf0ef}',
      '.jl-empty{margin:0;padding:14px 10px;color:var(--jl-muted);font-size:12px;font-style:italic}',
      '.jl-search-empty{padding:48px 16px;color:var(--jl-muted);font-size:13px;text-align:center}',
      '.jl-raw{display:block;width:100%;min-height:70vh;margin:0;padding:20px;border:0;background:#202625;color:#e7ecea;font:11px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap}',
      '.jl-hidden{display:none!important}',
      '.jl-toast{position:fixed;right:18px;bottom:18px;z-index:20;padding:9px 12px;border-radius:7px;background:var(--jl-ink);color:#ffffff;font-size:11px;box-shadow:0 8px 24px rgba(30,38,37,.2)}',
      '@media(max-width:760px){.jl-shell{width:min(100% - 20px,1080px);padding-top:10px}.jl-header{top:6px;flex-wrap:wrap}.jl-brand{flex:1;min-width:0}.jl-search-wrap{order:3;flex-basis:100%}.jl-actions{margin-left:0}.jl-meta{overflow:auto;white-space:nowrap}.jl-search-status{display:none}.jl-content{padding:4px 10px 16px}.jl-field{grid-template-columns:minmax(88px,32%) minmax(0,1fr);gap:12px;padding:9px 7px}.jl-key{white-space:normal}.jl-group-summary{grid-template-columns:14px minmax(88px,32%) minmax(0,1fr);column-gap:8px;padding:9px 7px}.jl-group-content{margin-left:9px;padding-left:9px}.jl-item-body{padding-left:4px}}',
      '@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}',
    ].join('')

    if ('adoptedStyleSheets' in document && typeof CSSStyleSheet === 'function') {
      try {
        styleSheet = new CSSStyleSheet()
        styleSheet.replaceSync(css)
        document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styleSheet)
        return
      } catch {
        styleSheet = undefined
      }
    }

    var style = create('style')
    style.id = STYLE_ID
    style.textContent = css
    document.head.appendChild(style)
  }

  function toast(message) {
    var existing = document.querySelector('.jl-toast')
    if (existing) existing.remove()
    var notice = create('div', 'jl-toast', message)
    notice.setAttribute('role', 'status')
    document.body.appendChild(notice)
    window.setTimeout(function () {
      notice.remove()
    }, 1800)
  }

  function render() {
    var previousRoot = document.getElementById(ROOT_ID)
    if (previousRoot) previousRoot.remove()
    injectStyles()
    if (!document.documentElement.lang) document.documentElement.lang = navigator.language || 'en'
    document.title = 'JSON Lens — ' + document.title.replace(/^JSON Lens — /, '')

    var root = create('main')
    root.id = ROOT_ID
    var shell = create('div', 'jl-shell')
    var header = create('header', 'jl-header')
    var brand = create('div', 'jl-brand')
    brand.appendChild(create('div', 'jl-logo', '{ }'))
    var brandCopy = create('div')
    brandCopy.appendChild(create('h1', 'jl-title', 'JSON LENS'))
    brandCopy.appendChild(create('p', 'jl-subtitle', location.host + location.pathname))
    brand.appendChild(brandCopy)
    header.appendChild(brand)

    var searchWrap = create('div', 'jl-search-wrap')
    var search = create('input', 'jl-search')
    search.type = 'search'
    search.placeholder = 'Search this response…'
    search.setAttribute('aria-label', 'Search JSON keys and values')
    searchWrap.appendChild(search)
    searchWrap.appendChild(create('span', 'jl-shortcut', '/'))
    header.appendChild(searchWrap)

    var actions = create('div', 'jl-actions')
    var expandButton = create('button', 'jl-button', 'Expand')
    expandButton.type = 'button'
    var rawButton = create('button', 'jl-button', 'Raw')
    rawButton.type = 'button'
    rawButton.setAttribute('aria-pressed', 'false')
    var copyButton = create('button', 'jl-button', 'Copy')
    copyButton.type = 'button'
    actions.appendChild(expandButton)
    actions.appendChild(rawButton)
    actions.appendChild(copyButton)
    header.appendChild(actions)
    shell.appendChild(header)

    var counts = countNodes(sourceData)
    var meta = create('div', 'jl-meta')
    meta.appendChild(create('span', 'jl-pill', counts.fields + ' fields'))
    meta.appendChild(create('span', 'jl-pill', counts.groups + ' groups'))
    meta.appendChild(create('span', 'jl-pill', Math.max(1, Math.round(new Blob([sourceText]).size / 1024)) + ' KB'))
    var searchStatus = create('span', 'jl-search-status', 'Press / to search')
    searchStatus.setAttribute('aria-live', 'polite')
    meta.appendChild(searchStatus)
    shell.appendChild(meta)

    var documentPanel = create('section', 'jl-document')
    var visual = create('div', 'jl-content')
    var primary = findPrimaryRecord(sourceData)
    if (Array.isArray(primary)) visual.appendChild(renderArray(primary))
    else if (isObject(primary)) visual.appendChild(renderObject(primary))
    else visual.appendChild(renderPrimitive('Value', primary))
    var emptySearch = create('p', 'jl-search-empty jl-hidden', 'No matching keys or values')
    visual.appendChild(emptySearch)
    documentPanel.appendChild(visual)

    var raw = create('pre', 'jl-raw jl-hidden', JSON.stringify(sourceData, null, 2))
    documentPanel.appendChild(raw)
    shell.appendChild(documentPanel)
    root.appendChild(shell)

    document.body.replaceChildren(root)

    expandButton.addEventListener('click', function () {
      var groups = Array.from(visual.querySelectorAll('details'))
      var shouldExpand = groups.some(function (group) {
        return !group.open
      })
      groups.forEach(function (group) {
        group.open = shouldExpand
      })
      expandButton.textContent = shouldExpand ? 'Collapse' : 'Expand'
    })

    rawButton.addEventListener('click', function () {
      var showRaw = raw.classList.contains('jl-hidden')
      raw.classList.toggle('jl-hidden', !showRaw)
      visual.classList.toggle('jl-hidden', showRaw)
      rawButton.textContent = showRaw ? 'Tree' : 'Raw'
      rawButton.setAttribute('aria-pressed', String(showRaw))
      search.disabled = showRaw
      expandButton.disabled = showRaw
    })

    copyButton.addEventListener('click', function () {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        toast('Clipboard access is unavailable')
        return
      }
      navigator.clipboard.writeText(JSON.stringify(sourceData, null, 2)).then(
        function () {
          toast('JSON copied')
          copyButton.textContent = 'Copied'
          window.setTimeout(function () {
            copyButton.textContent = 'Copy'
          }, 1800)
        },
        function () {
          toast('Clipboard access was blocked')
        }
      )
    })

    search.addEventListener('input', function () {
      var query = search.value.trim().toLocaleLowerCase()
      var fields = Array.from(visual.querySelectorAll('.jl-field'))
      var groups = Array.from(visual.querySelectorAll('.jl-group'))
      var items = Array.from(visual.querySelectorAll('.jl-array-item'))
      var matches = 0

      fields.forEach(function (field) {
        var matchesField = !query || field.textContent.toLocaleLowerCase().includes(query)
        field.classList.toggle('jl-hidden', !matchesField)
        if (query && matchesField) matches += 1
      })
      items.forEach(function (item) {
        item.classList.toggle('jl-hidden', Boolean(query) && !item.textContent.toLocaleLowerCase().includes(query))
      })
      groups.forEach(function (group) {
        var matchesGroup = !query || group.textContent.toLocaleLowerCase().includes(query)
        group.classList.toggle('jl-hidden', !matchesGroup)
        if (query && matchesGroup) {
          group.open = true
          if (group.firstElementChild.textContent.toLocaleLowerCase().includes(query)) matches += 1
        }
      })
      emptySearch.classList.toggle('jl-hidden', !query || matches > 0)
      searchStatus.textContent = query ? matches + (matches === 1 ? ' match' : ' matches') : 'Press / to search'
    })

    if (keyHandler) window.removeEventListener('keydown', keyHandler)
    keyHandler = function (event) {
      var target = event.target
      var isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        search.focus()
      }
    }
    window.addEventListener('keydown', keyHandler)
  }

  window.JSONLens = function () {
    if (!sourceText) {
      sourceText = document.body.textContent.trim()
      try {
        sourceData = JSON.parse(sourceText)
      } catch {
        window.alert('JSON Lens could not find a valid JSON response on this page.')
        return
      }
    }
    render()
  }

  window.JSONLens()
})()`

export const JSON_LENS_BOOKMARKLET = `javascript:${encodeURIComponent(JSON_LENS_SOURCE)}`
