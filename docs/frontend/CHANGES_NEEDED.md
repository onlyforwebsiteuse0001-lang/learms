# Changes needed from Agent 1 (backend)

Agent 2 owns `frontend/`, `content/`, `docs/frontend/`, `docs/content/`, `tests/frontend/`
and `scripts/content/`, and does not write to backend code or shared files. Everything the
frontend needs but cannot implement itself is listed here.

Nothing in this file is a blocker for reviewing the frontend: every item below already has
a complete UI that calls the real URL and renders a labelled "waiting on the backend"
panel when the route answers 404.

---

## 1. Endpoints the UI already calls that do not exist

Each of these is built, wired and tested. The client recognises a 404 on these prefixes as
`not_implemented` (rather than "no such record") and the page says so explicitly.

| # | Method & path | Used by | Request | Response |
|---|---|---|---|---|
| 1 | `POST /api/v1/tutor/message` | Socratic tutor (`/tutor`) | `{course_key, message, concept_id?, session_id?}` | `{session_id, turns: [{role:'student'\|'tutor', content, hint_level?, concept_id?, created_at?}]}` |
| 2 | `POST /api/v1/quiz/next` | Adaptive practice (`/quiz`) | `{course_key}` | `{item_id, concept_id, concept_name, prompt, options[], difficulty, selection_reason?}` |
| 3 | `POST /api/v1/quiz/answer` | Adaptive practice | `{item_id, selected_index}` | `{correct, mastery_percent, explanation, evidence}` |
| 4 | `POST /api/v1/explain/grade` | Explain-back (`/explain`) | `{concept_id, explanation}` | `{coverage_percent, covered_points[], missing_points[], misconceptions[], next_action}` |
| 5 | `POST /api/v1/planner/schedule` | Study planner (`/planner`) | `{course_key, deadline, hours_per_week}` | `{generated_at, deadline, hours_per_week, blocks[{date, concept_id, concept_name, minutes, activity}], at_risk[]}` |
| 6 | `POST /api/v1/planner/catchup` | Catch-up plan (`/catchup`) | same as 5 | same as 5 |
| 7 | `POST /api/v1/exam/start` | Mock exam (`/exam`) | `{course_key, duration_minutes}` | `{exam_id, duration_minutes, total_marks, questions[{question_id, prompt, options[], marks, concept_id}]}` |
| 8 | `POST /api/v1/exam/{exam_id}/submit` | Mock exam | `{answers:[{question_id, selected_index}]}` | `{exam_id, score, total_marks, per_concept[{concept_id, concept_name, score, total}]}` |
| 9 | `GET /api/v1/analytics/mastery-history` | Analytics trend | — | `[{date, average_mastery, concepts_measured}]` |

**Security note on 1–8:** `question.correct_index` must be stripped server-side, the way
`GET /api/v1/diagnostic/...` already does. A client-side answer key is not a feature flag,
it is the answer key.

The exact TypeScript shapes are in `frontend/src/api/types.ts`, under the heading
`PROPOSED (not deployed)`. They are a proposal, not a demand — if the real design differs,
change the types and the pages follow.

---

## 2. WebSocket for job progress (optional)

`WS /api/v1/ws/jobs/{job_id}`

Document processing progress currently works by polling `GET /api/v1/jobs/{job_id}` every
2s, slowing to 10s after 30s and giving up after 15 minutes. That is implemented, tested
and is the default.

A WebSocket implementation also exists behind `VITE_ENABLE_WS=true` (default `false`). It
has never been run against a live server, and is labelled as unverified in
`docs/frontend/INTEGRATION_GUIDE.md`. If you build the socket:

- push the same `JobRecord` JSON the REST endpoint returns, on every state change;
- a browser cannot set an `Authorization` header on a WebSocket, so the client sends
  `{"type":"auth","token":"<jwt>"}` as its first frame — reject the connection if that
  frame does not arrive or does not validate;
- close the socket when the job reaches a terminal state.

If you would rather not build it, say so and the flag and its code can be deleted. Polling
is adequate for this workload.

---

## 3. Small gaps in deployed endpoints

**3.1 — There is no way to list a student's courses.**
`course_key` is free text chosen at upload time, and concepts, diagnostics and paths are
all scoped by it. With no `GET /api/v1/courses`, the UI cannot offer a picker; it uses a
text input that remembers previously used keys locally. A student on a new device has to
remember and retype the key exactly.

Suggested: `GET /api/v1/courses` → `[{course_key, document_count, concept_count, last_used}]`.

**3.2 — `GET /api/v1/mastery/{student_id}` does not always include `name`.**
The UI falls back to showing the raw `concept_id`, which is not readable. Including `name`
on every row would remove a per-concept lookup and a bad-looking fallback.

**3.3 — No pagination metadata on `GET /api/v1/concepts`.**
It returns a plain array. Fine at current sizes; a course with several hundred concepts
would need `Paginated<Concept>` like the documents endpoints already use.

---

## 4. Shared files Agent 2 did not modify

Per the working agreement these were left alone; each is a request, not an edit.

**`backend/app/main.py`** — CORS currently allows `settings.cors_origin_list`. For the
Arena live preview the frontend is served from `https://{port}-{sandbox}.e2b.app`. No
change is strictly required because the browser always talks to a same-origin `/api` path
(Vite proxies in dev, nginx proxies in production), but if you ever serve the API from a
different origin, that host needs adding.

**`docker-compose.yml`** — there is no `frontend` service. A working one:

```yaml
  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on: [backend]
    environment:
      - VITE_API_BASE_URL=
```

`frontend/Dockerfile` and `frontend/nginx.conf` already exist and expect exactly this:
nginx serves the static build and proxies `/api` to `http://backend:8000`.

**`README.md`** — no frontend section. Suggested addition is in
`docs/frontend/README.md`, which can be linked or inlined.

---

## 5. Things Agent 2 fixed on its own side (no action needed)

Recorded so they are not re-introduced:

- The scaffold's upload progress bar animated on a `setInterval` timer regardless of
  actual transfer. It now uses `XMLHttpRequest.upload.onprogress`, and shows an
  indeterminate bar when `lengthComputable` is false instead of inventing a percentage.
- `frontend/src/main.tsx` from the scaffold was replaced wholesale (decision D-002).
