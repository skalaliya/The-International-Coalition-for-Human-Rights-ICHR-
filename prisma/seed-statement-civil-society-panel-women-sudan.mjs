// Joint press statement, 25 August 2026 — the report of the Geneva panel
// "Women's Condition and Violence in Wartime: Focus on the Sudan Crisis".
//
// Source: press/AUG/press-9 (content.rtf + 3 photographs). Supplied by Abdelrahim Grein.
//
// Issued jointly by ICHR, EADM, The Youth Future Alliance (TYFA) and Post Versa.
// NOTE the co-issuers: CAP Liberté de Conscience convened the event as originally
// announced but is NOT a co-issuer of this statement and does not appear on the event
// banner. The 23 August announcement was corrected to match — see
// seed-event-womens-condition-geneva.mjs.
//
// UPDATE 27 August 2026 — press-9/polished-content supersedes press-9/content.rtf.
//   * RETRACTION. The polished source DELETES the "International Determinations" paragraph
//     — the one attributing "indicators of genocidal intent" in Darfur and Kordofan to the UN
//     International Fact-Finding Mission. It was live in all three locales from 26 August and
//     has been removed. This is deliberate, not a truncation: the revised RTF and the five
//     independently-produced designed cards both omit it, the cut lands exactly on a paragraph
//     boundary, and NOTHING else in the text changed — not one of the source's typos was fixed.
//     Client confirmed 27 August. Do not reinstate it from content.rtf.
//   * The hero is now supplied artwork, card-1.jpg (P1), on all three locales — it carries the
//     ICHR seal, the dateline, the four co-issuers and a landscape crop of the panel photograph.
//     COVERS was therefore removed and gen-press-cover.mjs is not run for this statement.
//   * Gallery is the full statement as designed cards (card-2 … card-5) plus panel-2.jpg.
//     panel-1.jpg and event-card.jpg were dropped — card-1 is a better crop of the same frame,
//     and the event card is promotional and lives on the 23 August announcement.
//   * The supplied PDF has NO text layer (5 flattened pages, 8.63 MB) and was rebuilt from the
//     2000px cards, as with press-5 and press-6.
//   * The cards print "Abdel-Rahim Grein"; the body says "Abdelrahim Grein" (see NAME
//     SPELLING below). The artwork is the client's and was not retouched, so the printed
//     cards keep the hyphenated form.
//
// EDITORIAL DECISIONS — do not "improve" these on a re-run:
//   * The chemical-weapons attribution to the Sudanese Armed Forces (SAF), the Omdurman
//     (2024) incidents, the congenital-deformity finding and the UN Fact-Finding Mission's
//     "indicators of genocidal intent" are published VERBATIM as supplied, by the client's
//     explicit decision. Every "attributed to" / "reported" / "align with" hedge is
//     load-bearing and must survive translation. Do not soften and do not sharpen.
//   * The source rendered the Joint Call to Action as a 5-row table. It is published as
//     bold-label sections instead: no other article on the site uses a table, and a
//     two-column table of 30–40-word legal sentences is unreadable at 375px, especially
//     in Arabic RTL.
//   * Partner media contacts are KEPT (this is a joint statement — the partners' route to
//     press is theirs). ICHR's own email and tagline were dropped: they already appear in
//     the footer of every page and in the sign-off.
//
// SOURCE REPAIRS applied (character loss in the supplied RTF, same class as press-2's
// "communities at heightened Latin"):
//   * "14 million peoplenearly one-quarter of Sudan's populationhave been displaced"
//       → em-dashes restored around the parenthetical
//   * Five headings ended ":-" — normalised
//   * NAME SPELLING — settled 31 August 2026: "Abdelrahim Grein", VERIFIED BY ABDELRAHIM
//     GREIN HIMSELF. This is the authority; do not re-derive it from any document.
//     History, because this flip-flopped once and the reasoning must not be lost: the
//     supplied RTF read "Abdel-Rahim Grein"; on 26 August the house spelling was set to
//     "Abderrahim Grein" (with an R) and this statement, the 23 August announcement and
//     the /media entries were normalised to that. The subject then confirmed the correct
//     spelling is "Abdelrahim" (with an L), and everything was normalised again on
//     31 August. The YouTube channel had it right the whole time.
//     The Arabic (عبد الرحيم قرين) is unaffected either way — عبد الرحيم transliterates
//     to both Latin forms — and was never changed.
//     The client's original RTF still carries the hyphenated "Abdel-Rahim"; a re-import
//     from source will reintroduce it.
//
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-civil-society-panel-women-sudan.mjs
//               node --env-file=.env.local prisma/seed-statement-civil-society-panel-women-sudan.mjs
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-civil-society-panel-women-sudan.mjs
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-civil-society-panel-women-sudan.mjs
//
// Covers: node scripts/gen-press-cover.mjs prisma/seed-statement-civil-society-panel-women-sudan.mjs
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'civil-society-panel-women-sudan-geneva-august-2026';
export const TRANSLATION_KEY = '0e88f954-80f2-4496-802c-4798184155ac';

