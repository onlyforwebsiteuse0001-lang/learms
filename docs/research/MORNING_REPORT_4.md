# MORNING REPORT — Agent 4 (Research)

**Run window:** 2026-09-30 21:58 UTC → ongoing
**Branch:** `arena/01a0f452-learms`
**Output:** 23 documents in `docs/research/`, all `.md` / `.json`. **No code written or touched.**

---

## 1. Time log

| Block | Work | Output | Commit |
|---|---|---|---|
| 21:58 | Repo survey, plan, ground rules | `RESEARCH_PLAN.md` | — |
| 22:00 | **Area 1.1** HEC curricula, NQF, Gen-Ed policy, PEC | `PAKISTAN_FIELDS_TAXONOMY.md` + `.json` | `291e87d` |
| 22:02 | **Area 1.3** ACCA, ICAP, PM&DC, MDCAT, Law-GAT, CSS | `PROFESSIONAL_CERTIFICATIONS.md` | — |
| 22:03 | **Area 1.2** QS rankings, HEC enrolment, Economic Survey | `UNIVERSITY_COURSES.md` | `8489640` |
| 22:05 | **Area 2.1** math anxiety, Hake FCI, Johnstone | `PROBLEMS_NATURAL_SCIENCES.md` | ✅ |
| 22:07 | **Area 2.2** CS1 pass rates, notional machines, SBP/PIDE | `PROBLEMS_IT_COMPUTING.md` | ✅ |
| 22:09 | **Area 2.3** Rotenstein, Pakistani prevalence studies | `PROBLEMS_MEDICAL.md` | ✅ |
| 22:11 | **Area 2.4** rote learning, EMI, brain drain | `PROBLEMS_BUSINESS.md` | ✅ |
| 22:13 | **Area 2.5** legal education, SC 2025 reforms | `PROBLEMS_LAW.md` + taxonomy patch | ✅ |
| 22:15 | **Area 2.6 + 2.7** engineering, education/teachers | `PROBLEMS_ENGINEERING.md`, `PROBLEMS_EDUCATION.md` | ✅ |
| 22:17 | **Area 2.8** Pakistani student mental health meta-analysis | `PROBLEMS_SOCIAL_SCIENCES.md` | ✅ |
| 22:18 | **Area 2.9–2.11** arts, agriculture, media | 3 docs | ✅ |
| 22:20 | Progress + gaps registers | `RESEARCH_PROGRESS.md`, `GAPS.md` | ✅ |
| 22:22 | **Area 8.2** FSRS | `FSRS_DEEP.md` | ✅ |
| 22:24 | **Area 8.1** BKT | `BKT_DEEP.md` | ✅ |
| 22:26 | **Area 9.1** Socratic / ITS | `SOCRATIC_DEEP.md` | ✅ |
| 22:28 | **Area 3.1** Dunlosky learning techniques | `SOLUTIONS_BY_CATEGORY.md` | ✅ |
| 22:30 | Synthesis | `KEY_FINDINGS.md`, `RECOMMENDATIONS.md` | ✅ |
| 22:32 | Index + this report | `MASTER_RESEARCH_INDEX.md`, `MORNING_REPORT_4.md` | ✅ |

Checkpoint commits: **13**, all in the format `research: [topic] - [what found]`.

---

## 2. Areas checklist

| # | Area | Target docs | Done | Status |
|---|---|---|---|---|
| 1 | Pakistan fields taxonomy | 3 (+1 JSON) | 4 | ✅ **Complete** |
| 2 | Student problems by category | 11 | 11 | ✅ **Complete** |
| 3 | Solutions | 3 | 1 | 🟡 Partial |
| 4 | Books | 6 | 0 | ⬜ |
| 5 | UI/UX | 5 | 0 | ⬜ |
| 6 | Student success factors | 6 | 0 | ⬜ |
| 7 | Learning analytics | 3 | 0 | ⬜ |
| 8 | Knowledge tracing / adaptive | 4 | 2 | 🟡 Partial (the two that matter most) |
| 9 | Socratic tutoring | 3 | 1 | 🟡 Partial |
| 10 | OCR | 3 | 0 | ⬜ |
| 11 | Wellness | 3 | 0 | ⬜ (but `PROBLEMS_SOCIAL_SCIENCES.md` §3 carries the critical constraint) |
| 12 | APIs / infrastructure | 3 | 0 | ⬜ |
| — | Synthesis | 5 | 5 | ✅ **Complete** |

**23 of ~53 documents. Prioritisation was deliberate:** Areas 1, 2, 8 and 9 were completed first
because they are what Agents 1–3 are blocked on. Areas 4–7 and 10–12 remain.

---

## 3. Documents created

