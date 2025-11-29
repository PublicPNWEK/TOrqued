# Shopify Theme Import Guide

This repository is structured as a complete Shopify theme and can be imported directly into your Shopify store.

## 🎯 Why This Works Now

The repository includes all required Shopify theme files:
- ✅ `config/settings_schema.json` - Theme configuration
- ✅ `layout/theme.liquid` - Main theme layout
- ✅ `locales/en.default.json` - Translation files
- ✅ `sections/` - Reusable theme sections
- ✅ `templates/` - Page templates
- ✅ `snippets/` - Code snippets

## 📥 Import Methods

### Method 1: GitHub Integration (Recommended)

1. Go to your Shopify Admin
2. Navigate to **Online Store** → **Themes**
3. Click **Add theme** → **Connect from GitHub**
4. Authorize GitHub if prompted
5. Select this repository: `PublicPNWEK/TOrqued`
6. Click **Import**
7. Wait for the import to complete

### Method 2: Shopify CLI

Install Shopify CLI if you haven't already:
```bash
npm install -g @shopify/cli @shopify/theme
```

Then push the theme:
```bash
# Login to Shopify
shopify auth login

# Push the theme
shopify theme push --store your-store.myshopify.com
```

### Method 3: ZIP Upload

1. Download or clone this repository
2. Create a ZIP file containing these directories:
   - `config/`
   - `layout/`
   - `locales/`
   - `sections/`
   - `templates/`
   - `assets/` (if exists)
   - `assets/`
   - `snippets/`
3. Go to **Online Store** → **Themes**
4. Click **Add theme** → **Upload ZIP file**
5. Select your ZIP file

## 🔧 Post-Import Setup

### 1. Configure Theme Settings

After importing, configure your theme:

1. Go to **Online Store** → **Themes**
2. Click **Customize** on your new theme
3. Go to **Theme settings** → **Torqued Configuration**
4. Set your LeadDyno API key and other options

### 2. Deploy Dashboard Assets

Build and deploy the React dashboard:

```bash
# Install dependencies
npm ci

# Copy and configure environment variables
cp .env.example .env
# Edit .env and add your Shopify credentials

# Build and deploy
npm run shopify:deploy
```

This will:
- Build the React application
- Upload JavaScript and CSS to your theme's assets
- Create/update the Torqued dashboard section

### 3. Create a Dashboard Page

1. In Shopify Admin, go to **Online Store** → **Pages**
2. Click **Add page**
3. Enter a title (e.g., "Affiliate Dashboard")
4. In the template selector (right sidebar), choose **page.dashboard**
5. Save the page

The Torqued dashboard will now appear on that page!

## 🧪 Validate Theme Structure

To verify your theme structure is valid before importing:

```bash
npm run shopify:validate
```

This checks:
- All required directories exist
- All required files are present
- Configuration files are valid JSON
- Theme info is properly configured

## 🎨 Theme Customization

### Using the Torqued Dashboard Section

The `torqued-interface` section can be added to any page:

1. In the theme editor, click **Add section**
2. Select **Torqued Dashboard**
3. Configure section settings

### Theme Settings

Available in **Theme settings** → **Torqued Configuration**:

- **LeadDyno Public Key** - Your affiliate tracking key
- **Full Width Mode** - Enable/disable full-width dashboard
- **Enable Edge Caching** - Cloudflare edge caching
- **Enable AI Personalization** - OpenAI features
- **Enable Fraud Detection** - ML-based fraud detection

## 🔍 Troubleshooting

### "No compatible themes in repo" Error

This error occurs when Shopify can't find required theme files. This has been fixed by adding:
- Proper directory structure
- Required configuration files
- Valid settings_schema.json
- Theme layout files

### Theme Not Appearing After Import

1. Check that all files were uploaded:
   ```bash
   npm run shopify:validate
   ```

2. Ensure you're on the correct branch (usually `main` or `master`)

3. Check Shopify's error logs in the theme import screen

### Dashboard Not Loading

1. Ensure assets are deployed:
   ```bash
   npm run shopify:deploy
   ```

2. Check that `torqued-dashboard.js` and `torqued-dashboard.css` are in your theme's assets

3. Verify environment variables are set correctly in `.env`

## 📚 Additional Resources

- [Shopify Theme Development Documentation](https://shopify.dev/docs/themes)
- [Shopify CLI Documentation](https://shopify.dev/docs/themes/tools/cli)
- [GitHub Integration Guide](https://help.shopify.com/en/manual/online-store/themes/adding-themes#add-a-theme-from-github)

## 🤝 Support

If you encounter issues:
1. Check the [Issues](https://github.com/PublicPNWEK/TOrqued/issues) page
2. Review this documentation
3. Open a new issue with details about your problem

---

**Note**: After importing the theme, you'll still need to build and deploy the React dashboard assets using `npm run shopify:deploy` to have a fully functional system.