const EADM_FB = 'https://facebook.com/p/European-Association-for-The-Defense-of-Minorities-100068442871271';

const EN_BODY = `*Issued jointly by the International Coalition for Human Rights (ICHR), the European Association for the Defence of Minorities (EADM), The Youth Future Alliance (TYFA) and Post Versa.*

GENEVA — Civil society leaders, human rights defenders and legal experts convened in Geneva on 25 August 2026 for an international panel titled "Women's Condition and Violence in Wartime: Focus on the Sudan Crisis."

The session examined the severe deterioration of human rights and international humanitarian law standards in Sudan, with a focus on gender-based violence, the destruction of civilian infrastructure, and reported chemical weapons employment.

The panel comprised:

- **Ramon Rahangmetan** — Co-founder, Circle of Sustainable Europe
- **Manel Msalmi** — President, EADM; Advisor on MENA Affairs, European Parliament
- **Andy Vermaut** — Vice President, EADM; President, World Council for Public Diplomacy and Community Dialogue
- **Abdelrahim Grein** — Representative, ICHR
- **Dr. Mohamed Ali** — ICHR

## Core human rights findings presented

Panellists presented evidence detailing grave violations of international human rights and humanitarian law across Sudan.

**Gender-based and sexual violence.** Interventions underscored that sexual violence, rape and forced displacement are being utilised systematically as instruments of warfare. Speakers highlighted that these atrocities reflect long-standing patterns of structural violence and cause enduring physical and psychological trauma to survivors.

**Chemical weapons allegations.** Submissions highlighted documented incidents from Omdurman (2024) involving chemical agents attributed to the Sudanese Armed Forces (SAF). Presenters detailed severe, long-term health consequences for exposed civilian populations, particularly women and children, including respiratory failure and congenital physical deformities.

**Militarisation of essential infrastructure.** Reports indicate that over 80 percent of health facilities in active conflict zones have been rendered non-functional, destroyed, or converted to military use. The targeted destruction of medical facilities, schools and essential utility infrastructure has crippled maternal care and access to basic education.

## Joint call to action

The co-organising human rights organisations call upon the United Nations, the European Union, the International Criminal Court (ICC), the Organisation for the Prohibition of Chemical Weapons (OPCW) and the broader international community to implement the following priority measures.

**Accountability and justice.** Establish an independent, international fact-finding mission with technical OPCW participation to investigate alleged chemical weapons use and gender-based crimes, with a direct referral of perpetrators to the ICC without immunity.

**Civilian protection.** Mandate and enforce a robust protection framework, including a comprehensive no-fly zone over civilian population centres, to mitigate indiscriminate aerial bombardment and drone strikes.

**Humanitarian access.** Guarantee immediate, safe and unhindered humanitarian corridors across all territorial boundaries to deliver emergency medical care, food relief and reproductive healthcare services.

**Survivors' support.** Direct dedicated international funding toward survivor-centred medical, psychological and specialised toxicological care for victims of chemical agent exposure and conflict-related sexual violence.

**Women, peace and security.** Ensure the direct, meaningful and non-tokenistic participation of Sudanese women in all formal peace negotiations, transitional mechanisms and constitutional processes, pursuant to UN Security Council Resolution 1325.

## Contextual background and key data

**Forced displacement.** According to UNHCR data (April 2026), approximately 14 million people — nearly one-quarter of Sudan's population — have been displaced since April 2023, including over 4.4 million refugees seeking protection across international borders.

**Acute food insecurity.** Over half of the civilian population faces emergency levels of food insecurity, with famine conditions verified across multiple regions.

**Ongoing violence in Kordofan.** UN OCHA reports confirm that over 200,000 individuals have experienced recent displacement in the Kordofan region following sustained strikes on civilian infrastructure.

## Media contacts

**European Association for the Defence of Minorities (EADM)** — [WCPDCD.eadm@gmail.com](mailto:WCPDCD.eadm@gmail.com) · [Facebook](${EADM_FB})

**The Youth Future Alliance (TYFA)** — [www.theyfa.com](https://www.theyfa.com)

Full statements, technical reports and legal submissions are available to international monitoring bodies upon request.

---

**THE INTERNATIONAL COALITION FOR HUMAN RIGHTS**

Advancing Human Rights • Peace • Justice

Geneva, 25 August 2026`;

