---
title: 'Stop Overpaying for Next.js Middleware'
dateCreated: 'Mar 30, 2025'
summary: 'Avoid unnecessary Next.js middleware invocations and keep your hosting bills under control'
coverImg: '/img/articles/optimizing-nextjs-middleware/optimize-middleware.webp'
hidden: false
categories: 'frontend'
---

Next.js middleware is great for handling authentication, redirects, and personalization right at the edge. But there’s a cost hidden in that convenience: middleware gets invoked on _every_ matching request. Even requests that you might not expect—which can quickly balloon your invocation count (and your hosting bill) if you're not careful.

## Every Invocation Counts

Obviously, Next.js middleware runs for all the page routes specified in the matcher config. But did you know that each time Next.js prefetches JSON data for your pages ( `/_next/data/.../page.json` ), middleware also gets invoked if your matcher isn't set correctly?

I learned this the hard way—realizing that my middleware invocation counts skyrocketed after adding more `<Link>` components. Each `<Link>` prefetches JSON data behind the scenes, triggering middleware unnecessarily.

---

## The Culprit: JSON Prefetch Requests

Consider a typical middleware matcher configuration:

```js
export const config = {
  matcher: ['/account/:path*'],
}
```

At first glance, this seems harmless—it matches routes like `/account/login`. But it also matches `/_next/data/.../account/login.json`, a route Next.js automatically hits to prefetch data. Every prefetch means another middleware invocation—even if you don't need middleware logic to run on these JSON requests.

This leads to a ton of extra invocations, inflating costs quickly.

## The Fix: Exclude JSON Requests

The good news is the fix is pretty straightforward. Adjust your matcher to explicitly skip JSON requests:

```js
export const config = {
  matcher: ['/account/((?!.*\\.json).*)'],
}
```

Here, the regex `((?!.*\\.json).*)` explicitly filters out JSON prefetch requests. With this tweak, middleware only triggers on actual page loads, significantly cutting down unnecessary invocations.

---

## When Should JSON Requests Run Middleware?

In most cases, skipping middleware on JSON requests is ideal. But there are exceptions:

- If your JSON payload needs personalization or varies by user/session.
- When real-time authentication checks on data-fetching requests are required.

Typically, though, you won’t need middleware running on prefetch JSON calls.

---

## An Optimized Middleware Example

Here's a practical, optimized middleware setup:

```js
export const config = {
  matcher: ['/account/((?!.*\\.json).*)'],
};

export async function middleware(request: NextRequest) {
  // Skip any lingering preflight requests (optional)
  if (request.method === 'OPTIONS') return NextResponse.next();

  ...

  return NextResponse.next();
}
```

With this approach, middleware invocations become targeted, efficient, and less costly.

---

Middleware optimization might seem minor, but the cumulative impact is substantial. By carefully configuring your matchers, you build apps that not only perform better but are also more economical at scale.

Got ideas or questions about middleware optimization? Reach out to me on X [@javascramble](https://x.com/javascramble).
