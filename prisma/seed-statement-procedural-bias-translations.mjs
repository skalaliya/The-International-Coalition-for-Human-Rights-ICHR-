// Publishes the Arabic (MSA) + French versions of the Sudan procedural-bias statement.
// Reuses the English post's SLUG and TRANSLATION_KEY so all three versions bind into a
// single story: language toggle, hreflang alternates and sitemap grouping all key off it.
//
// Writes over Neon's HTTPS serverless driver (:5432 is blocked on this network) and,
// like the English seed, never touches GalleryImage rows.
//
// Organisation names are taken verbatim from src/i18n/strings/{ar,fr}.ts so the article
// can never contradict the site's own footer.
//
// Usage:
//   DRY_RUN=1  node --env-file=.env.local prisma/seed-statement-procedural-bias-translations.mjs
//              node --env-file=.env.local prisma/seed-statement-procedural-bias-translations.mjs
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-procedural-bias-translations.mjs
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { SLUG, TRANSLATION_KEY } from './seed-statement-procedural-bias.mjs';

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

// ---------------------------------------------------------------- ARABIC (MSA)
const AR_BODY = `يتابع التحالف الدولي لحقوق الإنسان (ICHR) بقلق بالغ وباهتمام وثيق المداولات الجارية بشأن مشروع القرار المتعلق بالوضع الإنساني في مدينة الأُبيّض.

وفي حين يرحّب التحالف بكل الجهود الرامية إلى تحقيق العدالة للضحايا وحماية المدنيين، فإنه يعرب عن تحفّظاته الشديدة إزاء المنهجية الانتقائية والاختزالية التي يقوم عليها مشروع القرار. ومن ثمّ، يودّ التحالف أن يوضّح الحقائق التالية للمجتمع الدولي وللرأي العام السوداني.

## الجذر الأصلي للأزمة

يؤكّد التحالف أن السبب الجذري والمحرّك الرئيسي للأزمة الراهنة في السودان ليس مجرّد مواجهة عسكرية تقليدية بين طرفين، بل هو نتيجة مباشرة لأجندات سياسية وأيديولوجية تدفع بها الحركة الإسلامية عبر تشكيلاتها المسلحة التابعة لها، ومن بينها كتيبة البراء بن مالك، التي أحكمت فعليًا سيطرتها على القرار العسكري والسياسي داخل قيادة القوات المسلحة السودانية. ووفقًا لتقدير التحالف، فإن هذا الفصيل المهيمن قد أطال أمد النزاع عمدًا حفاظًا على قبضته على السلطة، ورفض على نحو متواصل مبادرات وقف إطلاق النار ومنصات التفاوض الإقليمية والدولية وتلك التي تقودها الولايات المتحدة، وذلك عبر فرض شروط مسبقة يتعذّر تحقيقها، مسهمًا بذلك فيما بات يمثّل أكبر أزمة نزوح وأزمة إنسانية في العالم.

## الانتقائية تقوّض نزاهة العدالة

يشدّد التحالف كذلك على أن حصر الإدانة وتوثيق الانتهاكات في نطاق جغرافي واحد، هو مدينة الأُبيّض، يمثّل إخفاقًا جوهريًا في التمسّك بمبادئ العدالة النزيهة. فمشروع القرار يغفل تمامًا الفظائع الجسيمة والمستمرة المرتكبة في مناطق وولايات أخرى من السودان، من بينها دارفور وكردفان والنيل الأزرق. ويشمل ذلك، في أحدث تجلياته، الأحداث الدامية التي وقعت في كُلبس بغرب دارفور في 29 يونيو 2026، وأسفرت عن سقوط عدد كبير من الضحايا المدنيين، من بينهم أطفال.

كما يلاحظ التحالف بقلق أن مشروع القرار يبدو معتمدًا في المقام الأول على تقارير صادرة عن آليات دولية لم تتمكّن من الوصول الفعّال إلى المناطق المتضررة بسبب القيود التي تفرضها سلطات الأمر الواقع في بورتسودان.

## الشرعية وموقف الاتحاد الأفريقي

ويلفت التحالف الانتباه أيضًا إلى إشكالية قانونية وإجرائية خطيرة تنشأ عن قرار منح سلطات الأمر الواقع العسكرية في بورتسودان وصولًا حصريًا إلى منابر الأمم المتحدة لترويج سردية أحادية، في تجاهل لموقف الاتحاد الأفريقي الذي أبقى على تعليق عضوية السودان منذ 27 أكتوبر 2021 عقب الانقلاب العسكري غير الدستوري على الحكومة المدنية. ومنح هذه السلطة شرعية دبلوماسية دولية ينطوي على خطر تعزيز تعنّتها وزيادة تقويض جهود السلام وعمليات التفاوض الجارية.

## قضايا غائبة عن جدول أعمال المجلس

يعرب التحالف عن قلقه البالغ إزاء غياب عدد من المسائل ذات الخطورة الاستثنائية عن جدول أعمال مجلس حقوق الإنسان. ويدعو إلى فتح تحقيق دولي مستقل وعاجل في:

- الادعاءات الموثّقة بشأن استخدام القوات المسلحة السودانية أسلحة كيميائية محظورة دوليًا؛
- القصف الجوي العشوائي للمدنيين والبنية التحتية المدنية بذريعة استهداف ما يُزعم أنها قواعد حاضنة اجتماعية؛
- عرقلة عمليات الإغاثة الإنسانية، بما في ذلك قوافل برنامج الأغذية العالمي؛
- التورّط المُبلّغ عنه لجماعات مسلحة أجنبية عابرة للحدود، من بينها قوات السيليكا القادمة من جمهورية أفريقيا الوسطى.

## مطالب التحالف

وفي ضوء ما تقدّم، يدعو التحالف الدولي لحقوق الإنسان إلى ما يلي:

1. **قرار شامل ومتوازن.** ينبغي تنقيح مشروع القرار بما يكفل أن يكون شاملًا ومتوازنًا ومعبّرًا عن النطاق الكامل لانتهاكات حقوق الإنسان المرتكبة في جميع مناطق السودان، دون انتقائية جغرافية أو معالجة جزئية.

2. **تحقيق دولي مستقل.** ينبغي إنشاء تحقيق دولي مستقل في الادعاءات المتعلقة باستخدام الأسلحة الكيميائية والاستهداف المتعمّد للمدنيين على أسس عرقية وجغرافية.

3. **موقف مبدئي من الشرعية.** ينبغي للمجتمع الدولي أن يتبنّى موقفًا مبدئيًا يتسق مع قرارات الاتحاد الأفريقي، بالامتناع عن الاعتراف بشرعية السلطات العسكرية التي أُقيمت عقب الانقلاب في بورتسودان، بما يحول دون إساءة استخدام المحافل الدولية لتبرير استمرار النزاع المسلح.

---

**التحالف الدولي لحقوق الإنسان (ICHR)**

جنيف، 09 يوليو 2026`;