const EN_EXCERPT =
  'Civil society leaders, human rights defenders and legal experts convened in Geneva on 25 August 2026 for the panel "Women’s Condition and Violence in Wartime: Focus on the Sudan Crisis." Issued jointly by ICHR, EADM, TYFA and Post Versa, the statement urges an independent fact-finding mission with OPCW participation, ICC referral without immunity, and the meaningful participation of Sudanese women in all peace processes.';

const AR_BODY = `*صادر بصورة مشتركة عن التحالف الدولي لحقوق الإنسان (ICHR)، والرابطة الأوروبية للدفاع عن الأقليات (EADM)، وتحالف مستقبل الشباب (TYFA)، وPost Versa.*

جنيف — اجتمع قادة من المجتمع المدني ومدافعون عن حقوق الإنسان وخبراء قانونيون في جنيف يوم 25 أغسطس 2026 في حلقة نقاش دولية بعنوان «أوضاع النساء والعنف في زمن الحرب: تركيز على الأزمة السودانية».

وتناولت الجلسة التدهور الحاد في معايير حقوق الإنسان والقانون الدولي الإنساني في السودان، مع التركيز على العنف القائم على النوع الاجتماعي، وتدمير البنية التحتية المدنية، والاستخدام المُبلَّغ عنه للأسلحة الكيميائية.

وضمّت الحلقة:

- **رامون راهانغميتان** — شريك مؤسِّس، Circle of Sustainable Europe
- **مانيل مسلمي** — رئيسة الرابطة الأوروبية للدفاع عن الأقليات؛ مستشارة لشؤون الشرق الأوسط وشمال أفريقيا في البرلمان الأوروبي
- **آندي فيرمو** — نائب رئيس الرابطة الأوروبية للدفاع عن الأقليات؛ رئيس المجلس العالمي للدبلوماسية العامة والحوار المجتمعي
- **عبد الرحيم قرين** — ممثل التحالف الدولي لحقوق الإنسان
- **الدكتور محمد علي** — التحالف الدولي لحقوق الإنسان

## أبرز النتائج المعروضة في مجال حقوق الإنسان

عرض المتحدثون أدلة توثّق انتهاكات جسيمة للقانون الدولي لحقوق الإنسان والقانون الدولي الإنساني في أنحاء السودان.

**العنف الجنسي والعنف القائم على النوع الاجتماعي.** أكدت المداخلات أن العنف الجنسي والاغتصاب والتهجير القسري تُستخدم بصورة منهجية كأدوات حرب. وشدّد المتحدثون على أن هذه الفظائع تعكس أنماطًا راسخة من العنف البنيوي وتخلّف آثارًا جسدية ونفسية دائمة لدى الناجين.

**ادعاءات استخدام الأسلحة الكيميائية.** سلّطت المداخلات الضوء على حوادث موثّقة في أم درمان (2024) تتعلق بعوامل كيميائية تُنسب إلى القوات المسلحة السودانية. وفصّل المتحدثون العواقب الصحية الجسيمة وطويلة الأمد على السكان المدنيين المعرّضين، ولا سيما النساء والأطفال، بما في ذلك الفشل التنفسي والتشوهات الخلقية.

**عسكرة البنية التحتية الأساسية.** تشير التقارير إلى أن أكثر من 80 في المائة من المرافق الصحية في مناطق النزاع النشط أصبحت خارج الخدمة أو دُمّرت أو حُوّلت إلى استخدام عسكري. وقد أدى الاستهداف المتعمّد للمرافق الطبية والمدارس والبنية التحتية الأساسية إلى شلّ رعاية الأمومة والوصول إلى التعليم الأساسي.

## نداء مشترك للعمل

تدعو المنظمات الحقوقية المشاركة في التنظيم الأممَ المتحدة والاتحاد الأوروبي والمحكمة الجنائية الدولية ومنظمة حظر الأسلحة الكيميائية والمجتمع الدولي الأوسع إلى تنفيذ التدابير ذات الأولوية التالية.

**المساءلة والعدالة.** إنشاء بعثة دولية مستقلة لتقصي الحقائق بمشاركة تقنية من منظمة حظر الأسلحة الكيميائية للتحقيق في الاستخدام المزعوم للأسلحة الكيميائية والجرائم القائمة على النوع الاجتماعي، مع إحالة مباشرة للجناة إلى المحكمة الجنائية الدولية دون حصانة.

**حماية المدنيين.** إقرار وإنفاذ إطار حماية قوي، يشمل منطقة حظر جوي شاملة فوق مراكز التجمعات السكانية المدنية، للحد من القصف الجوي العشوائي وضربات الطائرات المسيّرة.

**وصول المساعدات الإنسانية.** ضمان ممرات إنسانية فورية وآمنة ودون عوائق عبر جميع الحدود لإيصال الرعاية الطبية الطارئة والإغاثة الغذائية وخدمات الصحة الإنجابية.

**دعم الناجين.** توجيه تمويل دولي مخصص للرعاية الطبية والنفسية والسمّية المتخصصة المتمحورة حول الناجين، لضحايا التعرض للعوامل الكيميائية والعنف الجنسي المرتبط بالنزاع.

**المرأة والسلام والأمن.** ضمان المشاركة المباشرة والفعلية وغير الشكلية للنساء السودانيات في جميع مفاوضات السلام الرسمية والآليات الانتقالية والعمليات الدستورية، عملًا بقرار مجلس الأمن الدولي 1325.

## خلفية سياقية وبيانات أساسية

**النزوح القسري.** وفقًا لبيانات المفوضية السامية للأمم المتحدة لشؤون اللاجئين (أبريل 2026)، نزح نحو 14 مليون شخص — أي ما يقارب ربع سكان السودان — منذ أبريل 2023، بينهم أكثر من 4.4 مليون لاجئ يلتمسون الحماية عبر الحدود الدولية.

**انعدام الأمن الغذائي الحاد.** يواجه أكثر من نصف السكان المدنيين مستويات طارئة من انعدام الأمن الغذائي، مع تأكّد ظروف المجاعة في مناطق متعددة.

**استمرار العنف في كردفان.** تؤكد تقارير مكتب الأمم المتحدة لتنسيق الشؤون الإنسانية نزوح أكثر من 200 ألف شخص مؤخرًا في إقليم كردفان في أعقاب ضربات متواصلة على البنية التحتية المدنية.

## جهات الاتصال الإعلامية

**الرابطة الأوروبية للدفاع عن الأقليات (EADM)** — [WCPDCD.eadm@gmail.com](mailto:WCPDCD.eadm@gmail.com) · [فيسبوك](${EADM_FB})

**تحالف مستقبل الشباب (TYFA)** — [www.theyfa.com](https://www.theyfa.com)

البيانات الكاملة والتقارير الفنية والمذكرات القانونية متاحة لهيئات الرصد الدولية عند الطلب.

---

**التحالف الدولي لحقوق الإنسان**

النهوض بحقوق الإنسان • السلام • العدالة

جنيف، 25 أغسطس 2026`;

