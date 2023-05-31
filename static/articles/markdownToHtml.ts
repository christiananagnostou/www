import toc from '@jsdevtools/rehype-toc'
import rehypeHighlight from 'rehype-highlight'
import slug from 'rehype-slug'
import stringify from 'rehype-stringify'
import parse from 'remark-parse'
import rehype from 'remark-rehype'
import { unified } from 'unified'

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(parse)
    .use(rehype)
    .use(slug)
    .use(toc)
    .use(rehypeHighlight)
    .use(stringify)
    .process(markdown)
  return result.toString()
}
