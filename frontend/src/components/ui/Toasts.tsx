import { useI18n } from '../../i18n';
import { useUiStore } from '../../store/ui';

/**
 * WCAG 2.1 §4.1.3 Status Messages: toasts are announced by assistive technology without
 * stealing focus. The live region is always mounted (announcements are only made for
 * content inserted into an *existing* live region), and errors use `role="alert"` for
 * assertive delivery while successes stay polite.
 */
export function Toasts() {
  const toasts = useUiStore((state) => state.toasts);
  const dismiss = useUiStore((state) => state.dismissToast);
  const { t } = useI18n();

  return (
    <div className="toast-region" role="region" aria-label={t('common.notifications')}>
      <div aria-live="polite" aria-atomic="false" className="stack" style={{ gap: 'var(--sp-2)' }}>
        {toasts
          .filter((toast) => toast.tone !== 'error')
          .map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.tone}`}>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button type="button" onClick={() => dismiss(toast.id)} aria-label={t('common.dismiss')}>
                ✕
              </button>
            </div>
          ))}
      </div>
      <div aria-live="assertive" aria-atomic="false" className="stack" style={{ gap: 'var(--sp-2)' }}>
        {toasts
          .filter((toast) => toast.tone === 'error')
          .map((toast) => (
            <div key={toast.id} className="toast toast-error" role="alert">
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button type="button" onClick={() => dismiss(toast.id)} aria-label={t('common.dismiss')}>
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
