// Pure helpers for the admin newsroom: group posts into translation "stories" and
// build a pre-filled draft when adding a translation. Kept dependency-free (type-only
// imports are erased at runtime) so they can be unit-tested with `node`.
import type { Post, PostInput } from '@/types';

export const ADMIN_LOCALES = ['en', 'ar', 'fr'] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];

export const LOCALE_LABEL: Record<AdminLocale, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
};

export interface Story {
  key: string; // translationKey (falls back to id)
  title: string; // representative title (prefers the English version)
  updatedAt: string; // newest version's updatedAt, for sorting
  byLocale: Partial<Record<string, Post>>;
}

/** Group admin posts into stories by translationKey (fallback to id), newest first. */
export function groupByStory(posts: Post[]): Story[] {
  const groups = new Map<string, Post[]>();
  for (const p of posts) {
    const key = p.translationKey || p.id;
    const arr = groups.get(key);
    if (arr) arr.push(p);
    else groups.set(key, [p]);
  }
  const stories: Story[] = [];
  for (const [key, group] of groups) {
    const byLocale: Partial<Record<string, Post>> = {};
    for (const p of group) byLocale[p.locale] = p;
    const rep = byLocale.en ?? group[0];
    const updatedAt = group.reduce((m, p) => (p.updatedAt > m ? p.updatedAt : m), group[0].updatedAt);
    stories.push({ key, title: rep.title, updatedAt, byLocale });
  }
  stories.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
  return stories;
}

/**
 * Build a draft for a NEW translation of `source` into `locale`: carries the link
 * (translationKey + slug) and shared non-text fields, and seeds the text from the
 * source so the editor translates in place. `editingId` must be cleared by the caller
 * so this is created, not overwritten.
 */
export function buildTranslationDraft(source: Post, locale: AdminLocale): PostInput {
  return {
    slug: source.slug,
    locale,
    translationKey: source.translationKey || undefined,
    title: source.title,
    category: source.category,
    status: 'draft',
    date: (source.date || '').slice(0, 10),
    location: source.location ?? '',
    excerpt: source.excerpt,
    coverImageUrl: source.coverImageUrl,
    body: source.body,
    gallery: (source.gallery ?? []).map((g) => ({ url: g.url, caption: g.caption })),
    hashtags: source.hashtags ?? [],
    authorName: source.authorName,
  };
}
