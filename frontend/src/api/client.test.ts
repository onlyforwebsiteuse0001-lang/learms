import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../test/mocks/server';
import { expectApiError } from '../test/utils';
import { api, apiUrl, configureClient, request } from './client';
import { ApiError } from './errors';

/**
 * These tests drive the real `fetch` through MSW rather than stubbing it, so the retry
 * loop, the abort/timeout controller and the error normalisation all actually run.
 */

describe('apiUrl', () => {
  it('keeps paths relative so the app works behind any proxy', () => {
    // VITE_API_BASE_URL is unset in tests, which is also the normal deployment.
    expect(apiUrl('/api/v1/documents')).toBe('/api/v1/documents');
  });
});

describe('request', () => {
  beforeEach(() => {
    configureClient({ getToken: () => 'test-token', onUnauthorized: () => {} });
  });

  it('returns parsed JSON on success', async () => {
    const health = await request<{ service: string }>('/api/health', { auth: false });
    expect(health.service).toBe('haafiz-api');
  });

  it('sends the bearer token when auth is on', async () => {
    let seen: string | null = null;
    server.use(
      http.get('/api/v1/echo-auth', ({ request: req }) => {
        seen = req.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );
    await request('/api/v1/echo-auth');
    expect(seen).toBe('Bearer test-token');
  });

  it('omits the token when auth is off', async () => {
    let seen: string | null = 'unset';
    server.use(
      http.get('/api/v1/echo-auth', ({ request: req }) => {
        seen = req.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );
    await request('/api/v1/echo-auth', { auth: false });
    expect(seen).toBeNull();
  });

  it('serialises query parameters and drops null/undefined', async () => {
    let seen = '';
    server.use(
      http.get('/api/v1/echo-query', ({ request: req }) => {
        seen = new URL(req.url).search;
        return HttpResponse.json({ ok: true });
      }),
    );
    await request('/api/v1/echo-query', { query: { page: 2, course: 'calculus', missing: null, gone: undefined } });
    expect(seen).toContain('page=2');
    expect(seen).toContain('course=calculus');
    expect(seen).not.toContain('missing');
    expect(seen).not.toContain('gone');
  });

  it('returns undefined for 204 rather than trying to parse an empty body', async () => {
    server.use(http.delete('/api/v1/documents/:id', () => new HttpResponse(null, { status: 204 })));
    await expect(api.del('/api/v1/documents/doc-1')).resolves.toBeUndefined();
  });

  it("maps Agent 1's error envelope onto ApiError", async () => {
    server.use(
      http.get('/api/v1/boom', () =>
        HttpResponse.json(
          { error: 'conflict', message: 'Already exists / Pehle se mojood hai', file: 'notes.pdf' },
          { status: 409 },
        ),
      ),
    );
    const error = await expectApiError(request('/api/v1/boom'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(409);
    expect(error.code).toBe('conflict');
    expect(error.message).toBe('Already exists / Pehle se mojood hai');
    expect(error.file).toBe('notes.pdf');
  });

  it('does not choke on an HTML 502 from nginx', async () => {
    server.use(
      http.get('/api/v1/gateway', () =>
        HttpResponse.text('<html><body>502 Bad Gateway</body></html>', {
          status: 502,
          headers: { 'Content-Type': 'text/html' },
        }),
      ),
    );
    const error = await expectApiError(request('/api/v1/gateway', { retryable: false }));
    expect(error.code).toBe('bad_gateway');
    expect(error.messageKey).toBe('error.badGateway');
  });

  it('converts a 404 on a proposed endpoint into not_implemented', async () => {
    server.use(
      http.post('/api/v1/tutor/message', () =>
        HttpResponse.json({ error: 'not_found', message: 'Not Found' }, { status: 404 }),
      ),
    );
    const error = await expectApiError(api.post('/api/v1/tutor/message', {}));
    expect(error.isNotImplemented).toBe(true);
  });

  it('leaves a 404 on a deployed endpoint as an ordinary not-found', async () => {
    const error = await expectApiError(request('/api/v1/documents/does-not-exist'));
    expect(error.status).toBe(404);
    expect(error.isNotImplemented).toBe(false);
  });

  it('notifies the unauthorized handler exactly once on 401', async () => {
    const onUnauthorized = vi.fn();
    configureClient({ getToken: () => 'stale', onUnauthorized });
    server.use(
      http.get('/api/v1/private', () =>
        HttpResponse.json({ error: 'not_authenticated', message: 'Not authenticated' }, { status: 401 }),
      ),
    );
    await expect(request('/api/v1/private')).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('retries a retryable GET and succeeds on the second attempt', async () => {
    let attempts = 0;
    server.use(
      http.get('/api/v1/flaky', () => {
        attempts += 1;
        if (attempts === 1) {
          return HttpResponse.json({ error: 'unavailable', message: 'try later' }, { status: 503 });
        }
        return HttpResponse.json({ ok: true });
      }),
    );
    await expect(request<{ ok: boolean }>('/api/v1/flaky')).resolves.toEqual({ ok: true });
    expect(attempts).toBe(2);
  });

  it('gives up after the retry budget and throws the last error', async () => {
    let attempts = 0;
    server.use(
      http.get('/api/v1/always-down', () => {
        attempts += 1;
        return HttpResponse.json({ error: 'unavailable', message: 'down' }, { status: 503 });
      }),
    );
    await expect(request('/api/v1/always-down')).rejects.toBeInstanceOf(ApiError);
    expect(attempts).toBe(3); // initial + 2 retries
  });

  it('does not retry a POST by default, because writes are not assumed idempotent', async () => {
    let attempts = 0;
    server.use(
      http.post('/api/v1/write', () => {
        attempts += 1;
        return HttpResponse.json({ error: 'unavailable', message: 'down' }, { status: 503 });
      }),
    );
    await expect(api.post('/api/v1/write', {})).rejects.toBeInstanceOf(ApiError);
    expect(attempts).toBe(1);
  });

  it('does not retry a 4xx', async () => {
    let attempts = 0;
    server.use(
      http.get('/api/v1/bad', () => {
        attempts += 1;
        return HttpResponse.json({ error: 'bad_request', message: 'nope' }, { status: 400 });
      }),
    );
    await expect(request('/api/v1/bad')).rejects.toBeInstanceOf(ApiError);
    expect(attempts).toBe(1);
  });

  it('surfaces a transport failure as network_error', async () => {
    server.use(http.get('/api/v1/offline', () => HttpResponse.error()));
    const error = await expectApiError(request('/api/v1/offline', { retryable: false }));
    expect(error.code).toBe('network_error');
  });

  it('propagates a caller abort instead of converting it into a network error', async () => {
    const controller = new AbortController();
    server.use(
      http.get('/api/v1/slow', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return HttpResponse.json({ ok: true });
      }),
    );
    const pending = request('/api/v1/slow', { signal: controller.signal, retryable: false });
    controller.abort();
    await expect(pending).rejects.toSatisfy((error: unknown) => !(error instanceof ApiError));
  });

  it('times out a request that never answers', async () => {
    server.use(
      http.get('/api/v1/hang', async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json({ ok: true });
      }),
    );
    const error = await expectApiError(request('/api/v1/hang', { timeoutMs: 30, retryable: false }));
    expect(error.code).toBe('timeout');
  });

  afterEach(() => {
    configureClient({ getToken: () => null, onUnauthorized: () => {} });
  });
});
