import { describe, it, expect } from 'vitest'
import { BASE_URL } from '../constants'
import { getContactStructuredData } from './contact' // Adjust the path to match your project structure

describe('getContactStructuredData', () => {
  it('returns the correct structured data for the contact page', () => {
    const result = getContactStructuredData()

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact | Christian Anagnostou',
      url: `${BASE_URL}/contact`,
      description: 'Get in touch with Christian Anagnostou for inquiries, collaborations, or just to say hello.',
      mainEntity: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
    })
  })
})
