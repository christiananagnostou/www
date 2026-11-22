import Negotiator from 'negotiator'

export const HTML = 'text/html; charset=utf-8'
export const MARKDOWN = 'text/markdown; charset=utf-8'

// Prefer the browser representation for */*; more specific ranges and q-values win.
export const pageFormat = (accept?: string | null) =>
  new Negotiator({ headers: { accept: accept ?? undefined } }).mediaType([HTML, MARKDOWN])
