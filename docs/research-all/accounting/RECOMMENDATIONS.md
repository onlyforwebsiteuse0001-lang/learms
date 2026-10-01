# Recommendations to Agents 1, 2, 3 and 4

**Agent 7 — Accounting Deep Research**
**Date:** 2026-09-30
**Rule applied:** every recommendation names the evidence that produced it. Recommendations with
no evidence behind them are omitted, not softened.

Priority: **P1** = act on this, it changes the product. **P2** = act on this when convenient.
**P3** = be aware.

---

## A. To Agent 1 — Backend / Knowledge Graph

### A1 (P1) — Canonical concepts cannot be student-owned
`Concept.student_id` is NOT NULL with `uq_concept_student_course_name`. Seeding the 78-concept
accounting graph (`data/accounting_concept_graph_seed.json`) per student duplicates canonical
knowledge per enrolment, and every expert correction to a prerequisite edge must then be replayed
across every private copy.

**Recommend:** nullable/system `student_id` for canonical concepts; per-student **mastery** in a
separate table. This changes the uniqueness constraint and is a real migration, which is why it
should happen before seeding rather than after.
*Evidence: `data/accounting_concept_graph_seed.json` ingestion_notes; `taxonomy/SPECIALIZATIONS.md` §5.2.*

### A2 (P1) — Prerequisite edges need a `kind`: hard vs soft
A true prerequisite (*you cannot learn B without A* — `fin.tvm` → `fin.npv`) and a helpful
association (*A makes B easier* — `acc.ratio` → `dig.powerbi`) are being modelled as the same row
type. Collapsing them will over-block students. Five seeded edges are explicitly flagged
confidence 0.6–0.65 for exactly this reason.
**Recommend:** `Prerequisite.kind ∈ {hard, soft}`; only `hard` gates content.
*Evidence: `data/accounting_concept_graph_seed.json` known_issues.*

### A3 (P1) — Seed `fin.tvm` as a diagnostic gateway
Time value of money is a prerequisite for NPV, IRR, WACC, valuation, financial risk management,
IFRS 16 lease liabilities **and** IFRS 9 amortised cost — six downstream concepts across three
domains. A student weak here is silently blocked from roughly a third of the advanced syllabus,
and the failure surfaces as "bad at leases" rather than "bad at discounting".
**Recommend:** diagnostic-test the gateway nodes directly; attribute downstream failures upstream.
*Evidence: `taxonomy/SPECIALIZATIONS.md` §3 Track C; graph edge analysis.*

### A4 (P1) — Handle isolated concepts
`dig.genai` (ICMAP O2) has no prerequisites and no dependents. Graph traversal must not assume
every concept is reachable from a root. 16 of 78 concepts are roots.
*Evidence: DFS over the seeded graph.*

### A5 (P1) — Acronym disambiguation in the search index
Three observed, reproducible false positives:
- **"ICMAP"** → *International Class of Management and Accounting Program* (Indonesia).
- **"CMA"** → ICMAI (India) dominates fee-related results; also IMA (USA), ICMAB (Bangladesh).
- **"Chartered Management Accountant"** → CIMA's ACMA/FCMA, now colliding with ICMAP's own 2025
  rebrand, while ICMAP simultaneously sells a CIMA pathway.

**Recommend:** body-scoped entity resolution, not string matching. This is not hypothetical — all
three polluted searches during this research.
*Evidence: `cma-deep/CMA_PAKISTAN_VS_USA.md` §4; `papers/RESEARCH_PAPERS.md` §6.*

### A6 (P2) — Difficulty must be provenance-tagged, not just numeric
ACCA publishes per-paper pass rates; ICMAP publishes none. A `difficulty` integer derived from
empirical pass rates and one derived from an expert guess are not the same datum.
**Recommend:** `difficulty_source ∈ {published_pass_rate, expert_prior, unknown}` and never render
an `expert_prior` as fact in the UI.
*Also:* ACCA's data shows the difficulty cliff is at **Applied Skills (PM 40%)**, not Strategic
Professional — a level-derived difficulty score would get this backwards.
*Evidence: `acca-deep/COMPLETE_GUIDE.md` §8.*

