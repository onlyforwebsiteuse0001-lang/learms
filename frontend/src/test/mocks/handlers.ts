import { HttpResponse, http } from 'msw';
import type {
  Concept,
  DiagnosticStartResponse,
  DocumentRecord,
  JobRecord,
  LearningPathResponse,
  MasteryState,
  Paginated,
  PrerequisiteEdge,
  TokenResponse,
} from '../../api/types';

/**
 * MSW handlers describing Agent 1's DEPLOYED contract.
 *
 * These are contract mocks, not fixtures of convenience: the shapes are copied from
 * `backend/app/schemas/*.py` and `backend/app/api/v1/learning.py` on Agent 1's branch. If
 * the real backend changes, these fail first and the page tests fail right behind them,
 * which is the whole point of testing against them.
 *
 * Endpoints Agent 1 has not built (tutor, quiz, explain, planner, exam, analytics
 * history) are NOT handled here. They fall through to the 404 handler at the bottom, so
 * tests observe exactly what a user observes today: a "pending backend" panel.
 */

export const TEST_STUDENT_ID = 'student-1';

/** A token whose `exp` is 8 hours out, so the client treats it as valid. */
export function makeToken(secondsFromNow = 8 * 60 * 60): string {
  const payload = { sub: TEST_STUDENT_ID, exp: Math.floor(Date.now() / 1000) + secondsFromNow };
  const encode = (value: unknown) =>
    btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${encode({ alg: 'none' })}.${encode(payload)}.test`;
}

export const tokenResponse: TokenResponse = {
  access_token: makeToken(),
  token_type: 'bearer',
  student_id: TEST_STUDENT_ID,
};

export const textPageFixture = {
  text_id: 'text-1',
  page_number: 1,
  content: 'A limit describes the value a function approaches.',
  char_count: 49,
  extraction_method: 'pymupdf',
  confidence: null,
};

export const documentFixture: DocumentRecord = {
  document_id: 'doc-1',
  original_name: 'calculus-notes.pdf',
  mime_type: 'application/pdf',
  size_bytes: 482_311,
  page_count: 12,
  language_detected: 'en',
  status: 'success',
  error_message: null,
  created_at: '2026-09-20T10:00:00Z',
  processed_at: '2026-09-20T10:01:30Z',
};

export const failedDocumentFixture: DocumentRecord = {
  ...documentFixture,
  document_id: 'doc-2',
  original_name: 'scanned-paper.jpg',
  mime_type: 'image/jpeg',
  page_count: null,
  status: 'failed',
  error_message: 'OCR produced no text / OCR se koi text nahi mila',
  processed_at: null,
};

export const jobFixture: JobRecord = {
  job_id: 'job-1',
  total_files: 2,
  completed_files: 1,
  failed_files: 1,
  status: 'partial',
  created_at: '2026-09-20T10:00:00Z',
  updated_at: '2026-09-20T10:01:30Z',
};

export const conceptFixtures: Concept[] = [
  {
    concept_id: 'c-1',
    name: 'Limits',
    description: 'The value a function approaches.',
    phase: 'understand',
    confidence: 0.91,
    extraction_method: 'llm',
    evidence: 'Chapter 2, page 14',
  },
  {
    concept_id: 'c-2',
    name: 'Derivatives',
    description: 'Instantaneous rate of change.',
    phase: 'apply',
    confidence: 0.86,
    extraction_method: 'llm',
    evidence: 'Chapter 3, page 31',
  },
  {
    concept_id: 'c-3',
    name: 'Chain rule',
    description: 'Differentiating a composition.',
    phase: 'apply',
    confidence: 0.78,
    extraction_method: 'heuristic',
    evidence: 'Chapter 3, page 40',
  },
];

export const prerequisiteFixtures: Record<string, PrerequisiteEdge[]> = {
  'c-1': [],
  'c-2': [{ concept_id: 'c-1', name: 'Limits', confidence: 0.9, evidence: 'stated in text', approved: true }],
  'c-3': [{ concept_id: 'c-2', name: 'Derivatives', confidence: 0.83, evidence: 'stated in text', approved: true }],
};

export const masteryFixtures: MasteryState[] = [
  { concept_id: 'c-1', name: 'Limits', p_know: 0.84, attempts: 6, correct_attempts: 5, last_updated: '2026-09-25T09:00:00Z' },
  { concept_id: 'c-2', name: 'Derivatives', p_know: 0.52, attempts: 4, correct_attempts: 2, last_updated: '2026-09-25T09:10:00Z' },
  { concept_id: 'c-3', name: 'Chain rule', p_know: 0.18, attempts: 3, correct_attempts: 0, last_updated: '2026-09-25T09:20:00Z' },
];

export const pathFixture: LearningPathResponse = {
  path_id: 'path-1',
  course_key: 'calculus',
  status: 'active',
  steps: [
    { concept_id: 'c-3', name: 'Chain rule', position: 0, reason: 'Lowest mastery with prerequisites met.', mastery: 0.18 },
    { concept_id: 'c-2', name: 'Derivatives', position: 1, reason: 'Below the 60% threshold.', mastery: 0.52 },
  ],
};

export const diagnosticStartFixture: DiagnosticStartResponse = {
  session_id: 'diag-1',
  status: 'active',
  total_questions: 2,
  question: {
    question_id: 'q-1',
    prompt: 'Which statement best describes a limit?',
    options: ['A value a function approaches', 'The slope of a tangent', 'An integral', 'A constant'],
    difficulty: 2,
  },
};

const paginated = <T>(items: T[]): Paginated<T> => ({ items, page: 1, page_size: 50, total: items.length });

/**
 * Agent 1's error envelope, from `backend/app/main.py`:
 *   { "error": code, "message": "English / Roman Urdu", "file"?, "details"? }
 * Validation failures use `details.fields: ["body.password", ...]`.
 * This is NOT FastAPI's default `{detail: ...}` — building the mocks on the real shape is
 * what makes these contract mocks rather than wishful ones.
 */
export const apiError = (
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
) => HttpResponse.json({ error: code, message, ...extra }, { status });

const requireAuth = (request: Request) =>
  request.headers.get('Authorization')?.startsWith('Bearer ')
    ? null
    : apiError(401, 'not_authenticated', 'Not authenticated / Tasdeeq nahi hui');

export const handlers = [
  http.get('/api/health', () =>
    HttpResponse.json({
      status: 'ok',
      service: 'haafiz-api',
      environment: 'test',
      tesseract_installed: true,
      ai_providers_enabled: ['openai'],
    }),
  ),

  http.post('/api/v1/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === 'taken@example.com') {
      return apiError(409, 'conflict', 'Email already registered / Email pehle se mojood hai');
    }
    if ((body.password ?? '').length < 8) {
      return apiError(422, 'validation_error', 'Request data is invalid. / Request data durust nahi hai.', {
        details: { fields: ['body.password'] },
      });
    }
    return HttpResponse.json(tokenResponse, { status: 201 });
  }),

  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    // Any password beginning with "wrong" is rejected. It must still be >= 8 characters
    // so it gets past the form's own client-side rule and actually reaches the server.
    if ((body.password ?? '').startsWith('wrong')) {
      return apiError(401, 'invalid_credentials', 'Incorrect email or password / Email ya password ghalat hai');
    }
    return HttpResponse.json(tokenResponse);
  }),

  http.get('/api/v1/documents', ({ request }) =>
    requireAuth(request) ?? HttpResponse.json(paginated([documentFixture, failedDocumentFixture])),
  ),

  http.get('/api/v1/documents/:documentId', ({ request, params }) => {
    const denied = requireAuth(request);
    if (denied) return denied;
    if (params.documentId !== documentFixture.document_id) {
      return apiError(404, 'not_found', 'Document not found / Document nahi mila');
    }
    return HttpResponse.json({ ...documentFixture, text_pages: [textPageFixture] });
  }),

  http.get('/api/v1/documents/:documentId/text', ({ request }) => {
    const denied = requireAuth(request);
    if (denied) return denied;
    return HttpResponse.json(paginated([textPageFixture]));
  }),

  http.delete('/api/v1/documents/:documentId', ({ request }) =>
    requireAuth(request) ?? new HttpResponse(null, { status: 204 }),
  ),

  http.get('/api/v1/jobs/:jobId', ({ request }) => requireAuth(request) ?? HttpResponse.json(jobFixture)),

  http.post('/api/v1/jobs/:jobId/retry', ({ request }) =>
    requireAuth(request) ?? HttpResponse.json({ ...jobFixture, status: 'success', failed_files: 0, completed_files: 2 }),
  ),

  http.get('/api/v1/concepts', ({ request }) => {
    const denied = requireAuth(request);
    if (denied) return denied;
    const course = new URL(request.url).searchParams.get('course');
    return HttpResponse.json(course === 'empty' ? [] : conceptFixtures);
  }),

  http.get('/api/v1/concepts/:conceptId/prerequisites', ({ request, params }) =>
    requireAuth(request) ?? HttpResponse.json(prerequisiteFixtures[String(params.conceptId)] ?? []),
  ),

  http.get('/api/v1/mastery/:studentId', ({ request }) => requireAuth(request) ?? HttpResponse.json(masteryFixtures)),

  http.get('/api/v1/mastery/:studentId/concept/:conceptId', ({ request, params }) => {
    const denied = requireAuth(request);
    if (denied) return denied;
    const state = masteryFixtures.find((item) => item.concept_id === params.conceptId);
    if (!state) return apiError(404, 'not_found', 'No mastery record / Koi record nahi');
    return HttpResponse.json({ ...state, p_learn: 0.15, p_slip: 0.1, p_guess: 0.2 });
  }),

  http.get('/api/v1/path/current', ({ request }) => requireAuth(request) ?? HttpResponse.json(pathFixture)),

  http.post('/api/v1/path/generate', ({ request }) =>
    requireAuth(request) ?? HttpResponse.json({ path_id: 'path-1', steps: pathFixture.steps }, { status: 201 }),
  ),

  http.get('/api/v1/path/why/:conceptId', ({ request, params }) =>
    requireAuth(request) ??
    HttpResponse.json({
      concept_id: String(params.conceptId),
      name: 'Chain rule',
      reason: 'Lowest mastery with prerequisites met.',
      evidence: 'Depends on Derivatives (52%).',
      position: 0,
    }),
  ),

  http.post('/api/v1/diagnostic/start', async ({ request }) => {
    const denied = requireAuth(request);
    if (denied) return denied;
    const body = (await request.json()) as { course_key?: string };
    if (body.course_key === 'empty') {
      return apiError(409, 'conflict', 'No concepts for this course yet / Is course ke concepts abhi nahi hain');
    }
    return HttpResponse.json(diagnosticStartFixture, { status: 201 });
  }),

  http.post('/api/v1/diagnostic/:sessionId/answer', async ({ request }) => {
    const denied = requireAuth(request);
    if (denied) return denied;
    const body = (await request.json()) as { selected_index?: number };
    const correct = body.selected_index === 0;
    return HttpResponse.json({
      correct,
      mastery_percent: correct ? 71 : 22,
      evidence: correct ? 'Correct — mastery raised to 71%.' : 'Incorrect — mastery lowered to 22%.',
      status: 'complete',
      question: null,
    });
  }),

  http.get('/api/v1/diagnostic/:sessionId/result', ({ request }) =>
    requireAuth(request) ??
    HttpResponse.json({
      session_id: 'diag-1',
      status: 'complete',
      answered: 1,
      total: 2,
      answers: [{ question_id: 'q-1', correct: true, mastery_before: 25, mastery_after: 71 }],
    }),
  ),

  /*
   * PROPOSED endpoints. Agent 1 has not built these, so they answer 404 here exactly as
   * the real server does. That is what lets a page test assert the honest "pending
   * backend" panel instead of a mocked feature that does not exist.
   *
   * They are declared (rather than left unhandled) only because `onUnhandledRequest:
   * 'error'` would otherwise fail the run before the UI could react.
   */
  ...[
    'tutor/message',
    'quiz/next',
    'quiz/answer',
    'explain/grade',
    'planner/schedule',
    'planner/catchup',
    'exam/start',
  ].map((path) =>
    http.post(`/api/v1/${path}`, () => apiError(404, 'not_found', 'Not Found')),
  ),
  http.post('/api/v1/exam/:examId/submit', () => apiError(404, 'not_found', 'Not Found')),
  http.get('/api/v1/analytics/mastery-history', () => apiError(404, 'not_found', 'Not Found')),

  // The static content library. Tests import the same JSON the app ships.
  http.get('/content/taxonomy.json', () =>
    HttpResponse.json({
      schema_version: '1.0.0',
      generated_at: '2026-09-30',
      fields: [
        {
          id: 'it_computing',
          name: 'IT & Computing',
          name_ur: 'آئی ٹی و کمپیوٹنگ',
          description: 'Computing disciplines.',
          categories: [
            { id: 'computer_science', name: 'Computer Science', name_ur: 'کمپیوٹر سائنس', courses: ['programming_fundamentals'] },
            { id: 'networks_cloud', name: 'Networks & Cloud', name_ur: 'نیٹ ورکس', courses: [] },
          ],
        },
      ],
    }),
  ),

  http.get('/content/index.json', () =>
    HttpResponse.json({
      schema_version: '1.0.0',
      generated_at: '2026-09-30',
      field_count: 1,
      category_count: 2,
      course_count: 1,
      concept_count: 2,
      courses: [
        {
          course_id: 'programming_fundamentals',
          field: 'it_computing',
          category: 'computer_science',
          title: 'Programming Fundamentals (Python)',
          title_ur: 'پروگرامنگ کے بنیادی اصول',
          level: 'undergraduate',
          concept_count: 2,
          estimated_hours: 1.5,
          accreditation: 'HEC/NCEAC Computing Core',
          authoring_method: 'curated',
          path: 'it_computing/programming_fundamentals.json',
        },
      ],
    }),
  ),

  http.get('/content/it_computing/programming_fundamentals.json', () =>
    HttpResponse.json({
      schema_version: '1.0.0',
      course_id: 'programming_fundamentals',
      field: 'it_computing',
      category: 'computer_science',
      title: 'Programming Fundamentals (Python)',
      title_ur: 'پروگرامنگ کے بنیادی اصول',
      description: 'The Computing Core entry course.',
      level: 'undergraduate',
      credit_hours: { total: 4, theory: 3, lab: 1 },
      estimated_hours: 1.5,
      accreditation: 'HEC/NCEAC Computing Core',
      source: { name: 'HEC Computing Disciplines 2023', url: 'https://example.org/hec', retrieved: '2026-09-30' },
      authoring: { method: 'curated', by: 'HAAFIZ content team', date: '2026-09-30', model: null, reviewed: true },
      outcomes: ['Translate a problem into an algorithm.'],
      concepts: [
        {
          id: 'it_computing.programming_fundamentals.values_types',
          name: 'Values, variables and data types',
          summary: 'Integers, floats, strings and booleans.',
          bloom: 'understand',
          difficulty: 1,
          estimated_minutes: 45,
          prerequisites: [],
          assessment: 'mcq',
          keywords: ['int', 'float'],
        },
        {
          id: 'it_computing.programming_fundamentals.operators',
          name: 'Operators',
          summary: 'Precedence and short-circuit evaluation.',
          bloom: 'apply',
          difficulty: 1,
          estimated_minutes: 45,
          prerequisites: [{ id: 'it_computing.programming_fundamentals.values_types', strength: 'hard' }],
          assessment: 'mcq',
          keywords: ['precedence'],
        },
      ],
    }),
  ),
];
