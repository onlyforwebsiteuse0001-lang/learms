import { jobsApi } from './endpoints';
import { toApiError } from './errors';
import type { ApiError } from './errors';
import type { JobRecord } from './types';

/**
 * Job progress with two interchangeable transports.
 *
 * Agent 1 has NOT shipped a WebSocket endpoint. Document processing is a Celery task whose
 * state lives in `GET /api/v1/jobs/{job_id}`. So:
 *
 *   - POLLING is the default and is the only transport verified against the real contract.
 *   - WEBSOCKET is implemented against the proposed `/api/v1/ws/jobs/{id}` contract and is
 *     gated behind VITE_ENABLE_WS (default false). It has never been run against a live
 *     server and is labelled as such in docs/frontend/INTEGRATION_GUIDE.md.
 *
 * Both emit identical events, so switching is a one-flag change once the socket exists.
 */

export type JobProgressEvent =
  | { type: 'update'; job: JobRecord; transport: 'websocket' | 'polling' }
  | { type: 'done'; job: JobRecord; transport: 'websocket' | 'polling' }
  | { type: 'error'; error: ApiError };

export type JobProgressListener = (event: JobProgressEvent) => void;

const TERMINAL: ReadonlyArray<string> = ['success', 'failed', 'partial', 'complete'];

export function isTerminal(status: string): boolean {
  return TERMINAL.includes(status);
}

const FAST_INTERVAL_MS = 2_000;
const SLOW_INTERVAL_MS = 10_000;
/** Processing a scanned PDF takes a while; drop to the slow cadence after this. */
const SLOWDOWN_AFTER_MS = 30_000;
/** Hard ceiling so a stuck job never polls for the life of the tab. */
const GIVE_UP_AFTER_MS = 15 * 60 * 1000;

export function wsEnabled(): boolean {
  return String(import.meta.env.VITE_ENABLE_WS ?? 'false') === 'true';
}

export function jobSocketUrl(jobId: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/api/v1/ws/jobs/${jobId}`;
}

/**
 * Subscribes to one job. Returns an unsubscribe function that is always safe to call twice.
 */
export function watchJob(jobId: string, listener: JobProgressListener, token?: string | null): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let socket: WebSocket | null = null;
  const startedAt = Date.now();

  const stop = () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    timer = null;
    if (socket) {
      socket.onclose = null;
      socket.close();
      socket = null;
    }
    document.removeEventListener('visibilitychange', onVisibility);
  };

  const emit = (job: JobRecord, transport: 'websocket' | 'polling') => {
    if (isTerminal(job.status)) {
      listener({ type: 'done', job, transport });
      stop();
    } else {
      listener({ type: 'update', job, transport });
    }
  };

  /* ---------------------------------------------------------- polling */

  const poll = async () => {
    if (stopped) return;

    // A backgrounded tab must not keep hammering the API; resume on visibilitychange.
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      timer = setTimeout(poll, SLOW_INTERVAL_MS);
      return;
    }

    if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
      stop();
      return;
    }

    try {
      const job = await jobsApi.status(jobId);
      if (stopped) return;
      emit(job, 'polling');
      if (stopped) return;
    } catch (error) {
      if (stopped) return;
      const apiError = toApiError(error);
      listener({ type: 'error', error: apiError });
      // A transient network blip should not end the watch; auth failures should.
      if (apiError.isAuth || apiError.status === 404) {
        stop();
        return;
      }
    }

    const elapsed = Date.now() - startedAt;
    timer = setTimeout(poll, elapsed > SLOWDOWN_AFTER_MS ? SLOW_INTERVAL_MS : FAST_INTERVAL_MS);
  };

  function onVisibility() {
    if (!stopped && document.visibilityState === 'visible' && !socket) {
      if (timer) clearTimeout(timer);
      void poll();
    }
  }

  const startPolling = () => {
    if (stopped) return;
    document.addEventListener('visibilitychange', onVisibility);
    void poll();
  };

  /* -------------------------------------------------------- websocket */

  if (wsEnabled() && typeof WebSocket !== 'undefined') {
    try {
      socket = new WebSocket(jobSocketUrl(jobId));
      const openTimeout = setTimeout(() => {
        // Never leave the student staring at a stale bar because a socket hung.
        if (socket && socket.readyState !== WebSocket.OPEN) {
          socket.close();
          socket = null;
          startPolling();
        }
      }, 4_000);

      socket.onopen = () => {
        clearTimeout(openTimeout);
        // Bearer tokens cannot be set as WebSocket headers from the browser, so the
        // proposed contract authenticates with a first message. See CHANGES_NEEDED.md.
        if (token) socket?.send(JSON.stringify({ type: 'auth', token }));
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(String(event.data)) as JobRecord;
          if (payload && typeof payload.status === 'string') emit(payload, 'websocket');
        } catch {
          /* Ignore frames that are not job records rather than tearing down the socket. */
        }
      };

      socket.onerror = () => {
        clearTimeout(openTimeout);
      };

      socket.onclose = () => {
        clearTimeout(openTimeout);
        socket = null;
        if (!stopped) startPolling();
      };
    } catch {
      socket = null;
      startPolling();
    }
  } else {
    startPolling();
  }

  return stop;
}

/** Percentage of files finished (completed + failed), or null when the job is empty. */
export function jobPercent(job: JobRecord): number | null {
  if (!job.total_files) return null;
  return Math.round(((job.completed_files + job.failed_files) / job.total_files) * 100);
}