const AR_EXCERPT =
  'اجتمع قادة من المجتمع المدني ومدافعون عن حقوق الإنسان وخبراء قانونيون في جنيف يوم 25 أغسطس 2026 في حلقة نقاش بعنوان «أوضاع النساء والعنف في زمن الحرب: تركيز على الأزمة السودانية». ويدعو البيان، الصادر بصورة مشتركة عن التحالف الدولي لحقوق الإنسان والرابطة الأوروبية للدفاع عن الأقليات وتحالف مستقبل الشباب وPost Versa، إلى بعثة مستقلة لتقصي الحقائق بمشاركة منظمة حظر الأسلحة الكيميائية، وإحالة إلى المحكمة الجنائية الدولية دون حصانة، ومشاركة فعلية للنساء السودانيات في جميع عمليات السلام.';

const FR_BODY = `*Publié conjointement par la Coalition internationale pour les droits de l'homme (ICHR), l'Association européenne pour la défense des minorités (EADM), The Youth Future Alliance (TYFA) et Post Versa.*

GENÈVE — Des responsables de la société civile, des défenseurs des droits humains et des experts juridiques se sont réunis à Genève le 25 août 2026 pour une table ronde internationale intitulée « Women's Condition and Violence in Wartime: Focus on the Sudan Crisis ».

La séance a examiné la grave dégradation des normes relatives aux droits humains et au droit international humanitaire au Soudan, en mettant l'accent sur les violences fondées sur le genre, la destruction des infrastructures civiles et l'emploi signalé d'armes chimiques.

La table ronde réunissait :

- **Ramon Rahangmetan** — cofondateur, Circle of Sustainable Europe
- **Manel Msalmi** — présidente de l'EADM ; conseillère pour les affaires MENA au Parlement européen
- **Andy Vermaut** — vice-président de l'EADM ; président du World Council for Public Diplomacy and Community Dialogue
- **Abdelrahim Grein** — représentant de l'ICHR
- **Dr Mohamed Ali** — ICHR

## Principaux constats présentés en matière de droits humains

Les intervenants ont présenté des éléments documentant de graves violations du droit international des droits humains et du droit international humanitaire à travers le Soudan.

**Violences sexuelles et fondées sur le genre.** Les interventions ont souligné que les violences sexuelles, le viol et le déplacement forcé sont employés de manière systématique comme instruments de guerre. Les intervenants ont relevé que ces atrocités s'inscrivent dans des schémas anciens de violence structurelle et causent aux survivantes des traumatismes physiques et psychologiques durables.

**Allégations d'emploi d'armes chimiques.** Les contributions ont mis en avant des incidents documentés à Omdourman (2024) impliquant des agents chimiques attribués aux Forces armées soudanaises (FAS). Les intervenants ont détaillé des conséquences sanitaires graves et durables pour les populations civiles exposées, en particulier les femmes et les enfants, notamment des insuffisances respiratoires et des malformations congénitales.

**Militarisation des infrastructures essentielles.** Selon les rapports, plus de 80 pour cent des structures de santé situées en zone de conflit actif sont hors service, détruites ou converties à un usage militaire. La destruction ciblée des installations médicales, des écoles et des infrastructures essentielles a paralysé les soins maternels et l'accès à l'éducation de base.

## Appel commun à l'action

Les organisations de défense des droits humains coorganisatrices appellent les Nations Unies, l'Union européenne, la Cour pénale internationale (CPI), l'Organisation pour l'interdiction des armes chimiques (OIAC) et l'ensemble de la communauté internationale à mettre en œuvre les mesures prioritaires suivantes.

**Responsabilité et justice.** Créer une mission internationale indépendante d'établissement des faits, avec une participation technique de l'OIAC, pour enquêter sur l'emploi allégué d'armes chimiques et sur les crimes fondés sur le genre, assortie d'un renvoi direct des auteurs devant la CPI, sans immunité.

**Protection des civils.** Instituer et faire respecter un cadre de protection robuste, comprenant une zone d'exclusion aérienne étendue au-dessus des centres de population civile, afin de limiter les bombardements aériens indiscriminés et les frappes de drones.

**Accès humanitaire.** Garantir des couloirs humanitaires immédiats, sûrs et sans entrave à travers toutes les frontières, afin d'acheminer les soins médicaux d'urgence, l'aide alimentaire et les services de santé reproductive.

**Soutien aux survivantes.** Affecter un financement international dédié aux soins médicaux, psychologiques et toxicologiques spécialisés, centrés sur les survivantes, pour les victimes d'exposition à des agents chimiques et de violences sexuelles liées au conflit.

**Femmes, paix et sécurité.** Assurer la participation directe, effective et non symbolique des femmes soudanaises à toutes les négociations de paix formelles, aux mécanismes de transition et aux processus constitutionnels, conformément à la résolution 1325 du Conseil de sécurité des Nations Unies.

## Éléments de contexte et données clés

**Déplacements forcés.** Selon les données du HCR (avril 2026), quelque 14 millions de personnes — près du quart de la population soudanaise — ont été déplacées depuis avril 2023, dont plus de 4,4 millions de réfugiés cherchant protection au-delà des frontières internationales.

**Insécurité alimentaire aiguë.** Plus de la moitié de la population civile fait face à des niveaux d'urgence d'insécurité alimentaire, des conditions de famine étant confirmées dans plusieurs régions.

**Violences persistantes au Kordofan.** Les rapports d'OCHA confirment que plus de 200 000 personnes ont récemment été déplacées dans la région du Kordofan à la suite de frappes soutenues sur des infrastructures civiles.

## Contacts presse

**Association européenne pour la défense des minorités (EADM)** — [WCPDCD.eadm@gmail.com](mailto:WCPDCD.eadm@gmail.com) · [Facebook](${EADM_FB})

**The Youth Future Alliance (TYFA)** — [www.theyfa.com](https://www.theyfa.com)

Les déclarations complètes, rapports techniques et soumissions juridiques sont disponibles sur demande pour les organes de suivi internationaux.

---

**LA COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME**

Promouvoir les droits de l'homme • La paix • La justice

Genève, le 25 août 2026`;