`RESEARCH_PLAN.md` · `PAKISTAN_FIELDS_TAXONOMY.md` · `pakistan_fields_taxonomy.json` ·
`UNIVERSITY_COURSES.md` · `PROFESSIONAL_CERTIFICATIONS.md` · `PROBLEMS_NATURAL_SCIENCES.md` ·
`PROBLEMS_IT_COMPUTING.md` · `PROBLEMS_MEDICAL.md` · `PROBLEMS_BUSINESS.md` · `PROBLEMS_LAW.md` ·
`PROBLEMS_ENGINEERING.md` · `PROBLEMS_EDUCATION.md` · `PROBLEMS_SOCIAL_SCIENCES.md` ·
`PROBLEMS_ARTS.md` · `PROBLEMS_AGRICULTURE.md` · `PROBLEMS_MEDIA.md` ·
`SOLUTIONS_BY_CATEGORY.md` · `FSRS_DEEP.md` · `BKT_DEEP.md` · `SOCRATIC_DEEP.md` ·
`RESEARCH_PROGRESS.md` · `GAPS.md` · `KEY_FINDINGS.md` · `RECOMMENDATIONS.md` ·
`MASTER_RESEARCH_INDEX.md` · `MORNING_REPORT_4.md`

---

## 4. Top 20 findings

Full list of 50 in `KEY_FINDINGS.md`. The twenty that should change what gets built:

1. **Tutoring gains plateau at *step-level* feedback.** Answer-based 0.31 → step-based **0.76** →
   sub-step **0.40** → human 0.79. *Build step decomposition; do NOT build free-form Socratic chat.*
   [VanLehn, 2011]
2. **"2 sigma" is actually 0.79** — and the surplus came from **mastery learning**, which alone was
   **1.2 SD**. *Mastery gating may beat the tutor, and needs no LLM.* [VanLehn 2011; Bloom 1984]
3. **Distributed practice d = 0.85, practice testing d = 0.74. Rereading, highlighting and
   summarization are the lowest-utility techniques — and are what students actually do.**
   [Dunlosky et al. 2013; Donoghue & Hattie 2021, 169,179 participants]
4. **Interleaving: blocked practice = 99% in-session but "horrible" at one week; interleaved = 68%
   in-session and 3× better at one week.** Every Pakistani resource is blocked; every exam is
   interleaved. *Largest un-built lever.*
5. **FSRS beats SM-2 by ~81% on RMSE, needs 20–30% fewer reviews; v4.5 gives 98% of v6 with zero
   training.** *Use FSRS-4.5.*
6. **Plain BKT is WORSE THAN CHANCE on skills with ≥8 templates; BKT-ST fixes it for one boolean
   column** (+0.04–0.11 AUC). Learms' content is templated by construction.
7. **~51% of Pakistani university students screen positive for depression — and NON-medical
   students (60.3%) are worse than medical (48.7%),** inverting the international assumption.
   [*Global Mental Health*, CUP 2025; 35 studies, 11,209 students]
8. **<20% of Pakistani universities have counselling; ~1 psychiatrist per 100,000.** *"Detect and
   refer" wellness design fails for >80% of users.*
9. **94% of Pakistan's education budget is salaries; 19% of schools have digital tools.**
   *Public-school B2B/B2G is structurally impossible. B2C mobile-first.*
10. **Only 10% of Pakistani IT graduates are employable (State Bank of Pakistan).** CS unemployment
    14.2%→22.6%, engineering 11%→23.5%, agriculture 11.4%→**29.4%**.
11. **4 of 5 Pakistani students rote-memorise**, and ten years of board English papers contained
    essentially **no analytical questions**. **MDCAT is 70% recall by design.**
12. **EMI is a *cause* of rote learning**, not just a correlate — exams are in English so students
    memorise verbatim, "especially in science". 65% of English teachers lack ELT training.
13. **Enrolment fell 11.8% (2.23m → 1.96m) on cost.** *The free tier is the product.*
14. **Math anxiety ↔ working memory r = −0.40, and the effect appears only under WM load; high-WM
    children are hurt most.** *Anxiety ≠ ability — timed failures must not depress mastery.*
15. **Hake: ⟨g⟩ 0.23 traditional vs 0.48 interactive engagement** (N=6,542, 62 courses).
    *Show normalized gain, not "% complete".*
16. **CS1: small classes pass at 80.1%, large at 65.4%** — no effect of language taught or contact
    hours. *"The small-class condition" is the honest positioning, and Pakistan's ratio is 1:34.*
17. **Supreme Court of Pakistan 2025: LLB cut from 5 to 4 years; CLE abolished; Law-GAT universal.**
    *The taxonomy was wrong and has been patched.*
18. **13,000+ accountants emigrated in 2024-25 — more than any other profession** (vs 11,000
    engineers, 5,000 doctors). *Accountancy = highest willingness to pay.*
