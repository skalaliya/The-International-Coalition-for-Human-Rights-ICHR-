// Adds a YouTube video to the /media section.
//
//   node scripts/add-video.mjs <youtube-url-or-id> [slug]
//   DRY_RUN=1 node scripts/add-video.mjs <url>      # print the entry, write nothing
//   FORCE=1   node scripts/add-video.mjs <url>      # re-download an existing poster
//
// WHY: every field it fills in is one a human would otherwise retype from a browser tab —
// the 11-character ID, the duration, the upload date. Retyping is where the bugs are: a
// mistyped ID is a dead embed, and a hand-written "PT14M16S" that disagrees with the badge
// makes Google drop the video rich result silently. So this reads them off the watch page,
// downloads the poster to our own origin, and prints a ready-to-paste entry.
//
// The upload date comes from the channel FEED, not the watch page: the page embeds it with
// the uploader's timezone offset, so its date prefix is the local day and can sit one day
// behind the UTC date that Studio shows and that every existing entry uses.
//
// It never edits src/data/videos.ts — pasting is deliberate, so the translated strings are
// written by a person and reviewed in the diff.
//
// After pasting: translate title/speaker/summary for ar and fr, then `npm test`.
// src/lib/videos.test.ts fails the build if anything is missing or malformed.

import { mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');

/** The ICHR channel. Used only to read the public feed for the UTC upload date. */
const CHANNEL_ID = 'UCAjisJCwaixTxfyONHkN-0Q';
const DRY_RUN = process.env.DRY_RUN === '1';
const FORCE = process.env.FORCE === '1';

// A browser UA: the watch page served to a generic client omits the player response we
// need. This reads a public page and nothing else — no login, no API key.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function die(msg) {
  console.error(`ABORT: ${msg}`);
  process.exit(1);
}

/** Accepts a watch URL, a youtu.be link, an /embed/ link, or a bare ID. */
export function extractId(input) {
  if (!input) return null;
  const bare = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(bare)) return bare;
  let u;
  try {
    u = new URL(bare);
  } catch {
    return null;
  }
  const fromQuery = u.searchParams.get('v');
  if (fromQuery && /^[A-Za-z0-9_-]{11}$/.test(fromQuery)) return fromQuery;
  const m = u.pathname.match(/\/(?:embed|shorts|v)\/([A-Za-z0-9_-]{11})/) ?? u.pathname.match(/^\/([A-Za-z0-9_-]{11})$/);
  return m ? m[1] : null;
}

/** kebab-case, ASCII, collapsed — a safe URL segment. */
export function slugify(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining accents
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

/** Pull the fields we need out of the watch page's embedded JSON. */
function scrape(html) {
  const num = (re) => {
    const m = html.match(re);
    return m ? Number(m[1]) : null;
  };
  const str = (re) => {
    const m = html.match(re);
    if (!m) return null;
    try {
      return JSON.parse(`"${m[1]}"`); // the page stores these JSON-escaped
    } catch {
      return null;
    }
  };
  return {
    durationSeconds: num(/"lengthSeconds":"(\d+)"/),
    title: str(/"title":"((?:[^"\\]|\\.)*)","lengthSeconds"/) ?? str(/<meta name="title" content="([^"]*)"/),
    // NOTE: the watch page embeds these with the UPLOADER'S timezone offset
    // ("2026-08-30T19:36:02-07:00"), so slicing the date prefix yields the local
    // day, not the UTC one. Every entry in src/data/videos.ts uses UTC — which is
    // what the channel feed reports and what Studio displays — so this value is
    // only a FALLBACK. uploadDateUtc() below is the preferred source. Same class of
    // off-by-one that src/lib/dateline.ts formats in UTC to avoid.
    uploadDateLocal:
      (html.match(/"uploadDate":"(\d{4}-\d{2}-\d{2})/) ?? html.match(/"publishDate":"(\d{4}-\d{2}-\d{2})/))?.[1] ?? null,
    isUnlisted: /"isUnlisted":true/.test(html),
    isPrivate: /"isPrivate":true/.test(html),
  };
}

/**
 * The channel feed reports <published> in UTC, which is the convention every entry in
 * src/data/videos.ts follows. Preferred over the watch page's local-offset date.
 * Returns null for a video older than the feed's window (it lists only the latest 15),
 * in which case the caller falls back and says so.
 */
