# GitHub Copilot Instructions for TOrqued Deployment

## Project Overview
TOrqued is a platform-agnostic Shopify React dashboard application with enterprise-grade features. This project supports deployment to multiple cloud providers.

## Deployment Architecture

### Supported Platforms
1. **Shopify** (Primary) - Direct theme integration
2. **GCP** (Google Cloud Platform) - Cloud Run, App Engine, Compute Engine
3. **AWS** (Amazon Web Services) - Elastic Beanstalk, ECS/Fargate, EC2
4. **Cloudflare Workers** - Edge computing
5. **GitHub Pages** - Static hosting
6. **Self-hosted** - On-premise or VPS

### Key Deployment Scripts
- `npm run shopify:deploy` - Deploy to Shopify theme
- `npm run deploy:edge` - Deploy to Cloudflare Workers
- `npm run build` - Build production assets
- `npm run shopify:validate` - Validate theme structure

## Environment Configuration

### Required Environment Variables
```bash
# Shopify Integration
SHOPIFY_STORE=yourstore.myshopify.com
SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxx
SHOPIFY_THEME_ID=123456789

# Cloud Provider Selection
SECRETS_PROVIDER=aws|gcp

# OAuth Configuration
OAUTH_AUTH_URL=https://provider.com/oauth/authorize
OAUTH_TOKEN_URL=https://provider.com/oauth/token
OAUTH_CALLBACK=https://yourapp.com/auth/callback
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

### Optional Features
```bash
# Redis Caching
REDIS_URL=redis://localhost:6379

# WebSocket Server
WS_PORT=8081

# AI Features
OPENAI_API_KEY=sk-your_openai_key
ENABLE_AI_PERSONALIZATION=true

# Edge Computing
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ZONE_ID=your_zone_id
```

## Deployment Workflows

### Shopify Deployment
1. Configure Shopify credentials in `.env`
2. Run `npm run shopify:deploy`
3. Verify theme section in Shopify admin
4. Test dashboard functionality

### GCP Deployment
```bash
# Cloud Run
docker build -t gcr.io/$GCP_PROJECT/torqued .
docker push gcr.io/$GCP_PROJECT/torqued
gcloud run deploy torqued --image gcr.io/$GCP_PROJECT/torqued

# App Engine
gcloud app deploy app.yaml
```

### AWS Deployment
```bash
# Elastic Beanstalk
eb init -p node.js torqued
eb create torqued-prod
eb deploy
```

### Edge Deployment
```bash
# Cloudflare Workers
export CLOUDFLARE_API_TOKEN=your_token
export CLOUDFLARE_ZONE_ID=your_zone_id
npm run deploy:edge
```

## Code Patterns for Deployment

### Platform-Agnostic Code
When suggesting code changes, ensure:
- ✅ Use environment variables for all platform-specific configs
- ✅ Avoid hardcoded platform-specific APIs
- ✅ Use standard Node.js patterns
- ✅ Support both AWS and GCP secrets managers
- ❌ Don't use Vercel-specific serverless functions
- ❌ Don't use Netlify Functions
- ❌ Don't hardcode deployment URLs

### Build Configuration
The project uses Vite with conditional builds:
- `BUILD_TARGET='shopify'` - Single bundle for Shopify
- Default - Code splitting for performance

### Example: Adding New Deployment Feature
```typescript
// ✅ Good - Platform agnostic
const secretsProvider = process.env.SECRETS_PROVIDER || 'aws';
const secret = await getSecret(secretsProvider, 'api-key');

// ❌ Bad - Platform specific
import { kv } from '@vercel/kv'; // Vercel-specific
```

## Common Deployment Tasks

### Adding New Environment Variable
1. Add to `.env.example` with documentation
2. Update `docs/PLATFORM_AGNOSTIC_DEPLOYMENT.md`
3. Update this file with the new variable
4. Test across deployment targets

### Creating New Deployment Script
1. Place in `/scripts` directory
2. Use `.mjs` extension for ES modules
3. Add to `package.json` scripts section
4. Document in README.md and deployment guide

### Testing Deployment Changes
1. Test locally: `npm run dev`
2. Test build: `npm run build`
3. Test Shopify: `npm run shopify:validate`
4. Test deployment: `npm run shopify:deploy` (or other target)

## Security Considerations
- Never commit `.env` files
- Use secrets managers (AWS/GCP) for production
- Validate all environment variables at startup
- Use HTTPS for all external communications
- Implement rate limiting for API endpoints

## Performance Optimization
- Enable edge caching where available
- Use CDN for static assets
- Implement code splitting (except Shopify build)
- Optimize bundle size: `npm run analyze:bundle`
- Monitor performance: `npm run performance:audit`

## Troubleshooting Guide

### Build Failures
- Check Node.js version (18+)
- Run `npm ci` to reinstall dependencies
- Check TypeScript errors: `npm run lint`

### Deployment Failures
- Verify environment variables are set
- Check platform-specific credentials
- Review deployment logs
- Validate theme structure: `npm run shopify:validate`

### Runtime Issues
- Check application logs
- Verify environment variables loaded
- Test API endpoints individually
- Check network connectivity

## Documentation References
- Main README: `/README.md`
- Platform-Agnostic Guide: `/docs/PLATFORM_AGNOSTIC_DEPLOYMENT.md`
- Theme Import: `/THEME_IMPORT.md`
- Contributing: `/CONTRIBUTING.md`

## CI/CD Integration
The project uses GitHub Actions for automated deployment:
- `.github/workflows/deploy-pages.yml` - GitHub Pages deployment
- `.github/workflows/sync-branches.yml` - Branch synchronization
- `.github/workflows/*.yml` - Various CI/CD workflows

## Code Suggestions Guidelines
When providing code suggestions:
1. Prioritize platform-agnostic solutions
2. Consider multi-cloud deployment scenarios
3. Use environment variables for configuration
4. Follow existing code patterns
5. Include error handling and logging
6. Add comments for complex deployment logic
7. Update relevant documentation
8. Consider backward compatibility

## Testing Recommendations
Before suggesting deployment changes:
1. Consider impact on all deployment targets
2. Suggest testing across platforms
3. Include validation steps
4. Document rollback procedures
5. Consider performance implications

## Best Practices
- Use TypeScript for type safety
- Follow ESLint configuration
- Use async/await over promises
- Implement proper error handling
- Add logging for deployment steps
- Use semantic versioning
- Document breaking changes
