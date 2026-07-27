// Tests for the press-statement engine.
//
// Two kinds of coverage:
//   1. validateStatement — the only validation a seeded row ever gets, since seeds
//      write raw SQL and never reach createPostSchema.
//   2. publishStatement's SQL shape, exercised against a fake `sql` client so the
//      tests never touch the network.
// Plus a drift test asserting LIMITS still matches src/server/posts.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { LIMITS, validateStatement, assertStatement, maskedHost, publishStatement } from './press-statement.mjs';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const valid = () => ({
  slug: 'a-valid-slug-2026',
  translationKey: '11111111-2222-3333-4444-555555555555',
  category: 'Statement',
  date: '2026-07-23',
  hashtags: ['#tag'],
  locales: [
    {
      locale: 'en',
      title: 'A title',
      excerpt: 'An excerpt.',
      body: 'A paragraph.\n\n- one\n- two\n\n---\n\n**Sign-off**\n\nParis, 23 July 2026',
      location: 'Paris',
      authorName: 'ICHR Communications',
      coverImageUrl: '/blog/a-valid-slug-2026/cover.jpg',
      gallery: [{ url: '/blog/a-valid-slug-2026/card-1.jpg', caption: 'A caption.', order: 0 }],
    },
    { locale: 'ar', title: 'عنوان', excerpt: 'مقتطف.', body: 'فقرة.', coverImageUrl: '/blog/a-valid-slug-2026/cover-ar.jpg' },
  ],
});

test('a well-formed config has no problems', () => {
  assert.deepEqual(validateStatement(valid()), []);
});

test('rejects a locale outside en|ar|fr', () => {
  const c = valid();
  c.locales[0].locale = 'EN'; // publishes a row invisible on every page AND in the sitemap
  assert.match(validateStatement(c).join('\n'), /locale must be one of/);
});

test('rejects a duplicate locale', () => {
  const c = valid();
  c.locales[1].locale = 'en';
  assert.match(validateStatement(c).join('\n'), /duplicate locale/);
});

test('rejects a category outside the four canonical values', () => {
  const c = valid();
  c.category = 'Statements';
  assert.match(validateStatement(c).join('\n'), /is not one of/);
});

test('rejects a Date object for date — it must be a YYYY-MM-DD string', () => {
  const c = valid();
  c.date = new Date('2026-07-23');
  assert.match(validateStatement(c).join('\n'), /must be a "YYYY-MM-DD" string/);
});

test('rejects a slug with uppercase or spaces', () => {
  for (const bad of ['Has-Upper', 'has spaces', 'has_underscore']) {
    const c = valid();
    c.slug = bad;
    assert.match(validateStatement(c).join('\n'), /must match/, bad);
  }
});

test('rejects asset urls the renderer would silently replace', () => {
  const c = valid();
  c.locales[0].coverImageUrl = 'blog/no-leading-slash.jpg';
  assert.match(validateStatement(c).join('\n'), /coverImageUrl .* fails/);

  const d = valid();
  d.locales[0].gallery[0].url = 'https:/typo.example/x.jpg';
  assert.match(validateStatement(d).join('\n'), /gallery\[0\]\.url/);
});

test('enforces the length limits', () => {
  const c = valid();
  c.locales[0].title = 'x'.repeat(LIMITS.title + 1);
  c.locales[0].excerpt = 'x'.repeat(LIMITS.excerpt + 1);
  c.locales[0].gallery[0].caption = 'x'.repeat(LIMITS.caption + 1);
  const out = validateStatement(c).join('\n');
  assert.match(out, /title is 301/);
  assert.match(out, /excerpt is 1001/);
  assert.match(out, /caption is 501/);
});

test('requires a non-empty excerpt and body', () => {
  const c = valid();
  c.locales[0].excerpt = '   ';
  c.locales[0].body = '';
  const out = validateStatement(c).join('\n');
  assert.match(out, /excerpt is required/);
  assert.match(out, /body is required/);
});

// ---- markdown rules, the ones that render wrong rather than erroring ----

test('catches --- with no blank line before it (renders the line above as an <h2>)', () => {
  const c = valid();
  c.locales[0].body = 'Closing line.\n---\n\n**Sign-off**';
  assert.match(validateStatement(c).join('\n'), /no blank line before it/);
});

