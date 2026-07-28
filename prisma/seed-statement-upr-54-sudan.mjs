// "UN UPR 54th Session: On Procedural Bias and the Selective Treatment of Human
//  Rights Violations in Sudan" — Geneva, 22 July 2026. Source: press/press-3/.
//
// One file, three locales. The mechanism lives in prisma/lib/press-statement.mjs.
//
// Usage:
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-upr-54-sudan.mjs   # validate only
//               node --env-file=.env.local prisma/seed-statement-upr-54-sudan.mjs   # write as DRAFT
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-upr-54-sudan.mjs   # take it live
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-upr-54-sudan.mjs   # draft all 3 locales
//
// Covers: node scripts/gen-press-cover.mjs prisma/seed-statement-upr-54-sudan.mjs
//
// EDITORIAL NOTES (agreed with the user before publishing):
//  - The source is a 10-page formal UPR joint stakeholder submission (~6,000 words,
//    38 numbered paragraphs, UN document citations). The article is an ANNOUNCEMENT of
//    it, not a reproduction: the full document ships as the gallery (all 10 pages) and
//    as a downloadable PDF. Reproducing citation-heavy legal text in three languages
//    risks mistranslating recommendation numbers and treaty names.
//  - Byline follows the DOCUMENT TEXT verbatim: "International Coalition of Human Rights
//    Organizations (ICHRO) and Omnium des Libertés (ODL)". Note that the acronym in the
//    document (ICHRO) differs from the site's own (ICHR), and that the logo strip on all
//    ten pages shows CAP Freedom of Conscience rather than ODL. Both flagged; the text
//    wins, per the user's decision.
//  - Dateline Geneva: the UPR Working Group sits in Geneva. The document itself carries
//    only the date, 22 July 2026.
//  - The source PDF ends mid-list — section IX recommendation 9 opens with "(a)" on
//    page 10 and stops. The article therefore summarizes the nine recommendation
//    headings rather than reproducing an incomplete final list.
//  - Every "reported" / "alleged" hedge in the source is preserved, in all three
//    languages: the submission attributes conduct to named parties.
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'upr-54th-session-procedural-bias-sudan-july-2026';
// Minted once for this story. NEVER regenerate.
export const TRANSLATION_KEY = '14538685-5b77-4445-9ba7-3042b6ab6c5a';

const PDF_URL = `https://www.ichr-international.org/blog/${SLUG}/upr-54-joint-submission.pdf`;

const EN_BODY = `The International Coalition of Human Rights Organizations (ICHRO) and Omnium des Libertés (ODL) have filed a joint stakeholder submission to the Working Group on the Universal Periodic Review ahead of its Fifty-Fourth Session (January–February 2027), for the fourth-cycle review of the Republic of the Sudan.

The submission pursues three objectives: to recall the commitments Sudan accepted during its third Universal Periodic Review in 2022; to assess how far those commitments have been implemented; and to draw the Working Group's attention to concerns regarding procedural impartiality and the selective treatment of documented human rights violations — including issues arising during the Human Rights Council's sixty-second session on the draft resolution concerning the humanitarian situation in El Obeid.

## What the submission documents

Sudan supported 244 of the 283 recommendations made at its third review, which the Human Rights Council adopted without a vote on 4 July 2022. Four years on, the submitting organizations find near-total non-implementation of that record, alongside a marked reduction in cooperation with international mechanisms:

- The mandate of the United Nations Integrated Transition Assistance Mission in Sudan was terminated in December 2023 at the request of the Sudanese authorities.
- The Independent International Fact-Finding Mission for the Sudan has been unable to conduct investigations inside Sudanese territory.
- OHCHR and the Independent Expert have encountered restrictions on access imposed by the de facto authorities in Port Sudan.
- Initial and periodic reports due under several human rights treaties since 2022 remain outstanding, and no voluntary mid-term report has been submitted.

The submission also warns that an exclusive or disproportionate focus on a single geographical area risks an incomplete assessment of the situation. It points to continuing reports of violations in Darfur, Kordofan and Blue Nile, to civilian casualties including children following the events in Kulbus, West Darfur on 29 June 2026, and to the prolonged siege of El Fasher and repeated attacks affecting camps for internally displaced persons in North Darfur.

A further section addresses matters omitted from the Council's agenda: documented allegations concerning the use of internationally prohibited chemical weapons, the indiscriminate aerial bombardment of civilians and civilian infrastructure, the obstruction of humanitarian relief operations including World Food Programme convoys, and the reported involvement of foreign cross-border armed groups.

## The recommendations

The submitting organizations call upon the Sudanese authorities and all parties to the conflict to ensure access for international human rights mechanisms; ensure independent investigations and accountability; protect civilians; guarantee humanitarian access; engage in a ceasefire and an inclusive peace process; strengthen follow-up to the Universal Periodic Review; restore civilian-led governance; and resume full cooperation with the International Criminal Court. They further recommend that any Human Rights Council resolution concerning the Sudan be comprehensive, balanced and fully reflective of the armed conflict.

"The fourth review will constitute a defining test," the submission concludes: "either the universal periodic review confines itself to a formal exercise in which commitments are recorded and forgotten, or it becomes the framework within which the gap between the commitments of February 2022 and the reality of July 2026 is named, measured and redressed."

[Read the full submission (PDF, 10 pages)](${PDF_URL})

---

**Submitted by the International Coalition of Human Rights Organizations (ICHRO) and Omnium des Libertés (ODL)**

Geneva, 22 July 2026`;

