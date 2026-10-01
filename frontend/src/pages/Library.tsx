import { useMemo, useState } from 'react';
import { loadCourse, loadIndex, loadTaxonomy } from '../content/loader';
import type { ContentCourse, LibraryIndex, Taxonomy } from '../content/types';
import { PageHeader } from '../components/layout/PageHeader';
import { AsyncState } from '../components/ui/AsyncState';
import { SkeletonRows } from '../components/ui/Skeleton';
import { useAsync } from '../hooks/useAsync';
import { useI18n } from '../i18n';

const BLOOM_TONE: Record<string, string> = {
  remember: 'badge-neutral',
  understand: 'badge-info',
  apply: 'badge-ok',
  analyze: 'badge-warn',
  evaluate: 'badge-warn',
  create: 'badge-err',
};

export function LibraryPage() {
  const { t, locale } = useI18n();
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [coursePath, setCoursePath] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const taxonomy = useAsync<Taxonomy>((signal) => loadTaxonomy(signal), []);
  const index = useAsync<LibraryIndex>((signal) => loadIndex(signal), []);

  const localName = (name: string, nameUr?: string) => (locale === 'ur' && nameUr ? nameUr : name);

  const courses = index.data?.courses ?? [];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (fieldId && course.field !== fieldId) return false;
      if (!needle) return true;
      return (
        course.title.toLowerCase().includes(needle) ||
        course.course_id.toLowerCase().includes(needle) ||
        course.category.toLowerCase().includes(needle)
      );
    });
  }, [courses, fieldId, query]);

  /**
   * RULE 5 — say out loud how much of the taxonomy is actually filled in. The 68
   * categories are a real plan, but only some of them have a curated course today, and a
   * student should be able to see that without clicking through every field.
   */
  const coverage = useMemo(() => {
    const fields = taxonomy.data?.fields ?? [];
    const withCourses = new Set(courses.map((course) => course.category));
    const all = fields.flatMap((field) => field.categories);
    return { done: all.filter((category) => withCourses.has(category.id)).length, total: all.length };
  }, [taxonomy.data, courses]);

  /** Categories of the selected field that have nothing in them yet. */
  const plannedCategories = useMemo(() => {
    if (!fieldId) return [];
    const field = taxonomy.data?.fields.find((candidate) => candidate.id === fieldId);
    if (!field) return [];
    const withCourses = new Set(courses.filter((course) => course.field === fieldId).map((c) => c.category));
    return field.categories.filter((category) => !withCourses.has(category.id));
  }, [taxonomy.data, courses, fieldId]);

  if (coursePath) {
    return <CourseDetail path={coursePath} onBack={() => setCoursePath(null)} />;
  }

  return (
    <>
      <PageHeader
        eyebrow={t('nav.library')}
        title={t('library.title')}
        description={t('library.subtitle')}
        actions={
          index.data ? (
            <span className="badge badge-neutral">
              {t('library.courses', { count: index.data.course_count })} ·{' '}
              {t('library.conceptCount', { count: index.data.concept_count })}
            </span>
          ) : null
        }
      />

      <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
        <label className="field">
          <span>{t('library.searchLabel')}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('library.searchPlaceholder')}
            dir="auto"
          />
        </label>
        {coverage.total > 0 && (
          <p className="small muted" style={{ marginBlockEnd: 0 }}>
            {t('library.coverage', { done: coverage.done, total: coverage.total })}
          </p>
        )}
      </section>

      <div className="grid grid-2">
        <section className="card" style={{ minInlineSize: 0 }}>
          <p className="eyebrow">{t('library.fields')}</p>
          <AsyncState
            status={taxonomy.status}
            data={taxonomy.data}
            error={taxonomy.error}
            isInitialLoad={taxonomy.isInitialLoad}
            onRetry={taxonomy.reload}
            skeleton={<SkeletonRows count={5} />}
            isEmpty={(data) => data.fields.length === 0}
          >
            {(data) => (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBlockStart: 'var(--sp-3)' }}>
                <li>
                  <button
                    type="button"
                    className="item-row"
                    style={{ inlineSize: '100%', font: 'inherit', cursor: 'pointer', textAlign: 'start' }}
                    aria-pressed={fieldId === null}
                    onClick={() => setFieldId(null)}
                  >
                    <div className="item-main">
                      <b>{t('library.fields')}</b>
                    </div>
                    <span className="badge badge-neutral">{courses.length}</span>
                  </button>
                </li>
                {data.fields.map((field) => {
                  const count = courses.filter((course) => course.field === field.id).length;
                  return (
                    <li key={field.id}>
                      <button
                        type="button"
                        className="item-row"
                        style={{ inlineSize: '100%', font: 'inherit', cursor: 'pointer', textAlign: 'start' }}
                        aria-pressed={fieldId === field.id}
                        onClick={() => setFieldId(field.id)}
                      >
                        <div className="item-main">
                          <b>{localName(field.name, field.name_ur)}</b>
                          <span className="small muted">{field.description}</span>
                        </div>
                        <span className={`badge ${count ? 'badge-info' : 'badge-neutral'}`}>{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </AsyncState>
        </section>

        <section className="card" style={{ minInlineSize: 0 }}>
          <p className="eyebrow">{t('nav.library')}</p>
          <AsyncState
            status={index.status}
            data={index.data}
            error={index.error}
            isInitialLoad={index.isInitialLoad}
            onRetry={index.reload}
            skeleton={<SkeletonRows count={5} />}
            isEmpty={() => filtered.length === 0}
            emptyTitle={t('library.noResults')}
          >
            {() => (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBlockStart: 'var(--sp-3)' }}>
                {filtered.map((course) => (
                  <li key={course.course_id}>
                    <button
                      type="button"
                      className="item-row"
                      style={{ inlineSize: '100%', font: 'inherit', cursor: 'pointer', textAlign: 'start' }}
                      onClick={() => setCoursePath(course.path)}
                    >
                      <div className="item-main">
                        <b>{localName(course.title, course.title_ur)}</b>
                        <span className="small muted">
                          {t('library.conceptCount', { count: course.concept_count })} ·{' '}
                          {t('library.hours', { count: course.estimated_hours })} · {course.level}
                        </span>
                      </div>
                      {/* Provenance is visible at a glance: curated vs AI-generated. */}
                      <span
                        className={`badge ${course.authoring_method === 'curated' ? 'badge-ok' : 'badge-warn'}`}
                      >
                        {course.authoring_method}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </AsyncState>

          {plannedCategories.length > 0 && (
            <>
              <p className="eyebrow" style={{ marginBlockStart: 'var(--sp-5)' }}>
                {t('library.plannedCategories')}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBlockStart: 'var(--sp-3)' }}>
                {plannedCategories.map((category) => (
                  <li key={category.id} className="item-row">
                    <div className="item-main">
                      <span className="muted">{localName(category.name, category.name_ur)}</span>
                    </div>
                    <span className="badge badge-neutral">{t('library.comingSoon')}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function CourseDetail({ path, onBack }: { path: string; onBack: () => void }) {
  const { t, locale } = useI18n();
  const course = useAsync<ContentCourse>((signal) => loadCourse(path, signal), [path]);
  const localName = (name: string, nameUr?: string) => (locale === 'ur' && nameUr ? nameUr : name);

  return (
    <>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBlockEnd: 'var(--sp-4)' }}>
        <span className="icon-directional" aria-hidden="true">
          ←
        </span>{' '}
        {t('library.back')}
      </button>

      <AsyncState
        status={course.status}
        data={course.data}
        error={course.error}
        isInitialLoad={course.isInitialLoad}
        onRetry={course.reload}
        skeleton={<SkeletonRows count={6} />}
      >
        {(data) => (
          <>
            <PageHeader
              eyebrow={`${data.field} · ${data.category}`}
              title={localName(data.title, data.title_ur)}
              description={data.description}
            />

            <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
              <dl className="kv">
                <dt>{t('library.level')}</dt>
                <dd>{data.level}</dd>
                <dt>{t('library.hours', { count: data.estimated_hours })}</dt>
                <dd>{t('library.conceptCount', { count: data.concepts.length })}</dd>
                {data.credit_hours && (
                  <>
                    <dt>Credit hours</dt>
                    <dd className="mono">
                      {data.credit_hours.total} ({data.credit_hours.theory}-{data.credit_hours.lab})
                    </dd>
                  </>
                )}
                <dt>{t('library.accreditation')}</dt>
                <dd>{data.accreditation}</dd>
                <dt>{t('library.source')}</dt>
                <dd>
                  {data.source.url ? (
                    <a href={data.source.url} target="_blank" rel="noreferrer noopener">
                      {data.source.name}
                    </a>
                  ) : (
                    data.source.name
                  )}{' '}
                  <span className="small muted">({data.source.retrieved})</span>
                </dd>
                <dt>Authoring</dt>
                <dd>
                  <span className={`badge ${data.authoring.method === 'curated' ? 'badge-ok' : 'badge-warn'}`}>
                    {data.authoring.method}
                  </span>{' '}
                  <span className="small muted">
                    {data.authoring.by} · {data.authoring.date}
                    {data.authoring.model ? ` · ${data.authoring.model}` : ''}
                  </span>
                </dd>
              </dl>
            </section>

            {data.outcomes.length > 0 && (
              <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
                <p className="eyebrow">{t('library.outcomes')}</p>
                <ul style={{ marginBlockStart: 'var(--sp-3)' }}>
                  {data.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="stack">
              {data.concepts.map((concept, index) => (
                <article className="card card-tight" key={concept.id}>
                  <div className="row row-wrap" style={{ alignItems: 'flex-start' }}>
                    <span className="badge badge-neutral" style={{ marginBlockStart: 2 }}>
                      {index + 1}
                    </span>
                    <div style={{ flex: 1, minInlineSize: '14rem' }}>
                      <b>{localName(concept.name, concept.name_ur)}</b>
                      <p className="small muted">{concept.summary}</p>
                    </div>
                    <span className={`badge ${BLOOM_TONE[concept.bloom] ?? 'badge-neutral'}`}>{concept.bloom}</span>
                    <span className="badge badge-neutral">d{concept.difficulty}</span>
                    <span className="badge badge-neutral">{concept.estimated_minutes}m</span>
                  </div>
                  {concept.prerequisites.length > 0 && (
                    <p className="small muted" style={{ marginBlockStart: 'var(--sp-2)' }}>
                      {t('library.prereqs')}:{' '}
                      <span className="mono force-ltr">
                        {concept.prerequisites.map((p) => `${p.id} (${p.strength})`).join(', ')}
                      </span>
                    </p>
                  )}
                </article>
              ))}
            </section>
          </>
        )}
      </AsyncState>
    </>
  );
}
