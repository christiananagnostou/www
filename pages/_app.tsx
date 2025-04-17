import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import GlobalStyle from '../components/GlobalStyle'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Analytics />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
