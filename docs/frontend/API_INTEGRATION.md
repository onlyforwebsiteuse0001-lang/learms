# API integration

How the frontend talks to Agent 1's FastAPI service: one client, one error type, one
retry policy, one place that knows about authentication.

Source: `frontend/src/api/{client,endpoints,types,errors,upload,realtime}.ts`.

---

## 1. URLs are always relative

```ts
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
export const apiUrl = (path: string) => `${BASE_URL}${path}`;
```

`VITE_API_BASE_URL` is empty in every normal deployment, so every request goes to a
same-origin `/api/...` path. Vite proxies it in development, nginx proxies it in
production. Nothing under `src/` ever names a host.

This is not a style preference. Hardcoding `http://localhost:8000` breaks the Arena live
preview (the browser is not inside the sandbox), breaks Docker (the container is not the
browser's localhost) and breaks any HTTPS page with a mixed-content error.

---

## 2. One request function

```ts
request<T>(path, {
  method  = 'GET',
  body,          // serialised as JSON when present
  query,         // undefined/null entries are dropped
  signal,        // caller's AbortSignal
  timeoutMs = 20_000,
  auth = true,   // false for /api/health and the auth routes
  retryable,     // defaults to `method === 'GET'`
}): Promise<T>
```

Thin wrappers: `api.get`, `api.post`, `api.del`.

Behaviour worth knowing:

- **204** returns `undefined` rather than trying to parse an empty body.
- Each retry attempt gets its **own `AbortController`**, so an aborted attempt cannot
  poison the next one. The caller's signal is forwarded to whichever attempt is live.
- A non-JSON error body (an nginx HTML 502) is detected from `Content-Type` and mapped to
  a `bad_gateway` error. Calling `.json()` blindly is the classic way a frontend turns a
  502 into an unhandled `SyntaxError`.

### Endpoint functions, not URL strings

`src/api/endpoints.ts` has one function per route and is the only file containing URL
literals. Pages call `documentsApi.list()`, never `fetch('/api/v1/documents')`. A contract
change is a one-line edit in one file.

The file is split into `DEPLOYED` (read from Agent 1's committed source) and `PROPOSED`
(no implementation exists).

---

## 3. Errors

Agent 1's `main.py` serialises expected errors as:

```json
{ "error": "code", "message": "English / Roman Urdu", "file": "notes.pdf", "details": {} }
```

and validation failures as:

```json
{ "error": "validation_error",
  "message": "Request data is invalid. / Request data durust nahi hai.",
  "details": { "fields": ["body.email", "body.password"] } }
```

Plenty of failures never reach FastAPI at all — DNS failure, an aborted request, an nginx
502. Every one of them is normalised into a single `ApiError`:

```ts
class ApiError extends Error {
  status: number;             // 0 for transport-level failures
  code: string;               // backend's `error`, or a local code
  file?: string;
  details: Record<string, unknown>;
  messageKey?: MessageKey;    // set only for locally-generated errors

  get isAuth()            // 401 or 403
  get isNotImplemented()  // the route is not deployed
  get isValidation()      // 422, or code === 'validation_error'
  get isRetryable()       // network_error | timeout | 502 | 503 | 504
  get fieldErrors()       // ['email', 'password'] — the `body.` prefix stripped
}
```

No call site ever has to guess whether `err.response.data.message` exists.

### Bilingual messages

Agent 1 writes user-facing text as `"English / Roman Urdu"` in one string.
`localizeBackendMessage(message, locale)` splits on `" / "` and shows the half matching
the active language. It only splits when there are exactly two parts, so
`"Rate limit 10/minute exceeded"` survives intact.

### Which message wins

`useApiErrorMessage()` resolves in this order:

1. A local translation key — network, timeout, 5xx. Those never came from the API.
2. The backend's own message, localised. Agent 1 writes genuinely useful domain-specific
   text there; replacing it with a generic "Request failed" throws away the best part of
   the response.
3. A generic fallback.

### `not_implemented`

A 404 under any of these prefixes is converted to `code: 'not_implemented'`:

```
/api/v1/tutor  /api/v1/quiz  /api/v1/explain
/api/v1/planner  /api/v1/exam  /api/v1/analytics
```

A 404 there means "not built yet", not "no such record", and the distinction is what lets
a page render an honest pending panel instead of a misleading error. A 404 on a deployed
route (`/api/v1/documents/xyz`) stays an ordinary not-found.

---

## 4. Retries

Automatic retry applies only when `retryable` is true, which defaults to GET.

- Max 2 retries (3 attempts total).
- Delay `300 × 2^attempt` ms, multiplied by random jitter in `0.7–1.3`, so a fleet of
  clients recovering from an outage does not synchronise into a thundering herd.
- Only `network_error`, `timeout`, 502, 503 and 504 are retried.

4xx is never retried: re-sending a rejected upload just burns a student's mobile data, and
re-sending a write could duplicate it. `jobsApi.retry` opts in explicitly with
`retryable: false` — it is idempotent server-side but a duplicate requeue is still noise.

---

## 5. Authentication

JWT in `localStorage` under `haafiz.token` (`haafiz.student_id`, `haafiz.name` alongside).

The client never imports the auth store — that would be a cycle. `wireAuthToClient()`,
called once from `main.tsx`, injects two callbacks:

```ts
configureClient({
  getToken: () => { /* null if missing or locally expired */ },
  onUnauthorized: () => useAuthStore.getState().logout('expired'),
});
```

**Local expiry check.** `isTokenExpired` decodes the `exp` claim — signature unverified,
because a browser has no secret and could not verify it meaningfully anyway. It is used
*only* to avoid sending a token we already know is stale, with 30 seconds of clock skew so
an in-flight request does not land just after expiry. Every authorisation decision stays
on the server. An unparseable token is treated as expired, which fails closed.

**Server 401.** One handler kills the session. Without it, an expired token leaves every
page rendering its own 401 error instead of returning the student to sign-in. The store
distinguishes `logout('expired')` from `logout('user')` so the login page can explain what
happened rather than silently appearing.

`localStorage` throwing (private browsing, sandboxed iframe) is caught everywhere: the
session still works, it just does not survive a reload.

---

## 6. Uploads

Uploads use `XMLHttpRequest`, not `fetch` — browsers still have no request-body streaming
progress, so `fetch` cannot report upload progress at all. `xhr.upload.onprogress` reports
real transferred bytes.

```ts
const { promise, abort } = uploadDocuments(files, { token, onProgress });
```

- Field name is **`files`**, repeated — matching
  `upload_documents(files: list[UploadFile] = File(...))`. Anything else is a 422.
- `Content-Type` is deliberately **not** set, so the browser adds the multipart boundary.
- Timeout is 10 minutes: a large scan on a slow connection legitimately takes minutes.
- When `lengthComputable` is false, `percent` is `null` and the UI shows an indeterminate
  bar rather than inventing a number.

`validateFiles(incoming, existing)` pre-checks client-side, mirroring the server rules
(`.pdf .docx .pptx .jpg .jpeg .png .tif .tiff .bmp`, ≤50 MB, ≤10 files). It exists to stop
a student on a metered connection uploading 50 MB the server will reject — it does not
replace server validation, which stays authoritative and is always surfaced. Rejections
are reported individually by file name; a silent drop looks like the app lost the file.

---

## 7. Job progress

`watchJob(jobId, listener, token)` returns an unsubscribe that is always safe to call
twice. Events:

```ts
{ type: 'update', job, transport }   // still running
{ type: 'done',   job, transport }   // terminal: success | failed | partial | complete
{ type: 'error',  error }            // transient; the watch continues
```

**Polling** is the default and the only transport verified against the real contract:
every 2s, dropping to 10s after 30s, giving up after 15 minutes, and pausing while the tab
is hidden (a backgrounded tab must not keep hammering the API). A transient network blip
emits an error event but keeps watching; a 401 or 404 stops it, because neither resolves
itself.

**WebSocket** (`VITE_ENABLE_WS=true`) connects to `/api/v1/ws/jobs/{id}`, falls back to
polling if the socket does not open within 4 seconds or closes, and authenticates by
sending `{type:'auth', token}` as its first frame — a browser cannot set headers on a
WebSocket. **This has never run against a live server.** The endpoint does not exist; see
`docs/frontend/CHANGES_NEEDED.md`.

---

## 8. Loading, empty and error states

`useAsync(loader, deps, { enabled })` models the four states explicitly — `idle`,
`loading`, `ready`, `error` — and `<AsyncState>` renders them. Everything that loads data
goes through that pair.

Two consequences that matter:

- A page can never show a confident-looking `0` while a request is in flight. "0 concepts"
  reads as an answer, not as an unfinished load.
- `isInitialLoad` is false on a refresh, so re-fetching does not flash a skeleton over
  data that is already on screen.
- An abort is never surfaced as an error. Navigating away is not a failure.

---

## 9. Testing the integration

MSW intercepts at the network layer; `fetch` is never stubbed, so the real client runs.
`onUnhandledRequest: 'error'` means any URL without a declared handler fails the test
loudly, which keeps `src/test/mocks/handlers.ts` honest as a description of the contract.

The proposed endpoints are declared in the handlers as **404s**, exactly as the real server
answers today. That is what lets a test assert the pending panel instead of a mocked
feature that does not exist.
