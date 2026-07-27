// Generates the branded cover cards for one press statement, driven by the COVERS
// config the statement file exports — so slug, city and date have ONE source of truth
// and cannot drift between the article and its artwork.
//
//   node scripts/gen-press-cover.mjs prisma/seed-statement-<name>.mjs        # every locale
//   node scripts/gen-press-cover.mjs prisma/seed-statement-<name>.mjs ar     # just one
//   FORCE=1 node scripts/gen-press-cover.mjs <file>                          # overwrite
//
// A statement whose cover is supplied artwork (a designed photo card) simply omits that
// locale from COVERS — see the cargo-trucks statement, where English used a press card.
//
// Two safety rules, both learned the hard way:
//   - Two locales must never emit the same filename. The first generator was a copy of
//     another statement's, and running it with a stale SLUG would have overwritten a
//     live statement's covers.
//   - An existing file is never overwritten without FORCE=1, for the same reason.
//
// Every card is checked for overflow before it is written (see assertFits), but that
// gate only catches geometry. ALWAYS open the JPEGs and look at them: sharp renders
// broken Arabic, tofu, and a reversed date order all at a perfectly legal width, and
// exits 0.
import { mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { assertFits, renderCard, USABLE_W } from './lib/press-card.mjs';

const REPO = join(dirname(new URL(import.meta.url).pathname), '..');
const FORCE = process.env.FORCE === '1';

const [, , modulePath, onlyLocale] = process.argv;
if (!modulePath) {
  console.error('Usage: node scripts/gen-press-cover.mjs <statement-file.mjs> [locale]');
  process.exit(1);
}

const mod = await import(pathToFileURL(resolve(modulePath)).href);
const { SLUG, COVERS } = mod;
if (!SLUG || !COVERS) {
  console.error(`ABORT: ${modulePath} must export SLUG and COVERS.`);
  process.exit(1);
}

const targets = onlyLocale ? [onlyLocale] : Object.keys(COVERS);
for (const loc of targets) {
  if (!COVERS[loc]) {
    console.error(`ABORT: unknown locale "${loc}" — COVERS defines ${Object.keys(COVERS).join(', ')}`);
    process.exit(1);
  }
}

// Distinct filenames, checked across the WHOLE config, not just the requested subset.
const byFile = new Map();
for (const [loc, c] of Object.entries(COVERS)) {
  if (byFile.has(c.file)) {
    console.error(`ABORT: locales "${byFile.get(c.file)}" and "${loc}" both emit ${c.file} — one would overwrite the other.`);
    process.exit(1);
  }
  byFile.set(c.file, loc);
}

const OUT_DIR = join(REPO, 'public', 'blog', SLUG);
mkdirSync(OUT_DIR, { recursive: true });

for (const loc of targets) {
  const c = COVERS[loc];
  const out = join(OUT_DIR, c.file);

  if (existsSync(out) && !FORCE) {
    console.error(`ABORT: ${out} already exists. Re-run with FORCE=1 to overwrite it deliberately.`);
    process.exit(1);
  }

  const lines = await assertFits(loc, c); // throws with the offending line and its width
  const m = await renderCard(c, out);
  console.log(`✅ [${loc}] ${out} — ${m.width}x${m.height} ${m.format}`);
  for (const { line, ink } of lines) {
    console.log(`      ${String(ink).padStart(4)}px / ${USABLE_W}px  ${line}`);
  }
}

console.log('\nNow OPEN every JPEG and look at it — the width gate cannot see broken Arabic joins,');
console.log('tofu from a missing font, or a date rendered in the wrong order.');
