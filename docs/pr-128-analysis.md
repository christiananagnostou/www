PR 128 Audit (bookmarklet metrics + tooling + fitness)
======================================================

What changed
------------
- Tooling: added flat ESLint config (`eslint.config.mjs`), expanded legacy `.eslintrc.json`, Prettier config, Stylelint config/ignore, VS Code settings/recommendations, Copilot instructions. Lint script still points to `oxlint`, so ESLint isn’t currently run in CI/scripts; Next build will still try ESLint.
- Bookmarklets: installs tracking via Redis (`lib/bookmarklets/metrics.ts`), public API route with CORS open (`pages/api/bookmarklets/metrics/[bookmarkletId].ts`), UI changes on `pages/bookmarklets.tsx` with install button/count, new bookmarklet icon.
- Fitness: new Strava fitness page (`pages/fitness.tsx`) with heavy styling and charts (`components/Fitness/*`, `uplot` dep), Strava helpers updated, new structured data/calcs.
- UI refresh: new shared `Section` component + global style tweaks ripple through many components (home, articles, art, lab, SVGs) for layout/typography/ARIA cleanup.
- Data/structured tweaks: minor lib/structured updates, RSS/API small edits.

Key issues/gaps
---------------
- Mixed lint stacks: `oxlint` used in scripts but ESLint configs/deps added (both flat and eslintrc). Editor might not underline because extension may pick wrong config; Next build may lint with ESLint but configs conflict/duplicate.
- Stylelint duplication: legacy `.stylelintrc` and new `stylelint.config.mjs` coexist; ignore file skips `.js/.jsx` so styled-components in JS would be unchecked.
- Fitness feature readiness: new page requires Strava env/Redis; no tests, no empty/error states documented, high styling complexity. Needs verification before shipping.
- Bookmarklet metrics: API is public POST/GET with no auth/rate limit; relies on Redis key naming matching bookmarklet titles; localStorage install state can drift from server counts.
- Formatting/ARIA changes touched many files without targeted tests; risk of regressions.
- VS Code feedback loop: goal is inline warnings, but current setup (oxlint script + ESLint extension + two ESLint configs) is likely not wired to surface errors consistently.

Execution plan
--------------
1) Decide lint strategy: keep ESLint for editor/Next and oxlint for fast CI, or consolidate. If keeping both, ensure `eslint.config.mjs` is the single config, drop `.eslintrc.json`, add an `eslint` npm script, and document how to run. If consolidating to oxlint-only, disable Next lint or add a minimal ESLint shim to satisfy Next.  
2) VS Code underline fix: align `.vscode/settings.json` with chosen lint stack (correct config path, working directory), ensure `eslint.useFlatConfig` is correct, and optionally add `oxlint` extension/commands if preferred. Validate locally that warnings/errors show.  
3) Stylelint rationalization: pick one config (`stylelint.config.mjs`), remove `.stylelintrc` or mirror rules, and adjust ignores to ensure styled-components in TS/JS are linted. Add a `stylelint` script for consistency.  
4) Fitness feature hardening: document required env vars/Redis, add loading/error/empty states, verify build size/SSR behavior, and add basic unit tests for Strava helpers. If shipping later, consider feature-flagging or moving to draft branch.  
5) Bookmarklet metrics tightening: handle missing Redis gracefully, guard against duplicate/abusive POSTs (debounce + server-side rate limit), validate bookmarklet IDs (consistent slug instead of title), and add a small API test.  
6) Visual regression sweep: spot-check key pages touched by Section/global style changes (home, articles, art, projects, lab) for layout/ARIA regressions; adjust where needed.  
7) Docs/update scripts: reflect chosen lint/style workflows in README, and ensure `package.json` scripts/lockfiles match.

Open questions
--------------
- Do we want Next’s ESLint check in `next build`, or rely solely on oxlint?  
- Should the fitness page ship now or be parked/flagged until tested and env-ready?  
- For bookmarklet installs, is anonymous public POST acceptable, or should we restrict/validate origin?  
- Any preference on keeping the new global/Section styling versus limiting the PR scope? 
