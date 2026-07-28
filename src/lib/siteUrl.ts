// Where "this site" lives, as an absolute origin with no trailing slash.
//
// Every canonical link, og:url, JSON-LD @id and sitemap <loc> is built from this.
// It used to be `PUBLIC_SITE_URL ?? 'http://localhost:4321'`, and PUBLIC_SITE_URL
// is only set for the Production and Development environments — nothing sets it
// for Preview. So every preview deploy published a sitemap of
// `http://localhost:4321/...` URLs and canonical tags pointing at a machine
// nobody can reach, which is exactly what makes a preview useless for checking
// the things a preview exists to check.
//
// Falling back to Vercel's system variables fixes this for every branch at once,
// with no per-branch configuration to keep in sync. VERCEL_BRANCH_URL is
// preferred over VERCEL_URL because it is stable across redeploys of the same
// branch; VERCEL_URL changes every push. (Project Settings → Environment
// Variables → "Enable access to System Environment Variables" must stay on.)

export interface SiteUrlEnv {
  PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_URL?: string;
}

export const LOCAL_SITE_URL = 'http://localhost:4321';

function normalize(value: string): string {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, '');
}

/** Resolve the canonical absolute origin. Pure — pass the env in. */
export function resolveSiteUrl(env: SiteUrlEnv = {}): string {
  const explicit = env.PUBLIC_SITE_URL?.trim();
  if (explicit) return normalize(explicit);

  // On a production deploy without PUBLIC_SITE_URL, the project's production
  // domain beats the per-deployment URL — the latter is the immutable
  // dpl-hash hostname, which we never want in a canonical tag.
  if (env.VERCEL_ENV === 'production') {
    const prod = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (prod) return normalize(prod);
  }

  const preview = env.VERCEL_BRANCH_URL?.trim() || env.VERCEL_URL?.trim();
  if (preview) return normalize(preview);

  return LOCAL_SITE_URL;
}

/** The Vercel system variables, read from `process.env` when it exists.
 *  Guarded because this module is also pulled into client bundles, where
 *  `process` is undefined and touching it throws at import time. */
export function systemEnv(): SiteUrlEnv {
  if (typeof process === 'undefined' || !process.env) return {};
  const { VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_BRANCH_URL, VERCEL_URL } = process.env;
  return { VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_BRANCH_URL, VERCEL_URL };
}
