// The registry validator. This is what makes adding the NEXT video safe.
//
// Every failure below is one that produces no error at runtime — a dead embed, a poster
// that silently resolves to /og-image.png, a rich result Google quietly drops, a card
// with a blank Arabic title. The build is the only place they can be caught, so they are
// caught here rather than by someone noticing on production.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ALL_VIDEOS, PLAYLISTS, getVideo, getVideos, copyFor } from '../data/videos.ts';
import { toIso8601 } from './duration.ts';
import { en } from '../i18n/strings/en.ts';
import { ar } from '../i18n/strings/ar.ts';
import { fr } from '../i18n/strings/fr.ts';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(
  readFileSync(join(REPO, 'src', 'generated', 'blog-images.json'), 'utf8'),
) as Record<string, { w: number | null; h: number | null; widths: number[] }>;

const LOCALES = ['en', 'ar', 'fr'] as const;

test('there are videos, and every slug is unique', () => {
  assert.ok(ALL_VIDEOS.length > 0, 'the registry is empty');
  const slugs = ALL_VIDEOS.map((v) => v.slug);
  assert.equal(new Set(slugs).size, slugs.length, `duplicate slug: ${slugs.join(', ')}`);
});

test('every YouTube ID is exactly the 11-character form', () => {
  // A mistyped ID is a dead player and a dead thumbnail, with no error anywhere.
  for (const v of ALL_VIDEOS) {
    assert.match(v.youtubeId, /^[A-Za-z0-9_-]{11}$/, `${v.slug} → ${v.youtubeId}`);
  }
  const ids = ALL_VIDEOS.map((v) => v.youtubeId);
  assert.equal(new Set(ids).size, ids.length, 'the same video is listed twice');
});