19. **Only 15.7% of affected students seek treatment; anxiety exceeds depression in Pakistani
    samples; religion is the most common coping strategy; sleep and screen time are 2 of the 3
    measured distress predictors.** *A study app is implicated in two of the three.*
20. **1.83 million teachers, only 40% with satisfactory subject knowledge, no CPD system — and
    HEC's B.Ed already lists "AI in Education" as a specialisation.** *Teachers are a 30–100×
    leverage user segment (gated on unresearched device access).*

---

## 5. Recommendations by agent

Full detail with priorities in `RECOMMENDATIONS.md`. Condensed:

**Agent 1 (Backend) — P0**
append-only `attempt`/`review_log` from day one · FSRS-4.5 with default weights ·
**BKT-ST not plain BKT** · clamp p(S) ≤ 0.1 and derive the p(G) bound from item format ·
separate slip parameters for timed/high-stakes context (anxiety = slip, not non-mastery) ·
two BKT chains for concept vs English expression · step decomposition on every problem ·
mastery gating at p(L) ≥ 0.95.

**Agent 2 (Frontend + Content) — P0**
predict→commit→feedback everywhere, **no passive video** · **don't build a highlighter, re-reader,
or AI-summaries-as-product** · bilingual EN/UR as a content dimension, not a toggle ·
**Exam Mode + Mastery Mode as two honest modes** · past-paper ingestion · "label" not "box" ·
show normalized gain, not % complete.

**Agent 3 (Batch 3+4) — P0**
wellness = routing, one tap to help · **but referral-first fails — verify every listed resource** ·
weight to self-management and (opt-in, expert-reviewed) religiously-framed coping ·
**design around anxiety, not depression** · **don't scope wellness to medicine** ·
wellness stays free.

**The three things most likely to be got wrong:** free-form Socratic chat · plain BKT ·
AI summaries as the product.
**The three most likely to be under-valued:** mastery gating · interleaved queues · the event log.

---

## 6. Gaps

Full register in `GAPS.md` (19 data gaps, 11 contradictions, 4 unfound brief items, 6 human
decisions). The ones that block work:

**P0**
- **G19 — Pakistani student device ownership, data cost and connectivity has never been
  researched.** Offline-first, video-vs-text, model selection and pricing all depend on it.
  *This should be the very next thing researched.*
- **G10 — teacher device ownership/connectivity**, which the entire teacher-segment thesis rests on.
- **G09 — Humanities, and especially Islamic Studies, has had no research at all**, despite being a
  very large Pakistani enrolment field.

**Not found (named in the brief)**
- **"NSCT"** — no Pakistani organisation with this acronym could be located. Likely **NAVTTC** or
  **P@SHA**. **Needs your confirmation.**
- **PNC / PCP / PCATP / PVMC** — not yet researched.
- **FPSC CSS detailed syllabus** — identified as a recommended vertical, not yet fetched.
- **ICMAP** — never successfully retrieved across two attempts.

**Key contradictions (do not quote these numbers bare)**
- Education spend **0.8% vs 1.9% of GDP**.
- ACCA Dec-2025 pass rates differ across **five** aggregators.
- Law-GAT attempt limit **5 vs 7**.
- HEC still publishes a **5-year** LLB curriculum after the Supreme Court cut it to **4**.

**Decisions needed from you (6, detailed in `GAPS.md` §D)**
1. What is "NSCT"?
2. Exam Mode vs Mastery Mode — ship both, honestly labelled? *(recommended: yes)*
3. Case law — license PLD/MLD/SCMR, or restrict to public-domain sources? **Legal review required.**
4. Teacher segment — commit, or wait for the device-access data?
5. Journalism digital-security content — accept the political exposure?
6. Wellness — how much self-management does Learms own, and with what clinical review?

---

## 7. Source counts

| Category | Distinct sources cited |
|---|---|
| Peer-reviewed journal articles / meta-analyses | **31** |
| Government / regulator primary sources (HEC, PIE, Finance Div., PEC, ICAP, PM&DC, PBC, KMU) | **17** |
| Algorithm / implementation primary sources (open-spaced-repetition, Anki, rs-fsrs) | **6** |
| Think-tank & institutional reports (PIDE, UNDP, British Council, ASER, World Bank, WHO, CPJ) | **11** |
| Quality journalism (Dawn, Guardian, DW, Foreign Policy, Tribune, Friday Times, NDTV) | **14** |
| Practitioner / industry commentary (labelled [MED]/[LOW] in situ) | **12** |
| **Total distinct sources** | **≈91** |

Every finding in every document carries a citation. Where a source could not be found, the text
says **"not found"** and the item is logged in `GAPS.md`. No finding has been stated without a
source.

