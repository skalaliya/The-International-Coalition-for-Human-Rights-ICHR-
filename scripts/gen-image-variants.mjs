// Generates responsive width variants for every image under public/blog/ and public/media/.
//
// WHY: /blog/* is served raw — there is no Astro <Image>, no CDN transform, nothing.
// Measured on a 375px phone against production: the article cover is a 1200px JPEG
// painted into a 325px box, and each gallery page is a 1131px JPEG displayed about
// 287px wide. One press statement shipped ~3.2 MB of gallery images to a handset.
// For readers on mobile data in Sudan and the Horn of Africa, that is the single
// biggest cost of visiting the site.
//
// The variants are plain files next to the original — `cover.jpg` gains `cover-400.jpg`,
// `cover-800.jpg`, `cover-1200.jpg` — and the run writes src/generated/blog-images.json
// recording, per image, the intrinsic size and exactly which widths exist.
// src/lib/assets.ts reads that manifest to build each srcset, so a component can never
// point at a variant that was never written (a 404 inside a srcset shows nothing at all).
//
// RUN THIS FOR EVERY NEW ARTICLE and commit the manifest with the images. An image with
// no manifest entry still renders — it just gets the full-size original.
//
//   node scripts/gen-image-variants.mjs                 # everything, skip existing
//   node scripts/gen-image-variants.mjs <slug>          # one article or video
//   FORCE=1 node scripts/gen-image-variants.mjs         # regenerate
//
// Idempotent and additive: it never rewrites an original, never upscales, and skips a
// variant that already exists unless FORCE=1.
import sharp from 'sharp';
import { readdirSync, existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
// Two roots share one pipeline and one manifest: /blog/* (article covers and galleries)
// and /media/* (video posters). Both are served raw from public/, so both need variants.
// Manifest keys are site-absolute paths, so src/lib/assets.ts needs no change to read
// either — but resolveAssetUrl's allow-list DOES have to admit /media/, or every poster
// silently resolves to /og-image.png with no error anywhere.
const ROOTS = ['blog', 'media'];
// The manifest is the contract between this script and src/lib/assets.ts. Without it the
// components would have to GUESS which widths exist, and a guess that is wrong is a 404
// inside a srcset — which browsers resolve by showing nothing at all. It also carries the
// intrinsic dimensions so <img> can declare width/height and reserve the right box.
const MANIFEST = join(REPO, 'src', 'generated', 'blog-images.json');
const FORCE = process.env.FORCE === '1';

/** Files we could not read at all — reported at the end, excluded from the manifest. */
const unreadable = [];

/** Widths that matter: 400 ≈ a phone tile, 800 ≈ phone full-bleed at 2x, 1200 ≈ desktop. */
export const VARIANT_WIDTHS = [400, 800, 1200];

const SOURCE_RE = /\.(jpe?g|png)$/i;
/** A file that is itself a variant — never make variants of variants. */
const VARIANT_RE = new RegExp(`-(${VARIANT_WIDTHS.join('|')})\\.(jpe?g|png)$`, 'i');

export function variantPath(file, width) {
  return file.replace(SOURCE_RE, (ext) => `-${width}${ext.toLowerCase() === '.png' ? '.png' : '.jpg'}`);
}

async function processDir(root, slug, manifest) {
  const dir = join(REPO, 'public', root, slug);
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return null;

  const originals = readdirSync(dir).filter((f) => SOURCE_RE.test(f) && !VARIANT_RE.test(f));
  let made = 0;
  let skipped = 0;

  for (const file of originals) {
    const src = join(dir, file);

    // One unreadable file must not take down the whole run. Causes seen in practice:
    // macOS quarantine/ACL xattrs on a downloaded image (EPERM), a truncated upload, or
    // a file that isn't really an image. Skipping leaves it out of the manifest, so
    // assets.ts emits no srcset for it and the browser just gets the original — the
    // correct degradation. The names are reported at the end so it is never silent.
    let meta;
    try {
      meta = await sharp(src).metadata();
    } catch (e) {
      unreadable.push({ file: `/${root}/${slug}/${file}`, reason: e.code ?? e.message?.slice(0, 60) });
      continue;
    }

    const widths = [];

    for (const w of VARIANT_WIDTHS) {
      // Never upscale. A 400px source simply has no 800px variant, and the manifest
      // records that, so no component ever points at a file that isn't there.
      if (meta.width && meta.width <= w) continue;
      const out = join(dir, variantPath(file, w));
      if (existsSync(out) && !FORCE) {
        skipped++;
      } else {
        try {
          await sharp(src).resize({ width: w, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
          made++;
        } catch (e) {
          unreadable.push({ file: `/${root}/${slug}/${file}`, reason: `${w}px: ${e.code ?? e.message?.slice(0, 40)}` });
          continue;
        }
      }
      widths.push(w);
    }

    manifest[`/${root}/${slug}/${file}`] = { w: meta.width ?? null, h: meta.height ?? null, widths };
  }
  return { slug, originals: originals.length, made, skipped };
}

const only = process.argv[2];

// EVERY root is walked on EVERY run, even when one slug is named, so the manifest always
// describes every image — a single-slug run can never silently drop the others' entries.
const found = [];
for (const root of ROOTS) {
  const rootDir = join(REPO, 'public', root);
  if (!statSync(rootDir, { throwIfNoEntry: false })?.isDirectory()) continue; // a root may not exist yet
  for (const slug of readdirSync(rootDir).filter((d) => !d.startsWith('.'))) found.push({ root, slug });
}

if (only && !found.some((f) => f.slug === only)) {
  console.error(`ABORT: no such directory: ${ROOTS.map((r) => `public/${r}/${only}`).join(' or ')}`);
  process.exit(1);
}

const manifest = {};
let totalMade = 0;
for (const { root, slug } of found) {
  const r = await processDir(root, slug, manifest);
  if (!r) continue; // a stray file rather than a directory
  if (only && slug !== only) continue;
  totalMade += r.made;
  console.log(
    `${r.made ? '✅' : '·'} ${root}/${r.slug} — ${r.originals} original${r.originals === 1 ? '' : 's'}, ` +
      `${r.made} variant${r.made === 1 ? '' : 's'} written${r.skipped ? `, ${r.skipped} already present` : ''}`,
  );
}

mkdirSync(dirname(MANIFEST), { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${totalMade} variant(s) written. Manifest: ${Object.keys(manifest).length} images → src/generated/blog-images.json`);
console.log('Commit the manifest with the images — src/lib/assets.ts reads it to build every srcset.');

if (unreadable.length) {
  console.warn(`\n⚠️  ${unreadable.length} image(s) could not be read and have NO responsive variants.`);
  console.warn('   They still render — the browser just gets the full-size original.');
  for (const u of unreadable) console.warn(`   · ${u.file} (${u.reason})`);
  console.warn('   macOS quarantine is the usual cause: xattr -d com.apple.quarantine <file>');
}
