import { useEffect, useMemo, useState } from 'react';
import { conceptsApi, masteryApi } from '../api/endpoints';
import type { Concept, MasteryState, PrerequisiteEdge } from '../api/types';
import { ConceptGraph } from '../components/graph/ConceptGraph';
import type { GraphEdge } from '../components/graph/ConceptGraph';
import { PageHeader } from '../components/layout/PageHeader';
import { AsyncState } from '../components/ui/AsyncState';
import { CourseSelector, useCourseKey } from '../components/ui/CourseSelector';
import { SkeletonRows } from '../components/ui/Skeleton';
import { useAsync } from '../hooks/useAsync';
import { useI18n } from '../i18n';
import { useAuthStore } from '../store/auth';

type View = 'list' | 'graph';

export function ConceptsPage() {
  const { t } = useI18n();
  const studentId = useAuthStore((state) => state.studentId);
  const [courseKey, setCourseKey] = useCourseKey();
  const [activeCourse, setActiveCourse] = useState(courseKey);
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const concepts = useAsync<Concept[]>(
    (signal) => conceptsApi.list(activeCourse, signal),
    [activeCourse],
    { enabled: Boolean(activeCourse) },
  );
  const mastery = useAsync<MasteryState[]>(
    (signal) => masteryApi.list(studentId ?? '', signal),
    [studentId],
    { enabled: Boolean(studentId) },
  );

  const masteryById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const state of mastery.data ?? []) map[state.concept_id] = state.p_know;
    return map;
  }, [mastery.data]);

  /**
   * Prerequisites are exposed per-concept (`GET /concepts/{id}/prerequisites`), so the
   * whole graph needs one request per node. They are fetched in parallel and a single
   * failed edge fetch degrades that node's edges only — the graph still renders.
   */
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [edgesLoading, setEdgesLoading] = useState(false);

  useEffect(() => {
    const list = concepts.data;
    if (!list || list.length === 0) {
      setEdges([]);
      return;
    }
    let active = true;
    setEdgesLoading(true);

    void Promise.allSettled(
      list.map((concept) =>
        conceptsApi
          .prerequisites(concept.concept_id)
          .then((rows: PrerequisiteEdge[]) =>
            rows.map<GraphEdge>((row) => ({ from: row.concept_id, to: concept.concept_id })),
          ),
      ),
    ).then((results) => {
      if (!active) return;
      const collected: GraphEdge[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') collected.push(...result.value);
      }
      setEdges(collected);
      setEdgesLoading(false);
    });

    return () => {
      active = false;
    };
  }, [concepts.data]);

  const selected = (concepts.data ?? []).find((concept) => concept.concept_id === selectedId) ?? null;
  const selectedPrereqs = useAsync<PrerequisiteEdge[]>(
    (signal) => conceptsApi.prerequisites(selectedId ?? '', signal),
    [selectedId],
    { enabled: Boolean(selectedId) },
  );

  return (
    <>
      <PageHeader eyebrow={t('nav.concepts')} title={t('concepts.title')} description={t('concepts.subtitle')} />

      <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
        <CourseSelector
          value={courseKey}
          onChange={setCourseKey}
          onSubmit={(value) => {
            setActiveCourse(value);
            setSelectedId(null);
          }}
        />
      </section>

      {!activeCourse ? (
        <div className="state-panel">
          <span className="state-icon" aria-hidden="true">
            ◈
          </span>
          <h3>{t('course.required')}</h3>
          <p>{t('course.hint')}</p>
        </div>
      ) : (
        <>
          <div className="row" style={{ marginBlockEnd: 'var(--sp-4)' }}>
            <div className="segmented" role="group" aria-label={t('concepts.title')}>
              <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
                {t('concepts.list')}
              </button>
              <button type="button" aria-pressed={view === 'graph'} onClick={() => setView('graph')}>
                {t('concepts.graph')}
              </button>
            </div>
            {edgesLoading && (
              <span className="small muted" role="status">
                {t('state.loading')}
              </span>
            )}
          </div>

          <div className="grid grid-2">
            <section className="card" style={{ minInlineSize: 0 }}>
              <AsyncState
                status={concepts.status}
                data={concepts.data}
                error={concepts.error}
                isInitialLoad={concepts.isInitialLoad}
                onRetry={concepts.reload}
                skeleton={<SkeletonRows count={5} />}
                isEmpty={(data) => data.length === 0}
                emptyTitle={t('concepts.empty')}
              >
                {(data) =>
                  view === 'graph' ? (
                    <ConceptGraph
                      concepts={data}
                      edges={edges}
                      selectedId={selectedId}
                      masteryById={masteryById}
                      onSelect={setSelectedId}
                      ariaLabel={t('concepts.graphLabel')}
                    />
                  ) : (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {data.map((concept) => (
                        <li key={concept.concept_id}>
                          <button
                            type="button"
                            className="item-row"
                            style={{ inlineSize: '100%', textAlign: 'start', font: 'inherit', cursor: 'pointer' }}
                            aria-pressed={selectedId === concept.concept_id}
                            onClick={() => setSelectedId(concept.concept_id)}
                          >
                            <div className="item-main">
                              <b>{concept.name}</b>
                              {concept.description && <span className="small muted">{concept.description}</span>}
                            </div>
                            {concept.confidence !== null && concept.confidence !== undefined && (
                              <span className="badge badge-neutral">
                                {Math.round(concept.confidence * 100)}%
                              </span>
                            )}
                            {masteryById[concept.concept_id] !== undefined && (
                              <span className="badge badge-info">
                                {Math.round(masteryById[concept.concept_id] * 100)}%
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
                }
              </AsyncState>
            </section>

            <section className="card" style={{ minInlineSize: 0 }} aria-live="polite">
              {!selected ? (
                <p className="muted">{t('concepts.selectHint')}</p>
              ) : (
                <div className="stack">
                  <div>
                    <p className="eyebrow">{t('nav.concepts')}</p>
                    <h3>{selected.name}</h3>
                  </div>
                  {selected.description && <p className="muted">{selected.description}</p>}

                  <dl className="kv">
                    {selected.extraction_method && (
                      <>
                        <dt>{t('concepts.method')}</dt>
                        <dd className="mono">{selected.extraction_method}</dd>
                      </>
                    )}
                    {selected.phase && (
                      <>
                        <dt>{t('concepts.phase')}</dt>
                        <dd>{selected.phase}</dd>
                      </>
                    )}
                    {selected.confidence !== null && selected.confidence !== undefined && (
                      <>
                        <dt>{t('docs.confidence', { value: Math.round(selected.confidence * 100) })}</dt>
                        <dd>{Math.round(selected.confidence * 100)}%</dd>
                      </>
                    )}
                  </dl>

                  {/* Evidence is the whole point of the design: an extracted concept is a
                      claim, and the student can check the sentence it came from. */}
                  <div>
                    <p className="eyebrow">{t('concepts.evidence')}</p>
                    {selected.evidence ? (
                      <blockquote
                        dir="auto"
                        style={{
                          margin: 0,
                          marginBlockStart: 'var(--sp-2)',
                          padding: 'var(--sp-3)',
                          background: 'var(--surface-alt)',
                          borderInlineStart: '3px solid var(--brand-500)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {selected.evidence}
                      </blockquote>
                    ) : (
                      <p className="small muted">{t('concepts.noEvidence')}</p>
                    )}
                  </div>

                  <div>
                    <p className="eyebrow">{t('concepts.prerequisites')}</p>
                    <AsyncState
                      status={selectedPrereqs.status}
                      data={selectedPrereqs.data}
                      error={selectedPrereqs.error}
                      isInitialLoad={selectedPrereqs.isInitialLoad}
                      onRetry={selectedPrereqs.reload}
                      isEmpty={(data) => data.length === 0}
                      emptyTitle={t('concepts.noPrerequisites')}
                    >
                      {(rows) => (
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                          {rows.map((row) => (
                            <li className="item-row" key={row.concept_id}>
                              <div className="item-main">
                                <b>{row.name}</b>
                                {row.evidence && (
                                  <span className="small muted" dir="auto">
                                    {row.evidence}
                                  </span>
                                )}
                              </div>
                              <span className={`badge ${row.approved ? 'badge-ok' : 'badge-warn'}`}>
                                {row.approved ? t('concepts.approved') : t('concepts.unapproved')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </AsyncState>
                  </div>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
