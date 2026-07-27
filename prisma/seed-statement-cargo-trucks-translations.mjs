// Arabic + French versions of the 16 July 2026 statement of condemnation
// ("Targeting of Commercial Cargo Trucks on the El Fasher–Al Koma Road, Sudan").
//
// Both rows reuse the SLUG and TRANSLATION_KEY exported by the English seed, so the
// three locales form ONE story for the language toggle, the hreflang alternates and
// the sitemap. Importing that module is side-effect free — its guard and its neon()
// call live inside connect(), and main() only runs under a direct-run check.
//
// RUN THE ENGLISH SEED FIRST. The final assertion below requires all three locale
// rows to exist; running this first leaves two published rows and then aborts.
//
// No GalleryImage writes: the designed statement cards carry English text and are
// attached to the English row only.
//
// Usage:
//   DRY_RUN=1  node --env-file=.env.local prisma/seed-statement-cargo-trucks-translations.mjs
//              node --env-file=.env.local prisma/seed-statement-cargo-trucks-translations.mjs
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-cargo-trucks-translations.mjs
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';

import { SLUG, TRANSLATION_KEY } from './seed-statement-cargo-trucks.mjs';

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
    console.error(
      'ABORT: DATABASE_URL is not the Neon production database.\n' +
        '       Run with: node --env-file=.env.local prisma/seed-statement-cargo-trucks-translations.mjs',
    );
    process.exit(1);
  }
  return neon(DB_URL);
}

// The sign-off is the statement's own wording, translated — matching the English row,
// which keeps the press cards' "International Coalition of Human Rights Organizations"
// rather than the site's canonical name. Same markdown rules as the English body:
// blank lines around `---`, and no blank lines between bullet items.
const AR_BODY = `يعرب التحالف الدولي لمنظمات حقوق الإنسان عن بالغ قلقه إزاء تقارير ميدانية، من بينها ما وثقه المرصد السوداني الوطني لحقوق الإنسان، تفيد باستهداف شاحنات نقل بضائع تجارية مدنية بطائرات مسيّرة على طريق الفاشر – الكومة في السودان.

وانطلاقًا من التزامنا الراسخ بالحياد وبالمعايير الدولية لحقوق الإنسان وبالمبادئ الإنسانية، ندين بأشد العبارات هذا التصعيد الخطير الذي يهدد بصورة مباشرة شرايين الحياة التي يعتمد عليها المدنيون لبقائهم.

إن الاستهداف المتعمد لقوافل الإمداد التجارية التي تنقل السلع الأساسية ليس مجرد انتهاك منفرد؛ فقد يشكل انتهاكًا جسيمًا للقانون الدولي الإنساني، ويمثل اعتداءً على أعيان مدنية لا غنى عنها لبقاء السكان المدنيين ورفاههم. ومثل هذه الأفعال تعمّق الأزمة الإنسانية، وتفاقم معاناة المدنيين، وتقوّض الجهود الرامية إلى ضمان وصول المساعدات الإنسانية وتحقيق الاستقرار الاقتصادي.

وندعو المجتمع الدولي إلى تبنّي موقف موحّد وحازم لوقف هذه الانتهاكات الجسيمة للقانون الدولي الإنساني، ولضمان حماية طرق الإمداد الحيوية للمدنيين.

وإذ نجدد التزامنا الثابت بالسلام، نكرر دعوتنا إلى وقف فوري وشامل وغير مشروط للأعمال العدائية في جميع أنحاء السودان.

وفي ضوء تدهور الأوضاع الإنسانية، ندعو بإلحاح جميع منظمات حقوق الإنسان الدولية والإقليمية والوكالات الإنسانية والجهات المعنية إلى:

- توحيد موقف واضح لا لبس فيه يطالب بإنهاء الحرب ودفع عملية سلام مستدامة وشاملة.
- تكثيف الجهود الدولية المنسقة لإنشاء آليات مساءلة فعالة قادرة على التحقيق في الانتهاكات المزعومة للقانون الدولي، وضمان محاسبة المسؤولين عنها وفقًا للمعايير القانونية المعمول بها.
- ضمان الحماية الكاملة للمدنيين، وكفالة المرور الآمن ودون عوائق للسلع التجارية والمساعدات الإنسانية والإمدادات الأساسية، بمنأى عن الهجوم أو الإعاقة أو القيود التعسفية.

إن السلام في السودان ضرورة إنسانية ملحّة. ولا يمكن للمجتمع الدولي لحقوق الإنسان أن يقبل أي محاولة لإطالة أمد النزاع، أو لاستخدام أرواح المدنيين أو سبل عيشهم أو الموارد الأساسية أدواتٍ للحرب.

---

**التحالف الدولي لمنظمات حقوق الإنسان**

جنيف، 16 يوليو 2026`;

