# Gaps — What Is Missing From This Research

**Date:** 2026-09-30
**Purpose:** an explicit inventory of what was not established, so that nobody downstream mistakes
absence of coverage for absence of a problem.

Gaps are graded by **how much they would change the conclusions** if closed:
**H** = would change recommendations · **M** = would add confidence · **L** = completeness only.

---

## 1. Gaps in the evidence base (things nobody publishes)

These are not failures of this research. **The data does not exist publicly.**

| # | Gap | Impact | Notes |
|---|---|---|---|
| G-01 | **ICMAP publishes no pass rates** — none, for any subject, ever | **H** | Makes ICMAP difficulty unmeasurable. Agent 1 must seed ICMAP difficulty from expert priors and label them as such. Directly contrasts with ACCA. `BLOCKERS-7.md` B-003 |
| G-02 | **No published ICMAP pass mark, attempt cap or time limit** for Scheme-2025 | **H** | Students cannot plan against rules that are not published. Do not assert 50%. B-007 |
| G-03 | **No completion or attrition statistics** from any of the three bodies | **H** | Every "X% drop out" claim in circulation is unsourced |
| G-04 | **No graduate destination or salary survey** from any body | **H** | Forces salary work onto Tier-C triangulation. The only Tier-A anchor in the entire market is ICAP's stipend floor |
| G-05 | **No comparable student-population counts** | M | The brief's premise that ICMAP students are most numerous remains unverified. B-005 |
| G-06 | **No peer-reviewed study of ICMAP students exists** | **H** | The largest single evidential hole. Everything about ICMAP student experience is inferred from university-student studies, institute documents, or Tier-D grievance material |
| G-07 | **No peer-reviewed study of ACCA students in Pakistan** | M | Same problem, smaller stakes |
| G-08 | **No usable Tier-D grievance corpus for ICMAP** | M | Generic complaint searches return coaching-centre marketing and Studocu dumps. A different query strategy is needed |
| G-09 | **No study-technique intervention research** for Pakistani accounting students | M | Everything in `solutions/STUDY_TECHNIQUES.md` is derived from exam format or transferred from general learning science, and is labelled accordingly |

**G-01 through G-04 taken together constitute a finding in their own right:** the two Pakistani
bodies publish almost nothing that would let a student evaluate them, while ACCA publishes
per-paper pass rates every session. Learms should render this asymmetry visibly rather than
hiding the empty cells.

---

## 2. Gaps that are fixable with more fetching (retrieval debt)

These would be closed by a few more page fetches. **They are the correct first tasks for any
continuation.**

| # | Gap | Impact | Fix |
|---|---|---|---|
| G-10 | **ICAP CAF: eight paper titles and Group A/B split not captured** | **H** | Fetch ICAP CAF syllabus PDFs. Low effort, high value. **Do this first.** B-010 |
| G-11 | **No authoritative GBP/PKR or USD/PKR rate** | **H** | Fetch https://www.sbp.org.pk/ecodata/rates/. ACCA totals are deliberately never stated in PKR because of this. B-011 |
| G-12 | **IMA (USA) official fee pages not fetched** | M | Fetch imanet.org. Would resolve C-013 (student exam fee: four sources, four numbers) |
| G-13 | **Text of the 26th Constitutional Amendment not retrieved** | **H** | Fetch the Gazette / National Assembly text. Sources disagree between "eliminate riba completely" and "as far as practicable" — legally very different. C-014 |
| G-14 | **ICMAP per-subject syllabus PDFs (18 of them) not fetched** | M | Would confirm whether Islamic finance appears inside other papers, and would yield recommended reading lists |
| G-15 | **Full Scheme-2025 QPPS set not located** | M | Only PM6 (2018/2023 vintage) was retrieved. The mark-allocation argument rests on one subject. B-006 |
| G-16 | **ICMAP exam-cities circular not fetched** | L | Cities were cited from a search snippet. `circular_exam_ol1tosl2_pctme_llg_June2025.pdf` |
| G-17 | **Journal/DOI for Awais & Bigoni (2026)** | L | Only the Kent repository AAM was seen |
| G-18 | **Journal/DOI for 'Perception of University Graduates…'** | L | Only the ResearchGate record was seen; dated ~2018 |
| G-19 | **AAOIFI standards and Pakistan's IFAS not verified** | M | Asserted nowhere in this research precisely because unverified |
| G-20 | **SBP Islamic banking statistics not gathered** | M | Would allow an assessment of whether the 2028 deadline is achievable |

---

## 3. Brief areas with no coverage or thin coverage

