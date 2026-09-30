# Accounting Specialisations and the Concept Taxonomy

**Area:** 1 (taxonomy) — companion to `PROGRAMS_COMPLETE.md`
**Primary consumer:** Agent 1 (knowledge graph), Agent 2 (navigation/content UX)
**Machine-readable artifact:** `../data/accounting_concept_graph_seed.json`
**Researched:** 2026-09-30

---

## 1. Purpose

`PROGRAMS_COMPLETE.md` catalogues *qualifications*. This file catalogues *knowledge* — the
domains and concepts a Pakistani accounting student actually has to learn, organised so Agent 1
can seed a prerequisite DAG and Agent 2 can build navigation that isn't just a list of exam codes.

The distinction matters. A qualification is a **regulatory container**; a specialisation is a
**body of knowledge**. Students conflate them and then discover, three years in, that their
qualification doesn't lead where they thought.

---

## 2. The eight core domains

| # | Domain | Concept prefix | Concepts seeded | Peak difficulty | Where it lives |
|---|---|---|---|---|---|
| 1 | Financial Accounting & Reporting | `acc.` | 25 | 5 | ICMAP O1→M1→S1; ACCA FA→FR→SBR; ICAP PRC→CAF→CFAP |
| 2 | Cost & Management Accounting | `cost.` | 16 | 5 | ICMAP O6→M5→S6; ACCA MA→PM→APM |
| 3 | Financial Management | `fin.` | 8 | 5 | ICMAP S5; ACCA FM→AFM |
| 4 | Audit & Assurance | `aud.` | 7 | 4 | ICMAP S4 + PTM4; ACCA AA→AAA; ICAP CAF/CFAP |
| 5 | Taxation | `tax.` | 5 | 5 | ICMAP M2→S2; ACCA TX→ATX |
| 6 | Law, Governance & Ethics | `law.` / `gov.` | 5 | 4 | ICMAP O3→M6→S3; ACCA LW→SBL |
| 7 | Digital & Quantitative | `dig.` / `quant.` / `econ.` | 9 | 4 | ICMAP O2/O4/O5/M4/PTM1 |
| 8 | Strategy | `strat.` | 3 | 4 | ICMAP S6 + PTM6; ACCA SBL/APM |

**78 concepts, 89 ingestible prerequisite edges, verified acyclic.**

### Domain difficulty profile

Financial Accounting, Cost Accounting, Financial Management and Taxation all reach difficulty 5.
Audit peaks at 4. That is a deliberate judgement, not a gap: audit's difficulty is in *judgement
under ambiguity*, which is badly modelled by a difficulty integer and better modelled by
case-based assessment. Flagged for Agent 1 — **a single `difficulty` scalar is the wrong model for
audit and strategy content**, and a mastery estimate built only on MCQ correctness will
systematically overstate competence in exactly the areas where ICMAP's own exam format (report
writing 30 marks, presentation 30 marks in PM6) says judgement matters most.

---

## 3. The three career specialisation tracks

Derived from where the qualifications actually place people, not from marketing copy.

### Track A — Practice / Assurance
**Domains:** Audit (deep) → Financial Reporting (deep) → Law & Ethics → Tax
**Best-fit qualification:** CA (ICAP). Statutory audit sign-off in Pakistan is an ICAP function.
**Entry economics:** stipend-funded (PKR 27,500 → 93,500/month).
**Concept spine:** `acc.fin_statements` → `aud.objective` → `aud.risk` → `aud.evidence` → `aud.report`
**Critical 2026 note:** CFAP-03 Sustainability Reporting & Assurance is new. Assurance over
non-financial information is now a practice-track requirement, not an elective interest.

### Track B — Industry / Management Accounting
**Domains:** Cost & Management (deep) → Financial Management → Digital → Strategy
**Best-fit qualification:** CMA (ICMAP). This is genuinely ICMAP's home ground.
**Entry economics:** self-funded (−PKR 727,000 on the 12-year route).
**Concept spine:** `cost.classification` → `cost.overhead` → `cost.standard` → `cost.variance` →
`cost.performance` → `strat.resources`
**Sectors:** manufacturing, FMCG, textiles, energy, utilities — where a costing system exists.

### Track C — Corporate Finance / Advisory
**Domains:** Financial Management (deep) → Valuation → Reporting → Strategy
**Best-fit qualification:** ACCA (+ CFA for buy-side), or CA.
**Concept spine:** `fin.tvm` → `fin.npv` → `fin.wacc` → `fin.valuation` → `fin.risk_mgmt`
**Note:** `fin.tvm` is the single highest-leverage node in the graph. It is a prerequisite for
NPV, IRR, WACC, valuation, risk management, lease liabilities **and** amortised-cost financial
instruments — six downstream concepts across three domains. A student weak on time value of money
is silently blocked from a third of the advanced syllabus. **Agent 1 should treat `fin.tvm` as a
diagnostic gateway concept.**

