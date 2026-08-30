// Duration formatting for the media section.
//
// WHY THIS EXISTS: a video entry stores ONE duration field — `durationSeconds`, an
// integer. Every rendered form is derived here. The alternative — hand-typing both
// "PT14M16S" for Schema.org and "14:16" for the badge — is two fields nobody proofreads
// that can silently disagree, and a malformed ISO-8601 duration makes Google drop the
// video rich result without reporting anything. A number cannot be malformed.
//
// Self-contained on purpose (its own Lang type, its own unit words), exactly like
// dateline.ts: src/lib stays free of an import cycle with the i18n dictionaries, and the
// whole module is pure and unit-testable.

export type DurationLang = 'en' | 'ar' | 'fr';

/** Clamp to a sane non-negative integer. Everything below assumes this has run. */
function normalize(seconds: number): number {
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.floor(seconds);
}

function parts(seconds: number): { h: number; m: number; s: number } {
  const total = normalize(seconds);
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

/**
 * Schema.org `duration` — an ISO-8601 duration: PT14M16S, PT1H2M3S, PT45S.
 * Zero-length components are omitted; zero overall is "PT0S" (valid, not empty).
 */
export function toIso8601(seconds: number): string {
  const { h, m, s } = parts(seconds);
  if (h === 0 && m === 0 && s === 0) return 'PT0S';
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
}

/**
 * The visual badge — "14:16", or "1:02:03" past an hour. Latin digits in every
 * locale, matching how dateline.ts formats Arabic dates (`ar-u-nu-latn`).
 * Always aria-hidden in the UI; toSpoken() carries it to a screen reader.
 */
export function toClock(seconds: number): string {
  const { h, m, s } = parts(seconds);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// Arabic is not pluralised by a simple one/other switch: 1 is singular, 2 is the dual,
// 3–10 takes the plural, and 11+ returns to the singular form. Getting this wrong is the
// kind of thing that sounds obviously foreign to a native listener, so it is spelled out.
type Forms = { one: string; two: string; few: string; many: string };

function arabicForm(n: number, f: Forms): string {
  if (n === 1) return f.one;
  if (n === 2) return f.two;
  if (n >= 3 && n <= 10) return `${n} ${f.few}`;
  return `${n} ${f.many}`;
}

const UNITS: Record<DurationLang, { hour: Forms; minute: Forms; second: Forms; join: string }> = {
  en: {
    hour: { one: '1 hour', two: '2 hours', few: 'hours', many: 'hours' },
    minute: { one: '1 minute', two: '2 minutes', few: 'minutes', many: 'minutes' },
    second: { one: '1 second', two: '2 seconds', few: 'seconds', many: 'seconds' },
    join: ' ',
  },
  fr: {
    hour: { one: '1 heure', two: '2 heures', few: 'heures', many: 'heures' },
    minute: { one: '1 minute', two: '2 minutes', few: 'minutes', many: 'minutes' },
    second: { one: '1 seconde', two: '2 secondes', few: 'secondes', many: 'secondes' },
    join: ' ',
  },
  ar: {
    hour: { one: 'ساعة', two: 'ساعتان', few: 'ساعات', many: 'ساعة' },
    minute: { one: 'دقيقة', two: 'دقيقتان', few: 'دقائق', many: 'دقيقة' },
    second: { one: 'ثانية', two: 'ثانيتان', few: 'ثوانٍ', many: 'ثانية' },
    join: ' و',
  },
};

function unit(n: number, lang: DurationLang, kind: 'hour' | 'minute' | 'second'): string {
  const forms = UNITS[lang][kind];
  if (lang === 'ar') return arabicForm(n, forms);
  if (n === 1) return forms.one;
  return `${n} ${forms.many}`;
}

/**
 * The screen-reader form: "14 minutes 16 seconds" / "14 دقيقة و16 ثانية" /
 * "14 minutes 16 secondes". Without this, "14:16" is announced as "fourteen colon
 * sixteen" — or, worse, as a time of day.
 */
export function toSpoken(seconds: number, lang: DurationLang = 'en'): string {
  const { h, m, s } = parts(seconds);
  // Normalise ONCE, here. Every lookup below is then total: an unknown locale reaching
  // unit() would throw on UNITS[lang][kind], and a duration must never break a page.
  const l: DurationLang = lang in UNITS ? lang : 'en';
  const { join } = UNITS[l];
  const said: string[] = [];
  if (h) said.push(unit(h, l, 'hour'));
  if (m) said.push(unit(m, l, 'minute'));
  // A 0-second remainder is not worth saying unless it is the whole duration.
  if (s || said.length === 0) said.push(unit(s, l, 'second'));
  return said.join(join);
}