const FR_EXCERPT =
  "Des responsables de la société civile, des défenseurs des droits humains et des experts juridiques se sont réunis à Genève le 25 août 2026 pour la table ronde « Women's Condition and Violence in Wartime: Focus on the Sudan Crisis ». Publiée conjointement par l'ICHR, l'EADM, TYFA et Post Versa, la déclaration appelle à une mission indépendante d'établissement des faits avec participation de l'OIAC, à un renvoi devant la CPI sans immunité, et à la participation effective des femmes soudanaises à tous les processus de paix.";

// Designed statement cards supplied 27 August (press-9/polished-content, P1–P5, 2000x2000).
// C1 is the hero: it already carries the ICHR seal, the dateline, the four co-issuers and a
// properly-cropped landscape version of the panel photograph. It heads all three locales.
const C1 = `/blog/${SLUG}/card-1.jpg`;
const C2 = `/blog/${SLUG}/card-2.jpg`;
const C3 = `/blog/${SLUG}/card-3.jpg`;
const C4 = `/blog/${SLUG}/card-4.jpg`;
const C5 = `/blog/${SLUG}/card-5.jpg`;
const PANEL = `/blog/${SLUG}/panel-2.jpg`;

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Press Release',
  date: '2026-08-25',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan', '#Geneva'],
  locales: [
    {
      locale: 'en',
      title:
        'Civil Society Panel in Geneva Addresses Systematic Violations Against Women in Sudan, Urges ICC Referral and OPCW Investigation into Chemical Weapons Use',
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: 'Geneva',
      authorName: 'ICHR Communications',
      coverImageUrl: C1,
      gallery: [
        { url: C2, caption: 'Statement card 1 of 4: the scope of the session, the five panellists, and the core findings on gender-based and sexual violence and on the chemical weapons allegations.', order: 0 },
        { url: C3, caption: 'Statement card 2 of 4: the militarisation of essential infrastructure, and the joint call to action on accountability and justice, civilian protection, humanitarian access and survivors’ support.', order: 1 },
        { url: C4, caption: 'Statement card 3 of 4: women, peace and security under UN Security Council Resolution 1325, and contextual data on forced displacement, acute food insecurity and continuing violence in Kordofan.', order: 2 },
        { url: C5, caption: 'Statement card 4 of 4: media contacts for the International Coalition for Human Rights, the European Association for the Defence of Minorities and The Youth Future Alliance.', order: 3 },
        { url: PANEL, caption: 'Abdelrahim Grein and Dr. Mohamed Ali representing the International Coalition for Human Rights at the Geneva panel, 25 August 2026.', order: 4 },
      ],
    },
    {
      locale: 'ar',
      title:
        'حلقة نقاش للمجتمع المدني في جنيف تتناول الانتهاكات المنهجية بحق النساء في السودان وتدعو إلى الإحالة إلى المحكمة الجنائية الدولية وإلى تحقيق لمنظمة حظر الأسلحة الكيميائية',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'جنيف',
      authorName: 'إعلام ICHR',
      coverImageUrl: C1,
      gallery: [
        { url: C2, caption: 'بطاقة البيان 1 من 4: نطاق الجلسة، والمتحدثون الخمسة، وأبرز النتائج بشأن العنف الجنسي والعنف القائم على النوع الاجتماعي وادعاءات استخدام الأسلحة الكيميائية. (البطاقة بالإنجليزية.)', order: 0 },
        { url: C3, caption: 'بطاقة البيان 2 من 4: عسكرة البنية التحتية الأساسية، والنداء المشترك للعمل بشأن المساءلة والعدالة وحماية المدنيين ووصول المساعدات الإنسانية ودعم الناجين. (البطاقة بالإنجليزية.)', order: 1 },
        { url: C4, caption: 'بطاقة البيان 3 من 4: المرأة والسلام والأمن عملًا بقرار مجلس الأمن 1325، وبيانات سياقية عن النزوح القسري وانعدام الأمن الغذائي الحاد واستمرار العنف في كردفان. (البطاقة بالإنجليزية.)', order: 2 },
        { url: C5, caption: 'بطاقة البيان 4 من 4: جهات الاتصال الإعلامية للتحالف الدولي لحقوق الإنسان والرابطة الأوروبية للدفاع عن الأقليات وتحالف مستقبل الشباب. (البطاقة بالإنجليزية.)', order: 3 },
        { url: PANEL, caption: 'عبد الرحيم قرين والدكتور محمد علي ممثلَين التحالف الدولي لحقوق الإنسان في حلقة النقاش بجنيف، 25 أغسطس 2026.', order: 4 },
      ],
    },
    {
      locale: 'fr',
      title:
        "Une table ronde de la société civile à Genève dénonce les violations systématiques visant les femmes au Soudan et réclame un renvoi devant la CPI et une enquête de l'OIAC",
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Genève',
      authorName: 'Communication ICHR',
      coverImageUrl: C1,
      gallery: [
        { url: C2, caption: "Carte 1 sur 4 : le périmètre de la séance, les cinq intervenants, et les constats principaux sur les violences sexuelles et fondées sur le genre et sur les allégations d'emploi d'armes chimiques. (Carte en anglais.)", order: 0 },
        { url: C3, caption: "Carte 2 sur 4 : la militarisation des infrastructures essentielles, et l'appel commun à l'action sur la responsabilité et la justice, la protection des civils, l'accès humanitaire et le soutien aux survivantes. (Carte en anglais.)", order: 1 },
        { url: C4, caption: "Carte 3 sur 4 : femmes, paix et sécurité au titre de la résolution 1325 du Conseil de sécurité, et données de contexte sur les déplacements forcés, l'insécurité alimentaire aiguë et les violences persistantes au Kordofan. (Carte en anglais.)", order: 2 },
        { url: C5, caption: "Carte 4 sur 4 : contacts presse de la Coalition internationale pour les droits de l'homme, de l'Association européenne pour la défense des minorités et de The Youth Future Alliance. (Carte en anglais.)", order: 3 },
        { url: PANEL, caption: "Abdelrahim Grein et le Dr Mohamed Ali représentant la Coalition internationale pour les droits de l'homme lors de la table ronde de Genève, le 25 août 2026.", order: 4 },
      ],
    },
  ],
};

// No COVERS export: all three locales are headed by supplied artwork (card-1.jpg), so
// scripts/gen-press-cover.mjs is not run for this statement. The generated cover.jpg /
// cover-ar.jpg / cover-fr.jpg from the 26 August version remain on disk, unreferenced.

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