test('every slug is a safe, lowercase-kebab URL segment', () => {
  for (const v of ALL_VIDEOS) {
    assert.match(v.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${v.slug} is not kebab-case`);
    assert.ok(v.slug.length <= 80, `${v.slug} is too long for a clean URL`);
  }
});

test('dates parse, are ordered sanely, and are not in the future', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const v of ALL_VIDEOS) {
    for (const [field, value] of [
      ['uploadDate', v.uploadDate],
      ['eventDate', v.eventDate],
    ] as const) {
      assert.match(value, /^\d{4}-\d{2}-\d{2}$/, `${v.slug}.${field} is not YYYY-MM-DD`);
      assert.ok(!Number.isNaN(Date.parse(value)), `${v.slug}.${field} does not parse`);
      assert.ok(value <= today, `${v.slug}.${field} is in the future`);
    }
    // Footage cannot be uploaded before it was recorded. Catches the two being swapped.
    assert.ok(v.eventDate <= v.uploadDate, `${v.slug}: eventDate is after uploadDate`);
  }
});

test('durations are positive integers that survive ISO-8601 conversion', () => {
  for (const v of ALL_VIDEOS) {
    assert.ok(Number.isInteger(v.durationSeconds), `${v.slug} duration is not an integer`);
    assert.ok(v.durationSeconds > 0, `${v.slug} duration is not positive`);
    // Schema.org rejects "PT" and "PT0S" is meaningless for a real video.
    const iso = toIso8601(v.durationSeconds);
    assert.match(iso, /^PT(\d+H)?(\d+M)?(\d+S)?$/, `${v.slug} → ${iso}`);
    assert.notEqual(iso, 'PT0S', `${v.slug} has a zero-length duration`);
  }
});

test('every poster lives under its own slug AND has responsive variants', () => {
  // THE most likely future mistake: adding a video without running the generator. The
  // poster then ships full-size to phones, which is the exact cost this site works to
  // avoid. scripts/add-video.mjs runs the generator for you; this catches it if not.
  for (const v of ALL_VIDEOS) {
    assert.equal(
      v.poster,
      `/media/${v.slug}/poster.jpg`,
      `${v.slug}: poster path must match the slug, so one video's assets are never another's`,
    );
    const info = manifest[v.poster];
    assert.ok(info, `${v.poster} is not in blog-images.json — run: node scripts/gen-image-variants.mjs`);
    assert.ok(info.widths.length > 0, `${v.poster} has no width variants`);
    assert.ok(info.w && info.h, `${v.poster} has no intrinsic dimensions`);
  }
});

test('every locale has complete, non-placeholder copy', () => {
  // The i18n dictionaries are type-enforced; this object is not, so it is checked here.
  for (const v of ALL_VIDEOS) {
    for (const lang of LOCALES) {
      const copy = v.i18n[lang];
      assert.ok(copy, `${v.slug} has no ${lang} copy`);
      for (const field of ['title', 'speaker', 'summary'] as const) {
        const value = copy[field];
        assert.equal(typeof value, 'string', `${v.slug}.${lang}.${field} is not a string`);
        assert.ok(value.trim().length > 0, `${v.slug}.${lang}.${field} is empty`);
        assert.ok(
          !/\bTODO\b|\bTBD\b|^\s*…\s*$/i.test(value),
          `${v.slug}.${lang}.${field} still holds a placeholder: ${value}`,
        );
      }
      assert.ok(copy.summary.length >= 40, `${v.slug}.${lang}.summary is too short to be a meta description`);
    }
  }
});

test('no locale is silently showing another locale’s text', () => {
  // Pasting the English into ar/fr and forgetting to translate would pass every check
  // above. Arabic must contain Arabic script; French must differ from English.
  for (const v of ALL_VIDEOS) {
    assert.match(v.i18n.ar.title, /[؀-ۿ]/, `${v.slug}: the Arabic title has no Arabic script`);
    assert.match(v.i18n.ar.summary, /[؀-ۿ]/, `${v.slug}: the Arabic summary has no Arabic script`);
    assert.notEqual(v.i18n.fr.title, v.i18n.en.title, `${v.slug}: the French title is still the English one`);
    assert.notEqual(v.i18n.fr.summary, v.i18n.en.summary, `${v.slug}: the French summary is still the English one`);
  }
});

test('every playlist id is declared and labelled in all three dictionaries', () => {
  for (const v of ALL_VIDEOS) {
    assert.ok(PLAYLISTS.includes(v.playlist), `${v.slug}: unknown playlist "${v.playlist}"`);
  }
  for (const id of PLAYLISTS) {
    for (const [lang, dict] of [
      ['en', en],
      ['ar', ar],
      ['fr', fr],
    ] as const) {
      const label = (dict.media.playlists as Record<string, string>)[id];
      assert.ok(label?.trim(), `${lang}.ts has no media.playlists["${id}"] — the filter pill would be blank`);
    }
  }
});

test('a relatedPostSlug, when set, looks like a real article slug', () => {
  // It cannot be checked against the database from a unit test — the live verification
  // step follows the link in each locale. This catches the typo class only.
  for (const v of ALL_VIDEOS) {
    if (v.relatedPostSlug === undefined) continue;
    assert.match(v.relatedPostSlug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${v.slug}: bad relatedPostSlug`);
  }
});

test('getVideo finds by slug and refuses everything else', () => {
  const first = ALL_VIDEOS[0]!;
  assert.equal(getVideo(first.slug)?.slug, first.slug);
  assert.equal(getVideo('does-not-exist'), undefined);
  assert.equal(getVideo(''), undefined);
  assert.equal(getVideo(undefined), undefined, 'a missing route param must not throw');
});

test('getVideos sorts newest-first and filters by playlist', () => {
  const all = getVideos('en');
  assert.equal(all.length, ALL_VIDEOS.length);
  for (let i = 1; i < all.length; i++) {
    assert.ok(all[i - 1]!.eventDate >= all[i]!.eventDate, 'not sorted newest-first');
  }
  assert.deepEqual(getVideos('en', 'All').length, all.length, '"All" is not a filter');
  const one = PLAYLISTS[0];
  assert.ok(getVideos('en', one).every((v) => v.playlist === one));
  // Must not mutate the module-level array — a second call has to be identical.
  assert.deepEqual(
    getVideos('en').map((v) => v.slug),
    all.map((v) => v.slug),
  );
});

test('copyFor is total across every locale', () => {
  for (const v of ALL_VIDEOS) {
    for (const lang of LOCALES) {
      assert.ok(copyFor(v, lang).title.length > 0, `${v.slug}/${lang}`);
    }
  }
});
