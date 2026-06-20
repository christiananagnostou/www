import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useState } from 'react'
import 'uplot/dist/uPlot.min.css'
import GlobalStyle from '../components/GlobalStyle'
import Layout from '../components/Layout'
import MotionProvider from '../components/animation/MotionProvider'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const routeKey = router.asPath.split('?')[0]
  const [animateInitialEntry, setAnimateInitialEntry] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (document.documentElement.dataset.pageEntry === 'pending') setAnimateInitialEntry(true)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (animateInitialEntry) document.documentElement.removeAttribute('data-page-entry')
  }, [animateInitialEntry])

  return (
    <MotionProvider forcePageTransitionInitial={animateInitialEntry}>
      <GlobalStyle />
      <Analytics />
      <SpeedInsights />

      <Layout>
        <AnimatePresence key={animateInitialEntry ? 'entry' : 'initial'} initial={animateInitialEntry} mode="wait">
          <Component {...pageProps} key={routeKey} />
        </AnimatePresence>
      </Layout>
    </MotionProvider>
  )
}
