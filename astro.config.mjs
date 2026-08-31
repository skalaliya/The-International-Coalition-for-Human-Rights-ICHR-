import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { resolveSiteUrl } from './src/lib/siteUrl.ts';

// Canonical absolute origin (no trailing slash) for canonical + OG URLs.
// Same resolver the runtime uses, so `Astro.site` and SITE_URL can never
// disagree. Matters most on Preview, where PUBLIC_SITE_URL is unset and this
// used to hardcode localhost into the sitemap of every preview deploy.
const SITE = resolveSiteUrl(process.env);

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
    // The two /media slugs published on 31 August 2026 spelled the name "abderrahim".
    // The subject confirmed it is "Abdelrahim", so the slugs were corrected the same day.
    // These keep the already-published URLs alive rather than 404ing anyone who saved or
    // shared one in the hours they were live. Cheap to keep; do not remove.
    '/media/abderrahim-grein-icc-accountability-geneva-2026': '/media/abdelrahim-grein-icc-accountability-geneva-2026',
    '/ar/media/abderrahim-grein-icc-accountability-geneva-2026': '/ar/media/abdelrahim-grein-icc-accountability-geneva-2026',
    '/fr/media/abderrahim-grein-icc-accountability-geneva-2026': '/fr/media/abdelrahim-grein-icc-accountability-geneva-2026',
    '/media/abderrahim-grein-human-rights-2025': '/media/abdelrahim-grein-human-rights-2025',
    '/ar/media/abderrahim-grein-human-rights-2025': '/ar/media/abdelrahim-grein-human-rights-2025',
    '/fr/media/abderrahim-grein-human-rights-2025': '/fr/media/abdelrahim-grein-human-rights-2025',
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
