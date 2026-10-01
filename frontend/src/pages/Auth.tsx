import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toApiError } from '../api/errors';
import { useApiErrorMessage } from '../hooks/useApiErrorMessage';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { useAuthStore } from '../store/auth';

type Mode = 'login' | 'register';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function AuthPage({ mode }: { mode: Mode }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const describe = useApiErrorMessage();

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const expired = useAuthStore((state) => state.expired);
  const clearExpired = useAuthStore((state) => state.clearExpired);

  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const nextPath = new URLSearchParams(location.search).get('next') ?? '/';

  useEffect(() => {
    if (isAuthenticated) navigate(nextPath, { replace: true });
  }, [isAuthenticated, navigate, nextPath]);

  /**
   * Mirrors the server's Pydantic rules (name 2..120, EmailStr, password 8..128) so the
   * student gets an instant, field-level answer instead of a round trip. The server stays
   * authoritative: anything it rejects is still shown.
   */
  const validate = (values: { name: string; email: string; password: string }): FieldErrors => {
    const errors: FieldErrors = {};
    if (mode === 'register' && values.name.trim().length < 2) errors.name = t('auth.nameRequired');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = t('auth.emailRequired');
    if (values.password.length < 8) errors.password = t('auth.passwordRequired');
    return errors;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearExpired();
    setFormError('');

    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? '').trim(),
      password: String(data.get('password') ?? ''),
    };

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      // 3.3.1 Error Identification — move focus to the first problem so keyboard and
      // screen-reader users are not left guessing which field failed.
      const firstKey = Object.keys(errors)[0];
      document.querySelector<HTMLInputElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setBusy(true);
    try {
      if (mode === 'login') await login({ email: values.email, password: values.password });
      else await register(values);
      navigate(nextPath, { replace: true });
    } catch (caught) {
      const error = toApiError(caught);
      setFormError(describe(error));
      // Map FastAPI's 422 `details.fields` onto the actual inputs.
      if (error.isValidation) {
        const mapped: FieldErrors = {};
        for (const field of error.fieldErrors) {
          if (field === 'name' || field === 'email' || field === 'password') {
            mapped[field] = describe(error);
          }
        }
        setFieldErrors(mapped);
      }
    } finally {
      setBusy(false);
    }
  };

  const isRegister = mode === 'register';

  return (
    <main className="auth">
      <section className="auth-story">
        <div className="brand" style={{ color: '#fff' }}>
          <span className="brand-mark" style={{ background: 'rgba(255,255,255,0.18)' }} aria-hidden="true">
            ح
          </span>
          <span className="brand-text">
            <span>{t('app.name')}</span>
            <small style={{ color: 'rgba(255,255,255,0.7)' }}>{t('app.tagline')}</small>
          </span>
        </div>
        <div className="stack">
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {t('auth.kicker')}
          </p>
          <h1>{t('auth.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.88)', maxInlineSize: '46ch' }}>{t('auth.body')}</p>
          <ul>
            <li>{t('auth.point1')}</li>
            <li>{t('auth.point2')}</li>
            <li>{t('auth.point3')}</li>
          </ul>
        </div>
        <p className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>
          © {new Date().getFullYear()} HAAFIZ EDU
        </p>
      </section>

      <section className="auth-panel">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher />
        </div>

        <form onSubmit={submit} noValidate>
          <div>
            <p className="eyebrow">{t('app.name')}</p>
            <h2>{isRegister ? t('auth.register') : t('auth.signIn')}</h2>
          </div>

          {expired && (
            <p className="field-error" role="status">
              {t('auth.sessionExpired')}
            </p>
          )}

          {isRegister && (
            <label className="field">
              <span>{t('auth.name')}</span>
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'err-name' : undefined}
              />
              {fieldErrors.name && (
                <span className="field-error" id="err-name">
                  {fieldErrors.name}
                </span>
              )}
            </label>
          )}

          <label className="field">
            <span>{t('auth.email')}</span>
            <input
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              className="force-ltr"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'err-email' : undefined}
            />
            {fieldErrors.email && (
              <span className="field-error" id="err-email">
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label className="field">
            <span>{t('auth.password')}</span>
            <input
              name="password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              minLength={8}
              className="force-ltr"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'err-password' : 'hint-password'}
            />
            {fieldErrors.password ? (
              <span className="field-error" id="err-password">
                {fieldErrors.password}
              </span>
            ) : (
              <span className="field-hint" id="hint-password">
                {t('auth.passwordHint')}
              </span>
            )}
          </label>

          {formError && (
            <p className="field-error" role="alert">
              {formError}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? t('auth.working') : isRegister ? t('auth.submitRegister') : t('auth.submitLogin')}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => navigate(isRegister ? '/login' : '/register')}
          >
            {isRegister ? t('auth.switchToLogin') : t('auth.switchToRegister')}
          </button>
        </form>
      </section>
    </main>
  );
}
