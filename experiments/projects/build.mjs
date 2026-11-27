import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import solid from '@solidjs/vite-plugin'
import { build } from 'vite'
import { snapshot } from './snapshot.mjs'

// This experiment belongs on a preview, never on the production deployment.
if (process.env.VERCEL_ENV === 'production') process.exit(0)
process.env.NODE_ENV = 'production'
const root = resolve('experiments/projects')
const output = resolve('public/framework-lab')
const { data, inlineCss, template } = await snapshot()
const css = inlineCss + '\n' + (await readFile(resolve(root, 'shell.css'), 'utf8'))
const cssName = 'shell-' + createHash('sha256').update(css).digest('hex').slice(0, 12) + '.css'
await mkdir(output, { recursive: true })
await writeFile(resolve(output, cssName), css)

for (const engine of ['react', 'solid']) {
  const base = '/framework-lab/' + engine
  const serverDir = resolve('.next/cache/framework-lab', engine)
  const settings = {
    root,
    configFile: false,
    publicDir: false,
    base: base + '/assets/',
    plugins: engine === 'solid' ? [solid({ ssr: true })] : [],
  }
  const entry = (kind) => resolve(root, engine, kind + '.tsx')
  const buildOptions = { target: 'es2022', emptyOutDir: true, reportCompressedSize: false }
  await build({
    ...settings,
    build: {
      ...buildOptions,
      ssr: entry('server'),
      outDir: serverDir,
      rolldownOptions: { output: { entryFileNames: 'entry.mjs' } },
    },
  })
  const client = await build({
    ...settings,
    build: {
      ...buildOptions,
      outDir: resolve(output, engine, 'assets'),
      rolldownOptions: { input: { app: entry('client') }, output: { entryFileNames: '[name]-[hash].js' } },
    },
  })
  const script = [client]
    .flat()
    .flatMap((bundle) => bundle.output)
    .find((chunk) => chunk.isEntry).fileName
  const { prerender } = await import(pathToFileURL(resolve(serverDir, 'entry.mjs')))
  const model = {
    ...data,
    categories: data.categories.map((c) => ({
      ...c,
      href: base + '/' + (c.key === 'all' ? 'projects' : c.key) + '.html',
    })),
  }
  for (const c of model.categories) {
    const { html, bootstrap } = prerender(model, c.key)
    const page = template
      .replace('__SELECTED__', c.key)
      .replace('__DIRECTORY__', () => html)
      .replace('</head>', () => `<link rel="stylesheet" href="/framework-lab/${cssName}">${bootstrap}</head>`)
      .replace('</body>', () => `<script type="module" src="${base}/assets/${script}"></script></body>`)
    await writeFile(resolve('public', '.' + c.href), page)
  }
}
