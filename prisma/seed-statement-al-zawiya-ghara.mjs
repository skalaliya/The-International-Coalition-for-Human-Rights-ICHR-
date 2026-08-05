// "JOINT STATEMENT — The International Coalition of Human Rights Organizations strongly
//  condemns (SAF) drone attacks on Al-Zawiya Ghara village in North Darfur"
//  — Geneva, 3 August 2026. Source: press/AUG/press-6/.
//
// Usage:
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-al-zawiya-ghara.mjs
//               node --env-file=.env.local prisma/seed-statement-al-zawiya-ghara.mjs   # DRAFT
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-al-zawiya-ghara.mjs   # live
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-al-zawiya-ghara.mjs
//
// Variants: node scripts/gen-image-variants.mjs condemnation-al-zawiya-ghara-north-darfur-august-2026
// Attachment manifest: node scripts/gen-attachments.mjs
//
// EDITORIAL NOTES:
//  - ATTRIBUTION IS UNHEDGED AND DELIBERATE. Unlike the Shirshar statement — where an
//    aircraft "reportedly took off" from a named base — this one states as fact that the
//    strikes were "conducted by the Sudanese Armed Forces (SAF)". That wording is ICHR's,
//    it is printed on the public card, and it was confirmed for publication. The Arabic
//    and French carry the same directness: نفّذتها القوات المسلحة السودانية and menées par
//    les Forces armées soudanaises. Do NOT soften these into a conditional in a later
//    copy-edit — that would misrepresent a signed statement.
//  - The five named casualties are published as written, confirmed with the user. They
//    already appear on the public card.
//  - One corruption in the source .rtf was corrected with the user's approval:
//    "into residential vDirectindemonstrates a blatant failure" -> "into residential areas
//    demonstrates a blatant failure". Everything else is verbatim, including the doubled
//    space in "the  verified field reports" (normalised) and the source's "." bullet
//    markers (normalised to "- " per the markdown rules).
//  - DATELINE. The card reads GENEVA / BRUSSELS / NEW YORK / GLOBAL. `location` holds a
//    single string and renders in the dateline chip, so it is "Geneva"; the full four-city
//    line is preserved in the body. Not Brussels, which was the previous statement.
//  - Date on the card is 03/08/2026, day/month — the strikes it describes are dated
//    02/08/2026, the day before, and the folder is press/AUG. So 3 August 2026.
//  - It is titled a JOINT STATEMENT but names no co-signatory. Left as the source has it;
//    if a partner organisation should be credited, that is a content fix, not a code one.
//  - The statement's own name for the organisation is "The International Coalition OF
//    Human Rights Organizations". The site's canonical name is "for Human Rights". The
//    body keeps the statement's wording; the site furniture keeps the site's.
//
// COVERS: all three are artwork. cover.jpg is press-6/S1.jpg as supplied; cover-ar.jpg and
// cover-fr.jpg are that same card with only the typography rebuilt per locale. No COVERS
// export and gen-press-cover.mjs is not used here.
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'condemnation-al-zawiya-ghara-north-darfur-august-2026';
// Minted once for this story. NEVER regenerate.
export const TRANSLATION_KEY = '7a57f6f3-7e4c-4fe1-94c2-cc6e953b129c';

