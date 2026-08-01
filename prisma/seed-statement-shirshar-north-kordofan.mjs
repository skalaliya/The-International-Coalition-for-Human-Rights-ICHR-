// "Statement of Condemnation and Strong Denunciation — Airstrike Targeting Civilians in
//  Shirshar Area, North Kordofan State" — Brussels, 31 July 2026. Source: press/press-5/.
//
// One file, three locales. The mechanism lives in prisma/lib/press-statement.mjs.
//
// Usage:
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-shirshar-north-kordofan.mjs
//               node --env-file=.env.local prisma/seed-statement-shirshar-north-kordofan.mjs   # DRAFT
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-shirshar-north-kordofan.mjs   # live
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-shirshar-north-kordofan.mjs
//
// Variants: node scripts/gen-image-variants.mjs condemnation-shirshar-north-kordofan-july-2026
//
// EDITORIAL NOTES:
//  - Dateline BRUSSELS, printed on the card itself. Not Geneva. This is the first Brussels
//    dateline in the set, so do not pattern-match the previous statements here.
//  - Body is the supplied text VERBATIM, and the hedging is load-bearing throughout: the
//    aircraft "reportedly took off" from Wadi Seidna, the footage "reportedly show[s]".
//    The statement places an aircraft at a named air base; it does not itself name the
//    force responsible. Every hedge is carried into the Arabic (يُفاد بأن) and the French
//    (conditionnel: "aurait décollé", "montreraient"). Do not let a later copy-edit
//    flatten those into the indicative.
//  - Two typing artifacts in the source RTF are not reproduced: the trailing hyphen in
//    "urgent measures:-" (card 1 itself reads "measures:"), and doubled spaces in
//    "combatants  and" and "this incident  and". Same treatment as "Geneva,28July 2026"
//    in press-4.
//  - The contact block (website/email/WhatsApp) is dropped from the body, as with press-2,
//    press-3 and press-4: it is in the site footer and on /contact, and cards 1 and 3
//    still carry it. Sign-off and tagline are kept.
//  - The navy bar on the cover cards reads the site's canonical org name for each locale
//    (from src/i18n/strings) rather than a literal translation of "…for Human Rights
//    Organizations", so the artwork cannot contradict the site's own footer. The body
//    keeps the statement's own fuller wording.
//
// COVERS: all three are artwork, so there is no COVERS export and gen-press-cover.mjs is
// not used for this story. cover.jpg is press-5/Sc1.jpg as supplied. cover-ar.jpg and
// cover-fr.jpg are that same card with only the typography rebuilt per locale — same
// photograph, diagonal, seal and pink furniture — with the Arabic set right-to-left in
// Noto Sans Arabic (the family the site already loads for /ar).
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'condemnation-shirshar-north-kordofan-july-2026';
// Minted once for this story. NEVER regenerate.
export const TRANSLATION_KEY = 'dd91a157-3b78-4d8d-8432-6c80c32fe110';

