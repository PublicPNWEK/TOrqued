# Public Directory

This directory contains static files that are copied to the `dist/` directory during the build process.

## Files

### `.nojekyll`
An empty file that tells GitHub Pages not to process the site with Jekyll. This is important because:
- Jekyll ignores files and directories that start with underscores
- Vite may generate files with underscores in their names
- Without this file, some assets might not be served correctly on GitHub Pages

### `404.html`
A fallback page for handling client-side routing in the Single Page Application (SPA):
- When a user navigates to a non-root path (e.g., `/TOrqued/dashboard`)
- GitHub Pages returns this 404 page
- The script saves the requested URL to sessionStorage
- Redirects to the main index.html
- The main app restores the correct route from sessionStorage

This enables proper deep linking and page refreshes in the SPA.

## Vite Behavior

Vite automatically copies all files from the `public/` directory to the root of `dist/` during the build process. These files are served as-is without processing.

## Adding New Static Files

To add new static files that should be available at the root of the deployment:
1. Add the file to this `public/` directory
2. Run `npm run build`
3. The file will appear in `dist/` at the root level