test('catches a blank line between bullets (loose list)', () => {
  const c = valid();
  c.locales[0].body = 'Lead:\n\n- one\n\n- two';
  assert.match(validateStatement(c).join('\n'), /loose list/);
});

test('catches a hyphen with no space, which is not a bullet', () => {
  const c = valid();
  c.locales[0].body = 'Lead:\n\n-Al-Taj Al-Sayyid (head of family).';
  assert.match(validateStatement(c).join('\n'), /NOT a bullet/);
});

test('assertStatement throws listing every problem at once', () => {
  const c = valid();
  c.category = 'Nope';
  c.slug = 'BAD';
  assert.throws(() => assertStatement(c), (err) => /category/.test(err.message) && /slug/.test(err.message));
});

test('maskedHost hides credentials and survives junk', () => {
  assert.equal(maskedHost('postgresql://user:pw@ep-x.neon.tech/neondb'), 'postgresql://***@ep-x.neon.tech/neondb');
  assert.equal(maskedHost('not a url'), '(unparseable DATABASE_URL)');
});

// ---- engine behaviour against a fake client ----

function fakeSql({ existingKeys = [] } = {}) {
  const calls = [];
  const sql = {
    query(text, params) {
      calls.push({ text, params });
      const q = Promise.resolve(
        /DISTINCT "translationKey"/.test(text)
          ? existingKeys.map((k) => ({ k }))
          : /FROM "Post" WHERE slug = \$1 ORDER BY locale/.test(text)
            ? sql.__rows
            : /LEFT JOIN "GalleryImage"/.test(text)
              ? sql.__counts
              : [],
      );
      q.__text = text;
      return q;
    },
    async transaction(batch) {
      sql.__batch = batch;
      return Promise.all(batch);
    },
    __rows: [],
    __counts: [],
    calls,
  };
  return sql;
}

test('dry run validates and writes nothing', async () => {
  const sql = fakeSql();
  const res = await publishStatement(valid(), { dryRun: true, sql });
  assert.equal(res.action, 'dry-run');
  assert.equal(sql.calls.length, 0);
});

test('aborts when the slug already carries a different translationKey', async () => {
  const sql = fakeSql({ existingKeys: ['some-other-key'] });
  await assert.rejects(() => publishStatement(valid(), { sql }), /already carries translationKey/);
});

test('writes every row and gallery image in ONE transaction', async () => {
  const c = valid();
  const sql = fakeSql({ existingKeys: [c.translationKey] });
  sql.__rows = c.locales.map((v) => ({
    locale: v.locale,
    status: 'draft',
    title: v.title,
    tkey: c.translationKey,
    cover: v.coverImageUrl,
    body_len: v.body.length,
  }));
  sql.__counts = [{ locale: 'en', c: 1 }, { locale: 'ar', c: 0 }];

  const res = await publishStatement(c, { sql });
  assert.equal(res.action, 'write');

  const texts = sql.__batch.map((p) => p.__text);
  // 2 upserts + 2 gallery deletes (one per locale, even the one with no images) + 1 insert
  assert.equal(texts.length, 5);
  assert.equal(texts.filter((t) => /INSERT INTO "Post"/.test(t)).length, 2);
  assert.equal(texts.filter((t) => /DELETE FROM "GalleryImage"/.test(t)).length, 2);
  assert.equal(texts.filter((t) => /INSERT INTO "GalleryImage"/.test(t)).length, 1);
});

test('the upsert writes drafts and never clobbers a stored status', async () => {
  const c = valid();
  const sql = fakeSql({ existingKeys: [] });
  sql.__rows = c.locales.map((v) => ({
    locale: v.locale, status: 'draft', title: v.title, tkey: c.translationKey,
    cover: v.coverImageUrl, body_len: v.body.length,
  }));
  sql.__counts = [{ locale: 'en', c: 1 }, { locale: 'ar', c: 0 }];
  await publishStatement(c, { sql });

  const upsert = sql.__batch.map((p) => p.__text).find((t) => /INSERT INTO "Post"/.test(t));
  assert.match(upsert, /VALUES \([^)]*'draft'/, 'inserts as draft');
  assert.match(upsert, /status = "Post"\.status/, 'ON CONFLICT preserves the stored status');
  assert.doesNotMatch(upsert, /status = EXCLUDED\.status/);
});

