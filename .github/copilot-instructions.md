# Copilot Instructions

This is a personal portfolio site built with Next.js, showcasing articles, fitness data, projects, and interactive bookmarklets. The codebase emphasizes clean architecture, structured data, and seamless third-party integrations.

## Architecture Overview

- **Pages Router**: Uses Next.js pages directory with TypeScript and styled-components
- **Layout Pattern**: Global layout in `components/Layout.tsx` with conditional blur effects based on route
- **Styled System**: Custom CSS variables in `components/GlobalStyle.ts` with design tokens for colors, spacing, and typography
- **Data Sources**: File-based articles (`public/articles/*.md`), Strava API for fitness data, Redis for caching

## Key Patterns

### Component Organization

```
components/
├── [Feature]/          # Feature-specific components (Home/, Articles/, etc.)
├── Shared/            # Reusable UI primitives (Section.ts, Heading.ts)
├── SVG/               # Icon components with consistent naming
└── Hooks/             # Custom React hooks (useScroll, useWindowSize)
```

### Styling Conventions

- Use styled-components with `$variant` props for component variations
- Prefix transient props with `$` (e.g., `$variant`, `$isActive`)
- CSS variables defined in `:root` for consistent theming
- Motion components from framer-motion for animations

### Data Handling

- **Articles**: Markdown files in `public/articles/` with gray-matter frontmatter
- **Structured Data**: Schema.org JSON-LD in `lib/structured/` with comprehensive test coverage
- **Strava Integration**: Token-based auth with activity fetching and caching patterns
- **Redis Caching**: Connection management in `db/redis.ts` with error handling

### API Patterns

- API routes serve JavaScript files for bookmarklets (`pages/api/hotbids.ts`)
- Strava data processing with unit conversion utilities (`lib/strava/utils.ts`)
- Activity metrics calculation with performance optimization

## Development Workflow

### Running the App

```bash
bun dev              # Start with Turbopack (preferred)
bun run lint         # ESLint + TypeScript checks (strict)
bun run lint:css     # Stylelint for styled-components (strict)
bun test             # Vitest with jsdom environment
```

### Enhanced Linting Standards

This project enforces strict code quality standards:

- **TypeScript**: No `any` types, consistent type imports, interface definitions
- **React**: Prop sorting, JSX optimization, accessibility requirements, hooks dependency checking
- **Styled Components**: CSS property ordering, color function modernization, no vendor prefixes
- **Code Quality**: Template literals over concatenation, destructuring patterns, nullish coalescing
- **Import Organization**: Automatic sorting with `prettier-plugin-organize-imports`

Use `bun run lint --fix` and `bun run lint:css --fix` for automated fixes where possible.

### Testing Strategy

- Vitest for unit tests, focused on structured data validation
- Test files use `.spec.ts` suffix in `lib/structured/`
- Mock external APIs and test data transformations
- Comprehensive schema.org breadcrumb and navigation testing

### Third-Party Integrations

- **Strava API**: Full OAuth flow documented in `lib/strava/index.ts` comments
- **Redis**: Serverless-friendly connection pattern with `connectRedis()`
- **Vercel Analytics**: Integrated in `_app.tsx` for performance monitoring

## Project-Specific Conventions

### Bookmarklets Feature

- JavaScript code stored as template strings in `lib/bookmarklets/index.tsx`
- API endpoints serve scripts from `public/scripts/` directory
- Dynamic BASE_URL injection for environment-agnostic deployment

### Content Management

- Articles use frontmatter with `hidden` and `nolist` flags for visibility control
- Structured data generation for SEO with type-safe interfaces
- Image optimization through Next.js `sharp` integration

### Performance Patterns

- Redis caching for Strava data to respect API limits
- Lazy loading for chart components using dynamic imports
- CSS-in-JS with styled-components for component encapsulation

## Common Gotchas

### Static Asset Imports

- **Never use absolute paths** like `'/public/logo.webp'` - these cause Turbopack module resolution errors
- **Use relative paths** from component location: `'../../public/logo.webp'`
- Static assets in `public/` directory require proper relative pathing from component files

### Environment-Specific BASE_URL

- `next.config.js` dynamically sets `NEXT_PUBLIC_BASE_URL` based on deployment environment
- Vercel production vs preview vs local development have different URL patterns
- Used extensively in bookmarklets and structured data generation

When working on this codebase, prioritize the existing patterns for styling, data fetching, and component organization. Always add tests for new structured data schemas and maintain the clean separation between UI components and business logic.
