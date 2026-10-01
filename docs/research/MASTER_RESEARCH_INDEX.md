# Master Research Index

**Agent 4 (research only — no code)** · Last updated 2026-09-30
All research lives in `docs/research/`. Nothing here touches application code.

---

## Start here

| If you are… | Read, in this order |
|---|---|
| **The founder** | `MORNING_REPORT_4.md` → `KEY_FINDINGS.md` → `GAPS.md` §D (decisions needed from you) |
| **Agent 1 (Backend)** | `RECOMMENDATIONS.md` §Agent 1 → `FSRS_DEEP.md` → `BKT_DEEP.md` → `SOCRATIC_DEEP.md` → `PROBLEMS_NATURAL_SCIENCES.md` (N3, N6) |
| **Agent 2 (Frontend + Content)** | `RECOMMENDATIONS.md` §Agent 2 → `SOLUTIONS_BY_CATEGORY.md` → `PROBLEMS_BUSINESS.md` → the `PROBLEMS_*` doc for your vertical → `PAKISTAN_FIELDS_TAXONOMY.md` |
| **Agent 3 (Batch 3+4)** | `RECOMMENDATIONS.md` §Agent 3 → `PROBLEMS_SOCIAL_SCIENCES.md` → `PROBLEMS_MEDICAL.md` → `PROFESSIONAL_CERTIFICATIONS.md` |
| **Anyone about to quote a statistic** | `GAPS.md` §B (contradictions) — several widely-repeated numbers are contested |

---

## Document register

### Meta
| Doc | Contents |
|---|---|
| `RESEARCH_PLAN.md` | Ground rules, confidence labels, 12-area deliverable table, per-agent reading order |
| `RESEARCH_PROGRESS.md` | Live progress log, document register, method notes |
| **`KEY_FINDINGS.md`** | **Top 50 findings, ordered by decision impact** |
| **`RECOMMENDATIONS.md`** | **Every recommendation, split P0/P1/P2 by owning agent** |
| **`GAPS.md`** | 19 data gaps, 11 contradictions, 4 brief items not found, 6 decisions needed from a human |
| `MORNING_REPORT_4.md` | Run report in the requested format |
| `MASTER_RESEARCH_INDEX.md` | This file |

### Area 1 — Pakistan fields taxonomy ✅
| Doc | Contents |
|---|---|
| `PAKISTAN_FIELDS_TAXONOMY.md` | NQF levels; 11 broad fields; field→category→root→sub-root (~95 roots); Gen-Ed spine; pre-university; contradictions C1–C5; decisions A1–A6 |
| `pakistan_fields_taxonomy.json` | Machine-readable mirror, v1.0.0, JSON-validated (LLB patched to 4-yr) |
| `UNIVERSITY_COURSES.md` | Market size, −11.8% enrolment, 4-tier university map, `3(2+1)` conventions, decisions C1–C8 |
| `PROFESSIONAL_CERTIFICATIONS.md` | ACCA · ICAP CA · ICMAP/PIPFA · LAT + Law-GAT · MDCAT · PEC · CSS; contradictions X1–X5; decisions B1–B7 |

### Area 2 — Student problems by category ✅ (11/11)
| Doc | Headline |
|---|---|
| `PROBLEMS_NATURAL_SCIENCES.md` | Math anxiety ↔ WM r = −0.40; Hake ⟨g⟩ 0.23→0.48; Johnstone triplet |
| `PROBLEMS_IT_COMPUTING.md` | CS1 67.7% global (small class 80.1% vs large 65.4%); notional machine; 10% IT employability |
| `PROBLEMS_MEDICAL.md` | Rotenstein 27.2%/11.1%/15.7%; Pakistan 57.8% depression (n=1,630); sleep + screen time |
| `PROBLEMS_BUSINESS.md` | ACCA danger papers; 4-in-5 rote; EMI *causes* rote; 13k accountants emigrated |
| `PROBLEMS_LAW.md` | **SC 2025: LLB 5→4 yrs, CLE abolished**; "know the law, can't use it"; no case-law access |
| `PROBLEMS_ENGINEERING.md` | 23.5% unemployment; PEC per-intake-batch accreditation; FYP gap |
| `PROBLEMS_EDUCATION.md` | 26.2m OOSC; 94% of budget = salaries; 40% teacher subject knowledge; teachers as a user segment |
| `PROBLEMS_SOCIAL_SCIENCES.md` | **51% pooled depression; non-medical > medical**; <20% of universities have counselling |
| `PROBLEMS_ARTS.md` | Parental disapproval is the #1 barrier; materials cost > tuition |
| `PROBLEMS_AGRICULTURE.md` | 29.4% unemployment (highest); livestock vs crops; climate shocks |
| `PROBLEMS_MEDIA.md` | Journalism departments closing; 6+ months unpaid salaries; digital-skills gap |

