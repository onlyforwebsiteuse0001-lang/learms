# CONTEXT-2 — Agent 2 handover

Everything a person (or another agent) needs to pick this up cold.

---

## Scope

Agent 2 owns, and only touched:

```
frontend/  content/  docs/frontend/  docs/content/  tests/frontend/  tests/content/  scripts/content/
```

Backend code, `backend/app/models/`, migrations and the shared files
(`backend/app/main.py`, `core/config.py`, `database.py`, `docker-compose.yml`, root
`README.md`) were **read but never written**. Everything Agent 2 needs from them is in
`docs/frontend/CHANGES_NEEDED.md`.

Branch: `arena/01a0f445-learms`. The brief asked for `arena/frontend-content`; the session
tooling pins the branch name and it cannot be changed from inside. Logged as B-001 in
`docs/frontend/BLOCKERS-2.md`.

---

## The five rules that shaped the code

1. **No fake outputs.** Real UI or a clearly labelled placeholder, nothing in between.
   This is why six pages render a "waiting on the backend" panel naming the exact missing
   endpoint, why 48 content categories are shown as "coming soon" rather than filled, why
   the AI generator exits non-zero without an API key, and why the mock API announces
   itself four different ways.
2. **Honest reporting.** `docs/frontend/MORNING_REPORT-2.md` lists what does not work as
   plainly as what does.
3. **Test as you build.** 297 frontend tests, 36 content tests, thresholds enforced in
   config.
4. **Autonomous.** Every judgement call is logged in `docs/frontend/DECISIONS-2.md`
   (D-001 … D-015).
5. **Checkpoint often.** Commits are small and described.

---

## Map of the code

### `frontend/src/api/` — everything that touches the network

| File | Responsibility |
|---|---|
| `client.ts` | One `request()`. Relative URLs, retry with jitter, per-attempt AbortController, 401 → logout, `not_implemented` mapping |
| `endpoints.ts` | One function per route; the only file with URL literals. Split `DEPLOYED` / `PROPOSED` |
| `types.ts` | TypeScript mirrors of Agent 1's Pydantic schemas, copied field-for-field |
| `errors.ts` | `ApiError` + bilingual message splitting |
| `upload.ts` | XHR multipart upload with real progress; `validateFiles`; `buildUploadForm` |
| `realtime.ts` | `watchJob` — polling (default, tested) and WebSocket (flagged, unverified) |

### `frontend/src/` — the rest

- `store/auth.ts` — JWT, local `exp` check, `wireAuthToClient()`
- `store/ui.ts` — toasts and connectivity
- `hooks/useAsync.ts` — idle/loading/ready/error, abort-safe
- `components/ui/AsyncState.tsx` — the one place those four states are rendered
- `components/graph/ConceptGraph.tsx` — layered DAG layout, cycle-tolerant
- `components/charts/` — bespoke SVG
- `i18n/` — `en` is the reference dictionary; the others are type-checked against it
- `pages/` — one file per route; `pages/pending/` are complete UIs awaiting an endpoint
- `content/loader.ts` — fetches the static library, with a "run the sync script" error
- `test/` — setup, MSW handlers, `harness.tsx` for out-of-root tests, `fakeXhr.ts`

### `scripts/content/`

`curated/` (hand-written source of record) → `build_library.py` → `content/*.json` →
`sync_to_frontend.py` → `frontend/public/content/`. `validate_content.py` checks the JSON
independently of the Python. `generate_syllabus.py` is the AI path and refuses to run
without a key.

---

## Things that will bite you

**`frontend/public/content/` is generated and gitignored.** A Vite build without it warns
and the Library page breaks. `predev` / `prebuild` / `pretest` run the sync for you; if
you invoke `vite build` directly, run `npm run sync:content` first.

**Agent 1's error envelope is not FastAPI's default.** It is
`{error, message, file?, details?}` with 422 field paths in `details.fields` — not
`{detail: …}`. Both the mock server and the MSW handlers were written wrong first and
corrected; do not "fix" them back.

**Do not edit `content/` by hand.** It is generated. Edit `scripts/content/curated/*.py`
and rebuild. `build_library.py --check` fails in CI if the two drift.

**Tests in `tests/frontend/` import through `src/test/harness.tsx`,** not directly from
`msw` or `@testing-library/*` — those bare specifiers do not resolve from outside the Vite
root. If you add a package to a test there, re-export it from the harness.

**Uploads are XHR, not fetch,** because fetch cannot report upload progress. MSW cannot
intercept a jsdom multipart XHR, so `src/test/fakeXhr.ts` doubles the transport in those
tests only.

**`localStorage` keys in use:** `haafiz.token`, `haafiz.student_id`, `haafiz.name`,
`haafiz.locale`, `haafiz.course_key`, `haafiz.recent_courses`.

---

## Running it

```bash
cd frontend && npm install

# with the mock backend — no database, no Python, nothing else needed
npm run mock:api
VITE_DEMO_MODE=true VITE_DEV_API_TARGET=http://localhost:8000 npm run dev

# against the real backend
VITE_DEV_API_TARGET=http://localhost:8000 npm run dev

npm test && npm run test:coverage
cd .. && python3 -m unittest discover -s tests/content
```

---

## What is finished and what is not

Deployed-endpoint pages — dashboard, upload, documents, concepts, mastery, path,
diagnostic, analytics — are complete and tested end to end against contract mocks.
The library page is complete and needs no backend at all.

Six pages (tutor, adaptive quiz, explain-back, planner, catch-up, mock exam) and the
analytics trend chart are complete UIs with no endpoint behind them. They call the real
URL and render a labelled panel on 404. Wiring them up is a backend task, not a frontend
one — the request/response shapes are already written down in `CHANGES_NEEDED.md` and
already exercised by tests in `tests/frontend/deep-coverage.integration.test.tsx`.

The full, blunt list of limitations is in `docs/frontend/MORNING_REPORT-2.md`.

---

## Where to look for the "why"

| Question | File |
|---|---|
| Why this stack, why no UI library, why this auth model | `docs/frontend/DECISIONS-2.md` |
| What is blocked and on whom | `docs/frontend/BLOCKERS-2.md` |
| What the backend still owes | `docs/frontend/CHANGES_NEEDED.md` |
| How the client works | `docs/frontend/API_INTEGRATION.md` |
| How to wire the two halves together | `docs/frontend/INTEGRATION_GUIDE.md` |
| Tokens, components, RTL, accessibility | `docs/frontend/UI_GUIDE.md` |
| The content library and its scripts | `docs/content/README.md` |
| Backend contract as Agent 2 read it | `docs/frontend/AGENT_1_INTERFACE.md` |
| Honest status | `docs/frontend/MORNING_REPORT-2.md` |
