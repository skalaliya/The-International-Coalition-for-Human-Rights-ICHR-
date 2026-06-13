// SERVER-ONLY data access for Astro SSR pages. Queries Prisma directly (no HTTP)
// — must only be imported from .astro frontmatter / server code, never a client island.
import { listPublished, getPublishedBySlug } from '@/server/posts';
import type { Post, PaginatedPosts, PostCategory } from '@/types';

export async function getPublishedPosts(opts: {
  page?: number;
  pageSize?: number;
  category?: PostCategory | 'All';
} = {}): Promise<PaginatedPosts> {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 9;
  try {
    return await listPublished({
      page,
      pageSize,
      category: opts.category && opts.category !== 'All' ? opts.category : undefined,
    });
  } catch (e) {
    console.error('[api] getPublishedPosts failed:', e);
    return { items: [], page, pageSize, total: 0, totalPages: 1 };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await getPublishedBySlug(slug);
  } catch (e) {
    console.error('[api] getPostBySlug failed:', e);
    return null;
  }
}
