import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('?? Building for Shopify...');
execSync('npm run build', { stdio: 'inherit' });

const assetDir = path.resolve('./dist/assets');

const jsFile = fs.readdirSync(assetDir).find(f => f.endsWith('.js'));
const cssFile = fs.readdirSync(assetDir).find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  throw new Error('Build output not found');
}

fs.copyFileSync(
  path.join(assetDir, jsFile),
  path.join(assetDir, 'torqued-dashboard.js')
);

fs.copyFileSync(
  path.join(assetDir, cssFile),
  path.join(assetDir, 'torqued-dashboard.css')
);

console.log('? Build artifacts renamed');
