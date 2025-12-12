# Grok AI Instructions for TOrqued

## What is TOrqued?

TOrqued is a beast of a Shopify theme - enterprise-grade with React/TypeScript dashboard integration. Think traditional Shopify Liquid meets modern React, with AI superpowers and edge computing.

## Tech Stack (The Good Stuff)

- **React 18** + **TypeScript 5.6** (strict mode, no mercy)
- **Vite 5.3** for blazingly fast builds
- **Zustand** for state (simple, effective)
- **React Query** for server state (caching ftw)
- **Shopify Liquid** for theme templates
- **Vitest + Playwright** for testing

## Structure

```
TOrqued/
├── src/client/          # React app lives here
│   ├── components/      # UI components (PascalCase.tsx)
│   ├── hooks/           # Custom React hooks
│   └── store.ts         # Zustand state stores
├── sections/            # Shopify Liquid sections
├── templates/           # Shopify page templates
├── scripts/             # Build scripts (kebab-case.mjs)
└── dist/                # Build output (don't commit this)
```

## Commands You'll Actually Use

```bash
npm ci                   # Install everything
npm run dev             # Fire up dev server
npm run build           # Build for production
npm run lint            # Lint check (fix your code)
npm test                # Run tests
npm run shopify:validate # Check theme is legit
npm run shopify:deploy  # Ship it to Shopify
```

## Code Style (Follow This or Face the Linter)

### React/TypeScript

```typescript
// ✅ DO THIS: Functional components, named exports, types
export function BadassComponent({ title, count }: Props) {
  const theme = useUIStore((s) => s.darkMode);
  return <div className={theme ? 'dark' : 'light'}>{title}</div>;
}

// ❌ NOT THIS: Classes, default exports, any type
export default class OldSchoolComponent extends React.Component {
  render() { return <div>{this.props.title}</div>; }
}
```

**Rules:**
- Functional components ONLY (no classes, we're not in 2015)
- Named exports (except App.tsx gets a pass)
- PascalCase files: `OnboardingTour.tsx`
- No `any` type unless you have a damn good reason
- Keep it small, extract hooks for complex logic

### Shopify Liquid (Don't Get Hacked Edition)

```liquid
{% comment %}
  Always explain what this section does
{% endcomment %}

<!-- ✅ SAFE: Use | json filter to escape properly -->
<script>
const config = {
  userId: {{ customer.id | json }},
  email: {{ customer.email | json }}
};
</script>

<!-- ❌ UNSAFE: Direct output = XSS vulnerability -->
<script>
const userId = {{ customer.id }};  // RIP your security
</script>
```

**Golden Rule**: Always use `{{ variable | json }}` when passing data to JavaScript. XSS is not a feature.

### Build Scripts

```javascript
#!/usr/bin/env node

/**
 * Does something awesome with the build
 */

import fs from 'fs';
// ES modules only, baby
```

- ES modules (`.mjs` extension)
- Shebang for executable scripts
- JSDoc comments (be helpful)
- Kebab-case naming: `deploy-edge.mjs`

## Security (Don't Be That Developer)

### XSS Prevention
The number one rule: **ALWAYS** use the `| json` filter in Liquid when outputting to JS.

```liquid
<!-- ✅ This prevents XSS -->
<script>window.user = {{ customer | json }};</script>

<!-- ❌ This is a security hole -->
<script>var name = "{{ customer.name }}";</script>
```

### Secrets
- Never EVER commit `.env` files
- Use environment variables for everything sensitive
- Production = AWS/GCP Secrets Manager
- No hardcoded API keys (yes, we check)

## State Management

### Zustand (Global UI State)
```typescript
const darkMode = useUIStore((s) => s.darkMode);
const toggle = useUIStore((s) => s.toggleDarkMode);
```

Simple, clean, no boilerplate BS.

### React Query (Server State)
```typescript
const { data, isLoading } = useQuery(['users'], fetchUsers);
const mutation = useMutation(updateUser);
```

Caching, refetching, all that good stuff handled for you.

## Build System

**Dev Mode**: Chunked bundles, HMR, source maps
**Shopify Mode**: Single bundle (set `BUILD_TARGET=shopify`)

Outputs to `dist/torqued-dashboard.{js,css}`, referenced in Liquid templates.

## Testing (Yes, You Need To)

- **Vitest**: Unit tests for components
- **Playwright**: E2E tests for user flows
- **Theme Validation**: Custom script checks Shopify structure

Run `npm test` before you commit. Don't be that person.

## Common Patterns

```typescript
// Loading states
<Skeleton height={32} width="50%" />

// Big lists (>100 items)
<VirtualizedTable rows={bigData} height={600} />

// User onboarding
<OnboardingTour steps={tourSteps} />
```

## Deploy Checklist

Before you `npm run shopify:deploy`:
1. ✅ Lint passes (`npm run lint`)
2. ✅ Tests pass (`npm test`)
3. ✅ Build works (`npm run build`)
4. ✅ Theme valid (`npm run shopify:validate`)
5. ✅ No secrets in code
6. ✅ Actually tested it

## Don't Do These Things

- ❌ Class components (it's 2024, wake up)
- ❌ Default exports everywhere
- ❌ `any` type spam
- ❌ Forgetting `| json` in Liquid
- ❌ Committing `.env` files
- ❌ Hacking node_modules
- ❌ Skipping validation
- ❌ Ignoring linter warnings

## Enterprise Features (The Cool Stuff)

### AI-Powered
- OpenAI product recommendations
- Dynamic pricing (ML-based)
- Demand forecasting
- Content personalization

### Edge Computing
- Cloudflare Workers everywhere
- Sub-50ms response times globally
- Edge-side A/B testing

### Real-Time
- WebSocket server for live updates
- Real-time analytics
- Live notifications

### Security
- OAuth2 + RBAC
- ML-based fraud detection
- Device fingerprinting
- Real-time risk scoring

### Multi-Tenant
- Isolated environments
- Custom branding per tenant
- Auto-scaling magic

## Performance Tips

- Code split the big stuff
- React.memo for expensive components
- Virtualize long lists (react-window)
- Edge cache static assets
- Let Vite do its tree-shaking thing

## Accessibility (Be a Good Human)

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus management
- Test with screen readers

## When Things Go Wrong

**Build fails?** 
- Check Node version (>= 18.0.0)
- Run `npm ci` fresh install

**Lint errors?**
- Fix them. The linter isn't wrong.

**Theme validation fails?**
- Run `npm run shopify:validate`
- Check required files exist

**Tests failing?**
- Did you break something? (probably)
- Check the test output

**Deploy fails?**
- Check `.env` configuration
- Verify Shopify credentials

## Documentation

- **README.md**: Setup and getting started
- **CONTRIBUTING.md**: How to contribute
- **THEME_IMPORT.md**: Shopify import guide
- **COMPETITIVE_ADVANTAGES.md**: Why this is awesome

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- TypeScript 5.6.3
- A Shopify store
- Common sense

## Final Words

This is enterprise-grade code. Write it like it matters. Test your shit. Don't commit secrets. Use the `| json` filter. And for the love of all that is holy, stop using class components.

Now go build something awesome. 🚀
