<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# The International Coalition for Human Rights (ICHR)

The official website of ICHR — an institutional Geneva-NGO site with a **Newsroom** (press releases & statements) managed from a browser-based admin CMS. Articles are server-rendered for SEO and social link previews.

## Tech Stack

- **Frontend:** [Astro 5](https://astro.build) (SSR) + TypeScript + Tailwind CSS v4
- **Interactive islands:** React 19 (admin dashboard, Leaflet world map)
- **Backend / API:** Node.js + Express + Prisma ORM (SQLite)
- **Markdown:** `marked` + `sanitize-html` (server) / `DOMPurify` (admin preview)
- **Icons:** Lucide · **Maps:** Leaflet

The newsroom (`/news`, `/news/:slug`) is **server-rendered on demand**, so each article ships real HTML with per-post `<title>`, Open Graph / Twitter, canonical, and JSON-LD `NewsArticle` — links unfurl on social and are crawlable with no client JS. Marketing pages are statically prerendered. The admin (`/admin`) is a `noindex` React island.

## Project layout

```
astro.config.mjs            # Astro config: SSR, node middleware adapter, Tailwind v4, dev proxy
server.mjs                  # PROD single-origin entry (Express API + uploads + Astro SSR)
src/
  layouts/BaseLayout.astro  # <head> SEO/OG/JSON-LD + Header + Footer
  pages/                    # .astro routes (index, about, news/, admin, 404, …)
  components/               # .astro UI (Header, Footer, NewsCard, Dateline …)
  components/react/         # client islands: AdminDashboard, WorldMap, apiClient
  lib/                      # api (SSR fetch), markdown, dateline, assets, locations
  styles/index.css          # design system (navy + restrained gold)
server/                     # Express + Prisma API
  prisma/schema.prisma      # User, Post, GalleryImage, VideoItem
  prisma/seed.js            # admin user + launch press release
  src/routes/content.js     # /api/content/posts CRUD + uploads
public/blog/<slug>/         # static article images (e.g. the seed post)
```

## Run locally

**Prerequisites:** Node.js 18+ (20/22 recommended).

### 1. Backend API

```bash
cd server
npm install
cp .env.example .env                      # then edit secrets if desired
npx prisma migrate dev --name init_newsroom   # creates dev.db + runs the seed
# (re-seed anytime: npx prisma db seed)
```

### 2. Frontend (Astro)

```bash
# from the repo root
npm install
cp .env.example .env
```

### 3. Start both together

```bash
npm run dev
```

- Web (Astro): http://localhost:4321
- API (Express): http://localhost:3001 (proxied at `/api` and `/uploads` in dev, so the browser stays same-origin)

> Prefer two terminals? `npm run dev:web` and `npm run dev:api`.

**Admin:** open http://localhost:4321/admin and sign in with `admin` / `admin` (change via `server/.env`). Create a post, upload a cover + gallery images, watch the live Markdown preview, **Save draft** (hidden from `/news`) or **Publish** — no redeploy needed.

## Production (single origin)

One Node process serves the API, uploaded files, and the SSR site:

```bash
cd server && npm install && npx prisma migrate deploy && npx prisma db seed
cd ..   && npm install && npm run build      # → dist/client + dist/server
PUBLIC_SITE_URL="https://your-domain" npm start   # node server.mjs
```

`server.mjs` mounts the Astro SSR handler into Express after `/api` and `/uploads`, so everything is same-origin (no CORS, OG images absolute). Build with `PUBLIC_SITE_URL` set to your real domain so canonical/OG URLs are correct.

## Environment variables

**`server/.env`** (see `server/.env.example`):

| var | purpose |
|-----|---------|
| `DATABASE_URL` | SQLite file, e.g. `file:./dev.db` |
| `JWT_SECRET` | signs admin login tokens (required) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | seeded admin credentials |
| `PORT` | API port (default 3001) |
| `UPLOAD_DIR` | optional upload dir override (default `server/uploads`) |

**Root `.env`** (see `.env.example`):

| var | purpose |
|-----|---------|
| `API_INTERNAL_URL` | where SSR fetches data (dev: `http://localhost:3001`; prod: same origin, set automatically) |
| `PUBLIC_SITE_URL` | canonical/OG absolute base (your domain) |
| `PUBLIC_API_URL` | image/API origin; leave **empty** for same-origin |

## How images are served

- **Admin uploads** → multer writes to `server/uploads/`, served at `/uploads/<file>` (relative URL stored in the DB).
- **Bundled article assets** (e.g. the seed post) → `public/blog/<slug>/*.jpg`, served by Astro at `/blog/...`.

The seed post ships **branded placeholder** images at `public/blog/eu-delegation-geneva-sudan-june-2026/E{1,2,3}.jpg` — replace them with the real photos at the same paths.

## API smoke test

```bash
cd server && npm run dev          # in one terminal
cd server && npm run smoke        # in another — exercises create → publish → slug → 404 → delete
```

## Available scripts (root)

- `npm run dev` — Astro + API together
- `npm run build` — production Astro build
- `npm start` — run the single-origin production server (`server.mjs`)
- `npm run check` — `astro check` (type check)

## License

© The International Coalition for Human Rights (ICHR). All rights reserved.
