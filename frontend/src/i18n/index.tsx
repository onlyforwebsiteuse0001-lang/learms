import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { en } from './locales/en';
import type { MessageKey, Messages } from './locales/en';
import { ur } from './locales/ur';
import { urLatn } from './locales/urLatn';

export type Locale = 'en' | 'ur' | 'ur-Latn';
export type Direction = 'ltr' | 'rtl';

export const LOCALES: ReadonlyArray<{ id: Locale; labelKey: MessageKey; dir: Direction; htmlLang: string }> = [
  { id: 'en', labelKey: 'lang.en', dir: 'ltr', htmlLang: 'en' },
  { id: 'ur', labelKey: 'lang.ur', dir: 'rtl', htmlLang: 'ur' },
  { id: 'ur-Latn', labelKey: 'lang.urLatn', dir: 'ltr', htmlLang: 'ur-Latn' },
];

const DICTIONARIES: Record<Locale, Messages> = { en, ur, 'ur-Latn': urLatn };
const STORAGE_KEY = 'haafiz.locale';

export function directionOf(locale: Locale): Direction {
  return locale === 'ur' ? 'rtl' : 'ltr';
}

/** `{name}`-style interpolation. Missing values are left visible rather than silently blanked. */
export function interpolate(template: string, values?: Record<string, string | number>): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in DICTIONARIES) return stored as Locale;
    // Honour the browser's preference on first visit.
    const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
    if (nav.startsWith('ur')) return nav.includes('latn') ? 'ur-Latn' : 'ur';
  } catch {
    /* localStorage can throw in private mode / sandboxed iframes; English is a safe default. */
  }
  return 'en';
}

export type Translate = (key: MessageKey, values?: Record<string, string | number>) => string;

interface I18nValue {
  locale: Locale;
  dir: Direction;
  htmlLang: string;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? readStoredLocale());

  const dir = directionOf(locale);
  const htmlLang = LOCALES.find((entry) => entry.id === locale)?.htmlLang ?? 'en';

  // The single source of truth for direction is the <html> element. Once it is set the
  // browser resolves every CSS logical property, mirrors scrollbars, and gives assistive
  // technology the right reading order — no per-component direction logic needed.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', htmlLang);
    root.setAttribute('dir', dir);
  }, [dir, htmlLang]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Preference is not critical; the UI still switches for this session. */
    }
  }, []);

  const t = useCallback<Translate>(
    (key, values) => {
      const dictionary = DICTIONARIES[locale];
      // Fall back to English for any key a translation has not caught up with, so the UI
      // degrades to a readable string instead of rendering a raw key at the user.
      const template = dictionary[key] ?? en[key] ?? key;
      return interpolate(template, values);
    },
    [locale],
  );

  const value = useMemo<I18nValue>(() => ({ locale, dir, htmlLang, setLocale, t }), [locale, dir, htmlLang, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}

export type { MessageKey, Messages };
