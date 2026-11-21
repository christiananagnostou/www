/** @type {import('next').NextConfig} */
const getBaseUrl = () => {
  const { VERCEL_ENV, VERCEL_URL, VERCEL_BRANCH_URL, VERCEL_PROJECT_PRODUCTION_URL } = process.env

  if (VERCEL_ENV === 'production') {
    // custom domain if you have one, otherwise the production *.vercel.app URL
    return `https://${VERCEL_PROJECT_PRODUCTION_URL || VERCEL_URL}`
  }

  if (VERCEL_ENV === 'preview') {
    // persistent branch URL (no unique hash) falls back to deployment URL
    return `https://${VERCEL_BRANCH_URL || VERCEL_URL}`
  }

  // local dev (`next dev` or `vercel dev`)
  return 'http://localhost:3000'
}

module.exports = {
  reactStrictMode: true,
  images: {
    // Keep Next's thumbnail widths and fill the gap between 384 and 640 on high-density phones.
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 544],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/art',
          has: [{ type: 'query', key: 'tag', value: '(?<photoCategory>[^/]+)' }],
          destination: '/art/:photoCategory',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
  env: {
    NEXT_PUBLIC_BASE_URL: getBaseUrl(), // available on client & server
  },
}
