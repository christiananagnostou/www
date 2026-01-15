# AGENTS.md

This guide orients agentic coders working in this repo. Keep it concise, follow existing patterns, and match the project's formatting and architectural style.

## Project Snapshot

- Next.js (pages router) + React 19 + TypeScript.
- Styling uses `styled-components` (plus Framer Motion in UI).
- Tests run with Vitest and JSDOM.
- Linting uses `oxlint` for JS/TS and `stylelint` for styles.

## Repo Layout

- `pages/` defines route-level pages (pages router).
- `components/` holds reusable UI, usually default-exported.
- `lib/` contains data helpers and structured data generators.
- `db/` contains Redis helpers for server-side storage.
- `public/` holds static assets.

## Install

- Use npm (repo has `package-lock.json`).
- `npm install`

## Environment Variables

- Strava integration uses `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`, `STRAVA_REDIRECT_URI`.
- Redis uses `REDIS_URL` for server-side likes storage.
- Keep secrets out of the repo; prefer `.env.local`.

## Dev / Build / Start

- Dev server: `npm run dev`
- Production build: `npm run build`
- Serve build: `npm run start`

## Linting & Formatting

- JS/TS lint: `npm run lint`
- CSS/styled-components lint: `npm run lint:css`
- Format with Prettier if needed: `npx prettier --write .`
- Prettier runs with `prettier-plugin-organize-imports` enabled.

## Tests

- Full test run: `npm test`
- Watch mode: `npm test -- --watch`
- Single file: `npm test -- lib/structured/home.spec.ts`
- Single test by name: `npm test -- -t "generates structured data"`
- Direct Vitest: `npx vitest --run lib/structured/home.spec.ts`

## Test Conventions

- Vitest + JSDOM (`vitest.config.mts`).
- Tests live next to code, usually `*.spec.ts`.
- Favor explicit fixtures and clear expectation blocks.

## Imports

- Order: external packages → internal absolute/alias → relative imports.
- Separate groups with blank lines.
- Use `import type` for type-only imports.
- Keep paths short; prefer local barrel files when present.

## Formatting (Prettier)

- No semicolons.
- Single quotes.
- 2-space indentation.
- 120 column print width.
- Trailing commas where valid (ES5).
- Keep JSX props on a single line unless it hurts readability.

## TypeScript

- `strict: true` in `tsconfig.json`.
- Prefer `type` for simple shapes and unions; `interface` for public prop surfaces is acceptable.
- Avoid `any`; when necessary, isolate and document with a narrow scope.
- Use `as const` for literal config objects.
- Keep types near usage (same file) unless shared broadly.

## React / Next.js

- Components are function components (no `React.FC`).
- Default-export components are common in `components/`.
- Prefer hooks + `useMemo`/`useCallback` for expensive or stable logic.
- Pages are in `pages/`; avoid app-router patterns.
- Use `next/link` for internal navigation.

## State & Data Flow

- Prefer local component state and hooks over new global stores.
- Memoize expensive derived values with `useMemo`.
- Keep event handlers stable with `useCallback` when passed deeply.
- Keep data helpers pure and colocated under `lib/`.

## Accessibility & Semantics

- Use semantic HTML elements (`main`, `section`, `header`, `nav`).
- Provide `aria-label` for icon-only links or buttons.
- Ensure interactive elements are keyboard accessible.
- Maintain heading hierarchy when adding new sections.

## Styled Components & CSS

- Styled components live at the bottom of component files.
- Use nested selectors sparingly; keep specificity low.
- Prefer CSS variables already defined (e.g., `var(--accent)`).
- `stylelint` rules enforce:
  - No named colors; prefer hex.
  - Long hex format (e.g., `#ffffff`).
  - Only these units: `px`, `%`, `s`, `ms`, `fr`, `rem`, `em`, `vw`, `vh`, `deg`.
  - No unknown properties/selectors.

## Naming

- Components: `PascalCase` file and component names.
- Hooks: `useX`.
- Utilities: `camelCase` (files like `calculateBest.ts`).
- Constants: `UPPER_SNAKE_CASE`.
- Types: `PascalCase` and suffixed with `Type` when appropriate.

## Error Handling

- Prefer explicit guards and early returns.
- For data loaders, return safe defaults on failure (e.g., empty arrays).
- Log errors with `console.error` only when helpful.

## Data & Utilities

- Structured data helpers live in `lib/structured/`.
- Strava helpers live in `lib/strava/` and may call external APIs.
- Keep helper functions pure where possible.

## Tests and Fixtures

- Use descriptive test names and focused `describe` blocks.
- Favor literal inline fixtures for clarity over abstract factories.
- Avoid global test state; reset or recreate per test.

## Cursor/Copilot Rules

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found in this repo.

## When in Doubt

- Match the closest existing file.
- Keep changes minimal and localized.
- Run targeted tests and linting for touched areas when practical.
