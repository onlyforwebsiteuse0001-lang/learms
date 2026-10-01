# Integration guide

Getting the frontend and Agent 1's backend talking, and what to check when they do not.

For the design of the client itself see `docs/frontend/API_INTEGRATION.md`.

---

## 1. The shape of it

```
browser ──/api/*──▶ Vite dev server ──proxy──▶ backend:8000     (development)
browser ──/api/*──▶ nginx (frontend image) ──proxy──▶ backend:8000  (production)
```

The browser is always same-origin with whatever serves the HTML. That single decision is
what makes the app work unchanged in local dev, in Docker, behind the Arena preview proxy
and over HTTPS.

The dev proxy target is `VITE_DEV_API_TARGET` (default `http://backend:8000`, the
docker-compose service name). The production proxy target is in `frontend/nginx.conf`.

---

## 2. Three ways to run it

### A. Against the real backend, everything local

```bash
# terminal 1 — backend (Agent 1's instructions)
docker compose up -d db redis
uvicorn backend.app.main:app --reload --port 8000

# terminal 2 — frontend
cd frontend
VITE_DEV_API_TARGET=http://localhost:8000 npm run dev
```

Check the wiring before anything else:

```bash
curl -s localhost:3000/api/health
# {"status":"ok","service":"haafiz-api",...}
```

If `service` is `haafiz-api` you are talking to the real backend. If it is
`haafiz-mock-api` you are on the mock.

### B. Against the mock API — no backend, no database

```bash
cd frontend
npm run mock:api                                                           # terminal 1
VITE_DEMO_MODE=true VITE_DEV_API_TARGET=http://localhost:8000 npm run dev  # terminal 2
```

`mock-server/server.mjs` implements Agent 1's **deployed** contract — same paths, same
field names, same status codes, same `{error, message, file, details}` error envelope —
and deliberately 404s everything he has not built. State is in memory and dies with the
process.

It is labelled as a mock in four places at once, so nobody can mistake it for real:

- every response carries `X-Haafiz-Mock: 1`;
- `GET /api/health` reports `service: "haafiz-mock-api"`;
- `VITE_DEMO_MODE=true` puts a permanent banner on every page;
- the tutor, quiz, explain, planner and exam routes return 404, so the UI shows the same
  pending panels it shows against the real server.

Its concept graph is read from `public/content/it_computing/programming_fundamentals.json`
— the real curated library, not invented concepts. Log in with any email and any password
of 8+ characters.

What you can exercise end to end: register/login, upload with real progress and a
simulated extraction job (one in six files "fails" so the retry path is reachable),
document list and extracted text, concept list and prerequisite graph, a diagnostic that
actually moves the mastery numbers, mastery detail, and path generation.

### C. Full docker-compose

`docker-compose.yml` has no `frontend` service yet — Agent 2 does not edit shared files.
The snippet to add is in `docs/frontend/CHANGES_NEEDED.md` §4. `frontend/Dockerfile` and
`frontend/nginx.conf` are ready for it.

---

## 3. Contract checklist

Read from Agent 1's committed source and mirrored in `frontend/src/api/types.ts`. If any
of these drift, the frontend breaks in the corresponding place.

| Area | What the frontend depends on |
|---|---|
| Auth | `POST /api/v1/auth/{register,login}` → `{access_token, token_type, student_id}`; bearer token in `Authorization` |
| Errors | `{error, message, file?, details?}`; 422 uses `details.fields: ["body.email", …]`; messages are `"English / Roman Urdu"` |
| Upload | `POST /api/v1/documents/upload`, multipart field **`files`** (repeated), 202 → `{job_id, status, files[], message}` |
| Jobs | `GET /api/v1/jobs/{id}` → `JobRecord`; terminal statuses `success \| failed \| partial \| complete` |
| Documents | `GET /api/v1/documents` → `{items, page, page_size, total}`; `GET /{id}` includes `text_pages` |
| Concepts | `GET /api/v1/concepts?course=…` → plain array; `GET /api/v1/concepts/{id}/prerequisites` → edge array |
| Diagnostic | `start` → 201 `{session_id, status, total_questions, question}`; `answer` → `{correct, mastery_percent, evidence, status, question}`; `correct_index` never sent |
| Mastery | `GET /api/v1/mastery/{student_id}` → array; `/concept/{id}` adds `p_learn`, `p_slip`, `p_guess` |
| Path | `current` → `{path_id, course_key, status, steps[]}`; `why/{id}` → `{concept_id, name, reason, evidence, position}` |

The MSW handlers in `frontend/src/test/mocks/handlers.ts` are written from the same
source. If the backend changes, those tests fail first — which is the point of writing
them as contract mocks rather than as convenient fixtures.

---

## 4. Troubleshooting

**Blank page, console shows "Blocked request. This host is not allowed."**
Vite 6 rejects unknown `Host` headers. `vite.config.ts` allows `.e2b.app`, `localhost` and
`127.0.0.1`. Add your host to `server.allowedHosts`.

**Every API call is a 404 returning HTML.**
The proxy is not running or is pointed somewhere wrong. `curl localhost:3000/api/health`
— if that returns the Vite index page, `VITE_DEV_API_TARGET` is unreachable.

**Every API call is 401 and you keep landing on the login page.**
Either the token expired (the client logs out locally 30s before `exp`) or the backend's
`SECRET_KEY` changed and invalidated it. Clear `haafiz.token` and sign in again.

**CORS errors.**
You should not see any: the browser is same-origin. If you do, something is calling an
absolute URL — check whether `VITE_API_BASE_URL` is set.

**Uploads 422 with "field required".**
The multipart field name must be `files`. `buildUploadForm` in `src/api/upload.ts` is the
single place that sets it, and a unit test asserts it.

**The library page says content is missing.**
`frontend/public/content/` is generated and gitignored. Run `npm run sync:content` (the
`predev` / `prebuild` / `pretest` hooks normally do it for you).

**A page shows "Waiting on the backend".**
Working as intended — that endpoint is not deployed. See `CHANGES_NEEDED.md`.

**A page shows data that looks made up.**
It is not. Nothing in this frontend fabricates data; if a number is on screen it came from
the API, from the committed content library, or from arithmetic over one of those. If the
demo banner is visible, the source is the local mock.

---

## 5. WebSocket transport — unverified

`VITE_ENABLE_WS=true` switches job progress from polling to
`WS /api/v1/ws/jobs/{job_id}`.

**This has never been run against a live server, because the endpoint does not exist.**
The code is written against the proposed contract in `CHANGES_NEEDED.md` §2 and falls back
to polling if the socket does not open within 4 seconds. Leave the flag off until the
endpoint exists and someone has actually tested it.

Polling is the default, is tested, and is adequate for this workload.

---

## 6. Running the tests

```bash
cd frontend
npm test                 # 297 tests, ~40s
npm run test:coverage    # thresholds enforced: 80/80/70/80

cd ..
python3 -m unittest discover -s tests/content   # 36 content tests
```

The content tests validate the committed library as data (schema, enums, ranges,
cross-file prerequisite resolution, acyclicity, taxonomy/index agreement) and check that
the AI generator refuses to run without an API key.
