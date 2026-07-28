---
name: publish-press-statement
description: Publish a press statement, press release or field update to the ICHR newsroom in English, Arabic and French — from a folder under press/ (press-1, press-2, …) containing the text and designed cards, or from text pasted into chat. Covers slug and translationKey, branded cover generation, artwork re-encoding, the seed, the deploy-before-publish order, and verification. Use whenever the user says "publish this statement", "post this to the website", "put this on the site", "the next press release", or points at a press/ folder.
---

# Publishing a press statement to the ICHR newsroom

Read `CLAUDE.md` first if you have not this session — especially the two gotchas. The short
version: **article text lives in Neon, not in git**; publishing is instant and needs no deploy,
but the **images do** need a deploy, so they always go first.

Work through these gates in order. Do not skip ahead; each one exists because it failed once.

---

## 1. Read the source

```bash
ls -la press/<n>/ && textutil -convert txt -stdout press/<n>/*.rtf
sips -g pixelWidth -g pixelHeight press/<n>/*.jpg
```

Then **open every image** with the Read tool. You need to know whether the artwork is square
social cards (good covers), A4 document pages (poor covers — generate proper ones), or
photographs. Report dimensions and file sizes back to the user.

`press/` is untracked source material. Never commit it.

## 2. Editorial gate — stop and ask

Never guess on any of these. Ask, in one batched question, before writing anything:

- **The dateline city.** Read it off the statement. It has been Geneva and it has been Paris.
  Assuming Geneva is the single most likely mistake in this workflow.
- **OCR-looking corruption.** press-2 read "communities at heightened Latin" (for "risk") in
  both the text and the artwork. Offer: correct it / keep verbatim / drop the phrase.
- **Named victims, minors, or attribution of responsibility to a named force.** These are the
  user's call, and once live the page is indexed and cached. Preserve every "reported" /
  "alleged" hedge, and check the AR/FR translations keep them — both languages drop hedges easily.
- **The sign-off and any contact block.** Prior statements end with the org name, tagline and
  dateline; contact details live in the site footer and on `/contact`.
- **How far to go**: prepare-and-hand-over, or publish live.

Default to publishing the text **verbatim**. You are reproducing someone's signed statement.

## 3. Identifiers

- **slug**: `condemnation-<subject>-<place>-<month>-<year>`, lowercase, `^[a-z0-9-]+$`, ≤120.
  Check it is free: `ls public/blog/ && grep -rn "SLUG = " prisma/`.
- **translationKey**: `node -e "console.log(require('crypto').randomUUID())"`, **once**. Hardcode
  it. Never regenerate — it is what binds the three locales for the language toggle, the
  hreflang alternates and the sitemap grouping.
- **category** must be exactly one of `Press Release | Statement | Field Update | News`.
- **date** is the statement's own date as a `'YYYY-MM-DD'` **string**, never a `Date`.

## 4. Write the statement file

Copy `reference/statement-config-skeleton.mjs` to
`prisma/seed-statement-<name>.mjs`. One file, three locales, exporting `STATEMENT` and `COVERS`.
The mechanism lives in `prisma/lib/press-statement.mjs` — do not re-implement SQL, guards or
read-backs, and do not touch the two older hand-written seeds (`seed-statement-procedural-bias`,
`seed-statement-cargo-trucks`); they are the record of what was executed.

Gallery images hang off the locale whose language they are in — English cards go on the English
row only.

## 5. Markdown rules

These render wrong rather than erroring. `validateStatement` catches all three, but write them
right the first time:

- `---` needs a **blank line before and after**. Directly under text it is a setext heading and
  turns the line above into an `<h2>`.
- **No blank lines between `- ` bullets** — that produces a loose list (`<li><p>`) that spaces
  differently from every other article.
- `- ` needs the space. `-Name (child).` is not a bullet; it renders as a paragraph.
- Source victim lists arrive with mixed `-`, `.` and `•` markers. Normalize the markers,
  preserve every name and parenthetical exactly.

