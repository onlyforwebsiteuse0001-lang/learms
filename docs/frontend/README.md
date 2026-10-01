# HAAFIZ EDU — frontend

React 18 + TypeScript + Vite. Pakistan-first personalised learning UI: upload your own
course material, get concepts extracted, measure mastery and follow a generated path.
English, Urdu (RTL) and Roman Urdu.

---

## Run it

Everything below assumes you are in `frontend/`.

```bash
npm install
npm run dev            # http://localhost:3000
```

`predev` runs `scripts/content/sync_to_frontend.py`, which copies the content library into
`public/content/`. That directory is gitignored and generated — do not edit it by hand.

### With a real backend

```bash
VITE_DEV_API_TARGET=http://localhost:8000 npm run dev
```

The browser always calls relative `/api/...` paths; Vite proxies them in development and
nginx proxies them in production. No source file ever names a host, which is what keeps
the app working behind a proxy, in Docker and over HTTPS.

### With the mock API (no backend needed)

```bash
npm run mock:api                                    # terminal 1, port 8000
VITE_DEMO_MODE=true VITE_DEV_API_TARGET=http://localhost:8000 npm run dev   # terminal 2
```

`VITE_DEMO_MODE=true` paints a permanent "DEMO MODE — data comes from the local mock API"
banner on every page. The mock implements Agent 1's deployed contract exactly and returns
404 for the endpoints he has not built, so the UI shows the same honest pending panels it
shows against the real server. See `mock-server/server.mjs`.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on `0.0.0.0:3000` |
| `npm run build` | `tsc -b` then `vite build` → `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` over `src/` and `../tests/frontend/` |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Coverage with thresholds (80/80/70/80) |
| `npm run sync:content` | Mirror `content/` into `public/content/` |
| `npm run mock:api` | Start the mock backend on port 8000 |

`predev`, `prebuild` and `pretest` all run `sync:content` first, so the content library is
never stale in a build.

---

## Environment

All variables are optional; the defaults are what you want locally and in Docker.

| Variable | Default | Meaning |
|---|---|---|
| `VITE_DEV_API_TARGET` | `http://backend:8000` | Where the **dev server** proxies `/api`. Not used in production. |
| `VITE_API_BASE_URL` | *(empty)* | Prefix for API calls. Empty means same-origin `/api`. Only set this for a split-origin deployment. |
| `VITE_ENABLE_WS` | `false` | Use the WebSocket job transport instead of polling. The socket does not exist server-side yet. |
| `VITE_DEMO_MODE` | `false` | Show the demo banner. Set it whenever you point the app at the mock API. |

Copy `.env.example` to `.env.local` to change them.

---

## Layout

```
frontend/
├─ mock-server/server.mjs     Contract double for the backend
├─ public/
│  ├─ icons/                  PWA icons
│  └─ content/                GENERATED — mirror of /content, gitignored
└─ src/
   ├─ api/         client, endpoints, types, errors, upload (XHR), realtime (poll/WS)
   ├─ components/  ui/ charts/ graph/ layout/
   ├─ content/     loader + types for the static library
   ├─ hooks/       useAsync, useApiErrorMessage
   ├─ i18n/        provider + en / ur / ur-Latn dictionaries
   ├─ pages/       one file per route; pages/pending/ are UIs awaiting an endpoint
   ├─ store/       auth + ui (zustand)
   ├─ styles/      tokens.css, rtl.css, global.css
   └─ test/        setup, MSW handlers, harness for out-of-root tests
```

Related reading:

- `docs/frontend/API_INTEGRATION.md` — the HTTP client, errors, retries, auth
- `docs/frontend/INTEGRATION_GUIDE.md` — wiring the frontend to the backend end to end
- `docs/frontend/UI_GUIDE.md` — design tokens, components, i18n, accessibility
- `docs/frontend/CHANGES_NEEDED.md` — what the backend still owes the frontend
- `docs/frontend/DECISIONS-2.md` — why things are the way they are
- `docs/content/README.md` — the content library and its scripts

---

## Routes

Public:

| Path | Page |
|---|---|
| `/login`, `/register` | Sign in / create account |

Authenticated (inside `RequireAuth` + `AppShell`). "Live" means it talks to a deployed
endpoint; "pending" means the UI is complete and the endpoint is not.

| Path | Page | State |
|---|---|---|
| `/` | Dashboard | live |
| `/upload` | Upload with drag-and-drop and real progress | live |
| `/documents` | Document list + extracted text | live |
| `/concepts` | Concept list and prerequisite graph | live |
| `/mastery` | Per-concept mastery with BKT parameters | live |
| `/path` | Learning path with "why this step" | live |
| `/diagnostic` | Diagnostic quiz | live |
| `/analytics` | Distribution and coverage charts | live (trend chart pending) |
| `/library` | Curated course library (static JSON) | live, no backend needed |
| `/tutor` | Socratic tutor chat | pending |
| `/quiz` | Adaptive practice | pending |
| `/explain` | Explain-back | pending |
| `/planner` | Study planner | pending |
| `/catchup` | Catch-up plan | pending |
| `/exam` | Mock exam | pending |

A pending page is a real, finished UI that calls the real URL. When the route 404s it
renders a panel naming the missing endpoint. It never shows invented data — see RULE 5 in
the project brief and `docs/frontend/DECISIONS-2.md` (D-006).

---

## Tests

```bash
npm test                # 297 tests
npm run test:coverage   # ~93% statements
```

Unit tests live beside the code (`src/**/*.test.ts[x]`); page-level integration tests live
in the repository-level `tests/frontend/`. Both run in the same Vitest project.

Network calls are intercepted by MSW at the transport layer — `fetch` is never stubbed, so
the real client runs, including its retry, timeout and error-mapping logic. The handlers
in `src/test/mocks/handlers.ts` reproduce Agent 1's contract, including his
`{error, message, file, details}` error envelope, so a backend contract change breaks a
test rather than a user.

One exception is documented in `src/test/fakeXhr.ts`: uploads use `XMLHttpRequest`, and a
`FormData` body containing a `File` never settles under MSW in jsdom. The transport is
doubled for those tests; the multipart body itself is asserted directly against
`buildUploadForm`.

---

## Production build

```bash
npm run build          # → dist/
docker build -t haafiz-frontend .
```

The image is nginx serving `dist/` with `/api` proxied to `http://backend:8000` (see
`nginx.conf`). `docker-compose.yml` does not yet have a `frontend` service — the snippet
to add is in `docs/frontend/CHANGES_NEEDED.md`.

The app is a PWA: the shell is precached and works offline, `registerType` is `prompt`
(never auto-reload, which would discard a half-finished quiz), and **no `/api/**` response
is ever cached** — caching one student's mastery data in a shared browser profile is a
privacy problem, not a performance win.
