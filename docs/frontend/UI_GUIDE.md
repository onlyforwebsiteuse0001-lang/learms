# UI guide

Design tokens, components, bilingual/RTL support and accessibility.

Source: `frontend/src/styles/{tokens,rtl,global}.css`, `frontend/src/components/**`,
`frontend/src/i18n/**`.

---

## 1. No UI framework

There is no component library, no CSS framework, no charting library and no graph library
(decision D-003). Roughly 320 kB of JS ships, gzipped to ~97 kB, for the entire app.

The reasoning is the audience. A student in Pakistan on a 3G connection paying by the
megabyte pays for every kilobyte of a component kit, and the four things that would
normally justify one — a layered layout, five accessible primitives, two charts and a DAG
renderer — are a few hundred lines each and are in this repository, readable and testable.

Charts are hand-written SVG. The prerequisite graph is a hand-written layered layout.
`zustand` and `react-router-dom` are the only runtime dependencies beyond React.

---

## 2. Tokens

Everything lives in `:root` in `tokens.css`. Components never hardcode a colour or a
spacing value.

| Group | Tokens |
|---|---|
| Brand | `--brand-050 … --brand-900`, `--brand-500` is the primary |
| Ink | `--ink-400` (muted) … `--ink-900` (body) |
| Surface | `--surface`, `--surface-2`, `--canvas` |
| Lines | `--line-200`, `--line-300` |
| Status | `--ok`, `--warn`, `--err`, `--info` |
| Mastery | `--mastery-0 … --mastery-4` |
| Spacing | `--sp-1 … --sp-7` on a 4px base |
| Radius | `--radius`, `--radius-sm`, `--radius-lg` |
| Type | `--fs-xs … --fs-2xl` |

**Mastery bands** are used identically everywhere — bars, graph node strokes, distribution
chart — so a colour means the same thing on every screen:

```
0: < 20%   1: 20–40%   2: 40–60%   3: 60–80%   4: ≥ 80%
```

`masteryLevel(p)` and `masteryColor(p)` in `components/charts/MasteryBar.tsx` are the only
implementations of that rule.

---

## 3. Layout classes

Structure: `.shell .topbar .sidebar .main .tabbar` — sidebar on desktop, bottom tab bar on
mobile.

Surfaces and controls: `.card`, `.card-head`, `.card-tight`; `.btn` with `-primary`,
`-ghost`, `-danger`, `-sm`, `-block`; `.field`, `.field-error`, `.field-hint`;
`.badge-{neutral,ok,warn,err,info}`; `.progress-track`, `.progress-fill`,
`.progress-indeterminate`; `.skeleton`; `.state-panel` with `.is-error` / `.is-pending`;
`.toast-region`; `.offline-banner`; `.demo-banner`.

Page furniture: `.page-head`, `.eyebrow`, `.stat`, `.kv`, `.item-row`, `.item-main`,
`.file-chip`, `.dropzone` (`.is-over`), `.segmented`, `.nav-link`, `.brand`, `.chart-plot`,
`.state-icon`, `.icon-directional`, `.chat-log`, `.bubble` (`.from-me`), `.option`,
`.key`, `.is-correct`, `.is-wrong`.

Utilities: `.visually-hidden`, `.skip-link`, `.stack`, `.row`, `.row-wrap`, `.spacer`,
`.muted`, `.small`, `.mono`, `.force-ltr`, `.grid`, `.grid-2`, `.grid-3`.

Mobile-first; breakpoints at 640px and 1024px. Everything reflows to 320px without a
horizontal scrollbar (WCAG 1.4.10).

---

## 4. Bilingual and RTL

Three locales: `en`, `ur` (Urdu script, RTL) and `ur-Latn` (Roman Urdu, LTR). Roman Urdu
exists because it is what a great many Pakistani students actually type, and a
script-only Urdu option excludes them.

```tsx
const { t, locale, dir, htmlLang, setLocale } = useI18n();
t('dash.weakAreas');
t('library.coverage', { done: 20, total: 68 });   // {name} interpolation
```

- `en.ts` is the reference dictionary; `Messages` is derived from it, so a missing or
  misspelled key in `ur.ts` or `urLatn.ts` is a **type error**, not a runtime surprise.
  A test also asserts that every locale defines the same keys with the same placeholders.
- A missing key falls back to English, then to the key itself. It degrades to something
  readable instead of rendering a raw identifier at a student.
- An unmatched `{placeholder}` is left visible on purpose. A blank is indistinguishable
  from real empty content; a visible `{name}` is a bug report.
- Preference is stored under `haafiz.locale`; first visit honours `navigator.language`.

### How RTL actually works

`dir` and `lang` are set on `<html>` and nowhere else. Once that is done the browser
resolves every CSS logical property, mirrors scrollbars and gives assistive technology the
right reading order. There is no per-component direction logic anywhere in the codebase.

That only works because the CSS uses logical properties throughout:
`margin-inline-start`, `padding-inline`, `inset-inline-start`, `border-inline-end`,
`text-align: start`. There are no `left`/`right` properties in layout CSS.

Three things do not mirror automatically and are handled explicitly:

1. **Directional icons** — `[dir="rtl"] .icon-directional { transform: scaleX(-1); }`.
   An arrow meaning "next" must point the other way; a clock or a tick must not flip.
2. **Slide animations** — driven by a `--slide-in-from` custom property that `rtl.css`
   flips, rather than by hardcoded translate values.
3. **Latin-only content in an RTL page** — email, phone, `course_key`, concept ids and
   endpoint paths carry `.force-ltr`. An email address rendered RTL reads backwards.

