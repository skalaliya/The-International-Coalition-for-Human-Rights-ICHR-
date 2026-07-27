// "Statement of Condemnation: Reported Attack on Displaced Civilians in Qoz Al-Dahish,
//  Blue Nile State" — Paris, 23 July 2026. Source: press/press-2/.
//
// One file, three locales. The mechanism (Neon guard, atomic upsert, gallery rebuild,
// read-back) lives in prisma/lib/press-statement.mjs; this file is the content, and is
// the git source-of-record for what is on the site.
//
// Usage:
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-qoz-al-dahish.mjs   # validate only
//               node --env-file=.env.local prisma/seed-statement-qoz-al-dahish.mjs   # write as DRAFT
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-qoz-al-dahish.mjs   # take it live
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-qoz-al-dahish.mjs   # draft all 3 locales
//
// Covers: node scripts/gen-press-cover.mjs prisma/seed-statement-qoz-al-dahish.mjs
//
// EDITORIAL NOTES (agreed with the user before publishing):
//  - Dateline is PARIS, not Geneva. Every earlier statement was Geneva.
//  - The source text and both card images end the last bullet "...communities at
//    heightened Latin." That is a corrupted word; the site reads "at heightened risk".
//    The ARTWORK still says "Latin" — page 2 of the cards is worth re-exporting.
//  - The victim list is reproduced with every name and parenthetical exactly as supplied;
//    only the bullet markers are normalized (the source mixes "-Al-Taj", "- Yousif" and
//    ". Jaber", which marked renders as a paragraph, a bullet and a stray "." line).
//  - The contact block (website/email/WhatsApp) is dropped from the body — it is in the
//    site footer and on /contact, and both card images still carry it.
//  - Every "reported" / "alleged" hedge is preserved, in all three languages.
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'condemnation-qoz-al-dahish-blue-nile-july-2026';
// Minted once for this story. NEVER regenerate: it is what binds the three locales for
// the language toggle, the hreflang alternates and the sitemap.
export const TRANSLATION_KEY = 'ce264281-8287-4977-b3d0-f8ef09993815';

const EN_BODY = `The International Coalition of Human Rights Organizations expresses its deepest concern and unequivocally condemns the reported attack against unarmed civilians and internally displaced persons (IDPs) in Qoz Al-Dahish (Al-Mughayra area), located in the southern Badia of Al-Tadamon Locality, Blue Nile State, Sudan.

According to preliminary documented information received by the Coalition, the attack was reportedly carried out by an unmanned aerial vehicle (drone) allegedly operated by the Sudanese Armed Forces. The strike reportedly targeted a civilian location sheltering displaced persons who had fled armed violence, resulting in the deaths and serious injuries of members of a displaced family.

## The victims have been identified as follows

**Reported fatalities:**

- Al-Taj Al-Sayyid Mohammed Al-Khalifa (Head of the family).
- Yousif Mohammed Ali Turba (child).
- Jaber Mohammed Ali Turba (child).

**Reported seriously injured:**

- Amina Mohammed Ali (Mother).
- Shama Mohammed Ali Turba (child).

International humanitarian law affords special protection to civilians and civilian objects at all times. Attacks directed against civilians, internally displaced persons, or other persons not taking direct part in hostilities are strictly prohibited and may constitute serious violations of international humanitarian law.

The circumstances surrounding this reported incident, including allegations that members of a particular ethnic community were intentionally targeted, raise serious concerns requiring prompt, independent, impartial, and effective investigation. Should credible evidence establish that civilians were deliberately targeted on ethnic grounds as part of a widespread or systematic attack against a civilian population, such conduct may amount to crimes against humanity in addition to war crimes under international law.

The Coalition therefore calls upon the United Nations, the United Nations Human Rights Council, the Office of the United Nations High Commissioner for Human Rights (OHCHR), the Independent International Fact-Finding Mission for the Sudan, and all relevant international accountability mechanisms to take urgent action to:

- Conduct or support an independent, impartial, and transparent investigation into the reported attack.
- Ensure the preservation of evidence and the protection of victims, survivors, and witnesses.
- Determine individual and command responsibility for any violations of international humanitarian law and international human rights law.
- Hold all perpetrators accountable through appropriate national or international judicial mechanisms.
- Strengthen international efforts to protect civilians and prevent further attacks against displaced populations and communities at heightened risk.

The Coalition further urges the Independent International Fact-Finding Mission for the Sudan to include the reported attack on Qoz Al-Dahish within the scope of its investigations and to examine all available evidence relating to allegations of ethnically motivated violence and other serious violations of international law.

The protection of civilians, the prevention of atrocity crimes, and the pursuit of justice are fundamental obligations under international law. Lasting peace cannot be achieved without accountability, truth, and effective remedies for victims.

---

**THE INTERNATIONAL COALITION FOR HUMAN RIGHTS**

Advancing Human Rights • Peace • Justice

Paris, 23 July 2026`;