---

## 8. Honest assessment of this run

**What went well.** Areas 1, 2, 8 and 9 — the ones Agents 1–3 are actually blocked on — are done to
a usable depth. The corpus surfaced several findings that genuinely contradict the obvious product
plan (skip Socratic chat; plain BKT is broken for this content; summaries are the weakest
technique; referral-based wellness doesn't work in Pakistan), which is the main thing research is
for.

**What did not.** Seven of twelve areas are untouched. Thirteen cross-references point at files
that don't exist yet. The biggest single omission is **G19 — Pakistani device and connectivity
data** — which is cheap to research and which several recommendations quietly depend on.

**Method limitation to keep in mind.** This is search-based, not systematic. Several Pakistani
sources are practitioner commentary rather than peer-reviewed work; those are labelled `[MED]` or
`[LOW]` inline. **No study of any of the core mechanisms — spacing, testing, interleaving, BKT,
FSRS, ITS — has been conducted with Pakistani students or in an Urdu/English bilingual setting.**
Every effect size in this corpus is imported. That is the largest standing risk to the whole
evidence base, and Learms is unusually well-placed to close it with its own data.

---

# Addendum — later in the run

## Documents added since the report above
`SOLUTIONS_BY_CATEGORY.md`, `PAKISTAN_SOLUTIONS.md`, `APIS_COMPARISON.md`, `WELLNESS_CRISIS.md`,
`WELLNESS_SAFE.md`, `OCR_TESSERACT.md`, `HINT_LADDER_DEEP.md`. **Total: 32 files.**

## Findings to add to the top 20

21. **0 of 29 chatbots gave adequate responses to C-SSRS suicide-risk items** (*Sci Rep*, 2025);
    3 of 7 gave a crisis number and delayed it 2+ messages (*JMIR*, 2025). **The only architecture
    that has ever worked keeps detection separate from the conversation and couples it to human
    escalation.** LLMs also show **systematic upward bias when grading their own crisis responses**,
    so an LLM cannot be used to evaluate this.
22. **Students who game the system learn only 2/3 as much** [Baker et al., 2004] — **but the fix
    doesn't work.** The Help Tutor changed help-seeking behaviour significantly and produced **no
    domain-learning gain**; Baker: "reducing help abuse might not contribute to learning gains by
    itself."
23. **Bottom-out hints correlate POSITIVELY with learning** when students spend time on them
    [Shih, Koedinger & Scheines, 2008] — they self-explain. Don't withhold the answer; **prompt
    self-explanation after it.**
24. **Gaming on hard skills is the harm signature** — gamed-hurt students gamed 12% of the time on
    difficult skills vs 2% on easy (p<0.05); gamed-not-hurt students showed no difference. A
    directly implementable discriminator.
25. **Shaming does nothing; extra practice works.** Scooter the Tutor's supplementary exercises let
    gaming students *catch up by post-test*; its emotional expressions had **no** effect on learning.
26. **Data in Pakistan costs USD 0.12/GB — 6th-cheapest in the world**, at 8.9 GB/month average.
    **Data cost is not the constraint.** Network *quality* (−28 Mbps vs regional peers), low-end
    device capability, and a **25% gender gap** are.
27. **Gemini 2.5 Flash-Lite is 15× cheaper than 3.6 Flash on a 50-page PDF** ($0.011 vs $0.165),
    and **Flash pricing doubles on 2027-01-01.** Route by task; never use the free tier in
    production (**it may train on your data**).
28. **Use the LLM as a content factory, not a runtime oracle** — generate hints, explanations and
    bilingual variants offline, human-review them, serve them statically. Converges from three
    independent directions: pedagogy (authored ladders beat generated chat), unit economics
    (~USD 1/month ARPU), and network quality (−28 Mbps).
29. **Tesseract is 38.75% accurate on handwriting (12.5% CER) and must never be used on it**; on
    clean print it is >95% at ~100× the speed and zero cost. Run both, routed by confidence.
30. **OCR on mathematical equations is ~68% accurate** — for an equation-dense curriculum (MDCAT,
    FSc physics), **silently wrong formulae are the worst possible failure mode.** Human review
    is mandatory, not optional.

## New P0 gaps — all require testing, not searching
- **G23** No evidence of *any* LLM's Urdu generation quality. The entire bilingual thesis rests on it.
- **G26** No Urdu/Nastaliq OCR benchmark exists for any engine. Nastaliq is the hardest major script.
- **G29** No verified list of Pakistani crisis helplines. `WELLNESS_CRISIS.md` cannot ship without it.

## The one thing to read if you read nothing else
**`WELLNESS_CRISIS.md`.** It is the only document in this set where being wrong is not a product
problem.
