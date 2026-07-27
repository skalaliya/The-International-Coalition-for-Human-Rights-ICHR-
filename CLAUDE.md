# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

The site is the official web presence of the **International Coalition for Human Rights (ICHR)**, a Geneva NGO. It is trilingual (English, Arabic, French) with a server-rendered newsroom and a browser-based admin CMS. It is live at <https://www.ichr-international.org> and `main` auto-deploys to Vercel.

**Read the two "gotchas" sections before touching the database or publishing an article.** Both describe things that will silently do the wrong thing otherwise.

---

## Stack

- **Astro 5** SSR (`output: 'server'`, `@astrojs/vercel` adapter) + TypeScript + Tailwind v4
- **React 19** islands: `AdminDashboard`, `WorldMap` (Leaflet)
- **Prisma 5** + **Neon Postgres**
- Markdown: `marked` + `sanitize-html` server-side; `DOMPurify` in the admin preview
- Image uploads: Vercel Blob

**Node 22.6+ is required.** The seed scripts use `node --env-file`, and the tests use `--experimental-strip-types`. Node 20 will not run either.

Marketing pages are `prerender = true` (static). The newsroom (`/news`, `/news/:slug`) is server-rendered per request, so articles ship real HTML with per-post OG tags, canonical, hreflang and JSON-LD.

---

## Commands

```bash
npm install
npm run dev        # http://localhost:4321 — pages AND API on one origin
npm run build      # prisma generate && astro build
npm run check      # astro check
npm test           # node --experimental-strip-types --test src/lib/*.test.ts
npx tsc --noEmit   # type-check
```

Before any commit that touches source: `npx tsc --noEmit`, `npm run check`, `npm run build`, `npm test`. All four should be clean — they are today.

---

## Gotcha 1: the database workflow is not what the Prisma docs imply