### A7 (P2) — A single difficulty scalar mismodels audit and strategy
ICMAP's own PM6 paper allocates **30 marks to report writing and 30 to presentation** against 20
for MCQ. Mastery estimated from MCQ correctness will overstate competence precisely where
judgement matters most.
*Evidence: `cma-deep/EXAM_PATTERN.md`.*

### A8 (P2) — `extraction_method` must stay honest
These concepts were not LLM-extracted from student uploads. Label them
`agent7_curriculum_research`. Mislabelling provenance in a system whose stated principle is
evidence-grounded extraction is a correctness bug, not a cosmetic one.

### A9 (P3) — Entry route determines the student's root, not the graph
A 16-year-degree entrant starts at ML-2 and must never be shown O-level roots as "next". Entry
qualification is a first-class attribute of an accounting learner.

---

## B. To Agent 2 — Frontend / Content UX

### B1 (P1) — "Has a Pakistani worked example" should be a required content field
Two independent peer-reviewed studies, 48 interviews, three actor groups, one shared conclusion:
**localise the content.** Students asked for "local jeweller shops or restaurants" instead of
"data from Apple and Microsoft", and said "Enron Enron Enron. I am tired of this name."
**Recommend:** make it a tracked, reportable field with a visible gap list — not an authoring
aspiration.
*Evidence: Bigoni & Awais (2025); Awais & Bigoni (2026).*

### B2 (P1) — Do not gamify first
The gamification literature reports engagement gains, but Bigoni & Awais show Pakistani students
disengaging because content is judged **irrelevant** — a meaning failure, not a stimulation
failure. Adding mechanics to alienating content, for students who already call themselves
"robots", risks reading as one more thing done *to* them.
**Recommend:** localise → measure → only then layer mechanics.
*Evidence: `papers/RESEARCH_PAPERS.md` §4.*

### B3 (P1) — Ship the time-critical ICAP transition warning now
MSA-1, MSA-2 and SPM are abolished. Legacy holders get **Summer 2026 and Winter 2026 as the last
sittings**. This is a hard deadline affecting a live cohort, and the brief Learms was built from
still describes the old structure.
*Evidence: `ca-deep/COMPLETE_GUIDE.md`; `CONTRADICTIONS.md` C-011.*

### B4 (P1) — Surface ICAP CAT–SFS eligibility
≥80% HSSC + family income < PKR 100,000/month ⇒ **≥75% tuition discount**, registration cut to
PKR 2,000, exam fees PKR 1,000/subject. This is the **most valuable under-claimed benefit** found
in Pakistani accounting education, and no comparable ICMAP scheme was found.
**Recommend:** a two-question eligibility check, shown to every CA-curious user.
*Evidence: ICAP CAT–SFS page.*

### B5 (P2) — Build a per-body fee optimiser
Three bodies, three fee architectures, three different optimal behaviours:
- **ACCA:** late entry costs **+125–156%** → book on time.
- **ICAP:** CAF 7,000 first paper, **4,600 each additional** → batch 4 papers, pay ~5,200 each.
- **ICMAP:** flat per course, no batching benefit; legacy **double fee after six attempts** →
  optimise for first-time pass only.

The rules are public, stable and quantified. Small feature, real money.
*Evidence: `comparison/CMA_ACCA_CA_COMPARISON.md` §4.*

### B6 (P1) — Show the 16-year-entry CMA fork
At ≈PKR 464,000 / 2 years (ICMAP ML-2) versus ≈USD 1,585 / 12–18 months (IMA USA), a graduate is
choosing between near-identical costs with very different portability — and almost nobody
presents the comparison. Note the qualifier: IMA requires a bachelor's degree, so this fork does
**not** exist for 12- or 14-year entrants.
*Evidence: `cma-deep/CMA_PAKISTAN_VS_USA.md` §2.*

### B7 (P2) — Track coverage against the official syllabus, not against teaching
78% of surveyed Pakistani accounting graduates reported only about **half** their courses were
completed in class. (Dated ~2018 — used as structural insight, not a current statistic.) If
delivery is structurally incomplete, syllabus-coverage tracking is not a nice-to-have.
*Evidence: `papers/RESEARCH_PAPERS.md` §3.1.*

