/**
 * HAAFIZ mock API — a contract double for Agent 1's backend.
 *
 *   node mock-server/server.mjs            # port 8000
 *   PORT=9000 node mock-server/server.mjs
 *   npm run mock:api
 *
 * WHAT THIS IS, PRECISELY
 * -----------------------
 * Agent 1's FastAPI service is not merged yet, so there is nothing for the frontend to
 * talk to. This server implements the *deployed* half of the contract exactly as read
 * from `backend/app/api/v1/*.py` on Agent 1's branch: same paths, same field names, same
 * status codes. It lets the UI be driven end to end — upload, extraction progress,
 * concepts, diagnostic, mastery, learning path — without inventing new API surface.
 *
 * RULE 5 COMPLIANCE — this is a *clearly labelled* mock, never a silent one:
 *   - every response carries `X-Haafiz-Mock: 1`;
 *   - `GET /api/health` reports `service: "haafiz-mock-api"`;
 *   - the frontend must be started with `VITE_DEMO_MODE=true`, which paints a permanent
 *     "DEMO MODE — data comes from the local mock API" banner across every page;
 *   - endpoints Agent 1 has NOT implemented (tutor, quiz, explain, planner, exam,
 *     analytics history) deliberately return 404 here too, so the UI shows its real
 *     "pending backend" panels instead of pretending those features work.
 *
 * State is in-memory and dies with the process. No persistence, no real auth: any
 * password is accepted and the "JWT" is an unsigned base64url token with a valid `exp`
 * so the client's expiry handling can be exercised. Do not deploy this anywhere.
 */

import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';
/** Extraction is faked as a timer; shorten it to make the UI snappier while developing. */
const PROCESS_MS = Number(process.env.MOCK_PROCESS_MS || 6000);

/* ------------------------------------------------------------------ state */

const db = {
  /** email -> { student_id, name, password } */
  users: new Map(),
  /** student_id -> DocumentRecord[] */
  documents: new Map(),
  /** job_id -> JobRecord */
  jobs: new Map(),
  /** document_id -> TextPage[] */
  text: new Map(),
  /** student_id -> Map<concept_id, MasteryState> */
  mastery: new Map(),
  /** session_id -> diagnostic session */
  diagnostics: new Map(),
  /** student_id -> learning path */
  paths: new Map(),
};

/**
 * The mock's concept graph is loaded from the real curated library, not made up here:
 * `content/it_computing/programming_fundamentals.json` is the same file the Library page
 * reads. That keeps the mock honest — concept ids and prerequisite edges match content
 * that actually exists in the repository.
 */
const contentUrl = new URL('../public/content/it_computing/programming_fundamentals.json', import.meta.url);
let CONCEPTS = [];
try {
  const course = JSON.parse(await (await import('node:fs/promises')).readFile(contentUrl, 'utf8'));
  CONCEPTS = course.concepts.map((concept) => ({
    concept_id: concept.id,
    name: concept.name,
    description: concept.summary,
    phase: concept.bloom,
    confidence: 0.82,
    extraction_method: 'mock',
    evidence: `Curated library: ${course.title}`,
    difficulty: concept.difficulty,
    prerequisites: concept.prerequisites.map((p) => p.id),
  }));
} catch {
  console.error(
    'mock-api: could not read the curated library.\n' +
      '  run `npm run sync:content` first — the mock refuses to invent a concept graph.',
  );
  process.exit(1);
}

const DEFAULT_COURSE = 'programming_fundamentals';

/* ------------------------------------------------------------------ utils */

const nowIso = () => new Date().toISOString();

function b64url(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

/** Unsigned, but with a real `exp` so the client's pre-expiry logout path is testable. */
function issueToken(studentId) {
  const header = b64url({ alg: 'none', typ: 'JWT' });
  const payload = b64url({ sub: studentId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 });
  return `${header}.${payload}.mock`;
}

function studentFromRequest(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) return null;
    return payload.sub || null;
  } catch {
    return null;
  }
}

function send(res, status, body, extraHeaders = {}) {
  const payload = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Haafiz-Mock': '1',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    ...extraHeaders,
  });
  res.end(payload);
}

