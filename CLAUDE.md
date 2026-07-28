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

**The exception: response control belongs to the route.** The three `news/[slug].astro` wrappers load the article themselves (`loadArticle` in `src/server/article.ts`) and set `Astro.response.status = 404` before rendering `<NotFoundPage>`. This is not decoration — `Astro.rewrite()` / `Astro.response.status` from inside a *component* renders into an already-sent response, which Astro reports as `ResponseSentError` and the adapter serves as the string "Internal server error" **with HTTP 200**. That was a live bug on every missing slug, every draft and every article during a DB outage. `src/lib/pageComponents.test.ts` fails the build if a page component starts controlling the response again.

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
| `PUBLIC_SITE_URL` | canonical/OG absolute base — **set on Vercel for Production and Development only, deliberately not for Preview** (see below) |
| `PUBLIC_API_URL` | optional origin override for the admin client; empty = same-origin |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (admin uploads); auto-set on Vercel |

`.env` and `.env.local` are gitignored and must never be committed.

**Do not add `PUBLIC_SITE_URL` to the Preview environment.** A preview's hostname changes per branch, so any fixed value would be wrong for every branch but one. `src/lib/siteUrl.ts` resolves the origin instead — `PUBLIC_SITE_URL` → (in production) `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_BRANCH_URL` → `VERCEL_URL` → `http://localhost:4321` — and `astro.config.mjs`, `src/lib/site.ts` and `src/lib/assets.ts` all go through it, so `Astro.site` and `SITE_URL` cannot drift apart. This depends on **Project Settings → Environment Variables → “Enable access to System Environment Variables”** staying enabled; turn it off and previews silently fall back to localhost again. The symptom to watch for: a preview's `/sitemap.xml` listing `http://localhost:4321/...`, which is what it did before this resolver existed.

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
- **A DB outage degrades to a localized 404 / empty state, never a 500** on *reader-facing* pages (`src/lib/api.ts` wraps every query; the article routes turn a null into a real 404). The **admin API is the opposite on purpose**: it returns 503 + `Retry-After`, never a 404, so an editor is never told a post was deleted when the database was merely unreachable (`src/lib/prismaErrorCodes.ts`, `src/server/http.ts`).
- **Query params are clamped before they reach Prisma** (`src/lib/pagination.ts`). `Math.max(1, Number(x))` is not enough — `Number('abc')` is `NaN` and `Math.max(1, NaN)` is `NaN`, which reaches Prisma as `skip: NaN`, throws, and gets swallowed into an empty page.
- `robots.txt` disallows `/admin`; the sitemap emits published-only, XML-escaped URLs.

### Known gaps (not yet fixed)

- `POST /api/auth/login` has **no application-level rate limiting**. Handled at the edge instead, by the Vercel Firewall custom rule **“Login rate limit”** (project `ichr`, Firewall → Custom Rules): `Request Path Equals /api/auth/login` → fixed window, **5 requests / 60 s keyed on IP Address**, action **Too Many Requests (429)**. Verified live on production: the 11th request in a window answers 429. It is scoped by **path only, not method** — the dashboard ORs conditions inside a rule group, so adding `Request Method = POST` would have widened the rule to every POST on the site rather than narrowing it. Only `POST` is served at that path, so path-only is a strict superset with no legitimate traffic caught. The rule is metered: allowed matching requests bill at $0.50/1M, blocked ones are free. The bcrypt dummy-hash timing defence is real: `BCRYPT_COST` is shared by `login.ts` and `prisma/seed.mjs`, and `src/lib/bcryptCost.test.ts` fails the build if they drift (they did, once — cost 10 vs 12, a measured 154 ms username-enumeration oracle).
- **The stored admin password hash is still at bcrypt cost 10, so the username-enumeration oracle is live in production — inverted.** `login.ts` is correct and symmetric, but `bcryptCost.test.ts` only proves the two *code* constants agree; it cannot see the row in Neon. That row was hashed before the cost bump, so the real-user branch compares against a cost-10 hash while a missing user compares against the cost-12 `DUMMY_HASH`. Measured against the preview deploy on real data, interleaved, n=12 each: existing username **371 ms**, unknown username **703 ms** — a stable **332 ms** gap that now identifies a valid username by being *faster*. Calibration on the same machine: cost 10 = 87 ms, cost 12 = 351 ms, delta 264 ms, which is the gap once scaled to Vercel's slower CPU. **Now self-healing in code**: `login.ts` re-hashes the stored password at `BCRYPT_COST` after a verified sign-in whenever the row's cost is lower (`needsRehash` in `src/lib/bcryptHash.ts`), so the first successful admin login closes the gap permanently and any future cost bump migrates itself. The upgrade is wrapped so it can never fail a valid login. Only ever upgrades — a stronger hash is left alone, so lowering `BCRYPT_COST` cannot weaken stored credentials.

  To fix it immediately instead of waiting for a login: `RESET_ADMIN_PASSWORD=1 node --env-file=.env.local prisma/seed.mjs`. **That script already uses the Neon HTTPS driver** (`neon()` at `prisma/seed.mjs:60`), not `PrismaClient` on :5432 — an earlier note here claimed otherwise; no separate rotate script is needed. It re-hashes whatever `ADMIN_PASSWORD` is set to in `.env.local`, so **check that value first**: if it matches the current password this is a pure cost upgrade, and if it doesn't, it silently changes the admin password.

  Verify the stored cost at any time (reads the prefix only, never the hash):

  ```bash
  node --env-file=.env.local -e "import('@neondatabase/serverless').then(async({neon})=>{const sql=neon(process.env.DATABASE_URL);for(const r of await sql.query('SELECT username, substring(password from 1 for 7) AS p FROM \"User\"'))console.log(r.username, r.p)})"
  ```
- The admin JWT is stored in `localStorage`, so it is readable by any script on the origin. A session expiry no longer loses work: any 401 stashes the draft in `sessionStorage` and restores it after re-login (`src/lib/draftStash.ts`).
- The CSP in `vercel.json` is still `Content-Security-Policy-Report-Only` with `script-src 'unsafe-inline'` — it enforces nothing, but it now **reports** to `/api/csp-report`, so the report-only phase produces evidence. **What blocks enforcement is not our three inline scripts.** Astro emits its island bootstrap and the `astro-island` element definition inline on every page carrying an island: measured on a real build, 4 inline `<script>` tags on `/`, 3 on `/locations`, 2 on `/admin`, 1 even on `/about`. Turning on `script-src 'self'` breaks the WorldMap in all three locales and breaks `/admin` entirely. Also verified: **dropping `is:inline` does not externalize a script** — Astro re-inlines small bundled chunks (the `Header.astro` menu script comes back as a minified inline `type="module"`). Enforcing needs Astro's `experimental.csp` hashing, and the meta CSP it emits is ANDed with this header, so the header's `script-src` must be relaxed in the same change.
- **The Donate, Contact and Volunteer forms are inert** — no `action`, no `fetch`, no endpoint. Submissions are silently discarded. This is known and deliberate for now; don't assume they work.