const EN_EXCERPT =
  'ICHRO and Omnium des Libertés have filed a joint stakeholder submission to the UPR Working Group ahead of its 54th session for Sudan’s fourth-cycle review, documenting near-total non-implementation of the commitments Sudan accepted in 2022 and warning that a geographically selective approach risks an incomplete assessment of the crisis.';

const AR_BODY = `قدّم التحالف الدولي لمنظمات حقوق الإنسان (ICHRO) ومنظمة أومنيوم دي ليبرتيه (ODL) مساهمة مشتركة من الجهات المعنية إلى الفريق العامل المعني بالاستعراض الدوري الشامل قبيل دورته الرابعة والخمسين (كانون الثاني/يناير – شباط/فبراير 2027)، في إطار الجولة الرابعة لاستعراض جمهورية السودان.

وتسعى المساهمة إلى ثلاثة أهداف: التذكير بالالتزامات التي قبلها السودان خلال استعراضه الدوري الشامل الثالث عام 2022؛ وتقييم مدى تنفيذ تلك الالتزامات؛ ولفت انتباه الفريق العامل إلى مخاوف تتعلق بالنزاهة الإجرائية والتعامل الانتقائي مع انتهاكات حقوق الإنسان الموثّقة — بما في ذلك المسائل التي أثيرت خلال الدورة الثانية والستين لمجلس حقوق الإنسان بشأن مشروع القرار المتعلق بالوضع الإنساني في الأُبيّض.

## ما توثّقه المساهمة

أيّد السودان 244 توصية من أصل 283 توصية قُدّمت في استعراضه الثالث، وهو ما اعتمده مجلس حقوق الإنسان دون تصويت في 4 تموز/يوليو 2022. وبعد أربع سنوات، ترى المنظمتان المقدّمتان أن هذا السجل لم يُنفَّذ تنفيذًا يُذكر، إلى جانب تراجع ملحوظ في التعاون مع الآليات الدولية:

- أُنهيت ولاية بعثة الأمم المتحدة المتكاملة لتقديم المساعدة خلال الفترة الانتقالية في السودان في كانون الأول/ديسمبر 2023 بناءً على طلب السلطات السودانية.
- لم تتمكّن بعثة تقصي الحقائق الدولية المستقلة بشأن السودان من إجراء تحقيقات داخل الأراضي السودانية.
- واجهت المفوضية السامية لحقوق الإنسان والخبير المستقل قيودًا على الوصول فرضتها السلطات القائمة بالأمر الواقع في بورتسودان.
- لا تزال التقارير الأولية والدورية المستحقة بموجب عدة معاهدات لحقوق الإنسان منذ عام 2022 معلّقة، ولم يُقدَّم أي تقرير طوعي لمنتصف المدة.

كما تحذّر المساهمة من أن التركيز الحصري أو غير المتناسب على منطقة جغرافية واحدة ينطوي على خطر تقييم منقوص للوضع. وتشير إلى استمرار ورود تقارير عن انتهاكات في دارفور وكردفان والنيل الأزرق، وإلى سقوط ضحايا مدنيين بينهم أطفال عقب أحداث كلبس بغرب دارفور في 29 حزيران/يونيو 2026، وإلى الحصار المطوّل على الفاشر والهجمات المتكررة التي تطال مخيمات النازحين داخليًا في شمال دارفور.

ويتناول قسم آخر مسائل غابت عن جدول أعمال المجلس: ادعاءات موثّقة بشأن استخدام أسلحة كيميائية محظورة دوليًا، والقصف الجوي العشوائي للمدنيين والبنية التحتية المدنية، وعرقلة عمليات الإغاثة الإنسانية بما فيها قوافل برنامج الأغذية العالمي، والتورط المُبلّغ عنه لجماعات مسلحة أجنبية عابرة للحدود.

## التوصيات

تدعو المنظمتان المقدّمتان السلطات السودانية وجميع أطراف النزاع إلى ضمان وصول الآليات الدولية لحقوق الإنسان؛ وكفالة تحقيقات مستقلة ومساءلة؛ وحماية المدنيين؛ وضمان وصول المساعدات الإنسانية؛ والانخراط في وقف لإطلاق النار وعملية سلام شاملة؛ وتعزيز متابعة الاستعراض الدوري الشامل؛ واستعادة الحكم المدني؛ واستئناف التعاون الكامل مع المحكمة الجنائية الدولية. كما توصيان بأن يكون أي قرار لمجلس حقوق الإنسان بشأن السودان شاملًا ومتوازنًا ومعبّرًا تعبيرًا كاملًا عن النزاع المسلح.

وتخلص المساهمة إلى أن «الاستعراض الرابع سيشكّل اختبارًا فاصلًا»: فإما أن يقتصر الاستعراض الدوري الشامل على ممارسة شكلية تُسجَّل فيها الالتزامات ثم تُنسى، وإما أن يصبح الإطار الذي تُسمّى فيه الفجوة بين التزامات شباط/فبراير 2022 وواقع تموز/يوليو 2026 وتُقاس وتُعالَج.

[اقرأ المساهمة الكاملة (PDF، 10 صفحات)](${PDF_URL})

---

**مقدَّمة من التحالف الدولي لمنظمات حقوق الإنسان (ICHRO) ومنظمة أومنيوم دي ليبرتيه (ODL)**

جنيف، 22 يوليو 2026`;