### B8 (P2) — Render "not published by the institute" as visible cells
ICMAP publishes no pass rates, no pass mark, no attempt cap, no time limit and no completion
statistics. Omitting these rows hides the asymmetry; showing them empty makes the transparency
gap between ACCA and the Pakistani bodies legible to students.
*Evidence: `BLOCKERS-7.md` B-003, B-007.*

### B9 (P3) — Never display converted currency without a dated rate
ACCA fees are GBP. Any PKR figure is a snapshot. Show "£X (≈PKR Y at the SBP rate on DATE)".
*Evidence: `BLOCKERS-7.md` B-011.*

---

## C. To Agent 3 — Security / Privacy

### C1 (P1) — Anonymous feedback is a research-grounded requirement, not a generic one
Bigoni & Awais apply James Scott's **infrapolitics**: these students resist *invisibly* precisely
because open criticism is unsafe against asymmetric institutional power. Any feedback channel
requiring attributable criticism will systematically fail to detect the problem it most needs to
detect. This is a specific, evidenced reason for anonymity — stronger than a generic privacy
argument.
*Evidence: `papers/BIGONI_AWAIS_2024_RAT_RACE.md` §4.3.*

### C2 (P1) — Financial data is genuinely sensitive here
CAT–SFS eligibility requires **family income < PKR 100,000/month**. Any eligibility feature
(B4) collects household income from minors and young adults. Treat as special-category data:
explicit consent, minimised retention, never used for segmentation or pricing.

### C3 (P2) — Study-behaviour data has research value and therefore needs consent design now
Learms would hold the large-N behavioural dataset this field demonstrably lacks. That is a real
contribution path — and it only exists if consent is designed in from the start rather than
retrofitted. Consent for *product* use and consent for *research* use are different asks.
*Evidence: `papers/RESEARCH_PAPERS.md` §5.*

### C4 (P3) — Disengagement signals must not become disciplinary signals
If low engagement can be a content-relevance signal (A/B above), exposing it to institutions as a
compliance metric would invert its meaning and harm the students it should help.

---

## D. To Agent 4 — General Research

### D1 (P1) — Three brief claims must not propagate
- **"40,000–50,000 accountant shortage"** — unsourced, origin not found (C-012).
- **"87% of ACCA students want to go abroad / 69% want their own business"** — origin not found
  (B-009).
- **"CMA starting salary PKR 224,000/month"** — rejected on five independent grounds; the brief
  also self-contradicts at 80–120k (C-005).

### D2 (P1) — The only Tier-A salary anchor in Pakistani accounting is the ICAP stipend
PKR **93,500/month** for a qualified trainee with ≤6 months remaining is a *regulated minimum*,
published by ICAP. Everything else — Glassdoor, SalaryExpert, ERI, Payscale — was found unusable
for Pakistan (Glassdoor mixes $/PKR and per-year/per-month in a single table, n=22).
*Evidence: `career/SALARY_DATA_2025_2026.md`.*

### D3 (P2) — The transparency asymmetry is itself a finding
ACCA publishes per-paper pass rates every session. ICMAP publishes none at all. If Agent 4 is
writing anything comparative about Pakistani professional education, this asymmetry is more
informative than any individual statistic.

### D4 (P2) — Sustainability reporting is the field's clearest directional signal
ICMAP (S1) and ICAP (CFAP-03) both added it in their 2025 revisions, **independently and
simultaneously**. Two competing bodies converging in the same year is a market signal, not
curriculum fashion.

---

## E. Cross-cutting: the one finding that should change the product

**Practical training is the dominant economic fact and nobody publishes it.**

| Route | Practical training cash flow to the student |
|---|---|
| **ICAP CA** | **+PKR 1.3–1.6 million** (regulated stipend, 30–42 months) |
| **ICMAP CMA** | **−PKR 126,600** (6 PTMs the student pays for) |
| **IMA CMA (USA)** | Satisfied by ordinary paid employment |

A **≈PKR 1.5–2.0 million swing** between the two Pakistani routes — larger than the entire fee
difference, larger than any salary claim in the brief, and absent from every Pakistani comparison
page reviewed in this research.

If Learms surfaces one thing that no competitor does, it should be this.

*Evidence: ICAP stipend rates (Tier A); ICMAP fee structure (Tier A);
`comparison/CMA_ACCA_CA_COMPARISON.md` §3.*