const AR_EXCERPT =
  'يعرب التحالف عن بالغ قلقه إزاء تقارير ميدانية، من بينها ما وثقه المرصد السوداني الوطني لحقوق الإنسان، تفيد باستهداف شاحنات نقل بضائع تجارية مدنية بطائرات مسيّرة على طريق الفاشر – الكومة في السودان.';

const FR_BODY = `La Coalition internationale des organisations de défense des droits de l'homme exprime sa profonde préoccupation face à des rapports de terrain, notamment ceux documentés par l'Observatoire national soudanais des droits de l'homme, indiquant que des camions de fret commerciaux civils ont été pris pour cible par des véhicules aériens sans pilote (drones) sur la route El Fasher–Al Koma, au Soudan.

Guidés par notre attachement inébranlable à la neutralité, aux normes internationales des droits de l'homme et aux principes humanitaires, nous condamnons avec la plus grande fermeté cette dangereuse escalade, qui menace directement les voies vitales dont dépend la survie des civils.

Le ciblage délibéré de convois d'approvisionnement commerciaux transportant des biens essentiels n'est pas une violation isolée ; il peut constituer une violation grave du droit international humanitaire et représente une atteinte à des biens de caractère civil indispensables à la survie et au bien-être de la population civile. De tels actes aggravent la crise humanitaire, accentuent les souffrances des civils et compromettent les efforts visant à garantir l'accès humanitaire et la stabilité économique.

Nous appelons la communauté internationale à adopter une réponse unifiée et résolue afin de mettre fin à ces graves violations du droit international humanitaire et d'assurer la protection des voies d'approvisionnement vitales pour les civils.

Réaffirmant notre engagement constant en faveur de la paix, nous renouvelons notre appel à une cessation immédiate, globale et inconditionnelle des hostilités dans l'ensemble du Soudan.

Compte tenu de la détérioration de la situation humanitaire, nous appelons instamment l'ensemble des organisations de défense des droits de l'homme internationales et régionales, des agences humanitaires et des parties prenantes concernées à :

- Adopter une position commune, claire et sans équivoque, exigeant la fin de la guerre et l'avancement d'un processus de paix durable et inclusif.
- Intensifier les efforts internationaux coordonnés afin d'établir des mécanismes de responsabilité efficaces, capables d'enquêter sur les violations présumées du droit international et de garantir que les responsables répondent de leurs actes conformément aux normes juridiques applicables.
- Assurer la pleine protection des civils et garantir le passage sûr et sans entrave des biens commerciaux, de l'aide humanitaire et des fournitures essentielles, à l'abri de toute attaque, obstruction ou restriction arbitraire.

La paix au Soudan est une urgence humanitaire. La communauté internationale des droits de l'homme ne peut accepter aucune tentative de prolonger le conflit ni d'utiliser les vies civiles, les moyens de subsistance ou les ressources essentielles comme instruments de guerre.

---

**La Coalition internationale des organisations de défense des droits de l'homme**

Genève, le 16 juillet 2026`;

