// "The International Coalition for Human Rights Welcomes the Firm Position of the United
//  States Administration and Calls for Full Accountability for Alleged Chemical Weapons
//  Use in Sudan" — Geneva, 28 July 2026. Source: press/press-4/.
//
// One file, three locales. The mechanism lives in prisma/lib/press-statement.mjs.
//
// Usage:
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-chemical-weapons-accountability.mjs
//               node --env-file=.env.local prisma/seed-statement-chemical-weapons-accountability.mjs   # DRAFT
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-chemical-weapons-accountability.mjs   # live
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-chemical-weapons-accountability.mjs
//
// Covers: node scripts/gen-press-cover.mjs prisma/seed-statement-chemical-weapons-accountability.mjs
// Variants: node scripts/gen-image-variants.mjs chemical-weapons-accountability-sudan-july-2026
//
// EDITORIAL NOTES:
//  - Body is the supplied text VERBATIM. Every hedge is load-bearing here and preserved:
//    the statement says "alleged" use and "should credible and independent investigations
//    establish responsibility" — it welcomes a position and calls for accountability, it
//    does not itself attribute the act.
//  - The contact block (website/email/WhatsApp) is dropped from the body, as with press-2
//    and press-3: it is in the site footer and on /contact, and card 3 still carries it.
//    The sign-off and tagline are kept.
//  - Dateline Geneva, printed on the card itself. The source RTF reads "Geneva,28July
//    2026" (missing spaces); that is a typing artifact in the note, not the statement.
//  - press/press-4 also contains three WhatsApp re-compressions of the same three cards
//    (1600px vs 2000px) and a PDF that is just the three cards. The 2000px originals are
//    used; the PDF is not hosted because it carries nothing the gallery does not.
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'chemical-weapons-accountability-sudan-july-2026';
// Minted once for this story. NEVER regenerate.
export const TRANSLATION_KEY = '64df54bd-955f-4ea7-b719-18fef4f05bea';

const EN_BODY = `The International Coalition for Human Rights welcomes the firm stance taken by the United States Administration in response to the grave allegations concerning the use of chemical weapons in the ongoing armed conflict in Sudan. The Coalition considers any alleged use of chemical weapons to constitute one of the most serious violations of international humanitarian law and international human rights law.

The Coalition supports decisive international measures, including targeted sanctions against those found responsible, should credible and independent investigations establish responsibility for the use of chemical weapons. Such actions are essential to uphold the global prohibition against chemical weapons and to reinforce the principle that impunity for atrocity crimes cannot be tolerated.

The International Coalition for Human Rights calls upon all parties to the conflict to fully comply with their obligations under international humanitarian law, including the protection of civilians and the absolute prohibition of the use of chemical weapons under international law.

The Coalition further urges the international community, the United Nations, and relevant international accountability mechanisms to ensure prompt, independent, impartial, and transparent investigations into all allegations of chemical weapons use and other serious violations committed during the conflict in Sudan. Those responsible must be held accountable through appropriate legal mechanisms consistent with international law.

The people of Sudan deserve justice, protection, and lasting peace. The international community must act collectively to prevent further atrocities, protect civilians, and ensure that those responsible for grave violations of international law are brought to justice.

---

**THE INTERNATIONAL COALITION FOR HUMAN RIGHTS**

Advancing Human Rights • Peace • Justice

Geneva, 28 July 2026`;

const EN_EXCERPT =
  'The Coalition welcomes the firm stance taken by the United States Administration on the grave allegations of chemical weapons use in Sudan, supports targeted sanctions should credible and independent investigations establish responsibility, and urges prompt, impartial investigations into all allegations committed during the conflict.';

