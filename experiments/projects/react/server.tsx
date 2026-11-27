import { renderToString } from 'react-dom/server'
import type { Directory as Model } from '../directory'
import Directory from './Directory'

export function prerender(data: Model, selected: string) {
  return { html: renderToString(<Directory data={data} initial={selected} />), bootstrap: '' }
}
