import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import GlobalStyle from '../components/Styles/GlobalStyle'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Analytics />
      <SpeedInsights />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
