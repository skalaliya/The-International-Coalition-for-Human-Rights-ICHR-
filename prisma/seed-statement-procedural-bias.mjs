// Idempotent additive seed for a single statement:
// "On Procedural Bias and the Selective Handling of Human Rights Violations in Sudan".
// Upserts ONLY this post by (slug, locale) — never touches the admin user or other posts.
//
// Writes over Neon's HTTPS serverless driver (port 443) because this network drops
// the Postgres :5432 handshake. See prisma/seed-translations-http.mjs.
//
// It deliberately does NOT touch GalleryImage rows: the post ships with no gallery,
// so re-running can never wipe photos added later through /admin. Re-running DOES
// restore the seeded title/body/cover — don't re-run after editing this post in admin.
//
// Usage:
//   DRY_RUN=1  node --env-file=.env.local prisma/seed-statement-procedural-bias.mjs
//              node --env-file=.env.local prisma/seed-statement-procedural-bias.mjs
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-procedural-bias.mjs
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';

export const SLUG = 'procedural-bias-selective-handling-sudan-july-2026';
// Stable across locales: the AR/FR versions must reuse this exact key so the
// language toggle, hreflang alternates and sitemap group them as one story.
export const TRANSLATION_KEY = '3f8c1e64-5b27-4a90-9d13-7e6ab2c4f051';

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
// for its exported content (as the AR/FR seeds will) has no side effects.
function connect() {
  const DB_URL = process.env.DATABASE_URL || '';
  console.log(`DB target: ${maskedHost(DB_URL)}`);
  if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
    console.error(
      'ABORT: DATABASE_URL is not the Neon production database.\n' +
        '       Run with: node --env-file=.env.local prisma/seed-statement-procedural-bias.mjs',
    );
    process.exit(1);
  }
  return neon(DB_URL);
}

export const BODY = `The International Coalition for Human Rights (ICHR) is following with profound concern and close scrutiny the ongoing deliberations during the 62nd session of the United Nations Human Rights Council regarding the draft resolution on the humanitarian situation in the city of El Obeid.

While the Coalition welcomes all efforts aimed at ensuring justice for victims and protecting civilians, it expresses its strong reservations regarding the selective and reductionist methodology underpinning the draft resolution. The Coalition therefore wishes to clarify the following facts for both the international community and the Sudanese public.

## The Root Cause of the Crisis

The Coalition affirms that the root cause and principal driver of the current crisis in Sudan is not merely a conventional military confrontation between two parties. Rather, it is the direct consequence of political and ideological agendas advanced by the Islamic Movement through its affiliated armed formations, including the Al-Baraa ibn Malik Brigade, which has effectively assumed control over military and political decision-making within the leadership of the Sudanese Armed Forces. According to the Coalition's assessment, this dominant faction has deliberately prolonged the conflict in order to preserve its grip on power and has consistently rejected regional, international, and United States-led ceasefire initiatives and peace negotiation platforms by imposing unattainable preconditions, thereby contributing to what has become the world's largest displacement and humanitarian crisis.

## Selectivity Undermines Impartial Justice

The Coalition further emphasizes that limiting condemnation and documentation of violations to a single geographical area, namely the city of El Obeid, represents a fundamental failure to uphold the principles of impartial justice. The draft resolution completely overlooks the grave and ongoing atrocities committed across other regions and states of Sudan, including Darfur, Kordofan, and Blue Nile. Most recently, this includes the deadly events that occurred in Kulbus, West Darfur, on 29 June 2026, which resulted in numerous civilian casualties, including children.

The Coalition also notes with concern that the draft resolution appears to rely primarily on reports produced by international mechanisms that have been unable to gain effective access to affected areas due to restrictions imposed by the de facto authorities based in Port Sudan.

## Legitimacy and the Position of the African Union

The Coalition further draws attention to a serious legal and procedural concern arising from the decision to afford the de facto military authorities in Port Sudan exclusive access to United Nations platforms to advance a unilateral narrative, while disregarding the position of the African Union, which has maintained Sudan's suspension since 27 October 2021 following the unconstitutional military coup against the civilian-led government. Granting this authority international diplomatic legitimacy risks reinforcing its intransigence and further undermining ongoing peace efforts and negotiation processes.

## Matters Omitted from the Council's Agenda

The Coalition expresses grave concern over the omission from the Human Rights Council's agenda of several matters of exceptional seriousness. It calls for an urgent and independent international investigation into:

- documented allegations concerning the use of internationally prohibited chemical weapons by the Sudanese Armed Forces;
- the indiscriminate aerial bombardment of civilians and civilian infrastructure under the pretext of targeting alleged social support bases;
- the obstruction of humanitarian relief operations, including convoys of the World Food Programme;
- the reported involvement of foreign cross-border armed groups, including Seleka forces from the Central African Republic.

## The Coalition's Calls

In light of the foregoing, the International Coalition for Human Rights calls for the following:

1. **A comprehensive and balanced resolution.** The draft resolution should be revised to ensure that it is comprehensive, balanced, and reflective of the full scope of human rights violations committed throughout all regions of Sudan, without geographical selectivity or partial treatment.

2. **An independent international investigation.** An independent international investigation should be established into allegations concerning the use of chemical weapons and the deliberate targeting of civilians on ethnic and geographical grounds.

3. **A principled position on legitimacy.** The international community should adopt a principled position consistent with the decisions of the African Union by refraining from recognizing the legitimacy of the military authorities established following the coup in Port Sudan, thereby preventing the misuse of international forums to justify the continuation of the armed conflict.

---

**The International Coalition for Human Rights (ICHR)**

Geneva, 09 July 2026`;

