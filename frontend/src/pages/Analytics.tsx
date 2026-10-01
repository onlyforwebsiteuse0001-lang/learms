import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PENDING_ENDPOINTS, analyticsApi, masteryApi } from '../api/endpoints';
import type { MasteryHistoryPoint, MasteryState } from '../api/types';
import { DistributionChart, DonutChart, TrendChart } from '../components/charts/Charts';
import { MASTERY_LABEL, masteryLevel } from '../components/charts/MasteryBar';
import { PageHeader } from '../components/layout/PageHeader';
import { AsyncState } from '../components/ui/AsyncState';
import { SkeletonCards } from '../components/ui/Skeleton';
import { useAsync } from '../hooks/useAsync';
import { useI18n } from '../i18n';
import { useAuthStore } from '../store/auth';

/**
 * Two halves with different provenance, and the page says which is which:
 *  - Distribution and coverage are computed here from the REAL `/mastery/{id}` response.
 *  - The time series needs `/analytics/mastery-history`, which does not exist yet, so it
 *    renders the pending panel rather than a fabricated trend line.
 */
export function AnalyticsPage() {
  const { t } = useI18n();
  const studentId = useAuthStore((state) => state.studentId);

  const mastery = useAsync<MasteryState[]>(
    (signal) => masteryApi.list(studentId ?? '', signal),
    [studentId],
    { enabled: Boolean(studentId) },
  );
  const history = useAsync<MasteryHistoryPoint[]>((signal) => analyticsApi.masteryHistory(signal), []);

  const buckets = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const state of mastery.data ?? []) counts[masteryLevel(state.p_know)] += 1;
    return counts.map((count, level) => ({
      label: t(MASTERY_LABEL[level]),
      count,
      color: `var(--mastery-${level})`,
    }));
  }, [mastery.data, t]);

  const measured = (mastery.data ?? []).filter((state) => state.attempts > 0).length;
  const total = (mastery.data ?? []).length;

  return (
    <>
      <PageHeader eyebrow={t('nav.analytics')} title={t('analytics.title')} description={t('analytics.subtitle')} />

      <div className="grid grid-2" style={{ marginBlockEnd: 'var(--sp-5)' }}>
        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">{t('analytics.distribution')}</p>
              <p className="small muted">{t('analytics.distributionBody')}</p>
            </div>
          </div>
          <AsyncState
            status={mastery.status}
            data={mastery.data}
            error={mastery.error}
            isInitialLoad={mastery.isInitialLoad}
            onRetry={mastery.reload}
            skeleton={<SkeletonCards count={1} />}
            isEmpty={(data) => data.length === 0}
            emptyTitle={t('mastery.empty')}
            emptyAction={
              <Link className="btn btn-primary" to="/diagnostic">
                {t('dash.startDiagnostic')}
              </Link>
            }
          >
            {() => <DistributionChart buckets={buckets} ariaLabel={t('analytics.distribution')} />}
          </AsyncState>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">{t('analytics.coverage')}</p>
              <p className="small muted">{t('analytics.covered')}</p>
            </div>
          </div>
          <AsyncState
            status={mastery.status}
            data={mastery.data}
            error={mastery.error}
            isInitialLoad={mastery.isInitialLoad}
            onRetry={mastery.reload}
            skeleton={<SkeletonCards count={1} />}
            isEmpty={(data) => data.length === 0}
            emptyTitle={t('mastery.empty')}
          >
            {() => (
              <div className="stack">
                <DonutChart
                  value={measured}
                  total={total}
                  label={t('analytics.covered')}
                  ariaLabel={`${measured} ${t('common.of')} ${total} ${t('analytics.covered')}`}
                />
                <p className="small muted">
                  {total - measured} · {t('analytics.uncovered')}
                </p>
              </div>
            )}
          </AsyncState>
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <div>
            <p className="eyebrow">{t('analytics.history')}</p>
          </div>
        </div>
        <AsyncState
          status={history.status}
          data={history.data}
          error={history.error}
          isInitialLoad={history.isInitialLoad}
          onRetry={history.reload}
          pendingEndpoint={PENDING_ENDPOINTS.analyticsHistory}
          isEmpty={(data) => data.length < 2}
          emptyTitle={t('mastery.empty')}
        >
          {(data) => (
            <TrendChart
              points={data.map((point) => ({
                label: new Date(point.date).toLocaleDateString(),
                value: point.average_mastery,
              }))}
              ariaLabel={t('analytics.history')}
            />
          )}
        </AsyncState>
      </section>
    </>
  );
}
