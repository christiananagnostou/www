import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import Contact from '../pages/contact'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

it('sends the contact form through the browser SDK and clears it after a successful reply', async () => {
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'service_test')
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'template_test')
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'public_test')
  const fetch = vi.fn<typeof window.fetch>().mockResolvedValue(new Response('OK'))
  vi.stubGlobal('fetch', fetch)

  render(<Contact />)
  const name = screen.getByRole('textbox', { name: /Name/ })
  fireEvent.change(name, { target: { value: 'Test visitor' } })
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Test message' } })
  fireEvent.click(screen.getByRole('button', { name: 'SEND' }))

  await waitFor(() => expect((name as HTMLInputElement).value).toBe(''))
  expect(fetch).toHaveBeenCalledTimes(1)
  const [url, request] = fetch.mock.calls[0]
  expect(url).toBe('https://api.emailjs.com/api/v1.0/email/send')
  expect(JSON.parse(String(request?.body))).toMatchObject({
    service_id: 'service_test',
    template_id: 'template_test',
    user_id: 'public_test',
    template_params: { from_name: 'Test visitor', message: 'Test message' },
  })
})
