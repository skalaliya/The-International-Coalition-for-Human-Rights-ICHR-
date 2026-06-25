// Isomorphic date helpers. Dates are stored UTC; format in UTC to avoid the
// date-only off-by-one-day in negative-UTC timezones.

export type DateLang = 'en' | 'ar' | 'fr';

// Arabic uses `ar-u-nu-latn` so dates carry Latin digits — consistent with
// amounts/pagination elsewhere and easier to scan in an international context.
const LOCALE_TAGS: Record<DateLang, string> = {
  en: 'en-GB',
  ar: 'ar-u-nu-latn',
  fr: 'fr-FR',
};

export function formatDate(iso: string, lang: DateLang = 'en'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE_TAGS[lang] ?? 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/** "GENEVA · 2 JUNE 2026" (location optional). Arabic keeps natural case. */
export function dateline(location: string | undefined, iso: string, lang: DateLang = 'en'): string {
  const date = formatDate(iso, lang);
  const upper = lang !== 'ar';
  const datePart = upper ? date.toUpperCase() : date;
  if (!location) return datePart;
  const loc = upper ? location.toUpperCase() : location;
  return `${loc} · ${datePart}`;
}
