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
astro.config.mjs            # SSR + @astrojs/vercel adapter + Tailwind v4
prisma/
  schema.prisma             # User, Post, GalleryImage (PostgreSQL)
  seed.mjs                  # admin user + launch press release
src/
  pages/
    *.astro                 # routes (index, about, news/, admin, 404 …)
    api/**                  # API endpoints (auth/login, content/posts CRUD, upload)
  server/                   # server-only: db (Prisma), auth (JWT), posts (zod/queries)
  components/               # .astro UI (Header, Footer, NewsCard, Dateline …)
  components/react/         # client islands: AdminDashboard, WorldMap, apiClient
  lib/                      # api (SSR reads), markdown, dateline, assets, locations
  styles/index.css          # design system (navy + restrained gold)
public/blog/<slug>/         # static article images (e.g. the seed post)
```

## Run locally

**Prerequisites:** Node.js 20+ and a PostgreSQL database (a free [Neon](https://neon.tech) project works great; use its **pooled** connection string).

```bash
npm install
cp .env.example .env          # set DATABASE_URL (Neon) + JWT_SECRET + ADMIN_*
npm run db:migrate            # apply the schema (or: npx prisma migrate dev)
npm run db:seed               # admin user + the launch press release
npm run dev                   # http://localhost:4321
```

`astro dev` serves the pages **and** the API endpoints on one origin — no separate backend process.

**Admin:** open http://localhost:4321/admin and sign in with `admin` / `admin` (set via `ADMIN_*`). Create a post, upload a cover + gallery images, watch the live Markdown preview, **Save draft** (hidden from `/news`) or **Publish**. (Local image uploads need `BLOB_READ_WRITE_TOKEN`; the seed post uses static images so it works without it.)

## Deploy on Vercel

1. **Import the repo** into Vercel (framework auto-detected as Astro).
2. **Storage → Create:** add **Neon Postgres** and **Blob** to the project (Vercel injects `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` automatically).
3. **Environment variables** (Project → Settings → Environment Variables):
   - `JWT_SECRET` — a long random string
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD` — admin login
   - `PUBLIC_SITE_URL` — your production URL (for canonical/OG)
4. **Build command** is `npm run build` (runs `prisma generate` then `astro build`). After the first deploy, run the migration + seed against the production DB:
   ```bash
   DATABASE_URL="<neon-pooled-url>" npx prisma migrate deploy
   DATABASE_URL="<neon-pooled-url>" ADMIN_PASSWORD="<pw>" npm run db:seed
   ```
   (or run them locally pointed at the production `DATABASE_URL`).

Publishing from `/admin` is live immediately — no redeploy per post.

## Environment variables

| var | purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres pooled connection string (required) |
| `JWT_SECRET` | signs admin login tokens (required) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | seeded admin credentials |
| `PUBLIC_SITE_URL` | canonical/OG absolute base (your domain) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (admin uploads); auto-set on Vercel |

## How images are served

- **Admin uploads** → Vercel Blob, served from its CDN (absolute `https://…blob.vercel-storage.com/…` URL stored in the DB).
- **Bundled article assets** (e.g. the seed post) → `public/blog/<slug>/*.jpg`, served by Vercel as static files.

## Scripts

- `npm run dev` — Astro dev (pages + API)
- `npm run build` — `prisma generate` + `astro build`
- `npm run check` — `astro check`
- `npm run db:migrate` / `npm run db:seed` — Prisma migrate deploy / seed

## License

© The International Coalition for Human Rights (ICHR). All rights reserved.