const AR_EXCERPT =
  'قدّم التحالف الدولي لمنظمات حقوق الإنسان ومنظمة أومنيوم دي ليبرتيه مساهمة مشتركة إلى الفريق العامل المعني بالاستعراض الدوري الشامل قبيل دورته الرابعة والخمسين، توثّق غياب تنفيذ الالتزامات التي قبلها السودان عام 2022، وتحذّر من أن النهج الانتقائي جغرافيًا ينطوي على خطر تقييم منقوص للأزمة.';

const FR_BODY = `La Coalition internationale des organisations de défense des droits de l'homme (ICHRO) et l'Omnium des Libertés (ODL) ont déposé une contribution conjointe des parties prenantes auprès du Groupe de travail sur l'Examen périodique universel, en vue de sa cinquante-quatrième session (janvier–février 2027), dans le cadre du quatrième cycle d'examen de la République du Soudan.

La contribution poursuit trois objectifs : rappeler les engagements acceptés par le Soudan lors de son troisième Examen périodique universel en 2022 ; évaluer dans quelle mesure ces engagements ont été mis en œuvre ; et appeler l'attention du Groupe de travail sur des préoccupations relatives à l'impartialité procédurale et au traitement sélectif des violations des droits de l'homme documentées — y compris les questions soulevées lors de la soixante-deuxième session du Conseil des droits de l'homme au sujet du projet de résolution concernant la situation humanitaire à El Obeid.

## Ce que documente la contribution

Le Soudan a soutenu 244 des 283 recommandations formulées lors de son troisième examen, dont le Conseil des droits de l'homme a adopté l'issue sans vote le 4 juillet 2022. Quatre ans plus tard, les organisations soumettantes constatent une non-application quasi totale de ce bilan, ainsi qu'un net recul de la coopération avec les mécanismes internationaux :

- Le mandat de la Mission intégrée des Nations Unies pour l'assistance à la transition au Soudan a pris fin en décembre 2023, à la demande des autorités soudanaises.
- La Mission internationale indépendante d'établissement des faits pour le Soudan n'a pas été en mesure de mener des enquêtes sur le territoire soudanais.
- Le HCDH et l'Expert indépendant se sont heurtés à des restrictions d'accès imposées par les autorités de fait établies à Port-Soudan.
- Les rapports initiaux et périodiques dus au titre de plusieurs traités relatifs aux droits de l'homme depuis 2022 restent en attente, et aucun rapport volontaire à mi-parcours n'a été soumis.

La contribution met également en garde : une attention exclusive ou disproportionnée portée à une seule zone géographique risque de produire une évaluation incomplète de la situation. Elle rappelle les informations persistantes faisant état de violations au Darfour, au Kordofan et au Nil Bleu, les victimes civiles — dont des enfants — signalées après les événements de Kulbus, au Darfour occidental, le 29 juin 2026, ainsi que le siège prolongé d'El Fasher et les attaques répétées visant les camps de personnes déplacées internes au Darfour du Nord.

Une autre section porte sur des questions absentes de l'ordre du jour du Conseil : des allégations documentées concernant l'emploi d'armes chimiques interdites au niveau international, le bombardement aérien indiscriminé de civils et d'infrastructures civiles, l'entrave aux opérations de secours humanitaire, y compris les convois du Programme alimentaire mondial, et l'implication signalée de groupes armés étrangers transfrontaliers.

## Les recommandations

Les organisations soumettantes appellent les autorités soudanaises et toutes les parties au conflit à garantir l'accès des mécanismes internationaux des droits de l'homme ; à assurer des enquêtes indépendantes et la reddition de comptes ; à protéger les civils ; à garantir l'accès humanitaire ; à s'engager dans un cessez-le-feu et un processus de paix inclusif ; à renforcer le suivi de l'Examen périodique universel ; à rétablir une gouvernance civile ; et à reprendre une pleine coopération avec la Cour pénale internationale. Elles recommandent en outre que toute résolution du Conseil des droits de l'homme concernant le Soudan soit globale, équilibrée et pleinement représentative du conflit armé.

« Le quatrième examen constituera un test décisif », conclut la contribution : soit l'Examen périodique universel se limite à un exercice formel où les engagements sont consignés puis oubliés, soit il devient le cadre dans lequel l'écart entre les engagements de février 2022 et la réalité de juillet 2026 est nommé, mesuré et corrigé.

[Lire la contribution intégrale (PDF, 10 pages)](${PDF_URL})

---

**Soumise par la Coalition internationale des organisations de défense des droits de l'homme (ICHRO) et l'Omnium des Libertés (ODL)**

Genève, le 22 juillet 2026`;

