import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const SHOP = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;
const THEME_ID = process.env.SHOPIFY_THEME_ID;

if (!SHOP || !TOKEN || !THEME_ID) {
  console.error('? Missing required environment variables.');
  process.exit(1);
}

const files = [
  { key: 'assets/torqued-dashboard.js', path: path.resolve('./dist/assets/torqued-dashboard.js') },
  { key: 'assets/torqued-dashboard.css', path: path.resolve('./dist/assets/torqued-dashboard.css') }
].filter(file => fs.existsSync(file.path));

if (files.length === 0) {
  console.error('? No build artifacts found to upload.');
  process.exit(1);
}

(async () => {
  for (const file of files) {
    console.log('? Uploading', file.key);

    const content = fs.readFileSync(file.path, 'utf8');

    const res = await fetch(
      `https://${SHOP}/admin/api/2024-01/themes/${THEME_ID}/assets.json`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': TOKEN
        },
        body: JSON.stringify({ asset: { key: file.key, value: content } })
      }
    );

    if (!res.ok) {
      const t = await res.text();
      console.error(`? Upload failed for ${file.key}: ${t}`);
      process.exit(1);
    }
  }

  console.log('? Shopify assets deployed');
})();
