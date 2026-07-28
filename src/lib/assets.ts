import { resolveSiteUrl, systemEnv } from './siteUrl';
import blogImages from '@/generated/blog-images.json';

// Image URL resolution.
// - In dev, the Astro proxy maps /uploads → :3001; /blog and /images are served
//   from public/. In single-origin prod, everything is same-origin.
// - PUBLIC_API_URL is normally empty (same-origin). Set it only if uploads are
//   served from a different origin.

const UPLOADS_BASE = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/$/, '');
const SITE = resolveSiteUrl({ ...systemEnv(), PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL });

/** Resolve a stored image path for use in <img src>. Allow-list only — never
 *  pass through data:/blob:/javascript: (which could execute when rendered). */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return '/og-image.png';
  if (/^https?:\/\//i.test(url)) return url; // absolute http(s) (e.g. Vercel Blob)
  if (url.startsWith('/uploads/')) return `${UPLOADS_BASE}${url}`; // '' → same-origin
  if (/^\/(blog|images)\//.test(url)) return url; // same-origin public assets
  return '/og-image.png'; // reject anything unexpected
}

// ---- responsive images ----
// /blog/* is served raw: no Astro <Image>, no CDN transform. Without a srcset a phone
// downloads the desktop original — measured on production, a 1200px cover painted into a
// 325px box, and ~3.2MB of gallery on one article. scripts/gen-image-variants.mjs writes
// the width variants and the manifest below; these helpers just read it, so they can
// never point at a variant that wasn't generated.

export interface BlogImageInfo {
  /** Intrinsic size of the original, for width/height attributes. */
  w: number | null;
  h: number | null;
  /** Widths actually written to disk. Empty when the original was already small. */
  widths: number[];
}

const VARIANTS = blogImages as Record<string, BlogImageInfo>;

function variantUrl(url: string, width: number): string {
  return url.replace(/\.(jpe?g|png)$/i, () => `-${width}.jpg`);
}

/**
 * A srcset for a /blog image, or undefined when we have no variants for it —
 * an uploaded Blob URL, an image added before the pipeline existed, or one the
 * generator could not read. Undefined means "just use src", which always works.
 */
export function srcSetFor(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const info = VARIANTS[url];
  if (!info?.widths?.length) return undefined;
  const candidates = info.widths.map((w) => `${variantUrl(url, w)} ${w}w`);
  // Include the original as the largest candidate so retina desktop still gets full detail.
  if (info.w) candidates.push(`${url} ${info.w}w`);
  return candidates.join(', ');
}

/** Intrinsic dimensions, so <img> reserves the right box and can never shift layout. */
export function dimensionsFor(url: string | null | undefined): { width: number; height: number } | undefined {
  if (!url) return undefined;
  const info = VARIANTS[url];
  return info?.w && info?.h ? { width: info.w, height: info.h } : undefined;
}

/** Build an ABSOLUTE URL (for OG/canonical). Never double-prefixes. */
export function absoluteUrl(url: string | null | undefined): string {
  if (!url) return `${SITE}/og-image.png`;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${SITE}${path}`;
}
