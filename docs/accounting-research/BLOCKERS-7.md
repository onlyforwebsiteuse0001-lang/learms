# Agent 7 — Blockers and Unverifiable Items

Anything here could **not** be established from an acceptable source. Nothing in this file
should be presented to Learms users as fact. Items are not guesses waiting to be filled in —
they are recorded absences.

---

## B-001 — ICMAP PTM requirement for graduate entrants is ambiguous in the official text

**What's unclear:** Circular §5 states 14/16-year entrants take "all three modules practical
training level-1". The §2 roadmap and §9 progression rules both describe PTM Level-2 as part
of the route to CMA. Read literally, a graduate entrant reaches CMA without PTM4 (Audit
Procedures), PTM5 (Banking & Finance) or PTM6 (Strategic Management Analysis).

**Why unresolved:** ICMAP has not published a clarification; no secondary source addresses it.

**Impact:** Course-count and total-cost figures for the 14/16-year routes carry ±3 PTMs
(≈ PKR 63,300) of uncertainty. Stated as a floor in `cma-deep/STUDY_SCHEME_2025_COMPLETE.md`.

**Resolution path:** Direct query to ICMAP Education Department. Cannot be done from here.

---

## B-002 — ICMAP live fee page heading contradicts its own circulars

**What's unclear:** `fee_structure.aspx` heads a column "COACHING/ DISTANCE LEARNING PROGRAM
AND EXAMINATION FEE PER COURSE" with a single figure (e.g. 18,400 for OL-1). Every dated
circular (2023, 2024, 2025) splits coaching and examination into two columns, and
`exam_fee_structure.aspx` separately lists exam fees of 5,500/7,000/9,000.

**Best reading:** the live figure is **coaching/DLP only**; exam fee is additional. This
matches the year-on-year progression of the coaching column exactly.

**Impact:** Total-cost estimates carry ~PKR 100–120K of uncertainty across a full 18-course
route depending on the reading. Both readings are published in the deliverable.

**Resolution path:** ICMAP's next dated fee circular, or direct query.

---

## B-003 — ICMAP does not publish pass rates

**What's missing:** No subject-level, level-level or cohort pass-rate data is published by
ICMAP. ICMAP publishes result gazettes (pass lists) but not denominators, so a pass *rate*
cannot be derived from public data.

**What exists instead:** coaching centres advertise their own cohort results. These are
self-selected, unaudited, and not institute-wide. Per `DECISIONS-7.md` D-008 these are not
used.

**Impact:** The comparison matrix cell "CMA pass rate" is empty and stays empty. Any claim
about ICMAP difficulty relative to ACCA/ICAP is qualitative only.

**Contrast:** ACCA publishes global pass rates per exam per session; ICAP publishes
pass percentages per paper in its examiners'/results reports. ICMAP is the outlier among the
three in non-disclosure — that asymmetry is itself a finding.

---

## B-004 — Internal arithmetic error in ICMAP Circular §7

**What's wrong:** "Lecture hours for each course are 90 and the credit hours are 6, totalling
1260 lecture hours and 144 credit hours."

- 144 credit hours ÷ 6 = 24 modules ✅ (18 courses + 6 PTM)
- 24 modules × 90 lecture hours = 2,160, not 1,260
- 18 courses × 90 = 1,620, not 1,260
- 1,260 ÷ 90 = 14 modules, which matches nothing in the scheme

**Impact:** Contact-hour planning figures cannot be taken from the circular. `144 credit
hours / 24 modules` is used as the anchor instead.

**Resolution path:** ICMAP erratum. None published as at access date.

---

## B-005 — Number of currently-registered ICMAP students: not found

**What's missing:** ICMAP does not publish a current registered-student count. The brief
asserts CMA students are the largest cohort in Pakistan ("CMA walon ki tadaad sab se zyada
hai"). **This could not be verified from any source.**

**What is findable:** ICMAP member counts appear in annual reports and IFAC member-body
statistics; ACCA publishes Pakistan student/member numbers in market releases. Student
populations are not published on a comparable basis across the three bodies, so even where
individual numbers exist they are not comparable.

**Impact:** The premise that ICMAP is the *largest* student population is **unverified** and
is not repeated as fact anywhere in this research. ICMAP being the *least-researched* of the
three is supportable (literature search returns far fewer ICMAP-specific studies than
ACCA/ICAP), and that is the justification actually used.

---

## B-006 — Per-paper CBE question-paper pattern (QPPS) for Study Scheme-2025: partially found

**What exists:** ICMAP publishes Model Papers for CBE which state 3 hours / 100 marks and
reference a "Question Paper Pattern and Structure (QPPS)" with per-subject weightings.

**What's missing:** A single consolidated QPPS document covering all 18 Study Scheme-2025
subjects with MCQ/subjective mark splits per subject. The model papers note that question
numbers "will vary as per the QPPS and respective weightage of the subject" without
publishing the QPPS table itself in the same document.

**Impact:** `cma-deep/EXAM_PATTERN.md` reports the confirmed envelope (3 hours, 100 marks,
CBE, mixed MCQ + scenario) and explicitly does not fabricate per-subject mark splits.

---

## B-007 — ICMAP passing mark and attempt limit: not stated in the 2025 policy circular

**What's missing:** The Study Scheme-2025 policy guidelines do **not** state a pass mark or a
maximum-attempts rule. The only attempt-related rule found is transitional: legacy-scheme
students get six attempts at the normal exam fee, then pay double.

**Impact:** `EXAM_PATTERN.md` does not assert "50% to pass" even though that is the widely
repeated figure, because no Tier-A source for Study Scheme-2025 was located.

---

## B-008 — Reliable Pakistani accounting salary data does not exist in Tier A/B form

**What's missing:** There is no government or professional-body salary survey for Pakistani
accountants published on a current, methodologically-disclosed basis. Pakistan Bureau of
Statistics' Labour Force Survey reports occupational wages at a level far too aggregated to
isolate CMA/ACCA/CA holders.

**What exists:** (a) aggregator models (salaryexpert/ERI, Payscale) — Tier E, modelled not
surveyed, and demonstrably inflated for Pakistan; (b) job-posting ranges — Tier C, real but
biased toward roles that advertise publicly; (c) practitioner commentary — Tier D.

**Impact:** `career/SALARY_DATA_2025_2026.md` presents a triangulated range with every source
graded, and explicitly rejects the brief's supplied figures. See `CONTRADICTIONS.md` C-005.

---

## B-009 — "87% of ACCA students want to go abroad" — origin not located

**What's claimed:** The brief states 87% of ACCA students want to go abroad and 69% want to
start their own business.

**Search result:** The specific paired statistic could not be traced to a published ACCA
survey, journal article, or news report. ACCA does publish global talent/mobility surveys
containing comparable questions, and Pakistani brain-drain reporting exists independently,
but the exact 87%/69% pairing was **not found**.

**Impact:** Reported in `pakistan/BRAIN_DRAIN.md` as an **unsourced claim in circulation**,
with the independently-verifiable emigration evidence presented separately. Not stated as
fact.
