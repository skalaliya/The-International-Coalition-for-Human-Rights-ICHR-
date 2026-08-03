#!/usr/bin/env node
// Builds src/generated/blog-attachments.json — the downloadable document, if any,
// that belongs to each article slug.
//
//   node scripts/gen-attachments.mjs
//
// Why a manifest and not a database column: the PDF is a file in git, like the
// artwork, and it is derived from the slug. Putting it in Neon would mean a
// migration, a validateStatement rule and an admin surface for something that is
// only ever set by a seed. src/generated/blog-images.json already establishes this
// pattern — a generated file the lib layer reads — so this follows it.
//
// The byte count is baked in at generation time so the page can state the download
// size BEFORE the click, which matters for readers on constrained connections.
// src/lib/attachments.test.ts fails the build if the manifest and disk disagree.
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = join(ROOT, 'public', 'blog');
const OUT = join(ROOT, 'src', 'generated', 'blog-attachments.json');

// `<name>.<lang>.pdf` declares the document's own language, so the page can tell an
// Arabic reader that the file they are about to pull down is in English. A file with
// no suffix (e.g. a trilingual submission) simply carries no language note.
const DOC_RE = /\.pdf$/i;
const LANG_RE = /\.([a-z]{2})\.pdf$/i;

const manifest = {};
for (const slug of readdirSync(BLOG).filter((d) => !d.startsWith('.'))) {
  const dir = join(BLOG, slug);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir).filter((f) => DOC_RE.test(f))) {
    const lang = file.match(LANG_RE)?.[1]?.toLowerCase();
    manifest[`/blog/${slug}/${file}`] = { bytes: statSync(join(dir, file)).size, ...(lang ? { lang } : {}) };
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n');

const n = Object.keys(sorted).length;
console.log(`${n} attachment(s) → src/generated/blog-attachments.json`);
for (const [url, m] of Object.entries(sorted)) {
  console.log(`  ${url}  ${(m.bytes / 1024 / 1024).toFixed(2)} MB${m.lang ? `  [${m.lang}]` : ''}`);
}
if (!existsSync(OUT)) process.exit(1);
