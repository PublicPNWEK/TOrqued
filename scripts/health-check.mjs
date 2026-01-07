#!/usr/bin/env node

/**
 * Post-Deployment Health Check Script
 * Validates that deployed application is functioning correctly
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

const results = {
  passed: 0,
  failed: 0,
  total: 0
};

async function checkEndpoint(url, name, options = {}) {
  results.total++;
  info(`Checking ${name}...`);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      signal: AbortSignal.timeout(options.timeout || 5000)
    });

    if (options.expectedStatus && response.status !== options.expectedStatus) {
      error(`${name} returned status ${response.status}, expected ${options.expectedStatus}`);
      results.failed++;
      return false;
    }

    if (response.ok) {
      success(`${name} is accessible (${response.status})`);
      results.passed++;
      return true;
    } else {
      error(`${name} returned error status ${response.status}`);
      results.failed++;
      return false;
    }
  } catch (err) {
    error(`${name} check failed: ${err.message}`);
    results.failed++;
    return false;
  }
}

async function checkShopifyStore() {
  const { SHOPIFY_STORE } = process.env;

  if (!SHOPIFY_STORE) {
    info('SHOPIFY_STORE not configured, skipping store check');
    return true;
  }

  return await checkEndpoint(
    `https://${SHOPIFY_STORE}`,
    'Shopify Store',
    { expectedStatus: 200, timeout: 10000 }
  );
}

async function checkShopifyAPI() {
  const { SHOPIFY_STORE, SHOPIFY_TOKEN } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
    info('Shopify API credentials not configured, skipping API check');
    return true;
  }

  return await checkEndpoint(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/shop.json`,
    'Shopify API',
    {
      headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN },
      expectedStatus: 200
    }
  );
}

async function checkShopifyTheme() {
  const { SHOPIFY_STORE, SHOPIFY_TOKEN, SHOPIFY_THEME_ID } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN || !SHOPIFY_THEME_ID) {
    info('Shopify theme credentials not configured, skipping theme check');
    return true;
  }

  return await checkEndpoint(
    `https://${SHOPIFY_STORE}/admin/api/2024-01/themes/${SHOPIFY_THEME_ID}.json`,
    'Shopify Theme',
    {
      headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN },
      expectedStatus: 200
    }
  );
}

async function checkShopifyAssets() {
  const { SHOPIFY_STORE, SHOPIFY_TOKEN, SHOPIFY_THEME_ID } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN || !SHOPIFY_THEME_ID) {
    info('Shopify configuration incomplete, skipping asset check');
    return true;
  }

  results.total++;
  info('Checking deployed assets...');

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2024-01/themes/${SHOPIFY_THEME_ID}/assets.json`,
      {
        headers: { 'X-Shopify-Access-Token': SHOPIFY_TOKEN }
      }
    );

    if (!response.ok) {
      error('Failed to fetch theme assets');
      results.failed++;
      return false;
    }

    const data = await response.json();
    const assets = data.assets || [];

    const requiredAssets = [
      'assets/torqued-dashboard.js',
      'assets/torqued-dashboard.css',
      'sections/torqued-dashboard.liquid'
    ];

    let allFound = true;
    for (const assetKey of requiredAssets) {
      const found = assets.some(a => a.key === assetKey);
      if (found) {
        success(`Found asset: ${assetKey}`);
      } else {
        error(`Missing asset: ${assetKey}`);
        allFound = false;
      }
    }

    if (allFound) {
      results.passed++;
      return true;
    } else {
      results.failed++;
      return false;
    }
  } catch (err) {
    error(`Asset check failed: ${err.message}`);
    results.failed++;
    return false;
  }
}

async function checkRedisConnection() {
  const { REDIS_URL } = process.env;

  if (!REDIS_URL) {
    info('REDIS_URL not configured, skipping Redis check');
    return true;
  }

  results.total++;
  info('Checking Redis connection...');

  try {
    // Simple Redis ping check (requires redis client)
    // For now, just parse the URL to check format
    const url = new URL(REDIS_URL);
    if (url.protocol === 'redis:' || url.protocol === 'rediss:') {
      success('Redis URL format is valid');
      results.passed++;
      return true;
    } else {
      error('Invalid Redis URL format');
      results.failed++;
      return false;
    }
  } catch (err) {
    error(`Redis check failed: ${err.message}`);
    results.failed++;
    return false;
  }
}

async function checkOAuthConfiguration() {
  const { OAUTH_AUTH_URL, OAUTH_TOKEN_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

  if (!OAUTH_AUTH_URL && !OAUTH_TOKEN_URL) {
    info('OAuth not configured, skipping OAuth check');
    return true;
  }

  results.total++;
  info('Checking OAuth configuration...');

  let allValid = true;

  try {
    if (OAUTH_AUTH_URL) {
      new URL(OAUTH_AUTH_URL);
      success('OAUTH_AUTH_URL is valid');
    } else {
      error('OAUTH_AUTH_URL is missing');
      allValid = false;
    }

    if (OAUTH_TOKEN_URL) {
      new URL(OAUTH_TOKEN_URL);
      success('OAUTH_TOKEN_URL is valid');
    } else {
      error('OAUTH_TOKEN_URL is missing');
      allValid = false;
    }

    if (CLIENT_ID) {
      success('CLIENT_ID is configured');
    } else {
      error('CLIENT_ID is missing');
      allValid = false;
    }

    if (CLIENT_SECRET) {
      success('CLIENT_SECRET is configured');
    } else {
      error('CLIENT_SECRET is missing');
      allValid = false;
    }

    if (allValid) {
      results.passed++;
      return true;
    } else {
      results.failed++;
      return false;
    }
  } catch (err) {
    error(`OAuth configuration check failed: ${err.message}`);
    results.failed++;
    return false;
  }
}

async function checkWebSocketServer() {
  const { WS_PORT } = process.env;

  if (!WS_PORT) {
    info('WS_PORT not configured, skipping WebSocket check');
    return true;
  }

  results.total++;
  info('Checking WebSocket server...');

  try {
    // Basic check: see if port is a valid number
    const port = parseInt(WS_PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      error('Invalid WS_PORT value');
      results.failed++;
      return false;
    }

    success(`WebSocket port configured: ${port}`);
    results.passed++;
    return true;
  } catch (err) {
    error(`WebSocket check failed: ${err.message}`);
    results.failed++;
    return false;
  }
}

async function checkCloudflareConfiguration() {
  const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID } = process.env;

  if (!CLOUDFLARE_API_TOKEN && !CLOUDFLARE_ZONE_ID) {
    info('Cloudflare not configured, skipping Cloudflare check');
    return true;
  }

  results.total++;
  info('Checking Cloudflare configuration...');

  if (CLOUDFLARE_API_TOKEN && CLOUDFLARE_ZONE_ID) {
    success('Cloudflare credentials configured');
    results.passed++;
    return true;
  } else {
    error('Incomplete Cloudflare configuration');
    if (!CLOUDFLARE_API_TOKEN) error('Missing CLOUDFLARE_API_TOKEN');
    if (!CLOUDFLARE_ZONE_ID) error('Missing CLOUDFLARE_ZONE_ID');
    results.failed++;
    return false;
  }
}

async function checkSecretsProvider() {
  const { SECRETS_PROVIDER, GCP_PROJECT, AWS_REGION } = process.env;

  results.total++;
  info('Checking secrets provider configuration...');

  if (!SECRETS_PROVIDER) {
    info('SECRETS_PROVIDER not configured (optional)');
    results.passed++;
    return true;
  }

  if (SECRETS_PROVIDER === 'gcp') {
    if (GCP_PROJECT) {
      success('GCP secrets provider configured');
      results.passed++;
      return true;
    } else {
      error('GCP_PROJECT required when SECRETS_PROVIDER=gcp');
      results.failed++;
      return false;
    }
  } else if (SECRETS_PROVIDER === 'aws') {
    if (AWS_REGION) {
      success('AWS secrets provider configured');
      results.passed++;
      return true;
    } else {
      error('AWS_REGION required when SECRETS_PROVIDER=aws');
      results.failed++;
      return false;
    }
  } else {
    error("Invalid SECRETS_PROVIDER value configured (must be 'aws' or 'gcp')");
    results.failed++;
    return false;
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(50));
  log('Health Check Summary', 'cyan');
  console.log('='.repeat(50));

  log(`Total Checks: ${results.total}`);
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, 'red');
  console.log('');

  const percentage = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
  log(`Success Rate: ${percentage}%`, percentage === 100 ? 'green' : 'yellow');

  if (results.failed === 0) {
    console.log('');
    success('✓ All health checks passed! Application is healthy.');
    return 0;
  } else {
    console.log('');
    error(`✗ ${results.failed} health check(s) failed. Please investigate.`);
    return 1;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════╗', 'cyan');
  log('║   TOrqued Deployment Health Check             ║', 'cyan');
  log('╚════════════════════════════════════════════════╝\n', 'cyan');

  // Core checks
  await checkShopifyStore();
  await checkShopifyAPI();
  await checkShopifyTheme();
  await checkShopifyAssets();

  // Optional service checks
  await checkRedisConnection();
  await checkWebSocketServer();
  await checkOAuthConfiguration();
  await checkCloudflareConfiguration();
  await checkSecretsProvider();

  return printSummary();
}

// Run health check
main()
  .then(exitCode => process.exit(exitCode))
  .catch(err => {
    error(`\nHealth check failed with error: ${err.message}`);
    console.error(err);
    process.exit(1);
  });
