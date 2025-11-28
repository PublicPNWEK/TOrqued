# Torqued Automation Bundle v3

A React-based dashboard for Shopify stores with affiliate tracking and real-time analytics.

## Table of Contents
- [What is This?](#what-is-this)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Deploying to Shopify](#deploying-to-shopify)
- [Troubleshooting](#troubleshooting)
- [Advanced Features](#advanced-features)

## What is This?

Torqued is a custom dashboard application that integrates with your Shopify store. It provides:
- 📊 Real-time analytics and reporting
- 🔗 Affiliate tracking integration (LeadDyno)
- 👤 Customer portal functionality
- ⚡ Modern, fast user interface

## Prerequisites

Before you begin, make sure you have:

1. **Node.js and npm installed**
   - Download from [nodejs.org](https://nodejs.org/)
   - Version 18 or higher required
   - Check your version: `node --version` and `npm --version`

2. **A Shopify Store**
   - You'll need admin access to your store
   - The store URL (e.g., `yourstore.myshopify.com`)

3. **Shopify API Credentials**
   - Go to your Shopify admin panel
   - Navigate to: Apps → Develop apps → Create an app
   - Enable "Theme" and "Customer" API access
   - Copy your Access Token (starts with `shpat_`)
   - Note your Theme ID (found in Themes section)

4. **A Code Editor** (optional but recommended)
   - VS Code, Sublime Text, or any text editor you prefer

## Getting Started

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will download all the necessary packages. It may take a few minutes.

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file in your text editor

3. Fill in the **required** values (at minimum):
   ```
   SHOPIFY_STORE=yourstore.myshopify.com
   SHOPIFY_TOKEN=shpat_xxxxxxxxxxxxxx
   SHOPIFY_THEME_ID=123456789
   ```

   **How to find these values:**
   - **SHOPIFY_STORE**: Your store URL without `https://`
   - **SHOPIFY_TOKEN**: From Shopify Admin → Apps → Your App → API credentials
   - **SHOPIFY_THEME_ID**: From Shopify Admin → Online Store → Themes → Click "Customize" on your theme → Look at the URL, the theme ID is the number after `/themes/` (e.g., `https://admin.shopify.com/store/yourstore/themes/123456789` → the ID is `123456789`)

4. Optional: You can leave the other values as-is for now (they enable advanced features)

### Step 3: Test Locally

Run the development server to test everything works:

```bash
npm run dev
```

You should see a message like:
```
VITE v5.4.2  ready in 450 ms
➜  Local:   http://localhost:5173/
```

Open the URL in your browser. You should see the dashboard interface.

**Press `Ctrl+C` to stop the dev server when done.**

## Deploying to Shopify

This process builds your application and uploads it to your Shopify theme.

### Understanding the Deployment Process

The deployment does three things:
1. **Builds** your React app into optimized JavaScript and CSS files
2. **Uploads** these files to your Shopify theme's assets folder
3. **Creates** a Liquid section template that loads your dashboard

### Step-by-Step Deployment

#### Step 1: Build and Deploy

Run the deployment command:

```bash
npm run shopify:deploy
```

**What you'll see:**
```
🔨 Building for Shopify...
[vite builds your app]
✅ Build artifacts renamed
📤 Uploading assets/torqued-dashboard.js
📤 Uploading assets/torqued-dashboard.css
✅ Shopify assets deployed
✅ Shopify Liquid section deployed
```

This takes 1-3 minutes depending on your internet speed.

#### Step 2: Add to Your Shopify Theme

Now that the files are uploaded, you need to add the dashboard to a page:

1. **Log into Shopify Admin**

2. **Go to Online Store → Themes**

3. **Click "Customize" on your current theme**

4. **Navigate to the page** where you want the dashboard to appear
   - For a customer portal: Pages → Customers → Account
   - For a standalone page: Create a new page first

5. **Add the section:**
   - Click "Add section" in the left sidebar
   - Find "Torqued Dashboard" in the list
   - Click to add it to your page

6. **Configure (optional):**
   - You can set the LeadDyno API key in the section settings
   - Enable/disable full-width mode

7. **Click "Save"** in the top right

8. **Test it:**
   - View the page on your store
   - The dashboard should load and display

### Updating After Code Changes

Whenever you make changes to the code:

1. Run `npm run shopify:deploy` again
2. Wait for the upload to complete
3. Refresh your Shopify page (you may need to clear cache with `Ctrl+Shift+R`)

**That's it!** You don't need to re-add the section, just redeploy.

## Troubleshooting

### "Missing required environment variables" error

**Problem:** The deploy script can't find your Shopify credentials.

**Solution:**
- Make sure you created the `.env` file (not `.env.example`)
- Check that `SHOPIFY_STORE`, `SHOPIFY_TOKEN`, and `SHOPIFY_THEME_ID` are filled in
- Make sure there are no quotes around the values
- Restart your terminal after editing `.env`

### "Upload failed" or "401 Unauthorized" error

**Problem:** Your Shopify API token doesn't have the right permissions.

**Solution:**
- Go back to Shopify Admin → Apps → Your App
- Make sure "Theme" API scope is enabled
- Generate a new access token if needed
- Update your `.env` file with the new token

### Dashboard doesn't appear on Shopify page

**Problem:** The section isn't showing up.

**Solution:**
- Make sure you ran `npm run shopify:deploy` successfully
- Check that you added the "Torqued Dashboard" section in the theme customizer
- Try refreshing the page with `Ctrl+Shift+R` (hard refresh)
- Check browser console for JavaScript errors (press F12)

### "Build output not found" error

**Problem:** The build didn't create the expected files.

**Solution:**
- Run `npm run build` by itself first to see if there are build errors
- Make sure all dependencies are installed: `npm install`
- Check that your Node.js version is 18 or higher: `node --version`

### Dashboard looks broken or unstyled

**Problem:** CSS file didn't load properly.

**Solution:**
- Check that both `.js` and `.css` files uploaded (look for both success messages)
- In Shopify theme editor, check that the section is added
- Try deploying again: `npm run shopify:deploy`
- Clear your browser cache

### Need More Help?

- Check the browser console (F12) for error messages
- Verify your `.env` file settings
- Make sure your Shopify app has the correct API permissions
- Try the deployment again from scratch

## Advanced Features

For users who want to explore more capabilities, this application supports:

### Development Tools
- **Local Development**: `npm run dev` - Hot reload for fast iteration
- **Build Only**: `npm run build` - Create production build without deploying
- **Preview Build**: `npm run preview` - Test production build locally

### Code Quality
- **Linting**: `npm run lint` - Check code for errors
- **Security Scan**: `npm run security:scan` - Check for vulnerabilities
- **Testing**: `npm run test` - Run unit tests (if configured)

### Optional Integrations

The application can integrate with additional services (requires configuration in `.env`):

- **LeadDyno**: Affiliate tracking and management
- **OAuth2**: Custom authentication for advanced user management
- **WebSocket Server**: Real-time updates (requires separate server setup)
- **Cloud Secrets**: AWS/GCP integration for secure credential storage

See `.env.example` for all available configuration options.

### Performance & Advanced Deployment

- **Bundle Analysis**: `npm run analyze:bundle` - See what's in your build
- **Edge Deployment**: `npm run deploy:edge` - Deploy to Cloudflare Workers (requires setup)
- **AI Optimization**: `npm run ai:optimize` - AI-powered bundle optimization (requires OpenAI key)

For detailed information about these features, see [COMPETITIVE_ADVANTAGES.md](COMPETITIVE_ADVANTAGES.md).

---

**Questions or Issues?** Open an issue on GitHub or contact your development team.