const EN_BODY = `The International Coalition of Human Rights Organizations vehemently condemns the devastating drone strikes conducted by the Sudanese Armed Forces (SAF) on 2 August 2026 at the village of Al-Zawiya Ghara, located approximately 30 kilometers northwest of Kabkabiya, North Darfur.

According to the verified field reports, the aerial bombardment directly targeted densely populated civilian areas, resulting in more than 40 casualties, including deaths and severe injuries among innocent civilians, alongside widespread destruction of civilian infrastructure and forced displacement.

Among the confirmed casualties and victims identified thus far are:

- Ahmed Bakhit
- Alzain Alnour
- Abdallah Jad Alrab
- Aldoud Alnadeef
- Elnour Saeed Gibril

This devastating assault underscores a horrific escalation in the reckless deployment of armed drones in civilian settlements, reflecting a profound disregard for fundamental human rights and international legal frameworks.

## Legal Obligations Under International Law

The Coalition emphasizes that under International Humanitarian Law (IHL) — in particular Common Article 3 of the Geneva Conventions and Customary IHL — as well as International Human Rights Law (IHRL):

**Strict Principle of Distinction:** All parties to a conflict must continuously distinguish between civilians and combatants. Directing attacks against civilian populations and non-military objects is strictly prohibited and constitutes a war crime.

**Failure of Precautionary Measures:** The launch of high-explosive drone munitions into residential areas demonstrates a blatant failure to observe the principles of distinction, necessity, and proportionality, exposing non-combatants to horrific harm.

## Urgent Demands

The Coalition urgently calls upon the international community, the United Nations Security Council, and relevant global bodies to act immediately on the following:

**Immediate Halt to Airstrikes:** The Sudanese Armed Forces must instantly cease all unlawful airstrikes, artillery shelling, and drone operations targeting populated villages and civilian infrastructure throughout North Darfur and across Sudan.

**Independent International Investigation:** A swift, impartial, and independent international investigation into the massacre at Al-Zawiya Ghara must be launched to identify perpetrators, commanders, and key decision-makers, ensuring they are held accountable before international justice mechanisms.

**Protection of Civilians & Humanitarian Corridors:** All warring factions must honor their legal obligations to safeguard civilian lives and guarantee immediate, safe, and unhindered humanitarian access to provide urgent medical and relief assistance to the survivors in North Darfur.

The ongoing atrocities against civilians in Darfur cannot be met with international silence. Impunity must end, and those responsible for ordering and executing attacks against civilian populations will ultimately be brought to justice.

---

**THE INTERNATIONAL COALITION FOR HUMAN RIGHTS**

Advancing Human Rights • Peace • Justice

Geneva / Brussels / New York, 3 August 2026`;

const EN_EXCERPT =
  'The Coalition condemns the drone strikes conducted by the Sudanese Armed Forces on 2 August 2026 at Al-Zawiya Ghara, some 30 kilometres northwest of Kabkabiya in North Darfur, which verified field reports say struck densely populated civilian areas and caused more than 40 casualties. It calls for an immediate halt to airstrikes, an independent international investigation, and unhindered humanitarian access for survivors.';

