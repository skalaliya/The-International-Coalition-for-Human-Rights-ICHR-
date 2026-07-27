// The publishing engine behind every press statement from #3 onward.
//
// WHY THIS EXISTS: the first two statements were hand-written seeds, and ~250 lines
// of identical boilerplate (Neon guard, upsert SQL, read-back, gallery rebuild) were
// copy-pasted between them. This module owns the mechanism; each statement file owns
// only its content. CLAUDE.md's "the seed is the git source-of-record" principle is
// about the TEXT — every title, body, excerpt and caption still lives verbatim and
// inline in one file per statement, so `git show` still reads as the statement.
//
// The two already-published seeds (procedural-bias, cargo-trucks) deliberately do NOT
// use this. They are the record of what was executed against production; rewriting
// them buys nothing and risks silently changing that record.
//
// Writes go over Neon's HTTPS serverless driver (port 443) because this network drops
// the Postgres :5432 handshake — see CLAUDE.md "Gotcha 1".
//
// THREE BEHAVIOURS THAT DIFFER FROM THE OLD HAND-WRITTEN SEEDS, on purpose:
//
//   1. ATOMIC. Every row and gallery image goes in ONE sql.transaction(). The old
//      seeds issued a separate HTTP request per locale with no transaction, so a
//      network blip mid-loop could leave a live story with two of its three languages
//      and a toggle pointing at a 404.
//   2. DRAFT-FIRST. Insert writes status='draft'; ON CONFLICT PRESERVES the stored
//      status. Publishing is a separate explicit `PUBLISH=1` run. The old seeds
//      hardcoded 'published' in both branches, so re-running one silently re-published
//      a post someone had deliberately unpublished.
//   3. UNPUBLISH IS STORY-WIDE. `UNPUBLISH=1` drafts every locale of the slug. The old
//      per-locale scripts drafted one language and left the others live.
//
// Usage from a statement file — see .claude/skills/publish-press-statement/.
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

// Mirrors the zod schema in src/server/posts.ts. A .mjs module cannot import that TS
// file (path aliases, @prisma/client, ./db), so the numbers are duplicated on purpose
// and prisma/lib/press-statement.test.mjs asserts they still match the source.
export const LIMITS = {
  title: 300,
  excerpt: 1000,
  location: 300,
  authorName: 200,
  caption: 500,
  slug: 120,
  translationKey: 64,
  assetUrl: 2000,
  hashtags: 50,
  hashtagLen: 100,
  gallery: 50,
  categories: ['Press Release', 'Statement', 'Field Update', 'News'],
  locales: ['en', 'ar', 'fr'],
  statuses: ['draft', 'published'],
};

// Same expression as ASSET_URL_RE in src/server/posts.ts. A URL that fails this does
// NOT error at render time — resolveAssetUrl silently substitutes /og-image.png.
const ASSET_URL_RE = /^(https?:\/\/|\/(uploads|blog|images)\/)/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9-]+$/;

// ---- markdown rules, verified against src/lib/markdown.ts ----
// `---` directly under a text line is a setext heading, not a rule: it renders the
// line above as an <h2>. And a blank line between "- " items makes marked emit a
// loose list (<li><p>…), which spaces differently from every other article.
function markdownProblems(body, where) {
  const out = [];
  const lines = body.split('\n');
  lines.forEach((line, i) => {
    if (/^-{3,}\s*$/.test(line)) {
      if (i > 0 && lines[i - 1].trim() !== '') {
        out.push(`${where}: "---" on line ${i + 1} has no blank line before it — the line above will render as an <h2>`);
      }
      if (i < lines.length - 1 && lines[i + 1].trim() !== '') {
        out.push(`${where}: "---" on line ${i + 1} has no blank line after it`);
      }
    }
  });
  // A blank line BETWEEN two bullets (not before the first or after the last).
  for (let i = 1; i < lines.length - 1; i++) {
    if (lines[i].trim() === '' && /^- \S/.test(lines[i - 1]) && /^- \S/.test(lines[i + 1])) {
      out.push(`${where}: blank line between bullets at line ${i + 1} — marked will emit a loose list`);
    }
  }
  // A hyphen with no space is not a list item; it renders as body text.
  lines.forEach((line, i) => {
    if (/^-[^\s-]/.test(line)) {
      out.push(`${where}: line ${i + 1} starts "-" with no space — this is NOT a bullet, it renders as a paragraph`);
    }
  });
  return out;
}

