import { useCallback, useEffect, useRef, useState } from 'react';
import { toApiError } from '../api/errors';
import type { ApiError } from '../api/errors';

export type AsyncStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AsyncResult<T> {
  status: AsyncStatus;
  data: T | null;
  error: ApiError | null;
  /** True only on the first load, so refreshes do not flash a skeleton over real data. */
  isInitialLoad: boolean;
  reload: () => void;
  setData: (updater: T | ((previous: T | null) => T | null)) => void;
}

/**
 * Loads data and models the four states every view needs explicitly: idle, loading, error
 * and ready. Sharing this stops pages from rendering "0 concepts" while a request is still
 * in flight — which a student reads as an answer, not as an unfinished load.
 *
 * `deps` controls re-fetching. `enabled: false` defers the call (e.g. until a course is picked).
 */
export function useAsync<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown>,
  options: { enabled?: boolean } = {},
): AsyncResult<T> {
  const enabled = options.enabled ?? true;
  const [status, setStatus] = useState<AsyncStatus>(enabled ? 'loading' : 'idle');
  const [data, setDataState] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [nonce, setNonce] = useState(0);
  const hasLoadedRef = useRef(false);

  // Keeping the loader in a ref means callers can pass an inline arrow without causing
  // an infinite refetch loop; `deps` stays the single, explicit trigger.
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    let active = true;

    setStatus('loading');
    setError(null);

    loaderRef
      .current(controller.signal)
      .then((result) => {
        if (!active) return;
        hasLoadedRef.current = true;
        setDataState(result);
        setStatus('ready');
      })
      .catch((caught) => {
        // An abort is a navigation, not a failure — never surface it as an error.
        if (!active || controller.signal.aborted) return;
        setError(toApiError(caught));
        setStatus('error');
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  const setData = useCallback((updater: T | ((previous: T | null) => T | null)) => {
    setDataState((previous) =>
      typeof updater === 'function' ? (updater as (p: T | null) => T | null)(previous) : updater,
    );
  }, []);

  return {
    status,
    data,
    error,
    isInitialLoad: status === 'loading' && !hasLoadedRef.current,
    reload,
    setData,
  };
}
