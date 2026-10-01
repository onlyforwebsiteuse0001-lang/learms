# UI/UX for Accounting Learning — Requirements Derived From Evidence

**Area:** 9
**Primary consumer:** Agent 2
**Researched:** 2026-09-30

**Method note:** this is not a survey of pretty ed-tech interfaces. Every requirement below is
derived from something established elsewhere in this research — an exam format, a fee rule, a
published pass rate, or an interview finding. Requirements with no such derivation are excluded.

---

## 1. Requirements that come from the exam format

### 1.1 The answer surface must match the exam, and for ICMAP that means writing
ICMAP's published QPPS for PM6 allocates **30 marks to report writing (75 minutes)** and
**30 marks to presentation (15 minutes)** against **20 marks of MCQ (10 minutes)**.

An interface offering only MCQ practice trains 20% of the paper. **The single most differentiated
UI decision available to Learms in the ICMAP market is a timed, structured written-response
editor** — with a visible timer, a word/section scaffold (situation → analysis → recommendation),
and feedback on structure rather than only on content.

*Caveat: this QPPS is Scheme-2018/2023 vintage and the full Scheme-2025 set was not located
(`../BLOCKERS-7.md` B-006). The direction is well-evidenced; the exact split per subject is not.*

### 1.2 Practice must be computer-based, because the exam is
ICMAP moved to **CBE**, with a remote-access variant. Paper-based mock practice now mismatches the
exam channel. The practice UI should approximate the CBE experience: on-screen only, no scratch
workspace beyond what the exam provides, forward/back navigation as in the real interface.

### 1.3 Timers are a core feature, not a setting
Ten minutes for 20 marks of MCQ; 75 minutes for one report. The binding constraint in ICMAP
papers is time, not knowledge. Timing should be on by default and reported as a first-class
metric alongside accuracy — "you were 40% over time on report writing" is more actionable than a
score.

### 1.4 Question metadata should carry the standard reference
ICMAP model-paper MCQs are written against named instruments: IAS 19, IAS 20, IFRS 2, IFRS 9,
ISA 200, Companies Act 2017 s.87. Tagging questions by standard lets a student revise the way the
examiner writes. This is a data-model requirement as much as a UI one.

---

## 2. Requirements that come from the money

### 2.1 Fee and deadline surfaces, per body
Three different fee architectures produce three different optimal behaviours, and none of them
are intuitive:

| Body | UI element | Why |
|---|---|---|
| ACCA | **Standard-entry deadline countdown** | Late entry costs **+125–156%**. Dec-2026 standard entry closed 2 Nov; late 9 Nov. A one-week slip on an Applied Skills paper costs £249. |
| ICAP | **Batch calculator** | 4 CAF papers together ≈ PKR 5,200/paper vs 7,000 sat singly. |
| ICMAP | **Attempt counter with the double-fee cliff** | Legacy students pay double after six attempts. No batching benefit exists, so the UI should *discourage* over-loading a sitting. |

### 2.2 A CAT–SFS eligibility check, shown early and unprompted
Two questions — HSSC percentage and family monthly income — determine access to **≥75% tuition
discount**, **PKR 2,000 registration** and **PKR 1,000/subject exam fees**. This is the most
valuable under-claimed benefit identified in this research.

**Design constraint from Agent 3:** this collects household income, often from minors. Explicit
consent, minimal retention, never used for segmentation or pricing.

### 2.3 Never render a converted currency without a dated rate
ACCA fees are GBP. Any PKR figure is a snapshot that drifts with the exchange rate.
Display as **"£160 (≈PKR X at the SBP rate on DATE)"** — never a bare PKR number.
*`../BLOCKERS-7.md` B-011.*

### 2.4 Show total cost by entry route, not a single headline number
The 12-year ICMAP route costs ≈PKR 727,300 and the 16-year route ≈PKR 463,900. A single "CMA
costs X" figure is wrong for two-thirds of users. Entry route is the first question the UI should
ask, and it should drive cost, course count and timeline throughout.

---

## 3. Requirements that come from the students

### 3.1 Every worked example needs a Pakistani version
Two peer-reviewed studies, 48 interviews across students, educators and policymakers, one shared
conclusion. Students asked for **"local jeweller shops or restaurants"** instead of **"data from
Apple and Microsoft"**, and said **"Enron Enron Enron. I am tired of this name."**

**UI implication:** make locality a visible, filterable attribute of content, and expose the gap.
A student should be able to see "this topic has no Pakistani example yet" — and so should the
authoring team.

### 3.2 Feedback must be anonymous to work at all
Bigoni & Awais apply James Scott's **infrapolitics**: this population resists invisibly because
open criticism is unsafe against asymmetric institutional power. A feedback widget requiring
attribution will systematically fail to surface the problems it exists to find.

**UI implication:** default to anonymous. Do not ask "can we contact you about this?" in the same
step. Do not show a name field.