User-supplied and extracted content uses `dir="auto"` so each block is decided from its
own text rather than from the UI language. A student can upload an Urdu PDF while reading
the interface in English, and the extracted text still renders correctly.

Grid columns declared explicitly do **not** auto-mirror — a known trap; layouts use flex
or logical placement instead.

---

## 5. Components worth knowing

**`<AsyncState>`** — the single place loading / empty / error / ready is enforced.

```tsx
<AsyncState
  status={q.status} data={q.data} error={q.error}
  isInitialLoad={q.isInitialLoad} onRetry={q.reload}
  skeleton={<SkeletonRows count={5} />}
  isEmpty={(d) => d.length === 0}
  emptyTitle={t('docs.empty')}
  pendingEndpoint={PENDING_ENDPOINTS.analyticsHistory}
>
  {(data) => <List items={data} />}
</AsyncState>
```

Routing every data view through it is what guarantees a page cannot show a confident `0`
mid-request, and cannot swallow an error into an empty state.

**`<PendingBackend endpoint note?>`** — the "no fake outputs" rule made visible. Names the
missing endpoint and points at `CHANGES_NEEDED.md`.

**`<MasteryBar value label sublabel? onSelect? selected?>`** — `role="meter"` with
`aria-valuetext` like `"64% — Developing"`. The percentage and the band name are always
rendered as text, so colour is never the only signal (WCAG 1.4.1).

**`<ConceptGraph concepts edges selectedId masteryById onSelect ariaLabel>`** — layered
(Sugiyama-style) DAG layout, no physics.

A prerequisite graph has a meaningful reading order, so a force-directed layout is
actively wrong for it: it scatters nodes and hides the one thing a student needs to see,
which is what must come before what. Longest-path layering places every concept strictly
after all of its prerequisites, and the layer index doubles as study order.

Cycles cannot be assumed away — concept extraction is heuristic and may emit one — so the
algorithm is cycle-tolerant: any node unresolved after `n` passes is parked in a final
layer, and the graph still renders. SVG groups are not natively focusable, so each node
gets `tabIndex`, `role="button"`, `aria-pressed` and explicit Enter/Space handling.

**Charts** (`DistributionChart`, `TrendChart`, `DonutChart`) — SVG with `role="img"` and a
required `ariaLabel`. The plot area is forced LTR via `.chart-plot`: a time axis should
not reverse just because the interface is in Urdu. `TrendChart` renders **nothing** for
fewer than two points, because one measurement is not a trend and drawing a flat line from
it would be a fabrication.

**`<CourseSelector>`** — a text input with a datalist of previously used keys, not a
dropdown. There is no `GET /courses` endpoint, so a list of options would have to be
invented. See `CHANGES_NEEDED.md` §3.1.

---

## 6. Accessibility

Target: WCAG 2.1 AA. What is implemented and covered by tests:

| Criterion | Implementation |
|---|---|
| 1.3.1 Info & Relationships | Real landmarks, one `<h1>` per view in `AppShell`, one `<h2>` per page via `PageHeader`, `<dl>` for key/value data |
| 1.3.4 Orientation | No orientation lock |
| 1.3.5 Identify Input Purpose | `autocomplete` on name, email, current/new password |
| 1.4.1 Use of Colour | Every status has text: badges, mastery band names, correct/incorrect labels |
| 1.4.3 / 1.4.11 Contrast | Tokens chosen for ≥4.5:1 text, ≥3:1 UI. `--ink-400` is only used on `--surface` |
| 1.4.4 Resize text | `rem` throughout; no `px` font sizes |
| 1.4.10 Reflow | Single column at 320px, no horizontal scroll |
| 2.1.1 Keyboard | Drag-and-drop is an enhancement over a real `<input type="file">`; graph nodes handle Enter/Space; no `div` with only an `onClick` |
| 2.1.2 No keyboard trap | No focus trapping anywhere; no modal dialogs |
| 2.4.1 Bypass Blocks | Skip link is the first focusable element and targets `#main-content` |
| 2.4.7 Focus Visible | `:focus-visible` outline on every interactive element; never removed |
| 3.1.1 / 3.1.2 Language | `lang` on `<html>`, switched with the locale |
| 3.3.1 Error Identification | Errors in text, tied by `aria-describedby`, `aria-invalid` set, focus moved to the first invalid field |
| 4.1.3 Status Messages | Toasts in a persistent live region — polite for success, `role="alert"` for errors |

Two deliberate choices:

- **The exam clock has `aria-live="off"`.** Announcing every second would make the page
  unusable with a screen reader.
- **Route changes move focus to the page `<h1>`** (hidden, `tabIndex={-1}`) rather than
  leaving focus on the clicked link. Without it, a keyboard user has no idea the page
  changed.

Not done: no automated axe run in CI, and no testing with an actual screen reader. See
`docs/frontend/MORNING_REPORT-2.md`.

---

## 7. PWA and offline

Registered with `registerType: 'prompt'`. An automatic reload mid-quiz would discard a
student's answers, so an update waits to be accepted.

The **application shell only** is precached. `runtimeCaching` for `/api/**` is empty and
`navigateFallbackDenylist` keeps API URLs off the service-worker path. Caching one
student's private mastery data in a shared browser profile — a common situation in a
computer lab or an internet café — is a privacy problem, not a performance win.

Connectivity is tracked by `watchConnectivity()` and shown as a banner. Offline, the shell
loads and the content library works from cache; anything needing the API says so.
