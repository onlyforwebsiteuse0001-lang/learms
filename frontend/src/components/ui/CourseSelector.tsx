import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../i18n';

const STORAGE_KEY = 'haafiz.course_key';

export function readStoredCourse(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/**
 * Agent 1 scopes concepts, diagnostics and paths by a free-text `course_key` that the
 * student chose at upload time. There is no `GET /courses` endpoint to enumerate them, so
 * this is a text input with recall rather than a dropdown of invented options — offering
 * a list we cannot actually source would be a fake.
 *
 * Previously-used keys are remembered locally and offered via a datalist.
 */
export function useCourseKey(): [string, (value: string) => void] {
  const [courseKey, setCourseKey] = useState<string>(() => readStoredCourse());

  useEffect(() => {
    try {
      if (courseKey) localStorage.setItem(STORAGE_KEY, courseKey);
    } catch {
      /* non-critical */
    }
  }, [courseKey]);

  return [courseKey, setCourseKey];
}

const RECENT_KEY = 'haafiz.recent_courses';

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

export function rememberCourse(courseKey: string): void {
  if (!courseKey.trim()) return;
  try {
    const next = [courseKey, ...readRecent().filter((entry) => entry !== courseKey)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* non-critical */
  }
}

export function CourseSelector({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const recent = useMemo(() => readRecent(), []);
  const listId = 'course-key-options';

  return (
    <form
      className="row row-wrap"
      style={{ alignItems: 'flex-end', gap: 'var(--sp-3)' }}
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        rememberCourse(trimmed);
        onSubmit?.(trimmed);
      }}
    >
      <label className="field" style={{ flex: 1, minInlineSize: '14rem' }}>
        <span>{t('course.label')}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t('course.placeholder')}
          list={recent.length ? listId : undefined}
          className="force-ltr"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          aria-describedby="course-key-hint"
        />
        {recent.length > 0 && (
          <datalist id={listId}>
            {recent.map((entry) => (
              <option key={entry} value={entry} />
            ))}
          </datalist>
        )}
        <span className="field-hint" id="course-key-hint">
          {t('course.hint')}
        </span>
      </label>
      {onSubmit && (
        <button type="submit" className="btn btn-primary" disabled={disabled || !value.trim()}>
          {t('course.apply')}
        </button>
      )}
    </form>
  );
}
