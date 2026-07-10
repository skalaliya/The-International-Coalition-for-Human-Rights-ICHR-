// Generates the branded typographic press card used as the cover for the
// "Procedural Bias" statement, in the same visual family as the photo cards.
// Portrait 1200x1600 (matches the FFM cover's 1198x1600).
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'public/blog/procedural-bias-selective-handling-sudan-july-2026';
const W = 1200;
const H = 1600;
const M = 88; // margin

const NAVY = '#1a4a68';
const NAVY_DARK = '#0f2f49';
const GOLD = '#C9A227';

const logo = readFileSync('public/logo.png').toString('base64');
const logoUri = `data:image/png;base64,${logo}`;

const HEAD = ['On Procedural Bias and the', 'Selective Handling of Human', 'Rights Violations in Sudan'];
const HEAD_SIZE = 62;
const HEAD_LH = 82;
const HEAD_TOP = 470;

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const headline = HEAD.map(
  (line, i) =>
    `<text x="${M}" y="${HEAD_TOP + i * HEAD_LH}" font-family="${FONT}" font-size="${HEAD_SIZE}" font-weight="700" fill="#ffffff">${line}</text>`,
).join('\n  ');

// logo.png has an opaque navy backdrop (#1D5277), not transparency: sit the
// masthead copy on a white chip (as the footer does) and clip the watermark to
// the seal's circle — otherwise both read as pale squares against the card.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY_DARK}"/>
    </linearGradient>
    <clipPath id="seal">
      <circle cx="1058" cy="1331" r="414"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- watermark seal, bleeding off the bottom-right corner -->
  <g clip-path="url(#seal)">
    <image href="${logoUri}" x="620" y="900" width="880" height="866" opacity="0.07"/>
  </g>

  <!-- masthead -->
  <rect x="${M}" y="92" width="120" height="118" rx="12" fill="#ffffff"/>
  <image href="${logoUri}" x="${M + 8}" y="100" width="104" height="102"/>
  <text x="${M + 148}" y="152" font-family="${FONT}" font-size="44" font-weight="700" fill="#ffffff" letter-spacing="2">ICHR</text>
  <text x="${M + 150}" y="185" font-family="${FONT}" font-size="15" font-weight="500" fill="#ffffff" opacity="0.62" letter-spacing="2.6">INTERNATIONAL COALITION FOR HUMAN RIGHTS</text>

  <rect x="${M}" y="288" width="${W - M * 2}" height="1.5" fill="#ffffff" opacity="0.18"/>

  <!-- eyebrow -->
  <text x="${M}" y="372" font-family="${FONT}" font-size="25" font-weight="700" fill="${GOLD}" letter-spacing="6.5">IMPORTANT STATEMENT</text>

  <!-- headline -->
  ${headline}

  <rect x="${M}" y="800" width="132" height="5" fill="${GOLD}"/>

  <!-- standfirst -->
  <text x="${M}" y="884" font-family="${FONT}" font-size="31" font-weight="400" fill="#ffffff" opacity="0.86">62nd Session of the United Nations</text>
  <text x="${M}" y="928" font-family="${FONT}" font-size="31" font-weight="400" fill="#ffffff" opacity="0.86">Human Rights Council</text>

  <!-- location chip + date -->
  <rect x="${M}" y="1042" width="286" height="74" rx="10" fill="#ffffff"/>
  <g transform="translate(${M + 26}, 1060) scale(1.6)">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none" stroke="#d64541" stroke-width="2.2"/>
    <circle cx="12" cy="10" r="3" fill="none" stroke="#d64541" stroke-width="2.2"/>
  </g>
  <text x="${M + 82}" y="1092" font-family="${FONT}" font-size="34" font-weight="700" fill="${NAVY}">Geneva</text>
  <text x="${M + 320}" y="1092" font-family="${FONT}" font-size="26" font-weight="500" fill="#ffffff" opacity="0.72" letter-spacing="3.2">09 JULY 2026</text>

  <!-- footer -->
  <rect x="${M}" y="1430" width="${W - M * 2}" height="1.5" fill="#ffffff" opacity="0.18"/>
  <text x="${W / 2}" y="1500" text-anchor="middle" font-family="${FONT}" font-size="24" font-weight="500" fill="#ffffff" opacity="0.68" letter-spacing="4">ICHR-INTERNATIONAL.ORG</text>
</svg>`;

mkdirSync(OUT_DIR, { recursive: true });
await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(`${OUT_DIR}/cover.jpg`);
const meta = await sharp(`${OUT_DIR}/cover.jpg`).metadata();
console.log(`✅ ${OUT_DIR}/cover.jpg — ${meta.width}x${meta.height} ${meta.format}`);
