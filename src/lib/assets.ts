// Image URL resolution.
// - In dev, the Astro proxy maps /uploads → :3001; /blog and /images are served
//   from public/. In single-origin prod, everything is same-origin.
// - PUBLIC_API_URL is normally empty (same-origin). Set it only if uploads are
//   served from a different origin.

const UPLOADS_BASE = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/$/, '');
const SITE = (import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321').replace(/\/$/, '');

/** Resolve a stored image path for use in <img src>. */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return '/og-image.png';
  if (/^(https?:|data:|blob:)/i.test(url)) return url; // already absolute
  if (url.startsWith('/uploads/')) return `${UPLOADS_BASE}${url}`; // '' → same-origin
  return url; // /blog/*, /images/* → same-origin public assets
}

/** Build an ABSOLUTE URL (for OG/canonical). Never double-prefixes. */
export function absoluteUrl(url: string | null | undefined): string {
  if (!url) return `${SITE}/og-image.png`;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${SITE}${path}`;
}
