# DECISIONS-2 — Agent 2 autonomous decisions

Format: decision, why, what was rejected, cost.

## D-001 — Vite + React + TypeScript (not Streamlit, not Next.js)
Agent 1 already committed `frontend/Dockerfile`, `frontend/nginx.conf`, `vite.config.ts` and a
`vite-plugin-pwa` dependency, and `docs/ARCHITECTURE.md` specifies "React PWA built to static assets,
served by Nginx". Streamlit would delete that topology (and cannot do PWA/offline/RTL/component
tests); Next.js would add a Node server for no benefit on a fully-authenticated dashboard.
Cost: more code than Streamlit. Accepted.

## D-002 — Supersede Agent 1's `frontend/src/main.tsx` scaffold
The task assignment gives `frontend/` to Agent 2. Agent 1's scaffold is one file of ~5 extremely long
lines covering auth + upload only. Rather than extend an unmaintainable file, `frontend/` was rebuilt
as a structured app. Every capability of the scaffold is preserved and tested.
Cost: a merge conflict on `frontend/**` when both PRs land. Resolution documented in CHANGES_NEEDED.md
(take Agent 2's side for all of `frontend/`).

## D-003 — Zero runtime UI dependencies beyond React/Router/Zustand
No Tailwind, no MUI, no chart library, no i18n library, no D3. Reasons: the concept graph and charts
are small, bespoke SVG; a CSS-token stylesheet with logical properties handles RTL better than a
utility framework needs a plugin to; and a smaller bundle matters on Pakistani mobile data.
Cost: hand-written chart primitives. Accepted — they are ~200 lines and fully tested.

## D-004 — JWT in `localStorage`
Agent 1 returns a bearer token in a JSON body and exposes no cookie/refresh endpoint. An `httpOnly`
cookie flow would have to be faked client-side. `localStorage` + a 401 interceptor + local `exp`
pre-expiry logout is the honest implementation of the contract that exists.
Cost: XSS-readable token. Logged as a real follow-up in CHANGES_NEEDED.md, not hidden.

## D-005 — Polling by default, WebSocket behind a flag
No WS endpoint exists. Polling is implemented, visibility-aware and backing off. The WS client is
written to the proposed contract but gated behind `VITE_ENABLE_WS` (default false) and labelled
unverified.
Cost: a few seconds of latency on job updates. Accepted over pretending a socket exists.

## D-006 — "Pending backend" panels instead of mock data on unbuilt features
Tutor, adaptive quiz, explain-back, planner, catch-up, mock exam and analytics-history have no
endpoints. Their UIs are fully built and wired, but when the endpoint 404s the page renders a panel
naming the exact missing endpoint. No invented scores, no lorem content.
Cost: those pages look unfinished until Agent 1 ships. That is the accurate state.

## D-007 — Hand-curated content library, AI generator shipped but not run
No LLM keys in the sandbox. The generator is complete and will refuse to run without a key rather than
fabricate. Shipped content is curated from HEC/NCEAC/PEC/PMDC/ACCA published curricula with `source`
recorded per course.
Cost: breadth is bounded by what could be curated accurately. Coverage is stated per field.

## D-008 — Urdu is real Urdu script, plus Roman Urdu kept
Agent 1's scaffold offered English + Roman Urdu. Real RTL support is a deliverable, so `ur` (Urdu
script, RTL) was added as a third locale. Roman Urdu (`ur-Latn`, LTR) is kept because Agent 1's
backend error messages are bilingual English/Roman Urdu.

## D-009 — `content/` ships as versioned JSON in Git
The files are small (tens of KB), are reviewable in a PR, and are configuration rather than data.
No build artefacts or datasets are committed.

