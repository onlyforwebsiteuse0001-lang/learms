import { useCallback } from 'react';
import { errorMessageKey, localizeBackendMessage } from '../api/errors';
import type { ApiError } from '../api/errors';
import { useI18n } from '../i18n';

/**
 * Turns an ApiError into one readable sentence in the active language.
 *
 * Priority:
 *  1. A local translation key (network/timeout/5xx) — those messages never came from the API.
 *  2. The backend's own bilingual message, split on " / " to the matching half.
 *     Agent 1 writes genuinely helpful, domain-specific text there; replacing it with a
 *     generic "Request failed" would throw away the most useful part of the response.
 *  3. A generic fallback.
 */
export function useApiErrorMessage(): (error: ApiError | null | undefined) => string {
  const { t, locale } = useI18n();

  return useCallback(
    (error) => {
      if (!error) return '';
      const key = errorMessageKey(error);
      if (key) return t(key);
      if (error.message) return localizeBackendMessage(error.message, locale);
      return t('error.unknown');
    },
    [t, locale],
  );
}
