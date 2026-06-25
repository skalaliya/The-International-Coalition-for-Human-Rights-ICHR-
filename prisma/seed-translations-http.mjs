// Publishes the EU + 62nd AR/FR translations over Neon's HTTPS serverless driver
// (port 443), bypassing networks that block Postgres :5432. Reuses the exact
// translated content exported by the per-post seed scripts. Idempotent: upsert by
// (slug, locale) then rebuild the gallery rows.
//   node --env-file=.env.local prisma/seed-translations-http.mjs
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import {
  SLUG as EU_SLUG,
  TRANSLATION_KEY as EU_KEY,
  GALLERY_URLS as EU_GAL,
  LOCALES as EU_LOCALES,
} from './seed-eu-translations.mjs';
import {
  SLUG as N_SLUG,
  TRANSLATION_KEY as N_KEY,
  GALLERY_URLS as N_GAL,
  LOCALES as N_LOCALES,
} from './seed-62nd-translations.mjs';

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.');
  process.exit(1);
}
const sql = neon(DB_URL);

const jobs = [
  ...EU_LOCALES.map((v) => ({
    slug: EU_SLUG,
    translationKey: EU_KEY,
    category: 'Press Release',
    date: '2026-06-02',
    coverImageUrl: `/blog/${EU_SLUG}/E1.jpg`,
    hashtags: ['#international_coalition_for_h_rights'],
    gallery: EU_GAL.map((url, i) => ({ url, caption: v.captions?.[i] ?? null, order: i })),
    locale: v.locale,
    title: v.title,
    excerpt: v.excerpt,
    body: v.body,
    location: v.location,
    authorName: v.authorName,
  })),
  ...N_LOCALES.map((v) => ({
    slug: N_SLUG,
    translationKey: N_KEY,
    category: 'Statement',
    date: '2026-06-14',
    coverImageUrl: `/blog/${N_SLUG}/P1.jpg`,
    hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
    gallery: N_GAL.map((url, i) => ({ url, caption: null, order: i })),
    locale: v.locale,
    title: v.title,
    excerpt: v.excerpt,
    body: v.body,
    location: v.location,
    authorName: v.authorName,
  })),
];

async function run() {
  for (const j of jobs) {
    const id = randomUUID();
    const upserted = await sql.query(
      `INSERT INTO "Post"
         (id, slug, locale, "translationKey", title, category, status, date, location, excerpt, "coverImageUrl", body, hashtags, "authorName", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,'published',$7::timestamp,$8,$9,$10,$11,$12,$13, now(), now())
       ON CONFLICT (slug, locale) DO UPDATE SET
         "translationKey" = EXCLUDED."translationKey", title = EXCLUDED.title, category = EXCLUDED.category,
         status = EXCLUDED.status, date = EXCLUDED.date, location = EXCLUDED.location, excerpt = EXCLUDED.excerpt,
         "coverImageUrl" = EXCLUDED."coverImageUrl", body = EXCLUDED.body, hashtags = EXCLUDED.hashtags,
         "authorName" = EXCLUDED."authorName", "updatedAt" = now()
       RETURNING id`,
      [id, j.slug, j.locale, j.translationKey, j.title, j.category, j.date, j.location, j.excerpt, j.coverImageUrl, j.body, JSON.stringify(j.hashtags), j.authorName],
    );
    const postId = upserted[0].id;

    await sql.query(`DELETE FROM "GalleryImage" WHERE "postId" = $1`, [postId]);
    for (const g of j.gallery) {
      await sql.query(
        `INSERT INTO "GalleryImage" (id, url, caption, "order", "postId") VALUES ($1,$2,$3,$4,$5)`,
        [randomUUID(), g.url, g.caption, g.order, postId],
      );
    }

    const chk = await sql.query(
      `SELECT title, "translationKey" AS tkey, status FROM "Post" WHERE slug = $1 AND locale = $2`,
      [j.slug, j.locale],
    );
    const gc = await sql.query(`SELECT count(*)::int AS c FROM "GalleryImage" WHERE "postId" = $1`, [postId]);
    const ok =
      chk[0] && chk[0].title === j.title && chk[0].tkey === j.translationKey && gc[0].c === j.gallery.length;
    console.log(`${ok ? '✅' : '❌'} ${j.slug} [${j.locale}] status=${chk[0]?.status} gallery=${gc[0]?.c}/${j.gallery.length}`);
    if (!ok) {
      console.error(`ABORT: read-back failed for ${j.slug} [${j.locale}]`);
      process.exit(1);
    }
  }
  console.log('\n✅ All EU + 62nd AR/FR translations published over HTTPS.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
