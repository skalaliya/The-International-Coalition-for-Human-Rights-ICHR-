// Pure helpers for turning attacker- and crawler-controlled query strings into numbers
// that are safe to hand to Prisma.
//
// This exists because `Math.max(1, Number(url.searchParams.get('page') ?? '1'))` looks
// defensive but isn't: Number('abc') is NaN, Math.max(1, NaN) is NaN, and `skip: NaN`
// makes Prisma throw. The throw was swallowed by src/lib/api.ts, so /news?page=abc
// rendered an EMPTY newsroom with HTTP 200 — indistinguishable from "we published
// nothing" — and logged a Prisma error on every request.

/** Highest page we will ever query. Bounds OFFSET so a crawler can't ask for skip: 1e12. */
export const MAX_PAGE = 10_000;

/**
 * Any query-string value → a usable 1-based page number.
 * NaN, junk, empty, negative, zero and floats all collapse to something sane.
 */
export function parsePageParam(raw: string | null | undefined, max: number = MAX_PAGE): number {
  const n = Number.parseInt(String(raw ?? '').trim(), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(max, Math.floor(n));
}

/** Same clamp applied at the query boundary, where `page` arrives as a number. */
export function clampPageNumber(page: number | undefined, max: number = MAX_PAGE): number {
  if (!Number.isFinite(page as number)) return 1;
  return Math.min(max, Math.max(1, Math.floor(page as number)));
}
