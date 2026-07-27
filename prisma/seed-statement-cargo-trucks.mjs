// Idempotent additive seed for a single statement:
// "Statement of Condemnation: Targeting of Commercial Cargo Trucks on the
//  El Fasher–Al Koma Road, Sudan" (16 July 2026).
// Upserts ONLY this post by (slug, locale) — never touches the admin user or other posts.
//
// Writes over Neon's HTTPS serverless driver (port 443) because this network drops
// the Postgres :5432 handshake. See prisma/seed-translations-http.mjs.
//
// The body is the statement VERBATIM, including its "The International Coalition of
// Human Rights Organizations" sign-off — which is the wording on the designed press
// cards, not the site's canonical "International Coalition for Human Rights (ICHR)".
// That is deliberate; do not "correct" it without asking.
//
// The gallery is REBUILT on every run (DELETE + re-INSERT — appending would duplicate
// rows), and re-running restores the seeded title/body/cover. Do not run this after
// editing this post through /admin: it silently reverts those edits. Note also that
// `status` is hardcoded 'published' here, so re-running re-publishes a post that had
// been unpublished.
//
// The AR/FR versions live in prisma/seed-statement-cargo-trucks-translations.mjs and
// import SLUG + TRANSLATION_KEY from this file. Run THIS script first: that one asserts
// all three locale rows exist and aborts otherwise.
//
// Usage:
//   DRY_RUN=1  node --env-file=.env.local prisma/seed-statement-cargo-trucks.mjs
//              node --env-file=.env.local prisma/seed-statement-cargo-trucks.mjs
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-cargo-trucks.mjs
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';

export const SLUG = 'condemnation-cargo-trucks-el-fasher-al-koma-july-2026';
// Stable across locales: the AR/FR versions reuse this exact key so the language
// toggle, the hreflang alternates and the sitemap group them as one story.
// NEVER regenerate it — a fresh key orphans the translations.
export const TRANSLATION_KEY = '8e35b0c1-b4fe-4aae-a812-a3e7cbcb3d89';

const DRY_RUN = process.env.DRY_RUN === '1';
const UNPUBLISH = process.env.UNPUBLISH === '1';

function maskedHost(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username ? '***@' : ''}${u.host}${u.pathname}`;
  } catch {
    return '(unparseable DATABASE_URL)';
  }
}

// Guard + client construction live inside main() so that importing this module
// for its exported content (as the AR/FR seed does) has no side effects.
function connect() {
  const DB_URL = process.env.DATABASE_URL || '';
  console.log(`DB target: ${maskedHost(DB_URL)}`);
  if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
    console.error(
      'ABORT: DATABASE_URL is not the Neon production database.\n' +
        '       Run with: node --env-file=.env.local prisma/seed-statement-cargo-trucks.mjs',
    );
    process.exit(1);
  }
  return neon(DB_URL);
}

// Markdown notes: `---` needs a blank line on BOTH sides (directly under a text line
// it becomes a setext <h2>), and the bullet items must stay tight — a blank line
// between them makes marked emit a loose list that spaces differently from the rest
// of the newsroom.
export const BODY = `The International Coalition of Human Rights Organizations expresses its profound concern over field reports, including those documented by the Sudanese National Observatory for Human Rights, indicating that civilian commercial cargo trucks were targeted by unmanned aerial vehicles (UAVs) on the El Fasher–Al Koma road in Sudan.

Guided by our unwavering commitment to neutrality, international human rights standards, and humanitarian principles, we condemn in the strongest possible terms this dangerous escalation, which directly threatens the lifelines upon which civilians depend for their survival.

The deliberate targeting of commercial supply convoys transporting essential goods is not merely an isolated violation; it may constitute a serious violation of international humanitarian law and represents an attack on civilian objects indispensable to the survival and well-being of the civilian population. Such acts deepen the humanitarian crisis, exacerbate civilian suffering, and undermine efforts to ensure humanitarian access and economic stability.

We call upon the international community to adopt a unified and resolute response to halt these grave violations of international humanitarian law and to ensure the protection of vital supply routes for civilians.

Reaffirming our steadfast commitment to peace, we renew our call for an immediate, comprehensive, and unconditional cessation of hostilities throughout Sudan.

In light of the worsening humanitarian situation, we urgently call upon all international and regional human rights organizations, humanitarian agencies, and relevant stakeholders to:

- Unite in a clear and unequivocal position demanding an end to the war and the advancement of a sustainable and inclusive peace process.
- Intensify coordinated international efforts to establish effective accountability mechanisms capable of investigating alleged violations of international law and ensuring that those responsible are held accountable in accordance with applicable legal standards.
- Ensure the full protection of civilians and guarantee the safe and unhindered passage of commercial goods, humanitarian assistance, and essential supplies, free from attack, obstruction, or arbitrary restrictions.

Peace in Sudan is an urgent humanitarian imperative. The international human rights community cannot accept any attempt to prolong the conflict or to use civilian lives, livelihoods, or essential resources as instruments of war.

---

**The International Coalition of Human Rights Organizations**