The brief specified 15 research areas. Honest status:

| Area | Status | Gap |
|---|---|---|
| 1 Taxonomy | **Covered** | — |
| 2 CMA/ICMAP deep dive | **Mostly covered** | `SOLUTIONS.md`, `BOOKS_RESOURCES.md`, `CAREER_SALARY.md` not written as separate files (content partly absorbed elsewhere) |
| 3 ACCA deep dive | **Covered** | — |
| 4 CA/ICAP deep dive | **Covered** | CAF paper list missing (G-10) |
| 5 Comparison | **Covered** | — |
| 6 Student problems | **Partial** | Only `cma-deep/STUDENT_PROBLEMS.md`. **No dedicated files on psychological problems, tech-skills gap, or institutional problems across all three bodies** |
| 7 Solutions | **Partial** | Only `STUDY_TECHNIQUES.md`. **Nothing on technology, financial solutions, institutional reform, or mental health** |
| 8 Books | **Partial** | Only `CMA_BOOKS.md`. **No ACCA, CA, general or finance book files.** No ISBNs anywhere (deliberate) |
| 9 UI/UX | **Partial** | One file. **No dashboard research, no Excel-UI research, no competitor teardown, no usability testing** |
| 10 Pakistan industry & job market | **Partial** | Only `BRAIN_DRAIN.md`. **No employer landscape, no sector analysis, no Big Four vs industry** |
| 11 Tools & platforms | **NOT DONE** | Nothing written |
| 12 Research papers | **Covered** | — |
| 13 Career paths & salary | **Partial** | Salary covered; **career-path progression not written** |
| 14 Pakistan regulatory / tax / Islamic finance | **Partial** | Islamic finance covered (Tier C only). **No taxation file, no regulatory file** |
| 15 Synthesis | **Covered** | — |

**Four areas are materially incomplete (6, 7, 9, 10), one is untouched (11).**

---

## 4. Methodological gaps

| # | Gap | Impact |
|---|---|---|
| G-21 | **No primary research with students.** Everything about student experience is second-hand | **H** — and unavoidable within this scope, but it must be stated |
| G-22 | **The literature base is two researchers.** Awais and Bigoni account for essentially the entire recent primary-evidence base, both UK-based, one theoretical lens (critical/postcolonial) | M |
| G-23 | **No triangulation of ICMAP's own claims against student outcomes**, because outcome data does not exist (G-03) | M |
| G-24 | **Cost models are Agent 7's own (Tier E).** Inputs are Tier A but the arithmetic, assumptions and exclusions are mine | M — all labelled |
| G-25 | **Mobile-vs-desktop usage unknown** for this population. A written-response editor (the key UI recommendation) is hard on mobile. **Probably the most important unresolved UX question** | **H** |
| G-26 | **No accessibility research** | L |
| G-27 | **Concept difficulty ratings are expert priors**, not measured, except where ACCA pass rates exist | M — flagged in the JSON |

---

## 5. Risks created by these gaps

1. **Over-reliance on ICAP data.** ICAP publishes more than ICMAP, so ICAP findings are stronger. A reader could mistake *better documentation* for *better qualification*. The CMA priority area is, ironically, the least evidenced — **because ICMAP publishes least**.
2. **The Tier-E cost models will be quoted as facts.** They are labelled, but labels get stripped when numbers travel. Anyone reusing PKR 727,300 must carry the "modelled, 2025 rates, body fees only" qualifier.
3. **The 2026 Awais & Bigoni paper is an author-accepted manuscript.** Findings could shift between AAM and version of record.
4. **Islamic finance conclusions rest entirely on Tier-C media reporting.** No primary legal source was retrieved. This is the weakest evidential footing of any major finding, and it supports one of the most consequential recommendations.
5. **Absence of evidence is repeatedly reported as absence of a scheme.** "No ICMAP financial aid found" means not found — not proven non-existent. Stated as such everywhere, but the distinction is easy to lose.

---

## 6. If someone continues this work — the priority order

1. **G-10** ICAP CAF paper list — low effort, closes a structural hole.
2. **G-13** the constitutional text — a live legal ambiguity underpinning a major recommendation.
3. **G-11** SBP exchange rate — unlocks like-for-like cost comparison.
4. **Area 11** tools & platforms — completely untouched.
5. **Areas 6 and 7** — problems and solutions beyond CMA.
6. **G-14** the 18 ICMAP syllabus PDFs — would close G-15, G-19 and part of Area 2.
7. **G-08** a better grievance-search strategy for ICMAP students.
