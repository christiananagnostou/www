export const JSON_LENS_SOURCE = String.raw`(function () {
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
    var row = create('div', 'jl-field')
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

  function renderGroup(key, value, depth, open) {
    var details = create('details', 'jl-group jl-depth-' + Math.min(depth, 3))
    details.open = open
    var summary = create('summary', 'jl-group-summary')
    var marker = create('span', 'jl-chevron', '›')
    var heading = create('span', 'jl-group-name', humanize(key))
    var count = create('span', 'jl-count', summaryFor(value))
    summary.appendChild(marker)
    summary.appendChild(heading)
    summary.appendChild(count)
    details.appendChild(summary)

    var content = create('div', 'jl-group-content')
    if (Array.isArray(value)) {
      content.appendChild(renderArray(value, depth + 1))
    } else {
      content.appendChild(renderObject(value, depth + 1))
    }
    details.appendChild(content)
    return details
  }

  function renderObject(object, depth) {
    var container = create('div', 'jl-object')
    var fields = create('dl', 'jl-fields')
    var groups = []

    Object.keys(object).forEach(function (key) {
      var value = object[key]
      if (Array.isArray(value) || isObject(value)) {
        groups.push([key, value])
      } else {
        fields.appendChild(renderPrimitive(key, value))
      }
    })

    if (fields.childNodes.length) container.appendChild(fields)
    groups.forEach(function (entry) {
      container.appendChild(renderGroup(entry[0], entry[1], depth, depth < 1))
    })
    if (!container.childNodes.length) container.appendChild(create('p', 'jl-empty', 'Empty object'))
    return container
  }

  function renderArray(array, depth) {
    var list = create('div', 'jl-array')
    if (!array.length) {
      list.appendChild(create('p', 'jl-empty', 'No items'))
      return list
    }

    array.forEach(function (item, index) {
      var card = create('article', 'jl-array-item')
      card.appendChild(create('div', 'jl-item-number', String(index + 1).padStart(2, '0')))
      var body = create('div', 'jl-item-body')
      if (isObject(item)) body.appendChild(renderObject(item, depth))
      else if (Array.isArray(item)) body.appendChild(renderArray(item, depth))
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
      ':root{color-scheme:light;--jl-ink:#17243d;--jl-muted:#69758a;--jl-line:#dce3ef;--jl-paper:#f7f9fc;--jl-white:#ffffff;--jl-blue:#2855d9;--jl-blue-soft:#edf2ff;--jl-amber:#c46b16;--jl-green:#198754;--jl-red:#c03b4b}',
      '*{box-sizing:border-box}',
      'html,body{min-height:100%;margin:0;background:var(--jl-paper)!important;color:var(--jl-ink)!important}',
      'body{font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;line-height:1.5}',
      '#' +
        ROOT_ID +
        '{min-height:100vh;background:linear-gradient(90deg,rgba(40,85,217,.035) 1px,transparent 1px);background-size:24px 24px}',
      '.jl-shell{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:32px 0 80px}',
      '.jl-header{position:sticky;top:12px;z-index:10;display:flex;align-items:center;gap:16px;margin-bottom:28px;padding:12px 14px;border:1px solid var(--jl-line);border-radius:14px;background:rgba(255,255,255,.94);box-shadow:0 10px 35px rgba(23,36,61,.08);backdrop-filter:blur(14px)}',
      '.jl-brand{display:flex;align-items:center;gap:11px;min-width:0}',
      '.jl-logo{display:grid;width:34px;height:34px;border-radius:9px;background:var(--jl-blue);color:#ffffff;font:700 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;place-items:center}',
      '.jl-title{margin:0;color:var(--jl-ink);font:700 15px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em}',
      '.jl-subtitle{margin:3px 0 0;color:var(--jl-muted);font-size:12px}',
      '.jl-actions{display:flex;gap:8px;margin-left:auto}',
      '.jl-button{padding:8px 11px;border:1px solid var(--jl-line);border-radius:8px;background:var(--jl-white);color:var(--jl-ink);font:600 12px/1.2 inherit;cursor:pointer}',
      '.jl-button:hover,.jl-button:focus-visible{border-color:var(--jl-blue);outline:none;color:var(--jl-blue)}',
      '.jl-search{width:min(280px,28vw);padding:9px 12px;border:1px solid var(--jl-line);border-radius:8px;background:var(--jl-paper);color:var(--jl-ink);font:13px/1.2 inherit;outline:none}',
      '.jl-search:focus{border-color:var(--jl-blue);box-shadow:0 0 0 3px var(--jl-blue-soft)}',
      '.jl-meta{display:flex;gap:8px;margin:0 0 16px}',
      '.jl-pill{padding:5px 9px;border:1px solid var(--jl-line);border-radius:999px;background:var(--jl-white);color:var(--jl-muted);font:600 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-document{overflow:hidden;border:1px solid var(--jl-line);border-radius:16px;background:var(--jl-white);box-shadow:0 18px 60px rgba(23,36,61,.07)}',
      '.jl-document-head{display:flex;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid var(--jl-line);background:linear-gradient(135deg,var(--jl-blue-soft),#ffffff 70%)}',
      '.jl-document-rule{width:5px;height:34px;border-radius:3px;background:var(--jl-blue)}',
      '.jl-document-title{margin:0;color:var(--jl-ink);font:650 clamp(18px,3vw,25px)/1.2 Georgia,"Times New Roman",serif}',
      '.jl-document-label{margin:2px 0 0;color:var(--jl-muted);font:600 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase}',
      '.jl-content{padding:8px 22px 22px}',
      '.jl-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin:0;padding:8px 0}',
      '.jl-field{min-width:0;padding:13px 14px;border-bottom:1px solid var(--jl-line)}',
      '.jl-key{overflow:hidden;margin:0 0 5px;color:var(--jl-muted);font:650 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.07em;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}',
      '.jl-value{overflow-wrap:anywhere;margin:0;color:var(--jl-ink);font-size:14px}',
      '.jl-boolean{display:flex;align-items:center;gap:7px;font-weight:650}',
      '.jl-bool-dot{width:8px;height:8px;border-radius:50%}',
      '.jl-bool-true{background:var(--jl-green);box-shadow:0 0 0 3px rgba(25,135,84,.1)}',
      '.jl-bool-false{background:var(--jl-red);box-shadow:0 0 0 3px rgba(192,59,75,.1)}',
      '.jl-date{color:var(--jl-amber)}',
      '.jl-date-friendly{display:block;font-weight:650}',
      '.jl-date-source{display:block;margin-top:2px;color:var(--jl-muted);font:10px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-null{color:var(--jl-muted);font-style:italic}',
      '.jl-group{border-top:1px solid var(--jl-line)}',
      '.jl-group-summary{display:flex;align-items:center;gap:9px;padding:15px 8px;list-style:none;cursor:pointer}',
      '.jl-group-summary::-webkit-details-marker{display:none}',
      '.jl-group-summary:hover .jl-group-name{color:var(--jl-blue)}',
      '.jl-chevron{color:var(--jl-blue);font:700 22px/1 monospace;transition:transform .16s ease}',
      '.jl-group[open]>.jl-group-summary .jl-chevron{transform:rotate(90deg)}',
      '.jl-group-name{color:var(--jl-ink);font:700 14px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-count{margin-left:auto;color:var(--jl-muted);font:600 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}',
      '.jl-group-content{margin:0 0 14px 10px;padding-left:16px;border-left:2px solid var(--jl-blue-soft)}',
      '.jl-array{display:grid;gap:10px}',
      '.jl-array-item{display:grid;grid-template-columns:38px minmax(0,1fr);overflow:hidden;border:1px solid var(--jl-line);border-radius:10px;background:var(--jl-white)}',
      '.jl-item-number{padding-top:15px;border-right:1px solid var(--jl-line);background:var(--jl-paper);color:var(--jl-blue);font:700 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;text-align:center}',
      '.jl-item-body{min-width:0;padding:0 10px}',
      '.jl-empty{margin:0;padding:16px;color:var(--jl-muted);font-size:13px;font-style:italic}',
      '.jl-raw{display:block;width:100%;min-height:70vh;margin:0;padding:24px;border:0;background:#111827;color:#dbeafe;font:12px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap}',
      '.jl-hidden{display:none!important}',
      '.jl-no-results{padding:80px 20px;color:var(--jl-muted);text-align:center}',
      '.jl-toast{position:fixed;right:20px;bottom:20px;z-index:20;padding:10px 14px;border-radius:9px;background:var(--jl-ink);color:#ffffff;font-size:12px;box-shadow:0 8px 30px rgba(23,36,61,.24)}',
      '@media(max-width:720px){.jl-shell{width:min(100% - 20px,1120px);padding-top:10px}.jl-header{top:6px;flex-wrap:wrap;gap:9px}.jl-brand{flex:1}.jl-search{order:3;width:100%}.jl-button span{display:none}.jl-content{padding:5px 12px 16px}.jl-document-head{padding:15px}.jl-fields{grid-template-columns:1fr}.jl-group-content{margin-left:2px;padding-left:9px}.jl-array-item{grid-template-columns:30px minmax(0,1fr)}.jl-meta{overflow:auto}}',
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
    document.title = 'JSON Lens — ' + document.title.replace(/^JSON Lens — /, '')

    var root = create('main')
    root.id = ROOT_ID
    var shell = create('div', 'jl-shell')
    var header = create('header', 'jl-header')
    var brand = create('div', 'jl-brand')
    brand.appendChild(create('div', 'jl-logo', '{ }'))
    var brandCopy = create('div')
    brandCopy.appendChild(create('h1', 'jl-title', 'JSON LENS'))
    brandCopy.appendChild(create('p', 'jl-subtitle', 'A local view of this response'))
    brand.appendChild(brandCopy)
    header.appendChild(brand)

    var search = create('input', 'jl-search')
    search.type = 'search'
    search.placeholder = 'Search keys and values…'
    search.setAttribute('aria-label', 'Search JSON keys and values')
    header.appendChild(search)

    var actions = create('div', 'jl-actions')
    var rawButton = create('button', 'jl-button', 'Raw')
    rawButton.type = 'button'
    var copyButton = create('button', 'jl-button', 'Copy')
    copyButton.type = 'button'
    actions.appendChild(rawButton)
    actions.appendChild(copyButton)
    header.appendChild(actions)
    shell.appendChild(header)

    var counts = countNodes(sourceData)
    var meta = create('div', 'jl-meta')
    meta.appendChild(create('span', 'jl-pill', counts.fields + ' fields'))
    meta.appendChild(create('span', 'jl-pill', counts.groups + ' groups'))
    meta.appendChild(create('span', 'jl-pill', Math.max(1, Math.round(new Blob([sourceText]).size / 1024)) + ' KB'))
    shell.appendChild(meta)

    var documentPanel = create('section', 'jl-document')
    var documentHead = create('header', 'jl-document-head')
    documentHead.appendChild(create('div', 'jl-document-rule'))
    var documentCopy = create('div')
    documentCopy.appendChild(create('p', 'jl-document-label', 'Structured response'))
    documentCopy.appendChild(create('h2', 'jl-document-title', 'Response overview'))
    documentHead.appendChild(documentCopy)
    documentPanel.appendChild(documentHead)

    var visual = create('div', 'jl-content')
    var primary = findPrimaryRecord(sourceData)
    if (Array.isArray(primary)) visual.appendChild(renderArray(primary, 0))
    else if (isObject(primary)) visual.appendChild(renderObject(primary, 0))
    else visual.appendChild(renderPrimitive('Value', primary))
    documentPanel.appendChild(visual)

    var raw = create('pre', 'jl-raw jl-hidden', JSON.stringify(sourceData, null, 2))
    documentPanel.appendChild(raw)
    shell.appendChild(documentPanel)
    root.appendChild(shell)

    document.body.replaceChildren(root)

    rawButton.addEventListener('click', function () {
      var showRaw = raw.classList.contains('jl-hidden')
      raw.classList.toggle('jl-hidden', !showRaw)
      visual.classList.toggle('jl-hidden', showRaw)
      rawButton.textContent = showRaw ? 'Visual' : 'Raw'
      search.disabled = showRaw
    })

    copyButton.addEventListener('click', function () {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        toast('Clipboard access is unavailable')
        return
      }
      navigator.clipboard.writeText(JSON.stringify(sourceData, null, 2)).then(
        function () {
          toast('JSON copied')
        },
        function () {
          toast('Clipboard access was blocked')
        }
      )
    })

    search.addEventListener('input', function () {
      var query = search.value.trim().toLocaleLowerCase()
      var items = visual.querySelectorAll('.jl-field,.jl-group,.jl-array-item')
      items.forEach(function (item) {
        var matches = !query || item.textContent.toLocaleLowerCase().includes(query)
        item.classList.toggle('jl-hidden', !matches)
        if (query && matches && item.tagName === 'DETAILS') item.open = true
      })
    })

    if (keyHandler) window.removeEventListener('keydown', keyHandler)
    keyHandler = function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'f') {
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