const FR_EXCERPT =
  "La Coalition exprime sa profonde préoccupation face à des rapports de terrain, notamment ceux documentés par l'Observatoire national soudanais des droits de l'homme, indiquant que des camions de fret commerciaux civils ont été pris pour cible par des drones sur la route El Fasher–Al Koma, au Soudan.";

export const LOCALES = [
  {
    locale: 'ar',
    title: 'بيان إدانة: استهداف شاحنات نقل البضائع التجارية على طريق الفاشر – الكومة في السودان',
    excerpt: AR_EXCERPT,
    body: AR_BODY,
    location: 'جنيف',
    authorName: 'إعلام ICHR',
    coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
  },
  {
    locale: 'fr',
    title:
      'Déclaration de condamnation : ciblage de camions de fret commerciaux sur la route El Fasher–Al Koma, au Soudan',
    excerpt: FR_EXCERPT,
    body: FR_BODY,
    location: 'Genève',
    authorName: 'Communication ICHR',
    coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
  },
];

const SHARED = {
  category: 'Statement',
  date: '2026-07-16',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
};

async function main() {
  const sql = connect();

  for (const v of LOCALES) {
    if (DRY_RUN) {
      console.log(`[${v.locale}] DRY_RUN — no write:`, {
        title: v.title,
        location: v.location,
        cover: v.coverImageUrl,
        translationKey: TRANSLATION_KEY,
        excerptChars: v.excerpt.length,
        bodyChars: v.body.length,
        bullets: (v.body.match(/^- /gm) || []).length,
      });
      continue;
    }

    if (UNPUBLISH) {
      await sql.query(`UPDATE "Post" SET status='draft', "updatedAt"=now() WHERE slug=$1 AND locale=$2`, [
        SLUG,
        v.locale,
      ]);
      console.log(`[${v.locale}] unpublished → draft`);
      continue;
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
        SLUG,
        v.locale,
        TRANSLATION_KEY,
        v.title,
        SHARED.category,
        SHARED.date,
        v.location,
        v.excerpt,
        v.coverImageUrl,
        v.body,
        JSON.stringify(SHARED.hashtags),
        v.authorName,
      ],
    );

    const check = await sql.query(
      `SELECT title, status, "translationKey" AS tkey, "coverImageUrl" AS cover, length(body) AS body_len
         FROM "Post" WHERE slug=$1 AND locale=$2`,
      [SLUG, v.locale],
    );
    const row = check[0];
    const ok =
      !!row &&
      row.title === v.title &&
      row.status === 'published' &&
      row.tkey === TRANSLATION_KEY &&
      row.cover === v.coverImageUrl &&
      Number(row.body_len) === v.body.length;
    console.log(`${ok ? '✅' : '❌'} [${v.locale}] status=${row?.status} cover=${row?.cover} bodyLen=${row?.body_len}`);
    if (!ok) {
      console.error(`ABORT: read-back failed for ${SLUG} [${v.locale}]`);
      process.exit(1);
    }
  }

  if (!DRY_RUN && !UNPUBLISH) {
    // All three locales must share one translationKey, or the toggle/hreflang/sitemap split the story.
    const grouped = await sql.query(
      `SELECT count(DISTINCT "translationKey")::int AS keys, count(*)::int AS rows FROM "Post" WHERE slug=$1`,
      [SLUG],
    );
    console.log(`\nStory check: ${grouped[0].rows} locale rows sharing ${grouped[0].keys} translationKey`);
    if (grouped[0].keys !== 1 || grouped[0].rows !== 3) {
      console.error(
        'ABORT: the three locales are not bound into a single story.\n' +
          '       Did prisma/seed-statement-cargo-trucks.mjs run first?',
      );
      process.exit(1);
    }
    console.log(`✅ Published: /ar/news/${SLUG} and /fr/news/${SLUG}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