- **There is no `prisma/migrations/` directory.** `prisma migrate deploy` (and the `db:migrate` script) is a **silent no-op** — it will appear to succeed and create nothing. Schema changes are applied with `prisma db push`, or with a hand-written idempotent SQL script.
- **TCP 5432 is blocked on this network.** `prisma db push` and any `PrismaClient` script will hang and fail with `P1001` locally. Vercel reaches Neon fine; only local tooling is affected.
- **The workaround** is Neon's HTTPS serverless driver (`@neondatabase/serverless`, port 443). Schema changes go through an idempotent script — see `prisma/migrate-i18n.mjs` (`CREATE TABLE/INDEX IF NOT EXISTS`, `ALTER TABLE … IF NOT EXISTS`). Content seeds do the same — see `prisma/seed-translations-http.mjs`.
- **All `prisma/*.mjs` run as** `node --env-file=.env.local prisma/<script>.mjs`. The operative env file for database work is **`.env.local`**, not `.env`.
- `schema.prisma` needs **both** `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct, for `directUrl`).

### Seed-script hazards

Every `prisma/seed-*.mjs` is a **one-shot importer that overwrites its own slug**. Re-running one reverts any edit made to that post through `/admin` and rebuilds its gallery (`DELETE` + re-`INSERT`, deliberately — appending would duplicate rows). They all:

- abort unless `DATABASE_URL` points at a `neon.tech` host,
- support `DRY_RUN=1` (no write) and `UNPUBLISH=1` (status → draft),
- assert a read-back after writing,
- export their content side-effect free, so a sibling script can import it.

`prisma/seed.mjs` (what `npm run db:seed` runs) is **admin-user only**. It is create-only: re-running never touches an existing password. Rotating is explicit — `RESET_ADMIN_PASSWORD=1 node --env-file=.env.local prisma/seed.mjs`.

---

## Gotcha 2: article content lives in the database, not in git

`git grep` will not find the text of a published article. Posts are rows in Neon, authored through `/admin`. The `prisma/seed-*.mjs` scripts are a mirror of that content, kept as the git source-of-record — they are not the source of truth.

Consequences:
- Publishing or editing via `/admin` is **live immediately, with no deploy**.
- A deploy never changes article text.
- Conversely, re-running a seed **can** silently revert an editor's work.

### Data model

`Post` carries `locale` and `translationKey`. One story = up to three rows sharing a `translationKey`, one per locale. `@@unique([slug, locale])` — a slug is unique **per locale**, so the same slug is reused across languages. `hashtags` is a JSON-encoded string, not an array column.

`translationKey` is what binds the language toggle, the `hreflang` alternates, and the sitemap grouping. **Never regenerate an existing one** — it orphans that story's translations. `createPost` has an auto-link safety net: if no key is supplied it adopts a sibling's key by slug (provably safe given the compound unique).

---

## Trilingual architecture

English at the root, Arabic under `/ar` (RTL), French under `/fr`. Configured in `astro.config.mjs`: `defaultLocale: 'en'`, `prefixDefaultLocale: false`, plus `/en/* → /*` redirects.

**Route files are ~5-line wrappers.** `src/pages/index.astro`, `src/pages/ar/index.astro` and `src/pages/fr/index.astro` each render `<HomePage lang="…" />`. The actual page body lives once in `src/components/pages/*Page.astro`.

> To change a page's content, edit `src/components/pages/<X>Page.astro` — **not** the three route files.

- UI strings: `src/i18n/strings/{en,ar,fr}.ts`. `en` is canonical; `export type Dict = typeof en` forces `ar` and `fr` to match, so a missing key is a **compile error**. Array lengths are *not* type-enforced — keep them equal by hand.
- Helpers: `src/i18n/index.ts` — `stripLocale`, `localizedPath`, `localizeHref`, `localeAlternates`, `dir`, `ogLocale`.
- RTL: use logical CSS utilities (`ms/me/ps/pe/start/end`, `padding-inline-start`, `border-inline-start`, `text-align: start`) and the `.rtl-flip` class for directional icons. Never `ml/mr/left/right`.

---

## Publishing an article

**Route A — the admin CMS** (`/admin`): sign in, create the post, upload a cover and gallery images, publish. Live immediately. Use "+ Add \<language\>" on a story to create a translation pre-linked to its `translationKey`.

**Route B — a seed script**, for press releases that need designed cover art. **Use the skill: `.claude/skills/publish-press-statement/`** — it drives the whole workflow, including the editorial questions that must be asked before publishing someone's signed statement.

1. Write `prisma/seed-statement-<name>.mjs` from the skill's `reference/statement-config-skeleton.mjs`: one file, three locales, content only. The mechanism lives in **`prisma/lib/press-statement.mjs`** — validation, the neon.tech guard, an **atomic** `sql.transaction` upsert, the gallery rebuild and the read-back asserts. Don't re-implement any of it, and don't touch the two older hand-written seeds (`seed-statement-procedural-bias`, `seed-statement-cargo-trucks`) — they are the record of what was executed against production.
2. Generate the covers: `node scripts/gen-press-cover.mjs prisma/seed-statement-<name>.mjs` → `public/blog/<slug>/cover{,-ar,-fr}.jpg`, driven by the `COVERS` the statement file exports. It measures every headline line's rendered ink and refuses to write an overflowing card; it never overwrites an existing file without `FORCE=1`.
3. **Commit and deploy the images first.** `coverImageUrl` points at a static path; publishing before the image is deployed renders a broken image. Poll the live URLs for `200 image/jpeg` — don't assume.
4. Seed as a **draft** (`node --env-file=.env.local prisma/seed-statement-<name>.mjs`), review at `/admin`, then take the story live with `PUBLISH=1`. `UNPUBLISH=1` drafts all three locales at once.

`npm test` covers the engine (`prisma/lib/press-statement.test.mjs`), including a drift test that fails if the zod limits in `src/server/posts.ts` change without `LIMITS` following.

### Cover-card rendering gotchas (already solved in `scripts/lib/press-card.mjs` — don't regress them)

The cards are SVG rasterized through `sharp`. `sharp` will happily render Arabic **incorrectly** and exit 0, so **always open the generated JPEG and look at it**.

- `logo.png` has an opaque navy backdrop (`#1D5277`), not transparency — hence the white chip behind the mark and the circular clip on the watermark.
- RTL text: `direction="rtl"` **with `text-anchor="start"`**, anchored at the right margin. `text-anchor="end"` fights `direction` and pushes lines off-canvas.
- No `letter-spacing` on Arabic — it breaks the glyph joins.
- Any string mixing digits with Arabic (a date) needs an explicit `direction="rtl"`. Without it the paragraph is treated as LTR and the year binds to the month: `09 يوليو 2026` renders as `يوليو 2026 09`.
- U+2028/U+2029 cannot appear in a regex literal (they are line terminators) — see `src/lib/jsonld.ts`.

---

## Environment variables

| var | purpose |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (required) |
| `DATABASE_URL_UNPOOLED` | Neon **direct** connection; `schema.prisma` `directUrl` |
| `JWT_SECRET` | signs admin tokens (required; the app throws without it) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | seeded admin credentials |
| `PUBLIC_SITE_URL` | canonical/OG absolute base |
| `PUBLIC_API_URL` | optional origin override for the admin client; empty = same-origin |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (admin uploads); auto-set on Vercel |

`.env` and `.env.local` are gitignored and must never be committed.

---

## Security invariants — preserve these

Verified by audit. If a change would break one of these, it is wrong.

- **Every mutating API route calls `verifyRequest`** (`src/server/auth.ts`). Public `GET`s return published posts only.
- **JWT is pinned to HS256** and throws if `JWT_SECRET` is missing. No `alg:none`.
- **Prisma is parameterized everywhere.** Seed scripts use bound `$1` params, never string interpolation. The only `$executeRawUnsafe` is static DDL in `migrate-i18n.mjs`.
- **JSON-LD is escaped** via `safeJsonLd()` (`src/lib/jsonld.ts`). Never inline `JSON.stringify` into `set:html` — `JSON.stringify` does not escape `<`, and article titles are CMS-controlled.
- **Markdown is sanitized** (`src/lib/markdown.ts`): no `script`, no SVG, schemes limited to http/https/mailto, links forced to `rel="noopener noreferrer"`.
- **Uploads** (`src/pages/api/content/posts/upload.ts`): auth + MIME allow-list + magic-byte sniff + 10 MB cap + server-generated filename. SVG rejected.
- **Locale filtering is mandatory on every post query** — otherwise an article is served in the wrong language, or a draft leaks. Drafts 404.
- **A DB outage degrades to a localized 404 / empty state, never a 500** (`src/lib/api.ts` wraps every query).
- `robots.txt` disallows `/admin`; the sitemap emits published-only, XML-escaped URLs.

### Known gaps (not yet fixed)

- `POST /api/auth/login` has **no rate limiting**. The bcrypt dummy-hash timing defense is present.
- The admin JWT is stored in `localStorage`, so it is readable by any script on the origin.
- The CSP in `vercel.json` is `Content-Security-Policy-Report-Only` with `script-src 'unsafe-inline'` — it enforces nothing. Enforcing it means externalizing the inline scripts in `Header.astro`, `ShareButtons.astro` and `DonatePage.astro`; nonces don't work here because the marketing pages are prerendered and the CSP is a static header.
- **The Donate, Contact and Volunteer forms are inert** — no `action`, no `fetch`, no endpoint. Submissions are silently discarded. This is known and deliberate for now; don't assume they work.
- `apiClient.ts` requests `pageSize=100` but the server clamps to 50 and the admin has no pagination, so past 50 `Post` rows older posts vanish from `/admin`.
