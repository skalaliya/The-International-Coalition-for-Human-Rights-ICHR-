// ICHR co-organises the side event
// "Women's Condition and Violence in Wartime — Focus: The Sudan Crisis"
// at the Club Suisse de la Presse, Geneva, on 25 August 2026.
//
// This is the first article on the site in the `News` category. It is an
// EVENT ANNOUNCEMENT, not an ICHR statement — the copy is ICHR's own. It
// deliberately does NOT translate or reproduce the In de Gazette article, which
// is Andy Vermaut's copyright; that piece is credited and linked at the foot of
// each locale instead.
//
// CORRECTION (26 August 2026, after the event). This article was first published
// on 23 August from the In de Gazette preview and the CAP poster, which put the
// event at Room VIII, Palais des Nations, convened by CAP Liberté de Conscience.
// The event moved after that preview: photographs from the day (press-9) show it
// was held at the Club Suisse de la Presse, Domaine de Penthes, with no CAP
// branding on the banner, co-organised by ICHR, EADM, The Youth Future Alliance
// and Post Versa, and a five-person panel (Valle, Wachsmuth and Thierrée did not
// take part). Venue, co-organisers, panel, the gallery image (the CAP poster is
// replaced by the real event card) and all three cover standfirsts were corrected
// in place — same SLUG and TRANSLATION_KEY — at the client's decision, with no
// on-page correction notice.
//
// Two notes carried over from the first cut:
//   1. In de Gazette is not independent coverage — Andy Vermaut wrote it AND sits
//      on the panel. The credit line says so rather than calling it press coverage.
//   2. The body uses ICHR's real name throughout, not the two variants the CAP
//      poster carried.
//
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-event-womens-condition-geneva.mjs
//               node --env-file=.env.local prisma/seed-event-womens-condition-geneva.mjs   # draft
//   PUBLISH=1   node --env-file=.env.local prisma/seed-event-womens-condition-geneva.mjs   # live
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-event-womens-condition-geneva.mjs
//
// Covers: node scripts/gen-press-cover.mjs prisma/seed-event-womens-condition-geneva.mjs
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'womens-condition-violence-wartime-geneva-august-2026';
// Generated once. Never regenerate — this binds the three locales for the
// language toggle, the hreflang alternates and the sitemap grouping.
export const TRANSLATION_KEY = '526df883-538b-4141-aaa4-64336577f4ef';

const SOURCE_URL = 'https://www.indegazette.be/geneve-zet-situatie-van-vrouwen-in-oorlog-centraal/';

const EN_BODY = `The **International Coalition for Human Rights** is a co-organiser of **"Women's Condition and Violence in Wartime — Focus: The Sudan Crisis"**, a side event held at the Club Suisse de la Presse in Geneva.

## Event details

- **Date:** Tuesday, 25 August 2026
- **Time:** 15:00 – 17:00
- **Venue:** Club Suisse de la Presse, Domaine de Penthes, Chemin de l'Impératrice 18, Geneva
- **Co-organised by:** the International Coalition for Human Rights, the European Association for the Defence of Minorities, The Youth Future Alliance and Post Versa

## What the panel will examine

The session examines the deterioration of women's condition in contemporary armed conflicts, with particular attention to the crisis in Sudan: mass displacement, the collapse of reproductive health services, sexual violence used as a weapon of war, and the denial of humanitarian access. Participants will share field experience and formulate concrete recommendations for the United Nations.

Sexual and gender-based violence is not an incidental consequence of war. Where it is used systematically it is an instrument of power and subjugation, and survivors carry its physical, psychological and social effects long after the fighting has stopped.

Where hospitals and clinics are destroyed or cannot be reached, pregnant women, survivors of sexual violence and girls are the first to lose care. Displacement costs more than a home: it severs livelihoods, community networks and the ordinary structures that keep people safe.

Women are not only affected by these conflicts. They are also builders of peace, and their participation in negotiations and in decision-making is a condition of any durable settlement — not a courtesy extended once one has been reached.

## Panel

- **Ramon Rahangmetan** — Co-founder, Circle of Sustainable Europe
- **Manel Msalmi** — President, EADM; Advisor on MENA Affairs, European Parliament
- **Andy Vermaut** — Vice President, EADM; President, World Council for Public Diplomacy and Community Dialogue
- **Abderrahim Grein** — Representative, International Coalition for Human Rights
- **Dr. Mohamed Ali** — International Coalition for Human Rights

The event was previewed by panellist and journalist Andy Vermaut in the Belgian outlet *In de Gazette*: [Genève zet situatie van vrouwen in oorlog centraal](${SOURCE_URL}) (in Dutch).

---

**THE INTERNATIONAL COALITION FOR HUMAN RIGHTS**

Advancing Human Rights • Peace • Justice

Geneva / Brussels / New York, 23 August 2026`;