const AR_EXCERPT =
  'يرحّب التحالف بالجهود الرامية إلى إنصاف الضحايا، لكنه يحذّر من أن مشروع القرار، المحصور في مدينة الأُبيّض، يقوم على منهجية انتقائية تغفل انتهاكات جسيمة في دارفور وكردفان والنيل الأزرق. ويدعو إلى قرار شامل وإلى تحقيق دولي مستقل في الاستخدام المزعوم للأسلحة الكيميائية.';

// ---------------------------------------------------------------- FRENCH
const FR_BODY = `La Coalition internationale pour les droits de l'homme (ICHR) suit avec une profonde préoccupation et une vigilance particulière les délibérations en cours concernant le projet de résolution relatif à la situation humanitaire dans la ville d'El Obeid.

Si la Coalition salue tous les efforts visant à rendre justice aux victimes et à protéger les civils, elle exprime de vives réserves quant à la méthodologie sélective et réductrice qui sous-tend ce projet de résolution. La Coalition souhaite dès lors porter les faits suivants à la connaissance de la communauté internationale et de l'opinion publique soudanaise.

## L'origine profonde de la crise

La Coalition affirme que la cause première et le principal moteur de la crise actuelle au Soudan ne résident pas dans un simple affrontement militaire classique entre deux parties. Il s'agit au contraire de la conséquence directe d'agendas politiques et idéologiques portés par le Mouvement islamique par l'intermédiaire des formations armées qui lui sont affiliées, dont la brigade Al-Baraa ibn Malik, laquelle a de fait pris le contrôle de la décision militaire et politique au sein du commandement des Forces armées soudanaises. Selon l'analyse de la Coalition, cette faction dominante a délibérément prolongé le conflit afin de préserver son emprise sur le pouvoir et a constamment rejeté les initiatives de cessez-le-feu et les plateformes de négociation régionales, internationales et conduites par les États-Unis, en imposant des conditions préalables inatteignables, contribuant ainsi à ce qui est devenu la plus grave crise de déplacement et la plus grande crise humanitaire au monde.

## La sélectivité porte atteinte à l'impartialité de la justice

La Coalition souligne en outre que limiter la condamnation et la documentation des violations à une seule zone géographique, à savoir la ville d'El Obeid, constitue un manquement fondamental aux principes d'une justice impartiale. Le projet de résolution passe totalement sous silence les atrocités graves et persistantes commises dans d'autres régions et États du Soudan, notamment au Darfour, au Kordofan et au Nil Bleu. Il en va ainsi, tout récemment, des événements meurtriers survenus à Koulbous, au Darfour occidental, le 29 juin 2026, qui ont fait de nombreuses victimes civiles, parmi lesquelles des enfants.

La Coalition relève également avec préoccupation que le projet de résolution semble s'appuyer principalement sur des rapports établis par des mécanismes internationaux qui n'ont pu accéder effectivement aux zones touchées, en raison des restrictions imposées par les autorités de fait établies à Port-Soudan.

## La légitimité et la position de l'Union africaine

La Coalition attire par ailleurs l'attention sur une grave préoccupation juridique et procédurale née de la décision d'accorder aux autorités militaires de fait de Port-Soudan un accès exclusif aux tribunes des Nations Unies pour y promouvoir un récit unilatéral, au mépris de la position de l'Union africaine, qui maintient la suspension du Soudan depuis le 27 octobre 2021, à la suite du coup d'État militaire inconstitutionnel contre le gouvernement dirigé par des civils. Conférer à cette autorité une légitimité diplomatique internationale risque de renforcer son intransigeance et de compromettre davantage les efforts de paix et les processus de négociation en cours.

## Les questions absentes de l'ordre du jour du Conseil

La Coalition exprime sa vive préoccupation face à l'absence, à l'ordre du jour du Conseil des droits de l'homme, de plusieurs questions d'une exceptionnelle gravité. Elle appelle à l'ouverture d'une enquête internationale indépendante et urgente sur :

- les allégations documentées concernant l'emploi, par les Forces armées soudanaises, d'armes chimiques prohibées au niveau international ;
- les bombardements aériens indiscriminés visant des civils et des infrastructures civiles, sous prétexte de cibler de prétendues bases de soutien social ;
- l'entrave aux opérations de secours humanitaire, y compris aux convois du Programme alimentaire mondial ;
- l'implication signalée de groupes armés étrangers transfrontaliers, dont les forces de la Séléka venues de la République centrafricaine.

## Les demandes de la Coalition

Au vu de ce qui précède, la Coalition internationale pour les droits de l'homme demande :

1. **Une résolution globale et équilibrée.** Le projet de résolution devrait être révisé afin d'être global, équilibré et de refléter l'ensemble des violations des droits de l'homme commises dans toutes les régions du Soudan, sans sélectivité géographique ni traitement partiel.

2. **Une enquête internationale indépendante.** Une enquête internationale indépendante devrait être établie sur les allégations relatives à l'emploi d'armes chimiques et au ciblage délibéré de civils sur des fondements ethniques et géographiques.

3. **Une position de principe sur la légitimité.** La communauté internationale devrait adopter une position de principe conforme aux décisions de l'Union africaine, en s'abstenant de reconnaître la légitimité des autorités militaires établies à la suite du coup d'État à Port-Soudan, empêchant ainsi l'instrumentalisation des enceintes internationales pour justifier la poursuite du conflit armé.

---

**La Coalition internationale pour les droits de l'homme (ICHR)**

Genève, le 9 juillet 2026`;

