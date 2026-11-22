import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'

import GlobalStyle from '../components/GlobalStyle'
import Layout from '../components/Layout'
import MotionProvider from '../components/animation/MotionProvider'
import { BASE_URL } from '../lib/constants'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const routeKey = router.asPath.split('?')[0]

  return (
    <MotionProvider>
      <Head>
        <meta key="og:type" content="website" property="og:type" />
        <meta key="og:title" content="Christian Anagnostou" property="og:title" />
        <meta key="og:description" content="Christian Anagnostou's personal website" property="og:description" />
        <meta key="og:url" content={BASE_URL + routeKey.split('#')[0]} property="og:url" />
      </Head>
      <GlobalStyle $fontFamily={inter.style.fontFamily} />
      <Analytics />
      <SpeedInsights />

      <Layout>
        <AnimatePresence initial={false} mode="wait">
          <Component {...pageProps} key={routeKey} />
        </AnimatePresence>
      </Layout>
    </MotionProvider>
  )
}
