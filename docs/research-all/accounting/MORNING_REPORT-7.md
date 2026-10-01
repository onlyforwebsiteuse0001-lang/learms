# Morning Report — Agent 7, Accounting Deep Research

**To:** Project owner
**From:** Agent 7 (Accounting Deep Research — CMA focus)
**Date:** 2026-09-30
**Branch:** `arena/01a0f47b-learms`

---

## Read this part first

**I did not complete the 24-hour brief.** I produced **32 files** against a target of **80+**, and
**five of the fifteen research areas are materially incomplete or untouched**. The work I did
produce is deep and sourced; there is simply less of it than you asked for. The full status is in
§4 and in [`GAPS.md`](GAPS.md).

**I also could not use the branch you asked for.** You specified `arena/accounting-research`. The
platform binds this session to `arena/01a0f47b-learms` and work on any other branch would not be
associated with the session. I stayed on the session branch and recorded this as decision D-001.
Everything is pushed there.

Those two things aside, here is what I found.

---

## 1. The five things worth waking up for

### 1.1 One qualification pays you PKR 1.5–2.0 million; the other charges you
ICAP pays CA trainees a **regulated minimum stipend of PKR 27,500 to 93,500 per month** across a
30–42 month training contract — roughly **PKR 1.3–1.6 million in**. ICMAP requires six Practical
Training Modules that the student **pays for**, at ≈PKR 21,100 each — **PKR 126,600 out**.

The swing between the two Pakistani routes is **≈PKR 1.5–2.0 million**. That is larger than the
entire fee difference, larger than any salary claim in the brief, and I could not find it stated
on a single Pakistani comparison page.

**If Learms surfaces one thing no competitor does, this is it.**

### 1.2 The brief is wrong in fourteen places, and two of them are urgent
[`CONTRADICTIONS.md`](CONTRADICTIONS.md) documents C-001 to C-014. The two that need action now:

- **The CA structure in the brief is obsolete.** ICAP's Education Scheme 2025 abolished MSA-1,
  MSA-2 and SPM. Legacy holders have **Summer 2026 and Winter 2026 as their last sittings**. Any
  content built to the brief would be wrong *and* would mislead a cohort facing a hard deadline.
- **The CMA course count is half the real figure.** The brief says "09 courses" for a 12-year
  entrant. The official circular says **18 courses plus 6 practical training modules**, minimum
  four years.

I also rejected the brief's **PKR 224,000/month CMA starting salary** on five grounds — including
that it exceeds ICAP's *regulated* CA floor by 2.4×, and that the brief contradicts itself
elsewhere at PKR 80,000–120,000.

### 1.3 Students have already told researchers what they need, and it is not gamification
Two peer-reviewed studies — Bigoni & Awais (2025) in *Accounting Forum*, and Awais & Bigoni
(2026), which I found today — cover **48 interviews across students, educators and policymakers**
at five Pakistani universities. They converge on one prescription: **teach with Pakistani
material.**

Students described themselves as "**robots**" and "**beasts of burden**", said "**Enron Enron
Enron. I am tired of this name**", and proposed the fix themselves: *"we [have] data from Apple
and Microsoft but neither of them is in Pakistan… we should look at local jeweller shops or
restaurants."*

The important implication is negative: **the disengagement is rational, not motivational.**
Adding streaks and badges to content students consider irrelevant addresses the wrong variable —
and risks reading as one more thing done *to* a population that already calls itself robots.

### 1.4 There is a constitutional deadline in 15 months that nobody's curriculum has met
Pakistan's **26th Constitutional Amendment** (October 2024) requires the elimination of *riba*
before **1 January 2028**. Neither ICMAP's Scheme-2025 nor ICAP's Education Scheme 2025 has a
core Islamic finance paper.

**Caveat, because this one is weakly sourced:** all five sources I found are news media. I did not
retrieve the Gazette text — and the sources **disagree** on whether the amended Article 38(f)
says "eliminate riba *completely*" or "*as far as practicable*". Those are legally very different.
Logged as C-014; verify before anyone quotes it.

### 1.5 ACCA's difficulty cliff is in the opposite place from where everyone assumes
Published pass rates: **BT 87–88%, LW 81–82% → PM 40–45%.** The cliff is at **Applied Skills**,
not Strategic Professional. **PM is harder than four of the six Strategic Professional papers.**

Rates are stable within ±3 points across sessions, so a fixed per-paper prior is safe for Agent
1's BKT seeding. ICMAP, by contrast, **publishes no pass rates at all** — so ICMAP difficulty has
to be an expert prior, and the UI must not present the two as the same kind of number.

---

## 2. What I built for the other agents

- **Agent 1** — `data/accounting_concept_graph_seed.json`: **78 concepts, 89 prerequisite edges,
  verified acyclic** by depth-first search, mapped to your `course_key` conventions, every node
  and edge carrying an `evidence` string. Plus three structural warnings: canonical concepts
  cannot be student-owned under your current schema; prerequisite edges need a hard/soft
  distinction; `dig.genai` is a genuinely isolated node and your traversal must tolerate that.
- **Agent 2** — `ui-ux/ACCOUNTING_LEARNING_UI.md`: every requirement derived from an exam format,
  a fee rule or an interview finding. The headline: **ICMAP's own paper gives 60 marks to report
  writing and presentation against 20 for MCQ, and essentially all commercial preparation
  material is MCQ banks.** Students are practising 20% of the paper.
