// Guards the contract between scripts/gen-image-variants.mjs and src/lib/assets.ts.
//
// /blog/* is served raw — no Astro <Image>, no CDN transform. Measured on production at
// 375px: the article cover was a 1200px JPEG in a 325px box, and one statement shipped
// ~3.2MB of gallery to a phone. The generator writes width variants plus a manifest; the
// helpers read the manifest to build each srcset.
//
// The failure this pins down: if a component emits a srcset entry for a variant that was
// never written, the browser resolves it to a 404 and shows NOTHING — worse than the
// oversized image we started with. So the manifest must describe reality.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST_PATH = join(REPO, 'src', 'generated', 'blog-images.json');

interface Info {
  w: number | null;
  h: number | null;
  widths: number[];
}
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as Record<string, Info>;
const entries = Object.entries(manifest);

test('the manifest is populated', () => {
  assert.ok(entries.length > 10, `expected many images, found ${entries.length}`);
});

test('every variant named in the manifest exists on disk', () => {
  // The whole point: never advertise a file we did not write.
  for (const [url, info] of entries) {
    for (const w of info.widths) {
      const variant = url.replace(/\.(jpe?g|png)$/i, `-${w}.jpg`);
      assert.ok(existsSync(join(REPO, 'public', variant)), `srcset would 404: ${variant}`);
    }
  }
});

test('no variant is an upscale of its original', () => {
  for (const [url, info] of entries) {
    for (const w of info.widths) {
      assert.ok(info.w === null || w < info.w, `${url}: ${w}w is not smaller than the ${info.w}px original`);
    }
  }
});

test('every image carries intrinsic dimensions, so <img> can reserve its box', () => {
  for (const [url, info] of entries) {
    assert.ok(Number.isInteger(info.w) && info.w! > 0, `${url} has no width`);
    assert.ok(Number.isInteger(info.h) && info.h! > 0, `${url} has no height`);
  }
});

test('the manifest covers every published article image', () => {
  // Catches the most likely mistake: publishing a new article and forgetting to run
  // `node scripts/gen-image-variants.mjs`, which would silently ship desktop-sized
  // images to phones again.
  const blog = join(REPO, 'public', 'blog');
  const VARIANT = /-(400|800|1200)\.(jpe?g|png)$/i;
  const missing: string[] = [];

  for (const slug of readdirSync(blog).filter((d) => !d.startsWith('.'))) {
    for (const file of readdirSync(join(blog, slug))) {
      if (!/\.(jpe?g|png)$/i.test(file) || VARIANT.test(file)) continue;
      const url = `/blog/${slug}/${file}`;
      if (!manifest[url]) missing.push(url);
    }
  }

  assert.deepEqual(
    missing,
    [],
    `these images have no responsive variants — run: node scripts/gen-image-variants.mjs\n  ${missing.join('\n  ')}`,
  );
});
