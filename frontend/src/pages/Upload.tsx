import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi } from '../api/endpoints';
import { toApiError } from '../api/errors';
import { jobPercent, watchJob } from '../api/realtime';
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILES,
  MAX_FILE_MB,
  formatBytes,
  uploadDocuments,
  validateFiles,
} from '../api/upload';
import type { UploadHandle } from '../api/upload';
import type { JobRecord } from '../api/types';
import { PageHeader } from '../components/layout/PageHeader';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApiErrorMessage } from '../hooks/useApiErrorMessage';
import { useI18n } from '../i18n';
import { useAuthStore } from '../store/auth';
import { useUiStore } from '../store/ui';

export function UploadPage() {
  const { t } = useI18n();
  const token = useAuthStore((state) => state.token);
  const pushToast = useUiStore((state) => state.pushToast);
  const describe = useApiErrorMessage();

  const [selected, setSelected] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [job, setJob] = useState<JobRecord | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<UploadHandle | null>(null);
  const stopWatchRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopWatchRef.current?.(), []);

  const addFiles = (incoming: File[]) => {
    const room = MAX_FILES - selected.length;
    if (room <= 0) {
      pushToast('error', t('upload.tooMany', { max: MAX_FILES }));
      return;
    }

    const { accepted, rejected } = validateFiles(incoming.slice(0, room), selected);
    if (incoming.length > room) pushToast('error', t('upload.tooMany', { max: MAX_FILES }));

    // Every rejection is reported individually with the file name — a silent drop looks
    // like the app lost the file.
    for (const rejection of rejected) {
      const name = rejection.file.name;
      if (rejection.reason === 'file_too_large') pushToast('error', t('upload.tooLarge', { name, max: MAX_FILE_MB }));
      else if (rejection.reason === 'unsupported_format') pushToast('error', t('upload.badType', { name }));
      else if (rejection.reason === 'empty_file') pushToast('error', t('upload.empty', { name }));
      else pushToast('info', t('upload.duplicate', { name }));
    }

    if (accepted.length) setSelected((current) => [...current, ...accepted]);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const removeAt = (index: number) => setSelected((current) => current.filter((_, i) => i !== index));

  const watch = (jobId: string) => {
    stopWatchRef.current?.();
    stopWatchRef.current = watchJob(
      jobId,
      (event) => {
        if (event.type === 'error') return; // Transient poll failures must not clear the bar.
        setJob(event.job);
      },
      token,
    );
  };

  const startUpload = async () => {
    if (!selected.length) return;
    setBusy(true);
    setUploadPercent(0);
    setJob(null);

    const handle = uploadDocuments(selected, {
      token,
      // Real transferred bytes from XHR — never a timer-driven fake.
      onProgress: (progress) => setUploadPercent(progress.percent),
    });
    handleRef.current = handle;

    try {
      const result = await handle.promise;
      setSelected([]);
      if (inputRef.current) inputRef.current.value = '';
      pushToast('success', t('upload.queued'));
      const initial = await jobsApi.status(result.job_id).catch(() => null);
      if (initial) setJob(initial);
      watch(result.job_id);
    } catch (caught) {
      const error = toApiError(caught);
      if (error.code === 'aborted') pushToast('info', t('upload.cancelled'));
      else pushToast('error', describe(error));
    } finally {
      setBusy(false);
      setUploadPercent(null);
      handleRef.current = null;
    }
  };

  const retryJob = async () => {
    if (!job) return;
    try {
      const updated = await jobsApi.retry(job.job_id);
      setJob(updated);
      watch(updated.job_id);
    } catch (caught) {
      pushToast('error', describe(toApiError(caught)));
    }
  };

  const totalBytes = selected.reduce((sum, file) => sum + file.size, 0);

  return (
    <>
      <PageHeader eyebrow={t('nav.upload')} title={t('upload.title')} description={t('upload.subtitle')} />

      <section className="card" style={{ marginBlockEnd: 'var(--sp-5)' }}>
        {/* 2.1.1 Keyboard: drag-and-drop is an enhancement. The <label>+<input type=file>
            underneath is fully keyboard operable on its own, so there is no mouse-only path. */}
        <div
          className={`dropzone${dragging ? ' is-over' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <span aria-hidden="true" style={{ fontSize: '1.6rem' }}>
            ↑
          </span>
          <p>
            <b>{t('upload.drop')}</b>
          </p>
          <p className="small muted">{t('upload.formats')}</p>
          <p className="small muted">
            {t('upload.tooMany', { max: MAX_FILES })} · {MAX_FILE_MB} MB
          </p>
          <label className="btn btn-ghost" style={{ marginBlockStart: 'var(--sp-2)' }}>
            {t('upload.choose')}
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPT_ATTRIBUTE}
              className="visually-hidden"
              onChange={(event) => {
                addFiles(Array.from(event.target.files ?? []));
                event.target.value = '';
              }}
            />
          </label>
        </div>

        {selected.length > 0 && (
          <div className="stack" style={{ marginBlockStart: 'var(--sp-4)' }}>
            <div className="row">
              <b>{t('upload.selected')}</b>
              <span className="badge badge-neutral">
                {selected.length} · {formatBytes(totalBytes)}
              </span>
              <div className="spacer" />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected([])} disabled={busy}>
                {t('upload.clear')}
              </button>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {selected.map((file, index) => (
                <li className="item-row" key={`${file.name}-${file.size}-${index}`}>
                  <span className="file-chip" aria-hidden="true">
                    {file.name.split('.').pop()?.toUpperCase().slice(0, 4)}
                  </span>
                  <div className="item-main">
                    <b>{file.name}</b>
                    <span className="small muted mono">{formatBytes(file.size)}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeAt(index)}
                    disabled={busy}
                    aria-label={`${t('upload.remove')}: ${file.name}`}
                  >
                    {t('upload.remove')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {busy && (
          <div style={{ marginBlockStart: 'var(--sp-4)' }}>
            <ProgressBar value={uploadPercent} label={t('upload.progressLabel')} />
          </div>
        )}

        <div className="row row-wrap" style={{ marginBlockStart: 'var(--sp-4)' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void startUpload()}
            disabled={!selected.length || busy}
          >
            {busy ? t('upload.uploading') : t('upload.start')}
          </button>
          {busy && (
            <button type="button" className="btn btn-ghost" onClick={() => handleRef.current?.abort()}>
              {t('upload.cancel')}
            </button>
          )}
        </div>
      </section>

      {job && (
        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">{t('upload.jobProgress')}</p>
              <h3 className="mono force-ltr small">{job.job_id}</h3>
            </div>
            <span className="badge badge-info">{job.status}</span>
          </div>
          <ProgressBar value={jobPercent(job)} label={t('upload.jobProgress')} />
          <dl className="kv" style={{ marginBlockStart: 'var(--sp-4)' }}>
            <dt>{t('dash.documents')}</dt>
            <dd>{job.total_files}</dd>
            <dt>{t('docs.status.success')}</dt>
            <dd>{job.completed_files}</dd>
            <dt>{t('docs.status.failed')}</dt>
            <dd>{job.failed_files}</dd>
          </dl>
          <div className="row row-wrap" style={{ marginBlockStart: 'var(--sp-4)' }}>
            {job.failed_files > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => void retryJob()}>
                {t('upload.retryFailed')}
              </button>
            )}
            <Link className="btn btn-ghost" to="/documents">
              {t('docs.title')}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
