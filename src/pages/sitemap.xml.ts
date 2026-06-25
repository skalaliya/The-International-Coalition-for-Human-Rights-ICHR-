import type { APIRoute } from 'astro';
import { prisma } from '@/server/db';
import { LOCALES, localizedPath, type Locale } from '@/i18n';

// SSR sitemap: covers the prerendered marketing pages (×3 locales) AND the
// SSR-only published news articles (which @astrojs/sitemap can't enumerate),
// each with hreflang alternates limited to the locales that actually exist.
export const prerender = false;

const STATIC_PATHS = ['/', '/about', '/locations', '/news', '/contact', '/donate', '/volunteer'];

function xmlEscape(s: string): string {
  return s.replace(
    /[&<>'"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' })[c] as string,
  );
}

interface Entry {
  path: string;
  lastmod?: string;
  alternates: { lang: Locale; path: string }[];
}

export const GET: APIRoute = async ({ site, url }) => {
  const origin = (site ?? new URL(url.origin)).origin;
  const abs = (path: string) => xmlEscape(origin + path);
  const entries: Entry[] = [];

  // Marketing pages — exist in all three locales.
  for (const path of STATIC_PATHS) {
    for (const lang of LOCALES) {
      entries.push({
        path: localizedPath(path, lang),
        alternates: LOCALES.map((l) => ({ lang: l, path: localizedPath(path, l) })),
      });
    }
  }

  // Published articles — alternates limited to the locales each story has.
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'published' },
      select: { slug: true, locale: true, translationKey: true, updatedAt: true },
    });
    const groups = new Map<string, typeof posts>();
    for (const p of posts) {
      const key = p.translationKey ?? `${p.slug}:${p.locale}`;
      const arr = groups.get(key);
      if (arr) arr.push(p);
      else groups.set(key, [p]);
    }
    for (const p of posts) {
      if (!LOCALES.includes(p.locale as Locale)) continue;
      const key = p.translationKey ?? `${p.slug}:${p.locale}`;
      const group = groups.get(key) ?? [p];
      entries.push({
        path: localizedPath(`/news/${p.slug}`, p.locale as Locale),
        lastmod: p.updatedAt.toISOString(),
        alternates: group
          .filter((g) => LOCALES.includes(g.locale as Locale))
          .map((g) => ({ lang: g.locale as Locale, path: localizedPath(`/news/${g.slug}`, g.locale as Locale) })),
      });
    }
  } catch (e) {
    console.error('[sitemap] post query failed:', e);
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries
      .map((e) => {
        const links = e.alternates
          .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${abs(a.path)}" />`)
          .join('\n');
        return `  <url>\n    <loc>${abs(e.path)}</loc>${
          e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''
        }\n${links}\n  </url>`;
      })
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
