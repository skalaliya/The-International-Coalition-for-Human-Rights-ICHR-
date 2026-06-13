// SERVER-ONLY data access for Astro SSR pages.
// Reads API_INTERNAL_URL (a NON-public env var), so this module must never be
// imported by a client island — only from .astro frontmatter / SSR endpoints.
import type { Post, PaginatedPosts, PostCategory } from '@/types';

// Read at RUNTIME (Node SSR). In single-origin prod, server.mjs sets this to its
// own origin so SSR fetches hit the same server; in dev it points at the API (:3001).
const BASE =
  (typeof process !== 'undefined' && process.env.API_INTERNAL_URL) ||
  import.meta.env.API_INTERNAL_URL ||
  'http://localhost:3001';

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) return null; // 404/500 → null; caller decides (never throws a 500 page)
    return (await res.json()) as T;
  } catch (err) {
    console.error('[api] fetch failed:', url, err);
    return null; // network/API down → graceful fallback
  }
}

export async function getPublishedPosts(opts: {
  page?: number;
  pageSize?: number;
  category?: PostCategory | 'All';
} = {}): Promise<PaginatedPosts> {
  const params = new URLSearchParams();
  params.set('page', String(opts.page ?? 1));
  params.set('pageSize', String(opts.pageSize ?? 9));
  if (opts.category && opts.category !== 'All') params.set('category', opts.category);

  const data = await safeJson<PaginatedPosts | Post[]>(`${BASE}/api/content/posts?${params}`);
  if (!data) {
    return { items: [], page: opts.page ?? 1, pageSize: opts.pageSize ?? 9, total: 0, totalPages: 1 };
  }
  if (Array.isArray(data)) {
    return { items: data, page: 1, pageSize: data.length, total: data.length, totalPages: 1 };
  }
  return data;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return safeJson<Post>(`${BASE}/api/content/posts/${encodeURIComponent(slug)}`);
}
