import { expect, it } from 'vitest'

import markdownToHtml from './markdownToHtml'

it('keeps duplicate heading IDs and table-of-contents links local to each article', async () => {
  const [first, second] = await Promise.all([markdownToHtml('## Notes\n\n## Notes'), markdownToHtml('## Notes')])

  for (const html of [first, second]) {
    expect(html).toContain('href="#notes"')
    expect(html).toContain('<h2 id="notes">Notes</h2>')
  }
  expect(first).toContain('href="#notes-1"')
  expect(first).toContain('<h2 id="notes-1">Notes</h2>')
  expect(second).not.toContain('notes-1')
})

it('highlights fenced code without interpreting its contents as HTML', async () => {
  const html = await markdownToHtml('```js\nconst label = "<ready>"\n```')

  expect(html).toContain('class="hljs language-js"')
  expect(html).toContain('<span class="hljs-keyword">const</span>')
  expect(html).not.toContain('<ready>')
  expect(html).toContain('&#x3C;ready>')
})