const len = (s) => (typeof s === 'string' ? s.length : -1);

/**
 * Pure. Returns a list of problems; [] means the config is safe to write.
 *
 * This is the ONLY validation a seeded row ever gets: seeds write raw SQL, so
 * createPostSchema never sees them, and the columns are unconstrained String?.
 * Most violations fail SILENTLY at render time rather than erroring, which is why
 * this runs before any network call.
 */
export function validateStatement(config) {
  const e = [];
  if (!config || typeof config !== 'object') return ['config must be an object'];

  const { slug, translationKey, category, date, hashtags = [], locales } = config;

  if (typeof slug !== 'string' || !slug) e.push('slug is required');
  else {
    if (slug.length > LIMITS.slug) e.push(`slug is ${slug.length} chars (max ${LIMITS.slug})`);
    if (!SLUG_RE.test(slug)) e.push(`slug "${slug}" must match ${SLUG_RE} — lowercase letters, digits and hyphens only`);
  }

  if (typeof translationKey !== 'string' || !translationKey) e.push('translationKey is required');
  else if (translationKey.length > LIMITS.translationKey) {
    e.push(`translationKey is ${translationKey.length} chars (max ${LIMITS.translationKey})`);
  }

  if (!LIMITS.categories.includes(category)) {
    e.push(`category "${category}" is not one of ${LIMITS.categories.join(' | ')} — the /news filter would drop this post`);
  }

  // Must be a plain YYYY-MM-DD string: a JS Date is serialized with a timezone by the
  // neon driver and can land the article a day early.
  if (typeof date !== 'string' || !DATE_RE.test(date)) {
    e.push(`date must be a "YYYY-MM-DD" string, got ${JSON.stringify(date)}`);
  }

  if (!Array.isArray(hashtags)) e.push('hashtags must be an array');
  else {
    if (hashtags.length > LIMITS.hashtags) e.push(`${hashtags.length} hashtags (max ${LIMITS.hashtags})`);
    hashtags.forEach((h, i) => {
      if (typeof h !== 'string' || !h.trim()) e.push(`hashtags[${i}] is empty`);
      else if (h.length > LIMITS.hashtagLen) e.push(`hashtags[${i}] is ${h.length} chars (max ${LIMITS.hashtagLen})`);
    });
  }

  if (!Array.isArray(locales) || locales.length === 0) {
    e.push('locales must be a non-empty array');
    return e;
  }

  const seen = new Set();
  for (const v of locales) {
    const where = `[${v?.locale ?? '?'}]`;

    // A typo'd locale ("EN") publishes a row that is invisible on every page AND in
    // the sitemap, with no error anywhere. This is the most silent failure of the lot.
    if (!LIMITS.locales.includes(v?.locale)) {
      e.push(`${where} locale must be one of ${LIMITS.locales.join(' | ')}`);
    }
    if (seen.has(v?.locale)) e.push(`${where} duplicate locale`);
    seen.add(v?.locale);

    if (!v?.title?.trim()) e.push(`${where} title is required`);
    else if (len(v.title) > LIMITS.title) e.push(`${where} title is ${len(v.title)} chars (max ${LIMITS.title})`);

    if (!v?.excerpt?.trim()) e.push(`${where} excerpt is required`);
    else if (len(v.excerpt) > LIMITS.excerpt) e.push(`${where} excerpt is ${len(v.excerpt)} chars (max ${LIMITS.excerpt})`);

    if (!v?.body?.trim()) e.push(`${where} body is required`);
    else e.push(...markdownProblems(v.body, where));

    if (v?.location != null && len(v.location) > LIMITS.location) {
      e.push(`${where} location is ${len(v.location)} chars (max ${LIMITS.location})`);
    }
    if (v?.authorName != null && len(v.authorName) > LIMITS.authorName) {
      e.push(`${where} authorName is ${len(v.authorName)} chars (max ${LIMITS.authorName})`);
    }
    if (v?.coverImageUrl != null && !ASSET_URL_RE.test(v.coverImageUrl)) {
      e.push(`${where} coverImageUrl "${v.coverImageUrl}" fails ${ASSET_URL_RE} — it would silently fall back to /og-image.png`);
    }

    const gallery = v?.gallery ?? [];
    if (!Array.isArray(gallery)) e.push(`${where} gallery must be an array`);
    else {
      if (gallery.length > LIMITS.gallery) e.push(`${where} ${gallery.length} gallery images (max ${LIMITS.gallery})`);
      gallery.forEach((g, i) => {
        if (!g?.url || !ASSET_URL_RE.test(g.url)) {
          e.push(`${where} gallery[${i}].url "${g?.url}" fails ${ASSET_URL_RE}`);
        }
        // Captions double as the img alt text in ArticlePage.astro.
        if (g?.caption != null && len(g.caption) > LIMITS.caption) {
          e.push(`${where} gallery[${i}].caption is ${len(g.caption)} chars (max ${LIMITS.caption})`);
        }
      });
    }
  }

  return e;
}

