import { describe, expect, it } from 'vitest'

import { FUNCTIONAL_QUERY_PARAMS, getCleanedTrackingUrl, STRIPPABLE_QUERY_PARAM_SET } from './queryParams'

describe('getCleanedTrackingUrl', () => {
  it('removes known tracking params and preserves functional params, unknown params, path, and hash', () => {
    const url = new URL('https://example.com/articles?utm_source=newsletter&category=tech&foo=bar&gclid=123#post')

    expect(getCleanedTrackingUrl(url)).toBe('/articles?category=tech&foo=bar#post')
  })

  it('does nothing when no tracking params are present', () => {
    const url = new URL('https://example.com/art?tag=travel&foo=bar#gallery')

    expect(getCleanedTrackingUrl(url)).toBeNull()
  })

  it('keeps expected functional params out of the tracking strip list', () => {
    FUNCTIONAL_QUERY_PARAMS.forEach((param) => {
      expect(STRIPPABLE_QUERY_PARAM_SET.has(param)).toBe(false)
    })
  })
})
