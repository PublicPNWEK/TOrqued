# Platform-Agnostic Deployment Guide

This document explains how TOrqued is designed to be platform-agnostic and can be deployed to any cloud provider or hosting platform.

## Architecture Overview

TOrqued is built with platform independence in mind:

- **No vendor lock-in**: No Vercel, Netlify, or other platform-specific configurations
- **Standard Node.js application**: Can run on any Node.js hosting environment
- **Flexible deployment**: Multiple deployment targets supported
- **Environment-based configuration**: All platform-specific settings via environment variables

## Supported Deployment Platforms

### 1. Google Cloud Platform (GCP)

#### Prerequisites
- GCP Project ID
- GCP credentials configured
- Cloud Storage or Cloud Run setup

#### Environment Variables
```bash
GCP_PROJECT=your-gcp-project-id
SECRETS_PROVIDER=gcp
```

#### Deployment Options

**Option A: Cloud Run (Recommended for containerized apps)**
```bash
# Build Docker image
docker build -t gcr.io/$GCP_PROJECT/torqued .

# Push to Container Registry
docker push gcr.io/$GCP_PROJECT/torqued

# Deploy to Cloud Run
gcloud run deploy torqued \
  --image gcr.io/$GCP_PROJECT/torqued \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Option B: App Engine**
```bash
# Deploy to App Engine
gcloud app deploy app.yaml
```

**Option C: Compute Engine**
- Set up VM instance
- Clone repository
- Install Node.js
- Run `npm ci && npm run build`
- Use PM2 or systemd to manage the process

### 2. Amazon Web Services (AWS)

#### Prerequisites
- AWS Account and credentials
- AWS CLI configured

#### Environment Variables
```bash
AWS_REGION=us-east-1
SECRETS_PROVIDER=aws
```

#### Deployment Options

**Option A: Elastic Beanstalk**
```bash
# Initialize EB application
eb init -p node.js torqued

# Create environment and deploy
eb create torqued-prod
eb deploy
```

**Option B: ECS/Fargate**
- Build Docker image
- Push to ECR
- Deploy to ECS cluster

**Option C: EC2**
- Launch EC2 instance
- Clone repository
- Install dependencies
- Configure reverse proxy (nginx)
- Use PM2 for process management

### 3. Cloudflare Workers (Edge Computing)

For edge deployment with Cloudflare Workers:

```bash
# Set environment variables
export CLOUDFLARE_API_TOKEN=your_token
export CLOUDFLARE_ZONE_ID=your_zone_id

# Deploy to edge
npm run deploy:edge
```

### 4. Shopify (Primary Integration)

Deploy directly to Shopify as a theme:

```bash
# Set Shopify credentials
export SHOPIFY_STORE=yourstore.myshopify.com
export SHOPIFY_TOKEN=shpat_xxxxx
export SHOPIFY_THEME_ID=123456789

# Deploy to Shopify
npm run shopify:deploy
```

Or use Shopify CLI:
```bash
shopify theme push --store your-store.myshopify.com
```

### 5. GitHub Pages

Automated deployment via GitHub Actions:
- Push to `master` branch
- GitHub Actions workflow automatically builds and deploys
- Custom domain supported via CNAME

### 6. Self-Hosted / On-Premise

For traditional hosting environments:

```bash
# Install dependencies
npm ci

# Build production assets
npm run build

# Start server (use process manager in production)
node server.js

# Or with PM2
pm2 start server.js --name torqued
```

#### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Required Variables (Platform-Independent)
```bash
# Shopify Integration
SHOPIFY_STORE=yourstore.myshopify.com
SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxx
SHOPIFY_THEME_ID=123456789

# OAuth Configuration
OAUTH_AUTH_URL=https://provider.com/oauth/authorize
OAUTH_TOKEN_URL=https://provider.com/oauth/token
OAUTH_CALLBACK=https://yourapp.com/auth/callback
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret

# Secrets Provider (aws or gcp)
SECRETS_PROVIDER=aws
```

### Cloud Provider Variables

**AWS:**
```bash
AWS_REGION=us-east-1
```

**GCP:**
```bash
GCP_PROJECT=your-gcp-project-id
```

**Cloudflare:**
```bash
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ZONE_ID=your_zone_id
```

### Optional Features
```bash
# Redis
REDIS_URL=redis://localhost:6379

# WebSocket Server
WS_PORT=8081

# AI Features
OPENAI_API_KEY=sk-your_openai_key
ENABLE_AI_PERSONALIZATION=true

# Monitoring
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_key

# Performance
ENABLE_EDGE_CACHING=true
MAX_CACHE_SIZE=100mb
CACHE_TTL=3600
```

## Migration from Vercel (If Needed)

If you're migrating from Vercel or another platform:

1. **No Vercel-specific files to remove** - This project never used Vercel
2. **Environment variables** - Copy from Vercel dashboard to your new platform
3. **Build settings** - Use: `npm run build`
4. **Start command** - Use: `node server.js` or appropriate platform command
5. **Custom domains** - Configure in your new platform's DNS settings

## Platform-Specific Code Handling

### No Platform Lock-in
The codebase intentionally avoids:
- ❌ Vercel serverless functions
- ❌ Netlify Functions
- ❌ Platform-specific APIs
- ❌ Proprietary deployment configurations

### Standard Patterns Used
- ✅ Standard Express.js server
- ✅ Environment variables for configuration
- ✅ Cloud-agnostic secrets management (AWS/GCP)
- ✅ Standard Node.js application structure
- ✅ Docker-ready (can containerize easily)

## Deployment Checklist

Before deploying to any platform:

- [ ] Copy `.env.example` to `.env` and configure
- [ ] Set `SECRETS_PROVIDER` to `aws` or `gcp`
- [ ] Configure Shopify credentials if using Shopify integration
- [ ] Run `npm run build` to verify build works
- [ ] Test locally with `npm run dev`
- [ ] Configure custom domain (if applicable)
- [ ] Set up monitoring and logging
- [ ] Configure SSL/TLS certificates
- [ ] Set up automated backups
- [ ] Configure CI/CD pipeline

## Testing Deployment

After deploying to any platform:

1. Verify application loads
2. Check environment variables are set correctly
3. Test Shopify integration (if applicable)
4. Verify OAuth flow works
5. Test WebSocket connections
6. Check monitoring and logging
7. Run performance tests
8. Verify SSL certificate

## Continuous Deployment

Set up CI/CD with your platform of choice:

### GitHub Actions Example
See `.github/workflows/deploy-pages.yml` for reference

### GitLab CI Example
```yaml
deploy:
  stage: deploy
  script:
    - npm ci
    - npm run build
    - # Deploy to your platform
  only:
    - master
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Check platform-specific documentation
4. Review this guide for configuration options

## Best Practices

1. **Use environment variables** - Never hardcode credentials
2. **Enable secrets management** - Use AWS/GCP Secrets Manager
3. **Set up monitoring** - Configure Sentry, Datadog, or similar
4. **Use CDN** - Enable Cloudflare or platform CDN
5. **Enable caching** - Configure appropriate cache headers
6. **Implement CI/CD** - Automate deployments
7. **Monitor performance** - Set up alerts and dashboards
8. **Regular backups** - Automated backup strategy
9. **Security scanning** - Regular vulnerability checks
10. **Load testing** - Test before major releases

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Verify all dependencies installed: `npm ci`
- Check for TypeScript errors: `npm run lint`

### Environment Variables Not Loading
- Verify `.env` file exists
- Check variable names match `.env.example`
- Restart application after changes

### Deployment Fails
- Check platform-specific logs
- Verify credentials are correct
- Ensure build artifacts exist
- Check platform resource limits

## Additional Resources

- [AWS Deployment Guide](https://aws.amazon.com/getting-started/hands-on/deploy-nodejs-web-app/)
- [GCP Deployment Guide](https://cloud.google.com/nodejs/docs/setup)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Shopify Theme Development](https://shopify.dev/docs/themes)

---

**Note**: This project is designed to be platform-agnostic and can be deployed to any Node.js hosting platform. Choose the platform that best fits your needs and budget.
