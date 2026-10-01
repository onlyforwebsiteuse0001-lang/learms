# Agent 7 — Decision Log

Each decision records what was chosen, why, and what it costs.

---

## D-001 — Branch: `arena/01a0f47b-learms`, not `arena/accounting-research`

**Decision:** All work is committed to `arena/01a0f47b-learms`.

**Why:** The Arena session is bound to `arena/01a0f47b-learms`. Work pushed to any other
branch is not associated with the session and would not be visible to the operator in the
Arena UI, nor captured in the session's patchset. Creating `arena/accounting-research` would
satisfy the letter of the brief while losing the work.

**Cost:** The brief's Rule 2 is not followed literally. Mitigation: all research is confined
to `docs/accounting-research/` plus `docs/SESSION-STATE-7.md`, so it is trivially separable
and could be cherry-picked to a differently-named branch later if required.

**Status:** Standing. Disclosed in `RESEARCH_PLAN.md`, `SESSION-STATE-7.md`, the PR body and
`MORNING_REPORT-7.md`.

---

## D-002 — Source-tier grading is mandatory on every claim

**Decision:** Every factual statement carries a source graded A (primary official) through
E (unverified aggregator / my own modelling). Definitions in `RESEARCH_PLAN.md`.

**Why:** The accounting-education space is full of confidently-stated numbers with no
provenance — especially salary figures and fee figures. Without grading, a Learms content
pipeline consuming this research cannot tell an ICMAP circular from a coaching centre's
marketing page. The brief's own input data contained at least four errors that only surfaced
because primary sources were checked (see `CONTRADICTIONS.md`).

**Cost:** Slower. Fewer total claims. Accepted deliberately — Rule 5 of the brief is
"depth over breadth" and Rule 7 is "no fake research".

---

## D-003 — Tier-A sources override the task brief

**Decision:** Where the brief's stated facts conflict with the awarding body's own
publications, the awarding body wins, and the conflict is documented rather than silently
corrected.

**Why:** Silently correcting would hide the fact that widely-circulated figures about ICMAP
are wrong — which is itself one of the more useful findings for Learms, since students are
making enrolment decisions on those figures.

**Cost:** The deliverables openly contradict parts of the brief. This is intentional and is
surfaced prominently rather than buried.

---

## D-004 — Salary data is presented as ranges with methodology, never as point figures

**Decision:** Salary findings are reported as: source, sample basis (if disclosed), date,
and range — with aggregator-derived "average" figures explicitly marked Tier E and
challenged against Pakistani labour-market reality.

**Why:** The brief supplied CMA salary figures of PKR 2,686,111/yr entry, 3,781,672/yr mid,
4,774,005/yr senior. These originate from cost-of-living aggregators that model salaries
rather than survey them, and they are implausible against every Tier-A/C Pakistani datapoint
found (see `career/SALARY_DATA_2025_2026.md`). Publishing them would give Learms users
wildly inflated expectations — an actively harmful outcome for a career-guidance product.

**Cost:** Learms cannot show a single clean "average CMA salary" number. That is the correct
outcome; the honest answer is a range with a confidence statement.

---

## D-005 — Two graphs, not one, for ICMAP progression

**Decision:** Recommend to Agent 1 that ICMAP be modelled as **two separate DAGs**:
(a) a concept-prerequisite graph for pedagogical ordering, and
(b) a level-progression graph encoding ICMAP's regulatory sitting rules.

**Why:** ICMAP's examination progression scheme (Circular §9) is a hard legal constraint —
max six courses per sitting, no skipping a lower level — that is independent of what a
student is pedagogically ready for. Collapsing them into one graph produces study plans that
are either illegal or pedagogically wrong.

**Cost:** More modelling work for Agent 1. Documented in `RECOMMENDATIONS.md`.

---

## D-006 — Concept templates are shipped as data, not as code

**Decision:** Curriculum seeds go to `docs/accounting-research/data/*.json` and `*.csv`, in a
shape that mirrors Agent 1's `Concept`/`Prerequisite` columns, but **no loader, migration or
seeding script is written**.

**Why:** The brief's Rule 1 forbids code. The data is still directly consumable.

**Cost:** Agent 1 must write the ingestion. The JSON is shaped to make that near-mechanical.

---

## D-007 — Community/anecdotal evidence is used, but quarantined

**Decision:** Tier-D sources (LinkedIn posts, Reddit, forums, student testimony) are used for
**lived-experience and grievance claims only**, always labelled, and never used to establish
a number, a rule, or a fee.

**Why:** The student-experience areas of the brief (Areas 2.3, 6) cannot be researched from
official sources at all — no awarding body publishes its own failure modes. Excluding Tier D
would mean excluding the actual research question. But Tier D cannot carry facts.

**Cost:** Some grievances are reported as "students report X" rather than "X is true". That
distinction is preserved deliberately throughout.

---

## D-008 — Pass-rate data: report absence rather than estimate

**Decision:** Where an awarding body does not publish pass rates, Agent 7 writes "not
published" and says so, rather than sourcing a number from a coaching centre.

**Why:** Pass rates are the single most commercially-distorted statistic in this sector.
Coaching centres publish pass rates for their own cohorts and present them as institute-wide.

**Cost:** The comparison matrix has empty cells. Empty is more useful than wrong.
