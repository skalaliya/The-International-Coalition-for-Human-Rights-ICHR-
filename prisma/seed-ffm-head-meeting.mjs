// New trilingual press release:
// "Head of the UN Fact-Finding Mission Meets with a Representative of the
//  International Coalition for Human Rights in Geneva."
//
// Creates the EN original + AR + FR translations, all linked by ONE shared
// translationKey so the article language switcher ties them together. Published.
// Idempotent: upsert by (slug, locale) over Neon's HTTPS serverless driver
// (port 443), then rebuild the gallery rows so re-runs never duplicate.
//
//   node --env-file=.env.local prisma/seed-ffm-head-meeting.mjs
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-ffm-head-meeting.mjs  # validate only
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-ffm-head-meeting.mjs  # set status=draft
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const SLUG = 'ffm-head-meets-ichr-representative-geneva-june-2026';
// One key shared by all three locales — this is what links the translation group.
const TRANSLATION_KEY = 'ffm-head-ichr-geneva-2026-06';
const DATE = '2026-06-29';
const CATEGORY = 'Press Release';
const COVER_IMAGE_URL = `/blog/${SLUG}/cover.jpg`;
const HASHTAGS = ['#international_coalition_for_h_rights'];
const GALLERY_URLS = [`/blog/${SLUG}/F1.jpg`, `/blog/${SLUG}/F2.jpg`];

const DRY_RUN = process.env.DRY_RUN === '1';
const UNPUBLISH = process.env.UNPUBLISH === '1';

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.\n  Run: node --env-file=.env.local prisma/seed-ffm-head-meeting.mjs');
  process.exit(1);
}
const sql = neon(DB_URL);

// ───────────────────────────── English (original) ─────────────────────────────
const EN = {
  locale: 'en',
  location: 'Geneva',
  authorName: 'ICHR Communications',
  title:
    'Head of the UN Fact-Finding Mission Meets with a Representative of the International Coalition for Human Rights in Geneva',
  excerpt:
    'In Geneva, Mr. Mohamed Chande Othman, Head of the United Nations Independent International Fact-Finding Mission, held a bilateral meeting with a representative of the International Coalition for Human Rights to strengthen joint coordination, deepen cooperation on the monitoring and protection of human rights, and advance the protection of civilians in conflict-affected areas.',
  body: `*Geneva, Switzerland — June 2026.*

The Head of the United Nations Independent International Fact-Finding Mission, Mr. Mohamed Chande Othman, held a bilateral meeting with a representative of the International Coalition for Human Rights in Geneva, Switzerland. The meeting focused on strengthening mechanisms for joint coordination and enhancing cooperation in the monitoring and protection of human rights.

## Activating Continuous Coordination and Direct Communication

Discussions centered on several key issues, foremost among them exploring ways to activate continuous coordination channels and improve direct communication between the parties. Both sides examined practical steps to ensure that information, expertise, and field observations can be shared swiftly and reliably in support of independent human rights work.

## Complementary Roles of UN Mechanisms and Civil Society

The meeting underscored a shared commitment to strengthening partnerships and complementing the roles of official United Nations mechanisms and international civil society organizations, recognizing them as essential pillars for ensuring accountability and upholding the rule of law. Both sides reaffirmed that coordinated engagement between them reinforces the credibility and reach of international human rights protection.

## Protecting Civilians in Conflict-Affected Areas

The two sides also reviewed the most pressing humanitarian crises and urgent international issues, with particular emphasis on identifying effective mechanisms and solutions to ensure the protection of civilians in areas affected by conflict and instability. The discussion highlighted the need for timely, principled, and victim-centred responses to violations wherever they occur.

## Sustained Engagement at the United Nations in Geneva

This meeting forms part of the ongoing human rights engagement within the United Nations in Geneva, aimed at mobilizing international support for fact-finding missions and enabling them to carry out their field mandates in accordance with independent international standards.

**The International Coalition for Human Rights**`,
};

