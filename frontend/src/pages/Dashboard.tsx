import { Link } from 'react-router-dom';
import { documentsApi, masteryApi, pathApi } from '../api/endpoints';
import type { DocumentRecord, LearningPathResponse, MasteryState, Paginated } from '../api/types';
import { AsyncState } from '../components/ui/AsyncState';
import { SkeletonCards } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MasteryBar } from '../components/charts/MasteryBar';
import { PageHeader } from '../components/layout/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { useI18n } from '../i18n';
import { useAuthStore } from '../store/auth';

export function DashboardPage() {
  const { t } = useI18n();
  const studentId = useAuthStore((state) => state.studentId);

  const documents = useAsync<Paginated<DocumentRecord>>((signal) => documentsApi.list(1, 100, signal), []);
  const mastery = useAsync<MasteryState[]>(
    (signal) => masteryApi.list(studentId ?? '', signal),
    [studentId],
    { enabled: Boolean(studentId) },
  );
  const path = useAsync<LearningPathResponse>((signal) => pathApi.current(signal), []);

  const docs = documents.data?.items ?? [];
  const processing = docs.filter((doc) => doc.status === 'queued' || doc.status === 'processing');
  const states = mastery.data ?? [];
  const weakest = [...states].sort((a, b) => a.p_know - b.p_know).slice(0, 5);
  const average = states.length ? states.reduce((sum, item) => sum + item.p_know, 0) / states.length : null;
  const nextStep = path.data?.steps?.[0] ?? null;

  return (
    <>
      <PageHeader eyebrow={t('nav.dashboard')} title={t('dash.title')} description={t('dash.subtitle')} />

      {/* Primary action first. A learner opening the app needs "what do I do now",
          not a wall of metrics they have to interpret. */}
      <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
        <div className="card-head">
          <div>
            <p className="eyebrow">{t('dash.nextStep')}</p>
            <h3>{nextStep ? nextStep.name : t('dash.noPath')}</h3>
          </div>
          {path.data?.course_key && <span className="badge badge-neutral mono">{path.data.course_key}</span>}
        </div>

        <AsyncState
          status={path.status}
          data={path.data}
          error={path.error}
          isInitialLoad={path.isInitialLoad}
          onRetry={path.reload}
          isEmpty={(data) => !data.steps || data.steps.length === 0}
          emptyTitle={t('dash.noPath')}
          emptyBody={t('dash.noPathBody')}
          emptyAction={
            <div className="row row-wrap" style={{ justifyContent: 'center' }}>
              <Link className="btn btn-primary" to="/upload">
                {t('dash.goUpload')}
              </Link>
              <Link className="btn btn-ghost" to="/path">
                {t('path.generate')}
              </Link>
            </div>
          }
        >
          {() => (
            <div className="stack">
              {nextStep?.reason && <p className="muted">{nextStep.reason}</p>}
              <div className="row row-wrap">
                <Link className="btn btn-primary" to="/path">
                  {t('dash.viewPath')}
                </Link>
                <Link className="btn btn-ghost" to="/diagnostic">
                  {t('dash.startDiagnostic')}
                </Link>
              </div>
            </div>
          )}
        </AsyncState>
      </section>

      {documents.isInitialLoad && documents.status === 'loading' ? (
        <SkeletonCards count={3} />
      ) : (
        <div className="grid grid-3" style={{ marginBlockEnd: 'var(--sp-5)' }}>
          <article className="card card-tight">
            <div className="stat">
              <span className="eyebrow">{t('dash.documents')}</span>
              <b>{docs.length}</b>
              {processing.length > 0 && (
                <span className="badge badge-info" style={{ justifySelf: 'start' }}>
                  {t('dash.processing')} · {processing.length}
                </span>
              )}
            </div>
          </article>
          <article className="card card-tight">
            <div className="stat">
              <span className="eyebrow">{t('dash.tracked')}</span>
              <b>{mastery.status === 'ready' ? states.length : '—'}</b>
              <span className="small muted">{t('dash.concepts')}</span>
            </div>
          </article>
          <article className="card card-tight">
            <div className="stat">
              <span className="eyebrow">{t('dash.averageMastery')}</span>
              {/* Never render 0% while loading: a student reads that as a score. */}
              <b>{average === null ? '—' : `${Math.round(average * 100)}%`}</b>
              <span className="small muted">
                {states.length ? t('mastery.attempts', {
                  correct: states.reduce((sum, item) => sum + item.correct_attempts, 0),
                  total: states.reduce((sum, item) => sum + item.attempts, 0),
                }) : t('mastery.noAttempts')}
              </span>
            </div>
          </article>
        </div>
      )}

      <div className="grid grid-2">
        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">{t('dash.weakAreas')}</p>
              <p className="small muted">{t('dash.weakAreasBody')}</p>
            </div>
          </div>
          <AsyncState
            status={mastery.status}
            data={mastery.data}
            error={mastery.error}
            isInitialLoad={mastery.isInitialLoad}
            onRetry={mastery.reload}
            isEmpty={(data) => data.length === 0}
            emptyTitle={t('dash.noMastery')}
            emptyAction={
              <Link className="btn btn-primary" to="/diagnostic">
                {t('dash.startDiagnostic')}
              </Link>
            }
          >
            {() => (
              <div className="stack" style={{ gap: 'var(--sp-4)' }}>
                {weakest.map((state) => (
                  <MasteryBar
                    key={state.concept_id}
                    value={state.p_know}
                    label={state.name ?? state.concept_id}
                    sublabel={
                      state.attempts
                        ? t('mastery.attempts', { correct: state.correct_attempts, total: state.attempts })
                        : t('mastery.noAttempts')
                    }
                  />
                ))}
              </div>
            )}
          </AsyncState>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">{t('nav.documents')}</p>
              <h3>{t('docs.title')}</h3>
            </div>
            <Link className="btn btn-ghost btn-sm" to="/documents">
              {t('docs.title')}
            </Link>
          </div>
          <AsyncState
            status={documents.status}
            data={documents.data}
            error={documents.error}
            isInitialLoad={documents.isInitialLoad}
            onRetry={documents.reload}
            isEmpty={(data) => data.items.length === 0}
            emptyTitle={t('docs.empty')}
            emptyAction={
              <Link className="btn btn-primary" to="/upload">
                {t('dash.goUpload')}
              </Link>
            }
          >
            {(data) => (
              <div>
                {data.items.slice(0, 5).map((doc) => (
                  <div className="item-row" key={doc.document_id}>
                    <span className="file-chip" aria-hidden="true">
                      {doc.original_name.split('.').pop()?.toUpperCase().slice(0, 4)}
                    </span>
                    <div className="item-main">
                      <b>{doc.original_name}</b>
                      <span className="small muted">{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            )}
          </AsyncState>
        </section>
      </div>
    </>
  );
}
