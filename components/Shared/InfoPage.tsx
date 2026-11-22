import * as m from 'framer-motion/m'
import Head from 'next/head'
import type { ReactNode } from 'react'
import styled from 'styled-components'

import { SITE_ORIGIN } from '../../lib/constants'
import { fade, pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'
import { Heading } from './Heading'

type Props = { title: string; path: string; intro: string; children: ReactNode }

export default function InfoPage({ title, path, intro, children }: Props) {
  const initial = usePageTransitionInitial()
  const url = SITE_ORIGIN + path
  return (
    <>
      <Head>
        <title>{`${title} | Christian Anagnostou`}</title>
        <meta name="description" content={intro} />
        <link rel="canonical" href={url} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={intro} />
        <meta key="og:url" property="og:url" content={url} />
      </Head>
      <Page initial={initial} animate="show" exit="exit" variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>{title}</h1>
          <p>{intro}</p>
        </Heading>
        <InfoCopy>{children}</InfoCopy>
      </Page>
    </>
  )
}

const Page = styled(m.article)`
  max-width: 40rem;
  margin: 2rem auto 4rem;
  padding: 0 1rem;
`

export const InfoCopy = styled.div`
  color: var(--text);
  font-size: 0.94rem;
  line-height: 1.6;
  h2 {
    margin: 1.75rem 0 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--heading);
  }
  p + p {
    margin-top: 0.75rem;
  }
`