const FR_EXCERPT =
  "La Coalition salue les efforts visant à rendre justice aux victimes, mais met en garde contre le projet de résolution : circonscrit à la ville d'El Obeid, il repose sur une méthodologie sélective qui passe sous silence de graves violations au Darfour, au Kordofan et au Nil Bleu. Elle appelle à une résolution globale et à une enquête internationale indépendante sur l'emploi allégué d'armes chimiques.";

export const LOCALES = [
  {
    locale: 'ar',
    title: 'بشأن الانحياز الإجرائي والانتقائية في التعامل مع انتهاكات حقوق الإنسان في السودان',
    excerpt: AR_EXCERPT,
    body: AR_BODY,
    location: 'جنيف',
    authorName: 'إعلام ICHR',
    coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
  },
  {
    locale: 'fr',
    title: "Sur la partialité procédurale et le traitement sélectif des violations des droits de l'homme au Soudan",
    excerpt: FR_EXCERPT,
    body: FR_BODY,
    location: 'Genève',
    authorName: 'Communication ICHR',
    coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
  },
];

const SHARED = {
  category: 'Statement',
  date: '2026-07-09',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
};

async function main() {
  const sql = connect();

  for (const v of LOCALES) {
    if (DRY_RUN) {
      console.log(`[${v.locale}] DRY_RUN — no write:`, {
        title: v.title.slice(0, 48) + '…',
        location: v.location,
        cover: v.coverImageUrl,
        translationKey: TRANSLATION_KEY,
        excerptChars: v.excerpt.length,
        bodyChars: v.body.length,
        h2Count: (v.body.match(/^## /gm) || []).length,
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
      console.error('ABORT: the three locales are not bound into a single story.');
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
