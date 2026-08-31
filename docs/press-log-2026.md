# Newsroom publication log — 2026

The version-controlled record of what is published on <https://www.ichr-international.org>.

Article **text** lives in Neon and is not in git, so this file and the `prisma/seed-*.mjs`
scripts are together the only tracked record of what went live and when. Source material
(originals, designed cards, supplied PDFs) lives in `press/`, which is gitignored and local
to one machine — richer per-item notes are in `press/<MONTH>/README.md`.

Every article exists in three locales, bound by one `translationKey`:

```
/news/<slug>        /ar/news/<slug>        /fr/news/<slug>
```

**Never regenerate a `translationKey`.** It is what binds the locales for the language
toggle, the `hreflang` alternates and the sitemap grouping.

---

## June 2026

| Date | Category | Slug | Seed |
|---|---|---|---|
| 02 Jun | Press Release | `eu-delegation-geneva-sudan-june-2026` | `seed-eu-delegation.mjs` |
| — | Press Release | `un-fact-finding-mission-sudan-geneva-june-2026` | `seed-un-ffm{,-ar,-fr}.mjs` |
| 29 Jun | Press Release | `ffm-head-meets-ichr-representative-geneva-june-2026` | `seed-ffm-head-meeting.mjs` |
| — | Statement | `62nd-session-palais-des-nations-june-2026` | `seed-62nd-translations.mjs` |

## July 2026

| Date | Dateline | Category | Slug | Src |
|---|---|---|---|---|
| 09 Jul | — | Statement | `procedural-bias-selective-handling-sudan-july-2026` | none |
| 16 Jul | — | Statement | `condemnation-cargo-trucks-el-fasher-al-koma-july-2026` | `JUL/press-1` |
| 22 Jul | — | Press Release | `upr-54th-session-procedural-bias-sudan-july-2026` | `JUL/press-3` |
| 23 Jul | **Paris** | Statement | `condemnation-qoz-al-dahish-blue-nile-july-2026` | `JUL/press-2` |
| 28 Jul | Geneva | Statement | `chemical-weapons-accountability-sudan-july-2026` | `JUL/press-4` |
| 31 Jul | **Brussels** | Statement | `condemnation-shirshar-north-kordofan-july-2026` | `JUL/press-5` |

**Datelines are read off the source statement, never assumed.** July alone used Paris, Geneva
and Brussels. The Brussels dateline on the Shirshar statement was queried and is **correct** —
the signed statement says `Brussels, 31 July 2026`.

Source folder numbering is receipt order, not publication order: `press-1` (16 Jul) precedes
`press-3` (22 Jul) precedes `press-2` (23 Jul).

## August 2026

| Date | Dateline | Category | Slug | Key | Src | Commit |
|---|---|---|---|---|---|---|
| 03 Aug | Geneva | Statement | `condemnation-al-zawiya-ghara-north-darfur-august-2026` | `7a57f6f3…` | `AUG/press-6` | `48df8b1` |
| 23 Aug | Geneva | **News** | `womens-condition-violence-wartime-geneva-august-2026` | `526df883…` | `AUG/press-8` | `8864ae1` |
| 25 Aug | Geneva | Press Release | `civil-society-panel-women-sudan-geneva-august-2026` | `0e88f954…` | `AUG/press-9` | `76e007d` |

`womens-condition-…` is the **first article in the `News` category**; its `/news` filter chip
went live with it.

### August changes to earlier articles