/**
 * Agent 1's real error envelope, copied from `backend/app/main.py`:
 *   { "error": code, "message": "English / Roman Urdu", "file"?: ..., "details"?: {...} }
 * NOT FastAPI's default `{ "detail": ... }` — the frontend client parses `error`/`message`.
 */
const fail = (res, status, code, message, extra = {}) =>
  send(res, status, { error: code, message, ...extra });

const unauthorized = (res) => fail(res, 401, 'not_authenticated', 'Not authenticated / Tasdeeq nahi hui');

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function readJson(req) {
  const raw = await readBody(req);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    return null;
  }
}

function paginate(items, url) {
  const page = Math.max(1, Number(url.searchParams.get('page') || 1));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('page_size') || 50)));
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, page_size: pageSize, total: items.length };
}

function masteryFor(studentId) {
  if (!db.mastery.has(studentId)) db.mastery.set(studentId, new Map());
  return db.mastery.get(studentId);
}

/**
 * A crude but real BKT-flavoured update, so the mastery numbers the UI shows actually
 * respond to the answers a tester gives rather than being a fixed fixture.
 */
function updateMastery(studentId, conceptId, correct) {
  const states = masteryFor(studentId);
  const previous = states.get(conceptId) || {
    concept_id: conceptId,
    name: CONCEPTS.find((c) => c.concept_id === conceptId)?.name,
    p_know: 0.25,
    attempts: 0,
    correct_attempts: 0,
    last_updated: null,
  };
  const pSlip = 0.1;
  const pGuess = 0.2;
  const pLearn = 0.15;
  const prior = previous.p_know;
  const posterior = correct
    ? (prior * (1 - pSlip)) / (prior * (1 - pSlip) + (1 - prior) * pGuess)
    : (prior * pSlip) / (prior * pSlip + (1 - prior) * (1 - pGuess));
  const next = {
    ...previous,
    p_know: Math.min(0.99, Math.max(0.01, posterior + (1 - posterior) * pLearn)),
    attempts: previous.attempts + 1,
    correct_attempts: previous.correct_attempts + (correct ? 1 : 0),
    last_updated: nowIso(),
  };
  states.set(conceptId, next);
  return next;
}

/** Deterministic pseudo-question for a concept — labelled as generated by the mock. */
function questionFor(concept, index) {
  const correctIndex = index % 4;
  const options = [
    `A definition that matches "${concept.name}"`,
    `A definition of an unrelated concept`,
    `A common misconception about ${concept.name}`,
    `A statement that is true but not about ${concept.name}`,
  ];
  const rotated = options.slice(-correctIndex).concat(options.slice(0, options.length - correctIndex));
  return {
    question_id: `q-${concept.concept_id}-${index}`,
    prompt: `[mock question] Which statement best describes ${concept.name}?`,
    options: rotated,
    difficulty: concept.difficulty ?? 3,
    correct_index: rotated.indexOf(options[0]),
    concept_id: concept.concept_id,
  };
}

/* ------------------------------------------------------------------ routes */

const routes = [];
const route = (method, pattern, handler) => routes.push({ method, pattern, handler });

route('GET', /^\/api\/health$/, (req, res) =>
  send(res, 200, {
    status: 'ok',
    service: 'haafiz-mock-api',
    environment: 'mock',
    tesseract_installed: false,
    ai_providers_enabled: [],
  }),
);

route('POST', /^\/api\/v1\/auth\/register$/, async (req, res) => {
  const body = await readJson(req);
  if (!body) return fail(res, 400, 'bad_request', 'Malformed JSON / JSON ghalat hai');
  const { name, email, password } = body;
  const missing = [!name && 'body.name', !email && 'body.email', !password && 'body.password'].filter(Boolean);
  if (missing.length) {
    return fail(res, 422, 'validation_error', 'Request data is invalid. / Request data durust nahi hai.', {
      details: { fields: missing },
    });
  }
  if (String(password).length < 8) {
    return fail(res, 422, 'validation_error', 'Password must be at least 8 characters. / Password kam az kam 8 characters ka ho.', {
      details: { fields: ['body.password'] },
    });
  }
  if (db.users.has(email)) return fail(res, 409, 'conflict', 'Email already registered / Email pehle se mojood hai');

  const studentId = randomUUID();
  db.users.set(email, { student_id: studentId, name, password });
  db.documents.set(studentId, []);
  return send(res, 201, { access_token: issueToken(studentId), token_type: 'bearer', student_id: studentId });
});

