// Only add known marketing/tracking params here. Functional params must stay out of this list.
export const STRIPPABLE_QUERY_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
  'mc_cid',
  'mc_eid',
] as const

export const STRIPPABLE_QUERY_PARAM_SET = new Set<string>(STRIPPABLE_QUERY_PARAMS)

// Params with app behavior live here so future contributors keep them separate from tracking params.
export const FUNCTIONAL_QUERY_PARAMS = new Set(['category', 'tag'])

export const getCleanedTrackingUrl = (url: URL) => {
  const cleanedUrl = new URL(url)
  let removedTrackingParam = false

  STRIPPABLE_QUERY_PARAM_SET.forEach((param) => {
    if (cleanedUrl.searchParams.has(param)) {
      cleanedUrl.searchParams.delete(param)
      removedTrackingParam = true
    }
  })

  if (!removedTrackingParam) {
    return null
  }

  return `${cleanedUrl.pathname}${cleanedUrl.search}${cleanedUrl.hash}`
}
