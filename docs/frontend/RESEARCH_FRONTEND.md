# Research — frontend (Agent 2, Phase 0)

Date: 2026-09-30. Method: web search + reading Agent 1's committed architecture.

## 1. Streamlit vs. React for this product

The brief offered "Streamlit for MVP speed OR Next.js". Both were rejected in favour of **Vite +
React + TypeScript**, and the reason is not preference — it is that Agent 1 already committed the
decision and the deployment topology around it.

`docs/ARCHITECTURE.md` on Agent 1's branch states: *"React PWA is built to static assets and served
by Nginx. Nginx proxies `/api` to FastAPI, keeping browser requests same-origin."* `frontend/Dockerfile`,
`frontend/nginx.conf`, `frontend/vite.config.ts` and a `vite-plugin-pwa` dependency are all committed.

| Option | Verdict |
| --- | --- |
| Streamlit | Rejected. Server-rendered Python, no PWA/offline, no RTL control, no component tests, and it would invalidate Agent 1's nginx + Docker topology. Rewriting the deployment layer is out of Agent 2's folder scope. |
| Next.js | Rejected. Adds a Node server to a stack designed for static assets behind nginx; SSR buys nothing for an authenticated dashboard whose data is all per-student and behind a bearer token. |
| **Vite + React + TS** | **Chosen.** Already scaffolded, already Dockerised, static output, first-class `vite-plugin-pwa`, and Vitest gives fast component tests with the same config. |

Recorded as decision D-001 in `DECISIONS-2.md`.

## 2. RTL and Urdu

Findings from the RTL guides reviewed
([frontendchecklist](https://frontendchecklist.io/rules/html/direction-attribute),
[simplelocalize](https://simplelocalize.io/blog/posts/rtl-design-guide-developers/)):

- The foundation is `dir` on `<html>`, not per-component CSS. The browser then mirrors scrollbars,
  default text alignment and logical-property resolution for free.
- **CSS logical properties** (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`,
  `border-inline-start`, `text-align: start`) mean one stylesheet serves both directions. Mixing
  physical and logical properties in the same component is the most common failure.
- Directional **icons must be mirrored explicitly**: `[dir="rtl"] .icon-directional { transform: scaleX(-1) }`.
  Non-directional icons (logos, checkmarks) must not be.
- **Horizontal animations break in RTL.** Drive the offset from a custom property that flips:
  `:root{--slide-from:-100%} [dir="rtl"]{--slide-from:100%}`.
- **Progress bars** should grow with flexbox from the start edge rather than animating `width`,
  otherwise the fill grows from the wrong side in RTL.
- **Mixed-direction content** (an Urdu sentence containing an English filename or a UUID) needs bidi
  isolation — `<bdi>` or `dir="auto"` — or punctuation lands in the wrong place.
- Urdu needs a **larger type size** than Latin at the same nominal px; Nastaliq/Naskh glyphs have
  smaller x-height and taller ascenders/descenders, so line-height must also increase.

Applied in this repo:
- `src/i18n/index.tsx` sets `document.documentElement.lang` and `.dir` on every language change.
- `src/styles/global.css` uses logical properties throughout; `src/styles/rtl.css` holds the small set
  of genuine exceptions (icon mirroring, LTR-locked fields).
- Email, password, numeric and ID fields are locked to `dir="ltr"` even inside an RTL document.
- `.font-ur` bumps size and line-height for Urdu text.

## 3. Learning dashboard patterns

- Lead with **one** primary next action. A learner opening the app should see "what do I do now",
  not a wall of metrics. The dashboard puts the next path step in the hero slot.
- Show **mastery as a distribution, not a single average**. A 62% average hides that three concepts
  are at 15%. The mastery page sorts weakest-first by default.
- Every recommendation must be **explainable**. Agent 1 shipped `GET /api/v1/path/why/{concept_id}`
  specifically for this; the path UI exposes a "Why this?" control on every step.
- **Evidence over assertion.** Agent 1 returns `evidence` and `confidence` on concepts, edges and
  diagnostic answers. The UI surfaces both rather than presenting extracted concepts as ground truth.

## 4. PWA / offline

- `vite-plugin-pwa` with `registerType: 'prompt'` (Agent 1's choice, kept) — a forced reload mid-quiz
  would lose answers, so the user is asked.
- Agent 1's architecture note #6 is a hard constraint: *"React PWA caches the application shell only;
  private API data is not put into Workbox's public runtime cache."* The service worker therefore
  precaches the shell and **must not** runtime-cache `/api/**`. Caching another student's mastery data
  in a shared browser profile is a real privacy leak, not a hypothetical one.
- Offline UX is therefore: shell loads, an `OfflineBanner` announces the state via `aria-live`, and
  data views show a retry affordance instead of stale numbers.

## 5. Accessibility (WCAG 2.1 AA)

Criteria that actually bite on this UI, and what was done:

| Criterion | Implementation |
| --- | --- |
| 2.4.1 Bypass Blocks (A) | "Skip to main content" link, first tab stop in `AppShell` |
| 2.4.7 Focus Visible (AA) | Global `:focus-visible` ring; `outline:none` never used without a replacement |
| 4.1.3 Status Messages (AA) | Toasts render in an `aria-live="polite"` region; errors use `role="alert"` |
| 1.4.3 Contrast (AA) | Palette tokens checked to ≥ 4.5:1 body / 3:1 large + UI |
| 1.4.10 Reflow (AA) | Layout usable at 320 px with no horizontal scroll |
| 1.4.11 Non-text Contrast (AA) | Chart bars, status pills and focus rings ≥ 3:1 |
| 3.1.1 / 3.1.2 Language (A/AA) | `lang` on `<html>`, and `lang` on individual opposite-language spans |
| 3.3.1 Error Identification (A) | Field errors in text and tied via `aria-describedby`; colour is never the only signal |
| 2.1.1 Keyboard (A) | Drag-and-drop upload has an equivalent keyboard-reachable file input |
| 1.3.5 Identify Input Purpose (AA) | `autocomplete` on name/email/password |

## 6. Testing

Per the Vitest/RTL/MSW guidance reviewed, the stack is **Vitest + jsdom + React Testing Library +
`@testing-library/user-event` + MSW**, coverage via `@vitest/coverage-v8` with thresholds enforced in
config so a regression fails the run rather than printing a warning.

Two rules taken from that research:
- **Never** monkey-patch `global.fetch`. MSW intercepts at the network layer so the real client code
  — headers, error parsing, 401 handling — is exercised.
- `server.listen({ onUnhandledRequest: 'error' })` so a component quietly calling an endpoint nobody
  mocked fails loudly instead of silently rendering an empty state.

Handlers live in `src/test/mocks/handlers.ts` and are written against the **observed** Agent 1
contract, so when the branches merge the same handlers double as a contract check.

## 7. Mobile-first

- Single-column below 768 px; sidebar collapses to a bottom tab bar with 44 px minimum targets.
- Tables become stacked cards rather than horizontally scrolling.
- `100dvh` instead of `100vh` so mobile browser chrome does not clip the layout.
- All breakpoints are `min-width` so the small layout is the default, not an override.