route('POST', /^\/api\/v1\/auth\/login$/, async (req, res) => {
  const body = await readJson(req);
  if (!body) return fail(res, 400, 'bad_request', 'Malformed JSON / JSON ghalat hai');
  const { email, password } = body;
  if (!email || !password) return fail(res, 422, 'validation_error', 'Email and password required / Email aur password zaroori hain');

  // Any unknown email is auto-created: this is a demo double, not an auth system.
  let user = db.users.get(email);
  if (!user) {
    const studentId = randomUUID();
    user = { student_id: studentId, name: String(email).split('@')[0], password };
    db.users.set(email, user);
    db.documents.set(studentId, []);
  }
  return send(res, 200, { access_token: issueToken(user.student_id), token_type: 'bearer', student_id: user.student_id });
});

route('POST', /^\/api\/v1\/documents\/upload$/, async (req, res) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);

  const raw = await readBody(req);
  // Parse just enough multipart to recover the filenames; the bytes are discarded.
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(req.headers['content-type'] || '');
  const names = [];
  if (boundaryMatch) {
    const text = raw.toString('latin1');
    const filenameRe = /name="files"[^\r\n]*filename="([^"]*)"/g;
    let match;
    while ((match = filenameRe.exec(text)) !== null) if (match[1]) names.push(match[1]);
  }
  if (!names.length) return fail(res, 422, 'validation_error', 'No files received / Koi file nahi mili');

  const jobId = randomUUID();
  const docs = names.map((name) => ({
    document_id: randomUUID(),
    original_name: name,
    mime_type: guessMime(name),
    size_bytes: Math.max(1024, Math.round(raw.length / names.length)),
    page_count: null,
    language_detected: 'unknown',
    status: 'queued',
    error_message: null,
    created_at: nowIso(),
    processed_at: null,
  }));

  const list = db.documents.get(studentId) || [];
  db.documents.set(studentId, [...docs, ...list]);
  db.jobs.set(jobId, {
    job_id: jobId,
    total_files: docs.length,
    completed_files: 0,
    failed_files: 0,
    status: 'queued',
    created_at: nowIso(),
    updated_at: nowIso(),
    _documents: docs.map((d) => d.document_id),
    _student: studentId,
  });

  simulateProcessing(jobId);

  return send(res, 202, {
    job_id: jobId,
    status: 'queued',
    files: docs.map((d) => ({
      file_id: d.document_id,
      original_name: d.original_name,
      size_bytes: d.size_bytes,
      mime_type: d.mime_type,
      status: 'queued',
    })),
    message: `${docs.length} file(s) queued / ${docs.length} file qatar mein`,
  });
});

route('GET', /^\/api\/v1\/documents$/, (req, res, _m, url) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  return send(res, 200, paginate(db.documents.get(studentId) || [], url));
});

route('GET', /^\/api\/v1\/documents\/([^/]+)$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const doc = (db.documents.get(studentId) || []).find((d) => d.document_id === match[1]);
  if (!doc) return fail(res, 404, 'not_found', 'Document not found / Document nahi mila');
  return send(res, 200, { ...doc, text_pages: db.text.get(doc.document_id) || [] });
});

route('GET', /^\/api\/v1\/documents\/([^/]+)\/text$/, (req, res, match, url) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const doc = (db.documents.get(studentId) || []).find((d) => d.document_id === match[1]);
  if (!doc) return fail(res, 404, 'not_found', 'Document not found / Document nahi mila');
  return send(res, 200, paginate(db.text.get(doc.document_id) || [], url));
});

