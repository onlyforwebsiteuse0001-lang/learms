import { ApiError, networkError, notImplementedError, timeoutError } from './errors';

/**
 * Relative by default. Agent 1's nginx (prod) and Vite (dev) both proxy `/api`, so the
 * browser is always same-origin. `VITE_API_BASE_URL` exists only for the split-origin
 * case and is intentionally empty in every normal deployment — hardcoding a host breaks
 * the Arena preview, Docker networking, and HTTPS pages via mixed content.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const DEFAULT_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 2;

/** Endpoints Agent 1 has NOT deployed. A 404 on these means "not built yet", not "no such record". */
const PROPOSED_PREFIXES = [
  '/api/v1/tutor',
  '/api/v1/quiz',
  '/api/v1/explain',
  '/api/v1/planner',
  '/api/v1/exam',
  '/api/v1/analytics',
];

type TokenReader = () => string | null;
type UnauthorizedHandler = () => void;

let readToken: TokenReader = () => null;
let onUnauthorized: UnauthorizedHandler = () => {};

/** Wired once at app start by the auth store, keeping the client free of store imports. */
export function configureClient(options: { getToken?: TokenReader; onUnauthorized?: UnauthorizedHandler }): void {
  if (options.getToken) readToken = options.getToken;
  if (options.onUnauthorized) onUnauthorized = options.onUnauthorized;
}

export function apiUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

function isProposed(path: string): boolean {
  return PROPOSED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Exponential backoff with jitter, so N clients recovering from an outage do not sync up. */
function backoffDelay(attempt: number): number {
  return Math.round(300 * 2 ** attempt * (0.7 + Math.random() * 0.6));
}

async function parseError(response: Response, path: string): Promise<ApiError> {
  const contentType = response.headers.get('content-type') ?? '';

  // nginx / a crashed worker answers with HTML. Blindly calling .json() here is the
  // classic way a frontend turns a 502 into an unhandled SyntaxError.
  if (!contentType.includes('application/json')) {
    if (response.status === 502 || response.status === 504) {
      return new ApiError({
        status: response.status,
        code: 'bad_gateway',
        message: 'The API is not reachable right now.',
        messageKey: 'error.badGateway',
      });
    }
    return new ApiError({
      status: response.status,
      code: `http_${response.status}`,
      message: `Request failed with status ${response.status}.`,
      messageKey: response.status >= 500 ? 'error.server' : 'error.unknown',
    });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    /* A JSON content-type with an unparseable body: fall through to the generic shape. */
  }

  if (response.status === 404 && isProposed(path)) {
    return notImplementedError(path);
  }

  return new ApiError({
    status: response.status,
    code: typeof body.error === 'string' ? body.error : `http_${response.status}`,
    message: typeof body.message === 'string' ? body.message : `Request failed with status ${response.status}.`,
    file: typeof body.file === 'string' ? body.file : undefined,
    details: (body.details as Record<string, unknown>) ?? {},
  });
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Extra query parameters; `undefined`/`null` values are dropped. */
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Set false for endpoints that must work signed-out (health, auth). */
  auth?: boolean;
  /** Retry even though it is not a GET. Only for genuinely idempotent writes. */
  retryable?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal, timeoutMs = DEFAULT_TIMEOUT_MS, auth = true, retryable } = options;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }
  const url = `${apiUrl(path)}${search.toString() ? `?${search}` : ''}`;
  const allowRetry = retryable ?? method === 'GET';

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= (allowRetry ? MAX_RETRIES : 0); attempt += 1) {
    // One controller per attempt: an aborted attempt must not poison the retry.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new DOMException('timeout', 'TimeoutError')), timeoutMs);
    const onExternalAbort = () => controller.abort(signal?.reason);
    signal?.addEventListener('abort', onExternalAbort, { once: true });

    try {
      const headers = new Headers({ Accept: 'application/json' });
      if (auth) {
        const token = readToken();
        if (token) headers.set('Authorization', `Bearer ${token}`);
      }
      if (body !== undefined) headers.set('Content-Type', 'application/json');

      const response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
        credentials: 'same-origin',
      });

      if (response.ok) {
        if (response.status === 204) return undefined as T;
        const text = await response.text();
        return (text ? JSON.parse(text) : undefined) as T;
      }

      const error = await parseError(response, path);

      // A single place to kill a dead session. Without this, an expired token leaves
      // every page showing its own 401 error instead of returning to sign-in.
      if (error.status === 401) {
        onUnauthorized();
        throw error;
      }

      if (error.isRetryable && attempt < MAX_RETRIES && allowRetry) {
        lastError = error;
        await sleep(backoffDelay(attempt));
        continue;
      }
      throw error;
    } catch (caught) {
      if (caught instanceof ApiError) throw caught;

      // The caller aborted deliberately (navigated away, cancelled) — propagate as-is.
      if (signal?.aborted) throw caught;

      const isTimeout = caught instanceof DOMException && caught.name === 'TimeoutError';
      const error = isTimeout ? timeoutError() : networkError();

      if (attempt < MAX_RETRIES && allowRetry) {
        lastError = error;
        await sleep(backoffDelay(attempt));
        continue;
      }
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onExternalAbort);
    }
  }

  throw lastError ?? networkError();
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  del: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
