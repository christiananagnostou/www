import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { domAnimation, LazyMotion } from 'framer-motion'
import type { AppProps } from 'next/app'
import 'uplot/dist/uPlot.min.css'
import GlobalStyle from '../components/GlobalStyle'
import { MotionPresetsProvider } from '../components/animation/MotionPresetsProvider'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      <MotionPresetsProvider>
        <GlobalStyle />
        <Analytics />
        <SpeedInsights />

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MotionPresetsProvider>
    </LazyMotion>
  )
}