route('DELETE', /^\/api\/v1\/documents\/([^/]+)$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const list = db.documents.get(studentId) || [];
  const next = list.filter((d) => d.document_id !== match[1]);
  if (next.length === list.length) return fail(res, 404, 'not_found', 'Document not found / Document nahi mila');
  db.documents.set(studentId, next);
  db.text.delete(match[1]);
  return send(res, 204, undefined);
});

route('GET', /^\/api\/v1\/jobs\/([^/]+)$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const job = db.jobs.get(match[1]);
  if (!job) return fail(res, 404, 'not_found', 'Job not found / Job nahi mila');
  const { _documents, _student, ...publicJob } = job;
  return send(res, 200, publicJob);
});

route('POST', /^\/api\/v1\/jobs\/([^/]+)\/retry$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const job = db.jobs.get(match[1]);
  if (!job) return fail(res, 404, 'not_found', 'Job not found / Job nahi mila');
  job.failed_files = 0;
  job.completed_files = job.total_files;
  job.status = 'success';
  job.updated_at = nowIso();
  for (const documentId of job._documents) {
    const doc = (db.documents.get(job._student) || []).find((d) => d.document_id === documentId);
    if (doc && doc.status === 'failed') {
      doc.status = 'success';
      doc.error_message = null;
      doc.processed_at = nowIso();
    }
  }
  const { _documents, _student, ...publicJob } = job;
  return send(res, 200, publicJob);
});

route('GET', /^\/api\/v1\/concepts$/, (req, res, _m, url) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const course = url.searchParams.get('course');
  if (!course) return fail(res, 422, 'validation_error', 'course query parameter required / course parameter zaroori hai');
  // Only the seeded course has concepts; anything else is honestly empty.
  if (course !== DEFAULT_COURSE) return send(res, 200, []);
  return send(res, 200, CONCEPTS.map(({ difficulty, prerequisites, ...rest }) => rest));
});

route('GET', /^\/api\/v1\/concepts\/([^/]+)\/prerequisites$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const concept = CONCEPTS.find((c) => c.concept_id === decodeURIComponent(match[1]));
  if (!concept) return fail(res, 404, 'not_found', 'Concept not found / Concept nahi mila');
  const edges = concept.prerequisites
    .map((id) => CONCEPTS.find((c) => c.concept_id === id))
    .filter(Boolean)
    .map((prereq) => ({
      concept_id: prereq.concept_id,
      name: prereq.name,
      confidence: 0.9,
      evidence: 'Curated prerequisite from the HAAFIZ content library',
      approved: true,
    }));
  return send(res, 200, edges);
});

route('POST', /^\/api\/v1\/diagnostic\/start$/, async (req, res) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const body = (await readJson(req)) || {};
  const courseKey = body.course_key || DEFAULT_COURSE;
  if (courseKey !== DEFAULT_COURSE) {
    return fail(res, 409, 'conflict', 'No concepts for this course yet / Is course ke concepts abhi nahi hain');
  }
  const total = Math.min(Number(body.max_questions) || 12, CONCEPTS.length);
  const sessionId = randomUUID();
  const questions = CONCEPTS.slice(0, total).map((concept, index) => questionFor(concept, index));
  db.diagnostics.set(sessionId, { session_id: sessionId, student_id: studentId, questions, index: 0, answers: [] });
  const { correct_index, concept_id, ...question } = questions[0];
  return send(res, 201, { session_id: sessionId, status: 'active', total_questions: total, question });
});