const EN_EXCERPT =
  'The Coalition condemns a reported drone strike on a civilian site sheltering displaced people in Qoz Al-Dahish, Blue Nile State, which reportedly killed three members of one displaced family, including two children, and seriously injured a mother and a child. It calls for an independent, impartial investigation and for accountability.';

const AR_BODY = `يعرب التحالف الدولي لمنظمات حقوق الإنسان عن بالغ قلقه ويدين بشكل قاطع الهجوم المُبلّغ عنه ضد مدنيين عُزّل ونازحين داخليًا في قوز الدحيش (منطقة المغيرة) الواقعة في بادية جنوب محلية التضامن بولاية النيل الأزرق في السودان.

ووفقًا لمعلومات أولية موثّقة تلقاها التحالف، نُفّذ الهجوم على ما ورد بطائرة مسيّرة يُزعم أنها تابعة للقوات المسلحة السودانية. وأفادت التقارير بأن الضربة استهدفت موقعًا مدنيًا يأوي نازحين فرّوا من العنف المسلح، ما أسفر عن مقتل وإصابة أفراد من أسرة نازحة بجروح خطيرة.

## جرى التعرف على الضحايا على النحو التالي

**الوفيات المُبلّغ عنها:**

- التاج السيد محمد الخليفة (رب الأسرة).
- يوسف محمد علي طُربة (طفل).
- جابر محمد علي طُربة (طفل).

**الإصابات الخطيرة المُبلّغ عنها:**

- أمينة محمد علي (الأم).
- شمة محمد علي طُربة (طفلة).

يكفل القانون الدولي الإنساني حماية خاصة للمدنيين والأعيان المدنية في جميع الأوقات. والهجمات الموجهة ضد المدنيين أو النازحين داخليًا أو غيرهم ممن لا يشاركون مشاركة مباشرة في الأعمال العدائية محظورة حظرًا تامًا، وقد تشكل انتهاكات جسيمة للقانون الدولي الإنساني.

إن ملابسات هذه الحادثة المُبلّغ عنها، بما في ذلك الادعاءات بأن أفرادًا من مجموعة عرقية بعينها استُهدفوا عمدًا، تثير مخاوف جدية تستوجب تحقيقًا عاجلًا ومستقلًا ونزيهًا وفعالًا. وإذا أثبتت أدلة موثوقة أن المدنيين استُهدفوا عمدًا على أسس عرقية في إطار هجوم واسع النطاق أو منهجي ضد سكان مدنيين، فقد يرقى هذا السلوك إلى جرائم ضد الإنسانية إضافة إلى جرائم الحرب بموجب القانون الدولي.

ولذلك يدعو التحالف الأمم المتحدة، ومجلس حقوق الإنسان التابع للأمم المتحدة، والمفوضية السامية للأمم المتحدة لحقوق الإنسان، وبعثة تقصي الحقائق الدولية المستقلة بشأن السودان، وجميع آليات المساءلة الدولية ذات الصلة، إلى اتخاذ إجراءات عاجلة من أجل:

- إجراء أو دعم تحقيق مستقل ونزيه وشفاف في الهجوم المُبلّغ عنه.
- ضمان حفظ الأدلة وحماية الضحايا والناجين والشهود.
- تحديد المسؤولية الفردية ومسؤولية القيادة عن أي انتهاكات للقانون الدولي الإنساني والقانون الدولي لحقوق الإنسان.
- محاسبة جميع الجناة عبر الآليات القضائية الوطنية أو الدولية المناسبة.
- تعزيز الجهود الدولية لحماية المدنيين ومنع وقوع مزيد من الهجمات ضد السكان النازحين والمجتمعات الأكثر عرضة للخطر.

كما يحثّ التحالف بعثة تقصي الحقائق الدولية المستقلة بشأن السودان على إدراج الهجوم المُبلّغ عنه في قوز الدحيش ضمن نطاق تحقيقاتها، وعلى فحص جميع الأدلة المتاحة المتعلقة بالادعاءات بشأن العنف ذي الدوافع العرقية وغيره من الانتهاكات الجسيمة للقانون الدولي.

إن حماية المدنيين ومنع الجرائم الفظيعة والسعي إلى تحقيق العدالة التزامات أساسية بموجب القانون الدولي. ولا يمكن بلوغ سلام دائم من دون مساءلة وحقيقة وسبل انتصاف فعالة للضحايا.

---

**التحالف الدولي لحقوق الإنسان**

النهوض بحقوق الإنسان • السلام • العدالة

باريس، 23 يوليو 2026`;

