# Deployment Support Documentation

## Overview

This document provides an overview of the deployment support infrastructure for TOrqued, designed to facilitate collaboration between developers, Codex, and Copilot for streamlined deployment processes.

## What's New

### GitHub Copilot Integration

We've added comprehensive GitHub Copilot instructions to help with deployment tasks:

**Location:** `.github/copilot-instructions.md`

**Features:**
- Platform-agnostic deployment patterns
- Environment configuration guidance
- Code suggestions for deployment scenarios
- Best practices for multi-cloud deployments
- Security and performance considerations

**Usage:** GitHub Copilot will automatically reference these instructions when providing code suggestions and assistance.

### Deployment Validation Tools

#### Quick Validation
```bash
npm run validate:quick
```
Fast validation of essential requirements:
- Node.js version check
- Dependencies verification
- Environment variables validation

#### Standard Validation
```bash
npm run validate:deployment
```
Comprehensive validation including:
- All quick checks
- Build artifacts verification
- Git repository status
- Deployment target configuration

#### Full Validation
```bash
npm run validate:all
```
Complete validation suite:
- All standard checks
- TypeScript compilation
- ESLint checks
- Security vulnerability scanning
- Shopify API connection test
- Build size analysis

#### Post-Deployment Health Check
```bash
npm run health:check
```
Validates deployed application:
- Shopify store accessibility
- API connectivity
- Theme and asset verification
- Service configuration checks
- Optional features validation

## Documentation Structure

### Core Documentation
1. **[README.md](README.md)** - Main project documentation
2. **[Platform-Agnostic Deployment](docs/PLATFORM_AGNOSTIC_DEPLOYMENT.md)** - Multi-cloud deployment guide
3. **[Deployment Workflows](docs/DEPLOYMENT_WORKFLOWS.md)** - Step-by-step deployment procedures
4. **[Deployment Troubleshooting](docs/DEPLOYMENT_TROUBLESHOOTING.md)** - Problem diagnosis and solutions

### GitHub Copilot Resources
- **[Copilot Instructions](.github/copilot-instructions.md)** - AI assistant guidance

## Deployment Scripts

### Validation Scripts
- `scripts/validate-deployment.mjs` - Comprehensive pre-deployment validation
- `scripts/health-check.mjs` - Post-deployment health verification

### Deployment Scripts
- `scripts/build-shopify.mjs` - Build for Shopify deployment
- `scripts/upload-to-shopify.mjs` - Upload assets to Shopify
- `scripts/create-section.mjs` - Create Liquid section template
- `scripts/deploy-edge.mjs` - Deploy to Cloudflare Workers
- `scripts/validate-theme.mjs` - Validate Shopify theme structure

## Quick Reference

### Pre-Deployment Checklist
```bash
# 1. Install dependencies
npm ci

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Validate setup
npm run validate:deployment

# 4. Build application
npm run build

# 5. Deploy to target
npm run shopify:deploy  # or other deployment command
```

### Common Deployment Commands

#### Shopify
```bash
npm run shopify:deploy       # Build and deploy to Shopify
npm run shopify:validate     # Validate theme structure
```

#### Cloud Platforms
```bash
npm run deploy:edge          # Deploy to Cloudflare Workers
```

#### Validation and Testing
```bash
npm run validate:quick       # Fast validation
npm run validate:deployment  # Standard validation
npm run validate:all         # Comprehensive validation
npm run health:check         # Post-deployment check
npm run lint                 # Code quality check
npm run security:scan        # Security audit
```

#### Performance and Analysis
```bash
npm run analyze:bundle       # Bundle size analysis
npm run performance:audit    # Performance audit
npm run optimize:bundle      # Bundle optimization
```

## Environment Configuration

### Required Variables
```bash
SHOPIFY_STORE=yourstore.myshopify.com
SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxx
SHOPIFY_THEME_ID=123456789
```

### Cloud Provider Configuration
```bash
# For GCP
GCP_PROJECT=your-gcp-project-id
SECRETS_PROVIDER=gcp

# For AWS
AWS_REGION=us-east-1
SECRETS_PROVIDER=aws

# For Cloudflare
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ZONE_ID=your_zone_id
```