| Date | Target | Change | Commit |
|---|---|---|---|
| 23 Aug | `condemnation-shirshar-north-kordofan-july-2026` | PDF attached | `345c071` |
| 23 Aug | `upr-54th-session-procedural-bias-sudan-july-2026` | inline PDF links → download card | `345c071` |
| 23 Aug | `62nd-session-palais-des-nations-june-2026` | PDF attached | `a85c165` |
| 26 Aug | `womens-condition-violence-wartime-geneva-august-2026` | **Factual correction** — the event was held at the Club Suisse de la Presse, not the Palais des Nations; co-organisers were ICHR, EADM, TYFA and Post Versa, not CAP; the panel was 5, not 8. Poster replaced with the real event card. No correction notice, by client decision. | `76e007d` |
| 26 Aug | both August articles | Name normalised to **Abdelrahim Grein** — house spelling chosen by the client over the source RTF's "Abdel-Rahim". | — |
| 27 Aug | `civil-society-panel-women-sudan-geneva-august-2026` | **Retraction** — the UN Fact-Finding Mission "indicators of genocidal intent" paragraph removed from all three locales, per the client's polished source. Designed cards (card-1 … card-5) replace the generated covers and the photo gallery; card-1 is now the hero on all three locales; `statement.en.pdf` (1,286,066 B) attached. | `a8fe027` |

`345c071` also introduced the download card itself (`src/lib/attachments.ts`,
`scripts/gen-attachments.mjs`, `src/generated/blog-attachments.json`). It is now the single
convention for attached documents — no inline markdown PDF links anywhere in the newsroom.

---

## Attached documents

| Article | File | Bytes |
|---|---|---|
| 62nd session | `statement.en.pdf` | 1,930,663 |
| Shirshar | `statement.en.pdf` | 1,223,980 |
| Al-Zawiya Ghara | `statement.en.pdf` | 1,090,633 |
| UPR-54 | `upr-54-joint-submission.pdf` | 5,768,269 |
| Geneva civil-society panel | `statement.en.pdf` | 1,286,066 |

Language comes from the `<name>.<lang>.pdf` filename suffix, so no hand-maintained map can
drift. A document whose language differs from the page shows an "in English" note.

The 62nd-session PDF was rebuilt from 4.12 MB to 1.84 MB with **page 2's text layer spliced
through untouched** (1,472 characters). If it is ever regenerated, verify with `pdftotext`
before shipping. Shirshar and Al-Zawiya Ghara had no text layer and were rebuilt flat. So was the Geneva
panel PDF: 8.63 MB of five flattened pages rebuilt to 1.23 MB.

PDFs are **seed-only and never admin-uploadable.** The upload route has a raster allow-list
with magic-byte sniffing; adding PDF would widen that surface for no gain.

---

## Standing hazards

- **`AUG/press-7` is already published** under a June slug. Running the publish pipeline on it
  creates a duplicate article in three languages. See `press/AUG/press-7/NOTES.md`.
- **Never chain a re-seed behind a gate with `&&`.** On 23 Aug an `&&` chain broke at
  `npm run check`; the push never ran but a re-seed on the same block did, briefly leaving a
  live article's PDF unreachable.
- **The plain seed run is the only thing that writes text. `PUBLISH=1` only flips status
  draft → published, and never writes content.** So every content change needs a plain run —
  new story or correction alike; `PUBLISH=1` is needed additionally, and only when the article
  is not yet public. A `PUBLISH=1` run on a live article reports success and changes nothing.
  Observed 26 August 2026. Verify corrections by grepping the live pages for a string that
  must no longer appear, never by the script's exit code.
- **Never assume a push deployed.** See the 28 July incident in `CLAUDE.md`. Poll the live
  asset URLs for `200` before seeding.

## Open at end of August

1. **Organisation name is inconsistent in ICHR's own material.** Four of six source statements
   say "International Coalition **of** Human Rights **Organizations**"; the rest say
   "International Coalition **for** Human Rights". The site uses the latter throughout. This
   propagates into third-party material — the CAP event poster on the 23 Aug article names
   ICHR two different ways, neither matching the ICHR logo on the same poster. Needs an
   organisation-level decision.
2. **The `containsAiGeneratedContent: Yes` flag** on the press-7 Canva PDF is unconfirmed.
3. **No retrospective** is planned for the 25 August panel. If one is wanted it should be a
   new article, not an edit.