const AR_EXCERPT =
  'يدين التحالف ضربة مُبلّغًا عنها بطائرة مسيّرة استهدفت موقعًا مدنيًا يأوي نازحين في قوز الدحيش بولاية النيل الأزرق، وأسفرت وفق التقارير عن مقتل ثلاثة أفراد من أسرة نازحة بينهم طفلان، وإصابة أم وطفلة بجروح خطيرة، ويطالب بتحقيق مستقل ونزيه وبالمساءلة.';

const FR_BODY = `La Coalition internationale des organisations de défense des droits de l'homme exprime sa plus vive préoccupation et condamne sans équivoque l'attaque signalée contre des civils non armés et des personnes déplacées internes à Qoz Al-Dahish (secteur d'Al-Mughayra), dans la badiya méridionale de la localité d'Al-Tadamon, État du Nil Bleu, au Soudan.

Selon des informations préliminaires documentées reçues par la Coalition, l'attaque aurait été menée par un véhicule aérien sans pilote (drone) prétendument opéré par les Forces armées soudanaises. La frappe aurait visé un site civil abritant des personnes déplacées ayant fui les violences armées, causant la mort et de graves blessures parmi les membres d'une famille déplacée.

## Les victimes ont été identifiées comme suit

**Décès signalés :**

- Al-Taj Al-Sayyid Mohammed Al-Khalifa (chef de famille).
- Yousif Mohammed Ali Turba (enfant).
- Jaber Mohammed Ali Turba (enfant).

**Blessés graves signalés :**

- Amina Mohammed Ali (mère).
- Shama Mohammed Ali Turba (enfant).

Le droit international humanitaire accorde en tout temps une protection particulière aux civils et aux biens de caractère civil. Les attaques dirigées contre des civils, des personnes déplacées internes ou d'autres personnes ne participant pas directement aux hostilités sont strictement interdites et peuvent constituer des violations graves du droit international humanitaire.

Les circonstances entourant cet incident signalé, y compris les allégations selon lesquelles des membres d'une communauté ethnique particulière auraient été délibérément visés, soulèvent de sérieuses préoccupations qui exigent une enquête rapide, indépendante, impartiale et effective. Si des éléments crédibles établissaient que des civils ont été délibérément visés sur des fondements ethniques dans le cadre d'une attaque généralisée ou systématique contre une population civile, de tels actes pourraient constituer des crimes contre l'humanité, en plus de crimes de guerre au regard du droit international.

La Coalition appelle en conséquence l'Organisation des Nations Unies, le Conseil des droits de l'homme des Nations Unies, le Haut-Commissariat des Nations Unies aux droits de l'homme (HCDH), la Mission internationale indépendante d'établissement des faits pour le Soudan et l'ensemble des mécanismes internationaux de responsabilité compétents à agir d'urgence pour :

- Mener ou soutenir une enquête indépendante, impartiale et transparente sur l'attaque signalée.
- Assurer la préservation des preuves ainsi que la protection des victimes, des survivants et des témoins.
- Établir les responsabilités individuelles et hiérarchiques pour toute violation du droit international humanitaire et du droit international des droits de l'homme.
- Traduire tous les auteurs en justice devant les mécanismes judiciaires nationaux ou internationaux appropriés.
- Renforcer les efforts internationaux visant à protéger les civils et à prévenir de nouvelles attaques contre les populations déplacées et les communautés les plus exposées.

La Coalition exhorte en outre la Mission internationale indépendante d'établissement des faits pour le Soudan à inclure l'attaque signalée de Qoz Al-Dahish dans le champ de ses investigations et à examiner l'ensemble des éléments disponibles concernant les allégations de violences à motivation ethnique et d'autres violations graves du droit international.

La protection des civils, la prévention des crimes d'atrocité et la poursuite de la justice sont des obligations fondamentales du droit international. Une paix durable ne peut être atteinte sans responsabilité, sans vérité et sans réparations effectives pour les victimes.

---

**LA COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME**

Promouvoir les droits de l'homme • La paix • La justice

Paris, le 23 juillet 2026`;

