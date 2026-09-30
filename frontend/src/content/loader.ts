import { ApiError } from '../api/errors';
import type { ContentCourse, LibraryIndex, Taxonomy } from './types';

/**
 * The library is static JSON served from `/content/...`, not an API call.
 *
 * `scripts/content/sync_to_frontend.py` copies the repository's `content/` directory into
 * `frontend/public/content/` before dev and build (see the `predev`/`prebuild` npm
 * scripts). Keeping the canonical files at the repo root means the Python validator and
 * the UI read exactly the same bytes — there is no second, drifting copy to maintain.
 */

const CONTENT_ROOT = '/content';

async function loadJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { signal, headers: { Accept: 'application/json' } });
  } catch {
    throw new ApiError({
      status: 0,
      code: 'network_error',
      message: 'Cannot load the course library.',
      messageKey: 'error.network',
    });
  }

  if (!response.ok) {
    // 404 here almost always means the sync step did not run, so say that instead of
    // showing a generic error the developer then has to go and diagnose.
    throw new ApiError({
      status: response.status,
      code: response.status === 404 ? 'content_not_synced' : `http_${response.status}`,
      message:
        response.status === 404
          ? 'Course library files are missing. Run `npm run sync:content` (or `python scripts/content/sync_to_frontend.py`).'
          : `Could not load ${path}.`,
    });
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError({ status: 0, code: 'content_parse_error', message: `${path} is not valid JSON.` });
  }
}

export const loadTaxonomy = (signal?: AbortSignal) => loadJson<Taxonomy>(`${CONTENT_ROOT}/taxonomy.json`, signal);

export const loadIndex = (signal?: AbortSignal) => loadJson<LibraryIndex>(`${CONTENT_ROOT}/index.json`, signal);

export const loadCourse = (path: string, signal?: AbortSignal) =>
  loadJson<ContentCourse>(`${CONTENT_ROOT}/${path.replace(/^\/+/, '')}`, signal);
