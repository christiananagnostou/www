/** @jsxImportSource @solidjs/web */
import { generateHydrationScript, renderToString } from '@solidjs/web'
import type { Directory as Model } from '../directory'
import Directory from './Directory'

export function prerender(data: Model, selected: string) {
  return {
    html: renderToString(() => <Directory data={data} initial={selected} />),
    bootstrap: generateHydrationScript(),
  }
}
