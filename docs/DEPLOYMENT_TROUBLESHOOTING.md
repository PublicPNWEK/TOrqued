# Deployment Troubleshooting Guide

Comprehensive guide to diagnose and resolve common deployment issues for TOrqued across all platforms.

## Table of Contents
- [Quick Diagnostics](#quick-diagnostics)
- [Pre-Deployment Issues](#pre-deployment-issues)
- [Shopify Deployment Issues](#shopify-deployment-issues)
- [Cloud Platform Issues](#cloud-platform-issues)
- [Build and Compilation Issues](#build-and-compilation-issues)
- [Runtime Issues](#runtime-issues)
- [Performance Issues](#performance-issues)
- [Security and Authentication Issues](#security-and-authentication-issues)
- [Network and Connectivity Issues](#network-and-connectivity-issues)

## Quick Diagnostics

### Run Validation Checks
```bash
# Quick validation (fast)
npm run validate:quick

# Standard validation
npm run validate:deployment

# Comprehensive validation
npm run validate:all

# Post-deployment health check
npm run health:check
```

### Check Logs
```bash
# View last 50 lines of application logs
tail -50 logs/application.log

# For Shopify CLI
shopify theme logs

# For GCP Cloud Run
gcloud run services logs read torqued --limit=50

# For AWS Elastic Beanstalk
eb logs
```

## Pre-Deployment Issues

### Issue: Missing Dependencies

**Symptoms:**
- Build fails with "Cannot find module" errors
- `node_modules` directory missing

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci

# Verify installation
npm list --depth=0
```

### Issue: Incompatible Node.js Version

**Symptoms:**
- Build errors with syntax issues
- "Unsupported engine" warnings

**Solution:**
```bash
# Check current version
node --version

# Should be 18.x or higher
# Install correct version using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Issue: Environment Variables Not Loading

**Symptoms:**
- "Missing required environment variables" error
- Variables showing as undefined

**Solution:**
```bash
# 1. Check .env file exists
ls -la .env

# 2. Create from example
cp .env.example .env

# 3. Verify format (no quotes, no spaces around =)
cat .env

# 4. Check for hidden characters
cat -A .env

# 5. Reload environment
source .env  # for bash
# or restart your terminal
```

**Common .env Format Mistakes:**
```bash
# ❌ Wrong
SHOPIFY_STORE = "yourstore.myshopify.com"
SHOPIFY_TOKEN= shpat_xxxxx

# ✅ Correct
SHOPIFY_STORE=yourstore.myshopify.com
SHOPIFY_TOKEN=shpat_xxxxx
```

### Issue: Git Conflicts

**Symptoms:**
- Merge conflicts during sync
- Cannot push to remote

**Solution:**
```bash
# Check status
git status

# View conflicts
git diff

# Resolve conflicts
# Edit conflicted files manually, then:
git add .
git commit -m "Resolve merge conflicts"

# Or abort merge
git merge --abort
```

## Shopify Deployment Issues

### Issue: Invalid API Token

**Symptoms:**
- 401 Unauthorized errors
- "Invalid access token" message

**Solution:**
```bash
# 1. Verify token format (should start with shpat_)
echo $SHOPIFY_TOKEN

# 2. Check token permissions
# Go to Shopify Admin → Apps → Your App → API credentials
# Ensure "Theme" scope is enabled

# 3. Generate new token
# In Shopify Admin → Apps → Create new app
# Copy new token to .env file

# 4. Test connection
curl -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
  "https://$SHOPIFY_STORE/admin/api/2024-01/shop.json"
```

### Issue: Theme Not Found

**Symptoms:**
- 404 errors during upload
- "Theme does not exist" message

**Solution:**
```bash
# 1. List available themes
shopify theme list

# 2. Get theme ID from Shopify Admin
# Go to Online Store → Themes → Customize
# Look at URL: /themes/THEME_ID

# 3. Update .env with correct theme ID
SHOPIFY_THEME_ID=123456789

# 4. Verify theme exists
curl -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
  "https://$SHOPIFY_STORE/admin/api/2024-01/themes/$SHOPIFY_THEME_ID.json"
```

### Issue: Asset Upload Failures

**Symptoms:**
- Assets not appearing in theme
- Upload timeouts
- 413 Payload Too Large errors

**Solution:**
```bash
# 1. Check asset sizes
ls -lh dist/assets/

# 2. If assets are too large, optimize
npm run optimize:bundle

# 3. Check for file name issues (Shopify has restrictions)
# Rename files to remove special characters

# 4. Try uploading individually
# Edit scripts/upload-to-shopify.mjs to add retry logic

# 5. Increase timeout
# In upload script, add timeout option:
# fetch(url, { timeout: 30000 })

# 6. Check Shopify rate limits
# Wait a minute and try again
```

### Issue: Liquid Section Not Showing

**Symptoms:**
- Dashboard section not in theme customizer
- Blank page where dashboard should be

**Solution:**
```bash
# 1. Verify section was created
curl -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" \
  "https://$SHOPIFY_STORE/admin/api/2024-01/themes/$SHOPIFY_THEME_ID/assets.json?asset[key]=sections/torqued-dashboard.liquid"

# 2. Check section file syntax
cat sections/torqued-dashboard.liquid

# 3. Manually create section in Shopify Admin
# Online Store → Themes → Edit code → Sections → Add section

# 4. Check Liquid syntax errors
shopify theme check

# 5. Redeploy
npm run shopify:deploy
```

### Issue: Dashboard Not Loading on Page

**Symptoms:**
- JavaScript console errors
- Blank white screen
- Assets 404 errors

**Solution:**
```bash
# 1. Check browser console (F12)
# Look for 404 or CORS errors

# 2. Verify assets are uploaded
npm run health:check

# 3. Hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# 4. Check asset paths in Liquid template
# Should be: {{ 'torqued-dashboard.js' | asset_url }}
# Not: /assets/torqued-dashboard.js

# 5. Check for JavaScript errors
# Open browser console and look for errors

# 6. Verify build target
echo $BUILD_TARGET
# Should be 'shopify' for Shopify deployment
```

## Cloud Platform Issues

### GCP Issues

#### Issue: Docker Build Fails

**Symptoms:**
- "Cannot find package.json"
- Permission denied errors

**Solution:**
```bash
# 1. Check Dockerfile exists
cat Dockerfile

# 2. Verify build context
docker build -t test .

# 3. Check .dockerignore
cat .dockerignore

# 4. Build with verbose output
docker build -t torqued --progress=plain .

# 5. Fix permissions
chmod +x scripts/*.mjs
```

#### Issue: Cloud Run Deployment Fails

**Symptoms:**
- Deployment timeout
- Container fails health check

**Solution:**
```bash
# 1. Check service logs
gcloud run services logs read torqued --limit=100

# 2. Verify container starts locally
docker run -p 3000:3000 -e PORT=3000 torqued

# 3. Check memory/CPU limits
gcloud run services describe torqued

# 4. Increase resources
gcloud run services update torqued \
  --memory=1Gi \
  --cpu=2

# 5. Check environment variables
gcloud run services describe torqued --format="get(spec.template.spec.containers[0].env)"
```

#### Issue: Secrets Not Loading

**Symptoms:**
- "Cannot access secret" errors
- Undefined environment variables

**Solution:**
```bash
# 1. Verify secret exists
gcloud secrets list

# 2. Check IAM permissions
gcloud secrets get-iam-policy shopify-token

# 3. Grant access to Cloud Run service account
gcloud secrets add-iam-policy-binding shopify-token \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 4. Update secret value
echo -n "new_value" | gcloud secrets versions add shopify-token --data-file=-
```

### AWS Issues

#### Issue: Elastic Beanstalk Health Check Failing

**Symptoms:**
- Environment shows "Degraded" or "Severe"
- Application not accessible

**Solution:**
```bash
# 1. Check environment health
eb health

# 2. View recent logs
eb logs --all

# 3. Check health check configuration
# In .ebextensions/healthcheck.config:
option_settings:
  aws:elasticbeanstalk:application:
    Application Healthcheck URL: /health

# 4. Implement health endpoint
# Add to your server.js:
app.get('/health', (req, res) => res.send('OK'));

# 5. Redeploy
eb deploy
```

#### Issue: ECS Task Fails to Start

**Symptoms:**
- Task stops immediately after starting
- "Essential container exited" error

**Solution:**
```bash
# 1. Check CloudWatch logs
aws logs tail /ecs/torqued --follow

# 2. Verify task definition
aws ecs describe-task-definition --task-definition torqued

# 3. Check container health
aws ecs describe-tasks --cluster your-cluster --tasks TASK_ID

# 4. Verify secrets access
aws secretsmanager get-secret-value --secret-id torqued/shopify-token

# 5. Check IAM role permissions
aws iam get-role --role-name ecsTaskExecutionRole
```

## Build and Compilation Issues

### Issue: TypeScript Compilation Errors

**Symptoms:**
- Build fails with type errors
- "Cannot find name" or "Type X is not assignable to type Y"

**Solution:**
```bash
# 1. Run TypeScript compiler
npx tsc --noEmit

# 2. Check tsconfig.json
cat tsconfig.json

# 3. Update type definitions
npm install --save-dev @types/react @types/react-dom

# 4. Clear TypeScript cache
rm -rf node_modules/.cache

# 5. Fix specific errors
# Add type annotations or use 'any' temporarily:
const value: any = unknownValue;
```

### Issue: Vite Build Fails

**Symptoms:**
- "Out of memory" error
- Build hangs indefinitely
- Module resolution errors

**Solution:**
```bash
# 1. Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Check vite.config.ts
cat vite.config.ts

# 4. Build with verbose output
vite build --debug

# 5. Check for circular dependencies
npm run analyze:bundle
```

### Issue: Large Bundle Size

**Symptoms:**
- Bundle size exceeds limits
- Slow page load times

**Solution:**
```bash
# 1. Analyze bundle
npm run analyze:bundle

# 2. Check chunk splitting
cat vite.config.ts

# 3. Enable code splitting
# In vite.config.ts, ensure manualChunks is configured

# 4. Use dynamic imports
# Change: import Component from './Component'
# To: const Component = lazy(() => import('./Component'))

# 5. Remove unused dependencies
npm run optimize:bundle
```

### Issue: ESLint Errors Blocking Build

**Symptoms:**
- Build fails due to linting errors
- "Failed to compile" messages

**Solution:**
```bash
# 1. Run linter
npm run lint

# 2. Auto-fix issues
npm run lint -- --fix

# 3. Temporarily disable for build
# In vite.config.ts, remove ESLint plugin

# 4. Fix common issues
# - Add missing dependencies to useEffect
# - Add key props to list items
# - Remove unused variables

# 5. Update ESLint config
# Edit .eslintrc.json to adjust rules
```

## Runtime Issues

### Issue: Application Crashes on Startup

**Symptoms:**
- Server exits immediately
- "Error: Cannot find module" at runtime

**Solution:**
```bash
# 1. Check error logs
npm start 2>&1 | tee error.log

# 2. Verify all dependencies
npm ci --production

# 3. Check for missing environment variables
node -e "console.log(process.env)" | grep SHOPIFY

# 4. Test locally
npm run dev

# 5. Add error handling
# In server.js or main entry point:
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
```

### Issue: API Requests Failing

**Symptoms:**
- 500 errors
- CORS errors
- Timeout errors

**Solution:**
```bash
# 1. Test API directly
curl -v https://yourstore.myshopify.com/admin/api/2024-01/shop.json \
  -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN"

# 2. Check CORS configuration
# In server.js, add:
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

# 3. Verify API endpoint
# Check Shopify API version is current

# 4. Add request logging
# Log all API requests/responses

# 5. Check rate limits
# Implement exponential backoff
```

### Issue: WebSocket Connection Failures

**Symptoms:**
- Real-time features not working
- WebSocket handshake failed

**Solution:**
```bash
# 1. Check WebSocket server is running
netstat -an | grep $WS_PORT

# 2. Verify firewall rules
# Ensure WS_PORT is open

# 3. Check WebSocket URL
# Should use wss:// for production, ws:// for dev

# 4. Test WebSocket connection
# Use browser console:
const ws = new WebSocket('wss://your-domain.com:8081');
ws.onopen = () => console.log('Connected');

# 5. Check proxy configuration
# Nginx needs WebSocket support:
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

## Performance Issues

### Issue: Slow Page Load Times

**Symptoms:**
- First contentful paint > 3s
- Time to interactive > 5s

**Solution:**
```bash
# 1. Run performance audit
npm run performance:audit

# 2. Analyze bundle size
npm run analyze:bundle

# 3. Enable code splitting
# Use dynamic imports for large components

# 4. Optimize images
# Compress images, use WebP format

# 5. Enable caching
# Set Cache-Control headers
# Use service workers
```

### Issue: High Server CPU Usage

**Symptoms:**
- Server becomes unresponsive
- Slow API responses

**Solution:**
```bash
# 1. Profile application
node --prof server.js

# 2. Check for memory leaks
# Monitor memory usage over time

# 3. Optimize database queries
# Add indexes, use pagination

# 4. Implement caching
# Use Redis for frequently accessed data

# 5. Scale horizontally
# Add more instances/containers
```

## Security and Authentication Issues

### Issue: OAuth Authentication Fails

**Symptoms:**
- Redirect loop
- "Invalid state parameter"

**Solution:**
```bash
# 1. Verify OAuth URLs
echo $OAUTH_AUTH_URL
echo $OAUTH_TOKEN_URL
echo $OAUTH_CALLBACK

# 2. Check callback URL matches
# Must match exactly in OAuth provider settings

# 3. Verify session management
# Check session store is configured

# 4. Test OAuth flow manually
# Follow OAuth flow step by step

# 5. Check for HTTPS requirements
# OAuth requires HTTPS in production
```

### Issue: Secrets Not Accessible

**Symptoms:**
- "Access denied" errors
- Cannot retrieve secrets from manager

**Solution:**
```bash
# For AWS:
# 1. Check IAM policy
aws iam get-role-policy --role-name your-role --policy-name your-policy

# 2. Add secrets access
aws iam put-role-policy --role-name your-role \
  --policy-name SecretsAccess \
  --policy-document file://secrets-policy.json

# For GCP:
# 1. Check permissions
gcloud secrets get-iam-policy secret-name

# 2. Grant access
gcloud secrets add-iam-policy-binding secret-name \
  --member="serviceAccount:SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

## Network and Connectivity Issues

### Issue: DNS Resolution Failures

**Symptoms:**
- "getaddrinfo ENOTFOUND" errors
- Cannot connect to external services

**Solution:**
```bash
# 1. Test DNS resolution
nslookup yourstore.myshopify.com

# 2. Check /etc/hosts
cat /etc/hosts

# 3. Try different DNS server
# Add to /etc/resolv.conf:
nameserver 8.8.8.8

# 4. Verify network connectivity
ping yourstore.myshopify.com

# 5. Check firewall rules
# Ensure outbound HTTPS (443) is allowed
```

### Issue: SSL/TLS Certificate Errors

**Symptoms:**
- "Certificate verification failed"
- "unable to verify the first certificate"

**Solution:**
```bash
# 1. Check certificate
openssl s_client -connect yourstore.myshopify.com:443

# 2. Update CA certificates
# On Ubuntu/Debian:
sudo apt-get install ca-certificates
sudo update-ca-certificates

# 3. For Node.js, add certificates
export NODE_EXTRA_CA_CERTS=/path/to/cert.pem

# 4. Disable verification (NOT for production)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# 5. Check certificate expiration
openssl x509 -in cert.pem -noout -dates
```

## Getting Additional Help

### Diagnostic Information to Collect

When seeking help, provide:

```bash
# 1. Environment information
node --version
npm --version
git --version

# 2. Package information
cat package.json

# 3. Error logs
npm run build 2>&1 | tee build.log

# 4. Validation results
npm run validate:all > validation.log 2>&1

# 5. Network test results
curl -v https://$SHOPIFY_STORE
```

### Support Channels

1. **GitHub Issues**: Open an issue with diagnostic information
2. **Documentation**: Review docs in `/docs` directory
3. **Platform Support**: Contact your cloud provider's support
4. **Community**: Check Shopify dev forums for API issues

## Prevention Best Practices

### Pre-Deployment Checklist
```bash
# Always run before deploying:
npm run validate:all
npm run lint
npm run test
npm run build
npm run security:scan
```

### Monitoring Setup
- Set up application monitoring (Datadog, New Relic)
- Configure error tracking (Sentry)
- Enable log aggregation (CloudWatch, Stackdriver)
- Set up uptime monitoring (Pingdom, UptimeRobot)

### Regular Maintenance
- Update dependencies monthly: `npm update`
- Run security audits: `npm audit`
- Review and rotate secrets quarterly
- Monitor and optimize performance

---

**Still having issues?** Open a detailed issue on GitHub with:
- Error messages
- Steps to reproduce
- Environment details
- Validation output