const EN_BODY = `The International Coalition for Human Rights Organizations expresses its strongest condemnation and profound concern over the horrific aerial attack that targeted unarmed civilians in the Shirshar area, located within the West Bara locality of North Kordofan State.

This dangerous escalation represents a flagrant assault on the right to life and a grave violation of the principles and rules of international humanitarian law and international human rights law.

Based on consistent testimonies and documented information gathered and verified by the Coalition, a military Antonov aircraft reportedly took off from Wadi Seidna Air Base on 29 July 2026 at approximately 13:30 local time. At around 14:20, the aircraft was observed flying over North Kordofan State in the direction of the West Bara locality, followed by a series of aerial strikes that directly targeted the Shirshar area.

The strikes resulted in civilian casualties. Photographs and video footage reviewed in connection with the incident reportedly show deeply distressing and disturbing scenes of civilian victims, including women and children.

**In light of these grave violations and attacks affecting civilian lives and populated areas, the International Coalition for Human Rights Organizations calls for the following urgent measures:**

- We categorically call upon the Independent Fact-Finding Mission to gain immediate and unhindered access to the sites of the attacks, collect and preserve relevant evidence, document the circumstances surrounding the incident and interview survivors and witnesses.
- We stress the urgent need to establish legal and criminal responsibility for any violations committed against civilians, in accordance with applicable international law and to ensure that those responsible are held accountable and that impunity is not allowed to prevail.
- We call upon all parties to the conflict to strictly uphold the principle of distinction between civilians and combatants and to take all feasible precautions to protect civilians and civilian objects from the effects of military operations.
- We urge local residents, survivors, humanitarian workers, and other relevant actors to preserve any physical or digital evidence related to the incident, where doing so can be undertaken safely.
- We further emphasize the importance of preserving the integrity of the attack sites, avoiding any unnecessary disturbance or alteration of evidence where safe and practicable, and documenting relevant facts through available means in order to support future accountability and justice processes.
- The deliberate or indiscriminate targeting of civilians can never be justified on military or political grounds.
- The protection of civilian life is an obligation under international law and violations must be subject to effective investigation and accountability.

The International Coalition for Human Rights Organizations reaffirms its commitment to monitoring and documenting violations, following developments related to this incident and supporting efforts aimed at ensuring justice, accountability and effective remedies for the victims and their families.

---

**THE INTERNATIONAL COALITION FOR HUMAN RIGHTS**

Advancing Human Rights • Peace • Justice

Brussels, 31 July 2026`;

const EN_EXCERPT =
  'The Coalition condemns the aerial attack that targeted unarmed civilians in the Shirshar area of West Bara locality, North Kordofan State. A military Antonov aircraft reportedly took off from Wadi Seidna Air Base on 29 July 2026, followed by strikes on Shirshar that resulted in civilian casualties. The Coalition calls on the Independent Fact-Finding Mission to reach the sites, and for legal and criminal responsibility to be established.';

const AR_BODY = `يعرب التحالف الدولي لمنظمات حقوق الإنسان عن أشد إدانته وبالغ قلقه إزاء الهجوم الجوي المروّع الذي استهدف مدنيين عُزّلاً في منطقة شرشر الواقعة ضمن محلية بارا الغربية بولاية شمال كردفان.

يمثّل هذا التصعيد الخطير اعتداءً صارخًا على الحق في الحياة وانتهاكًا جسيمًا لمبادئ وقواعد القانون الدولي الإنساني والقانون الدولي لحقوق الإنسان.

واستنادًا إلى إفادات متطابقة ومعلومات موثّقة جمعها التحالف وتحقّق منها، يُفاد بأن طائرة عسكرية من طراز أنتونوف أقلعت من قاعدة وادي سيدنا الجوية في 29 يوليو 2026 نحو الساعة 13:30 بالتوقيت المحلي. وفي حوالي الساعة 14:20، رُصدت الطائرة وهي تحلّق فوق ولاية شمال كردفان في اتجاه محلية بارا الغربية، أعقبتها سلسلة من الضربات الجوية التي استهدفت منطقة شرشر بشكل مباشر.

وأسفرت الضربات عن سقوط ضحايا من المدنيين. ويُفاد بأن الصور ومقاطع الفيديو التي جرت مراجعتها في سياق الحادثة تُظهر مشاهد مؤلمة ومروّعة لضحايا مدنيين، من بينهم نساء وأطفال.

**وفي ضوء هذه الانتهاكات والاعتداءات الجسيمة التي تمسّ أرواح المدنيين والمناطق المأهولة، يدعو التحالف الدولي لمنظمات حقوق الإنسان إلى اتخاذ التدابير العاجلة التالية:**

- ندعو بشكل قاطع بعثة تقصّي الحقائق المستقلة إلى الوصول الفوري ودون عوائق إلى مواقع الهجمات، وجمع الأدلة ذات الصلة وحفظها، وتوثيق ملابسات الحادثة، ومقابلة الناجين والشهود.
- نشدّد على الحاجة الملحّة إلى تحديد المسؤولية القانونية والجنائية عن أي انتهاكات ارتُكبت بحق المدنيين، وفقًا للقانون الدولي الواجب التطبيق، وضمان محاسبة المسؤولين عنها وعدم السماح بإفلاتهم من العقاب.
- ندعو جميع أطراف النزاع إلى التقيّد الصارم بمبدأ التمييز بين المدنيين والمقاتلين، واتخاذ كل الاحتياطات الممكنة لحماية المدنيين والأعيان المدنية من آثار العمليات العسكرية.
- نحثّ السكان المحليين والناجين والعاملين في المجال الإنساني وسائر الجهات المعنية على حفظ أي أدلة مادية أو رقمية تتعلق بالحادثة، حيثما أمكن القيام بذلك بأمان.
- نؤكد كذلك أهمية الحفاظ على سلامة مواقع الهجوم، وتجنّب أي عبث أو تغيير غير ضروري للأدلة حيثما كان ذلك آمنًا وممكنًا عمليًا، وتوثيق الوقائع ذات الصلة بالوسائل المتاحة دعمًا لمسارات المساءلة والعدالة مستقبلًا.
- لا يمكن بأي حال تبرير الاستهداف المتعمّد أو العشوائي للمدنيين بدواعٍ عسكرية أو سياسية.
- حماية أرواح المدنيين التزام بموجب القانون الدولي، ويجب أن تخضع الانتهاكات لتحقيق فعّال ومساءلة.

ويجدّد التحالف الدولي لمنظمات حقوق الإنسان التزامه برصد الانتهاكات وتوثيقها، ومتابعة المستجدات المتصلة بهذه الحادثة، ودعم الجهود الرامية إلى ضمان العدالة والمساءلة وسبل الانتصاف الفعّالة للضحايا وأسرهم.

---

**التحالف الدولي لحقوق الإنسان**

النهوض بحقوق الإنسان • السلام • العدالة

بروكسل، 31 يوليو 2026`;

