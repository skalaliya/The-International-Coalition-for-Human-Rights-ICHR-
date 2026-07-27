# Verification checklist

Replace `<slug>` throughout. Base URL is `https://www.ichr-international.org`.

## Before publishing — images must be deployed first

`coverImageUrl` is a static path. Publishing before the deploy lands puts a broken image on a
live press statement. All five must be `200 image/jpeg`:

```bash
for f in cover.jpg cover-ar.jpg cover-fr.jpg card-1.jpg card-2.jpg; do curl -sS -o /dev/null -w "%{http_code} %{content_type} $f\n" "https://www.ichr-international.org/blog/<slug>/$f"; done
```

A 404 fetched *before* the deploy landed can stay edge-cached for a minute or two. Re-probe;
don't conclude from a single miss.

## After publishing

DB writes are live instantly — no deploy needed.

```bash
# 1. all three locales return 200
for u in "/news/<slug>" "/ar/news/<slug>" "/fr/news/<slug>"; do curl -sS -o /dev/null -w "%{http_code} $u\n" "https://www.ichr-international.org$u"; done

# 2. head tags: canonical, three hreflang alternates, OG image, escaped JSON-LD
curl -s "https://www.ichr-international.org/news/<slug>" | grep -oE '<link rel="(canonical|alternate)"[^>]*>|<meta property="og:(title|image)"[^>]*>' | head -12

# 3. the story is grouped, not split — expect 3 <loc> entries
curl -s https://www.ichr-international.org/sitemap.xml | grep -c "<slug>"

# 4. it leads the newsroom (most recent date sorts first)
curl -s https://www.ichr-international.org/news | grep -o "<slug>" | head -1
```

## By eye

- `/news` — the card shows the cover in a square tile, correct category pill and date.
- `/news/<slug>` — body, section headings, both bullet lists, the gallery, hashtag pills.
- `/ar/news/<slug>` — right-to-left layout, Arabic cover, Arabic category label.
- `/fr/news/<slug>` — French cover and label.
- The language toggle cycles all three and lands on the right article each time.
- `/admin` — the post appears with the expected status.

## Rollback

```bash
UNPUBLISH=1 node --env-file=.env.local prisma/seed-statement-<name>.mjs
```

Drafts **all** locales of the story at once; the article 404s and leaves `/news` and the
sitemap. Fully reversible — `PUBLISH=1` puts it back.

## Known site-wide limitations (not bugs in your statement)

- `og:image` dimensions are hardcoded 1200×630 in `BaseLayout.astro`, so social previews
  centre-crop a portrait or square cover.
- `/admin` lists at most 50 posts with no pagination.
- The Donate, Contact and Volunteer forms are inert by design.