### 3.3 Do not lead with gamification
The general literature supports gamification; the Pakistani evidence says disengagement is driven
by judged irrelevance of content. Students who call themselves "robots" and "beasts of burden"
are unlikely to respond well to further instrumentation.

**UI implication:** no streaks, badges or leaderboards in v1. Revisit once localised content
exists and engagement can be measured against it.

### 3.4 Progress must be measured against the official syllabus
78% of surveyed Pakistani accounting graduates reported roughly half their courses were completed
in class (dated ~2018; structural insight, not a current statistic). A progress bar that tracks
"what my teacher covered" hides the gap.

**UI implication:** two distinct progress tracks — *official syllabus coverage* and *your
activity* — shown side by side. The divergence between them is the insight.

---

## 4. Requirements that come from the data's honesty

### 4.1 Render "not published" as a visible state, not an omission
ICMAP publishes **no pass rates, no pass mark, no attempt cap, no time limit, no completion
statistics**. ACCA publishes per-paper pass rates every session.

If the UI simply omits the empty cells, it hides an asymmetry that students deserve to see. Show
**"Not published by the institute"** explicitly. It is informative, it is honest, and it is a
genuine differentiator against comparison pages that invent numbers.

### 4.2 Distinguish measured difficulty from estimated difficulty
An ACCA difficulty score derived from a published 40% pass rate and an ICMAP difficulty score
derived from expert judgement must not look identical in the UI. Different iconography, and a
tooltip stating the basis.

*This also protects against a real error: ACCA's data shows the difficulty cliff is at Applied
Skills (PM 40%), not Strategic Professional. A UI that infers difficulty from syllabus level
would show the opposite of the truth.*

### 4.3 Source attribution should be visible, not buried
Every substantive claim in this research carries a tier and a URL. If Learms surfaces research-
derived content, surfacing its provenance is both an honesty requirement and, in a market where
`../CONTRADICTIONS.md` documents a publisher contradicting itself **2× on salary within 9 days**,
a competitive advantage.

---

## 5. Excel and spreadsheet UI

ICMAP **M4 Digital Accounting & Financial Modelling** and **PTM1 Data Analytics & Visualisation
(Power BI)** make spreadsheet and BI skills examinable.

**What the evidence supports:**
- A spreadsheet-like practice surface is justified by the syllabus, not merely fashionable.
- **Python and ERP were dropped** from ICMAP's practical module titles in the 2025 revision. Do
  not build Python tooling for ICMAP students on the assumption it is examinable — it is not.
- Power BI is named explicitly in PTM1, so screenshots and walkthroughs should use Power BI
  rather than a generic BI tool.

**What the evidence does not support:** any claim about *how* these are assessed. No QPPS for M4
or PTM1 was located. Building an assessment UI for them would be guessing.

---

## 6. What was not researched

Stated plainly, because the brief's Area 9 is broader than what was covered:

- **No usability testing** with Pakistani accounting students. None.
- **No competitor UI teardown** of Pakistani ed-tech platforms.
- **No accessibility audit** considerations specific to this population.
- **No mobile-vs-desktop usage data** for Pakistani students — a significant gap, given that
  mobile-first is likely and a written-response editor (§1.1) is hard on mobile. **This tension
  is unresolved and is probably the most important open UX question in this file.**
- **No dashboard design research** (brief Area 9 explicitly lists dashboards).
- **No exam-simulation UI review** of how ICMAP's actual CBE interface looks — only its format is
  known from model papers.

---

## 7. Sources

All accessed 2026-09-30.

| Source | Tier | Used for |
|---|---|---|
| ICMAP QPPS PM6 — https://www.icmap.com.pk/cma_pattern_structure_question_paper/PM6.pdf | A | §1.1, §1.3 |
| ICMAP CBE model papers — https://www.icmainternational.com/ExamNotice_PDF/ModelPapers-CBE-[ML2_to_SL2_and_LLG].pdf | A | §1.2, §1.4 |
| ICMAP Policy Guidelines Study Scheme-2025 | A | §2.4, §5 |
| ICMAP fee structure / exam fee structure | A | §2.1, §2.4 |
| ACCA Pakistan fees and charges | A | §2.1, §2.3 |
| ACCA pass rates | A | §4.2 |
| ICAP fees w.e.f. 1 Jul 2026 | A | §2.1 |
| ICAP CAT–SFS | A | §2.2 |
| Bigoni & Awais (2025), *Accounting Forum* 49(2), DOI 10.1080/01559982.2024.2309595 | A | §3.1, §3.2, §3.3 |
| Awais & Bigoni (2026), Kent Academic Repository 112699 | A (AAM) | §3.1 |
| 'Perception of University Graduates about Accounting Education in Pakistan', ResearchGate 338885916 | B (dated) | §3.4 |
