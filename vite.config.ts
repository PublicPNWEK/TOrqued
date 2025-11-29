import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/TOrqued/' : '/',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: process.env.BUILD_TARGET === 'shopify' ? {} : {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          ui: ['react-joyride', 'react-window'],
          store: ['zustand']
        }
      }
      output: process.env.BUILD_TARGET === 'shopify' 
        ? {} 
        : {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              query: ['@tanstack/react-query'],
              ui: ['react-joyride', 'react-window'],
              store: ['zustand']
            }
          }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query']
  }
})