const AR_BODY = `يدين التحالف الدولي لمنظمات حقوق الإنسان بشدة الضربات المدمّرة بالطائرات المسيّرة التي نفّذتها القوات المسلحة السودانية في 2 أغسطس 2026 على قرية الزاوية غارة، الواقعة على بعد نحو 30 كيلومترًا شمال غربي كبكابية بولاية شمال دارفور.

ووفقًا للتقارير الميدانية المتحقَّق منها، استهدف القصف الجوي بشكل مباشر مناطق مدنية كثيفة السكان، ما أسفر عن أكثر من 40 ضحية بين قتيل وجريح في صفوف مدنيين أبرياء، إلى جانب دمار واسع في البنية التحتية المدنية ونزوح قسري.

ومن بين الضحايا الذين جرى التأكد من هوياتهم حتى الآن:

- أحمد بخيت
- الزين النور
- عبد الله جاد الرب
- الدود النظيف
- النور سعيد جبريل

ويؤكد هذا الاعتداء المدمّر تصعيدًا مروّعًا في الاستخدام المتهوّر للطائرات المسيّرة المسلحة داخل التجمعات المدنية، بما يعكس استخفافًا عميقًا بحقوق الإنسان الأساسية وبالأطر القانونية الدولية.

## الالتزامات القانونية بموجب القانون الدولي

يشدّد التحالف على أنه بموجب القانون الدولي الإنساني — ولا سيما المادة 3 المشتركة بين اتفاقيات جنيف والقانون الدولي الإنساني العرفي — وكذلك القانون الدولي لحقوق الإنسان:

**مبدأ التمييز الصارم:** يجب على جميع أطراف النزاع التمييز الدائم بين المدنيين والمقاتلين. وتوجيه الهجمات ضد السكان المدنيين والأعيان غير العسكرية محظور حظرًا تامًا ويشكّل جريمة حرب.

**الإخفاق في اتخاذ التدابير الاحترازية:** إن إطلاق ذخائر شديدة الانفجار من طائرات مسيّرة على مناطق سكنية يُظهر إخفاقًا صارخًا في مراعاة مبادئ التمييز والضرورة والتناسب، ويعرّض غير المقاتلين لأذى فظيع.

## مطالب عاجلة

يدعو التحالف بشكل عاجل المجتمع الدولي ومجلس الأمن التابع للأمم المتحدة والهيئات الدولية المعنية إلى التحرك فورًا بشأن ما يلي:

**الوقف الفوري للغارات الجوية:** يجب على القوات المسلحة السودانية أن توقف على الفور جميع الغارات الجوية غير المشروعة والقصف المدفعي وعمليات الطائرات المسيّرة التي تستهدف القرى المأهولة والبنية التحتية المدنية في شمال دارفور وفي عموم السودان.

**تحقيق دولي مستقل:** يجب فتح تحقيق دولي عاجل ونزيه ومستقل في مجزرة الزاوية غارة لتحديد مرتكبيها والقادة وصنّاع القرار الرئيسيين، وضمان مساءلتهم أمام آليات العدالة الدولية.

**حماية المدنيين والممرات الإنسانية:** يجب على جميع الأطراف المتحاربة احترام التزاماتها القانونية بحماية أرواح المدنيين، وضمان وصول إنساني فوري وآمن ودون عوائق لتقديم المساعدات الطبية والإغاثية العاجلة للناجين في شمال دارفور.

إن الفظائع المستمرة بحق المدنيين في دارفور لا يمكن أن تُقابَل بصمت دولي. يجب أن ينتهي الإفلات من العقاب، وسيُقدَّم في نهاية المطاف المسؤولون عن إصدار وتنفيذ الهجمات ضد السكان المدنيين إلى العدالة.

---

**التحالف الدولي لحقوق الإنسان**

النهوض بحقوق الإنسان • السلام • العدالة

جنيف، بروكسل، نيويورك، 3 أغسطس 2026`;

const AR_EXCERPT =
  'يدين التحالف الضربات بالطائرات المسيّرة التي نفّذتها القوات المسلحة السودانية في 2 أغسطس 2026 على قرية الزاوية غارة، على بعد نحو 30 كيلومترًا شمال غربي كبكابية بولاية شمال دارفور، والتي تفيد التقارير الميدانية المتحقَّق منها بأنها استهدفت مناطق مدنية كثيفة السكان وأوقعت أكثر من 40 ضحية. ويدعو إلى وقف فوري للغارات، وتحقيق دولي مستقل، ووصول إنساني دون عوائق للناجين.';

