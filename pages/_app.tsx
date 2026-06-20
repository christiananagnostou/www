import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import 'uplot/dist/uPlot.min.css'
import GlobalStyle from '../components/GlobalStyle'
import Layout from '../components/Layout'
import MotionProvider from '../components/animation/MotionProvider'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const routeKey = router.asPath.split('?')[0]

  return (
    <MotionProvider>
      <GlobalStyle />
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
