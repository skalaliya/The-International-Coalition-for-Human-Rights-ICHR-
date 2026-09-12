// Field update, 13 September 2026 — ICHR representatives take part in human rights
// advocacy at the 63rd session of the UN Human Rights Council in Geneva, calling for
// renewal of the mandate of the Fact-Finding Mission on the use of chemical weapons in
// Sudan and for the protection of civilians.
//
// Source: press/SEP/1 (note.rtf — English + Arabic — and three designed social cards,
// d-1/2/3.jpg, 1080x1350). Re-encoded to card-1/2/3.jpg under public/blog/<slug>/.
//
// EDITORIAL DECISIONS (confirmed with the user — do not "improve" on a re-run):
//   * The client's framing "Fact-Finding Mission on the use of chemical weapons in Sudan"
//     is kept VERBATIM. The UN body's official title is broader ("Independent International
//     Fact-Finding Mission for the Sudan"); it is NOT "corrected" here — this reproduces the
//     coalition's own words.
//   * NAME OF THE COALITION. The body/sign-off use the site's house brand "International
//     Coalition for Human Rights (ICHR)". The supplied cards read "International Coalition of
//     Human Rights Organizations (ICHRO)"; the artwork is the client's and is NOT retouched
//     (same precedent as the "Abdel-Rahim" printed press cards). Arabic house brand:
//     التحالف الدولي لحقوق الإنسان.
//   * COVER = supplied artwork on all three locales (card-1.jpg, the three representatives in
//     the alley of flags). No COVERS export, gen-press-cover.mjs is NOT run — same pattern as
//     seed-statement-civil-society-panel-women-sudan.mjs.
//   * Gallery = card-2 and card-3 on all three locales. Photo captions are deliberately
//     GENERIC — the individuals are not named (not supplied by the client).
//   * The note's flag emoji and #hashtag lines are NOT in the body: the read-back in
//     prisma/lib/press-statement.mjs asserts pg length(body) === JS body.length, which holds
//     only for BMP text. The hashtags live in the `hashtags` metadata below instead.
//
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-hrc63-sudan-advocacy.mjs
//               node --env-file=.env.local prisma/seed-statement-hrc63-sudan-advocacy.mjs
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-hrc63-sudan-advocacy.mjs
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-hrc63-sudan-advocacy.mjs
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = 'hrc63-session-sudan-advocacy-geneva-september-2026';
export const TRANSLATION_KEY = 'fe1ffa60-53c4-4b30-bbdc-02fe4562ecd4';

const EN_BODY = `GENEVA — Representatives of the International Coalition for Human Rights (ICHR) took part in a human rights advocacy initiative on the margins of the 63rd session of the United Nations Human Rights Council in Geneva.

Speaking on behalf of the coalition of international human rights organisations, the delegation called for the renewal of the mandate of the Fact-Finding Mission on the use of chemical weapons in Sudan, and for continued support for the protection of civilians.

The Human Rights Council convened its 63rd session at the Palais des Nations in Geneva. ICHR's participation reaffirms the coalition's commitment to accountability for violations in Sudan and to the protection of civilian populations affected by the conflict.

---

**THE INTERNATIONAL COALITION FOR HUMAN RIGHTS**

Advancing Human Rights • Peace • Justice

Geneva, 13 September 2026`;

const EN_EXCERPT =
  'Representatives of the International Coalition for Human Rights took part in a human rights advocacy initiative on the margins of the 63rd session of the UN Human Rights Council in Geneva, calling for the renewal of the mandate of the Fact-Finding Mission on the use of chemical weapons in Sudan and for continued support for the protection of civilians.';

const AR_BODY = `جنيف — شارك ممثلو التحالف الدولي لحقوق الإنسان (ICHR) في حراك حقوقي على هامش الدورة الثالثة والستين لمجلس حقوق الإنسان التابع للأمم المتحدة في جنيف.

وباسم تحالف المنظمات الحقوقية الدولية، دعا الوفد إلى تمديد مهام بعثة تقصي الحقائق والتحقيق حول استخدام السلاح الكيميائي في السودان، وإلى مواصلة دعم حماية المدنيين.

وعقد مجلس حقوق الإنسان دورته الثالثة والستين في قصر الأمم بجنيف. وتؤكد مشاركة التحالف التزامه بالمساءلة عن الانتهاكات في السودان وبحماية السكان المدنيين المتضررين من النزاع.

---

**التحالف الدولي لحقوق الإنسان**

النهوض بحقوق الإنسان • السلام • العدالة

جنيف، 13 سبتمبر 2026`;

