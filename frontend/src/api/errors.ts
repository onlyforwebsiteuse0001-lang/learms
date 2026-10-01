import type { MessageKey } from '../i18n';

/**
 * One error type for every failure mode.
 *
 * Agent 1's `main.py` serialises expected errors as
 *   {"error": code, "message": "English / Roman Urdu", "file": "x.pdf", "details": {...}}
 * but plenty of failures never reach FastAPI at all — nginx 502 HTML, DNS failure,
 * an aborted request. Normalising all of them here means no call site ever has to
 * guess whether `err.response.data.message` exists.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly file?: string;
  readonly details: Record<string, unknown>;
  /** Present only for locally-generated errors, so the UI can translate them. */
  readonly messageKey?: MessageKey;

  constructor(init: {
    status: number;
    code: string;
    message: string;
    file?: string;
    details?: Record<string, unknown>;
    messageKey?: MessageKey;
  }) {
    super(init.message);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = init.code;
    this.file = init.file;
    this.details = init.details ?? {};
    this.messageKey = init.messageKey;
  }

  /** 401/403 — the session is no longer usable. */
  get isAuth(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** The endpoint is not deployed. Drives the honest "pending backend" panel. */
  get isNotImplemented(): boolean {
    return this.code === 'not_implemented';
  }

  get isValidation(): boolean {
    return this.status === 422 || this.code === 'validation_error';
  }

  /**
   * Safe to retry automatically. Deliberately excludes 4xx: retrying a rejected upload
   * just wastes the student's data allowance, and retrying a write could duplicate it.
   */
  get isRetryable(): boolean {
    return (
      this.code === 'network_error' ||
      this.code === 'timeout' ||
      this.status === 502 ||
      this.status === 503 ||
      this.status === 504
    );
  }

  /** Field paths from FastAPI's 422 body, e.g. `["body.email"]` -> `["email"]`. */
  get fieldErrors(): string[] {
    const fields = (this.details as { fields?: unknown }).fields;
    if (!Array.isArray(fields)) return [];
    return fields.map((f) => String(f).replace(/^body\./, ''));
  }
}

/**
 * Agent 1 writes user-facing messages as "English / Roman Urdu" in one string.
 * Show the half that matches the active UI language instead of both.
 */
export function localizeBackendMessage(message: string, locale: string): string {
  const parts = message.split(' / ');
  if (parts.length !== 2) return message;
  const [english, roman] = parts;
  return locale === 'en' ? english.trim() : roman.trim();
}

/** Maps a normalised error to a translation key when the backend gave us nothing useful. */
export function errorMessageKey(error: ApiError): MessageKey | null {
  if (error.messageKey) return error.messageKey;
  switch (error.code) {
    case 'network_error':
      return 'error.network';
    case 'timeout':
      return 'error.timeout';
    case 'bad_gateway':
      return 'error.badGateway';
    default:
      if (error.status >= 500) return 'error.server';
      return null;
  }
}

export function networkError(): ApiError {
  return new ApiError({
    status: 0,
    code: 'network_error',
    message: 'Cannot reach the server.',
    messageKey: 'error.network',
  });
}

export function timeoutError(): ApiError {
  return new ApiError({
    status: 0,
    code: 'timeout',
    message: 'The server took too long to respond.',
    messageKey: 'error.timeout',
  });
}

export function notImplementedError(endpoint: string): ApiError {
  return new ApiError({
    status: 404,
    code: 'not_implemented',
    message: `Endpoint not deployed: ${endpoint}`,
    details: { endpoint },
  });
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

/** Last-resort narrowing so `catch (e: unknown)` always yields an ApiError. */
export function toApiError(value: unknown): ApiError {
  if (isApiError(value)) return value;
  if (value instanceof Error) {
    return new ApiError({ status: 0, code: 'client_error', message: value.message });
  }
  return new ApiError({ status: 0, code: 'unknown', message: 'Unknown error', messageKey: 'error.unknown' });
}