export function assertStatement(config) {
  const problems = validateStatement(config);
  if (problems.length) {
    throw new Error(`Statement config is invalid:\n  - ${problems.join('\n  - ')}`);
  }
}

export function maskedHost(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username ? '***@' : ''}${u.host}${u.pathname}`;
  } catch {
    return '(unparseable DATABASE_URL)';
  }
}

// Guard + client construction live here (not at module scope) so importing a statement
// file for its exported content has no side effects.
export function connect() {
  const DB_URL = process.env.DATABASE_URL || '';
  console.log(`DB target: ${maskedHost(DB_URL)}`);
  if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
    console.error(
      'ABORT: DATABASE_URL is not the Neon production database.\n' +
        '       Run with: node --env-file=.env.local <script>',
    );
    process.exit(1);
  }
  return neon(DB_URL);
}

const UPSERT = `INSERT INTO "Post"
     (id, slug, locale, "translationKey", title, category, status, date, location, excerpt, "coverImageUrl", body, hashtags, "authorName", "createdAt", "updatedAt")
   VALUES ($1,$2,$3,$4,$5,$6,'draft',$7::timestamp,$8,$9,$10,$11,$12,$13, now(), now())
   ON CONFLICT (slug, locale) DO UPDATE SET
     "translationKey" = EXCLUDED."translationKey", title = EXCLUDED.title, category = EXCLUDED.category,
     status = "Post".status, date = EXCLUDED.date, location = EXCLUDED.location, excerpt = EXCLUDED.excerpt,
     "coverImageUrl" = EXCLUDED."coverImageUrl", body = EXCLUDED.body, hashtags = EXCLUDED.hashtags,
     "authorName" = EXCLUDED."authorName", "updatedAt" = now()`;

// sql.transaction() cannot read between statements, so the gallery rows resolve their
// postId with a subselect instead of RETURNING id. Correct inside a transaction: it
// sees the Post row written a few statements earlier.
const GALLERY_DELETE = `DELETE FROM "GalleryImage" WHERE "postId" IN (SELECT id FROM "Post" WHERE slug = $1 AND locale = $2)`;
const GALLERY_INSERT = `INSERT INTO "GalleryImage" (id, url, caption, "order", "postId")
   SELECT $1, $2, $3, $4, p.id FROM "Post" p WHERE p.slug = $5 AND p.locale = $6`;

/**
 * Publish (or dry-run / unpublish / flip to published) one trilingual statement.
 *
 * opts:
 *   dryRun    — validate, print the payload, write nothing
 *   unpublish — set every locale of this slug to draft
 *   publish   — flip every locale of this story to published (no content write)
 *   sql       — inject a client (tests); otherwise connect() is used
 */
export async function publishStatement(config, opts = {}) {
  const { dryRun = false, unpublish = false, publish = false } = opts;
  assertStatement(config);

  const { slug, translationKey, category, date, hashtags = [], locales } = config;

  if (dryRun) {
    console.log(`DRY_RUN=1 → no write. ${slug}`);
    for (const v of locales) {
      console.log(`  [${v.locale}]`, {
        title: v.title,
        location: v.location,
        cover: v.coverImageUrl,
        excerptChars: v.excerpt.length,
        bodyChars: v.body.length,
        bullets: (v.body.match(/^- /gm) || []).length,
        gallery: (v.gallery ?? []).length,
      });
    }
    console.log(`  shared: category=${category} date=${date} translationKey=${translationKey}`);
    return { action: 'dry-run', rows: [], translationKey };
  }

  const sql = opts.sql ?? connect();

  // Never adopt a different key for an existing slug: that orphans the story's
  // translations from the toggle, the hreflang alternates and the sitemap.
  const existingKeys = await sql.query(
    `SELECT DISTINCT "translationKey" AS k FROM "Post" WHERE slug = $1 AND "translationKey" IS NOT NULL`,
    [slug],
  );
  const foreign = existingKeys.map((r) => r.k).filter((k) => k !== translationKey);
  if (foreign.length) {
    throw new Error(
      `ABORT: slug "${slug}" already carries translationKey ${foreign.join(', ')}, not ${translationKey}.\n` +
        '       Reuse the stored key — regenerating it orphans the existing translations.',
    );
  }

  if (unpublish) {
    // Story-wide on purpose: drafting one locale leaves the others live with a
    // language toggle pointing at a 404.
    await sql.query(`UPDATE "Post" SET status='draft', "updatedAt"=now() WHERE slug = $1`, [slug]);
    const rows = await sql.query(`SELECT locale, status FROM "Post" WHERE slug = $1 ORDER BY locale`, [slug]);
    console.log(`Unpublished ${rows.length} row(s):`, rows.map((r) => `${r.locale}=${r.status}`).join(' '));
    return { action: 'unpublish', rows, translationKey };
  }

  if (publish) {
    await sql.query(
      `UPDATE "Post" SET status='published', "updatedAt"=now() WHERE slug = $1 AND "translationKey" = $2`,
      [slug, translationKey],
    );
    const rows = await sql.query(`SELECT locale, status FROM "Post" WHERE slug = $1 ORDER BY locale`, [slug]);
    const bad = rows.filter((r) => r.status !== 'published');
    console.log(`Published ${rows.length} row(s):`, rows.map((r) => `${r.locale}=${r.status}`).join(' '));
    if (rows.length !== locales.length || bad.length) {
      throw new Error(`ABORT: expected ${locales.length} published rows, got ${rows.length - bad.length}.`);
    }
    console.log(`\n✅ Live: /news/${slug}${locales.length > 1 ? `  (+ ${locales.filter((v) => v.locale !== 'en').map((v) => `/${v.locale}/news/${slug}`).join(', ')})` : ''}`);
    return { action: 'publish', rows, translationKey };
  }

  // ---- content write: every row and every gallery image, or nothing ----
  const batch = [];
  for (const v of locales) {
    batch.push(
      sql.query(UPSERT, [
        randomUUID(),
        slug,
        v.locale,
        translationKey,
        v.title,
        category,
        date,
        v.location ?? null,
        v.excerpt,
        v.coverImageUrl ?? null,
        v.body,
        // The engine owns this: a bare array becomes a Postgres array literal and
        // serializePost's JSON.parse then silently yields zero hashtags.
        JSON.stringify(hashtags),
        v.authorName ?? null,
      ]),
    );
  }
  // Clear the gallery for EVERY locale, re-insert only where declared — otherwise a
  // locale that had images in an earlier run keeps orphan rows forever.
  for (const v of locales) {
    batch.push(sql.query(GALLERY_DELETE, [slug, v.locale]));
  }
  for (const v of locales) {
    (v.gallery ?? []).forEach((g, i) => {
      batch.push(sql.query(GALLERY_INSERT, [randomUUID(), g.url, g.caption ?? null, g.order ?? i, slug, v.locale]));
    });
  }
  await sql.transaction(batch);

  // ---- read back and assert ----
  const rows = await sql.query(
    `SELECT locale, status, title, "translationKey" AS tkey, "coverImageUrl" AS cover, length(body) AS body_len
       FROM "Post" WHERE slug = $1 ORDER BY locale`,
    [slug],
  );
  const counts = await sql.query(
    `SELECT p.locale, count(g.id)::int AS c FROM "Post" p
       LEFT JOIN "GalleryImage" g ON g."postId" = p.id
      WHERE p.slug = $1 GROUP BY p.locale`,
    [slug],
  );
  const galleryByLocale = Object.fromEntries(counts.map((r) => [r.locale, r.c]));

  const problems = [];
  if (rows.length !== locales.length) problems.push(`expected ${locales.length} rows, found ${rows.length}`);
  for (const v of locales) {
    const row = rows.find((r) => r.locale === v.locale);
    if (!row) {
      problems.push(`[${v.locale}] row missing`);
      continue;
    }
    if (row.title !== v.title) problems.push(`[${v.locale}] title mismatch`);
    if (row.tkey !== translationKey) problems.push(`[${v.locale}] translationKey mismatch`);
    if (row.cover !== (v.coverImageUrl ?? null)) problems.push(`[${v.locale}] coverImageUrl mismatch`);
    if (Number(row.body_len) !== v.body.length) {
      problems.push(`[${v.locale}] body length ${row.body_len} != ${v.body.length}`);
    }
    const want = (v.gallery ?? []).length;
    if ((galleryByLocale[v.locale] ?? 0) !== want) {
      problems.push(`[${v.locale}] gallery ${galleryByLocale[v.locale] ?? 0} != ${want}`);
    }
  }
  const distinctKeys = new Set(rows.map((r) => r.tkey));
  if (distinctKeys.size !== 1) problems.push(`story is split across ${distinctKeys.size} translationKeys`);

  for (const r of rows) {
    console.log(`  [${r.locale}] status=${r.status} cover=${r.cover} bodyLen=${r.body_len} gallery=${galleryByLocale[r.locale] ?? 0}`);
  }
  if (problems.length) {
    throw new Error(`ABORT: read-back verification failed:\n  - ${problems.join('\n  - ')}`);
  }

  const drafts = rows.filter((r) => r.status !== 'published').map((r) => r.locale);
  console.log(`\n✅ Written: ${rows.length} locale rows sharing one translationKey.`);
  if (drafts.length) {
    console.log(`   Still draft (${drafts.join(', ')}) — nothing is live yet. Review, then publish with:`);
    console.log(`   PUBLISH=1 node --env-file=.env.local ${process.argv[1] ?? '<this script>'}`);
  }
  return { action: 'write', rows, translationKey, galleryByLocale };
}

/** Reads the standard env flags so every statement file's footer stays one line. */
export function envOpts() {
  return {
    dryRun: process.env.DRY_RUN === '1',
    unpublish: process.env.UNPUBLISH === '1',
    publish: process.env.PUBLISH === '1',
  };
}
