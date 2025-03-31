import { BASE_URL } from '../constants'

export const getContactStructuredData = () => ({
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