const AR_BODY = `يرحّب التحالف الدولي لحقوق الإنسان بالموقف الحازم الذي اتخذته إدارة الولايات المتحدة ردًا على الادعاءات الخطيرة المتعلقة باستخدام أسلحة كيميائية في النزاع المسلح الدائر في السودان. ويعتبر التحالف أن أي استخدام مزعوم للأسلحة الكيميائية يشكّل واحدًا من أخطر انتهاكات القانون الدولي الإنساني والقانون الدولي لحقوق الإنسان.

ويؤيد التحالف اتخاذ تدابير دولية حاسمة، بما في ذلك فرض عقوبات محددة الأهداف على من تثبت مسؤوليتهم، إذا أثبتت تحقيقات موثوقة ومستقلة المسؤولية عن استخدام الأسلحة الكيميائية. وهذه الإجراءات ضرورية لصون الحظر العالمي للأسلحة الكيميائية، ولترسيخ مبدأ عدم جواز التسامح مع الإفلات من العقاب على الجرائم الفظيعة.

ويدعو التحالف الدولي لحقوق الإنسان جميع أطراف النزاع إلى الامتثال الكامل لالتزاماتها بموجب القانون الدولي الإنساني، بما في ذلك حماية المدنيين والحظر المطلق لاستخدام الأسلحة الكيميائية بموجب القانون الدولي.

كما يحثّ التحالف المجتمع الدولي والأمم المتحدة وآليات المساءلة الدولية ذات الصلة على ضمان إجراء تحقيقات عاجلة ومستقلة ونزيهة وشفافة في جميع ادعاءات استخدام الأسلحة الكيميائية وغيرها من الانتهاكات الجسيمة المرتكبة خلال النزاع في السودان. ويجب محاسبة المسؤولين عنها عبر الآليات القانونية المناسبة بما يتفق مع القانون الدولي.

إن شعب السودان يستحق العدالة والحماية والسلام الدائم. وعلى المجتمع الدولي أن يتحرك بشكل جماعي لمنع وقوع مزيد من الفظائع، ولحماية المدنيين، ولضمان تقديم المسؤولين عن الانتهاكات الجسيمة للقانون الدولي إلى العدالة.

---

**التحالف الدولي لحقوق الإنسان**

النهوض بحقوق الإنسان • السلام • العدالة

جنيف، 28 يوليو 2026`;

const AR_EXCERPT =
  'يرحّب التحالف بالموقف الحازم لإدارة الولايات المتحدة إزاء الادعاءات الخطيرة باستخدام أسلحة كيميائية في السودان، ويؤيد فرض عقوبات محددة الأهداف إذا أثبتت تحقيقات موثوقة ومستقلة المسؤولية، ويحثّ على تحقيقات عاجلة ونزيهة في جميع الانتهاكات المرتكبة خلال النزاع.';

const FR_BODY = `La Coalition internationale pour les droits de l'homme salue la position ferme adoptée par l'Administration des États-Unis face aux graves allégations concernant l'emploi d'armes chimiques dans le conflit armé en cours au Soudan. La Coalition considère que tout emploi allégué d'armes chimiques constitue l'une des violations les plus graves du droit international humanitaire et du droit international des droits de l'homme.

La Coalition soutient l'adoption de mesures internationales décisives, y compris des sanctions ciblées contre les personnes dont la responsabilité serait établie, si des enquêtes crédibles et indépendantes établissent la responsabilité de l'emploi d'armes chimiques. De telles mesures sont essentielles pour faire respecter l'interdiction mondiale des armes chimiques et pour réaffirmer le principe selon lequel l'impunité pour les crimes d'atrocité ne saurait être tolérée.

La Coalition internationale pour les droits de l'homme appelle toutes les parties au conflit à respecter pleinement leurs obligations au titre du droit international humanitaire, y compris la protection des civils et l'interdiction absolue de l'emploi d'armes chimiques en droit international.

La Coalition exhorte en outre la communauté internationale, l'Organisation des Nations Unies et les mécanismes internationaux de responsabilité compétents à garantir des enquêtes rapides, indépendantes, impartiales et transparentes sur toutes les allégations d'emploi d'armes chimiques et sur les autres violations graves commises pendant le conflit au Soudan. Les responsables doivent répondre de leurs actes devant les mécanismes juridiques appropriés, conformément au droit international.

Le peuple soudanais mérite la justice, la protection et une paix durable. La communauté internationale doit agir collectivement pour prévenir de nouvelles atrocités, protéger les civils et veiller à ce que les responsables de violations graves du droit international soient traduits en justice.

---

**LA COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME**

Promouvoir les droits de l'homme • La paix • La justice

Genève, le 28 juillet 2026`;

