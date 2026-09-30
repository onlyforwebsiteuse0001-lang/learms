import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../test/mocks/server';
import { configureClient } from './client';
import { isTerminal, jobPercent, jobSocketUrl, watchJob, wsEnabled } from './realtime';
import type { JobProgressEvent } from './realtime';
import type { JobRecord } from './types';

const baseJob: JobRecord = {
  job_id: 'job-1',
  total_files: 2,
  completed_files: 0,
  failed_files: 0,
  status: 'processing',
  created_at: '2026-09-20T10:00:00Z',
  updated_at: '2026-09-20T10:00:00Z',
};

describe('isTerminal', () => {
  it.each(['success', 'failed', 'partial', 'complete'])('treats %s as terminal', (status) => {
    expect(isTerminal(status)).toBe(true);
  });

  it.each(['queued', 'processing'])('treats %s as still running', (status) => {
    expect(isTerminal(status)).toBe(false);
  });
});

describe('jobPercent', () => {
  it('counts failures as finished, because the job will not revisit them', () => {
    expect(jobPercent({ ...baseJob, completed_files: 1, failed_files: 1 })).toBe(100);
  });

  it('rounds partial progress', () => {
    expect(jobPercent({ ...baseJob, total_files: 3, completed_files: 1 })).toBe(33);
  });

  it('returns null rather than dividing by zero on an empty job', () => {
    expect(jobPercent({ ...baseJob, total_files: 0 })).toBeNull();
  });
});

describe('jobSocketUrl', () => {
  it('derives the socket URL from the page origin, never a hardcoded host', () => {
    expect(jobSocketUrl('job-1')).toBe(`ws://${window.location.host}/api/v1/ws/jobs/job-1`);
  });
});

describe('wsEnabled', () => {
  it('is off by default, because Agent 1 has not shipped the socket', () => {
    expect(wsEnabled()).toBe(false);
  });
});

describe('watchJob (polling transport)', () => {
  beforeEach(() => {
    configureClient({ getToken: () => 'test-token', onUnauthorized: () => {} });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits an update while the job is running, then done at the terminal state', async () => {
    let call = 0;
    server.use(
      http.get('/api/v1/jobs/:jobId', () => {
        call += 1;
        return HttpResponse.json(
          call === 1 ? baseJob : { ...baseJob, completed_files: 2, status: 'success' },
        );
      }),
    );

    const events: JobProgressEvent[] = [];
    const stop = watchJob('job-1', (event) => events.push(event));

    await vi.waitFor(() => expect(events.some((e) => e.type === 'done')).toBe(true), { timeout: 8000 });
    stop();

    expect(events[0]).toMatchObject({ type: 'update', transport: 'polling' });
    const done = events.find((e) => e.type === 'done');
    expect(done).toMatchObject({ type: 'done' });
    expect(done && done.type === 'done' && done.job.status).toBe('success');
  }, 10_000);

  it('stops polling once done, so a finished job does not keep hitting the API', async () => {
    let calls = 0;
    server.use(
      http.get('/api/v1/jobs/:jobId', () => {
        calls += 1;
        return HttpResponse.json({ ...baseJob, completed_files: 2, status: 'success' });
      }),
    );

    const events: JobProgressEvent[] = [];
    const stop = watchJob('job-1', (event) => events.push(event));
    await vi.waitFor(() => expect(events).toHaveLength(1));
    const afterDone = calls;
    await new Promise((resolve) => setTimeout(resolve, 2500));
    stop();
    expect(calls).toBe(afterDone);
  }, 10_000);

  it('reports an error event and gives up on 404, which cannot resolve itself', async () => {
    server.use(
      http.get('/api/v1/jobs/:jobId', () =>
        HttpResponse.json({ error: 'not_found', message: 'Job not found / Job nahi mila' }, { status: 404 }),
      ),
    );

    const events: JobProgressEvent[] = [];
    const stop = watchJob('missing', (event) => events.push(event));
    await vi.waitFor(() => expect(events).toHaveLength(1));
    stop();

    expect(events[0].type).toBe('error');
    expect(events[0].type === 'error' && events[0].error.status).toBe(404);
  }, 10_000);

  it('keeps watching after a transient network failure', async () => {
    let calls = 0;
    server.use(
      http.get('/api/v1/jobs/:jobId', () => {
        calls += 1;
        if (calls <= 3) return HttpResponse.error();
        return HttpResponse.json({ ...baseJob, completed_files: 2, status: 'success' });
      }),
    );

    const events: JobProgressEvent[] = [];
    const stop = watchJob('job-1', (event) => events.push(event));
    await vi.waitFor(() => expect(events.some((e) => e.type === 'done')).toBe(true), { timeout: 15_000 });
    stop();
    expect(events.some((e) => e.type === 'error')).toBe(true);
  }, 20_000);

  it('returns an unsubscribe that is safe to call twice', async () => {
    server.use(http.get('/api/v1/jobs/:jobId', () => HttpResponse.json(baseJob)));
    const stop = watchJob('job-1', () => {});
    expect(() => {
      stop();
      stop();
    }).not.toThrow();
  });
});
