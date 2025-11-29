#!/usr/bin/env node

/**
 * Shopify Theme Structure Validator
 * Validates that all required files and directories exist for a valid Shopify theme
 */

import fs from 'fs';

const requiredDirectories = [
  'config',
  'layout',
  'locales',
  'sections',
  'templates'
];

const requiredFiles = [
  'config/settings_schema.json',
  'layout/theme.liquid',
  'locales/en.default.json'
];

const optionalDirectories = [
  'assets',
  'snippets'
];

let isValid = true;

console.log('🔍 Validating Shopify theme structure...\n');

// Check required directories
console.log('📁 Checking required directories:');
for (const dir of requiredDirectories) {
  const exists = fs.existsSync(dir);
  const status = exists ? '✓' : '✗';
  console.log(`  ${status} ${dir}/`);
  if (!exists) isValid = false;
}

// Check optional directories
console.log('\n📁 Checking optional directories:');
for (const dir of optionalDirectories) {
  const exists = fs.existsSync(dir);
  const status = exists ? '✓' : '○';
  console.log(`  ${status} ${dir}/`);
}

// Check required files
console.log('\n📄 Checking required files:');
for (const file of requiredFiles) {
  const exists = fs.existsSync(file);
  const status = exists ? '✓' : '✗';
  console.log(`  ${status} ${file}`);
  if (!exists) isValid = false;
}

// Validate config/settings_schema.json
console.log('\n📋 Validating configuration files:');
try {
  const settingsSchema = JSON.parse(fs.readFileSync('config/settings_schema.json', 'utf8'));
  const hasThemeInfo = settingsSchema.some(section => section.name === 'theme_info');
  if (hasThemeInfo) {
    console.log('  ✓ settings_schema.json contains theme_info');
  } else {
    console.log('  ✗ settings_schema.json missing theme_info section');
    isValid = false;
  }
} catch (err) {
  console.log(`  ✗ Error parsing settings_schema.json: ${err.message}`);
  isValid = false;
}

// Validate locales
console.log('\n🌐 Validating locales:');
try {
  const locales = JSON.parse(fs.readFileSync('locales/en.default.json', 'utf8'));
  console.log('  ✓ en.default.json is valid JSON');
} catch (err) {
  console.log(`  ✗ Error parsing en.default.json: ${err.message}`);
  isValid = false;
}

// Check for templates
console.log('\n📄 Checking templates:');
const templates = fs.readdirSync('templates');
const templateCount = templates.length;
console.log(`  ℹ Found ${templateCount} template(s)`);
if (templateCount === 0) {
  console.log('  ⚠ Warning: No templates found (at least index.liquid or index.json recommended)');
}

// Check for sections
console.log('\n📦 Checking sections:');
const sections = fs.readdirSync('sections').filter(f => f.endsWith('.liquid'));
const sectionCount = sections.length;
console.log(`  ℹ Found ${sectionCount} section(s)`);
if (sectionCount === 0) {
  console.log('  ⚠ Warning: No sections found');
}

// Final result
console.log('\n' + '='.repeat(50));
if (isValid) {
  console.log('✅ Theme structure is valid!');
  console.log('\nYour theme can be imported into Shopify via:');
  console.log('  1. GitHub integration in Shopify Admin');
  console.log('  2. Shopify CLI: shopify theme push');
  console.log('  3. Theme zip upload');
  process.exit(0);
} else {
  console.log('❌ Theme structure has issues that need to be fixed');
  process.exit(1);
}
