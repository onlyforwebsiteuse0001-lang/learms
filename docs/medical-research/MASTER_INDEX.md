# Medical Deep Research — Master Index

**Agent:** 6  
**Evidence cutoff:** 2026-09-30  
**Status:** In progress; this index distinguishes completed, partial, and not-started areas

## Evidence rules

- Every substantive claim must cite a source ID registered in `sources/SOURCE_REGISTER.csv` and/or a full citation.
- Mutable recognition, accreditation, fee, exam, salary, and program facts require a retrieval/effective date.
- Missing evidence is reported as **not found**, never inferred.
- Specialty, qualification, institution offering, curriculum, regulator recognition, and job role remain separate entities.

## Core governance and recovery

| File | Purpose | Status |
|---|---|---|
| `RESEARCH_PLAN.md` | Scope, evidence hierarchy, validation plan | Current |
| `PROGRESS-6.md` | Area/checkpoint tracking and source counts | Current |
| `BLOCKERS-6.md` | Constraints and mitigations | Current |
| `DECISIONS-6.md` | Research and modeling decisions | Current |
| `MORNING_REPORT-6.md` | Honest cumulative report | In progress |
| `../SESSION-STATE-6.md` | Recovery state | Current |
| `sources/SOURCE_REGISTER.csv` | Source-level evidence register | 50 records at Area 1 completion |

## Area 1 — Program and specialization taxonomy

| File | Coverage | Status |
|---|---|---|
| `taxonomy/PROGRAMS_COMPLETE.md` | Pakistan program families, regulators, degree/diploma distinctions, conflicts, graph/UI/security implications | Complete for reviewed official sources |
| `specializations/MBBS_SPECIALIZATIONS.md` | FCPS/MCPS/MD/MS pathways, current CPSP inventory, recognition model | Complete; explicit gaps retained |
| `specializations/BDS_SPECIALIZATIONS.md` | FCPS/MCPS/MDS pathways and dental source conflicts | Complete; explicit gaps retained |
| `specializations/PHARMD_SPECIALIZATIONS.md` | 12 optional Pharm.D clusters, credit model, pathway limits | Complete |
| `specializations/NURSING_SPECIALIZATIONS.md` | Post-basic labels, MSN/CNS, midwifery boundary | Complete for official sources reviewed |
| `specializations/ALLIED_HEALTH_SPECIALIZATIONS.md` | AHPC disciplines, nested labels, HEC curricula, DPT | Complete for official sources reviewed |
| `specializations/VETERINARY_SPECIALIZATIONS.md` | DVM domains and PVMC subject-specific PG programs | Complete for official sources reviewed |
| `specializations/EMERGING_FIELDS.md` | Informatics, bioinformatics, precision medicine, AI, HPE, management | Complete for official sources reviewed |
| `specializations/CPSP_SPECIALTY_GRAPH.json` | Machine-readable CPSP evidence snapshot | Valid JSON; 48 first, 44 second, 19 MCPS labels |

## Remaining research areas

| Area | Planned outputs | Status |
|---|---|---|
| 2. Colleges, accreditation, fees | College lists, recognition workflow, fee evidence, rankings caveat | Not started |
| 3. Entry, licensing, postgraduate exams | MDCAT, university admissions, NRE, FCPS, licensing | Not started |
| 4. Student problems | Burnout, depression/anxiety, workload, barriers, Pakistan evidence | Not started |
| 5. Evidence-based solutions | Study science, wellbeing, mentoring, institutional support | Not started |
| 6. Books | Stage- and specialty-specific books with edition/ISBN/chapter evidence | Not started |
| 7. Medical-learning UI/UX | Evidence-derived workflows, accessibility, cognitive load | Not started |
| 8. Careers and salaries | Roles, training, workforce, public/private pay evidence | Not started |
| 9. Pakistan health system | Regulation, public health, disease burden, rural/urban context | Not started |
| 10. Learning/reference/AI tools | Feature, evidence, privacy, and safety comparison | Not started |
| 11. Medical-education papers | Systematic reviews and landmark studies | Not started |
| 12. Privacy/compliance | Pakistan applicability plus comparative controls | Not started |
| 13. Communication | Patient/team/handover/bad-news evidence | Not started |
| 14. Simulation/VR/OSCE | Effectiveness, implementation, debriefing, assessment | Not started |
| 15. Synthesis | Key findings, agent recommendations, contradictions, gaps | Not started |

## Known high-impact conflicts

1. PM&DC's 2024 five-year BDS announcement versus a 2025 inspection proforma structured around four BDS years.
2. CPSP's current fellowship page states 98 programs but visibly enumerates 48 first plus 44 second fellowships (92).
3. CPSP program pages and accredited-institution selectors expose different specialty-label sets.
4. AHPC lists 30 discipline groups while HEC's February 2026 allied-health booklet standardizes ten named BS curricula.
5. Provincial paramedical diploma catalogs differ and must not be promoted to a national taxonomy.

## Current integration assets

### Agent 1

- Program/regulator/qualification axes in `taxonomy/PROGRAMS_COMPLETE.md`
- CPSP labels and unresolved counts in `specializations/CPSP_SPECIALTY_GRAPH.json`
- Prohibited equivalence/inference edges in each specialty file

### Agent 2

- Recognition banners, dated evidence, conflict states, pathway timelines, and `not found` UX guidance

### Agent 3

- Patient-data boundaries for portfolios, images, radiographs, case logs, laboratory/imaging artifacts, and learning simulations

### Agent 4

- No identifiable Agent 4 branch at setup; future cross-agent integration remains pending
