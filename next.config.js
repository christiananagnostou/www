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
  eslint: {
    // ESLint removed in favor of oxlint; skip Next's built-in lint step
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_URL: getBaseUrl(), // available on client & server
  },
}