// ──────────────── Arabic (Modern Standard Arabic — formal register) ────────────────
const AR = {
  locale: 'ar',
  location: 'جنيف',
  authorName: 'إعلام ICHR',
  title:
    'رئيس بعثة تقصّي الحقائق الأممية يجتمع مع ممثّل التحالف الدولي لحقوق الإنسان في جنيف',
  excerpt:
    'في جنيف، عقد السيد محمد شاندي عثمان، رئيس بعثة الأمم المتحدة الدولية المستقلة لتقصّي الحقائق، اجتماعاً ثنائياً مع ممثّل التحالف الدولي لحقوق الإنسان، بهدف تعزيز آليات التنسيق المشترك، وتعميق التعاون في رصد حقوق الإنسان وحمايتها، والنهوض بحماية المدنيين في المناطق المتأثرة بالنزاع.',
  body: `*جنيف، سويسرا — حزيران/يونيو 2026.*

عقد السيد محمد شاندي عثمان، رئيس بعثة الأمم المتحدة الدولية المستقلة لتقصّي الحقائق، اجتماعاً ثنائياً مع ممثّل التحالف الدولي لحقوق الإنسان في جنيف بسويسرا. وتركّز الاجتماع على تعزيز آليات التنسيق المشترك ودعم التعاون في مجال رصد حقوق الإنسان وحمايتها.

## تفعيل قنوات التنسيق المستمر والتواصل المباشر

تمحورت المباحثات حول عدد من القضايا الرئيسية، يأتي في مقدّمتها استكشاف سبل تفعيل قنوات التنسيق المستمر وتحسين التواصل المباشر بين الطرفين. واستعرض الجانبان خطوات عملية تكفل تبادل المعلومات والخبرات والملاحظات الميدانية بسرعة وموثوقية دعماً للعمل المستقل في مجال حقوق الإنسان.

## تكامل أدوار آليات الأمم المتحدة ومنظمات المجتمع المدني

أكّد الاجتماع الالتزام المشترك بتعزيز الشراكات وتكامل أدوار آليات الأمم المتحدة الرسمية ومنظمات المجتمع المدني الدولية، باعتبارها ركائز أساسية لضمان المساءلة وصون سيادة القانون. وشدّد الطرفان على أنّ التنسيق المنسجم بينهما يعزّز مصداقية حماية حقوق الإنسان على الصعيد الدولي ويوسّع نطاقها.

## حماية المدنيين في المناطق المتأثرة بالنزاع

استعرض الجانبان أبرز الأزمات الإنسانية والقضايا الدولية المُلحّة، مع تركيز خاص على تحديد الآليات والحلول الفعّالة التي تكفل حماية المدنيين في المناطق المتأثرة بالنزاع وعدم الاستقرار. وأبرزت المناقشة الحاجة إلى استجابات سريعة ومبدئية تتمحور حول الضحايا إزاء الانتهاكات أينما وقعت.

## انخراط مستدام في إطار الأمم المتحدة بجنيف

يندرج هذا الاجتماع ضمن الانخراط الحقوقي المستمر في إطار الأمم المتحدة بجنيف، الهادف إلى حشد الدعم الدولي لبعثات تقصّي الحقائق وتمكينها من الاضطلاع بولاياتها الميدانية وفقاً للمعايير الدولية المستقلة.

**التحالف الدولي لحقوق الإنسان**`,
};

// ─────────────────────────── French (formal register) ───────────────────────────
const FR = {
  locale: 'fr',
  location: 'Genève',
  authorName: 'Communication ICHR',
  title:
    'Le chef de la Mission d’établissement des faits des Nations Unies rencontre un représentant de la Coalition internationale pour les droits de l’homme à Genève',
  excerpt:
    'À Genève, M. Mohamed Chande Othman, chef de la Mission internationale indépendante d’établissement des faits des Nations Unies, a tenu une réunion bilatérale avec un représentant de la Coalition internationale pour les droits de l’homme afin de renforcer la coordination conjointe, d’approfondir la coopération en matière de surveillance et de protection des droits de l’homme et de faire progresser la protection des civils dans les zones touchées par les conflits.',
  body: `*Genève, Suisse — juin 2026.*

M. Mohamed Chande Othman, chef de la Mission internationale indépendante d’établissement des faits des Nations Unies, a tenu une réunion bilatérale avec un représentant de la Coalition internationale pour les droits de l’homme à Genève, en Suisse. La réunion a porté sur le renforcement des mécanismes de coordination conjointe et l’approfondissement de la coopération en matière de surveillance et de protection des droits de l’homme.

## Activer une coordination continue et une communication directe

Les discussions ont porté sur plusieurs questions essentielles, au premier rang desquelles l’exploration des moyens d’activer des canaux de coordination continue et d’améliorer la communication directe entre les parties. Les deux parties ont examiné des mesures concrètes propres à garantir un partage rapide et fiable des informations, des expertises et des observations de terrain, au service d’un travail indépendant en faveur des droits de l’homme.

## La complémentarité des mécanismes onusiens et de la société civile

La réunion a souligné l’engagement commun à renforcer les partenariats et à assurer la complémentarité des rôles des mécanismes officiels des Nations Unies et des organisations internationales de la société civile, reconnus comme des piliers essentiels pour garantir la responsabilisation et faire respecter l’état de droit. Les parties ont réaffirmé qu’une coopération coordonnée entre elles renforce la crédibilité et la portée de la protection internationale des droits de l’homme.

## Protéger les civils dans les zones touchées par les conflits

Les deux parties ont également passé en revue les crises humanitaires les plus pressantes et les questions internationales urgentes, en mettant particulièrement l’accent sur l’identification de mécanismes et de solutions efficaces pour assurer la protection des civils dans les zones touchées par les conflits et l’instabilité. Les échanges ont mis en évidence la nécessité de réponses rapides, fondées sur des principes et centrées sur les victimes, face aux violations où qu’elles se produisent.

## Un engagement durable au sein des Nations Unies à Genève

Cette réunion s’inscrit dans le cadre de l’engagement continu en faveur des droits de l’homme au sein des Nations Unies à Genève, visant à mobiliser le soutien international en faveur des missions d’établissement des faits et à leur permettre de s’acquitter de leurs mandats sur le terrain conformément aux normes internationales indépendantes.

**Coalition internationale pour les droits de l’homme**`,
};