const EN_EXCERPT =
  'The International Coalition for Human Rights is a co-organiser of "Women’s Condition and Violence in Wartime — Focus: The Sudan Crisis", a side event held at the Club Suisse de la Presse in Geneva on Tuesday 25 August 2026, 15:00–17:00. ICHR is represented on the panel by Abderrahim Grein and Dr. Mohamed Ali.';

const AR_BODY = `يشارك **التحالف الدولي لحقوق الإنسان** في تنظيم فعالية جانبية بعنوان **«أوضاع النساء والعنف في زمن الحرب — تركيز: الأزمة السودانية»**، تُقام في النادي السويسري للصحافة بجنيف.

## تفاصيل الفعالية

- **التاريخ:** الثلاثاء 25 أغسطس 2026
- **التوقيت:** 15:00 – 17:00
- **المكان:** النادي السويسري للصحافة، دومين دو بانت، شومان دو ليمبيراتريس 18، جنيف
- **بتنظيم مشترك من:** التحالف الدولي لحقوق الإنسان والرابطة الأوروبية للدفاع عن الأقليات وتحالف مستقبل الشباب وPost Versa

## محاور النقاش

تتناول الحلقة تدهور أوضاع النساء في النزاعات المسلحة المعاصرة، مع تركيز خاص على الأزمة في السودان: النزوح الجماعي، وانهيار خدمات الصحة الإنجابية، واستخدام العنف الجنسي سلاحًا في الحرب، ومنع وصول المساعدات الإنسانية. ويعرض المشاركون خبراتهم الميدانية ويصوغون توصيات عملية تُرفع إلى الأمم المتحدة.

إن العنف الجنسي والعنف القائم على النوع الاجتماعي ليس أثرًا عرضيًا للحرب. وحيثما استُخدم على نحو منهجي فهو أداة للسيطرة والإخضاع، ويحمل الناجون آثاره الجسدية والنفسية والاجتماعية بعد توقف القتال بوقت طويل.

وحين تُدمَّر المستشفيات والعيادات أو يتعذّر الوصول إليها، تكون النساء الحوامل والناجيات من العنف الجنسي والفتيات أول من يفقد الرعاية. والنزوح لا يعني فقدان المسكن وحده، بل انقطاع مصادر الرزق وشبكات المجتمع والبنى اليومية التي تحفظ الأمان.

والنساء لسن متضررات من هذه النزاعات فحسب، بل هنّ أيضًا صانعات سلام، ومشاركتهنّ في المفاوضات وفي مواقع القرار شرط لأي تسوية دائمة — لا مجاملة تُمنح بعد التوصل إليها.

## المتحدثون

- **رامون راهانغميتان** — شريك مؤسِّس، Circle of Sustainable Europe
- **مانيل مسلمي** — رئيسة الرابطة الأوروبية للدفاع عن الأقليات؛ مستشارة لشؤون الشرق الأوسط وشمال أفريقيا في البرلمان الأوروبي
- **آندي فيرمو** — نائب رئيس الرابطة الأوروبية للدفاع عن الأقليات؛ رئيس المجلس العالمي للدبلوماسية العامة والحوار المجتمعي
- **عبد الرحيم قرين** — ممثل التحالف الدولي لحقوق الإنسان
- **الدكتور محمد علي** — التحالف الدولي لحقوق الإنسان

وقد نشر عضو حلقة النقاش والصحفي آندي فيرمو عرضًا تمهيديًا للفعالية في الصحيفة البلجيكية *In de Gazette*: [Genève zet situatie van vrouwen in oorlog centraal](${SOURCE_URL}) (بالهولندية).

---

**التحالف الدولي لحقوق الإنسان**

النهوض بحقوق الإنسان • السلام • العدالة

جنيف، بروكسل، نيويورك، 23 أغسطس 2026`;