## 6. Covers

```bash
node scripts/gen-press-cover.mjs prisma/seed-statement-<name>.mjs
```

It measures the rendered ink of every headline line against the 1024px column and refuses to
write an overflowing card, and it will not overwrite an existing file without `FORCE=1`.

**Then open every JPEG with the Read tool and look at it.** The gate only sees geometry. Broken
Arabic joins, tofu from a missing font, and a date rendered `يوليو 2026 23` are all a perfectly
legal width, and `sharp` exits 0 on every one of them. See `reference/cover-invariants.md`.

Generate covers on macOS — the Arabic font (`Geeza Pro`) is not on Linux/CI.

## 7. Re-encode supplied artwork

`/blog/*` is served raw; there is no image optimization anywhere in the site.

```bash
node -e "import('sharp').then(async ({default:s})=>{const O='public/blog/<slug>';
for (const [src,dst] of [['press/<n>/1.jpg','card-1.jpg'],['press/<n>/2.jpg','card-2.jpg']])
  { await s(src).resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).jpeg({quality:84,mozjpeg:true}).toFile(\`\${O}/\${dst}\`); console.log(dst); }})"
```

Then confirm only the new directory changed: `git status --short public/blog`.

## 7b. Generate responsive variants — REQUIRED

`/blog/*` is served raw: no `<Image>`, no CDN transform. Without variants a phone
downloads the desktop original — measured at 375px, a 1200px cover in a 325px box and
~3.2 MB of gallery on one article.

```bash
node scripts/gen-image-variants.mjs <slug>
```

It writes `-400/-800/-1200` files next to each original **and** updates
`src/generated/blog-images.json`, which `src/lib/assets.ts` reads to build every srcset.
Commit the manifest with the images. `npm test` fails if any published image is missing
from it, so a forgotten run cannot ship.

If it reports an image it could not read, that is usually macOS quarantine:
`xattr -c <file>`, then re-run.

## 8. Gates

```bash
npx tsc --noEmit && npm run check && npm run build && npm test
```

```bash
DRY_RUN=1 node --env-file=.env.local prisma/seed-statement-<name>.mjs
```

`DRY_RUN` validates and writes nothing. Check the printed locations, covers and body lengths.
Rendering the bodies through `src/lib/markdown.ts` and comparing the structure across the three
locales (paragraph, `<ul>`, `<li>` and `<hr>` counts) catches translation-formatting drift.

## 9. Commit, push, then WAIT

Stage only the new artwork and code — never `press/`.

The images must be deployed **before** anything references them; `coverImageUrl` is a static
path, and publishing first puts a broken image on a live press statement. Poll until every file
is `200 image/jpeg`:

```bash
for f in cover.jpg cover-ar.jpg cover-fr.jpg card-1.jpg card-2.jpg; do curl -sS -o /dev/null -w "%{http_code} %{content_type} $f\n" "https://www.ichr-international.org/blog/<slug>/$f"; done
```

A 404 fetched before the deploy landed can stay edge-cached briefly — re-probe rather than
trusting a single miss.

## 10. Seed, then publish

Two steps on purpose. The first writes **drafts** — nothing is public:

```bash
node --env-file=.env.local prisma/seed-statement-<name>.mjs
```

Review at `/admin`, then take the whole story live:

```bash
PUBLISH=1 node --env-file=.env.local prisma/seed-statement-<name>.mjs
```

Rollback drafts all three locales at once:
`UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-<name>.mjs`

## 11. Verify live

See `reference/verify-checklist.md`. In short: the `/news` card, the article in all three
locales, the language toggle cycling all three, `hreflang` alternates, escaped JSON-LD, the
gallery, and all three URLs in `/sitemap.xml`.

Finally, report anything you had to flag — a typo that remains in the artwork, a wording
mismatch between the body and the cards — so the user can re-export.
