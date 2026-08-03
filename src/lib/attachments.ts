// The downloadable document attached to an article, if there is one.
//
// The manifest (src/generated/blog-attachments.json, written by
// scripts/gen-attachments.mjs) is passed IN rather than imported here, for two reasons:
// it keeps these functions pure and unit-testable under the bare node test runner,
// which does not resolve the `@/` alias, and it keeps the lookup honest — the caller
// decides which manifest it is reading.
//
// Nothing here touches the database. An attachment is a file in git, derived from the
// slug, exactly like the artwork.

export interface AttachmentMeta {
  bytes: number;
  /** The document's own language, from a `<name>.<lang>.pdf` suffix. Absent = unspecified. */
  lang?: string;
}
export type AttachmentManifest = Record<string, AttachmentMeta>;

export interface Attachment extends AttachmentMeta {
  /** Site-absolute path, e.g. /blog/<slug>/statement.en.pdf */
  url: string;
}

/** The attachment for an article slug, or undefined. Lowest sorted url when several. */
export function attachmentFor(manifest: AttachmentManifest, slug: string | null | undefined): Attachment | undefined {
  if (!slug) return undefined;
  const prefix = `/blog/${slug}/`;
  const url = Object.keys(manifest)
    .filter((u) => u.startsWith(prefix))
    .sort()[0];
  return url ? { url, ...manifest[url] } : undefined;
}

/**
 * A human file size, stated on the page BEFORE the click — a reader on a metered or
 * slow connection deserves to know what a download will cost them, which for this
 * newsroom's audience is not hypothetical.
 *
 * Returns the number only; the caller supplies the localized unit (MB / Mo / ميغابايت).
 */
export function megabytes(bytes: number, locale = 'en'): string {
  const mb = bytes / 1024 / 1024;
  const n = mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10;
  // Arabic keeps Latin digits, matching how dates already render on the cover cards.
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : locale, {
    maximumFractionDigits: 1,
  }).format(n);
}

/** Show the document's language only when it differs from the page the reader is on. */
export function showsLanguageNote(docLang: string | undefined, pageLang: string): boolean {
  return Boolean(docLang) && docLang !== pageLang;
}
