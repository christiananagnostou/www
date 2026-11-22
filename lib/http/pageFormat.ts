import Negotiator from 'negotiator'

export const HTML = 'text/html; charset=utf-8'
export const MARKDOWN = 'text/markdown; charset=utf-8'
// On Vercel the homepage's response transform appends Accept after the ISR cache (vercel.json).
// Self-hosted Next must send it on both the HTML response and the raw Markdown response.
export const HOME_VARY = process.env.VERCEL === '1' ? undefined : 'Accept'

// Prefer the browser representation for */*; more specific ranges and q-values win.
export const pageFormat = (accept?: string | null) =>
  new Negotiator({ headers: { accept: accept ?? undefined } }).mediaType([HTML, MARKDOWN])