### Optional Features
```bash
# Redis caching
REDIS_URL=redis://localhost:6379

# WebSocket server
WS_PORT=8081

# OAuth authentication
OAUTH_AUTH_URL=https://provider.com/oauth/authorize
OAUTH_TOKEN_URL=https://provider.com/oauth/token
OAUTH_CALLBACK=https://yourapp.com/auth/callback
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret

# AI features
OPENAI_API_KEY=sk-your_openai_key
ENABLE_AI_PERSONALIZATION=true
```

## Troubleshooting Quick Reference

### Build Issues
```bash
# Clear and rebuild
rm -rf node_modules dist .vite
npm ci
npm run build
```

### Deployment Issues
```bash
# Run validation
npm run validate:all

# Check logs
npm run health:check

# Verify credentials
curl -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
  "https://$SHOPIFY_STORE/admin/api/2024-01/shop.json"
```

### Runtime Issues
```bash
# Check environment
node -e "console.log(process.env)" | grep SHOPIFY

# Test locally
npm run dev

# Check health
npm run health:check
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run validate:deployment
      - run: npm run build
      - run: npm run shopify:deploy
        env:
          SHOPIFY_STORE: ${{ secrets.SHOPIFY_STORE }}
          SHOPIFY_TOKEN: ${{ secrets.SHOPIFY_TOKEN }}
          SHOPIFY_THEME_ID: ${{ secrets.SHOPIFY_THEME_ID }}
      - run: npm run health:check
```

## Platform-Specific Guides

### Shopify
- Full theme integration
- Asset optimization for Shopify
- Liquid template generation
- Theme validation

### Google Cloud Platform
- Cloud Run containerized deployment
- App Engine standard deployment
- Compute Engine VM deployment
- Secret Manager integration

### Amazon Web Services
- Elastic Beanstalk deployment
- ECS/Fargate containers
- EC2 instances
- Secrets Manager integration

### Cloudflare Workers
- Edge computing deployment
- Global CDN distribution
- Workers KV storage
- Low-latency routing

## Best Practices

### Development Workflow
1. Create feature branch
2. Make changes locally
3. Run `npm run validate:deployment`
4. Test with `npm run dev`
5. Build with `npm run build`
6. Commit and push
7. Deploy to staging
8. Run `npm run health:check`
9. Deploy to production

### Security
- Never commit `.env` files
- Use secrets managers in production
- Rotate credentials regularly
- Enable 2FA on all accounts
- Use HTTPS everywhere
- Implement rate limiting

### Performance
- Enable code splitting
- Use CDN for static assets
- Implement caching strategies
- Optimize bundle size
- Monitor performance metrics
- Use edge computing where appropriate

## Support and Resources

### Documentation
- [Platform-Agnostic Deployment](docs/PLATFORM_AGNOSTIC_DEPLOYMENT.md)
- [Deployment Workflows](docs/DEPLOYMENT_WORKFLOWS.md)
- [Troubleshooting Guide](docs/DEPLOYMENT_TROUBLESHOOTING.md)

### External Resources
- [Shopify Theme Development](https://shopify.dev/docs/themes)
- [GCP Documentation](https://cloud.google.com/docs)
- [AWS Documentation](https://docs.aws.amazon.com)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)

### Getting Help
1. Run diagnostics: `npm run validate:all`
2. Check troubleshooting guide
3. Review platform-specific documentation
4. Open GitHub issue with diagnostic information
5. Contact platform support if needed

## Contributing

When contributing deployment-related changes:
1. Update relevant documentation
2. Add validation checks if needed
3. Test across multiple platforms
4. Update Copilot instructions if applicable
5. Document any new environment variables
6. Include rollback procedures

## Version History

### v3.0.0 - Enhanced Deployment Support
- Added GitHub Copilot instructions
- Created comprehensive validation scripts
- Added health check system
- Documented deployment workflows
- Created troubleshooting guide
- Improved multi-platform support

---

**For detailed deployment instructions, see [Deployment Workflows](docs/DEPLOYMENT_WORKFLOWS.md)**

**For troubleshooting, see [Deployment Troubleshooting](docs/DEPLOYMENT_TROUBLESHOOTING.md)**
