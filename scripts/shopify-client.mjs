import fetch from 'node-fetch';

export function validateShopifyEnv() {
  const SHOP = process.env.SHOPIFY_STORE;
  const TOKEN = process.env.SHOPIFY_TOKEN;
  const THEME_ID = process.env.SHOPIFY_THEME_ID;

  if (!SHOP || !TOKEN || !THEME_ID) {
    console.error('❌ Missing required environment variables.');
    process.exit(1);
  }

  return { SHOP, TOKEN, THEME_ID };
}

export async function uploadShopifyAsset(shop, token, themeId, key, value) {
  const res = await fetch(
    `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ asset: { key, value } })
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${key}: ${text}`);
  }

  return res;
}
