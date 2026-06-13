import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Canonical absolute origin (no trailing slash) for canonical + OG URLs.
const SITE = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: SITE,
  output: 'server', // SSR by default; marketing pages opt into static via `export const prerender = true`
  adapter: node({ mode: 'middleware' }), // SSR handler is mounted into Express in production (server.mjs)
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Dev only: keep the browser on same-origin relative URLs (matches prod).
      // astro dev runs :4321, the Express API runs :3001.
      proxy: {
        '/api': { target: 'http://localhost:3001', changeOrigin: true },
        '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
      },
    },
  },
});
