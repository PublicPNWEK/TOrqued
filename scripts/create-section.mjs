import { validateShopifyEnv, uploadShopifyAsset } from './shopify-client.mjs';

const { SHOP, TOKEN, THEME_ID } = validateShopifyEnv();

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
  try {
    await uploadShopifyAsset(SHOP, TOKEN, THEME_ID, sectionKey, template);
    console.log('✅ Shopify Liquid section deployed');
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
})();