const FR_EXCERPT =
  "La Coalition condamne une frappe de drone signalée contre un site civil abritant des personnes déplacées à Qoz Al-Dahish, État du Nil Bleu, qui aurait tué trois membres d'une même famille déplacée, dont deux enfants, et gravement blessé une mère et une enfant. Elle réclame une enquête indépendante et impartiale et des comptes.";

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Statement',
  date: '2026-07-23',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
  locales: [
    {
      locale: 'en',
      title: 'Statement of Condemnation: Reported Attack on Displaced Civilians in Qoz Al-Dahish, Blue Nile State',
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: 'Paris',
      authorName: 'ICHR Communications',
      coverImageUrl: `/blog/${SLUG}/cover.jpg`,
      // The two designed pages are English, so they hang off the English row only.
      // Captions are rendered as a visible <figcaption> AND used as the img alt text.
      gallery: [
        {
          url: `/blog/${SLUG}/card-1.jpg`,
          caption:
            'Statement page 1 of 2: the reported drone strike on a civilian site sheltering displaced people in Qoz Al-Dahish, the identified victims, and the protection international humanitarian law affords to civilians.',
          order: 0,
        },
        {
          url: `/blog/${SLUG}/card-2.jpg`,
          caption:
            'Statement page 2 of 2: the Coalition’s five calls to the United Nations, the Human Rights Council, OHCHR and the Independent International Fact-Finding Mission for the Sudan — investigation, preservation of evidence, command responsibility, accountability, and protection of displaced populations.',
          order: 1,
        },
      ],
    },
    {
      locale: 'ar',
      title: 'بيان إدانة: الهجوم المُبلّغ عنه على المدنيين النازحين في قوز الدحيش بولاية النيل الأزرق',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'باريس',
      authorName: 'إعلام ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
    },
    {
      locale: 'fr',
      title: 'Déclaration de condamnation : attaque signalée contre des civils déplacés à Qoz Al-Dahish, État du Nil Bleu',
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Paris',
      authorName: 'Communication ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
    },
  ],
};

// Consumed by scripts/gen-press-cover.mjs. Headlines are hand-broken — nothing wraps —
// and the generator measures the rendered ink of every line before writing a file.
export const COVERS = {
  en: {
    file: 'cover.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: 'INTERNATIONAL COALITION FOR HUMAN RIGHTS',
    eyebrow: 'STATEMENT OF CONDEMNATION',
    headline: ['Reported Attack on', 'Displaced Civilians in', 'Qoz Al-Dahish,', 'Blue Nile State'],
    headSize: 58,
    headLh: 78,
    headTop: 452,
    standfirst: ['Statement on the situation in Sudan'],
    city: 'Paris',
    date: '23 JULY 2026',
    chipW: 248,
  },
  fr: {
    file: 'cover-fr.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: "COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME",
    eyebrow: 'DÉCLARATION DE CONDAMNATION',
    headline: ['Attaque signalée contre', 'des civils déplacés à', 'Qoz Al-Dahish,', 'État du Nil Bleu'],
    headSize: 54,
    headLh: 74,
    headTop: 452,
    standfirst: ['Déclaration sur la situation au Soudan'],
    city: 'Paris',
    date: '23 JUILLET 2026',
    chipW: 248,
  },
  ar: {
    file: 'cover-ar.jpg',
    rtl: true,
    font: "'Geeza Pro', 'Al Bayan', sans-serif",
    org: 'التحالف الدولي لحقوق الإنسان',
    eyebrow: 'بيان إدانة',
    headline: ['الهجوم المُبلّغ عنه على', 'المدنيين النازحين في قوز الدحيش', 'بولاية النيل الأزرق'],
    headSize: 56,
    headLh: 88,
    headTop: 468,
    standfirst: ['بيان بشأن الوضع في السودان'],
    city: 'باريس',
    date: '23 يوليو 2026',
    chipW: 240,
  },
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