const AR_EXCERPT =
  'يشارك التحالف الدولي لحقوق الإنسان في تنظيم فعالية جانبية بعنوان «أوضاع النساء والعنف في زمن الحرب — تركيز: الأزمة السودانية»، تُقام في النادي السويسري للصحافة بجنيف يوم الثلاثاء 25 أغسطس 2026، من الساعة 15:00 إلى 17:00. ويمثّل التحالف في حلقة النقاش عبد الرحيم قرين والدكتور محمد علي.';

const FR_BODY = `La **Coalition internationale pour les droits de l'homme** est coorganisatrice de **« Women's Condition and Violence in Wartime — Focus: The Sudan Crisis »**, un événement parallèle qui se tient au Club Suisse de la Presse à Genève.

## Informations pratiques

- **Date :** mardi 25 août 2026
- **Horaire :** 15h00 – 17h00
- **Lieu :** Club Suisse de la Presse, Domaine de Penthes, chemin de l'Impératrice 18, Genève
- **Coorganisé par :** la Coalition internationale pour les droits de l'homme, l'Association européenne pour la défense des minorités, The Youth Future Alliance et Post Versa

## Les thèmes de la table ronde

La séance examine la dégradation de la condition des femmes dans les conflits armés contemporains, avec une attention particulière à la crise soudanaise : déplacements massifs, effondrement des services de santé reproductive, violences sexuelles employées comme arme de guerre et refus de l'accès humanitaire. Les intervenants partageront leur expérience de terrain et formuleront des recommandations concrètes à l'intention des Nations Unies.

Les violences sexuelles et fondées sur le genre ne sont pas une conséquence accessoire de la guerre. Employées de manière systématique, elles constituent un instrument de pouvoir et de soumission, et les survivantes en portent les effets physiques, psychologiques et sociaux longtemps après la fin des combats.

Là où les hôpitaux et les dispensaires sont détruits ou inaccessibles, les femmes enceintes, les survivantes de violences sexuelles et les filles sont les premières à perdre l'accès aux soins. Le déplacement forcé ne coûte pas seulement un logement : il rompt les moyens de subsistance, les réseaux communautaires et les structures ordinaires qui assurent la sécurité.

Les femmes ne sont pas seulement affectées par ces conflits. Elles sont aussi des artisanes de paix, et leur participation aux négociations et aux instances de décision est une condition de tout règlement durable — non une faveur accordée une fois celui-ci obtenu.

## Intervenants

- **Ramon Rahangmetan** — cofondateur, Circle of Sustainable Europe
- **Manel Msalmi** — présidente de l'EADM ; conseillère pour les affaires MENA au Parlement européen
- **Andy Vermaut** — vice-président de l'EADM ; président du World Council for Public Diplomacy and Community Dialogue
- **Abderrahim Grein** — représentant de la Coalition internationale pour les droits de l'homme
- **Dr Mohamed Ali** — Coalition internationale pour les droits de l'homme

L'événement a fait l'objet d'une présentation par le panéliste et journaliste Andy Vermaut dans le média belge *In de Gazette* : [Genève zet situatie van vrouwen in oorlog centraal](${SOURCE_URL}) (en néerlandais).

---

**LA COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME**

Promouvoir les droits de l'homme • La paix • La justice

Genève / Bruxelles / New York, le 23 août 2026`;

const FR_EXCERPT =
  "La Coalition internationale pour les droits de l'homme est coorganisatrice de « Women's Condition and Violence in Wartime — Focus: The Sudan Crisis », un événement parallèle qui se tient au Club Suisse de la Presse à Genève, le mardi 25 août 2026 de 15h00 à 17h00. La Coalition est représentée sur le panel par Abderrahim Grein et le Dr Mohamed Ali.";

