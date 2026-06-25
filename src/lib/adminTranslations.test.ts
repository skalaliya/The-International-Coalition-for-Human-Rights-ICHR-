// Pure-function tests for the admin translation helpers. Run with:
//   node --experimental-strip-types src/lib/adminTranslations.test.ts
import assert from 'node:assert/strict';
import type { Post } from '@/types';
import { groupByStory, buildTranslationDraft } from './adminTranslations.ts';

function post(over: Partial<Post> = {}): Post {
  return {
    id: 'id_' + Math.random().toString(36).slice(2),
    slug: 's',
    locale: 'en',
    translationKey: undefined,
    title: 'T',
    category: 'News',
    status: 'published',
    date: '2026-06-01T00:00:00.000Z',
    location: 'Geneva',
    excerpt: 'e',
    coverImageUrl: '/blog/x/c.jpg',
    body: 'b',
    gallery: [],
    hashtags: [],
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    ...over,
  } as Post;
}

// 1) same translationKey → one story; title prefers EN; byLocale has both
{
  const en = post({ id: '1', locale: 'en', translationKey: 'k1', title: 'EN', updatedAt: '2026-06-02T00:00:00.000Z' });
  const ar = post({ id: '2', locale: 'ar', translationKey: 'k1', title: 'AR', updatedAt: '2026-06-01T00:00:00.000Z' });
  const stories = groupByStory([ar, en]);
  assert.equal(stories.length, 1);
  assert.equal(stories[0].key, 'k1');
  assert.equal(stories[0].title, 'EN');
  assert.ok(stories[0].byLocale.en && stories[0].byLocale.ar && !stories[0].byLocale.fr);
}

// 2) distinct keys → separate stories, newest first
{
  const a = post({ id: '1', translationKey: 'ka', title: 'A', updatedAt: '2026-06-01T00:00:00.000Z' });
  const b = post({ id: '2', translationKey: 'kb', title: 'B', updatedAt: '2026-06-05T00:00:00.000Z' });
  const stories = groupByStory([a, b]);
  assert.equal(stories.length, 2);
  assert.equal(stories[0].title, 'B');
}

// 3) null translationKey → keyed by id
{
  const stories = groupByStory([post({ id: 'X', translationKey: undefined })]);
  assert.equal(stories[0].key, 'X');
}

// 4) buildTranslationDraft carries link + shared fields, seeds text, drafts
{
  const src = post({
    id: '1', slug: 'my-slug', locale: 'en', translationKey: 'k1', title: 'Hello',
    category: 'Press Release', date: '2026-06-02T00:00:00.000Z', excerpt: 'ex', body: 'bd',
    coverImageUrl: '/blog/x/c.jpg', gallery: [{ url: '/blog/x/g1.jpg', caption: 'cap' }],
    hashtags: ['#a'], authorName: 'ICHR',
  });
  const d = buildTranslationDraft(src, 'fr');
  assert.equal(d.slug, 'my-slug');
  assert.equal(d.locale, 'fr');
  assert.equal(d.translationKey, 'k1');
  assert.equal(d.status, 'draft');
  assert.equal(d.date, '2026-06-02');
  assert.equal(d.coverImageUrl, '/blog/x/c.jpg');
  assert.equal(d.category, 'Press Release');
  assert.equal(d.gallery.length, 1);
  assert.equal(d.gallery[0].caption, 'cap');
  assert.deepEqual(d.hashtags, ['#a']);
}

console.log('OK: adminTranslations tests passed');
