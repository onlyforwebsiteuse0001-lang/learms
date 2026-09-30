import { apiUrl } from './client';
import { ApiError, networkError } from './errors';
import type { UploadBatchResponse } from './types';

/** Mirrors `SUPPORTED_EXTENSIONS` in Agent 1's `backend/app/api/v1/documents.py`. */
export const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.bmp'];
export const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(',');

/** Mirrors `settings.max_upload_mb` / `settings.max_files_per_upload` defaults. */
export const MAX_FILE_MB = 50;
export const MAX_FILES = 10;

export type UploadRejectionReason = 'unsupported_format' | 'file_too_large' | 'empty_file' | 'duplicate';

export interface UploadRejection {
  file: File;
  reason: UploadRejectionReason;
}

export interface ValidationOutcome {
  accepted: File[];
  rejected: UploadRejection[];
}

function extensionOf(name: string): string {
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.slice(index).toLowerCase();
}

/**
 * Client-side pre-check that mirrors the server's rules. The point is to stop a student
 * on a metered connection uploading 50 MB that the server will reject anyway — NOT to
 * replace server validation, which stays authoritative and is always surfaced.
 */
export function validateFiles(incoming: File[], existing: File[] = []): ValidationOutcome {
  const accepted: File[] = [];
  const rejected: UploadRejection[] = [];
  const seen = new Set(existing.map((file) => `${file.name}:${file.size}`));

  for (const file of incoming) {
    const key = `${file.name}:${file.size}`;
    if (seen.has(key)) {
      rejected.push({ file, reason: 'duplicate' });
      continue;
    }
    if (!ACCEPTED_EXTENSIONS.includes(extensionOf(file.name))) {
      rejected.push({ file, reason: 'unsupported_format' });
      continue;
    }
    if (file.size === 0) {
      rejected.push({ file, reason: 'empty_file' });
      continue;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      rejected.push({ file, reason: 'file_too_large' });
      continue;
    }
    seen.add(key);
    accepted.push(file);
  }

  return { accepted, rejected };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  /** 0–100, or `null` when the browser cannot compute it (`lengthComputable === false`). */
  percent: number | null;
}

export interface UploadHandle {
  promise: Promise<UploadBatchResponse>;
  abort: () => void;
}

/**
 * Uploads via XMLHttpRequest, not fetch.
 *
 * `fetch` gives no upload-progress events — there is no request-body streaming progress
 * in browsers today. XHR's `upload.onprogress` reports real transferred bytes. Agent 1's
 * scaffold faked a progress bar on a `setInterval` timer; this reports the truth, and when
 * `lengthComputable` is false it reports `null` so the UI can show an indeterminate bar
 * instead of inventing a percentage.
 */
export function uploadDocuments(
  files: File[],
  options: {
    token: string | null;
    onProgress?: (progress: UploadProgress) => void;
  },
): UploadHandle {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<UploadBatchResponse>((resolve, reject) => {
    const form = new FormData();
    // Field name must be `files` — see `upload_documents(files: list[UploadFile] = File(...))`.
    for (const file of files) form.append('files', file, file.name);

    xhr.open('POST', apiUrl('/api/v1/documents/upload'));
    xhr.responseType = 'text';
    if (options.token) xhr.setRequestHeader('Authorization', `Bearer ${options.token}`);
    xhr.setRequestHeader('Accept', 'application/json');
    // Content-Type is intentionally NOT set: the browser must add the multipart boundary.

    xhr.upload.onprogress = (event) => {
      options.onProgress?.({
        loaded: event.loaded,
        total: event.total,
        percent: event.lengthComputable && event.total > 0 ? Math.round((event.loaded / event.total) * 100) : null,
      });
    };

    xhr.onload = () => {
      let body: Record<string, unknown> = {};
      try {
        body = xhr.responseText ? (JSON.parse(xhr.responseText) as Record<string, unknown>) : {};
      } catch {
        /* Non-JSON body (e.g. an nginx error page) — handled by the status branch below. */
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body as unknown as UploadBatchResponse);
        return;
      }

      reject(
        new ApiError({
          status: xhr.status,
          code: typeof body.error === 'string' ? body.error : `http_${xhr.status}`,
          message:
            typeof body.message === 'string'
              ? body.message
              : xhr.status === 413
                ? 'The upload exceeded the server size limit.'
                : `Upload failed with status ${xhr.status}.`,
          file: typeof body.file === 'string' ? body.file : undefined,
          details: (body.details as Record<string, unknown>) ?? {},
        }),
      );
    };

    xhr.onerror = () => reject(networkError());
    xhr.ontimeout = () =>
      reject(new ApiError({ status: 0, code: 'timeout', message: 'Upload timed out.', messageKey: 'error.timeout' }));
    xhr.onabort = () =>
      reject(new ApiError({ status: 0, code: 'aborted', message: 'Upload cancelled.' }));

    // Large scans over a slow connection legitimately take minutes.
    xhr.timeout = 10 * 60 * 1000;
    xhr.send(form);
  });

  return { promise, abort: () => xhr.abort() };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
