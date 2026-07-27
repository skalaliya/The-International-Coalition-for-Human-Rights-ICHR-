# Cover-card rendering invariants

The cards are SVG rasterized through `sharp` (librsvg + Pango). **Every failure mode below
exits 0 with wrong pixels.** `scripts/lib/press-card.mjs` already handles all of them —
this file exists so nobody "cleans up" `buildSvg()` and silently regresses one.

## The four hard-won rules

1. **`logo.png` has an opaque navy backdrop (`#1D5277`), not transparency.** That is why there
   is a white chip behind the masthead mark and a circular clip on the watermark. Drop either
   and you get a navy square floating on a navy gradient.

2. **RTL text uses `direction="rtl"` *with* `text-anchor="start"`, anchored at the right margin
   (`x = W - M`).** `text-anchor="end"` fights `direction` and pushes lines off-canvas. This is
   the single most common Arabic mistake here.

3. **No `letter-spacing` on Arabic.** Spacing between clusters breaks the glyph joins — the text
   still renders, it just stops being correctly written Arabic.

4. **Any string mixing digits with Arabic needs its own `direction="rtl"`.** In an LTR paragraph
   the year binds to the month: `23 يوليو 2026` renders as `يوليو 2026 23`. Dates are the usual
   victim.

## Fonts

`Geeza Pro` is the macOS system naskh with a true bold; the site's webfont (Noto Sans Arabic)
is not installed locally. On Linux/CI, fontconfig substitutes silently and you get wrong glyphs
or tofu at a perfectly normal width. **Generate covers on macOS only.**

## Geometry

Canvas is 1200×1600 with an 88px margin, so the usable text column is **1024px**.

| landmark | y |
|---|---|
| masthead chip | 92–210 |
| rule under masthead | 288 |
| eyebrow | 372 |
| headline block | `headTop + i * headLh` |
| gold rule | 800 |
| standfirst | 884 |
| city chip + date | 1042–1116 |
| footer rule / url | 1430 / 1500 |

Headlines are **hand-broken arrays — nothing wraps.** `assertFits()` renders each line alone,
trims to its ink box and compares against the 1024px column, and checks that the last baseline
plus a descender clears the gold rule. It refuses to write an overflowing card.

Measured examples (this machine, the card's own font stacks):

| line | size | ink |
|---|---|---|
| `On Procedural Bias and the` | 62px Helvetica | 807px |
| `Statement of Condemnation: Reported Attack on Displaced` | 58px Helvetica | 1111px → rejected |
| `استهداف شاحنات نقل البضائع` | 56px Geeza Pro | 705px |

Two traps if you ever touch `measureInk`: the probe must be black-on-white and trimmed with
`threshold: 1`, and an RTL probe must be anchored at the **right** edge — anchored left it flows
off-canvas and measures ~17px instead of ~700px.

## The gate is not enough

`assertFits` sees geometry only. It cannot see:

- broken Arabic joins,
- tofu from a missing font,
- a date rendered in the wrong order,
- a headline that fits but reads badly (orphaned last word).

**Always open the JPEG and look at it** before committing. That instruction is in CLAUDE.md for
the same reason.
