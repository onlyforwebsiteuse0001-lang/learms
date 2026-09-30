import { useEffect, useMemo, useRef, useState } from 'react';
import { PENDING_ENDPOINTS, examApi } from '../../api/endpoints';
import { toApiError } from '../../api/errors';
import type { MockExamReport, MockExamSession } from '../../api/types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CourseSelector, useCourseKey } from '../../components/ui/CourseSelector';
import { PendingBackend } from '../../components/ui/PendingBackend';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { useI18n } from '../../i18n';

function formatClock(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function MockExamPage() {
  const { t } = useI18n();
  const describe = useApiErrorMessage();
  const [courseKey, setCourseKey] = useCourseKey();
  const [duration, setDuration] = useState(60);
  const [exam, setExam] = useState<MockExamSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [report, setReport] = useState<MockExamReport | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const submitRef = useRef<() => void>(() => {});

  const start = async () => {
    setBusy(true);
    setError('');
    try {
      const session = await examApi.start(courseKey.trim(), duration);
      setExam(session);
      setAnswers({});
      setReport(null);
      setRemaining(session.duration_minutes * 60);
    } catch (caught) {
      const apiError = toApiError(caught);
      if (apiError.isNotImplemented) setPending(true);
      else setError(describe(apiError));
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!exam) return;
    setBusy(true);
    try {
      setReport(
        await examApi.submit(
          exam.exam_id,
          Object.entries(answers).map(([question_id, selected_index]) => ({ question_id, selected_index })),
        ),
      );
      setExam(null);
    } catch (caught) {
      const apiError = toApiError(caught);
      if (apiError.isNotImplemented) setPending(true);
      else setError(describe(apiError));
    } finally {
      setBusy(false);
    }
  };
  submitRef.current = () => void submit();

  // Exam conditions mean the clock is real: at zero the paper submits itself with
  // whatever has been answered, exactly as an invigilated exam would.
  useEffect(() => {
    if (!exam) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          clearInterval(timer);
          submitRef.current();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  if (pending) {
    return (
      <>
        <PageHeader eyebrow={t('nav.exam')} title={t('exam.title')} description={t('exam.subtitle')} />
        <PendingBackend endpoint={`${PENDING_ENDPOINTS.exam} · POST /api/v1/exam/{exam_id}/submit`} />
      </>
    );
  }

  if (report) {
    return (
      <>
        <PageHeader eyebrow={t('nav.exam')} title={t('diag.results')} />
        <section className="card" style={{ maxInlineSize: '44rem' }}>
          <div className="stack">
            <div className="stat">
              <b>
                {report.score}
                <span className="muted" style={{ fontSize: '1rem' }}>
                  /{report.total_marks}
                </span>
              </b>
            </div>
            <ProgressBar value={(report.score / Math.max(report.total_marks, 1)) * 100} label={t('diag.results')} />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {report.per_concept.map((row) => (
                <li className="item-row" key={row.concept_id}>
                  <div className="item-main">
                    <b>{row.concept_name}</b>
                  </div>
                  <span className="mono">
                    {row.score}/{row.total}
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <button type="button" className="btn btn-primary" onClick={() => setReport(null)}>
                {t('diag.again')}
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!exam) {
    return (
      <>
        <PageHeader eyebrow={t('nav.exam')} title={t('exam.title')} description={t('exam.subtitle')} />
        <section className="card" style={{ maxInlineSize: '40rem' }}>
          <div className="stack">
            <CourseSelector value={courseKey} onChange={setCourseKey} />
            <label className="field" style={{ maxInlineSize: '14rem' }}>
              <span>{t('exam.duration')}</span>
              <input
                type="number"
                min={10}
                max={240}
                step={5}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
              />
              <span className="field-hint">{t('exam.minutes', { count: duration })}</span>
            </label>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void start()}
                disabled={busy || !courseKey.trim()}
              >
                {t('exam.start')}
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow={t('nav.exam')} title={t('exam.title')} />
      <div
        className="card card-tight row"
        style={{ position: 'sticky', insetBlockStart: 'var(--header-h)', zIndex: 10, marginBlockEnd: 'var(--sp-4)' }}
      >
        {/* aria-live is intentionally OFF on the clock: announcing every second would make
            the page unusable with a screen reader. */}
        <b className="mono" style={{ fontSize: '1.3rem' }} aria-live="off">
          {formatClock(remaining)}
        </b>
        <div className="spacer" />
        <span className="badge badge-neutral">
          {answeredCount} {t('common.of')} {exam.questions.length}
        </span>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => void submit()} disabled={busy}>
          {t('diag.submit')}
        </button>
      </div>

      <ol className="stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {exam.questions.map((question, qIndex) => (
          <li className="card card-tight" key={question.question_id}>
            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend style={{ fontWeight: 650, marginBlockEnd: 'var(--sp-3)' }} dir="auto">
                {qIndex + 1}. {question.prompt}{' '}
                <span className="badge badge-neutral">{question.marks}</span>
              </legend>
              <div className="option-list">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    className="option"
                    aria-pressed={answers[question.question_id] === index}
                    onClick={() => setAnswers((current) => ({ ...current, [question.question_id]: index }))}
                  >
                    <span className="key" aria-hidden="true">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span dir="auto">{option}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
    </>
  );
}