- **Agent 3** — anonymity is a *research-grounded* requirement here, not a generic one: the
  literature uses James Scott's *infrapolitics* to explain why this population resists invisibly.
  A feedback channel requiring attribution will fail to detect the thing it exists to detect.
- **Agent 4** — three brief claims that must not propagate, all with origins I could not find.

---

## 3. Method — how I kept this honest

- Every finding carries a **source tier (A–E)** and a URL or citation. Where I could not find a
  source, I wrote **"not found"** rather than softening it — see C-012, B-009, G-06.
- **I never converted ACCA's GBP fees into PKR**, because I never captured an authoritative
  exchange rate (B-011). A plausible-looking PKR total would have been false precision in exactly
  the comparison students rely on most.
- **I refused to publish ISBNs** (`books/CMA_BOOKS.md`). The brief asks for them; I consulted no
  bibliographic database, and inventing 13-digit identifiers that look authoritative is precisely
  the fake research you told me not to do.
- **I refused to assert the IMA student exam fee.** Four sources, four numbers, 30% spread.
  Reported as a contradiction (C-013) rather than resolved by picking one.
- **I corrected my own error in public.** I initially miscited Bigoni & Awais with the wrong
  author initial and a paraphrased subtitle. When I found the authors' own reference list I fixed
  it and left the correction visible in the file rather than silently overwriting.
- **I validated my own JSON.** The concept graph was checked programmatically for cycles, dangling
  edges and duplicate ids; I found my own declared counts were wrong (76/88 vs actual 78/90) and
  corrected them. One deliberate placeholder edge is left in the file, flagged and marked for
  removal on ingestion, so the correction is auditable.

---

## 4. What I did NOT do

### File count
**32 files against a target of 80+.** I chose depth over breadth, consistent with your "depth over
breadth" instruction — but I want to be clear that this was also a resource constraint, not purely
a judgement call. Producing 80 thin files would have been worse; producing 80 files at this depth
was not achievable in the run.

### Areas incomplete or untouched
| Area | Status |
|---|---|
| **11 — Tools & platforms** | **Nothing written at all** |
| **6 — Student problems** | Only the CMA file. No psychological, tech-skills-gap, or cross-body institutional analysis |
| **7 — Solutions** | Only study techniques. Nothing on technology, financial solutions, institutional reform or mental health |
| **9 — UI/UX** | One file. No dashboard research, no Excel-UI research, no competitor teardown, **no usability testing** |
| **10 — Pakistan industry** | Only brain drain. No employer landscape, no sector analysis |
| **8 — Books** | CMA only. No ACCA, CA, general or finance book files |
| **13 — Career paths** | Salary done; progression paths not written |
| **14 — Regulatory** | Islamic finance only (Tier C). No taxation file, no regulatory file |

### Specific retrieval debt (the right place to start tomorrow)
1. **ICAP's eight CAF paper titles and Group A/B split** — never captured. Low effort, structural hole (B-010).
2. **SBP exchange rate** — blocks all cross-currency comparison (B-011).
3. **Gazette text of the 26th Amendment** — a live legal ambiguity under a major recommendation (C-014).
4. **IMA official fee pages** — would resolve C-013 (B-012).
5. **The 18 ICMAP per-subject syllabus PDFs** — would close several gaps at once.

### Things that are not my failures but are still gaps
No peer-reviewed study of ICMAP students exists. No body publishes pass rates (ICMAP), completion
rates (all three), or graduate outcomes (all three). I could not find a usable grievance corpus
for ICMAP students by any query strategy I tried. These are documented in
[`GAPS.md`](GAPS.md) §1 so nobody mistakes my silence for their absence.

---

## 5. Honest assessment of quality

**Strongest:** the ICAP material (they publish most), the ACCA pass-rate analysis (hard numbers),
the comparison economics, and the concept graph.

**Weakest, and I want this on the record:**
- **Islamic finance** rests entirely on Tier-C news media, yet supports one of my most
  consequential recommendations. Verify before acting.
- **The CMA priority area is, ironically, the least evidenced** — not through neglect but because
  ICMAP publishes almost nothing. My ICMAP cost figures are my own models (Tier E) built on
  Tier-A fee inputs. The arithmetic and exclusions are mine.
- **All salary work is Tier C or worse**, except the ICAP stipend floor. Treat the ranges as
  bounded guesses, not data.
- **The Awais & Bigoni (2026) paper is an author-accepted manuscript** — findings may shift in the
  version of record.

**A risk worth naming:** my Tier-E cost models will get quoted as facts. PKR 727,300 is labelled
"modelled, 2025 rates, body fees only" in the source file, but labels get stripped when numbers
travel.

---

## 6. Deliverables

**32 files**, all under `docs/accounting-research/` except `docs/SESSION-STATE-7.md`.
Index: [`MASTER_INDEX.md`](MASTER_INDEX.md). Findings: [`KEY_FINDINGS.md`](KEY_FINDINGS.md)
(132). Gaps: [`GAPS.md`](GAPS.md). Recommendations: [`RECOMMENDATIONS.md`](RECOMMENDATIONS.md).

**No code was written.** Only `.md`, `.json` and `.csv`, per your constraint. The concept graph is
data with ingestion notes — Agent 1 writes the loader.

Nine checkpoint commits pushed, each with a `research-accounting: [topic] - [finding]` message. A
pull request is open and **not merged**, as instructed.
