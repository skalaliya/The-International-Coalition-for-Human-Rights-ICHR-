// Generates the branded typographic press cards used as covers for the Sudan
// procedural-bias statement — one per locale, in the same visual family as the
// photo cards. Portrait 1200x1600 (matches the FFM cover's 1198x1600).
//
//   node scripts/gen-statement-cover.mjs          # all locales
//   node scripts/gen-statement-cover.mjs ar       # just one
//
// Swap the cover for real photography by replacing the emitted JPEG, or by
// uploading a new cover through /admin (which mints its own URL).
//
// Two rendering constraints worth knowing before you edit this file:
//  1. logo.png has an opaque navy backdrop (#1D5277), not transparency — hence the
//     white chip behind the masthead mark and the circular clip on the watermark.
//  2. Arabic must lay out right-to-left. librsvg/Pango shapes the glyphs correctly,
//     but `text-anchor="end"` fights `direction="rtl"` and pushes lines off-canvas.
//     The working combination is direction="rtl" + text-anchor="start" anchored at
//     the RIGHT margin. Letter-spacing is also left at 0 for Arabic, since spacing
//     between clusters visually breaks the joins.
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const SLUG = 'procedural-bias-selective-handling-sudan-july-2026';
const OUT_DIR = `public/blog/${SLUG}`;
const W = 1200;
const H = 1600;
const M = 88; // margin

const NAVY = '#1a4a68';
const NAVY_DARK = '#0f2f49';
const GOLD = '#C9A227';

const LATIN = "'Helvetica Neue', Helvetica, Arial, sans-serif";
// Noto Sans Arabic (the site's webfont) is not installed locally; Geeza Pro is the
// macOS system naskh and carries a true bold.
const ARABIC = "'Geeza Pro', 'Al Bayan', sans-serif";