route('POST', /^\/api\/v1\/diagnostic\/([^/]+)\/answer$/, async (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const session = db.diagnostics.get(match[1]);
  if (!session) return fail(res, 404, 'not_found', 'Session not found / Session nahi mila');
  const body = (await readJson(req)) || {};
  const current = session.questions[session.index];
  if (!current || body.question_id !== current.question_id) {
    return fail(res, 409, 'conflict', 'Unexpected question / Ghair mutawaqqa sawal');
  }

  const correct = Number(body.selected_index) === current.correct_index;
  const before = masteryFor(studentId).get(current.concept_id)?.p_know ?? 0.25;
  const state = updateMastery(studentId, current.concept_id, correct);
  session.answers.push({
    question_id: current.question_id,
    correct,
    mastery_before: Math.round(before * 100),
    mastery_after: Math.round(state.p_know * 100),
  });
  session.index += 1;

  const next = session.questions[session.index];
  const payload = {
    correct,
    mastery_percent: Math.round(state.p_know * 100),
    evidence: correct
      ? `Correct — mastery of ${current.concept_id} raised to ${Math.round(state.p_know * 100)}%.`
      : `Incorrect — mastery of ${current.concept_id} lowered to ${Math.round(state.p_know * 100)}%.`,
    status: next ? 'active' : 'complete',
    question: null,
  };
  if (next) {
    const { correct_index, concept_id, ...question } = next;
    payload.question = question;
  }
  return send(res, 200, payload);
});

route('GET', /^\/api\/v1\/diagnostic\/([^/]+)\/result$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const session = db.diagnostics.get(match[1]);
  if (!session) return fail(res, 404, 'not_found', 'Session not found / Session nahi mila');
  return send(res, 200, {
    session_id: session.session_id,
    status: session.index >= session.questions.length ? 'complete' : 'active',
    answered: session.answers.length,
    total: session.questions.length,
    answers: session.answers,
  });
});

route('GET', /^\/api\/v1\/mastery\/([^/]+)$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  if (match[1] !== studentId) return fail(res, 403, 'forbidden', 'Not your record / Yeh aap ka record nahi');
  return send(res, 200, [...masteryFor(studentId).values()]);
});

route('GET', /^\/api\/v1\/mastery\/([^/]+)\/concept\/([^/]+)$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  if (match[1] !== studentId) return fail(res, 403, 'forbidden', 'Not your record / Yeh aap ka record nahi');
  const state = masteryFor(studentId).get(decodeURIComponent(match[2]));
  if (!state) return fail(res, 404, 'not_found', 'No mastery record / Koi mastery record nahi');
  return send(res, 200, { ...state, p_learn: 0.15, p_slip: 0.1, p_guess: 0.2 });
});

route('POST', /^\/api\/v1\/path\/generate$/, async (req, res) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const body = (await readJson(req)) || {};
  const courseKey = body.course_key || DEFAULT_COURSE;
  if (courseKey !== DEFAULT_COURSE) {
    return fail(res, 409, 'conflict', 'No concepts for this course yet / Is course ke concepts abhi nahi hain');
  }
  const states = masteryFor(studentId);
  const steps = CONCEPTS
    // Weakest first among the unlocked ones — the same intent as the real bandit.
    .map((concept, position) => ({
      concept_id: concept.concept_id,
      name: concept.name,
      position,
      mastery: states.get(concept.concept_id)?.p_know ?? null,
      reason:
        (states.get(concept.concept_id)?.p_know ?? 0) < 0.6
          ? `Mastery is below the 60% threshold and ${concept.prerequisites.length} prerequisite(s) are already covered.`
          : 'Scheduled for spaced review.',
    }))
    .sort((a, b) => (a.mastery ?? 0) - (b.mastery ?? 0))
    .map((step, position) => ({ ...step, position }));

  const pathId = randomUUID();
  db.paths.set(studentId, { path_id: pathId, course_key: courseKey, status: 'active', steps });
  return send(res, 201, { path_id: pathId, steps });
});

route('GET', /^\/api\/v1\/path\/current$/, (req, res) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const path = db.paths.get(studentId);
  if (!path) return send(res, 200, { path_id: null, course_key: null, status: null, steps: [] });
  return send(res, 200, path);
});

route('GET', /^\/api\/v1\/path\/why\/([^/]+)$/, (req, res, match) => {
  const studentId = studentFromRequest(req);
  if (!studentId) return unauthorized(res);
  const conceptId = decodeURIComponent(match[1]);
  const path = db.paths.get(studentId);
  const step = path?.steps.find((s) => s.concept_id === conceptId);
  const concept = CONCEPTS.find((c) => c.concept_id === conceptId);
  if (!concept) return fail(res, 404, 'not_found', 'Concept not found / Concept nahi mila');
  return send(res, 200, {
    concept_id: conceptId,
    name: concept.name,
    reason: step?.reason ?? 'Not currently scheduled.',
    evidence: concept.prerequisites.length
      ? `Depends on: ${concept.prerequisites.join(', ')}`
      : 'No prerequisites — this is an entry point into the course.',
    position: step?.position,
  });
});

