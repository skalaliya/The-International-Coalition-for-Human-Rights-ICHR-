import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Canonical absolute origin (no trailing slash) for canonical + OG URLs.
const SITE = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: SITE,
  output: 'server', // SSR by default; marketing pages opt into static via `export const prerender = true`
  adapter: vercel(),
  // English lives at the root (`/`); Arabic and French are served under `/ar` and `/fr`.
  // `prefixDefaultLocale: false` keeps every existing English URL unchanged.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  // Stray `/en/*` links redirect to the canonical root path.
  redirects: {
    '/en': '/',
    '/en/[...rest]': '/[...rest]',
  },
  // The admin API authenticates with Bearer tokens (not cookies), so CSRF is not
  // a threat. Astro's checkOrigin would otherwise 403 same-origin POST/DELETE
  // requests that omit a form Content-Type (publish/unpublish/delete/upload).
  security: { checkOrigin: false },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
