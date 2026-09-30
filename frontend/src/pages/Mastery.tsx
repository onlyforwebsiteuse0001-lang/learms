import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { masteryApi } from '../api/endpoints';
import type { MasteryDetail, MasteryState } from '../api/types';
import { MasteryBar } from '../components/charts/MasteryBar';
import { PageHeader } from '../components/layout/PageHeader';
import { AsyncState } from '../components/ui/AsyncState';
import { SkeletonRows } from '../components/ui/Skeleton';
import { useAsync } from '../hooks/useAsync';
import { useI18n } from '../i18n';
import { useAuthStore } from '../store/auth';

type SortMode = 'weakest' | 'strongest' | 'name';

export function MasteryPage() {
  const { t } = useI18n();
  const studentId = useAuthStore((state) => state.studentId);
  const [sort, setSort] = useState<SortMode>('weakest');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mastery = useAsync<MasteryState[]>(
    (signal) => masteryApi.list(studentId ?? '', signal),
    [studentId],
    { enabled: Boolean(studentId) },
  );

  const detail = useAsync<MasteryDetail>(
    (signal) => masteryApi.concept(studentId ?? '', selectedId ?? '', signal),
    [studentId, selectedId],
    { enabled: Boolean(studentId && selectedId) },
  );

  // Weakest-first by default: an average hides the three concepts at 15% that actually
  // need the next hour of study.
  const sorted = useMemo(() => {
    const list = [...(mastery.data ?? [])];
    if (sort === 'weakest') return list.sort((a, b) => a.p_know - b.p_know);
    if (sort === 'strongest') return list.sort((a, b) => b.p_know - a.p_know);
    return list.sort((a, b) => (a.name ?? a.concept_id).localeCompare(b.name ?? b.concept_id));
  }, [mastery.data, sort]);

  return (
    <>
      <PageHeader eyebrow={t('nav.mastery')} title={t('mastery.title')} description={t('mastery.subtitle')} />

      <div className="row row-wrap" style={{ marginBlockEnd: 'var(--sp-4)' }}>
        <div className="segmented" role="group" aria-label={t('mastery.title')}>
          <button type="button" aria-pressed={sort === 'weakest'} onClick={() => setSort('weakest')}>
            {t('mastery.sortWeakest')}
          </button>
          <button type="button" aria-pressed={sort === 'strongest'} onClick={() => setSort('strongest')}>
            {t('mastery.sortStrongest')}
          </button>
          <button type="button" aria-pressed={sort === 'name'} onClick={() => setSort('name')}>
            {t('mastery.sortName')}
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <AsyncState
            status={mastery.status}
            data={mastery.data}
            error={mastery.error}
            isInitialLoad={mastery.isInitialLoad}
            onRetry={mastery.reload}
            skeleton={<SkeletonRows count={6} />}
            isEmpty={(data) => data.length === 0}
            emptyTitle={t('mastery.empty')}
            emptyAction={
              <Link className="btn btn-primary" to="/diagnostic">
                {t('dash.startDiagnostic')}
              </Link>
            }
          >
            {() => (
              <div className="stack" style={{ gap: 'var(--sp-3)' }}>
                {sorted.map((state) => (
                  <MasteryBar
                    key={state.concept_id}
                    value={state.p_know}
                    label={state.name ?? state.concept_id}
                    selected={selectedId === state.concept_id}
                    onSelect={() => setSelectedId(state.concept_id)}
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

        <section className="card" aria-live="polite">
          {!selectedId ? (
            <p className="muted">{t('concepts.selectHint')}</p>
          ) : (
            <AsyncState
              status={detail.status}
              data={detail.data}
              error={detail.error}
              isInitialLoad={detail.isInitialLoad}
              onRetry={detail.reload}
            >
              {(data) => (
                <div className="stack">
                  <div>
                    <p className="eyebrow">{t('nav.mastery')}</p>
                    <h3>{data.name ?? data.concept_id}</h3>
                  </div>
                  <MasteryBar value={data.p_know} label={t('mastery.title')} />
                  <dl className="kv">
                    <dt>{t('mastery.attempts', { correct: data.correct_attempts, total: data.attempts })}</dt>
                    <dd>
                      {data.attempts
                        ? `${Math.round((data.correct_attempts / data.attempts) * 100)}%`
                        : t('common.na')}
                    </dd>
                    {data.last_updated && (
                      <>
                        <dt>{t('mastery.lastUpdated')}</dt>
                        <dd>{new Date(data.last_updated).toLocaleString()}</dd>
                      </>
                    )}
                  </dl>

                  {/* The model's parameters are shown, not hidden. A student told "you are
                      at 43%" deserves to see what produced that number. */}
                  {(data.p_learn !== undefined || data.p_slip !== undefined || data.p_guess !== undefined) && (
                    <div>
                      <p className="eyebrow">{t('mastery.params')}</p>
                      <dl className="kv" style={{ marginBlockStart: 'var(--sp-2)' }}>
                        {data.p_learn !== undefined && (
                          <>
                            <dt>{t('mastery.pLearn')}</dt>
                            <dd className="mono">{data.p_learn.toFixed(2)}</dd>
                          </>
                        )}
                        {data.p_slip !== undefined && (
                          <>
                            <dt>{t('mastery.pSlip')}</dt>
                            <dd className="mono">{data.p_slip.toFixed(2)}</dd>
                          </>
                        )}
                        {data.p_guess !== undefined && (
                          <>
                            <dt>{t('mastery.pGuess')}</dt>
                            <dd className="mono">{data.p_guess.toFixed(2)}</dd>
                          </>
                        )}
                      </dl>
                    </div>
                  )}
                </div>
              )}
            </AsyncState>
          )}
        </section>
      </div>
    </>
  );
}
