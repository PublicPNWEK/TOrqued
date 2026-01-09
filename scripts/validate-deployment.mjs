#!/usr/bin/env node

/**
 * Comprehensive Deployment Validation Script
 * Validates deployment across multiple platforms and checks
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

function section(message) {
  log(`\n${'='.repeat(50)}`, 'blue');
  log(message, 'blue');
  log('='.repeat(50), 'blue');
}

// Validation checks
const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

async function checkNodeVersion() {
  section('Node.js Version Check');
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);

    if (majorVersion >= 18) {
      success(`Node.js version ${version} (required: 18+)`);
      checks.passed++;
      return true;
    } else {
      error(`Node.js version ${version} is too old (required: 18+)`);
      checks.failed++;
      return false;
    }
  } catch (err) {
    error(`Failed to check Node.js version: ${err.message}`);
    checks.failed++;
    return false;
  }
}

async function checkDependencies() {
  section('Dependencies Check');
  try {
    if (!existsSync('node_modules')) {
      error('node_modules directory not found. Run: npm ci');
      checks.failed++;
      return false;
    }

    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    let allInstalled = true;
    for (const dep in dependencies) {
      if (!existsSync(`node_modules/${dep}`)) {
        error(`Missing dependency: ${dep}`);
        allInstalled = false;
      }
    }

    if (allInstalled) {
      success(`All ${Object.keys(dependencies).length} dependencies installed`);
      checks.passed++;
      return true;
    } else {
      error('Some dependencies are missing. Run: npm ci');
      checks.failed++;
      return false;
    }
  } catch (err) {
    error(`Failed to check dependencies: ${err.message}`);
    checks.failed++;
    return false;
  }
}

async function checkEnvironmentVariables() {
  section('Environment Variables Check');

  const runQuick = process.argv.includes('--quick');

  const requiredVars = ['SHOPIFY_STORE', 'SHOPIFY_TOKEN', 'SHOPIFY_THEME_ID'];
  const optionalVars = [
    'OAUTH_AUTH_URL',
    'OAUTH_TOKEN_URL',
    'OAUTH_CALLBACK',
    'CLIENT_ID',
    'CLIENT_SECRET',
    'REDIS_URL',
    'WS_PORT',
    'OPENAI_API_KEY',
    'CLOUDFLARE_API_TOKEN',
    'GCP_PROJECT',
    'AWS_REGION'
  ];

  // Check if .env file exists
  if (!existsSync('.env')) {
    warning('.env file not found. Using environment variables or defaults.');
    warning('Recommended: Copy .env.example to .env and configure');
    checks.warnings++;
  }

  // Load environment variables
  let missingRequired = [];
  let presentOptional = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingRequired.push(varName);
    } else {
      success(`${varName} is configured`);
    }
  }

  for (const varName of optionalVars) {
    if (process.env[varName]) {
      presentOptional.push(varName);
    }
  }

  if (missingRequired.length > 0) {
    const message = `Missing required environment variables: ${missingRequired.join(', ')}`;

    if (runQuick) {
      warning(message);
      warning('Quick mode: treating missing env vars as warnings');
      checks.warnings++;
      return true;
    }

    error(message);
    checks.failed++;
    return false;
  } else {
    success('All required environment variables configured');
    checks.passed++;
  }

  if (presentOptional.length > 0) {
    info(`Optional features enabled: ${presentOptional.join(', ')}`);
  }

  return true;
}

async function checkBuildArtifacts() {
  section('Build Artifacts Check');

  if (!existsSync('dist')) {
    warning('dist directory not found. Run: npm run build');
    checks.warnings++;
    return false;
  }

  const requiredFiles = [
    'dist/index.html',
    'dist/assets'
  ];

  let allPresent = true;
  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      error(`Missing build artifact: ${file}`);
      allPresent = false;
    }
  }

  if (allPresent) {
    success('All build artifacts present');
    checks.passed++;
    return true;
  } else {
    error('Some build artifacts missing. Run: npm run build');
    checks.failed++;
    return false;
  }
}

async function checkTypeScript() {
  section('TypeScript Check');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    success('TypeScript compilation successful');
    checks.passed++;
    return true;
  } catch (err) {
    error('TypeScript compilation failed');
    error(err.stdout?.toString() || err.message);
    checks.failed++;
    return false;
  }
}

async function checkLinting() {
  section('ESLint Check');
  try {
    execSync('npm run lint', { stdio: 'pipe' });
    success('Linting passed');
    checks.passed++;
    return true;
  } catch (err) {
    error('Linting failed');
    warning('Run: npm run lint -- --fix to auto-fix issues');
    checks.failed++;
    return false;
  }
}

async function checkSecurityVulnerabilities() {
  section('Security Vulnerabilities Check');
  try {
    const result = execSync('npm audit --audit-level=moderate --json', { stdio: 'pipe' });
    const audit = JSON.parse(result.toString());

    if (audit.metadata.vulnerabilities.total === 0) {
      success('No security vulnerabilities found');
      checks.passed++;
      return true;
    } else {
      const { moderate, high, critical } = audit.metadata.vulnerabilities;
      warning(`Found vulnerabilities: ${moderate || 0} moderate, ${high || 0} high, ${critical || 0} critical`);
      warning('Run: npm audit fix to fix vulnerabilities');
      checks.warnings++;
      return true;
    }
  } catch (err) {
    error('Security audit failed');
    checks.failed++;
    return false;
  }
}

async function checkShopifyConnection() {
  section('Shopify Connection Check');

  const { SHOPIFY_STORE, SHOPIFY_TOKEN } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
    warning('Shopify credentials not configured. Skipping connection test.');
    checks.warnings++;
    return false;
  }

  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN
      }
    });

    if (response.ok) {
      const data = await response.json();
      success(`Connected to Shopify store: ${data.shop.name}`);
      checks.passed++;
      return true;
    } else {
      error(`Shopify connection failed: ${response.status} ${response.statusText}`);
      checks.failed++;
      return false;
    }
  } catch (err) {
    error(`Failed to connect to Shopify: ${err.message}`);
    checks.failed++;
    return false;
  }
}

async function checkGitStatus() {
  section('Git Repository Check');
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });

    if (status.trim() === '') {
      success('Working directory is clean');
      checks.passed++;
      return true;
    } else {
      warning('Working directory has uncommitted changes');
      info('Uncommitted files:');
      console.log(status);
      checks.warnings++;
      return true;
    }
  } catch (err) {
    warning('Not a git repository or git not available');
    checks.warnings++;
    return true;
  }
}

async function checkBuildSize() {
  section('Build Size Check');

  if (!existsSync('dist')) {
    warning('dist directory not found. Skipping size check.');
    checks.warnings++;
    return false;
  }

  try {
    const result = execSync('du -sh dist', { encoding: 'utf8' });
    const size = result.split('\t')[0];

    info(`Build size: ${size}`);

    // Check if size is reasonable (< 10MB)
    const sizeBytes = parseInt(execSync('du -s dist', { encoding: 'utf8' }).split('\t')[0]) * 1024;
    const sizeMB = sizeBytes / (1024 * 1024);

    if (sizeMB < 10) {
      success(`Build size is within reasonable limits (${sizeMB.toFixed(2)} MB)`);
      checks.passed++;
      return true;
    } else {
      warning(`Build size is large (${sizeMB.toFixed(2)} MB). Consider optimization.`);
      warning('Run: npm run analyze:bundle to analyze bundle size');
      checks.warnings++;
      return true;
    }
  } catch (err) {
    warning('Could not determine build size');
    checks.warnings++;
    return true;
  }
}

async function checkDeploymentTarget() {
  section('Deployment Target Check');

  const targets = [];

  if (process.env.SHOPIFY_STORE && process.env.SHOPIFY_TOKEN) {
    targets.push('Shopify');
  }

  if (process.env.CLOUDFLARE_API_TOKEN) {
    targets.push('Cloudflare Workers');
  }

  if (process.env.GCP_PROJECT) {
    targets.push('Google Cloud Platform');
  }

  if (process.env.AWS_REGION) {
    targets.push('Amazon Web Services');
  }

  if (targets.length === 0) {
    warning('No deployment targets configured');
    info('Configure at least one deployment target in .env file');
    checks.warnings++;
    return false;
  }

  success(`Configured deployment targets: ${targets.join(', ')}`);
  checks.passed++;
  return true;
}

function printSummary() {
  section('Validation Summary');

  console.log('');
  log(`Checks Passed: ${checks.passed}`, 'green');
  log(`Checks Failed: ${checks.failed}`, 'red');
  log(`Warnings: ${checks.warnings}`, 'yellow');
  console.log('');

  if (checks.failed === 0) {
    success('✓ All critical checks passed! Ready for deployment.');
    return 0;
  } else {
    error('✗ Some checks failed. Please fix the issues before deploying.');
    return 1;
  }
}

// Main execution
async function main() {
  log('\n╔════════════════════════════════════════════════╗', 'blue');
  log('║   TOrqued Deployment Validation Suite         ║', 'blue');
  log('╚════════════════════════════════════════════════╝\n', 'blue');


  const runAll = process.argv.includes('--all');
  const runQuick = process.argv.includes('--quick');


  // Quick checks (fast, essential)
  await checkNodeVersion();
  await checkDependencies();
  await checkEnvironmentVariables();

  if (runQuick) {
    return printSummary();
  }

  // Standard checks
  await checkBuildArtifacts();
  await checkGitStatus();
  await checkDeploymentTarget();

  if (runAll) {
    // Comprehensive checks (slower)
    await checkTypeScript();
    await checkLinting();
    await checkSecurityVulnerabilities();
    await checkShopifyConnection();
    await checkBuildSize();
  }

  return printSummary();
}

// Run validation
main()
  .then(exitCode => process.exit(exitCode))
  .catch(err => {
    error(`\nValidation failed with error: ${err.message}`);
    console.error(err);
    process.exit(1);
  });
