import { useState } from 'react';
import { pathApi } from '../api/endpoints';
import { toApiError } from '../api/errors';
import type { LearningPathResponse, WhyExplanation } from '../api/types';
import { PageHeader } from '../components/layout/PageHeader';
import { AsyncState } from '../components/ui/AsyncState';
import { CourseSelector, useCourseKey } from '../components/ui/CourseSelector';
import { SkeletonRows } from '../components/ui/Skeleton';
import { useApiErrorMessage } from '../hooks/useApiErrorMessage';
import { useAsync } from '../hooks/useAsync';
import { useI18n } from '../i18n';
import { useUiStore } from '../store/ui';

export function LearningPathPage() {
  const { t } = useI18n();
  const pushToast = useUiStore((state) => state.pushToast);
  const describe = useApiErrorMessage();
  const [courseKey, setCourseKey] = useCourseKey();
  const [generating, setGenerating] = useState(false);
  const [whyFor, setWhyFor] = useState<string | null>(null);

  const path = useAsync<LearningPathResponse>((signal) => pathApi.current(signal), []);

  const generate = async () => {
    const trimmed = courseKey.trim();
    if (!trimmed) {
      pushToast('error', t('course.required'));
      return;
    }
    setGenerating(true);
    try {
      await pathApi.generate(trimmed);
      pushToast('success', t('path.generated'));
      path.reload();
    } catch (caught) {
      pushToast('error', describe(toApiError(caught)));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow={t('nav.path')} title={t('path.title')} description={t('path.subtitle')} />

      <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
        <CourseSelector value={courseKey} onChange={setCourseKey} />
        <div className="row row-wrap" style={{ marginBlockStart: 'var(--sp-3)' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void generate()}
            disabled={generating || !courseKey.trim()}
          >
            {generating ? t('path.generating') : path.data?.steps?.length ? t('path.regenerate') : t('path.generate')}
          </button>
        </div>
      </section>

      <AsyncState
        status={path.status}
        data={path.data}
        error={path.error}
        isInitialLoad={path.isInitialLoad}
        onRetry={path.reload}
        skeleton={<SkeletonRows count={5} />}
        isEmpty={(data) => !data.steps || data.steps.length === 0}
        emptyTitle={t('path.empty')}
      >
        {(data) => (
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }} className="stack">
            {data.steps.map((step, index) => (
              <li className="card card-tight" key={step.concept_id}>
                <div className="row row-wrap" style={{ alignItems: 'flex-start' }}>
                  <span className="badge badge-neutral" style={{ marginBlockStart: 4 }}>
                    {t('path.step', { n: step.position || index + 1 })}
                  </span>
                  <div style={{ flex: 1, minInlineSize: '12rem' }}>
                    <b>{step.name}</b>
                    {step.reason && <p className="small muted">{step.reason}</p>}
                  </div>
                  {typeof step.mastery === 'number' && (
                    <span className="badge badge-info">{Math.round(step.mastery * 100)}%</span>
                  )}
                  {/* Agent 1 persists an explanation per step precisely so this control
                      can exist. An unexplained recommendation is not actionable. */}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-expanded={whyFor === step.concept_id}
                    onClick={() => setWhyFor(whyFor === step.concept_id ? null : step.concept_id)}
                  >
                    {t('path.why')}
                  </button>
                </div>
                {whyFor === step.concept_id && <WhyPanel conceptId={step.concept_id} />}
              </li>
            ))}
          </ol>
        )}
      </AsyncState>
    </>
  );
}

function WhyPanel({ conceptId }: { conceptId: string }) {
  const { t } = useI18n();
  const why = useAsync<WhyExplanation>((signal) => pathApi.why(conceptId, signal), [conceptId]);

  return (
    <div
      className="stack"
      style={{
        marginBlockStart: 'var(--sp-3)',
        paddingBlockStart: 'var(--sp-3)',
        borderBlockStart: '1px solid var(--line-200)',
      }}
      aria-live="polite"
    >
      <p className="eyebrow">{t('path.whyTitle')}</p>
      <AsyncState
        status={why.status}
        data={why.data}
        error={why.error}
        isInitialLoad={why.isInitialLoad}
        onRetry={why.reload}
      >
        {(data) => (
          <dl className="kv">
            <dt>{t('path.reason')}</dt>
            <dd>{data.reason ?? t('common.na')}</dd>
            <dt>{t('concepts.evidence')}</dt>
            <dd dir="auto">{data.evidence ?? t('concepts.noEvidence')}</dd>
          </dl>
        )}
      </AsyncState>
    </div>
  );
}
