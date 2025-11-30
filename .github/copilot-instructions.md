# Copilot Instructions for TOrqued

## Project Overview

TOrqued is an enterprise-grade Shopify theme with integrated React/TypeScript dashboard featuring:
- **Shopify Liquid** templates and sections for theme structure
- **React 18 + TypeScript** for the interactive dashboard
- **Vite** for modern build tooling with HMR
- **Enterprise features**: Edge computing, AI-powered analytics, real-time monitoring
- **Security**: OAuth2, RBAC, fraud detection, XSS prevention

## Architecture

### Directory Structure
```
├── src/
│   ├── client/          # React application (TypeScript)
│   │   ├── components/  # React components (OnboardingTour, VirtualizedTable, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   └── store.ts     # Zustand state management
│   └── server/          # Server-side code
├── sections/            # Shopify Liquid sections
├── templates/           # Shopify Liquid templates
├── layout/              # Shopify theme layout
├── config/              # Shopify theme configuration
├── locales/             # Internationalization files
├── scripts/             # Build and deployment scripts (Node.js/ESM)
└── snippets/            # Reusable Liquid snippets
```

### Technology Stack
- **Frontend**: React 18, TypeScript 5.6, Zustand (state), React Query (data fetching)
- **Build Tools**: Vite 5.3, esbuild
- **Backend**: Express, Node.js (ESM modules), WebSocket (ws)
- **Testing**: Vitest, Playwright
- **Shopify**: Liquid templates, Theme App Extensions

## Code Style & Conventions

### TypeScript/React
- Use **functional components** with hooks (not class components)
- Use **TypeScript** for all new `.ts` and `.tsx` files
- **Strict mode** is enabled - always provide proper types
- Use **named exports** for components, not default exports (except for main App component)
- Component file names: PascalCase (e.g., `OnboardingTour.tsx`)
- Use **Zustand** for global state, **React Query** for server state
- Keep components focused and small; extract logic into custom hooks

### Liquid Templates
- Always use comments to document section purposes
- Use `{{ variable | json }}` filter for outputting data into JavaScript to prevent XSS
- Reference sections clearly: `{% comment %}... {% endcomment %}`
- Follow Shopify's Liquid best practices

### Scripts
- All scripts use **ES modules** (`.mjs` or `"type": "module"` in package.json)
- Use `#!/usr/bin/env node` shebang for executable scripts
- Include descriptive JSDoc comments for script purposes
- Scripts are in `scripts/` directory and named with kebab-case

### File Naming
- React components: `PascalCase.tsx`
- Scripts: `kebab-case.mjs` or `kebab-case.js`
- Liquid files: `kebab-case.liquid`
- Config files: `kebab-case.json`

## Building & Testing

### Available Commands
```bash
npm ci                    # Install dependencies (use in CI/CD)
npm run dev              # Start Vite dev server with HMR
npm run build            # Build production bundle
npm run lint             # Run ESLint
npm test                 # Run Vitest tests
npm run test:playwright  # Run Playwright E2E tests
npm run shopify:validate # Validate Shopify theme structure
npm run shopify:deploy   # Build and deploy to Shopify
```

### Before Committing
1. **Always run linting**: `npm run lint`
2. **Run tests**: `npm test`
3. **Validate theme** (if modifying Shopify files): `npm run shopify:validate`
4. **Build successfully**: `npm run build`

### Testing Guidelines
- Write tests in Vitest for React components and utilities
- Use Playwright for E2E testing of user flows
- Validate theme structure with `scripts/validate-theme.mjs` before deployment
- Test in both development and production builds

## Security Requirements

### Critical Security Practices
1. **XSS Prevention**: Always use Liquid's `| json` filter when outputting data into JavaScript
   ```liquid
   <!-- CORRECT -->
   <script>
   const config = {
     customerId: {{ customer.id | json }}
   };
   </script>
   
   <!-- INCORRECT - XSS vulnerability -->
   <script>
   const customerId = {{ customer.id }};
   </script>
   ```

2. **No Hardcoded Secrets**: Use environment variables for sensitive data
   - Store secrets in `.env` (never commit this file!)
   - Use AWS/GCP Secrets Manager for production: `npm run migrate-secrets`

3. **Input Validation**: Validate all user inputs on both client and server
4. **OAuth2 & RBAC**: Follow existing authentication patterns
5. **Fraud Detection**: Use ML-based patterns already in the codebase

### Dependencies
- Run `npm audit` to check for vulnerabilities
- Keep dependencies updated but test thoroughly after updates
- Use exact versions in `package.json` for critical dependencies

## Shopify Theme Development

### Theme Structure Requirements
A valid Shopify theme must have:
- `config/settings_schema.json` - Theme settings
- `layout/theme.liquid` - Main layout
- `locales/en.default.json` - Default translations
- `sections/` - Reusable sections
- `templates/` - Page templates