// The event card is a photograph of the event banner (English-only) and the only
// visual that exists for this event. It therefore appears on all three locales
// rather than the English row alone; the caption is written in the page language.
const POSTER = `/blog/${SLUG}/event-card.jpg`;

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'News',
  date: '2026-08-23',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan', '#Geneva'],
  locales: [
    {
      locale: 'en',
      title:
        "ICHR Co-Organises a Geneva Side Event on Women's Condition and Violence in Wartime",
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: 'Geneva',
      authorName: 'ICHR Communications',
      coverImageUrl: `/blog/${SLUG}/cover.jpg`,
      gallery: [
        {
          url: POSTER,
          caption:
            "Event card for the side event “Women's Condition and Violence in Wartime — Focus: The Sudan Crisis”, co-organised by the International Coalition for Human Rights, the European Association for the Defence of Minorities, The Youth Future Alliance and Post Versa. Club Suisse de la Presse, Domaine de Penthes, Geneva, 25 August 2026, 15:00–17:00.",
          order: 0,
        },
      ],
    },
    {
      locale: 'ar',
      title:
        'التحالف الدولي لحقوق الإنسان يشارك في تنظيم فعالية جانبية في جنيف حول أوضاع النساء والعنف في زمن الحرب',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'جنيف',
      authorName: 'إعلام ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
      gallery: [
        {
          url: POSTER,
          caption:
            'بطاقة الفعالية الجانبية «أوضاع النساء والعنف في زمن الحرب — تركيز: الأزمة السودانية»، التي ينظّمها بالاشتراك التحالف الدولي لحقوق الإنسان والرابطة الأوروبية للدفاع عن الأقليات وتحالف مستقبل الشباب وPost Versa. النادي السويسري للصحافة، دومين دو بانت، جنيف، 25 أغسطس 2026، من 15:00 إلى 17:00. (البطاقة بالإنجليزية.)',
          order: 0,
        },
      ],
    },
    {
      locale: 'fr',
      title:
        "L'ICHR coorganise à Genève un événement parallèle sur la condition des femmes et les violences en temps de guerre",
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Genève',
      authorName: 'Communication ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
      gallery: [
        {
          url: POSTER,
          caption:
            "Carte de l'événement parallèle « Women's Condition and Violence in Wartime — Focus: The Sudan Crisis », coorganisé par la Coalition internationale pour les droits de l'homme, l'Association européenne pour la défense des minorités, The Youth Future Alliance et Post Versa. Club Suisse de la Presse, Domaine de Penthes, Genève, 25 août 2026, 15h00–17h00. (Carte en anglais.)",
          order: 0,
        },
      ],
    },
  ],
};

// The A4 poster is the wrong shape for the cover slot, so all three covers are
// generated. The chip keeps the site convention of city + dateline (23 August);
// the EVENT date lives in the standfirst so the two are never confused.
export const COVERS = {
  en: {
    file: 'cover.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: 'INTERNATIONAL COALITION FOR HUMAN RIGHTS',
    eyebrow: 'SIDE EVENT',
    headline: ["Women's Condition and", 'Violence in Wartime:', 'Focus on Sudan'],
    headSize: 58,
    headLh: 78,
    headTop: 452,
    standfirst: ['Club Suisse de la Presse, Geneva, 25 August 2026'],
    city: 'Geneva',
    date: '23 AUGUST 2026',
    chipW: 248,
  },
  fr: {
    file: 'cover-fr.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: "COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME",
    eyebrow: 'ÉVÉNEMENT PARALLÈLE',
    headline: ['La condition des femmes', 'et les violences en temps', 'de guerre : le Soudan'],
    headSize: 54,
    headLh: 74,
    headTop: 452,
    standfirst: ['Club Suisse de la Presse, Genève, 25 août 2026'],
    city: 'Genève',
    date: '23 AOÛT 2026',
    chipW: 248,
  },
  ar: {
    file: 'cover-ar.jpg',
    rtl: true,
    font: "'Geeza Pro', 'Al Bayan', sans-serif",
    org: 'التحالف الدولي لحقوق الإنسان',
    eyebrow: 'فعالية جانبية',
    headline: ['أوضاع النساء والعنف', 'في زمن الحرب', 'تركيز على السودان'],
    headSize: 56,
    headLh: 88,
    headTop: 468,
    standfirst: ['النادي السويسري للصحافة، جنيف، 25 أغسطس 2026'],
    city: 'جنيف',
    date: '23 أغسطس 2026',
    chipW: 240,
  },
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
