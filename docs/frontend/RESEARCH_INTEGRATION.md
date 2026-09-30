# Research — integration layer (Agent 2, Phase 0)

Date: 2026-09-30.

## 1. Same-origin, always

Agent 1's `nginx.conf` proxies `/api/` → `http://backend:8000/api/` and `vite.config.ts` proxies the
same path in dev. Consequences the client is built around:

- **Every request uses a relative URL.** No `VITE_API_BASE_URL` pointing at an absolute host in the
  default path. Hardcoding `http://localhost:8000` breaks the Arena preview (the user's browser is not
  the sandbox), breaks the Docker topology, and breaks HTTPS deployments via mixed content.
- CORS never fires in normal operation. Agent 1 still configures `CORSMiddleware` from
  `settings.cors_origin_list` as a fallback for split deployments; the client does not depend on it.
- An override (`VITE_API_BASE_URL`) exists for the one legitimate case — pointing a local frontend at a
  remote API — and is documented as non-default.

## 2. JWT handling

Agent 1 issues a bearer JWT with `student_id` and `role`. Decisions:

- **Storage: `localStorage`.** `httpOnly` cookies are strictly better against XSS, but the backend
  issues a bearer token in a JSON body and has no refresh/cookie endpoint. Inventing a cookie flow the
  server does not implement would be a fake integration. The limitation is recorded in
  `DECISIONS-2.md` D-004 and `CHANGES_NEEDED.md` as a real security follow-up, not hidden.
- The client **decodes the JWT payload locally only to read `exp`** and pre-emptively log out. It never
  trusts any claim for authorisation — that is the server's job. Signature is not verified client-side
  because a client cannot meaningfully do so.
- A single `401` interceptor clears the session and redirects to `/login?next=…`, so an expired token
  cannot leave the UI in a half-authenticated state.

## 3. Error handling

Agent 1's error envelope is stable and bilingual:

```json
{"error":"code","message":"English / Roman Urdu","file":"x.pdf","details":{}}
```

The client normalises **everything** into one `ApiError { status, code, message, file, details }`:

| Real-world failure | Normalised |
| --- | --- |
| Backend `APIError` JSON | parsed as-is |
| `422` validation | `code: validation_error`, `details.fields[]` mapped to form fields |
| HTML error page from nginx | `code: bad_gateway` — parsing JSON that isn't JSON is a classic crash |
| `fetch` rejects (offline/DNS) | `code: network_error` |
| `AbortError` from timeout | `code: timeout` |
| Endpoint not deployed (404 on a planned route) | `code: not_implemented` → renders the "pending backend" panel |

The bilingual `message` is split on ` / ` and the half matching the active UI language is shown; if the
separator is absent the whole string is shown. Machine `code` drives logic, `message` is only ever
displayed.

**Retry policy:** idempotent `GET` only, max 2 retries, exponential backoff with jitter, and only for
`network_error`/`timeout`/`502`/`503`/`504`. Retrying a `POST /documents/upload` would duplicate a
student's files, so writes are never auto-retried.

## 4. File upload

`fetch` cannot report upload progress — there is no `ReadableStream` request-progress in browsers
today. The upload client therefore uses **`XMLHttpRequest`**, whose `upload.onprogress` gives real
byte counts, wrapped in a promise.

This matters for honesty: Agent 1's scaffold animated a fake progress bar on a timer
(`setInterval(... Math.min(value+7, 88))`). That is a fabricated output. The replacement reports
`event.loaded / event.total`, and when `lengthComputable` is false it shows an indeterminate bar
instead of inventing a number.

Client-side pre-validation mirrors the server (extension allow-list, per-file size, max file count) so
a 50 MB file is rejected before it is uploaded — but the server remains the authority and its rejection
is always surfaced.

## 5. Realtime

Agent 1 has **no WebSocket endpoint**. Document processing is a Celery job whose progress lives in
`GET /api/v1/jobs/{job_id}`.

Implementation: a `JobProgress` abstraction with two transports.
1. **WebSocket** `/api/v1/ws/jobs/{job_id}` — implemented client-side, tried first only when
   `VITE_ENABLE_WS=true` (default **false**, because the endpoint does not exist).
2. **Polling** — the default. 2 s interval, backing off to 10 s after 30 s, hard stop at a terminal
   status, and `document.visibilityState` aware so a backgrounded tab stops hammering the API.

Both transports emit the same events, so when Agent 1 ships the socket it is a one-flag change. The
WebSocket path is labelled "not verified against a live server" in `INTEGRATION_GUIDE.md`.

## 6. Loading, empty, error — three distinct states

Every data view implements four states explicitly: `loading` (skeleton matching final layout, no
spinner-in-the-void), `empty` (what to do next, with the action), `error` (what failed + retry), and
`ready`. A shared `<AsyncState>` component enforces this so no page can accidentally render "0
concepts" while still loading — which reads as a wrong answer rather than an unfinished one.

## 7. Contract testing

MSW handlers in `src/test/mocks/handlers.ts` are written from the **observed** Agent 1 source, with the
exact field names and status codes. `tests/frontend/` then exercises whole flows (login → upload →
poll → dashboard) against them. When the branches merge these handlers become the diff that shows if
the contract drifted.
