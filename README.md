<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# The International Coalition for Human Rights (ICHR)

The official website of ICHR — an institutional Geneva-NGO site with a **Newsroom** (press releases & statements) managed from a browser-based admin CMS. Articles are server-rendered for SEO and social link previews. Deployed on **Vercel**.

## Tech Stack

- **Framework:** [Astro 5](https://astro.build) (SSR via `@astrojs/vercel`) + TypeScript + Tailwind CSS v4
- **Interactive islands:** React 19 (admin dashboard, Leaflet world map)
- **Database:** PostgreSQL (Neon) via **Prisma**
- **API:** Astro API endpoints under `src/pages/api/**` (same origin)
- **Image uploads:** Vercel Blob · **Markdown:** `marked` + `sanitize-html` (server) / `DOMPurify` (admin preview)

The newsroom (`/news`, `/news/:slug`) is **server-rendered on demand**, so each article ships real HTML with per-post `<title>`, Open Graph / Twitter, canonical, and JSON-LD `NewsArticle` — links unfurl on social and are crawlable with no client JS. Marketing pages are statically prerendered. The admin (`/admin`) is a `noindex` React island.

## Project layout

```
astro.config.mjs            # SSR + @astrojs/vercel adapter + i18n (en/ar/fr)
CLAUDE.md                   # architecture, DB workflow, gotchas — read this first
prisma/
  schema.prisma             # User, Post (locale + translationKey), GalleryImage
  seed.mjs                  # admin user ONLY (create-only, guarded)
  migrate-i18n.mjs          # idempotent schema change over Neon's HTTPS driver
  seed-*.mjs                # one per press release; mirror of the DB content
scripts/
  gen-statement-cover.mjs   # renders the branded cover cards (en/ar/fr)
src/
  pages/
    *.astro                 # English routes — thin wrappers over components/pages
    ar/** · fr/**           # Arabic (RTL) and French route trees
    api/**                  # API endpoints (auth/login, content/posts CRUD, upload)
    sitemap.xml.ts          # SSR sitemap with per-story hreflang alternates
  components/pages/         # the actual page bodies, shared by all three locales
  i18n/                     # locale helpers + strings/{en,ar,fr}.ts dictionaries
  server/                   # server-only: db (Prisma), auth (JWT), posts (zod/queries)
  components/               # .astro UI (Header, Footer, NewsCard, LanguageSwitcher …)
  components/react/         # client islands: AdminDashboard, WorldMap, apiClient
  lib/                      # api (SSR reads), markdown, jsonld, assets, locations
  styles/index.css          # design system (navy + restrained gold)
public/blog/<slug>/         # static article images and cover cards
```

**Article text lives in the database, not in git** — `git grep` won't find it. The `prisma/seed-*.mjs` files are a mirror kept as the source-of-record. See [CLAUDE.md](./CLAUDE.md).

## Run locally

**Prerequisites:** **Node.js 22.6+** (the seeds use `--env-file`, the tests use `--experimental-strip-types`) and a PostgreSQL database (a free [Neon](https://neon.tech) project works great).

```bash
npm install
cp .env.example .env.local    # DATABASE_URL + DATABASE_URL_UNPOOLED + JWT_SECRET + ADMIN_*
npm run db:push               # apply the schema — there are NO migrations to deploy
node --env-file=.env.local prisma/seed.mjs   # create the admin user
npm run dev                   # http://localhost:4321
```

> **There is no `prisma/migrations/` directory.** `prisma migrate deploy` would silently create nothing, so use `npm run db:push`. If your network blocks Postgres on port 5432 (`P1001`), apply schema changes with an idempotent script over Neon's HTTPS driver instead — see `prisma/migrate-i18n.mjs`. Database scripts read **`.env.local`**.

`astro dev` serves the pages **and** the API endpoints on one origin — no separate backend process.

**Admin:** open http://localhost:4321/admin and sign in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set. Create a post, upload a cover + gallery images, watch the live Markdown preview, **Save draft** (hidden from `/news`) or **Publish**. Publishing is live immediately, no redeploy. (Local image uploads need `BLOB_READ_WRITE_TOKEN`; seeded posts use static images, so they work without it.)

## Deploy on Vercel

1. **Import the repo** into Vercel (framework auto-detected as Astro).
2. **Storage → Create:** add **Neon Postgres** and **Blob** to the project (Vercel injects `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` automatically).
3. **Environment variables** (Project → Settings → Environment Variables):
   - `JWT_SECRET` — a long random string
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD` — admin login
   - `PUBLIC_SITE_URL` — your production URL (for canonical/OG)
4. **Build command** is `npm run build` (runs `prisma generate` then `astro build`). After the first deploy, apply the schema and create the admin user against the production DB — put the production `DATABASE_URL` in `.env.local` and run:
   ```bash
   npx prisma db push                            # NOT `migrate deploy` — no migrations exist
   node --env-file=.env.local prisma/seed.mjs    # create-only; never rotates an existing password
   ```
   To rotate the admin password later: `RESET_ADMIN_PASSWORD=1 node --env-file=.env.local prisma/seed.mjs`.

Publishing from `/admin` is live immediately — no redeploy per post.

> **Seed scripts overwrite their own slug.** Re-running `prisma/seed-<post>.mjs` reverts any edit made to that post through `/admin` and rebuilds its gallery. They all guard on a `neon.tech` target and support `DRY_RUN=1`.

## Environment variables

| var | purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres **pooled** connection string (required) |
| `DATABASE_URL_UNPOOLED` | Neon **direct** connection; required by `schema.prisma` `directUrl` |
| `JWT_SECRET` | signs admin login tokens (required; the app throws without it) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | seeded admin credentials — use a strong password, the login is not rate-limited |
| `PUBLIC_SITE_URL` | canonical/OG absolute base (your domain) |
| `PUBLIC_API_URL` | optional origin override for the admin client; empty = same-origin |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (admin uploads); auto-set on Vercel |

`.env` and `.env.local` are gitignored and must never be committed.

## How images are served

- **Admin uploads** → Vercel Blob, served from its CDN (absolute `https://…blob.vercel-storage.com/…` URL stored in the DB).
- **Bundled article assets** (e.g. the seed post) → `public/blog/<slug>/*.jpg`, served by Vercel as static files.

## Scripts

- `npm run dev` — Astro dev (pages + API)
- `npm run build` — `prisma generate` + `astro build`
- `npm run check` — `astro check`
- `npm test` — unit tests (Node's built-in runner)
- `npm run db:push` — apply `schema.prisma` (there are no migrations)
- `npm run db:seed` — create the admin user (create-only, guarded)
- `node scripts/gen-statement-cover.mjs [locale]` — render the branded cover cards

## License

© The International Coalition for Human Rights (ICHR). All rights reserved.
