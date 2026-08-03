import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { attachmentFor, megabytes, showsLanguageNote, type AttachmentManifest } from './attachments.ts';

const ROOT = process.cwd();
const MANIFEST: AttachmentManifest = JSON.parse(
  readFileSync(join(ROOT, 'src/generated/blog-attachments.json'), 'utf8'),
);

// The failure this guards against: the manifest ships, the file does not, and the
// download 404s on a live press statement — the same guarantee responsiveImages.test.ts
// gives the srcset variants.
test('every attachment in the manifest exists on disk', () => {
  for (const url of Object.keys(MANIFEST)) {
    assert.ok(existsSync(join(ROOT, 'public', url)), `missing on disk: ${url}`);
  }
});

test('the recorded byte count matches the file — a stale manifest would misstate the size', () => {
  for (const [url, meta] of Object.entries(MANIFEST)) {
    assert.equal(statSync(join(ROOT, 'public', url)).size, meta.bytes, url);
  }
});

test('every attachment is a pdf under /blog/<slug>/', () => {
  for (const url of Object.keys(MANIFEST)) {
    assert.match(url, /^\/blog\/[a-z0-9-]+\/[A-Za-z0-9._-]+\.pdf$/, url);
  }
});

test('a declared language is one of the three the site renders', () => {
  for (const [url, meta] of Object.entries(MANIFEST)) {
    if (meta.lang !== undefined) assert.match(meta.lang, /^(en|ar|fr)$/, url);
  }
});

test('attachmentFor finds the Shirshar statement and reports it as English', () => {
  const a = attachmentFor(MANIFEST, 'condemnation-shirshar-north-kordofan-july-2026');
  assert.ok(a, 'expected an attachment');
  assert.match(a.url, /statement\.en\.pdf$/);
  assert.equal(a.lang, 'en');
  assert.ok(a.bytes > 0);
});

test('a slug with no document returns undefined rather than throwing', () => {
  assert.equal(attachmentFor(MANIFEST, 'no-such-article-2026'), undefined);
  assert.equal(attachmentFor(MANIFEST, ''), undefined);
  assert.equal(attachmentFor(MANIFEST, null), undefined);
  assert.equal(attachmentFor(MANIFEST, undefined), undefined);
});

test('a slug is matched whole — a prefix must not borrow another article file', () => {
  const m: AttachmentManifest = { '/blog/sudan-statement-2026/a.pdf': { bytes: 1 } };
  assert.equal(attachmentFor(m, 'sudan'), undefined);
  assert.ok(attachmentFor(m, 'sudan-statement-2026'));
});

test('sizes read the way a person would write them', () => {
  assert.equal(megabytes(1223980), '1.2');
  assert.equal(megabytes(5768269), '5.5');
  assert.equal(megabytes(1223980, 'fr'), '1,2');
  assert.equal(megabytes(1223980, 'ar'), '1.2');
  // Past 10 MB the decimal is noise.
  assert.equal(megabytes(42 * 1024 * 1024), '42');
});

test('the language note appears only where it tells the reader something', () => {
  assert.equal(showsLanguageNote('en', 'ar'), true);
  assert.equal(showsLanguageNote('en', 'fr'), true);
  assert.equal(showsLanguageNote('en', 'en'), false);
  // A trilingual document declares no language, so it never carries a note.
  assert.equal(showsLanguageNote(undefined, 'ar'), false);
});

// These four strings were once added to the `a11y` block instead of `article`, because
// both contain a `tags:` key. Everything still ran; only `astro check` caught it, and
// only after a full build. The download card silently had no labels. Assert the keys
// are where the component reads them, in every locale.
test('every locale exposes the download-card strings on article, not somewhere adjacent', async () => {
  const { en } = await import('../i18n/strings/en.ts');
  const { ar } = await import('../i18n/strings/ar.ts');
  const { fr } = await import('../i18n/strings/fr.ts');
  const KEYS = ['documentTitle', 'documentDownload', 'documentMegabytes', 'documentInLanguage'] as const;

  for (const [name, dict] of [
    ['en', en],
    ['ar', ar],
    ['fr', fr],
  ] as const) {
    for (const k of KEYS) {
      assert.ok(k in dict.article, `${name}: article.${k} missing`);
      assert.ok(
        !(k in (dict.a11y as Record<string, unknown>)),
        `${name}: ${k} leaked into a11y — wrong block`,
      );
    }
    for (const s of [dict.article.documentTitle, dict.article.documentDownload, dict.article.documentMegabytes]) {
      assert.equal(typeof s, 'string');
      assert.ok(s.length > 0, `${name}: empty label`);
    }
    // The note is looked up by the document's language, so all three must resolve.
    for (const l of ['en', 'ar', 'fr'] as const) {
      assert.equal(typeof dict.article.documentInLanguage[l], 'string', `${name}: documentInLanguage.${l}`);
    }
  }
});

test('the three locales are actually translated, not copy-pasted English', async () => {
  const { en } = await import('../i18n/strings/en.ts');
  const { ar } = await import('../i18n/strings/ar.ts');
  const { fr } = await import('../i18n/strings/fr.ts');
  assert.notEqual(ar.article.documentDownload, en.article.documentDownload);
  assert.notEqual(fr.article.documentDownload, en.article.documentDownload);
  assert.notEqual(ar.article.documentMegabytes, en.article.documentMegabytes);
  assert.notEqual(fr.article.documentMegabytes, en.article.documentMegabytes);
});
