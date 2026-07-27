// TEMPLATE — copy to prisma/seed-statement-<name>.mjs and fill in.
// Everything mechanical (Neon guard, atomic upsert, gallery rebuild, read-back,
// draft/publish/unpublish) lives in prisma/lib/press-statement.mjs. This file is
// CONTENT ONLY, and is the git source-of-record for what is on the site.
//
// Usage:
//   DRY_RUN=1   node --env-file=.env.local prisma/seed-statement-<name>.mjs   # validate only
//               node --env-file=.env.local prisma/seed-statement-<name>.mjs   # write as DRAFT
//   PUBLISH=1   node --env-file=.env.local prisma/seed-statement-<name>.mjs   # take it live
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-<name>.mjs   # draft all locales
//
// Covers: node scripts/gen-press-cover.mjs prisma/seed-statement-<name>.mjs
import { pathToFileURL } from 'node:url';
import { publishStatement, envOpts } from './lib/press-statement.mjs';

export const SLUG = '<condemnation-subject-place-month-year>';
// node -e "console.log(require('crypto').randomUUID())" — ONCE. Never regenerate:
// this is what binds the locales for the toggle, hreflang and the sitemap.
export const TRANSLATION_KEY = '<uuid>';

// Markdown rules (validateStatement enforces all three):
//   - blank line BEFORE AND AFTER `---`
//   - no blank lines between `- ` bullets
//   - `- ` needs the space; `-Name` is not a bullet
const EN_BODY = `<first paragraph>

## <optional section heading>

**<optional bold lead>**

- <bullet>
- <bullet>

<closing paragraph>

---

**<SIGN-OFF AS PRINTED ON THE CARD>**

<City>, <D Month YYYY>`;

const EN_EXCERPT = '<1–3 sentences, max 1000 chars, shown on /news cards and in OG/meta>';

const AR_BODY = `<Arabic — keep every "reported"/"alleged" hedge>`;
const AR_EXCERPT = '<Arabic>';
const FR_BODY = `<French — keep every hedge>`;
const FR_EXCERPT = '<French>';

export const STATEMENT = {
  slug: SLUG,
  translationKey: TRANSLATION_KEY,
  category: 'Statement', // Press Release | Statement | Field Update | News — exact strings
  date: '<YYYY-MM-DD>', // the statement's own date, as a STRING
  hashtags: ['#international_coalition_for_h_rights', '#Sudan'],
  locales: [
    {
      locale: 'en',
      title: '<title, max 300 chars>',
      excerpt: EN_EXCERPT,
      body: EN_BODY,
      location: '<dateline city — READ IT off the statement, it is not always Geneva>',
      authorName: 'ICHR Communications',
      coverImageUrl: `/blog/${SLUG}/cover.jpg`,
      // Only where the artwork is in this language. Captions are the visible
      // <figcaption> AND the img alt text; max 500 chars.
      gallery: [
        { url: `/blog/${SLUG}/card-1.jpg`, caption: '<what this card shows>', order: 0 },
        { url: `/blog/${SLUG}/card-2.jpg`, caption: '<what this card shows>', order: 1 },
      ],
    },
    {
      locale: 'ar',
      title: '<Arabic title>',
      excerpt: AR_EXCERPT,
      body: AR_BODY,
      location: '<Arabic city>',
      authorName: 'إعلام ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-ar.jpg`,
    },
    {
      locale: 'fr',
      title: '<French title>',
      excerpt: FR_EXCERPT,
      body: FR_BODY,
      location: '<French city>',
      authorName: 'Communication ICHR',
      coverImageUrl: `/blog/${SLUG}/cover-fr.jpg`,
    },
  ],
};

// Read by scripts/gen-press-cover.mjs. Headlines are hand-broken arrays — nothing wraps.
// The generator measures each line's rendered ink against the 1024px column and refuses
// to write an overflowing card. Omit a locale whose cover is supplied artwork.
// Keep the headline SHORTER than the article title; it is display type, not a sentence.
export const COVERS = {
  en: {
    file: 'cover.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: 'INTERNATIONAL COALITION FOR HUMAN RIGHTS',
    eyebrow: 'STATEMENT OF CONDEMNATION',
    headline: ['<line 1>', '<line 2>', '<line 3>'],
    headSize: 58,
    headLh: 78,
    headTop: 452,
    standfirst: ['Statement on the situation in Sudan'],
    city: '<City>',
    date: '<DD MONTH YYYY>',
    chipW: 248, // width of the white city chip — widen for longer city names
  },
  fr: {
    file: 'cover-fr.jpg',
    rtl: false,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    org: "COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME",
    eyebrow: 'DÉCLARATION DE CONDAMNATION',
    headline: ['<ligne 1>', '<ligne 2>', '<ligne 3>'],
    headSize: 54,
    headLh: 74,
    headTop: 452,
    standfirst: ['Déclaration sur la situation au Soudan'],
    city: '<Ville>',
    date: '<JJ MOIS AAAA>',
    chipW: 248,
  },
  ar: {
    file: 'cover-ar.jpg',
    rtl: true, // see reference/cover-invariants.md before changing anything RTL
    font: "'Geeza Pro', 'Al Bayan', sans-serif",
    org: 'التحالف الدولي لحقوق الإنسان',
    eyebrow: 'بيان إدانة',
    headline: ['<السطر الأول>', '<السطر الثاني>', '<السطر الثالث>'],
    headSize: 56,
    headLh: 88, // Arabic needs more leading than Latin
    headTop: 468,
    standfirst: ['بيان بشأن الوضع في السودان'],
    city: '<المدينة>',
    date: '<DD الشهر YYYY>',
    chipW: 240,
  },
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publishStatement(STATEMENT, envOpts()).catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
