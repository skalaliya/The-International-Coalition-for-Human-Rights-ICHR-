// Loads everything an article page needs, in one call, for the ROUTE to decide on.
//
// This exists because the 404 decision has to happen in a page, not a component.
// `Astro.rewrite()` / `Astro.response.status` from inside a component is a trap: the
// component keeps rendering into an already-sent response, which Astro reports as
// ResponseSentError and the Vercel adapter serves as the string "Internal server
// error" with HTTP 200 — a soft-200 that crawlers index. That was a live bug.
//
// So: routes call loadArticle(), branch on null, and pass the result down as a prop.
// src/components/pages/ArticlePage.astro must stay free of awaits and early returns.
import { getPostBySlug, getPostTranslations } from '@/lib/api';
import type { Post } from '@/types';

export interface ArticleData {
  post: Post;
  /** Published translations of this story — drives the language toggle and hreflang. */
  translations: { locale: string; slug: string; title: string }[];
}

/**
 * Returns null when the article is missing, a draft, or the database is unreachable.
 * Both callers-visible cases are a 404: a reader cannot tell them apart, and neither
 * should leak a 500. (getPostBySlug already filters to status='published' and swallows
 * DB errors into null — see src/lib/api.ts.)
 */
export async function loadArticle(slug: string | undefined, locale: string): Promise<ArticleData | null> {
  if (!slug) return null;

  const post = await getPostBySlug(slug, locale);
  if (!post || post.status !== 'published') return null;

  const translations = await getPostTranslations(post.translationKey);
  return { post, translations };
}