const AR_EXCERPT =
  'شارك ممثلو التحالف الدولي لحقوق الإنسان في حراك حقوقي على هامش الدورة الثالثة والستين لمجلس حقوق الإنسان التابع للأمم المتحدة في جنيف، للمطالبة بتمديد مهام بعثة تقصي الحقائق والتحقيق حول استخدام السلاح الكيميائي في السودان، ودعم حماية المدنيين.';

const FR_BODY = `GENÈVE — Des représentants de la Coalition internationale pour les droits de l'homme (ICHR) ont pris part à une initiative de plaidoyer pour les droits humains en marge de la 63e session du Conseil des droits de l'homme des Nations Unies à Genève.

Au nom de la coalition d'organisations internationales de défense des droits humains, la délégation a appelé au renouvellement du mandat de la mission d'établissement des faits sur l'emploi d'armes chimiques au Soudan, ainsi qu'au maintien du soutien à la protection des civils.

Le Conseil des droits de l'homme a tenu sa 63e session au Palais des Nations à Genève. La participation de l'ICHR réaffirme l'engagement de la coalition en faveur de la responsabilité pour les violations commises au Soudan et de la protection des populations civiles touchées par le conflit.

---

**LA COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME**

Promouvoir les droits de l'homme • La paix • La justice

Genève, le 13 septembre 2026`;

const FR_EXCERPT =
  "Des représentants de la Coalition internationale pour les droits de l'homme ont pris part à une initiative de plaidoyer pour les droits humains en marge de la 63e session du Conseil des droits de l'homme des Nations Unies à Genève, appelant au renouvellement du mandat de la mission d'établissement des faits sur l'emploi d'armes chimiques au Soudan et au maintien du soutien à la protection des civils.";

const CARD1 = `/blog/${SLUG}/card-1.jpg`; // hero: three representatives in the alley of flags
const CARD2 = `/blog/${SLUG}/card-2.jpg`;
const CARD3 = `/blog/${SLUG}/card-3.jpg`;

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Field Update',
  date: '2026-09-13',
  hashtags: ['#international_coalition_for_h_rights', '#Sudan', '#Geneva', '#HRC63'],
  locales: [
    {
      locale: 'en',
      title:
        'ICHR Takes Part in Advocacy at the 63rd Session of the UN Human Rights Council in Geneva, Urging Renewal of the Fact-Finding Mission Mandate on Chemical Weapons Use in Sudan',
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: 'Geneva',
      authorName: 'ICHR Communications',
      coverImageUrl: CARD1,
      gallery: [
        { url: CARD2, caption: 'ICHR representatives in the alley of flags at the Palais des Nations, Geneva, during the 63rd session of the UN Human Rights Council.', order: 0 },
        { url: CARD3, caption: 'ICHR representatives at the Palais des Nations in Geneva on the margins of the 63rd session of the UN Human Rights Council.', order: 1 },
      ],
    },
    {
      locale: 'ar',
      title:
        'التحالف الدولي لحقوق الإنسان يشارك في حراك حقوقي بالدورة الثالثة والستين لمجلس حقوق الإنسان في جنيف ويدعو إلى تمديد مهام بعثة تقصي الحقائق حول استخدام الأسلحة الكيميائية في السودان',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: 'جنيف',
      authorName: 'إعلام ICHR',
      coverImageUrl: CARD1,
      gallery: [
        { url: CARD2, caption: 'ممثلو التحالف الدولي لحقوق الإنسان في ممر الأعلام بقصر الأمم في جنيف، خلال الدورة الثالثة والستين لمجلس حقوق الإنسان.', order: 0 },
        { url: CARD3, caption: 'ممثلو التحالف الدولي لحقوق الإنسان في قصر الأمم بجنيف على هامش الدورة الثالثة والستين لمجلس حقوق الإنسان.', order: 1 },
      ],
    },
    {
      locale: 'fr',
      title:
        "L'ICHR participe à la 63e session du Conseil des droits de l'homme à Genève et réclame le renouvellement du mandat de la mission d'établissement des faits sur les armes chimiques au Soudan",
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: 'Genève',
      authorName: 'Communication ICHR',
      coverImageUrl: CARD1,
      gallery: [
        { url: CARD2, caption: "Des représentants de l'ICHR dans l'allée des drapeaux au Palais des Nations, à Genève, durant la 63e session du Conseil des droits de l'homme des Nations Unies.", order: 0 },
        { url: CARD3, caption: "Des représentants de l'ICHR au Palais des Nations à Genève, en marge de la 63e session du Conseil des droits de l'homme des Nations Unies.", order: 1 },
      ],
    },
  ],
};

// No COVERS export: all three locales are headed by supplied artwork (card-1.jpg), so
// scripts/gen-press-cover.mjs is not run for this statement.

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
