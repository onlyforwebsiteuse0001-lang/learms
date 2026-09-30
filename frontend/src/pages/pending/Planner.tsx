import { useState } from 'react';
import { PENDING_ENDPOINTS, plannerApi } from '../../api/endpoints';
import { toApiError } from '../../api/errors';
import type { PlannerSchedule } from '../../api/types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CourseSelector, useCourseKey } from '../../components/ui/CourseSelector';
import { PendingBackend } from '../../components/ui/PendingBackend';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { useI18n } from '../../i18n';

/** Shared by the planner and the catch-up plan — identical UI, different endpoint. */
export function PlannerPage({ variant }: { variant: 'schedule' | 'catchup' }) {
  const { t } = useI18n();
  const describe = useApiErrorMessage();
  const [courseKey, setCourseKey] = useCourseKey();
  const [deadline, setDeadline] = useState('');
  const [hours, setHours] = useState(8);
  const [schedule, setSchedule] = useState<PlannerSchedule | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const isCatchup = variant === 'catchup';

  const build = async () => {
    setBusy(true);
    setError('');
    try {
      const call = isCatchup ? plannerApi.catchup : plannerApi.build;
      setSchedule(await call(courseKey.trim(), deadline, hours));
    } catch (caught) {
      const apiError = toApiError(caught);
      if (apiError.isNotImplemented) setPending(true);
      else setError(describe(apiError));
    } finally {
      setBusy(false);
    }
  };

  const title = isCatchup ? t('catchup.title') : t('planner.title');
  const description = isCatchup ? t('catchup.subtitle') : t('planner.subtitle');

  if (pending) {
    return (
      <>
        <PageHeader eyebrow={isCatchup ? t('nav.catchup') : t('nav.planner')} title={title} description={description} />
        <PendingBackend endpoint={isCatchup ? PENDING_ENDPOINTS.catchup : PENDING_ENDPOINTS.planner} />
      </>
    );
  }

  const byDate = new Map<string, PlannerSchedule['blocks']>();
  for (const block of schedule?.blocks ?? []) {
    if (!byDate.has(block.date)) byDate.set(block.date, []);
    byDate.get(block.date)!.push(block);
  }

  return (
    <>
      <PageHeader eyebrow={isCatchup ? t('nav.catchup') : t('nav.planner')} title={title} description={description} />

      <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
        <div className="stack">
          <CourseSelector value={courseKey} onChange={setCourseKey} />
          <div className="row row-wrap" style={{ alignItems: 'flex-end' }}>
            <label className="field" style={{ maxInlineSize: '14rem' }}>
              <span>{t('planner.deadline')}</span>
              <input
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                className="force-ltr"
              />
            </label>
            <label className="field" style={{ maxInlineSize: '12rem' }}>
              <span>{t('planner.hoursPerWeek')}</span>
              <input
                type="number"
                min={1}
                max={60}
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
              />
            </label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void build()}
              disabled={busy || !courseKey.trim() || !deadline}
            >
              {isCatchup ? t('catchup.build') : t('planner.build')}
            </button>
          </div>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>

      {schedule && (
        <section className="stack">
          {schedule.at_risk.length > 0 && (
            <div className="state-panel is-error" role="alert">
              <b>{t('analytics.uncovered')}</b>
              <p>{schedule.at_risk.join(', ')}</p>
            </div>
          )}
          {[...byDate.entries()].map(([date, blocks]) => (
            <article className="card card-tight" key={date}>
              <p className="eyebrow">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {blocks.map((block, index) => (
                  <li className="item-row" key={`${block.concept_id}-${index}`}>
                    <span className="badge badge-neutral">{block.activity}</span>
                    <div className="item-main">
                      <b>{block.concept_name}</b>
                    </div>
                    <span className="mono small">{block.minutes} min</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