### Area 3 — Solutions (1/3)
| Doc | Headline |
|---|---|
| `SOLUTIONS_BY_CATEGORY.md` | Dunlosky's 10 techniques; distributed practice d = 0.85, practice testing 0.74; interleaving 3× retention; rereading/highlighting/summarization low utility |
| ⬜ `TECH_SOLUTIONS.md` | Not written |
| ⬜ `PAKISTAN_SOLUTIONS.md` | Not written |

### Area 8 — Knowledge tracing / adaptive (2/4)
| Doc | Headline |
|---|---|
| `FSRS_DEEP.md` | DSR model, all formulas, 81% RMSE improvement, ship v4.5, exam-date-bound retention, derived grades, schema |
| `BKT_DEEP.md` | 4 params + update equations, identifiability (van de Sande), degeneracy bounds, **BKT-ST**, BKT over deep KT, schema |
| ⬜ `BANDITS_DEEP.md` | Not written |
| ⬜ `KNOWLEDGE_GRAPH_DEEP.md` | Not written |

### Area 9 — Socratic tutoring (1/3)
| Doc | Headline |
|---|---|
| `SOCRATIC_DEEP.md` | **Interaction plateau**: answer 0.31 → step 0.76 → sub-step 0.40 → human 0.79; 2-sigma debunked; mastery learning alone 1.2 SD |
| ⬜ `HINT_LADDER_DEEP.md` | Not written |
| ⬜ `SOCRATIC_PROMPTS.md` | Not written |

### Areas not yet started
**4** Books (6 docs) · **5** UI/UX (5) · **6** Success factors (6) · **7** Learning analytics (3) ·
**10** OCR (3) · **11** Wellness (3) · **12** APIs/infrastructure (3)

⚠ Several written documents forward-reference files that do not yet exist:
`TECH_SOLUTIONS.md`, `PAKISTAN_SOLUTIONS.md`, `WELLNESS_SAFE.md`, `WELLNESS_CRISIS.md`,
`WELLNESS_PAKISTAN.md`, `HINT_LADDER_DEEP.md`, `KNOWLEDGE_GRAPH_DEEP.md`, `OCR_TESSERACT.md`,
`UI_VISUAL_DESIGN.md`, `SUCCESS_PAKISTAN.md`, `SUCCESS_FINANCIAL.md`,
`BOOKS_COGNITIVE_PSYCHOLOGY.md`, `ANALYTICS_FRAMEWORKS.md`. **These links are currently broken.**

---

## Cross-cutting theses established by this research

**1. The causal chain.**
Recall-only exams + EMI comprehension loss → rote memorisation → graduates who cannot reason →
10% IT employability / 22.6% CS unemployment / 23.5% engineering unemployment → emigration
(13,000 accountants, 11,000 engineers, 5,000 doctors in one year).
*Every `PROBLEMS_*` document independently arrives at a link in this chain.*

**2. The market thesis.**
1:34 staff–student ratio · 0.8% of GDP on education · 94% of the education budget on salaries ·
19% of schools with digital tools · enrolment down 11.8% on cost.
→ **Institutions cannot buy. Students can barely pay. The free tier is the product, B2C is the
only viable motion, and "the small-class condition" is the honest value proposition.**

**3. The pedagogy thesis.**
The gain is in **step-level feedback (0.76), mastery gating (1.2 SD), spacing (0.85), retrieval
(0.74) and interleaving (3× delayed retention)** — all of which are deterministic, testable
engineering. It is **not** in conversational AI sophistication (sub-step 0.40).
*This is the single most de-risking finding in the corpus.*