### Deployment Process
1. **Build assets**: `npm run build` (creates `dist/` output)
2. **Validate theme**: `npm run shopify:validate`
3. **Deploy**: `npm run shopify:deploy`
   - Builds Shopify-compatible bundle
   - Uploads to Shopify theme
   - Creates sections with proper schema

### Asset Management
- Built React app outputs to `dist/torqued-dashboard.js` and `dist/torqued-dashboard.css`
- These are referenced in `sections/torqued-interface.liquid` via `{{ 'torqued-dashboard.js' | asset_url }}`
- Use Shopify's `asset_url` filter for all asset references

## Best Practices

### Performance
- Use **code splitting** and **lazy loading** for large components
- Leverage **React.memo** for expensive components
- Use **virtualization** for large lists (react-window)
- Enable **edge caching** via Cloudflare Workers for static assets

### State Management
- **Zustand** for UI state (dark mode, user preferences)
- **React Query** for server state (API data, caching, mutations)
- Avoid prop drilling - use context or Zustand stores
- Keep state close to where it's used

### Component Patterns
- **Skeleton loaders** for loading states (see `components/Skeleton.tsx`)
- **Onboarding tours** for user guidance (see `components/OnboardingTour.tsx`)
- **Virtualized tables** for large datasets (see `components/VirtualizedTable.tsx`)
- **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation

### Error Handling
- Use try-catch blocks for async operations
- Provide user-friendly error messages
- Log errors appropriately (not sensitive data)
- Implement error boundaries in React

## Common Tasks

### Adding a New React Component
1. Create in `src/client/components/ComponentName.tsx`
2. Use TypeScript with proper prop types
3. Export as named export: `export function ComponentName(props: Props) { ... }`
4. Add tests if the component has logic
5. Import and use in parent components

### Adding a New Shopify Section
1. Create in `sections/section-name.liquid`
2. Add `{% schema %}` block with proper configuration
3. Document with `{% comment %}` block at the top
4. Reference required assets via `{{ 'asset.js' | asset_url }}`
5. Test with `npm run shopify:validate`

### Adding a New Script
1. Create in `scripts/script-name.mjs`
2. Add shebang: `#!/usr/bin/env node`
3. Add descriptive comment block explaining purpose
4. Use ES module syntax (`import`/`export`)
5. Add to package.json scripts if it should be runnable via npm

### Modifying Build Configuration
- Vite config: `vite.config.ts`
- TypeScript config: `tsconfig.json`
- Test carefully after changes
- Update documentation if build process changes

## Documentation

- **README.md**: User-facing setup and usage instructions
- **CONTRIBUTING.md**: Development workflow and guidelines
- **THEME_IMPORT.md**: Shopify theme import instructions
- **Code comments**: Use JSDoc for complex functions, inline comments sparingly
- **Liquid comments**: Document section purposes and requirements

## CI/CD

### GitHub Actions Workflows
- **CI** (`.github/workflows/ci.yml`): Lint, test, build on PRs
- **CodeQL** (`.github/workflows/codeql.yml`): Security scanning
- **Deploy Pages**: GitHub Pages deployment
- **Sync Branches**: Branch synchronization

### Pull Request Guidelines
1. Create feature branch: `feature/description` or `fix/description`
2. Make focused, atomic commits
3. Ensure CI passes (lint, tests, build)
4. Request review from maintainers
5. Squash and merge after approval

## Enterprise Features

### AI-Powered Features
- Product recommendations (OpenAI integration)
- Dynamic pricing optimization
- Demand forecasting
- Content personalization

### Edge Computing
- Cloudflare Workers for global CDN
- Edge-side A/B testing
- Intelligent caching strategies

### Real-Time Features
- WebSocket server for live updates
- Real-time analytics dashboard
- Live notification system

### Multi-Tenant Support
- Isolated tenant environments
- Custom branding per tenant
- Auto-scaling based on usage

## Common Pitfalls to Avoid

1. **Don't** modify `node_modules/` directly - use patches if needed
2. **Don't** commit `.env` files or secrets
3. **Don't** use `any` type in TypeScript without justification
4. **Don't** forget XSS prevention in Liquid templates
5. **Don't** skip validation scripts before Shopify deployment
6. **Don't** use default exports except for main App component
7. **Don't** create circular dependencies between modules
8. **Don't** ignore linting errors - fix them or justify suppressions

## Getting Help

- Check **CONTRIBUTING.md** for development workflow
- Review **README.md** for setup instructions
- Run `npm run shopify:validate` to debug theme issues
- Check existing code patterns in `src/client/components/` for examples
- Review scripts in `scripts/` for build and deployment patterns

## Version Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- See `package.json` for exact dependency versions
