// Isomorphic date helpers. Dates are stored UTC; format in UTC to avoid the
// date-only off-by-one-day in negative-UTC timezones.

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/** "GENEVA · 2 JUNE 2026" (location optional). */
export function dateline(location: string | undefined, iso: string): string {
  const datePart = formatDate(iso).toUpperCase();
  return location ? `${location.toUpperCase()} · ${datePart}` : datePart;
}