## D-010 — Mock API server as a separate process, not MSW in the browser
A browser-side MSW worker would have meant shipping mock handlers inside the application bundle and
gating them on an env var — one mistake away from a build that serves fake data to a real student.
A standalone Node server (`frontend/mock-server/server.mjs`) cannot leak into production, and it
exercises the real network stack including the XHR upload path. It is labelled four ways at once:
`X-Haafiz-Mock: 1` on every response, `service: "haafiz-mock-api"` from `/api/health`, the
`VITE_DEMO_MODE` banner, and 404s on every endpoint Agent 1 has not built.
Cost: a second terminal. Accepted.

## D-011 — Mock and MSW reproduce Agent 1's real error envelope, not FastAPI's default
Both initially returned `{"detail": …}`, which is FastAPI's default but NOT what this backend sends:
`backend/app/main.py` serialises `{"error": code, "message": "English / Roman Urdu", "file"?, "details"?}`
and puts 422 field paths in `details.fields`. They were rewritten to match. A mock that disagrees with
the server it stands in for is worse than no mock — it makes green tests meaningless.

## D-012 — Frontend tests live in two places, and that is deliberate
Unit tests sit beside their source (`src/**/*.test.ts[x]`); page-level integration tests sit in the
repository-level `tests/frontend/` named in the brief. Files outside the Vite root cannot resolve
`msw` or `@testing-library/*`, because `node_modules` is in `frontend/`. Rather than symlink
node_modules to the repo root (invisible, breaks on a fresh clone) or alias a dozen packages, those
tests import everything through `src/test/harness.tsx`, which lives inside the root and re-exports
what they need. Two `tsconfig` path entries cover the injected JSX runtime.

## D-013 — The XHR transport is doubled in upload tests; nothing else is
Sending a `FormData` containing a `File` through jsdom's XMLHttpRequest under MSW never settles — a
plain-string body works, so it is jsdom's multipart serialisation, not our code. Rather than drop the
coverage or leave a hanging test, `src/test/fakeXhr.ts` replaces the transport while the page, the
validation, the toasts, the progress bar and the job polling all stay real. The multipart body itself
is asserted directly against `buildUploadForm`, which was extracted for that purpose. The limitation
is stated in MORNING_REPORT-2.md.

## D-014 — The Library page states its own coverage
20 of 68 categories have a course. The page says "20 of 68 categories have a curated course so far"
and lists every empty category of the selected field with a "coming soon" badge. Hiding them would
imply the taxonomy is complete; filling them with placeholder courses would be fabrication. Saying
the number is the only honest option (RULE 5).

## D-015 — Coverage thresholds are enforced in the config, not just reported
`vite.config.ts` fails the run below 80% statements / 80% branches / 70% functions / 80% lines, and
excludes the test files themselves, type-only modules and `main.tsx` from the measurement. Counting
tests as covered code inflates the number and measures nothing.

## D-016 — `origin/main` merged into this branch; `frontend/**` resolved to Agent 2
Agent 1's PR #1 landed on `main` mid-session. Rather than leave a conflicted PR for a human, I merged
`origin/main` into this branch and resolved the 10 `add/add` conflicts myself. All of them existed only
because both agents scaffolded `frontend/` from the same empty base commit, so every conflicting file
is a scaffold file, not real work.

`frontend/**` resolved to **ours** per D-002, agreed at the start of the session. Root `.gitignore`
resolved to **theirs** because Agent 1's version is a strict superset of mine. `frontend/src/styles.css`
(Agent 1, 1 line, imported nowhere) was deleted — `src/styles/{tokens,rtl,global}.css` supersedes it.
Everything Agent 1 owns was taken unchanged.

Verified after merging, not before: `tsc --noEmit` clean, 297/297 frontend tests, 36/36 content tests,
`validate_content.py` exit 0, production build OK. `git merge-tree --write-tree origin/main HEAD` now
exits 0, i.e. `main` can take this branch with zero conflicts.

The alternative — pushing the merge straight to `main` myself — was declined: this session is pinned to
`arena/01a0f445-learms`, and the brief's own RULE 10 says create a PR and do not merge.
