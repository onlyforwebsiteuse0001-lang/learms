import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider, LOCALES, directionOf, interpolate, useI18n } from './index';
import { en } from './locales/en';
import { ur } from './locales/ur';
import { urLatn } from './locales/urLatn';

describe('interpolate', () => {
  it('substitutes named placeholders', () => {
    expect(interpolate('Hello {name}', { name: 'Ayesha' })).toBe('Hello Ayesha');
  });

  it('substitutes numbers', () => {
    expect(interpolate('{count} concepts', { count: 12 })).toBe('12 concepts');
  });

  it('leaves an unmatched placeholder visible rather than blanking it', () => {
    // A blank is indistinguishable from real empty content; a visible {name} is a bug report.
    expect(interpolate('Hello {name}', {})).toBe('Hello {name}');
  });

  it('returns the template untouched when no values are given', () => {
    expect(interpolate('Hello {name}')).toBe('Hello {name}');
  });

  it('replaces every occurrence', () => {
    expect(interpolate('{a}-{a}-{b}', { a: 1, b: 2 })).toBe('1-1-2');
  });
});

describe('directionOf', () => {
  it('marks only Urdu script as RTL', () => {
    expect(directionOf('ur')).toBe('rtl');
    expect(directionOf('ur-Latn')).toBe('ltr');
    expect(directionOf('en')).toBe('ltr');
  });
});

describe('locale dictionaries', () => {
  it('offers exactly the three advertised locales', () => {
    expect(LOCALES.map((entry) => entry.id)).toEqual(['en', 'ur', 'ur-Latn']);
  });

  it('translates every English key in Urdu and Roman Urdu', () => {
    const missingUr = Object.keys(en).filter((key) => !(key in ur));
    const missingLatn = Object.keys(en).filter((key) => !(key in urLatn));
    expect({ missingUr, missingLatn }).toEqual({ missingUr: [], missingLatn: [] });
  });

  it('has no translation keys that English does not define', () => {
    const extra = [...Object.keys(ur), ...Object.keys(urLatn)].filter((key) => !(key in en));
    expect(extra).toEqual([]);
  });

  it('keeps the same placeholders in every translation', () => {
    const placeholders = (value: string) => (value.match(/\{(\w+)\}/g) ?? []).sort().join(',');
    const mismatched = Object.keys(en).filter(
      (key) =>
        placeholders(en[key as keyof typeof en]) !== placeholders(ur[key as keyof typeof ur]) ||
        placeholders(en[key as keyof typeof en]) !== placeholders(urLatn[key as keyof typeof urLatn]),
    );
    expect(mismatched).toEqual([]);
  });
});

function Probe() {
  const { t, locale, dir, htmlLang, setLocale } = useI18n();
  return (
    <div>
      <p data-testid="title">{t('nav.dashboard')}</p>
      <p data-testid="meta">{`${locale}|${dir}|${htmlLang}`}</p>
      <button type="button" onClick={() => setLocale('ur')}>
        to urdu
      </button>
    </div>
  );
}

describe('I18nProvider', () => {
  it('renders the requested locale', () => {
    render(
      <I18nProvider initialLocale="ur-Latn">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByTestId('title')).toHaveTextContent(urLatn['nav.dashboard']);
    expect(screen.getByTestId('meta')).toHaveTextContent('ur-Latn|ltr|ur-Latn');
  });

  it('sets lang and dir on <html>, which is what makes RTL work at all', async () => {
    render(
      <I18nProvider initialLocale="en">
        <Probe />
      </I18nProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');

    await userEvent.click(screen.getByRole('button', { name: 'to urdu' }));
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBe('ur');
  });

  it('persists the choice so a reload keeps the student\u2019s language', async () => {
    render(
      <I18nProvider initialLocale="en">
        <Probe />
      </I18nProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'to urdu' }));
    expect(localStorage.getItem('haafiz.locale')).toBe('ur');
  });

  it('falls back to English for a key a translation is missing', () => {
    function Missing() {
      const { t } = useI18n();
      // Cast: deliberately asking for a key no dictionary defines.
      return <span>{t('totally.unknown.key' as never)}</span>;
    }
    render(
      <I18nProvider initialLocale="ur">
        <Missing />
      </I18nProvider>,
    );
    // No dictionary has it, so the key itself is shown — visible, not silently blank.
    expect(screen.getByText('totally.unknown.key')).toBeInTheDocument();
  });

  it('throws a clear error when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/useI18n must be used inside/);
    spy.mockRestore();
  });
});
