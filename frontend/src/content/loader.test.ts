import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { ApiError } from '../api/errors';
import { server } from '../test/mocks/server';
import { loadCourse, loadIndex, loadTaxonomy } from './loader';

describe('content loader', () => {
  it('loads the taxonomy', async () => {
    const taxonomy = await loadTaxonomy();
    expect(taxonomy.fields[0].id).toBe('it_computing');
    expect(taxonomy.fields[0].name_ur).toBeTruthy();
  });

  it('loads the index', async () => {
    const index = await loadIndex();
    expect(index.course_count).toBe(1);
    expect(index.courses[0].path).toBe('it_computing/programming_fundamentals.json');
  });

  it('loads a course by the path the index gives', async () => {
    const index = await loadIndex();
    const course = await loadCourse(index.courses[0].path);
    expect(course.course_id).toBe('programming_fundamentals');
    expect(course.concepts).toHaveLength(2);
    expect(course.authoring.method).toBe('curated');
  });

  it('tolerates a leading slash in the path', async () => {
    const course = await loadCourse('/it_computing/programming_fundamentals.json');
    expect(course.course_id).toBe('programming_fundamentals');
  });

  it('explains a 404 as an un-run sync rather than a generic error', async () => {
    server.use(http.get('/content/missing.json', () => new HttpResponse(null, { status: 404 })));
    const error = await loadCourse('missing.json').catch((e) => e as ApiError);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('content_not_synced');
    // The message has to name the fix, because this only ever happens to a developer.
    expect(error.message).toMatch(/sync/i);
  });

  it('reports other HTTP failures distinctly', async () => {
    server.use(http.get('/content/broken.json', () => new HttpResponse(null, { status: 500 })));
    const error = await loadCourse('broken.json').catch((e) => e as ApiError);
    expect(error.code).toBe('http_500');
  });

  it('reports malformed JSON as a parse error, not a network error', async () => {
    server.use(
      http.get('/content/bad.json', () =>
        HttpResponse.text('{not json', { headers: { 'Content-Type': 'application/json' } }),
      ),
    );
    const error = await loadCourse('bad.json').catch((e) => e as ApiError);
    expect(error.code).toBe('content_parse_error');
  });

  it('reports a transport failure as a network error', async () => {
    server.use(http.get('/content/offline.json', () => HttpResponse.error()));
    const error = await loadCourse('offline.json').catch((e) => e as ApiError);
    expect(error.code).toBe('network_error');
  });

  it('propagates an abort so navigation does not raise a visible error', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(loadTaxonomy(controller.signal)).rejects.toBeTruthy();
  });
});
