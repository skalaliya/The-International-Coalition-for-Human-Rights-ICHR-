// SERVER-ONLY data access for Astro SSR pages. Queries Prisma directly (no HTTP)
// — must only be imported from .astro frontmatter / server code, never a client island.
import { listPublished, getPublishedBySlug, getTranslations } from '@/server/posts';
import type { Post, PaginatedPosts, PostCategory } from '@/types';

export async function getPublishedPosts(opts: {
  page?: number;
  pageSize?: number;
  category?: PostCategory | 'All';
  locale?: string;
} = {}): Promise<PaginatedPosts> {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 9;
  try {
    return await listPublished({
      page,
      pageSize,
      category: opts.category && opts.category !== 'All' ? opts.category : undefined,
      locale: opts.locale,
    });
  } catch (e) {
    console.error('[api] getPublishedPosts failed:', e);
    return { items: [], page, pageSize, total: 0, totalPages: 1 };
  }
}

export async function getPostBySlug(slug: string, locale: string = 'en'): Promise<Post | null> {
  try {
    return await getPublishedBySlug(slug, locale);
  } catch (e) {
    console.error('[api] getPostBySlug failed:', e);
    return null;
  }
}

/** Published translations of a story (for the article language toggle). */
export async function getPostTranslations(
  translationKey: string | null | undefined,
): Promise<{ locale: string; slug: string; title: string }[]> {
  try {
    return await getTranslations(translationKey);
  } catch (e) {
    console.error('[api] getPostTranslations failed:', e);
    return [];
  }
}