**4. The honesty thesis.**
Four separate places where the evidence says the comfortable answer is wrong: the interleaving
paradox (worse in-session, 3× better later), Exam Mode vs Mastery Mode, "2 sigma" being 0.79, and
referral-based wellness in a country with no services. **In each case the recommendation is to be
explicit with the user rather than to hide the trade-off.**

---

# Addendum — 2026-09-30 23:30 UTC (supersedes the counts above)

**32 files in `docs/research/` (31 `.md` + 1 `.json`).** Documents added since the index was first
written, with the one thing each is for:

| Document | Area | Read it when you need |
|---|---|---|
| `SOLUTIONS_BY_CATEGORY.md` | 3.1 | The evidence ranking of study techniques. Distributed practice d=0.85, practice testing d=0.74, interleaving 3× at delay; rereading/highlighting/summarising are **low utility** |
| `PAKISTAN_SOLUTIONS.md` | 3.3 | Device, network and pricing reality. **Data cost is not the constraint; device capability, −28 Mbps QoS and the 25% gender gap are.** Price against ARPU PKR 306 |
| `APIS_COMPARISON.md` | 12.1 | LLM cost. Flash-Lite $0.10/$0.40; **Jan-2027 doubling**; Tier 1 for privacy; **LLM as content factory, not runtime oracle** |
| `WELLNESS_CRISIS.md` | 11.2 | **Before touching anything wellness-related.** 0 of 29 chatbots adequate; detector separate from generator + human escalation |
| `WELLNESS_SAFE.md` | 11.1 | Everyday wellness copy and mechanics. Prevention over intervention; no leaderboards; no companion persona |
| `OCR_TESSERACT.md` | 10.1 | Ingestion. Tesseract + confidence-based VLM fallback for print; **never Tesseract on handwriting (38.75%)**; equations need human review |
| `HINT_LADDER_DEEP.md` | 9.2 | The hint engine. **Blocking hint abuse was tested and did not improve learning**; self-explanation after the hint is the intervention |
| `FSRS_DEEP.md` · `BKT_DEEP.md` · `SOCRATIC_DEEP.md` | 8, 9 | The three core algorithms, with schemas |

## A fifth cross-cutting thesis has emerged

The original four theses (causal chain / market / pedagogy / honesty) still hold. The work since
adds a fifth, and it is the one most likely to be ignored:

> **5 — The intuitive safety feature is usually the one that was already tested and failed.**
> Blocking hint abuse changed behaviour but **not learning** (`HINT_LADDER_DEEP.md` §3.2).
> Withholding bottom-out hints removes something that **positively correlates** with learning.
> Shaming gamers with an angry mascot did **nothing**; extra practice let them catch up.
> A conversational wellness agent — the obvious "caring" feature — is the one architecture that
> has **never** worked (`WELLNESS_CRISIS.md`). Free-form Socratic chat scores **0.40** against
> step-level feedback's **0.76** (`SOCRATIC_DEEP.md`).
> **In four independent areas, the empathetic-looking design is the measurably worse one.**
> Learms should be suspicious of any feature whose main argument is that it *feels* caring.

## Status by area

✅ **Complete:** 1 (Pakistan fields), 2 (student problems, 11 docs), synthesis.
🟡 **Partial:** 3 (2/3 — `TECH_SOLUTIONS.md` outstanding) · 8 (2/4 — `BANDITS_DEEP.md`,
`KNOWLEDGE_GRAPH_DEEP.md`) · 9 (2/3 — `SOCRATIC_PROMPTS.md`) · 10 (1/3 — `OCR_PDF_LIBRARIES.md`,
`OCR_GEMINI_VISION.md`; the routing decision in `OCR_TESSERACT.md` covers most of their scope) ·
11 (2/3 — `WELLNESS_PAKISTAN.md`) · 12 (1/3 — `INFRASTRUCTURE.md`, `VECTOR_DB.md`).
⬜ **Not started:** 4 (books), 5 (UI/UX), 6 (success factors), 7 (learning analytics).

**Gaps now G01–G29.** New P0s: **G23** no evidence of any LLM's Urdu capability ·
**G26** no Urdu/Nastaliq OCR benchmark for any engine · **G29** no verified list of Pakistani
crisis helplines. All three block committed roadmap items and all three need *empirical testing*,
not more searching.
