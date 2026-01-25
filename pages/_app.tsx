import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { AppProps } from 'next/app'
import 'uplot/dist/uPlot.min.css'
import GlobalStyle from '../components/GlobalStyle'
import Layout from '../components/Layout'

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
