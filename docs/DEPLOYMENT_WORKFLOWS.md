# Deployment Workflows Guide

This guide provides detailed workflows for deploying TOrqued to various platforms with step-by-step instructions.

## Table of Contents
- [Quick Start](#quick-start)
- [Shopify Deployment](#shopify-deployment)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Edge Computing Deployment](#edge-computing-deployment)
- [CI/CD Integration](#cicd-integration)
- [Multi-Environment Setup](#multi-environment-setup)
- [Rollback Procedures](#rollback-procedures)

## Quick Start

### Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Git repository cloned
- [ ] Dependencies installed: `npm ci`
- [ ] Environment variables configured
- [ ] Platform credentials obtained
- [ ] Build tested locally: `npm run build`

### Basic Deployment Flow
```bash
# 1. Install dependencies
npm ci

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Test locally
npm run dev

# 4. Build for production
npm run build

# 5. Deploy to target platform
npm run shopify:deploy  # or other deployment command
```

## Shopify Deployment

### Method 1: Automated Deployment (Recommended)

**Step 1: Configure Shopify Credentials**
```bash
# In .env file
SHOPIFY_STORE=yourstore.myshopify.com
SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxx
SHOPIFY_THEME_ID=123456789
```

**Step 2: Deploy**
```bash
npm run shopify:deploy
```

This command performs three actions:
1. Builds optimized React bundle for Shopify
2. Uploads assets to Shopify theme
3. Creates/updates Liquid section template

**Step 3: Verify Deployment**
```bash
npm run shopify:validate
```

**Step 4: Add Dashboard to Page**
1. Go to Shopify Admin → Online Store → Themes
2. Click "Customize" on your theme
3. Navigate to desired page
4. Click "Add section" → Select "Torqued Dashboard"
5. Configure settings and save

### Method 2: Manual Theme Import

**Step 1: Export Theme**
```bash
# Create theme package
zip -r torqued-theme.zip config layout locales sections snippets templates assets -x "*.DS_Store"
```

**Step 2: Import to Shopify**
1. Go to Shopify Admin → Online Store → Themes
2. Click "Add theme" → "Upload zip file"
3. Select `torqued-theme.zip`
4. Publish or preview theme

### Method 3: Shopify CLI

**Step 1: Install Shopify CLI**
```bash
npm install -g @shopify/cli @shopify/theme
```

**Step 2: Authenticate**
```bash
shopify login --store yourstore.myshopify.com
```

**Step 3: Deploy Theme**
```bash
shopify theme push
```

### Shopify Deployment Checklist
- [ ] Shopify store credentials configured
- [ ] Theme ID obtained
- [ ] API access token has theme permissions
- [ ] Build completed successfully
- [ ] Assets uploaded without errors
- [ ] Liquid section created/updated
- [ ] Dashboard visible in theme customizer
- [ ] Functionality tested on live store
- [ ] Mobile responsiveness verified

## Cloud Platform Deployment

### Google Cloud Platform (GCP)

#### Option A: Cloud Run (Containerized)

**Step 1: Prepare Docker Configuration**
```bash
# Create Dockerfile if not exists
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]
EOF
```

**Step 2: Build and Push Container**
```bash
# Set project ID
export GCP_PROJECT=your-gcp-project-id

# Build image
docker build -t gcr.io/$GCP_PROJECT/torqued:latest .

# Configure Docker for GCP
gcloud auth configure-docker

# Push to Container Registry
docker push gcr.io/$GCP_PROJECT/torqued:latest
```

**Step 3: Deploy to Cloud Run**
```bash
gcloud run deploy torqued \
  --image gcr.io/$GCP_PROJECT/torqued:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "SHOPIFY_STORE=$SHOPIFY_STORE,SECRETS_PROVIDER=gcp"
```

**Step 4: Configure Secrets**
```bash
# Store secrets in Secret Manager
echo -n "$SHOPIFY_TOKEN" | gcloud secrets create shopify-token --data-file=-
echo -n "$CLIENT_SECRET" | gcloud secrets create client-secret --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding shopify-token \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### Option B: App Engine

**Step 1: Create app.yaml**
```yaml
runtime: nodejs18
env: standard

env_variables:
  SHOPIFY_STORE: "yourstore.myshopify.com"
  SECRETS_PROVIDER: "gcp"

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6
```

**Step 2: Deploy**
```bash
gcloud app deploy app.yaml
```

### Amazon Web Services (AWS)

#### Option A: Elastic Beanstalk

**Step 1: Initialize EB Application**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js torqued --region us-east-1
```

**Step 2: Create Environment Configuration**
```bash
# Create .ebextensions/environment.config
mkdir -p .ebextensions
cat > .ebextensions/environment.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    SECRETS_PROVIDER: aws
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:autoscaling:launchconfiguration:
    InstanceType: t3.small
EOF
```

**Step 3: Deploy**
```bash
# Create environment
eb create torqued-prod --envvars SHOPIFY_STORE=$SHOPIFY_STORE

# Or deploy to existing environment
eb deploy
```

**Step 4: Configure Secrets**
```bash
# Store in AWS Secrets Manager
aws secretsmanager create-secret \
  --name torqued/shopify-token \
  --secret-string "$SHOPIFY_TOKEN" \
  --region us-east-1

aws secretsmanager create-secret \
  --name torqued/client-secret \
  --secret-string "$CLIENT_SECRET" \
  --region us-east-1
```

#### Option B: ECS/Fargate

**Step 1: Create ECR Repository**
```bash
aws ecr create-repository --repository-name torqued --region us-east-1
```

**Step 2: Build and Push Image**
```bash
# Get ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t torqued .
docker tag torqued:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/torqued:latest

# Push
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/torqued:latest
```

**Step 3: Create ECS Task Definition**
```json
{
  "family": "torqued",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [{
    "name": "torqued",
    "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/torqued:latest",
    "portMappings": [{
      "containerPort": 3000,
      "protocol": "tcp"
    }],
    "environment": [
      {"name": "NODE_ENV", "value": "production"},
      {"name": "SECRETS_PROVIDER", "value": "aws"}
    ],
    "secrets": [
      {"name": "SHOPIFY_TOKEN", "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:torqued/shopify-token"}
    ]
  }]
}
```

## Edge Computing Deployment

### Cloudflare Workers

**Step 1: Configure Cloudflare Credentials**
```bash
# In .env
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

**Step 2: Deploy to Edge**
```bash
npm run deploy:edge
```

**Step 3: Configure Workers KV (if needed)**
```bash
# Create KV namespace
wrangler kv:namespace create "TORQUED_CACHE"

# Bind to worker in wrangler.toml
kv_namespaces = [
  { binding = "CACHE", id = "your_namespace_id" }
]
```

### Cloudflare Pages (Static Build)

**Step 1: Build Static Assets**
```bash
npm run build
```

**Step 2: Deploy via Wrangler**
```bash
npx wrangler pages deploy dist
```

## CI/CD Integration

### GitHub Actions

**Complete Workflow Example**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main, master]
  workflow_dispatch:

env:
  NODE_VERSION: '18'

jobs:
  deploy-shopify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Deploy to Shopify
        env:
          SHOPIFY_STORE: ${{ secrets.SHOPIFY_STORE }}
          SHOPIFY_TOKEN: ${{ secrets.SHOPIFY_TOKEN }}
          SHOPIFY_THEME_ID: ${{ secrets.SHOPIFY_THEME_ID }}
        run: npm run shopify:deploy

      - name: Validate deployment
        run: npm run shopify:validate

      - name: Notify on failure
        if: failure()
        run: |
          echo "Deployment failed!"
          # Add notification logic here

  deploy-cloud:
    runs-on: ubuntu-latest
    needs: [deploy-shopify]
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}

      - name: Build and push to GCR
        run: |
          docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/torqued:${{ github.sha }} .
          docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/torqued:${{ github.sha }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy torqued \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/torqued:${{ github.sha }} \
            --platform managed \
            --region us-central1
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "18"

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run test
    - npm run security:scan

deploy-shopify:
  stage: deploy
  image: node:${NODE_VERSION}
  only:
    - main
  script:
    - npm ci
    - npm run shopify:deploy
  environment:
    name: production
    url: https://$SHOPIFY_STORE

deploy-gcp:
  stage: deploy
  image: google/cloud-sdk:alpine
  only:
    - main
  script:
    - gcloud auth activate-service-account --key-file=$GCP_SA_KEY
    - gcloud builds submit --tag gcr.io/$GCP_PROJECT/torqued
    - gcloud run deploy torqued --image gcr.io/$GCP_PROJECT/torqued --platform managed
  environment:
    name: production-gcp
```

## Multi-Environment Setup

### Environment Strategy

**Development Environment**
```bash
# .env.development
NODE_ENV=development
SHOPIFY_STORE=dev-store.myshopify.com
SHOPIFY_THEME_ID=dev_theme_id
API_BASE_URL=http://localhost:3000
ENABLE_DEBUG=true
```

**Staging Environment**
```bash
# .env.staging
NODE_ENV=staging
SHOPIFY_STORE=staging-store.myshopify.com
SHOPIFY_THEME_ID=staging_theme_id
API_BASE_URL=https://staging.yourdomain.com
ENABLE_DEBUG=true
```

**Production Environment**
```bash
# .env.production
NODE_ENV=production
SHOPIFY_STORE=yourstore.myshopify.com
SHOPIFY_THEME_ID=prod_theme_id
API_BASE_URL=https://yourdomain.com
ENABLE_DEBUG=false
ENABLE_MONITORING=true
```

### Deployment Commands by Environment

```bash
# Development
npm run dev

# Staging
NODE_ENV=staging npm run build
NODE_ENV=staging npm run shopify:deploy

# Production
NODE_ENV=production npm run build
NODE_ENV=production npm run shopify:deploy
```

## Rollback Procedures

### Shopify Rollback

**Method 1: Revert Theme**
```bash
# List theme versions (if using version control)
shopify theme list

# Download previous version
shopify theme pull --theme-id=PREVIOUS_THEME_ID

# Push previous version
shopify theme push
```

**Method 2: Manual Asset Rollback**
1. Go to Shopify Admin → Online Store → Themes
2. Click "Actions" → "Edit code"
3. Navigate to Assets
4. Restore previous version from version control

### Cloud Platform Rollback

**GCP Cloud Run**
```bash
# List revisions
gcloud run revisions list --service=torqued

# Rollback to specific revision
gcloud run services update-traffic torqued \
  --to-revisions=torqued-00001-abc=100
```

**AWS Elastic Beanstalk**
```bash
# List application versions
eb appversion

# Deploy previous version
eb deploy --version previous-version-label
```

**Cloudflare Workers**
```bash
# Rollback to previous version
wrangler rollback
```

### Database Rollback Considerations
If deployment includes database migrations:

1. **Before Deployment**
   - Backup database
   - Test migrations on staging
   - Prepare rollback scripts

2. **During Rollback**
   ```bash
   # Rollback migrations (example)
   npm run migrate:rollback

   # Or manually revert
   # (depends on your migration tool)
   ```

## Monitoring and Validation

### Post-Deployment Checks

**Automated Validation Script**
```bash
#!/bin/bash
# validate-deployment.sh

echo "Validating deployment..."

# Check if site is accessible
if curl -f -s -o /dev/null "$SITE_URL"; then
  echo "✓ Site is accessible"
else
  echo "✗ Site is not accessible"
  exit 1
fi

# Check API health
if curl -f -s "$API_URL/health" | grep -q "ok"; then
  echo "✓ API health check passed"
else
  echo "✗ API health check failed"
  exit 1
fi

# Check Shopify integration
if curl -f -s -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
  "https://$SHOPIFY_STORE/admin/api/2024-01/shop.json" > /dev/null; then
  echo "✓ Shopify connection verified"
else
  echo "✗ Shopify connection failed"
  exit 1
fi

echo "✓ All checks passed!"
```

### Performance Monitoring

```bash
# Run performance audit
npm run performance:audit

# Check bundle size
npm run analyze:bundle

# Monitor runtime performance
# (Use your monitoring tool: Datadog, New Relic, etc.)
```

## Troubleshooting Common Issues

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm ci
npm run build
```

### Deployment Timeouts
- Increase timeout settings in platform configuration
- Check network connectivity
- Verify credentials are valid
- Check platform service status

### Asset Upload Failures
```bash
# Retry with verbose logging
DEBUG=* npm run shopify:deploy

# Verify credentials
curl -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
  "https://$SHOPIFY_STORE/admin/api/2024-01/shop.json"
```

## Best Practices

1. **Always test in staging first**
2. **Use semantic versioning**
3. **Tag releases in git**
4. **Monitor deployments closely**
5. **Keep rollback plan ready**
6. **Document custom configurations**
7. **Use secrets management**
8. **Enable logging and monitoring**
9. **Implement health checks**
10. **Schedule maintenance windows**

## Additional Resources

- [Platform-Agnostic Deployment Guide](PLATFORM_AGNOSTIC_DEPLOYMENT.md)
- [Theme Structure Guide](THEME_STRUCTURE.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Main README](../README.md)

---

**Need Help?** Open an issue on GitHub or contact your DevOps team.
