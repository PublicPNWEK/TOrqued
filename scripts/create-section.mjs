import fs from 'fs';
import fetch from 'node-fetch';

const SHOP = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;
const THEME_ID = process.env.SHOPIFY_THEME_ID;

if (!SHOP || !TOKEN || !THEME_ID) {
  console.error('? Missing required environment variables.');
  process.exit(1);
}

const sectionKey = 'sections/torqued-interface.liquid';

const template = `
{% schema %}
{
  "name": "Torqued Dashboard",
  "target": "section",
  "settings": [
    { "type": "header", "content": "Configuration" },
    { "type": "checkbox", "id": "full_width", "label": "Full Width Mode", "default": true },
    { "type": "text", "id": "leaddyno_key", "label": "LeadDyno Public Key" }
  ],
  "presets": [{ "name": "Torqued Dashboard" }]
}
{% endschema %}

{{ 'torqued-dashboard.css' | asset_url | stylesheet_tag }}

<div class=\"torqued-app-container\">\n  <div id=\"torqued-root\"></div>\n</div>

<script>
window.__TORQUED_CONFIG__ = {
  shopDomain: "{{ shop.permanent_domain }}",
  customerId: {{ customer.id | json }},
  customerEmail: {{ customer.email | json }},
  customerName: {{ customer.name | json }},
  leadDynoKey: "{{ section.settings.leaddyno_key }}"
};
</script>

<script src=\"{{ 'torqued-dashboard.js' | asset_url }}\" defer></script>
`;

(async () => {
  const res = await fetch(
    `https://${SHOP}/admin/api/2024-01/themes/${THEME_ID}/assets.json`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': TOKEN
      },
      body: JSON.stringify({ asset: { key: sectionKey, value: template } })
    }
  );

  if (!res.ok) {
    const t = await res.text();
    console.error(`? Section upload failed: ${t}`);
    process.exit(1);
  }

  console.log('? Shopify Liquid section deployed');
})();