Geneva, 16 July 2026`;

export const EXCERPT =
  'The Coalition expresses profound concern over field reports, including those documented by the Sudanese National Observatory for Human Rights, indicating that civilian commercial cargo trucks were targeted by unmanned aerial vehicles on the El Fasher–Al Koma road in Sudan.';

// Captions are rendered as a visible <figcaption> AND used as the img alt text
// (ArticlePage.astro), so they must read as prose. Limit is 500 chars.
export const GALLERY = [
  {
    url: `/blog/${SLUG}/card-1.jpg`,
    caption:
      'Statement card 1 of 2: the Coalition condemns the escalation in the strongest possible terms and warns that targeting commercial supply convoys may constitute a serious violation of international humanitarian law.',
    order: 0,
  },
  {
    url: `/blog/${SLUG}/card-2.jpg`,
    caption:
      'Statement card 2 of 2: the Coalition’s three calls to international and regional organizations — a unified position demanding an end to the war, effective accountability mechanisms, and the safe passage of commercial goods and humanitarian assistance.',
    order: 1,
  },
];

export const POST = {
  slug: SLUG,
  locale: 'en',
  translationKey: TRANSLATION_KEY,
  title: 'Statement of Condemnation: Targeting of Commercial Cargo Trucks on the El Fasher–Al Koma Road, Sudan',
  category: 'Statement',
  date: '2026-07-16',
  location: 'Geneva',
  excerpt: EXCERPT,
  coverImageUrl: `/blog/${SLUG}/cover.jpg`,
  body: BODY,
  hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
  authorName: 'ICHR Communications',
};

async function main() {
  const sql = connect();

  const existing = await sql.query(`SELECT id, status FROM "Post" WHERE slug = $1 AND locale = $2`, [
    POST.slug,
    POST.locale,
  ]);
  console.log(
    `Slug "${SLUG}" [${POST.locale}] ${
      existing[0] ? `exists (id ${existing[0].id}, status ${existing[0].status}) → update` : 'not found → create'
    }`,
  );

  if (DRY_RUN) {
    console.log('DRY_RUN=1 → no write. Payload summary:');
    console.log({
      title: POST.title,
      category: POST.category,
      date: POST.date,
      translationKey: POST.translationKey,
      coverImageUrl: POST.coverImageUrl,
      excerptChars: POST.excerpt.length,
      bodyChars: POST.body.length,
      bullets: (POST.body.match(/^- /gm) || []).length,
      gallery: GALLERY.length,
    });
    return;
  }

  if (UNPUBLISH) {
    if (!existing[0]) {
      console.log('Nothing to unpublish.');
      return;
    }
    await sql.query(`UPDATE "Post" SET status='draft', "updatedAt"=now() WHERE slug=$1 AND locale=$2`, [
      POST.slug,
      POST.locale,
    ]);
    console.log(`Unpublished: ${SLUG} [${POST.locale}] is now "draft".`);
    return;
  }

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
    [
      randomUUID(),
      POST.slug,
      POST.locale,
      POST.translationKey,
      POST.title,
      POST.category,
      POST.date,
      POST.location,
      POST.excerpt,
      POST.coverImageUrl,
      POST.body,
      // Must be a JSON string: a bare array becomes a Postgres array literal, and
      // serializePost's JSON.parse then silently yields zero hashtags.
      JSON.stringify(POST.hashtags),
      POST.authorName,
    ],
  );
  const postId = upserted[0].id;

  // Rebuild the gallery rather than append — otherwise re-running duplicates rows.
  // "order" stays double-quoted: it is a reserved word.
  await sql.query(`DELETE FROM "GalleryImage" WHERE "postId" = $1`, [postId]);
  for (const g of GALLERY) {
    await sql.query(`INSERT INTO "GalleryImage" (id, url, caption, "order", "postId") VALUES ($1,$2,$3,$4,$5)`, [
      randomUUID(),
      g.url,
      g.caption,
      g.order,
      postId,
    ]);
  }

  const check = await sql.query(
    `SELECT title, status, "translationKey" AS tkey, "coverImageUrl" AS cover, length(body) AS body_len
       FROM "Post" WHERE slug = $1 AND locale = $2`,
    [POST.slug, POST.locale],
  );
  const gc = await sql.query(`SELECT count(*)::int AS c FROM "GalleryImage" WHERE "postId" = $1`, [postId]);
  const row = check[0];
  const ok =
    !!row &&
    row.title === POST.title &&
    row.status === 'published' &&
    row.tkey === TRANSLATION_KEY &&
    row.cover === POST.coverImageUrl &&
    Number(row.body_len) === POST.body.length &&
    gc[0].c === GALLERY.length;

  console.log(
    `Read-back: status=${row?.status} tkey=${row?.tkey} cover=${row?.cover} bodyLen=${row?.body_len}/${POST.body.length} gallery=${gc[0]?.c}/${GALLERY.length}`,
  );
  if (!ok) {
    console.error('ABORT: read-back verification failed — stored row does not match payload.');
    process.exit(1);
  }
  console.log(`\n✅ Published: /news/${SLUG}`);
  console.log('   Next: node --env-file=.env.local prisma/seed-statement-cargo-trucks-translations.mjs');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
