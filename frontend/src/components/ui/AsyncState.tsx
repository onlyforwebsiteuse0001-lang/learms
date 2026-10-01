import type { ReactNode } from 'react';
import type { ApiError } from '../../api/errors';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { useI18n } from '../../i18n';
import { PendingBackend } from './PendingBackend';
import { Skeleton } from './Skeleton';

interface AsyncStateProps<T> {
  status: 'idle' | 'loading' | 'ready' | 'error';
  data: T | null;
  error: ApiError | null;
  isInitialLoad?: boolean;
  /** Rendered instead of the generic shimmer so the skeleton matches the final layout. */
  skeleton?: ReactNode;
  /** True when `data` is present but has nothing in it. */
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyBody?: string;
  emptyAction?: ReactNode;
  /** Shown when the failure is a missing (undeployed) endpoint. */
  pendingEndpoint?: string;
  onRetry?: () => void;
  idle?: ReactNode;
  children: (data: T) => ReactNode;
}

/**
 * The single place the loading / empty / error / ready contract is enforced.
 *
 * Every data view goes through this, which is what guarantees a page can never show a
 * confident-looking "0" while a request is still in flight, and can never swallow an
 * error into an empty state.
 */
export function AsyncState<T>({
  status,
  data,
  error,
  isInitialLoad = true,
  skeleton,
  isEmpty,
  emptyTitle,
  emptyBody,
  emptyAction,
  pendingEndpoint,
  onRetry,
  idle = null,
  children,
}: AsyncStateProps<T>) {
  const { t } = useI18n();
  const describe = useApiErrorMessage();

  if (status === 'idle') return <>{idle}</>;

  if (status === 'loading' && isInitialLoad) {
    return <div aria-busy="true" aria-live="polite">{skeleton ?? <Skeleton lines={4} />}</div>;
  }

  if (status === 'error' && error) {
    // A 404 on a route Agent 1 has not built is a roadmap fact, not a user-facing bug.
    if (error.isNotImplemented && pendingEndpoint) {
      return <PendingBackend endpoint={pendingEndpoint} />;
    }
    return (
      <div className="state-panel is-error" role="alert">
        <span className="state-icon" aria-hidden="true">
          !
        </span>
        <h3>{t('state.errorTitle')}</h3>
        <p>{describe(error)}</p>
        {onRetry && (
          <button type="button" className="btn btn-ghost" onClick={onRetry}>
            {t('state.retry')}
          </button>
        )}
      </div>
    );
  }

  if (data === null) return <>{skeleton ?? <Skeleton lines={3} />}</>;

  if (isEmpty?.(data)) {
    return (
      <div className="state-panel">
        <span className="state-icon" aria-hidden="true">
          ◦
        </span>
        <h3>{emptyTitle ?? t('state.emptyTitle')}</h3>
        {emptyBody && <p>{emptyBody}</p>}
        {emptyAction}
      </div>
    );
  }

  return <>{children(data)}</>;
}