const FR_EXCERPT =
  "L'ICHRO et l'Omnium des Libertés ont déposé une contribution conjointe auprès du Groupe de travail sur l'Examen périodique universel en vue de sa 54e session, documentant la non-application quasi totale des engagements acceptés par le Soudan en 2022 et avertissant qu'une approche géographiquement sélective risque de produire une évaluation incomplète de la crise.";

// The ten pages of the submission, in order. English document, so they hang off the
// English row only; captions double as the img alt text (max 500 chars each).
const PAGE_CAPTIONS = [
  'Page 1 — cover: joint stakeholder submission to the UPR Working Group, Fifty-Fourth Session, and the introduction and methodology.',
  'Page 2 — the three objectives of the submission and the United Nations documentation it draws on.',
  'Page 3 — Sudan’s third-cycle review: 283 recommendations, 244 supported, and the reforms presented in 2022.',
  'Page 4 — persistent gaps in implementation since the third cycle, and the effect of the conflict that began in April 2023.',
  'Page 5 — the deterioration in cooperation with United Nations human rights mechanisms and the treaty-body reporting backlog.',
  'Page 6 — structural drivers of the crisis and the regression of legislative and institutional reforms.',
  'Page 7 — comprehensive documentation of violations, and the risk of a geographically selective assessment.',
  'Page 8 — procedural and representation concerns, and grave issues omitted from the Human Rights Council’s agenda.',
  'Page 9 — conclusion, and the first recommendations: access for international mechanisms, and independent investigations.',
  'Page 10 — the remaining recommendations, from protection of civilians to cooperation with the International Criminal Court.',
];

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Press Release',
  date: '2026-07-22',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan', '#UPR54'],
  locales: [
    {
      locale: 'en',
      title: 'UN UPR 54th Session: On Procedural Bias and the Selective Treatment of Human Rights Violations in Sudan',
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: 'Geneva',
      authorName: 'ICHR Communications',
      coverImageUrl: `/blog/${SLUG}/cover.jpg`,
      gallery: PAGE_CAPTIONS.map((caption, i) => ({
        url: `/blog/${SLUG}/page-${String(i + 1).padStart(2, '0')}.jpg`,
        caption,
        order: i,
      })),
    },
    {
      locale: 'ar',
      title: 'الدورة 54 للاستعراض الدوري الشامل: بشأن الانحياز الإجرائي والتعامل الانتقائي مع انتهاكات حقوق الإنسان في السودان',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'جنيف',
      authorName: 'إعلام ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
    },
    {
      locale: 'fr',
      title:
        "54e session de l'EPU : sur la partialité procédurale et le traitement sélectif des violations des droits de l'homme au Soudan",
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Genève',
      authorName: 'Communication ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
    },
  ],
};

