# Projects: Solid 2 vs. React

Preview-only experiment. The existing Next.js `/projects` is the real-site baseline. Two standalone documents render the same directory with different runtimes:

| Path                                 | Renderer                           | How a project opens                               |
| ------------------------------------ | ---------------------------------- | ------------------------------------------------- |
| `/projects`                          | Existing Next Pages Router + React | Next client navigation, with normal link prefetch |
| `/framework-lab/react/projects.html` | React DOM + Vite                   | Normal link to the existing Next project          |
| `/framework-lab/solid/projects.html` | Solid 2 + Vite                     | Same normal link                                  |

Both controls use the real build’s project order, descriptions, illustrations, category icons, fonts, shell and styles. Each framework server-renders the directory and hydrates it. The client reads the illustrations from the trusted build output instead of downloading a duplicate JSON representation. Filtered URLs are pre-rendered and work without JavaScript. The comparison documents are unlisted, noindex, and are not built for production Vercel deployments.

This tests the rendering runtime and the cost of a framework boundary. It is not a SolidStart port: detail pages, APIs, routing, data loading, analytics and deployment are not reimplemented. The existing Next site includes features the two standalone controls don't, so compare React **standalone** with Solid for the framework-only result.

## Reproduce

Use the Node version in `package.json`. From the repository root:

```sh
npm ci
npm run build
npm start -- -H 127.0.0.1 -p 31843
```

In a second terminal:

```sh
npx --no-install playwright-core install chromium firefox
node experiments/projects/verify.mjs
COMPARISON_OUTPUT=/tmp/projects-framework-results.json node experiments/projects/measure.mjs
```

Set `COMPARISON_ORIGIN` to test an HTTPS preview instead. Optionally set `COMPARISON_CDP` to an isolated existing Chromium debugging WebSocket or `CHROME_CHANNEL=chrome` to use installed Chrome. Verification covers keyboard filters, focus, reload, history, reduced motion, SVG hover, the detail-page link, mobile submenu and no-JavaScript category links. It compares row geometry and settled viewport pixels at 390, 820 and 1440 pixels in Chromium and Firefox.

The benchmark rotates execution order, discards one warm-up per engine and reports five cold-context medians per viewport. Both profiles use a 65 ms latency and 6 Mbps download profile; mobile uses a 390 px viewport and 4× CPU slowdown, desktop 1440 px and 1× CPU. Network totals are actual encoded same-origin successful transfers, including headers, documents, scripts, fonts, styles, images and visible-link prefetch. The first sample ends 1.6 s after readiness; the two-page sample ends 1.6 s after opening Lift Club. Caches are empty at entry, not when moving to the detail page. Analytics submission is blocked; delivered scripts still count. The filter timer starts at keyboard activation and ends on the frame after the correct rows and selected link appear. The detail timer ends the frame after its heading is in the DOM; it does not imply all its images have loaded. These are lab measurements, not field Web Vitals.

For the authoring exercise, temporarily add a `tools` category in `lib/projects/categories.ts`, its label and icon in `components/Work/ProjectCategoryNav.tsx`, and tag Skillbox, ImgPress and Knip HTML Reporter in `lib/projects/index.ts`. Rebuild, restart, and run `node experiments/projects/verify.mjs --exercise`. The fixture is deliberately not part of the published UI.
