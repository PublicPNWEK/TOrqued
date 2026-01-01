import fs from 'fs';
import path from 'path';
import { validateShopifyEnv, uploadShopifyAsset } from './shopify-client.mjs';

const { SHOP, TOKEN, THEME_ID } = validateShopifyEnv();

const files = [
  { key: 'assets/torqued-dashboard.js', path: path.resolve('./dist/assets/torqued-dashboard.js') },
  { key: 'assets/torqued-dashboard.css', path: path.resolve('./dist/assets/torqued-dashboard.css') }
].filter(file => fs.existsSync(file.path));

if (files.length === 0) {
  console.error('❌ No build artifacts found to upload.');
  process.exit(1);
}

(async () => {
  for (const file of files) {
    console.log('📤 Uploading', file.key);

    let content;
    try {
      content = fs.readFileSync(file.path, 'utf8');
    } catch (err) {
      console.error(`❌ Failed to read file: ${file.path}`);
      process.exit(1);
    }

    try {
      await uploadShopifyAsset(SHOP, TOKEN, THEME_ID, file.key, content);
    } catch (err) {
      console.error(`❌ ${err.message}`);
      process.exit(1);
    }
  }

  console.log('✅ Shopify assets deployed');
})();