const logoUri = `data:image/png;base64,${readFileSync('public/logo.png').toString('base64')}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const LOCALES = {
  en: {
    file: 'cover.jpg',
    rtl: false,
    font: LATIN,
    org: 'INTERNATIONAL COALITION FOR HUMAN RIGHTS',
    eyebrow: 'IMPORTANT STATEMENT',
    headline: ['On Procedural Bias and the', 'Selective Handling of Human', 'Rights Violations in Sudan'],
    headSize: 62,
    headLh: 82,
    headTop: 470,
    standfirst: ['62nd Session of the United Nations', 'Human Rights Council'],
    city: 'Geneva',
    date: '09 JULY 2026',
    chipW: 286,
  },
  fr: {
    file: 'cover-fr.jpg',
    rtl: false,
    font: LATIN,
    org: "COALITION INTERNATIONALE POUR LES DROITS DE L'HOMME",
    eyebrow: 'DÉCLARATION IMPORTANTE',
    headline: ['Sur la partialité procédurale', 'et le traitement sélectif des', "violations des droits de l'homme", 'au Soudan'],
    headSize: 54,
    headLh: 74,
    headTop: 452,
    standfirst: ['62e session du Conseil des droits', "de l'homme des Nations Unies"],
    city: 'Genève',
    date: '09 JUILLET 2026',
    chipW: 300,
  },
  ar: {
    file: 'cover-ar.jpg',
    rtl: true,
    font: ARABIC,
    org: 'التحالف الدولي لحقوق الإنسان',
    eyebrow: 'بيان هام',
    headline: ['بشأن الانحياز الإجرائي والانتقائية', 'في التعامل مع انتهاكات حقوق الإنسان', 'في السودان'],
    headSize: 56,
    headLh: 88,
    headTop: 468,
    standfirst: ['الدورة الثانية والستون لمجلس حقوق', 'الإنسان التابع للأمم المتحدة'],
    city: 'جنيف',
    date: '09 يوليو 2026',
    chipW: 240,
  },
};

function buildSvg(c) {
  const ax = c.rtl ? W - M : M; // inline-start anchor
  // In RTL, text-anchor="start" resolves to the right edge; see the header note.
  const flow = c.rtl ? `direction="rtl" text-anchor="start"` : '';
  const ls = (v) => (c.rtl ? '' : `letter-spacing="${v}"`); // spacing breaks Arabic joins

  const headline = c.headline
    .map(
      (line, i) =>
        `<text x="${ax}" y="${c.headTop + i * c.headLh}" ${flow} font-family="${c.font}" font-size="${c.headSize}" font-weight="700" fill="#ffffff">${esc(line)}</text>`,
    )
    .join('\n  ');

  const standfirst = c.standfirst
    .map(
      (line, i) =>
        `<text x="${ax}" y="${884 + i * 44}" ${flow} font-family="${c.font}" font-size="31" fill="#ffffff" opacity="0.86">${esc(line)}</text>`,
    )
    .join('\n  ');

  // masthead: logo chip, then wordmark + org line beside it
  const chipX = c.rtl ? W - M - 120 : M;
  const markX = c.rtl ? W - M - 148 : M + 148;

  // location chip: pin sits on the inline-start side, date trails on the inline-end side
  const locX = c.rtl ? W - M - c.chipW : M;
  const pinX = c.rtl ? W - M - 64 : M + 26;
  const cityX = c.rtl ? W - M - 82 : M + 82;
  // The date mixes digits with an Arabic month, so it MUST carry direction="rtl":
  // in an LTR paragraph the year binds to the month name and renders "يوليو 2026 09".
  const dateAttrs = c.rtl ? `x="${W - M - c.chipW - 34}" ${flow}` : `x="${M + c.chipW + 34}"`;

  // watermark seal bleeds off the inline-end bottom corner
  const wmX = c.rtl ? W - 620 - 880 : 620;
  const wmCx = c.rtl ? W - 1058 : 1058;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY_DARK}"/>
    </linearGradient>
    <clipPath id="seal"><circle cx="${wmCx}" cy="1331" r="414"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <g clip-path="url(#seal)">
    <image href="${logoUri}" x="${wmX}" y="900" width="880" height="866" opacity="0.07"/>
  </g>

  <!-- masthead -->
  <rect x="${chipX}" y="92" width="120" height="118" rx="12" fill="#ffffff"/>
  <image href="${logoUri}" x="${chipX + 8}" y="100" width="104" height="102"/>
  <text x="${markX}" y="152" ${flow} font-family="${LATIN}" font-size="44" font-weight="700" fill="#ffffff" letter-spacing="2">ICHR</text>
  <text x="${markX}" y="185" ${flow} font-family="${c.font}" font-size="15" font-weight="500" fill="#ffffff" opacity="0.62" ${ls(2.6)}>${esc(c.org)}</text>

  <rect x="${M}" y="288" width="${W - M * 2}" height="1.5" fill="#ffffff" opacity="0.18"/>

  <!-- eyebrow -->
  <text x="${ax}" y="372" ${flow} font-family="${c.font}" font-size="25" font-weight="700" fill="${GOLD}" ${ls(6.5)}>${esc(c.eyebrow)}</text>

  <!-- headline -->
  ${headline}

  <rect x="${c.rtl ? W - M - 132 : M}" y="800" width="132" height="5" fill="${GOLD}"/>

  <!-- standfirst -->
  ${standfirst}

  <!-- location chip + date -->
  <rect x="${locX}" y="1042" width="${c.chipW}" height="74" rx="10" fill="#ffffff"/>
  <g transform="translate(${pinX}, 1060) scale(1.6)">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none" stroke="#d64541" stroke-width="2.2"/>
    <circle cx="12" cy="10" r="3" fill="none" stroke="#d64541" stroke-width="2.2"/>
  </g>
  <text x="${cityX}" y="1092" ${flow} font-family="${c.font}" font-size="34" font-weight="700" fill="${NAVY}">${esc(c.city)}</text>
  <text ${dateAttrs} y="1092" font-family="${c.font}" font-size="26" font-weight="500" fill="#ffffff" opacity="0.72" ${ls(3.2)}>${esc(c.date)}</text>

  <!-- footer -->
  <rect x="${M}" y="1430" width="${W - M * 2}" height="1.5" fill="#ffffff" opacity="0.18"/>
  <text x="${W / 2}" y="1500" text-anchor="middle" font-family="${LATIN}" font-size="24" font-weight="500" fill="#ffffff" opacity="0.68" letter-spacing="4">ICHR-INTERNATIONAL.ORG</text>
</svg>`;
}

const only = process.argv[2];
const targets = only ? [only] : Object.keys(LOCALES);
mkdirSync(OUT_DIR, { recursive: true });

for (const loc of targets) {
  const c = LOCALES[loc];
  if (!c) throw new Error(`Unknown locale "${loc}" — expected one of ${Object.keys(LOCALES).join(', ')}`);
  const out = `${OUT_DIR}/${c.file}`;
  await sharp(Buffer.from(buildSvg(c))).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
  const m = await sharp(out).metadata();
  console.log(`✅ [${loc}] ${out} — ${m.width}x${m.height} ${m.format}`);
}