test('hashtags reach the driver as a JSON string, not an array', async () => {
  const c = valid();
  const sql = fakeSql({ existingKeys: [] });
  sql.__rows = c.locales.map((v) => ({
    locale: v.locale, status: 'draft', title: v.title, tkey: c.translationKey,
    cover: v.coverImageUrl, body_len: v.body.length,
  }));
  sql.__counts = [{ locale: 'en', c: 1 }, { locale: 'ar', c: 0 }];
  await publishStatement(c, { sql });

  const post = sql.calls.find((call) => /INSERT INTO "Post"/.test(call.text));
  assert.equal(post.params[11], '["#tag"]');
});

test('unpublish drafts the whole story, not one locale', async () => {
  const c = valid();
  const sql = fakeSql({ existingKeys: [c.translationKey] });
  sql.__rows = [{ locale: 'ar', status: 'draft' }, { locale: 'en', status: 'draft' }];
  await publishStatement(c, { unpublish: true, sql });

  const update = sql.calls.find((call) => /UPDATE "Post" SET status='draft'/.test(call.text));
  assert.match(update.text, /WHERE slug = \$1\s*$/, 'no locale filter — all rows of the story');
});

test('read-back failure aborts loudly', async () => {
  const c = valid();
  const sql = fakeSql({ existingKeys: [] });
  sql.__rows = [
    { locale: 'en', status: 'draft', title: c.locales[0].title, tkey: c.translationKey, cover: c.locales[0].coverImageUrl, body_len: c.locales[0].body.length },
  ]; // the Arabic row never landed
  sql.__counts = [{ locale: 'en', c: 1 }];
  await assert.rejects(() => publishStatement(c, { sql }), /read-back verification failed/);
});

// ---- drift guard ----

test('LIMITS still matches the zod schema in src/server/posts.ts', () => {
  const src = readFileSync(join(REPO, 'src', 'server', 'posts.ts'), 'utf8');
  const expectations = [
    [LIMITS.title, 'title', /title: z\.string\(\)\.trim\(\)\.min\(1[^)]*\)\.max\((\d+)\)/],
    [LIMITS.excerpt, 'excerpt', /excerpt: z\.string\(\)\.trim\(\)\.min\(1[^)]*\)\.max\((\d+)\)/],
    [LIMITS.location, 'location', /location: z\.string\(\)\.max\((\d+)\)/],
    [LIMITS.authorName, 'authorName', /authorName: z\.string\(\)\.max\((\d+)\)/],
    [LIMITS.caption, 'caption', /caption: z\.string\(\)\.max\((\d+)\)/],
    [LIMITS.slug, 'slug', /slug: z\.string\(\)\.trim\(\)\.max\((\d+)\)/],
    [LIMITS.translationKey, 'translationKey', /translationKey: z\.string\(\)\.trim\(\)\.max\((\d+)\)/],
  ];
  for (const [mine, name, re] of expectations) {
    const m = src.match(re);
    assert.ok(m, `could not find the ${name} rule in posts.ts — the schema moved, update this test and LIMITS`);
    assert.equal(Number(m[1]), mine, `${name} limit drifted: posts.ts says ${m[1]}, LIMITS says ${mine}`);
  }

  const cats = src.match(/export const CATEGORIES = \[([^\]]+)\]/);
  assert.ok(cats, 'CATEGORIES moved in posts.ts');
  assert.deepEqual(cats[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean), LIMITS.categories);

  const locs = src.match(/export const LOCALES = \[([^\]]+)\]/);
  assert.ok(locs, 'LOCALES moved in posts.ts');
  assert.deepEqual(locs[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean), LIMITS.locales);

  assert.match(src, /ASSET_URL_RE = \/\^\(https\?:\\\/\\\/\|\\\/\(uploads\|blog\|images\)\\\/\)\//, 'ASSET_URL_RE changed — mirror it in press-statement.mjs');
});
