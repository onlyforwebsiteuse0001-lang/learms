import { LOCALES, useI18n } from '../../i18n';

/**
 * Three locales, not two: English, Urdu (RTL script) and Roman Urdu (LTR).
 *
 * Each option carries its own `lang` attribute so a screen reader switches voice for the
 * Urdu label instead of reading Urdu script with an English synthesiser (WCAG 3.1.2).
 * `aria-pressed` on a toggle group beats a `<select>` here: it is one tap on mobile and
 * the current choice is visible without opening anything.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="segmented" role="group" aria-label={t('lang.label')}>
      {LOCALES.map((entry) => (
        <button
          key={entry.id}
          type="button"
          lang={entry.htmlLang}
          aria-pressed={locale === entry.id}
          onClick={() => setLocale(entry.id)}
        >
          {t(entry.labelKey)}
        </button>
      ))}
    </div>
  );
}
