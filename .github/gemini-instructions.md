# Gemini AI Instructions for TOrqued

## About This Project

TOrqued is a production-grade Shopify theme with React/TypeScript dashboard integration. It combines traditional Shopify Liquid templating with modern React architecture.

## Tech Stack Summary

- **React 18** with TypeScript 5.6 (strict mode enabled)
- **Vite 5.3** for build tooling and HMR
- **Zustand** for global UI state management
- **React Query** for server state and data fetching
- **Shopify Liquid** for theme templates
- **Vitest + Playwright** for testing
- **Node.js ESM** for build scripts

## Project Structure

```
TOrqued/
├── .github/             # GitHub configs and workflows
├── src/
│   ├── client/         # React application
│   │   ├── components/ # React components (PascalCase.tsx)
│   │   ├── hooks/      # Custom hooks
│   │   └── store.ts    # Zustand state
│   └── server/         # Express backend
├── sections/           # Shopify Liquid sections
├── templates/          # Shopify page templates
├── scripts/            # Build scripts (kebab-case.mjs)
├── config/             # Shopify theme config
└── locales/            # Internationalization
```

## Code Style Guidelines

### TypeScript/React
- Use **functional components** with hooks (no classes)
- **Named exports** for all components except App.tsx
- **Explicit typing** - avoid `any` type
- **File names**: PascalCase for components (`VirtualizedTable.tsx`)
- Keep components focused and small
- Extract complex logic to custom hooks

### Shopify Liquid
- Add descriptive `{% comment %}` blocks
- **Security**: Always use `{{ variable | json }}` when outputting to JS
- Reference assets: `{{ 'file.js' | asset_url }}`
- Validate structure before deploy

### Build Scripts
- ES modules with `.mjs` extension
- Include shebang: `#!/usr/bin/env node`
- Descriptive JSDoc comments
- Kebab-case naming

## Critical Security Requirements

### XSS Prevention
When passing Shopify data to JavaScript, ALWAYS use the `| json` filter:

```liquid
<!-- SAFE ✅ -->
<script>
window.__CONFIG__ = {
  shopDomain: {{ shop.permanent_domain | json }},
  customerId: {{ customer.id | json }}
};
</script>

<!-- UNSAFE ❌ - XSS VULNERABILITY -->
<script>
const shopDomain = "{{ shop.permanent_domain }}";
</script>
```

### Environment Security
- Never commit `.env` files (in .gitignore)
- Use `npm run migrate-secrets` for production secrets
- Store sensitive data in AWS/GCP Secrets Manager
- No hardcoded API keys or tokens

## Development Commands

```bash
# Setup
npm ci                    # Install dependencies (CI-friendly)
cp .env.example .env      # Configure environment

# Development
npm run dev               # Start Vite dev server (port 5173)
npm run build             # Production build
npm run preview           # Preview production build

# Testing & Validation
npm run lint              # ESLint check
npm test                  # Run Vitest tests
npm run test:playwright   # E2E tests
npm run shopify:validate  # Validate theme structure

# Shopify Deployment
npm run shopify:deploy    # Build and upload to Shopify

# Advanced
npm run optimize:bundle   # Bundle optimization
npm run deploy:edge       # Deploy to Cloudflare Workers
npm run ai:optimize       # AI-powered optimization
```

## Build Process

### Standard Build
Creates chunked bundles for optimal loading:
- `vendor` chunk: React, React-DOM
- `query` chunk: React Query
- `ui` chunk: UI libraries
- `store` chunk: Zustand

### Shopify Build
Set `BUILD_TARGET=shopify` for single-bundle output (no chunks).
Used by `npm run shopify:deploy`.

Output files:
- `dist/torqued-dashboard.js` - Main bundle
- `dist/torqued-dashboard.css` - Styles

## State Management Patterns

### UI State (Zustand)
```typescript
import { useUIStore } from './store';

function MyComponent() {
  const darkMode = useUIStore((s) => s.darkMode);
  const toggleDark = useUIStore((s) => s.toggleDarkMode);
  // ...
}
```

### Server State (React Query)
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery(['users'], fetchUsers);
const mutation = useMutation(updateUser);
```

## Testing Guidelines

### Unit Tests (Vitest)
- Test React components and utilities
- Mock external dependencies
- Focus on behavior, not implementation

### E2E Tests (Playwright)
- Test complete user flows
- Test in multiple browsers
- Verify critical paths

### Theme Validation
Run `npm run shopify:validate` to check:
- Required directories exist
- Required files present
- Valid JSON schemas
- Asset references correct

## Common Component Patterns

### Skeleton Loaders
Use `components/Skeleton.tsx` for loading states:
```typescript
<Skeleton height={32} width="50%" />
```

### Virtualized Tables
For large datasets (>100 rows), use `components/VirtualizedTable.tsx`:
```typescript
<VirtualizedTable rows={data} height={600} />
```

### Onboarding
Use `components/OnboardingTour.tsx` for guided user experiences.

## Deployment Checklist

Before deploying to Shopify:
1. ✅ Run `npm run lint` (no errors)
2. ✅ Run `npm test` (all pass)
3. ✅ Run `npm run build` (successful)
4. ✅ Run `npm run shopify:validate` (valid structure)
5. ✅ Test in development mode
6. ✅ Review security (no exposed secrets)
7. ✅ Deploy: `npm run shopify:deploy`

## Enterprise Features

### Edge Computing
Cloudflare Workers for <50ms global response times.

### AI Integration
OpenAI-powered features:
- Product recommendations
- Dynamic pricing
- Demand forecasting

### Real-time Features
WebSocket server for:
- Live analytics
- Real-time notifications
- Collaboration features

### Multi-tenant
Isolated tenant environments with custom branding and auto-scaling.

## Best Practices

### Performance
- Code splitting and lazy loading
- React.memo for expensive components
- Virtualization for long lists
- Edge caching for static assets

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management

### Error Handling
- Try-catch for async operations
- User-friendly error messages
- Error boundaries in React
- Proper error logging

## Common Pitfalls to Avoid

1. Don't use class components
2. Don't use default exports (except App.tsx)
3. Don't forget XSS prevention in Liquid
4. Don't skip validation before Shopify deploy
5. Don't commit .env or secrets
6. Don't modify node_modules directly
7. Don't ignore ESLint errors
8. Don't create circular dependencies

## Help & Resources

- **README.md**: Setup and quick start
- **CONTRIBUTING.md**: Development workflow
- **THEME_IMPORT.md**: Shopify theme import guide
- Run validation: `npm run shopify:validate`
- Check patterns: See existing components in `src/client/components/`

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Shopify store with API access
- Git for version control
