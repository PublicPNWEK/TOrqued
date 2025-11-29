import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔨 Building for Shopify...');
execSync('npm run build', { stdio: 'inherit', env: { ...process.env, BUILD_TARGET: 'shopify' } });

const assetDir = path.resolve('./dist/assets');

const jsFile = fs.readdirSync(assetDir).find(f => f.endsWith('.js') && !f.endsWith('.map'));
const cssFile = fs.readdirSync(assetDir).find(f => f.endsWith('.css'));

if (!jsFile) {
  throw new Error('Build output (JS file) not found');
}

fs.copyFileSync(
  path.join(assetDir, jsFile),
  path.join(assetDir, 'torqued-dashboard.js')
);

if (cssFile) {
  fs.copyFileSync(
    path.join(assetDir, cssFile),
    path.join(assetDir, 'torqued-dashboard.css')
  );
  console.log('✅ Build artifacts renamed (JS + CSS)');
} else {
  console.log('✅ Build artifacts renamed (JS only, no CSS file found)');
}
