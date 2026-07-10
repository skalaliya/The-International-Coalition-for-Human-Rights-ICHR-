// Idempotent additive seed for the launch press release:
// "International Coalition for Human Rights Meets EU Delegation to the UN in Geneva".
// Extracted out of prisma/seed.mjs, which used to carry both this content AND the
// admin user — a combination that made `npm run db:seed` destructive.
//
// Writes over Neon's HTTPS serverless driver (port 443) because this network drops
// the Postgres :5432 handshake. See prisma/seed-translations-http.mjs.
//
// The TRANSLATION_KEY below is the one already stored in production. It MUST NOT be
// regenerated: prisma/seed-eu-translations.mjs binds the Arabic and French versions
// of this story to it, and a fresh key would orphan them from the language toggle,
// the hreflang alternates and the sitemap.
//
// Re-running restores the seeded title/body/gallery for this slug — do not run it
// after editing this post in /admin.
//
// Usage:
//   DRY_RUN=1  node --env-file=.env.local prisma/seed-eu-delegation.mjs
//              node --env-file=.env.local prisma/seed-eu-delegation.mjs
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-eu-delegation.mjs
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';

export const SLUG = 'eu-delegation-geneva-sudan-june-2026';
export const TRANSLATION_KEY = 'cmqcvaqwy00028csoy1wlm83s';

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

function connect() {
  const DB_URL = process.env.DATABASE_URL || '';
  console.log(`DB target: ${maskedHost(DB_URL)}`);
  if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
    console.error('ABORT: DATABASE_URL is not the Neon production database.');
    process.exit(1);
  }
  return neon(DB_URL);
}

export const BODY = `At the outset of the meeting, the President of the Coalition reviewed the current human-rights situation in Sudan, emphasizing the Coalition's firm position calling for an immediate and comprehensive cessation of hostilities, the delivery of prompt justice, and continued commitment to international accountability mechanisms — including the surrender of all individuals wanted by the International Criminal Court (ICC). He stressed that such measures are essential to ending impunity and ensuring sustainable peace.

Members of the Coalition delegation subsequently presented a detailed and well-documented report outlining the catastrophic consequences of the war and its direct impact on civilians. The report warned against the growing phenomenon of militarization and systematic extremism allegedly pursued by the current military leadership. It also highlighted the dangers posed by the international community's silence regarding acts of intimidation and violence allegedly carried out by the Islamic Movement against Sudanese civilians, warning that such practices threaten social cohesion and risk plunging the country into deeper instability and chaos.

The meeting also addressed the issue of the Sudanese Doctors Network and allegations concerning the Commander-in-Chief of the Sudanese Armed Forces' acknowledgment of using medical personnel as a cover for military intelligence activities. The delegation expressed deep concern and condemnation over the exploitation of medical professionals and their involvement in military operations in a manner that contravenes international humanitarian principles and legal norms.

Participants further discussed the deteriorating conditions in areas under the control of the Rapid Support Forces (RSF). The Coalition's delegation highlighted the absence of prosecutorial institutions, the collapse of the education system, and the deprivation of citizens' fundamental constitutional rights. In this regard, Mrs. Katarina Tapio revealed that the European Union has allocated financial resources to support education and alternative learning initiatives in Sudan through UNICEF and a number of international organizations.

Regarding monitoring and accountability mechanisms, the Coalition stressed the importance of the United Nations Fact-Finding Mission conducting direct field visits and meeting victims and witnesses on the ground to ensure the highest levels of credibility and accuracy in its reports. The EU diplomat expressed full agreement with this recommendation.

At the conclusion of the meeting, the EU Delegation to the UN in Geneva commended the pivotal role played by the United Kingdom in advancing peace efforts in Sudan. She reaffirmed the European Union's firm position calling for an immediate end to the war and announced that, on 15 June, the European Union will present a comprehensive report on the human-rights situation in Sudan before the United Nations.`;

export const EXCERPT =
  'Representatives of the International Coalition for Human Rights held an important and extensive meeting with Mrs. Katarina Tapio of the EU Delegation to the UN in Geneva to discuss the rapidly deteriorating humanitarian and human rights situation in Sudan as a result of the ongoing conflict.';

export const GALLERY = [
  {
    url: `/blog/${SLUG}/E1.jpg`,
    caption:
      "The European Union Mission in Geneva commends the United Kingdom's efforts to restore peace in Sudan and reaffirms to the International Coalition its continued support for education through UNICEF.",
    order: 0,
  },
  {
    url: `/blog/${SLUG}/E2.jpg`,
    caption:
      'Geneva talks between the International Coalition and the European Union consider addressing violations in Sudan; designating the Islamic Movement as a terrorist organization is a key effort to restore peace.',
    order: 1,
  },
  {
    url: `/blog/${SLUG}/E3.jpg`,
    caption:
      'The International Coalition for Human Rights briefs the European Union Representative to the Human Rights Council at the United Nations on the exploitation of medical professionals by the Sudanese Army, condemns the use of chemical weapons, and calls for a field visit by the UN Fact-Finding Mission.',
    order: 2,
  },
];

export const POST = {
  slug: SLUG,
  locale: 'en',
  translationKey: TRANSLATION_KEY,
  title:
    'International Coalition for Human Rights Meets EU Delegation to the UN in Geneva on Violations Arising from the War in Sudan',
  category: 'Press Release',
  date: '2026-06-02',
  location: 'Geneva',
  excerpt: EXCERPT,
  coverImageUrl: `/blog/${SLUG}/E1.jpg`,
  body: BODY,
  hashtags: ['#international_coalition_for_h_rights'],
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
      title: POST.title.slice(0, 56) + '…',
      category: POST.category,
      date: POST.date,
      translationKey: POST.translationKey,
      coverImageUrl: POST.coverImageUrl,
      bodyChars: POST.body.length,
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
      JSON.stringify(POST.hashtags),
      POST.authorName,
    ],
  );
  const postId = upserted[0].id;

  // Rebuild the gallery rather than append — otherwise re-running duplicates rows.
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
    `SELECT title, status, "translationKey" AS tkey, length(body) AS body_len FROM "Post" WHERE slug=$1 AND locale=$2`,
    [POST.slug, POST.locale],
  );
  const gc = await sql.query(`SELECT count(*)::int AS c FROM "GalleryImage" WHERE "postId" = $1`, [postId]);
  const row = check[0];
  const ok =
    !!row &&
    row.title === POST.title &&
    row.status === 'published' &&
    row.tkey === TRANSLATION_KEY &&
    Number(row.body_len) === POST.body.length &&
    gc[0].c === GALLERY.length;
  console.log(`Read-back: status=${row?.status} tkey=${row?.tkey} bodyLen=${row?.body_len} gallery=${gc[0]?.c}/${GALLERY.length}`);
  if (!ok) {
    console.error('ABORT: read-back verification failed.');
    process.exit(1);
  }
  console.log(`\n✅ Published: /news/${SLUG}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