/* --------------------------------------------------- deliberately absent
 * tutor / quiz / explain / planner / exam / analytics-history are NOT implemented
 * here, because they are not implemented in the backend either. Letting them 404
 * is what makes the UI's "pending backend" panels show the truth.
 */

function guessMime(name) {
  const ext = name.toLowerCase().split('.').pop();
  return (
    {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      tif: 'image/tiff',
      tiff: 'image/tiff',
      bmp: 'image/bmp',
    }[ext] || 'application/octet-stream'
  );
}

/** Walk a job through queued -> processing -> success, one document at a time. */
function simulateProcessing(jobId) {
  const job = db.jobs.get(jobId);
  if (!job) return;
  const perFile = Math.max(400, Math.round(PROCESS_MS / Math.max(1, job.total_files)));

  job.status = 'processing';
  job.updated_at = nowIso();

  job._documents.forEach((documentId, position) => {
    const doc = (db.documents.get(job._student) || []).find((d) => d.document_id === documentId);
    if (!doc) return;
    setTimeout(() => {
      doc.status = 'processing';
      doc.updated_at = nowIso();
    }, perFile * position);

    setTimeout(() => {
      // One in six uploads "fails" so the retry path and partial-job state are reachable.
      const failed = Math.random() < 1 / 6;
      doc.status = failed ? 'failed' : 'success';
      doc.processed_at = nowIso();
      doc.error_message = failed ? 'Mock extraction failure / Mock nikaalne mein nakami' : null;
      if (!failed) {
        doc.page_count = 3;
        doc.language_detected = 'en';
        db.text.set(
          documentId,
          Array.from({ length: 3 }, (_, page) => ({
            text_id: randomUUID(),
            page_number: page + 1,
            content:
              `[mock extracted text — page ${page + 1} of ${doc.original_name}]\n\n` +
              'This text is produced by the local mock API. The real backend returns text ' +
              'extracted from the uploaded document by PyMuPDF or Tesseract OCR.',
            char_count: 180,
            extraction_method: page === 2 ? 'ocr' : 'pymupdf',
            confidence: page === 2 ? 0.74 : null,
          })),
        );
      }
      job.completed_files += failed ? 0 : 1;
      job.failed_files += failed ? 1 : 0;
      job.updated_at = nowIso();
      if (job.completed_files + job.failed_files >= job.total_files) {
        job.status = job.failed_files === 0 ? 'success' : job.completed_files === 0 ? 'failed' : 'partial';
      }
    }, perFile * (position + 1));
  });
}

/* ------------------------------------------------------------------ server */

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, undefined);

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  for (const entry of routes) {
    const match = entry.pattern.exec(pathname);
    if (!match) continue;
    if (entry.method !== req.method) continue;
    try {
      return await entry.handler(req, res, match, url);
    } catch (error) {
      console.error('mock-api error:', error);
      return fail(res, 500, 'internal_error', 'Mock server error / Mock server mein kharabi');
    }
  }

  return fail(
    res,
    404,
    'not_found',
    `No mock route for ${req.method} ${pathname} / Yeh route mock mein nahi hai`,
  );
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  HAAFIZ MOCK API — not a real backend');
  console.log(`  listening on http://${HOST}:${PORT}`);
  console.log(`  concept graph: ${CONCEPTS.length} concepts from the curated library (${DEFAULT_COURSE})`);
  console.log('  every response carries X-Haafiz-Mock: 1');
  console.log('  tutor / quiz / explain / planner / exam return 404 on purpose');
  console.log('');
  console.log('  start the UI with:  VITE_DEMO_MODE=true VITE_DEV_API_TARGET=http://localhost:' + PORT + ' npm run dev');
  console.log('');
});
