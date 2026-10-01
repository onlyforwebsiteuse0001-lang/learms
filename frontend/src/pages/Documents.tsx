import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { documentsApi } from '../api/endpoints';
import { toApiError } from '../api/errors';
import type { DocumentDetail, DocumentRecord, Paginated } from '../api/types';
import { formatBytes } from '../api/upload';
import { PageHeader } from '../components/layout/PageHeader';
import { AsyncState } from '../components/ui/AsyncState';
import { SkeletonRows } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useApiErrorMessage } from '../hooks/useApiErrorMessage';
import { useAsync } from '../hooks/useAsync';
import { useI18n } from '../i18n';
import { useUiStore } from '../store/ui';

export function DocumentsPage() {
  const { t } = useI18n();
  const pushToast = useUiStore((state) => state.pushToast);
  const describe = useApiErrorMessage();

  const documents = useAsync<Paginated<DocumentRecord>>((signal) => documentsApi.list(1, 100, signal), []);
  const [openId, setOpenId] = useState<string | null>(null);

  const items = documents.data?.items ?? [];
  const hasActive = items.some((doc) => doc.status === 'queued' || doc.status === 'processing');

  // Poll only while something is genuinely in flight, and stop the moment it settles.
  useEffect(() => {
    if (!hasActive) return;
    const timer = setInterval(() => documents.reload(), 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActive]);

  const remove = async (doc: DocumentRecord) => {
    if (!window.confirm(t('docs.deleteConfirm', { name: doc.original_name }))) return;
    try {
      await documentsApi.remove(doc.document_id);
      pushToast('success', t('docs.deleted'));
      if (openId === doc.document_id) setOpenId(null);
      documents.reload();
    } catch (caught) {
      pushToast('error', describe(toApiError(caught)));
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={t('nav.documents')}
        title={t('docs.title')}
        description={t('docs.subtitle')}
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={documents.reload}>
              {t('docs.refresh')}
            </button>
            <Link className="btn btn-primary" to="/upload">
              {t('nav.upload')}
            </Link>
          </>
        }
      />

      <AsyncState
        status={documents.status}
        data={documents.data}
        error={documents.error}
        isInitialLoad={documents.isInitialLoad}
        onRetry={documents.reload}
        skeleton={<SkeletonRows count={5} />}
        isEmpty={(data) => data.items.length === 0}
        emptyTitle={t('docs.empty')}
        emptyAction={
          <Link className="btn btn-primary" to="/upload">
            {t('dash.goUpload')}
          </Link>
        }
      >
        {(data) => (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {data.items.map((doc) => (
              <li key={doc.document_id}>
                <div className="item-row">
                  <span className="file-chip" aria-hidden="true">
                    {doc.original_name.split('.').pop()?.toUpperCase().slice(0, 4)}
                  </span>
                  <div className="item-main">
                    <b>{doc.original_name}</b>
                    <span className="small muted">
                      {formatBytes(doc.size_bytes)} · {doc.language_detected?.toUpperCase() || t('common.unknown')}
                      {doc.page_count ? ` · ${t('docs.pages', { count: doc.page_count })}` : ''}
                    </span>
                    {/* The real failure reason from the backend, shown verbatim rather
                        than replaced with a generic "something went wrong". */}
                    {doc.error_message && (
                      <span className="field-error small" role="alert">
                        {doc.error_message}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={doc.status} />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={doc.status !== 'success'}
                    aria-expanded={openId === doc.document_id}
                    onClick={() => setOpenId(openId === doc.document_id ? null : doc.document_id)}
                  >
                    {t('docs.viewText')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => void remove(doc)}
                    aria-label={`${t('docs.delete')}: ${doc.original_name}`}
                  >
                    {t('docs.delete')}
                  </button>
                </div>
                {openId === doc.document_id && <ExtractedText documentId={doc.document_id} />}
              </li>
            ))}
          </ul>
        )}
      </AsyncState>
    </>
  );
}

function ExtractedText({ documentId }: { documentId: string }) {
  const { t } = useI18n();
  const detail = useAsync<DocumentDetail>((signal) => documentsApi.detail(documentId, signal), [documentId]);

  return (
    <div className="card card-tight" style={{ marginBlock: 'var(--sp-2)' }}>
      <AsyncState
        status={detail.status}
        data={detail.data}
        error={detail.error}
        isInitialLoad={detail.isInitialLoad}
        onRetry={detail.reload}
        isEmpty={(data) => data.text_pages.length === 0}
        emptyTitle={t('docs.noText')}
      >
        {(data) => (
          <div className="stack">
            {data.text_pages.map((page) => (
              <article key={page.text_id} className="stack" style={{ gap: 'var(--sp-2)' }}>
                <div className="row small muted row-wrap">
                  <span className="badge badge-neutral">
                    {page.page_number === null ? t('common.na') : `#${page.page_number}`}
                  </span>
                  <span>{t('docs.extractedBy', { method: page.extraction_method })}</span>
                  {page.confidence !== null && (
                    <span>{t('docs.confidence', { value: Math.round(page.confidence * 100) })}</span>
                  )}
                  <span>{page.char_count}</span>
                </div>
                {/* dir="auto" so an Urdu page renders RTL and an English page LTR,
                    decided per block from the text itself rather than from the UI locale. */}
                <p
                  dir="auto"
                  style={{
                    whiteSpace: 'pre-wrap',
                    background: 'var(--surface-alt)',
                    padding: 'var(--sp-3)',
                    borderRadius: 'var(--radius)',
                    maxBlockSize: '18rem',
                    overflowY: 'auto',
                  }}
                >
                  {page.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </AsyncState>
    </div>
  );
}
