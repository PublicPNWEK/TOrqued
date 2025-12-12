# Claude AI Instructions for TOrqued

## Project Context

TOrqued is an enterprise-grade Shopify theme with integrated React/TypeScript dashboard. This is a hybrid application combining Shopify Liquid templates with a modern React frontend.

## Key Architecture Points

### Technology Stack
- **Frontend**: React 18 + TypeScript 5.6 (strict mode)
- **State Management**: Zustand (UI state) + React Query (server state)
- **Build**: Vite 5.3 with ESM modules
- **Backend**: Node.js with Express, WebSocket (ws)
- **Shopify**: Liquid templates, Theme App Extensions
- **Testing**: Vitest, Playwright

### Directory Layout
```
src/
├── client/          # React app (TypeScript)
│   ├── components/  # Functional components with hooks
│   ├── hooks/       # Custom React hooks
│   └── store.ts     # Zustand stores
└── server/          # Express server
sections/            # Shopify Liquid sections
templates/           # Shopify page templates
scripts/             # Build scripts (ESM .mjs files)
```

## Critical Security Patterns

### XSS Prevention in Liquid Templates
**ALWAYS** use the `| json` filter when passing data to JavaScript:

```liquid
<!-- ✅ CORRECT -->
<script>
const config = {
  customerId: {{ customer.id | json }},
  email: {{ customer.email | json }}
};
</script>

<!-- ❌ WRONG - Creates XSS vulnerability -->
<script>
const customerId = {{ customer.id }};
</script>
```

### Secrets Management
- Never commit `.env` files
- Use `npm run migrate-secrets` for AWS/GCP Secrets Manager
- All sensitive data must use environment variables

## Code Conventions

### React/TypeScript
- **Components**: Functional components with hooks only
- **Exports**: Named exports (except main App.tsx)
- **File naming**: PascalCase for components (`OnboardingTour.tsx`)
- **Types**: Always provide explicit types, no `any` without justification
- **State**: Zustand for global UI state, React Query for server data

### Shopify Liquid
- Document sections with `{% comment %}` blocks
- Use `{{ 'asset.js' | asset_url }}` for all asset references
- Always validate with `npm run shopify:validate` before deploy

### Scripts
- ES modules only (`.mjs` extension or `"type": "module"`)
- Include `#!/usr/bin/env node` shebang
- Kebab-case naming (`build-shopify.mjs`)

## Build & Deployment

### Development Workflow
```bash
npm ci                    # Install dependencies
npm run dev              # Vite dev server with HMR
npm run lint             # ESLint validation
npm test                 # Run Vitest tests
npm run build            # Production build
```

### Shopify Deployment
```bash
npm run shopify:validate # Validate theme structure
npm run shopify:deploy   # Build and upload to Shopify
```

The build creates:
- `dist/torqued-dashboard.js` - Main React bundle
- `dist/torqued-dashboard.css` - Application styles

These are referenced in `sections/torqued-interface.liquid`.

## Testing Requirements

- **Unit Tests**: Vitest for React components and utilities
- **E2E Tests**: Playwright for user flows
- **Theme Validation**: `scripts/validate-theme.mjs` before Shopify deploy
- Always test in both dev and production builds

## Common Patterns

### Component Structure
```typescript
// Named export, explicit types
export function MyComponent({ title, count }: { title: string; count: number }) {
  // Zustand for UI state
  const theme = useUIStore((s) => s.theme);
  
  // React Query for server data
  const { data, isLoading } = useQuery(['key'], fetchFn);
  
  return <div>{/* JSX */}</div>;
}
```

### Loading States
Use skeleton loaders (see `components/Skeleton.tsx`) for loading states.

### Large Lists
Use virtualization (react-window) for lists >100 items (see `components/VirtualizedTable.tsx`).

## Things to Avoid

1. ❌ Class components (use functional components)
2. ❌ Default exports (except App.tsx)
3. ❌ `any` type without justification
4. ❌ Unfiltered Liquid output to JavaScript
5. ❌ Modifying `node_modules` directly
6. ❌ Committing secrets or `.env` files
7. ❌ Skipping theme validation before deploy

## Enterprise Features

- **Edge Computing**: Cloudflare Workers for global CDN
- **AI**: OpenAI integration for recommendations
- **Real-time**: WebSocket server for live updates
- **Security**: OAuth2, RBAC, ML-based fraud detection
- **Multi-tenant**: Isolated environments with auto-scaling

## Documentation References

- **Setup**: README.md
- **Contributing**: CONTRIBUTING.md
- **Shopify Import**: THEME_IMPORT.md
- **Competitive Analysis**: COMPETITIVE_ADVANTAGES.md

## Version Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- TypeScript 5.6.3
