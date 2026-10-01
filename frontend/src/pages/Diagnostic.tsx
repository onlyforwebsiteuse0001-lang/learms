import { useRef, useState } from 'react';
import { diagnosticApi } from '../api/endpoints';
import { toApiError } from '../api/errors';
import type { DiagnosticAnswerResponse, DiagnosticQuestion } from '../api/types';
import { PageHeader } from '../components/layout/PageHeader';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CourseSelector, useCourseKey } from '../components/ui/CourseSelector';
import { useApiErrorMessage } from '../hooks/useApiErrorMessage';
import { useI18n } from '../i18n';
import { useUiStore } from '../store/ui';

interface SessionState {
  sessionId: string;
  total: number;
  index: number;
  question: DiagnosticQuestion | null;
  correctCount: number;
  answeredCount: number;
  complete: boolean;
}

export function DiagnosticPage() {
  const { t } = useI18n();
  const pushToast = useUiStore((state) => state.pushToast);
  const describe = useApiErrorMessage();

  const [courseKey, setCourseKey] = useCourseKey();
  const [maxQuestions, setMaxQuestions] = useState(12);
  const [session, setSession] = useState<SessionState | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<DiagnosticAnswerResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [startError, setStartError] = useState('');
  const feedbackRef = useRef<HTMLDivElement>(null);

  const start = async () => {
    const trimmed = courseKey.trim();
    if (!trimmed) {
      setStartError(t('course.required'));
      return;
    }
    setBusy(true);
    setStartError('');
    setFeedback(null);
    try {
      const result = await diagnosticApi.start(trimmed, maxQuestions);
      setSession({
        sessionId: result.session_id,
        total: result.total_questions,
        index: 0,
        question: result.question,
        correctCount: 0,
        answeredCount: 0,
        complete: false,
      });
      setSelectedIndex(null);
    } catch (caught) {
      const error = toApiError(caught);
      // Agent 1 returns 409 diagnostic_unavailable when fewer than three source-grounded
      // questions exist. That is a content problem with a specific fix, so it gets a
      // specific message instead of a generic failure.
      setStartError(error.code === 'diagnostic_unavailable' ? t('diag.unavailable') : describe(error));
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!session?.question || selectedIndex === null) {
      pushToast('error', t('diag.selectOption'));
      return;
    }
    setBusy(true);
    try {
      const result = await diagnosticApi.answer(session.sessionId, session.question.question_id, selectedIndex);
      setFeedback(result);
      setSession((current) =>
        current
          ? {
              ...current,
              correctCount: current.correctCount + (result.correct ? 1 : 0),
              answeredCount: current.answeredCount + 1,
              complete: result.status === 'complete',
              question: result.question,
            }
          : current,
      );
      // Announce the result where the student is looking, and move focus there so a
      // screen-reader user hears it (4.1.3 Status Messages).
      requestAnimationFrame(() => feedbackRef.current?.focus());
    } catch (caught) {
      pushToast('error', describe(toApiError(caught)));
    } finally {
      setBusy(false);
    }
  };

  const advance = () => {
    setFeedback(null);
    setSelectedIndex(null);
    setSession((current) => (current ? { ...current, index: current.index + 1 } : current));
  };

  const reset = () => {
    setSession(null);
    setFeedback(null);
    setSelectedIndex(null);
  };

  if (!session) {
    return (
      <>
        <PageHeader eyebrow={t('nav.diagnostic')} title={t('diag.title')} description={t('diag.subtitle')} />
        <section className="card" style={{ maxInlineSize: '40rem' }}>
          <div className="stack">
            <CourseSelector value={courseKey} onChange={setCourseKey} />
            <label className="field" style={{ maxInlineSize: '12rem' }}>
              <span>{t('diag.questionCount')}</span>
              <input
                type="number"
                min={3}
                max={30}
                value={maxQuestions}
                onChange={(event) => setMaxQuestions(Number(event.target.value))}
              />
            </label>
            {startError && (
              <p className="field-error" role="alert">
                {startError}
              </p>
            )}
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void start()}
                disabled={busy || !courseKey.trim()}
              >
                {busy ? t('diag.starting') : t('diag.start')}
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (session.complete && feedback === null) {
    return (
      <>
        <PageHeader eyebrow={t('nav.diagnostic')} title={t('diag.complete')} />
        <section className="card" style={{ maxInlineSize: '40rem' }}>
          <div className="stack">
            <h3>{t('diag.results')}</h3>
            <p>{t('diag.answered', { answered: session.answeredCount, total: session.total })}</p>
            <p>
              <b>{t('diag.scoreLine', { correct: session.correctCount, answered: session.answeredCount })}</b>
            </p>
            <ProgressBar
              value={session.answeredCount ? (session.correctCount / session.answeredCount) * 100 : 0}
              label={t('diag.results')}
            />
            <div>
              <button type="button" className="btn btn-primary" onClick={reset}>
                {t('diag.again')}
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const question = session.question;
  const questionNumber = Math.min(session.index + 1, session.total);

  return (
    <>
      <PageHeader eyebrow={t('nav.diagnostic')} title={t('diag.title')} />

      <section className="card" style={{ maxInlineSize: '46rem' }}>
        <div className="stack">
          <ProgressBar
            value={(session.answeredCount / Math.max(session.total, 1)) * 100}
            label={t('diag.progress', { n: questionNumber, total: session.total })}
          />

          {question && (
            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend style={{ fontSize: '1.05rem', fontWeight: 650, marginBlockEnd: 'var(--sp-3)' }} dir="auto">
                {question.prompt}
              </legend>
              <div className="option-list">
                {question.options.map((option, index) => {
                  // Options are only marked correct/incorrect AFTER the server answers.
                  // The payload never contains `correct_index`, so nothing can be leaked early.
                  const revealed = feedback !== null;
                  const isChosen = selectedIndex === index;
                  let className = 'option';
                  if (revealed && isChosen) className += feedback.correct ? ' is-correct' : ' is-wrong';
                  return (
                    <button
                      key={`${question.question_id}-${index}`}
                      type="button"
                      className={className}
                      aria-pressed={isChosen}
                      disabled={revealed || busy}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span className="key" aria-hidden="true">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span dir="auto">{option}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {feedback && (
            <div
              ref={feedbackRef}
              tabIndex={-1}
              role="status"
              className={`state-panel ${feedback.correct ? '' : 'is-error'}`}
              style={{ textAlign: 'start', justifyItems: 'stretch' }}
            >
              <b>{feedback.correct ? t('diag.correct') : t('diag.incorrect')}</b>
              <p>{t('diag.masteryNow', { value: feedback.mastery_percent })}</p>
              {feedback.evidence && (
                <blockquote
                  dir="auto"
                  style={{
                    margin: 0,
                    padding: 'var(--sp-3)',
                    background: 'var(--surface)',
                    borderInlineStart: '3px solid var(--brand-500)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {feedback.evidence}
                </blockquote>
              )}
            </div>
          )}

          <div className="row row-wrap">
            {!feedback ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void submit()}
                disabled={busy || selectedIndex === null}
              >
                {t('diag.submit')}
              </button>
            ) : session.complete ? (
              <button type="button" className="btn btn-primary" onClick={() => setFeedback(null)}>
                {t('diag.finish')}
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={advance}>
                {t('diag.next')}
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={reset}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