const LOCALES = [EN, AR, FR];

async function publishLocale(v) {
  const id = randomUUID();
  const status = UNPUBLISH ? 'draft' : 'published';

  if (DRY_RUN) {
    console.log(
      `DRY_RUN [${v.locale}] title="${v.title.slice(0, 56)}…" bodyChars=${v.body.length} status=${status}`,
    );
    return;
  }

  const upserted = await sql.query(
    `INSERT INTO "Post"
       (id, slug, locale, "translationKey", title, category, status, date, location, excerpt, "coverImageUrl", body, hashtags, "authorName", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::timestamp,$9,$10,$11,$12,$13,$14, now(), now())
     ON CONFLICT (slug, locale) DO UPDATE SET
       "translationKey" = EXCLUDED."translationKey", title = EXCLUDED.title, category = EXCLUDED.category,
       status = EXCLUDED.status, date = EXCLUDED.date, location = EXCLUDED.location, excerpt = EXCLUDED.excerpt,
       "coverImageUrl" = EXCLUDED."coverImageUrl", body = EXCLUDED.body, hashtags = EXCLUDED.hashtags,
       "authorName" = EXCLUDED."authorName", "updatedAt" = now()
     RETURNING id`,
    [
      id, SLUG, v.locale, TRANSLATION_KEY, v.title, CATEGORY, status, DATE,
      v.location, v.excerpt, COVER_IMAGE_URL, v.body, JSON.stringify(HASHTAGS), v.authorName,
    ],
  );
  const postId = upserted[0].id;

  await sql.query(`DELETE FROM "GalleryImage" WHERE "postId" = $1`, [postId]);
  for (let i = 0; i < GALLERY_URLS.length; i++) {
    await sql.query(
      `INSERT INTO "GalleryImage" (id, url, caption, "order", "postId") VALUES ($1,$2,$3,$4,$5)`,
      [randomUUID(), GALLERY_URLS[i], null, i, postId],
    );
  }

  const chk = await sql.query(
    `SELECT title, "translationKey" AS tkey, status FROM "Post" WHERE slug = $1 AND locale = $2`,
    [SLUG, v.locale],
  );
  const gc = await sql.query(`SELECT count(*)::int AS c FROM "GalleryImage" WHERE "postId" = $1`, [postId]);
  const ok =
    chk[0] && chk[0].title === v.title && chk[0].tkey === TRANSLATION_KEY && gc[0].c === GALLERY_URLS.length;
  const prefix = v.locale === 'en' ? '' : `/${v.locale}`;
  console.log(
    `${ok ? '✅' : '❌'} [${v.locale}] status=${chk[0]?.status} gallery=${gc[0]?.c}/${GALLERY_URLS.length} → ${prefix}/news/${SLUG}`,
  );
  if (!ok) {
    console.error(`ABORT: read-back failed for ${SLUG} [${v.locale}]`);
    process.exit(1);
  }
}

async function main() {
  for (const v of LOCALES) await publishLocale(v);
  if (!DRY_RUN) console.log('\n✅ Trilingual press release published (EN + AR + FR).');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
