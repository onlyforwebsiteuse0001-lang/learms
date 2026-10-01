import { useRef, useState } from 'react';
import { PENDING_ENDPOINTS, tutorApi } from '../../api/endpoints';
import { toApiError } from '../../api/errors';
import type { TutorTurn } from '../../api/types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CourseSelector, useCourseKey } from '../../components/ui/CourseSelector';
import { PendingBackend } from '../../components/ui/PendingBackend';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { useI18n } from '../../i18n';

/**
 * The tutor UI is complete and calls the real proposed endpoint. Because
 * `POST /api/v1/tutor/message` is not deployed, the first send returns
 * `not_implemented` and the page swaps to a labelled pending panel.
 *
 * It does NOT invent a Socratic reply. A fabricated hint is worse than no hint: a student
 * cannot tell it apart from a real one, and a reviewer cannot tell the feature is unbuilt.
 */
export function TutorPage() {
  const { t } = useI18n();
  const describe = useApiErrorMessage();
  const [courseKey, setCourseKey] = useCourseKey();
  const [turns, setTurns] = useState<TutorTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const sessionRef = useRef<string | null>(null);

  const send = async () => {
    const message = draft.trim();
    if (!message || busy) return;

    setTurns((current) => [...current, { role: 'student', content: message }]);
    setDraft('');
    setBusy(true);
    setError('');

    try {
      const result = await tutorApi.send(courseKey.trim(), message, null, sessionRef.current);
      sessionRef.current = result.session_id;
      setTurns(result.turns);
    } catch (caught) {
      const apiError = toApiError(caught);
      if (apiError.isNotImplemented) setPending(true);
      else setError(describe(apiError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow={t('nav.tutor')} title={t('tutor.title')} description={t('tutor.subtitle')} />

      {pending ? (
        <PendingBackend endpoint={PENDING_ENDPOINTS.tutor} />
      ) : (
        <section className="card" style={{ maxInlineSize: '48rem' }}>
          <div className="stack">
            <CourseSelector value={courseKey} onChange={setCourseKey} />

            <div className="chat-log" aria-live="polite" aria-label={t('tutor.title')}>
              {turns.length === 0 && <p className="muted">{t('tutor.placeholder')}</p>}
              {turns.map((turn, index) => (
                <div key={index} className={`bubble${turn.role === 'student' ? ' from-me' : ''}`} dir="auto">
                  <p className="eyebrow">{turn.role === 'student' ? t('auth.name') : t('nav.tutor')}</p>
                  <p>{turn.content}</p>
                  {turn.hint_level !== undefined && (
                    <span className="badge badge-neutral">hint {turn.hint_level}</span>
                  )}
                </div>
              ))}
              {busy && (
                <p className="muted small" role="status">
                  {t('tutor.thinking')}
                </p>
              )}
            </div>

            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}

            <form
              className="row"
              onSubmit={(event) => {
                event.preventDefault();
                void send();
              }}
            >
              <label className="field" style={{ flex: 1 }}>
                <span className="visually-hidden">{t('tutor.placeholder')}</span>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={t('tutor.placeholder')}
                  dir="auto"
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={busy || !draft.trim()}>
                {t('tutor.send')}
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
