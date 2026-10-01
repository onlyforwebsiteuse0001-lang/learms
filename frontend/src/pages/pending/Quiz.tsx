import { useState } from 'react';
import { PENDING_ENDPOINTS, quizApi } from '../../api/endpoints';
import { toApiError } from '../../api/errors';
import type { PracticeItem, PracticeResult } from '../../api/types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CourseSelector, useCourseKey } from '../../components/ui/CourseSelector';
import { PendingBackend } from '../../components/ui/PendingBackend';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { useI18n } from '../../i18n';

/**
 * Adaptive practice UI. Fully wired to `POST /api/v1/quiz/next` + `/quiz/answer`; renders
 * the pending panel while those routes do not exist. No placeholder questions are shown.
 */
export function QuizPage() {
  const { t } = useI18n();
  const describe = useApiErrorMessage();
  const [courseKey, setCourseKey] = useCourseKey();
  const [item, setItem] = useState<PracticeItem | null>(null);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handle = (caught: unknown) => {
    const apiError = toApiError(caught);
    if (apiError.isNotImplemented) setPending(true);
    else setError(describe(apiError));
  };

  const loadNext = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    setSelected(null);
    try {
      setItem(await quizApi.next(courseKey.trim()));
    } catch (caught) {
      handle(caught);
    } finally {
      setBusy(false);
    }
  };

  const answer = async () => {
    if (!item || selected === null) return;
    setBusy(true);
    try {
      setResult(await quizApi.answer(item.item_id, selected));
    } catch (caught) {
      handle(caught);
    } finally {
      setBusy(false);
    }
  };

  if (pending) {
    return (
      <>
        <PageHeader eyebrow={t('nav.quiz')} title={t('quiz.title')} description={t('quiz.subtitle')} />
        <PendingBackend endpoint={`${PENDING_ENDPOINTS.quiz} · POST /api/v1/quiz/answer`} />
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow={t('nav.quiz')} title={t('quiz.title')} description={t('quiz.subtitle')} />
      <section className="card" style={{ maxInlineSize: '46rem' }}>
        <div className="stack">
          <CourseSelector value={courseKey} onChange={setCourseKey} />

          {!item ? (
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void loadNext()}
                disabled={busy || !courseKey.trim()}
              >
                {busy ? t('state.loading') : t('quiz.start')}
              </button>
            </div>
          ) : (
            <>
              <div className="row row-wrap">
                <span className="badge badge-info">{item.concept_name}</span>
                {item.difficulty !== null && <span className="badge badge-neutral">d{item.difficulty}</span>}
              </div>
              {/* Why the bandit picked this concept — an adaptive system that will not
                  explain its choices is indistinguishable from a random one. */}
              {item.selection_reason && <p className="small muted">{item.selection_reason}</p>}

              <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
                <legend style={{ fontWeight: 650, marginBlockEnd: 'var(--sp-3)' }} dir="auto">
                  {item.prompt}
                </legend>
                <div className="option-list">
                  {item.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`option${result && selected === index ? (result.correct ? ' is-correct' : ' is-wrong') : ''}`}
                      aria-pressed={selected === index}
                      disabled={Boolean(result) || busy}
                      onClick={() => setSelected(index)}
                    >
                      <span className="key" aria-hidden="true">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span dir="auto">{option}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {result && (
                <div className={`state-panel ${result.correct ? '' : 'is-error'}`} role="status">
                  <b>{result.correct ? t('diag.correct') : t('diag.incorrect')}</b>
                  <p>{t('diag.masteryNow', { value: result.mastery_percent })}</p>
                  {result.explanation && <p>{result.explanation}</p>}
                </div>
              )}

              {error && (
                <p className="field-error" role="alert">
                  {error}
                </p>
              )}

              <div className="row row-wrap">
                {!result ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => void answer()}
                    disabled={busy || selected === null}
                  >
                    {t('diag.submit')}
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => void loadNext()} disabled={busy}>
                    {t('diag.next')}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