async function uploadDateUtc(id) {
  try {
    const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    // Match within one <entry> so a videoId is never paired with a sibling's date.
    for (const entry of xml.split('<entry>').slice(1)) {
      if (!entry.includes(`<yt:videoId>${id}</yt:videoId>`)) continue;
      return entry.match(/<published>(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
    }
  } catch {
    // A feed outage must not block adding a video; the watch-page date still works.
  }
  return null;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
  if (!res.ok) die(`${url} → HTTP ${res.status}`);
  return res.text();
}

/** maxres is not generated for every upload; fall back rather than write a 404 page as a JPEG. */
async function downloadPoster(id, dest) {
  for (const name of ['maxresdefault', 'sddefault', 'hqdefault']) {
    const url = `https://i.ytimg.com/vi/${id}/${name}.jpg`;
    const res = await fetch(url, { headers: { 'user-agent': UA } });
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    // YouTube answers a missing thumbnail with a small placeholder rather than a 404.
    if (buf.length < 5000) continue;
    if (buf[0] !== 0xff || buf[1] !== 0xd8) continue; // JPEG magic bytes
    writeFileSync(dest, buf);
    return { name, bytes: buf.length };
  }
  return null;
}

// Side-effect free on import — same rule the prisma/seed-*.mjs scripts follow, so the
// helpers above can be unit-tested without the CLI firing. Only a direct invocation runs.
async function main() {
  const input = process.argv[2];
  if (!input) die('usage: node scripts/add-video.mjs <youtube-url-or-id> [slug]');

  const id = extractId(input);
  if (!id) die(`could not read a video ID out of: ${input}`);

  console.log(`Reading https://www.youtube.com/watch?v=${id} …`);
  const meta = scrape(await fetchText(`https://www.youtube.com/watch?v=${id}`));
  // Prefer the feed's UTC date over the watch page's uploader-local one — see scrape().
  const utc = await uploadDateUtc(id);
  meta.uploadDate = utc ?? meta.uploadDateLocal;
  if (!utc && meta.uploadDateLocal) {
    console.warn(
      `⚠️  Not in the channel feed (it lists only the latest 15). Falling back to the watch page's\n` +
        `   local-timezone date, ${meta.uploadDateLocal} — CHECK IT against Studio; it can be a day off.`,
    );
  }

  if (meta.isPrivate) die('that video is private — it cannot be embedded.');
  if (meta.isUnlisted) console.warn('⚠️  This video is UNLISTED. It will embed, but it is not on the channel page.');
  if (!meta.durationSeconds) die('could not read the duration — YouTube may have changed the page shape.');
  if (!meta.title) die('could not read the title.');

  const slug = process.argv[3] ?? slugify(meta.title);
  const dir = join(REPO, 'public', 'media', slug);
  const poster = join(dir, 'poster.jpg');
  const posterUrl = `/media/${slug}/poster.jpg`;

  console.log(`  title:    ${meta.title}`);
  console.log(`  duration: ${meta.durationSeconds}s`);
  console.log(`  uploaded: ${meta.uploadDate ?? '(unknown — fill in by hand)'}${utc ? ' (UTC, from the channel feed)' : ''}`);
  console.log(`  slug:     ${slug}`);

  if (DRY_RUN) {
    console.log('\nDRY_RUN=1 — nothing written.');
  } else {
    if (existsSync(poster) && !FORCE) {
      console.log(`\n· poster already present: public${posterUrl} (FORCE=1 to re-download)`);
    } else {
      mkdirSync(dir, { recursive: true });
      const got = await downloadPoster(id, poster);
      if (!got) die('no usable thumbnail — every size was missing or too small.');
      console.log(`\n✅ poster: public${posterUrl} (${got.name}, ${(got.bytes / 1024).toFixed(0)} KB)`);
    }

    // Variants + manifest, via the one pipeline that already owns them. Without this the
    // poster ships full-size to phones and src/lib/videos.test.ts fails the build.
    console.log('\nGenerating responsive variants …');
    execFileSync(process.execPath, [join(REPO, 'scripts', 'gen-image-variants.mjs'), slug], { stdio: 'inherit' });
  }

  const size = existsSync(poster) ? statSync(poster).size : 0;
  console.log(`
  ────────────────────────────────────────────────────────────────
  Paste into the VIDEOS array in src/data/videos.ts, then translate
  the ar and fr strings (they are seeded with the English text):
  ────────────────────────────────────────────────────────────────
    {
      slug: '${slug}',
      youtubeId: '${id}',
      uploadDate: '${meta.uploadDate ?? 'YYYY-MM-DD'}',
      eventDate: '${meta.uploadDate ?? 'YYYY-MM-DD'}', // when it was RECORDED — usually earlier
      durationSeconds: ${meta.durationSeconds},
      playlist: 'geneva-panel-2026',
      poster: '${posterUrl}',
      relatedPostSlug: undefined, // slug of the newsroom article, if there is one
      i18n: {
        // location is the dateline place IN THIS LANGUAGE — 'Geneva' / 'جنيف' / 'Genève'.
        // Set it in all three or none; a half-set dateline fails videos.test.ts.
        en: { title: ${JSON.stringify(meta.title)}, speaker: 'Name · Affiliation', location: 'Geneva', summary: '' },
        ar: { title: '', speaker: '', location: '', summary: '' },
        fr: { title: '', speaker: '', location: '', summary: '' },
      },
    },
  ────────────────────────────────────────────────────────────────
  Then: npx tsc --noEmit && npm test
  Commit public/media/${slug}/** together with src/generated/blog-images.json,
  push, and confirm the poster returns 200 image/jpeg on production BEFORE
  treating the video as live.${size ? '' : '\n(No poster on disk — DRY_RUN, or the download was skipped.)'}
  `);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