const FR_EXCERPT =
  "La Coalition salue la position ferme de l'Administration des États-Unis face aux graves allégations d'emploi d'armes chimiques au Soudan, soutient des sanctions ciblées si des enquêtes crédibles et indépendantes établissent la responsabilité, et exhorte à des enquêtes rapides et impartiales sur toutes les violations commises pendant le conflit.";

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Statement',
  date: '2026-07-28',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
  locales: [
    {
      locale: 'en',
      title:
        'ICHR Welcomes the Firm Position of the United States Administration and Calls for Full Accountability for Alleged Chemical Weapons Use in Sudan',
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: 'Geneva',
      authorName: 'ICHR Communications',
      coverImageUrl: `/blog/${SLUG}/cover.jpg`,
      // The designed cards carry English text, so they hang off the English row only.
      gallery: [
        {
          url: `/blog/${SLUG}/card-1.jpg`,
          caption:
            'Statement card 1 of 2: the Coalition welcomes the United States Administration’s stance, supports targeted sanctions where responsibility is established, and calls on all parties to comply with international humanitarian law.',
          order: 0,
        },
        {
          url: `/blog/${SLUG}/card-2.jpg`,
          caption:
            'Statement card 2 of 2: the call for prompt, independent, impartial and transparent investigations into all allegations of chemical weapons use, and for those responsible to be held accountable under international law.',
          order: 1,
        },
      ],
    },
    {
      locale: 'ar',
      title: 'التحالف الدولي لحقوق الإنسان يرحّب بالموقف الحازم لإدارة الولايات المتحدة ويدعو إلى مساءلة كاملة عن الاستخدام المزعوم للأسلحة الكيميائية في السودان',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'جنيف',
      authorName: 'إعلام ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
    },
    {
      locale: 'fr',
      title:
        "L'ICHR salue la position ferme de l'Administration des États-Unis et appelle à une pleine responsabilité pour l'emploi allégué d'armes chimiques au Soudan",
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Genève',
      authorName: 'Communication ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
    },
  ],
};

// No `en` entry: English uses the supplied photo card (U1 → cover.jpg). An `en` entry
// here would emit the same filename and overwrite it.
export const COVERS = {
  fr: {
    file: 'cover-fr.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: "COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME",
    eyebrow: 'DÉCLARATION',
    headline: ['Armes chimiques au Soudan :', "l'ICHR salue la position", 'américaine et appelle à', 'une pleine responsabilité'],
    headSize: 52,
    headLh: 72,
    headTop: 452,
    standfirst: ['Déclaration sur la situation au Soudan'],
    city: 'Genève',
    date: '28 JUILLET 2026',
    chipW: 300,
  },
  ar: {
    file: 'cover-ar.jpg',
    rtl: true,
    font: "'Geeza Pro', 'Al Bayan', sans-serif",
    org: 'التحالف الدولي لحقوق الإنسان',
    eyebrow: 'بيان',
    headline: ['الأسلحة الكيميائية في السودان:', 'ترحيب بالموقف الأمريكي', 'ودعوة إلى مساءلة كاملة'],
    headSize: 56,
    headLh: 88,
    headTop: 468,
    standfirst: ['بيان بشأن الوضع في السودان'],
    city: 'جنيف',
    date: '28 يوليو 2026',
    chipW: 240,
  },
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
