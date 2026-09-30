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
