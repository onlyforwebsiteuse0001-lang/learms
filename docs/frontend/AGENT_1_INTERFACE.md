# Agent 1 interface contract (read-only observation)

**Source of truth:** `origin/arena/01a0f3e4-learms` (PR #1, "Add StudyFlow dashboard demo"), read at
2026-09-30T21:45Z. Agent 2 never writes to Agent 1's folders; this file records what Agent 2 observed
so the frontend can integrate against a real contract instead of a guess.

## How this was obtained

```bash
git fetch origin 'refs/heads/*:refs/remotes/origin/*'
git show origin/arena/01a0f3e4-learms:backend/app/main.py
git show origin/arena/01a0f3e4-learms:backend/app/api/v1/auth.py
git show origin/arena/01a0f3e4-learms:backend/app/api/v1/documents.py
git show origin/arena/01a0f3e4-learms:backend/app/api/v1/learning.py
git show origin/arena/01a0f3e4-learms:backend/app/schemas/auth.py
git show origin/arena/01a0f3e4-learms:backend/app/schemas/document.py
git show origin/arena/01a0f3e4-learms:docs/ARCHITECTURE.md
```

Agent 1's branch is **not merged into `main`**. On `main` the repository is an empty README, so the
frontend on this branch cannot be run end-to-end against the real API until both PRs land. This is
stated honestly in `MORNING_REPORT-2.md` rather than papered over.

## Confirmed API surface

All routers are mounted under the prefix `/api/v1` in `backend/app/main.py`, plus one unversioned
operations route. Same-origin is the deployment model: nginx (prod) and the Vite dev server proxy
`/api` to FastAPI, so the browser never talks to a cross-origin host.

### Operations

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | none | `{status, service, environment, tesseract_installed, ai_providers_enabled}` |

### Authentication — `backend/app/api/v1/auth.py`

| Method | Path | Auth | Request | Success |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | none | `{name (2..120), email, password (8..128)}` | `201` `{access_token, token_type:"bearer", student_id}` |
| POST | `/api/v1/auth/login` | none | `{email, password}` | `200` same `TokenResponse` |

Known error codes: `email_exists` (409), `invalid_credentials` (401).
Token is a signed JWT carrying `student_id` and `role`; the frontend sends `Authorization: Bearer <token>`.

### Documents — `backend/app/api/v1/documents.py`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/documents/upload` | bearer | multipart field name is **`files`** (repeated). Returns `202` `UploadBatchResponse` |
| GET | `/api/v1/documents?page&page_size` | bearer | `DocumentListResponse` (`items,page,page_size,total`), `page_size` max 100 |
| GET | `/api/v1/documents/{document_id}` | bearer | `DocumentDetailResponse` = document + `text_pages[]` |
| DELETE | `/api/v1/documents/{document_id}` | bearer | `204` |
| GET | `/api/v1/documents/{document_id}/text?page&page_size` | bearer | `TextListResponse` |
| GET | `/api/v1/jobs/{job_id}` | bearer | `JobResponse` (`total_files, completed_files, failed_files, status`) |
| POST | `/api/v1/jobs/{job_id}/retry` | bearer | `202`; `409 nothing_to_retry` when no failed docs |

Accepted extensions: `.pdf .docx .pptx .jpg .jpeg .png .tif .tiff .bmp`.
Upload errors observed in code: `no_files`, `too_many_files`, `unsupported_format`, `invalid_filename`,
`corrupt_file`, `empty_file`, `file_too_large` (413), `processing_queue_unavailable` (503).

`DocumentResponse` fields: `document_id, original_name, mime_type, size_bytes, page_count,
language_detected, status, error_message, created_at, processed_at`.
`status` ∈ `queued | processing | success | failed`.

### Learning engine — `backend/app/api/v1/learning.py`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/concepts?course={course_key}` | bearer | `Concept[]` — `concept_id, name, description, phase, confidence, extraction_method, evidence` |
| GET | `/api/v1/concepts/{concept_id}/prerequisites` | bearer | edges — `concept_id, name, confidence, evidence, approved` |
| POST | `/api/v1/diagnostic/start` | bearer | body `{course_key, max_questions 3..30}`; `201`; `409 diagnostic_unavailable` when < 3 source questions |
| POST | `/api/v1/diagnostic/{session_id}/answer` | bearer | body `{question_id, selected_index}`; returns `{correct, mastery_percent, evidence, status, question}` |
| GET | `/api/v1/diagnostic/{session_id}/result` | bearer | `{session_id, status, answered, total, answers[]}` |
| GET | `/api/v1/mastery/{student_id}` | bearer | mastery states; 403-equivalent if `student_id` ≠ caller |
| GET | `/api/v1/mastery/{student_id}/concept/{concept_id}` | bearer | one state + BKT parameters |
| POST | `/api/v1/path/generate` | bearer | body `{course_key}`; `201` |
| GET | `/api/v1/path/current` | bearer | latest active path + ordered steps |
| GET | `/api/v1/path/why/{concept_id}` | bearer | persisted reason + evidence for one recommendation |

Diagnostic questions are returned **without** the correct answer (`_question_payload` strips
`correct_index`), so the quiz UI must submit and read `correct` from the answer response.

## Error contract (stable, from `main.py` + `services/api_errors.py`)

```json
{ "error": "machine_code", "message": "English / Roman Urdu", "file": "optional.pdf", "details": {} }
```

Validation failures return `422` with `{"error":"validation_error", "details":{"fields":[...]}}`.
Messages are already bilingual English / Roman Urdu separated by ` / ` — the frontend splits on that
separator and shows the half matching the active UI language (see `src/api/errors.ts`).

## Endpoints the frontend needs that DO NOT exist yet

These are required by pages in the 8-hour deliverable list. Agent 2 does **not** implement them
(backend is Agent 1's domain) and does **not** fake them. Each page renders a labelled
"pending backend" panel naming the exact endpoint. Full request/response proposals are in
`docs/frontend/CHANGES_NEEDED.md`.

| Needed by | Proposed endpoint |
| --- | --- |
| Tutor chat (Socratic) | `POST /api/v1/tutor/message`, `GET /api/v1/tutor/sessions/{id}` |
| Adaptive practice quiz | `POST /api/v1/quiz/next`, `POST /api/v1/quiz/answer` |
| Explain-back grading | `POST /api/v1/explain/grade` |
| Study planner | `GET/POST /api/v1/planner/schedule` |
| Catch-up plan | `POST /api/v1/planner/catchup` |
| Mock exam | `POST /api/v1/exam/start`, `POST /api/v1/exam/{id}/submit` |
| Progress analytics history | `GET /api/v1/analytics/mastery-history` |
| Realtime job updates | `WS /api/v1/ws/jobs/{job_id}` (frontend falls back to polling today) |

## Overlap warning: `frontend/`

Agent 1's branch also contains a single-file frontend scaffold (`frontend/src/main.tsx`, ~5 very long
lines, auth + upload only). The task assignment gives `frontend/` to Agent 2. Agent 2's tree
supersedes it. Merge guidance is in `docs/frontend/CHANGES_NEEDED.md` — take **Agent 2's** version of
every file under `frontend/`; nothing in Agent 1's scaffold is lost because every capability it had
(auth, upload, document list, language toggle) exists here with tests.
