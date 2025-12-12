# OpenAI Instructions for TOrqued

## Project Summary

TOrqued is an enterprise-grade Shopify theme with integrated React/TypeScript dashboard. It's a hybrid application combining Shopify's Liquid templating system with modern React architecture.

**Key Technologies:**
- React 18 + TypeScript 5.6 (strict mode)
- Vite 5.3 (build tool with HMR)
- Zustand (global state) + React Query (server state)
- Shopify Liquid templates
- Node.js ESM modules
- Vitest + Playwright (testing)

## Architecture

### Directory Structure
```
src/
  client/          # React app (TypeScript)
    components/    # UI components (PascalCase.tsx)
    hooks/         # Custom React hooks
    store.ts       # Zustand stores
  server/          # Express backend
sections/          # Shopify Liquid sections
templates/         # Shopify page templates
scripts/           # Build scripts (kebab-case.mjs)
config/            # Shopify theme configuration
```

### Build System
- **Development**: Vite dev server with HMR on port 5173
- **Production**: Optimized bundles with code splitting
- **Shopify**: Single-bundle mode when `BUILD_TARGET=shopify`

Output: `dist/torqued-dashboard.{js,css}` referenced in Liquid templates

## Code Conventions

### React/TypeScript Components
```typescript
// Use functional components with hooks
// Named exports (except App.tsx)
// Explicit types, no 'any' without justification
export function MyComponent({ title, count }: Props) {
  const store = useUIStore((s) => s.data);
  return <div>{title}</div>;
}
```

**Rules:**
- Functional components only (no classes)
- PascalCase file names
- Named exports
- Keep components small
- Extract logic to custom hooks

### Shopify Liquid Templates
```liquid
{% comment %}
  Always document section purpose
{% endcomment %}

<!-- SECURITY: Use | json filter for JS data -->
<script>
window.config = {
  customerId: {{ customer.id | json }},
  email: {{ customer.email | json }}
};
</script>

<!-- Load assets with asset_url filter -->
<script src="{{ 'torqued-dashboard.js' | asset_url }}"></script>
```

### Build Scripts
```javascript
#!/usr/bin/env node

/**
 * Script purpose description
 */

import fs from 'fs';
// ES modules only
```

**Requirements:**
- ES modules (`.mjs` extension)
- Shebang line for executables
- JSDoc comments
- Kebab-case naming

## Security Requirements

### XSS Prevention (Critical)
Always use Liquid's `| json` filter when outputting data to JavaScript:

```liquid
<!-- ✅ CORRECT - Prevents XSS -->
<script>
const user = {{ customer | json }};
</script>

<!-- ❌ WRONG - XSS Vulnerability -->
<script>
const userId = {{ customer.id }};
</script>
```

### Secrets Management
- Never commit `.env` files
- Use environment variables for all secrets
- Production: AWS/GCP Secrets Manager via `npm run migrate-secrets`
- No hardcoded API keys, tokens, or credentials

## Development Workflow

### Setup
```bash
npm ci                        # Install dependencies
cp .env.example .env          # Configure environment
npm run dev                   # Start development server
```

### Development
```bash
npm run dev                   # Vite dev server (localhost:5173)
npm run build                 # Production build
npm run preview               # Preview production build
npm run lint                  # Run ESLint
npm test                      # Run Vitest tests
npm run test:playwright       # Run E2E tests
```

### Shopify Deployment
```bash
npm run shopify:validate      # Validate theme structure
npm run shopify:deploy        # Build and deploy to Shopify
```

**Deployment Process:**
1. Validates theme structure
2. Builds optimized bundles
3. Uploads to Shopify theme
4. Creates/updates Liquid sections

## State Management

### Global UI State (Zustand)
```typescript
import { useUIStore } from './store';

function Component() {
  const darkMode = useUIStore((s) => s.darkMode);
  const toggle = useUIStore((s) => s.toggleDarkMode);
}
```

### Server State (React Query)
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery(['key'], fetchFn);
const mutation = useMutation(updateFn);
```

## Testing Strategy

### Unit Tests (Vitest)
- Test React components in isolation
- Mock external dependencies
- Focus on behavior, not implementation
- Run: `npm test`

### E2E Tests (Playwright)
- Test complete user workflows
- Cross-browser testing
- Critical path verification
- Run: `npm run test:playwright`

### Theme Validation
- Validates required Shopify theme files
- Checks directory structure
- Validates JSON schemas
- Run: `npm run shopify:validate`

## Common Patterns

### Loading States
```typescript
import { Skeleton } from './components/Skeleton';
<Skeleton height={32} width="50%" />
```

### Virtualized Lists
```typescript
import { VirtualizedTable } from './components/VirtualizedTable';
<VirtualizedTable rows={data} height={600} />
```

### User Onboarding
```typescript
import { OnboardingTour } from './components/OnboardingTour';
<OnboardingTour steps={steps} />
```

## Performance Best Practices

- **Code Splitting**: Use dynamic imports for large components
- **Memoization**: Use React.memo for expensive components
- **Virtualization**: Use react-window for long lists (>100 items)
- **Edge Caching**: Cloudflare Workers for static assets
- **Bundle Optimization**: Vite's automatic tree-shaking

## Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Support keyboard navigation
- Manage focus properly
- Test with screen readers

## Pre-Deployment Checklist

Before deploying to Shopify:
1. ✅ `npm run lint` - No linting errors
2. ✅ `npm test` - All tests pass
3. ✅ `npm run build` - Successful build
4. ✅ `npm run shopify:validate` - Valid theme structure
5. ✅ Test in dev mode - Verify functionality
6. ✅ Security review - No exposed secrets
7. ✅ `npm run shopify:deploy` - Deploy

## Common Mistakes to Avoid

1. ❌ Using class components (use functional)
2. ❌ Default exports (except App.tsx)
3. ❌ Using `any` type without justification
4. ❌ Forgetting `| json` filter in Liquid→JS
5. ❌ Committing `.env` or secrets
6. ❌ Modifying `node_modules` directly
7. ❌ Skipping theme validation
8. ❌ Ignoring ESLint errors

## Enterprise Features

### AI-Powered
- OpenAI product recommendations
- Dynamic pricing optimization
- Demand forecasting
- Content personalization

### Edge Computing
- Cloudflare Workers integration
- Sub-50ms global response times
- Edge-side A/B testing

### Real-time
- WebSocket server for live updates
- Real-time analytics dashboard
- Live notifications

### Security
- OAuth2 + RBAC authentication
- ML-based fraud detection
- Device fingerprinting
- Transaction risk scoring

## Documentation

- **README.md**: Setup and quick start guide
- **CONTRIBUTING.md**: Development workflow and guidelines
- **THEME_IMPORT.md**: Shopify theme import instructions
- **COMPETITIVE_ADVANTAGES.md**: Feature comparison and benefits

## System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **TypeScript**: 5.6.3
- **Shopify**: Store with API access
- **Git**: Version control

## Getting Help

- Check existing components: `src/client/components/`
- Review build scripts: `scripts/`
- Run validation: `npm run shopify:validate`
- See documentation: README.md, CONTRIBUTING.md
- Test patterns: Look at existing Vitest tests
