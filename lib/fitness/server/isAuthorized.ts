import { timingSafeEqual } from 'node:crypto'

export const isAuthorized = (authorization: string | undefined, expectedToken: string) => {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  const actual = Buffer.from(token)
  const expected = Buffer.from(expectedToken)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