// Read by scripts/gen-press-cover.mjs. Hand-broken headlines; the generator measures
// each line's rendered ink against the 1024px column before writing anything.
export const COVERS = {
  en: {
    file: 'cover.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: 'INTERNATIONAL COALITION FOR HUMAN RIGHTS',
    eyebrow: 'UPR 54 — JOINT SUBMISSION',
    headline: ['On Procedural Bias and the', 'Selective Treatment of Human', 'Rights Violations in Sudan'],
    headSize: 58,
    headLh: 78,
    headTop: 470,
    standfirst: ['Joint stakeholder submission to the', 'UPR Working Group, 54th Session'],
    city: 'Geneva',
    date: '22 JULY 2026',
    chipW: 286,
  },
  fr: {
    file: 'cover-fr.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: "COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME",
    eyebrow: 'EPU 54 — CONTRIBUTION CONJOINTE',
    headline: ['Partialité procédurale et', 'traitement sélectif des violations', "des droits de l'homme au Soudan"],
    headSize: 52,
    headLh: 72,
    headTop: 470,
    standfirst: ['Contribution conjointe au Groupe de', "travail de l'EPU, 54e session"],
    city: 'Genève',
    date: '22 JUILLET 2026',
    chipW: 300,
  },
  ar: {
    file: 'cover-ar.jpg',
    rtl: true,
    font: "'Geeza Pro', 'Al Bayan', sans-serif",
    org: 'التحالف الدولي لحقوق الإنسان',
    eyebrow: 'الاستعراض الدوري الشامل 54',
    headline: ['بشأن الانحياز الإجرائي والتعامل', 'الانتقائي مع انتهاكات حقوق', 'الإنسان في السودان'],
    headSize: 56,
    headLh: 88,
    headTop: 468,
    standfirst: ['مساهمة مشتركة إلى الفريق العامل', 'المعني بالاستعراض الدوري الشامل'],
    city: 'جنيف',
    date: '22 يوليو 2026',
    chipW: 240,
  },
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
