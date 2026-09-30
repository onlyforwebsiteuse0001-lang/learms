import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="state-panel">
      <span className="state-icon" aria-hidden="true">
        ?
      </span>
      <h2>{t('state.notFound')}</h2>
      <p>{t('state.notFoundBody')}</p>
      <Link className="btn btn-primary" to="/">
        {t('state.goDashboard')}
      </Link>
    </div>
  );
}