const FR_BODY = `La Coalition internationale des organisations de défense des droits de l'homme condamne avec véhémence les frappes de drones dévastatrices menées par les Forces armées soudanaises (SAF) le 2 août 2026 contre le village d'Al-Zawiya Ghara, situé à environ 30 kilomètres au nord-ouest de Kabkabiya, au Darfour du Nord.

Selon les rapports de terrain vérifiés, le bombardement aérien a directement visé des zones civiles densément peuplées, faisant plus de 40 victimes, morts et blessés graves parmi des civils innocents, ainsi que des destructions étendues d'infrastructures civiles et des déplacements forcés.

Parmi les victimes identifiées à ce jour figurent :

- Ahmed Bakhit
- Alzain Alnour
- Abdallah Jad Alrab
- Aldoud Alnadeef
- Elnour Saeed Gibril

Cet assaut dévastateur souligne une escalade effroyable dans le recours inconsidéré aux drones armés au sein d'agglomérations civiles, révélant un profond mépris des droits humains fondamentaux et des cadres juridiques internationaux.

## Obligations juridiques au regard du droit international

La Coalition souligne qu'au titre du droit international humanitaire (DIH) — en particulier l'article 3 commun aux Conventions de Genève et le DIH coutumier — ainsi que du droit international des droits de l'homme :

**Principe strict de distinction :** toutes les parties à un conflit doivent distinguer en permanence les civils des combattants. Diriger des attaques contre des populations civiles et des biens non militaires est strictement interdit et constitue un crime de guerre.

**Manquement aux mesures de précaution :** le largage de munitions hautement explosives par drone sur des zones résidentielles témoigne d'un manquement flagrant aux principes de distinction, de nécessité et de proportionnalité, exposant des non-combattants à des préjudices effroyables.

## Demandes urgentes

La Coalition appelle instamment la communauté internationale, le Conseil de sécurité des Nations unies et les organes internationaux compétents à agir immédiatement sur les points suivants :

**Arrêt immédiat des frappes aériennes :** les Forces armées soudanaises doivent cesser sur-le-champ toutes les frappes aériennes illégales, les tirs d'artillerie et les opérations de drones visant des villages habités et des infrastructures civiles au Darfour du Nord et dans l'ensemble du Soudan.

**Enquête internationale indépendante :** une enquête internationale rapide, impartiale et indépendante sur le massacre d'Al-Zawiya Ghara doit être ouverte afin d'identifier les auteurs, les commandants et les principaux décideurs, et de garantir qu'ils répondent de leurs actes devant les mécanismes de justice internationale.

**Protection des civils et couloirs humanitaires :** toutes les factions belligérantes doivent honorer leurs obligations juridiques de protéger les vies civiles et garantir un accès humanitaire immédiat, sûr et sans entrave afin d'apporter une assistance médicale et de secours urgente aux survivants au Darfour du Nord.

Les atrocités commises contre les civils au Darfour ne sauraient être accueillies par le silence international. L'impunité doit cesser, et les responsables de l'ordre et de l'exécution des attaques contre les populations civiles seront à terme traduits en justice.

---

**LA COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME**

Promouvoir les droits de l'homme • La paix • La justice

Genève / Bruxelles / New York, le 3 août 2026`;

const FR_EXCERPT =
  "La Coalition condamne les frappes de drones menées par les Forces armées soudanaises le 2 août 2026 contre Al-Zawiya Ghara, à environ 30 kilomètres au nord-ouest de Kabkabiya, au Darfour du Nord, qui selon les rapports de terrain vérifiés ont visé des zones civiles densément peuplées et fait plus de 40 victimes. Elle demande l'arrêt immédiat des frappes, une enquête internationale indépendante et un accès humanitaire sans entrave pour les survivants.";

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Statement',
  date: '2026-08-03',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan', '#Darfur'],
  locales: [
    {
      locale: 'en',
      title:
        'Joint Statement: The International Coalition of Human Rights Organizations Strongly Condemns SAF Drone Attacks on Al-Zawiya Ghara Village in North Darfur',
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
            'Joint statement card 1 of 3: the verified field reports of the 2 August 2026 drone bombardment of densely populated civilian areas at Al-Zawiya Ghara, the toll of more than 40 casualties, and the names of the victims identified so far.',
          order: 0,
        },
        {
          url: `/blog/${SLUG}/card-2.jpg`,
          caption:
            'Joint statement card 2 of 3: the legal obligations under international humanitarian law — the strict principle of distinction between civilians and combatants, and the failure to observe precaution, necessity and proportionality.',
          order: 1,
        },
        {
          url: `/blog/${SLUG}/card-3.jpg`,
          caption:
            'Joint statement card 3 of 3: the urgent demands — an immediate halt to airstrikes, an independent international investigation into the Al-Zawiya Ghara massacre, and guaranteed humanitarian access for survivors in North Darfur.',
          order: 2,
        },
      ],
    },
    {
      locale: 'ar',
      title:
        'بيان مشترك: التحالف الدولي لمنظمات حقوق الإنسان يدين بشدة هجمات الطائرات المسيّرة للقوات المسلحة السودانية على قرية الزاوية غارة بشمال دارفور',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'جنيف',
      authorName: 'إعلام ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
    },
    {
      locale: 'fr',
      title:
        "Déclaration conjointe : la Coalition internationale des organisations de défense des droits de l'homme condamne fermement les attaques de drones des SAF contre le village d'Al-Zawiya Ghara au Darfour du Nord",
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Genève',
      authorName: 'Communication ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
    },
  ],
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
