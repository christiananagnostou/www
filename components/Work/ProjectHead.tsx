import Head from 'next/head'

interface Props {
  title: string
  description: string
  url: string
  image?: string
  structured: object
}

export default function ProjectHead({ title, description, url, image, structured }: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:url" property="og:url" content={url} />
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta name="twitter:image" content={image} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}
      />
    </Head>
  )
}