---

## 4. Cross-cutting specialisations not owned by any one qualification

| Specialisation | Status in Pakistan | Where taught | Gap |
|---|---|---|---|
| **Islamic finance / AAOIFI accounting** | Material and growing; Pakistan has a constitutional and State Bank mandate to eliminate *riba* | Fragmented; not a named core paper in ICMAP Scheme-2025 | **No concepts seeded — real gap.** See `../pakistan/ISLAMIC_FINANCE.md` |
| **Sustainability / ESG reporting** | Now mandatory-adjacent: new in **both** ICMAP S1 and ICAP CFAP-03 in 2025 | Both bodies, simultaneously | Seeded as one concept; under-decomposed. IFRS S1/S2 deserve 6–8 concepts |
| **Forensic accounting** | Demand asserted, not evidenced | Not a core paper in any of the three | No concepts seeded |
| **Public sector accounting** | Large employer (AGP, provincial); PIPFA-adjacent | Thin in all three core bodies | No concepts seeded |
| **Data analytics** | Newly formalised | ICMAP PTM1 (Power BI), M4 | Seeded, shallow |
| **Generative AI** | New in 2025 | ICMAP O2 only | Seeded as an **isolated node** — see §5 |

**Simultaneity finding:** ICMAP and ICAP both introduced sustainability content in their 2025
scheme revisions, independently. Two competing bodies converging on the same addition in the same
year is strong evidence this is a genuine market signal rather than curriculum fashion. It is the
single clearest "this is where the field is moving" datapoint in this research.

---

## 5. Structural findings for Agent 1

### 5.1 `dig.genai` is an isolated node — and that's the finding
ICMAP O2 "Gen. AI & Business Productivity" has **no prerequisite and no dependent** in the concept
graph. It does not build on accounting knowledge and nothing in the syllabus builds on it. It was
bolted onto the foundation level as a standalone competency.

Implications:
- Agent 1's graph traversal must not assume connectivity. Isolated concepts are legitimate.
- Agent 2 should not place it in a "learning path" — it has no path.
- Pedagogically, it is the most reversible part of the 2025 revision.

### 5.2 Concepts are student-owned in Agent 1's schema — this doesn't scale
`Concept.student_id` is NOT NULL with `uq_concept_student_course_name`. Seeding 78 canonical
concepts per student duplicates them per enrolment, and every expert correction to a prerequisite
edge would have to be replayed across every student's private copy. Recommend a nullable/system
`student_id` for canonical concepts with per-student *mastery* held separately. Recorded in
`../RECOMMENDATIONS.md`.

### 5.3 Prerequisite strength is not binary
Five seeded edges are cross-domain associations (confidence 0.6–0.65), not true blockers —
e.g. `acc.ratio → dig.powerbi`. A true prerequisite means *you cannot learn B without A*. A weak
edge means *A helps*. Collapsing both into one `Prerequisite` row will produce a graph that
over-blocks students. Suggest an edge `kind` of `hard` / `soft`.

### 5.4 Difficulty is body-relative, not absolute
ACCA's published pass rates show `cost.*` concepts at Applied Skills (PM, 40–45%) are empirically
harder than most Strategic Professional papers. A difficulty score inherited from syllabus level
would get this backwards. Where pass-rate evidence exists, prefer it. Where it does not — all of
ICMAP — the score is an expert prior and should be labelled as such in the UI, not shown as fact.

---

## 6. Sources

All accessed 2026-09-30. Concept-level sourcing is in the `evidence` field of every node and edge
in `../data/accounting_concept_graph_seed.json`.

| Source | Tier | Used for |
|---|---|---|
| ICMAP Policy Guidelines Study Scheme-2025 — https://www.icmap.com.pk/StudentNotices_PDF/cir_edu_15072025.pdf | A | Course structure, PTM titles |
| ICMAP Syllabus Guide — https://www.icmap.com.pk/syllabus.aspx | A | Course titles and codes |
| ICMAP CBE Model Papers — https://www.icmainternational.com/ExamNotice_PDF/ModelPapers-CBE-[ML2_to_SL2_and_LLG].pdf | A | Verbatim concept attestation (IFRS 2/9, IAS 19/20, throughput, scepticism) |
| ICMAP Study Scheme 2018 (updated 2023) — https://www.icmainternational.com/StudentNotices_PDF/StudyScheme2018_Updated_in_2023_[w.e.f.Fall2023forFeb.2024Exam].pdf | A | Legacy syllabus text for partnership law, ethics |
| ICAP Education Scheme 2025 Principles and Structure | A | CFAP-03 sustainability |
| ACCA pass rates — https://www.accaglobal.com/us/en/student/exam-support-resources/pass-rates-for-acca-qualifications.html | A | Empirical difficulty calibration |
| IFRS/IAS/ISA standard numbering | A | Concept naming and scope |