const AR_EXCERPT =
  'يدين التحالف الهجوم الجوي الذي استهدف مدنيين عُزّلاً في منطقة شرشر بمحلية بارا الغربية، ولاية شمال كردفان. ويُفاد بأن طائرة عسكرية من طراز أنتونوف أقلعت من قاعدة وادي سيدنا الجوية في 29 يوليو 2026، أعقبتها ضربات على شرشر أسفرت عن سقوط ضحايا مدنيين. ويدعو التحالف بعثة تقصّي الحقائق المستقلة إلى الوصول إلى المواقع، وإلى تحديد المسؤولية القانونية والجنائية.';

const FR_BODY = `La Coalition internationale des organisations de défense des droits de l'homme exprime sa plus ferme condamnation et sa profonde préoccupation face à l'attaque aérienne effroyable qui a visé des civils non armés dans la zone de Shirshar, située dans la localité de Bara-Ouest, dans l'État du Kordofan du Nord.

Cette escalade dangereuse constitue une atteinte flagrante au droit à la vie et une violation grave des principes et des règles du droit international humanitaire et du droit international des droits de l'homme.

Sur la base de témoignages concordants et d'informations documentées, recueillies et vérifiées par la Coalition, un avion militaire de type Antonov aurait décollé de la base aérienne de Wadi Seidna le 29 juillet 2026 vers 13 h 30, heure locale. Vers 14 h 20, l'appareil a été observé survolant l'État du Kordofan du Nord en direction de la localité de Bara-Ouest, suivi d'une série de frappes aériennes qui ont directement visé la zone de Shirshar.

Les frappes ont fait des victimes civiles. Les photographies et les séquences vidéo examinées en lien avec l'incident montreraient des scènes profondément affligeantes et bouleversantes de victimes civiles, parmi lesquelles des femmes et des enfants.

**Face à ces violations et attaques graves qui touchent des vies civiles et des zones habitées, la Coalition internationale des organisations de défense des droits de l'homme appelle aux mesures urgentes suivantes :**

- Nous appelons catégoriquement la Mission indépendante d'établissement des faits à accéder immédiatement et sans entrave aux sites des attaques, à recueillir et à préserver les éléments de preuve pertinents, à documenter les circonstances de l'incident et à s'entretenir avec les survivants et les témoins.
- Nous soulignons la nécessité urgente d'établir la responsabilité juridique et pénale pour toute violation commise contre des civils, conformément au droit international applicable, et de veiller à ce que les responsables répondent de leurs actes et à ce que l'impunité ne prévale pas.
- Nous appelons toutes les parties au conflit à respecter strictement le principe de distinction entre civils et combattants et à prendre toutes les précautions possibles pour protéger les civils et les biens de caractère civil des effets des opérations militaires.
- Nous exhortons les habitants, les survivants, les travailleurs humanitaires et les autres acteurs concernés à conserver tout élément de preuve matériel ou numérique lié à l'incident, lorsque cela peut être fait en toute sécurité.
- Nous insistons en outre sur l'importance de préserver l'intégrité des sites des attaques, d'éviter toute perturbation ou altération inutile des preuves lorsque cela est sûr et réalisable, et de documenter les faits pertinents par les moyens disponibles afin de soutenir les futurs processus de responsabilité et de justice.
- Le ciblage délibéré ou indiscriminé de civils ne saurait en aucun cas être justifié par des considérations militaires ou politiques.
- La protection de la vie des civils est une obligation en vertu du droit international et les violations doivent faire l'objet d'enquêtes effectives et de mesures de responsabilité.

La Coalition internationale des organisations de défense des droits de l'homme réaffirme son engagement à surveiller et à documenter les violations, à suivre les développements liés à cet incident et à soutenir les efforts visant à garantir la justice, la responsabilité et des recours effectifs pour les victimes et leurs familles.

---

**LA COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME**

Promouvoir les droits de l'homme • La paix • La justice

Bruxelles, le 31 juillet 2026`;

