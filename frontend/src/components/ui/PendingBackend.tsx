import { useI18n } from '../../i18n';

/**
 * Shown when a feature's UI exists but its API endpoint has not been deployed.
 *
 * This is the project's "no fake outputs" rule made visible. Rather than filling the
 * screen with plausible-looking invented scores, the panel says exactly which endpoint is
 * missing and where it is tracked, so the state of the system is never misrepresented to
 * the person using it or to the person reviewing it.
 */
export function PendingBackend({ endpoint, note }: { endpoint: string; note?: string }) {
  const { t } = useI18n();

  return (
    <section className="state-panel is-pending" role="status">
      <div className="row">
        <span className="badge badge-info">{t('state.pendingTitle')}</span>
      </div>
      <p>{t('state.pendingBody')}</p>
      {note && <p>{note}</p>}
      <dl className="kv">
        <dt>{t('state.pendingEndpoint')}</dt>
        <dd>
          <code className="mono force-ltr">{endpoint}</code>
        </dd>
        <dt>{t('library.source')}</dt>
        <dd className="small muted">{t('state.pendingTracked')}</dd>
      </dl>
    </section>
  );
}