export const EXCERPT =
  'The Coalition welcomes efforts to secure justice for victims, but warns that the draft resolution before the 62nd session of the UN Human Rights Council — confined to the city of El Obeid — rests on a selective methodology that overlooks grave violations across Darfur, Kordofan and Blue Nile. It calls for a comprehensive resolution and an independent international investigation into alleged chemical weapons use.';

export const POST = {
  slug: SLUG,
  locale: 'en',
  translationKey: TRANSLATION_KEY,
  title: 'On Procedural Bias and the Selective Handling of Human Rights Violations in Sudan',
  category: 'Statement',
  date: '2026-07-09',
  location: 'Geneva',
  excerpt: EXCERPT,
  coverImageUrl: `/blog/${SLUG}/cover.jpg`,
  body: BODY,
  hashtags: ['#international_coalition_for_h_rights', '#Sudan', '#HRC62'],
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
      location: POST.location,
      coverImageUrl: POST.coverImageUrl,
      hashtags: POST.hashtags,
      translationKey: POST.translationKey,
      excerptChars: POST.excerpt.length,
      bodyChars: POST.body.length,
      h2Count: (POST.body.match(/^## /gm) || []).length,
    });
    return;
  }

  if (UNPUBLISH) {
    if (!existing[0]) {
      console.log('Nothing to unpublish.');
      return;
    }
    await sql.query(`UPDATE "Post" SET status = 'draft', "updatedAt" = now() WHERE slug = $1 AND locale = $2`, [
      POST.slug,
      POST.locale,
    ]);
    console.log(`Unpublished: ${SLUG} [${POST.locale}] is now "draft".`);
    return;
  }

  await sql.query(
    `INSERT INTO "Post"
       (id, slug, locale, "translationKey", title, category, status, date, location, excerpt, "coverImageUrl", body, hashtags, "authorName", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,'published',$7::timestamp,$8,$9,$10,$11,$12,$13, now(), now())
     ON CONFLICT (slug, locale) DO UPDATE SET
       "translationKey" = EXCLUDED."translationKey", title = EXCLUDED.title, category = EXCLUDED.category,
       status = EXCLUDED.status, date = EXCLUDED.date, location = EXCLUDED.location, excerpt = EXCLUDED.excerpt,
       "coverImageUrl" = EXCLUDED."coverImageUrl", body = EXCLUDED.body, hashtags = EXCLUDED.hashtags,
       "authorName" = EXCLUDED."authorName", "updatedAt" = now()`,
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

  // ---- read-back assertion: prove the stored row matches the payload ----
  const check = await sql.query(
    `SELECT id, title, status, "translationKey" AS tkey, "coverImageUrl" AS cover, length(body) AS body_len
       FROM "Post" WHERE slug = $1 AND locale = $2`,
    [POST.slug, POST.locale],
  );
  const row = check[0];
  const ok =
    !!row &&
    row.title === POST.title &&
    row.status === 'published' &&
    row.tkey === POST.translationKey &&
    row.cover === POST.coverImageUrl &&
    Number(row.body_len) === POST.body.length;
  console.log(`Read-back: id=${row?.id} status=${row?.status} cover=${row?.cover} bodyLen=${row?.body_len}`);
  if (!ok) {
    console.error('ABORT: read-back verification failed — stored row does not match payload.');
    process.exit(1);
  }
  console.log(`\n✅ Published: /news/${SLUG}`);
}

// Only write when run directly; importing this module yields the content exports.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
