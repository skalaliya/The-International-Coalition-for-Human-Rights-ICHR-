// i18n core. English lives at the root (`/`); Arabic and French under `/ar` and `/fr`.
import { en, type Dict } from './strings/en';
import { ar } from './strings/ar';
import { fr } from './strings/fr';

export type { Dict };

export const LOCALES = ['en', 'ar', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const RTL_LOCALES: readonly Locale[] = ['ar'];
export const LANG_NAMES: Record<Locale, string> = { en: 'English', ar: 'العربية', fr: 'Français' };

const DICTS: Record<Locale, Dict> = { en, ar, fr };

export function isLocale(x: string | undefined | null): x is Locale {
  return !!x && (LOCALES as readonly string[]).includes(x);
}

/** The translation dictionary for a locale (falls back to English defensively). */
export function useTranslations(lang: Locale): Dict {
  return DICTS[lang] ?? en;
}

export function dir(lang: Locale): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(lang) ? 'rtl' : 'ltr';
}

export function ogLocale(lang: Locale): string {
  return ({ en: 'en_US', ar: 'ar_AR', fr: 'fr_FR' } as const)[lang];
}

/** Normalise `Astro.currentLocale` (which may be undefined) to a known Locale. */
export function getLang(currentLocale: string | undefined): Locale {
  return isLocale(currentLocale) ? currentLocale : DEFAULT_LOCALE;
}

/** Strip a leading `/ar` or `/fr` segment → canonical (English-root) path. */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(ar|fr)(?=\/|$)/);
  if (!m) return pathname || '/';
  const rest = pathname.slice(m[0].length);
  return rest === '' ? '/' : rest;
}

/** Build the path for `lang` from ANY current path (idempotent, handles root). */
export function localizedPath(pathname: string, lang: Locale): string {
  const base = stripLocale(pathname);
  if (lang === DEFAULT_LOCALE) return base;
  return base === '/' ? `/${lang}/` : `/${lang}${base}`;
}

/** Localize an INTERNAL href (e.g. nav `/about`) for the active locale. */
export function localizeHref(href: string, lang: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href; // external / anchor
  return localizedPath(href, lang);
}

export interface Alternate {
  hreflang: string;
  href: string;
}

/**
 * hreflang alternates for a page. By default lists all three locales + x-default.
 * Pass `available` (e.g. an article's existing translations) to restrict it.
 */
export function localeAlternates(
  pathname: string,
  site: string | URL,
  available: readonly Locale[] = LOCALES,
): Alternate[] {
  const base = stripLocale(pathname);
  const abs = (l: Locale) => new URL(localizedPath(base, l), site).href;
  const list: Alternate[] = available.map((l) => ({ hreflang: l, href: abs(l) }));
  const xdefault = available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : available[0];
  if (xdefault) list.push({ hreflang: 'x-default', href: abs(xdefault) });
  return list;
}
