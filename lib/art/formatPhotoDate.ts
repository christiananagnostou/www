const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatPhotoDate(isoDate: string) {
  // Native Date treats an ISO timestamp without an offset as local; photo dates are UTC.
  const date = new Date(/[T ][\d:.]+$/i.test(isoDate) ? `${isoDate}Z` : isoDate)
  if (Number.isNaN(date.getTime())) return 'Invalid Date'

  return `${MONTHS[date.getUTCMonth()]} '${String(date.getUTCFullYear()).padStart(2, '0').slice(-2)}`
}