const FR_EXCERPT =
  "La Coalition condamne l'attaque aérienne qui a visé des civils non armés dans la zone de Shirshar, localité de Bara-Ouest, État du Kordofan du Nord. Un avion militaire de type Antonov aurait décollé de la base aérienne de Wadi Seidna le 29 juillet 2026, suivi de frappes sur Shirshar ayant fait des victimes civiles. La Coalition appelle la Mission indépendante d'établissement des faits à accéder aux sites et demande que la responsabilité juridique et pénale soit établie.";

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Statement',
  date: '2026-07-31',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
  locales: [
    {
      locale: 'en',
      title:
        'Statement of Condemnation and Strong Denunciation: Airstrike Targeting Civilians in Shirshar Area, North Kordofan State',
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: 'Brussels',
      authorName: 'ICHR Communications',
      coverImageUrl: `/blog/${SLUG}/cover.jpg`,
      // The designed cards carry English text, so they hang off the English row only.
      gallery: [
        {
          url: `/blog/${SLUG}/card-1.jpg`,
          caption:
            'Statement card 1 of 3: the escalation as an assault on the right to life, the reported flight of a military Antonov from Wadi Seidna Air Base on 29 July 2026, the strikes on Shirshar and the resulting civilian casualties, and the first of the urgent measures — access for the Independent Fact-Finding Mission.',
          order: 0,
        },
        {
          url: `/blog/${SLUG}/card-2.jpg`,
          caption:
            'Statement card 2 of 3: the calls to establish legal and criminal responsibility, to uphold the principle of distinction between civilians and combatants, to preserve physical and digital evidence where it is safe to do so, and to protect the integrity of the attack sites.',
          order: 1,
        },
        {
          url: `/blog/${SLUG}/card-3.jpg`,
          caption:
            'Statement card 3 of 3: the protection of civilian life as an obligation under international law, and the Coalition’s commitment to monitoring and documenting violations and supporting justice, accountability and effective remedies for the victims and their families.',
          order: 2,
        },
      ],
    },
    {
      locale: 'ar',
      title:
        'بيان إدانة واستنكار شديد: غارة جوية تستهدف مدنيين في منطقة شرشر بولاية شمال كردفان',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'بروكسل',
      authorName: 'إعلام ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
    },
    {
      locale: 'fr',
      title:
        'Déclaration de condamnation et de vive dénonciation : frappe aérienne visant des civils dans la zone de Shirshar, État du Kordofan du Nord',
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Bruxelles',
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
