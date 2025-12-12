# Perplexity MCP Instructions for TOrqued

## Quick Project Overview

**TOrqued** = Enterprise Shopify Theme + React Dashboard
- **Stack**: React 18, TypeScript 5.6, Vite 5.3, Shopify Liquid
- **State**: Zustand (UI) + React Query (API)
- **Purpose**: High-performance e-commerce dashboard with AI features

## Core Architecture

```
Hybrid Application:
├── Shopify Liquid (Theme Layer)
│   ├── sections/    - Reusable UI blocks
│   ├── templates/   - Page layouts
│   └── layout/      - Theme wrapper
└── React/TypeScript (Dashboard Layer)
    ├── src/client/  - React components
    ├── Vite build   - Modern bundler
    └── dist/        - Compiled assets
```

## Key Commands

```bash
# Development
npm ci              # Install (use in CI/CD)
npm run dev         # Dev server @ localhost:5173
npm run build       # Production build

# Quality
npm run lint        # ESLint check
npm test            # Vitest tests
npm run test:playwright  # E2E tests

# Shopify
npm run shopify:validate # Check theme structure
npm run shopify:deploy   # Build + upload to Shopify
```

## Code Style Quick Reference

### React Components
```typescript
// ✅ DO: Functional + hooks, named export, explicit types
export function MyComponent({ title }: { title: string }) {
  const state = useUIStore((s) => s.data);
  return <div>{title}</div>;
}

// ❌ DON'T: Class components, default export, any type
```

### Shopify Liquid Security
```liquid
<!-- ✅ DO: Use | json filter to prevent XSS -->
<script>
const config = {{ settings | json }};
</script>

<!-- ❌ DON'T: Direct output creates XSS -->
<script>
const value = {{ settings.key }};
</script>
```

## Critical Security Rules

1. **XSS Prevention**: ALWAYS use `{{ var | json }}` in Liquid→JavaScript
2. **No Secrets**: Never commit `.env` files
3. **Environment Vars**: All secrets via environment variables
4. **Production Secrets**: Use AWS/GCP Secrets Manager

## File Naming Conventions

- React components: `PascalCase.tsx` (e.g., `OnboardingTour.tsx`)
- Scripts: `kebab-case.mjs` (e.g., `build-shopify.mjs`)
- Liquid files: `kebab-case.liquid` (e.g., `main-product.liquid`)
- Configs: `kebab-case.json` (e.g., `settings_schema.json`)

## State Management Patterns

**Zustand** (Global UI State):
```typescript
const darkMode = useUIStore((s) => s.darkMode);
```

**React Query** (Server/API State):
```typescript
const { data, isLoading } = useQuery(['users'], fetchUsers);
```

## Build System

### Development Build
- Chunked bundles (vendor, query, ui, store)
- Source maps enabled
- HMR (Hot Module Replacement)

### Shopify Build
- Single bundle mode (`BUILD_TARGET=shopify`)
- Outputs: `dist/torqued-dashboard.{js,css}`
- Referenced in `sections/torqued-interface.liquid`

## Testing Approach

- **Vitest**: Unit tests for components/utilities
- **Playwright**: E2E tests for user flows
- **Theme Validation**: Custom script checks Shopify structure
- **Always test**: Dev AND production builds

## Common Component Patterns

```typescript
// Loading states
<Skeleton height={32} width="50%" />

// Large lists (>100 items)
<VirtualizedTable rows={data} height={600} />

// User guidance
<OnboardingTour steps={tourSteps} />
```

## Deployment Checklist

1. ✅ Lint pass: `npm run lint`
2. ✅ Tests pass: `npm test`
3. ✅ Build success: `npm run build`
4. ✅ Theme valid: `npm run shopify:validate`
5. ✅ Deploy: `npm run shopify:deploy`

## Things to Avoid

- ❌ Class components (use functional)
- ❌ Default exports (except App.tsx)
- ❌ `any` type without reason
- ❌ Unfiltered Liquid→JS output
- ❌ Committing secrets
- ❌ Skipping validation before deploy
- ❌ Modifying node_modules

## Enterprise Features

**Performance**: Cloudflare Workers, edge caching, <50ms global response
**AI**: OpenAI recommendations, dynamic pricing, forecasting
**Real-time**: WebSocket server, live analytics
**Security**: OAuth2, RBAC, ML fraud detection
**Multi-tenant**: Isolated environments, auto-scaling

## Project Structure

```
TOrqued/
├── .github/           # CI/CD, workflows, AI instructions
├── src/
│   ├── client/       # React app (TS strict mode)
│   │   ├── components/  # Functional components
│   │   ├── hooks/       # Custom React hooks
│   │   └── store.ts     # Zustand stores
│   └── server/       # Express backend
├── sections/         # Shopify Liquid sections
├── templates/        # Shopify templates
├── scripts/          # Build/deploy scripts (ESM)
├── dist/             # Build output (gitignored)
└── node_modules/     # Dependencies (gitignored)
```

## Version Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- TypeScript 5.6.3

## Documentation

- **README.md**: Setup guide
- **CONTRIBUTING.md**: Dev workflow
- **THEME_IMPORT.md**: Shopify import
- **COMPETITIVE_ADVANTAGES.md**: Feature details

## Quick Troubleshooting

**Build fails?** Check Node/npm versions, run `npm ci`
**Lint errors?** Run `npm run lint` and fix issues
**Theme invalid?** Run `npm run shopify:validate` for details
**Tests fail?** Check if changes broke existing functionality
**Deploy fails?** Verify `.env` configuration and Shopify credentials
