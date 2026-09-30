import { useState } from 'react';
import { PENDING_ENDPOINTS, explainApi } from '../../api/endpoints';
import { toApiError } from '../../api/errors';
import type { ExplainFeedback } from '../../api/types';
import { PageHeader } from '../../components/layout/PageHeader';
import { PendingBackend } from '../../components/ui/PendingBackend';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { useI18n } from '../../i18n';

const MIN_WORDS = 20;

export function ExplainBackPage() {
  const { t } = useI18n();
  const describe = useApiErrorMessage();
  const [conceptId, setConceptId] = useState('');
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<ExplainFeedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const tooShort = wordCount < MIN_WORDS;

  const submit = async () => {
    if (tooShort) return;
    setBusy(true);
    setError('');
    try {
      setFeedback(await explainApi.grade(conceptId.trim(), text.trim()));
    } catch (caught) {
      const apiError = toApiError(caught);
      if (apiError.isNotImplemented) setPending(true);
      else setError(describe(apiError));
    } finally {
      setBusy(false);
    }
  };

  if (pending) {
    return (
      <>
        <PageHeader eyebrow={t('nav.explain')} title={t('explain.title')} description={t('explain.subtitle')} />
        <PendingBackend endpoint={PENDING_ENDPOINTS.explain} />
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow={t('nav.explain')} title={t('explain.title')} description={t('explain.subtitle')} />
      <section className="card" style={{ maxInlineSize: '48rem' }}>
        <div className="stack">
          <label className="field">
            <span>{t('nav.concepts')}</span>
            <input
              value={conceptId}
              onChange={(event) => setConceptId(event.target.value)}
              className="force-ltr"
              placeholder="concept_id"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>{t('explain.title')}</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t('explain.placeholder')}
              dir="auto"
              aria-describedby="explain-count"
              aria-invalid={text.length > 0 && tooShort}
            />
            <span className="field-hint" id="explain-count" aria-live="polite">
              {t('explain.words', { count: wordCount })}
              {text.length > 0 && tooShort ? ` · ${t('explain.tooShort')}` : ''}
            </span>
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
              onClick={() => void submit()}
              disabled={busy || tooShort || !conceptId.trim()}
            >
              {busy ? t('state.loading') : t('explain.submit')}
            </button>
          </div>

          {feedback && (
            <div className="stack" role="status">
              <ProgressBar value={feedback.coverage_percent} label={t('analytics.coverage')} />
              {feedback.covered_points.length > 0 && (
                <div>
                  <p className="eyebrow">{t('library.outcomes')}</p>
                  <ul>
                    {feedback.covered_points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {feedback.missing_points.length > 0 && (
                <div>
                  <p className="eyebrow">{t('analytics.uncovered')}</p>
                  <ul>
                    {feedback.missing_points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {feedback.next_action && <p>{feedback.next_action}</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
