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
| `sources/SOURCE_REGISTER.csv` | Source-level evidence register | 109 unique records through Area 4: 89 official/institutional and 20 peer-reviewed |

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

## Area 2 — Colleges, accreditation, fees, and admission evidence

| File | Coverage | Status |
|---|---|---|
| `colleges/ALL_RECOGNIZED_COLLEGES.md` | Four PM&DC directory totals, recognition workflow, hospital/status distinctions, verification checklist | Complete for reviewed official evidence; row-export gap explicit |
| `colleges/PMDC_COLLEGE_REGISTER_2026-09-30.json` | Dated machine-readable category totals and 40 directly visible rows | Valid JSON; deliberately marked incomplete |
| `colleges/TOP_MEDICAL_COLLEGES.md` | No-current-official-ranking finding and source-separated comparison method | Complete |
| `colleges/FEE_STRUCTURES.md` | 2025 baseline and March/August 2026 fee notifications, payment rules, gaps | Complete for reviewed PM&DC rules |
| `colleges/PRIVATE_FEE_CAPS_2026.csv` | 35 append-only dated fee-cap observations from two PM&DC notifications | Structurally valid; exact source wording retained |
| `colleges/ADMISSION_CHANCES.md` | Eligibility, aggregate formula, segmentation, historical comparison, privacy boundary | Complete without unsupported probability |
| `colleges/COLLEGE_COMPARISON_SCHEMA.yaml` | Claim-specific comparison/evidence schema and prohibited inferences | Complete |

## Area 3 — Entry, licensing, transfer, and postgraduate examinations

| File | Coverage | Status |
|---|---|---|
| `exams/MDCAT_COMPLETE.md` | Legal role, 2026 pattern/date versions, latest final syllabus found, non-probability boundary | Complete for reviewed official evidence |
| `exams/PMDC_LICENSING_AND_HOUSE_JOB.md` | Local/foreign pathways, provisional/full registration, MBBS/BDS rotations, hospital/stipend/fee conflicts | Complete; mutable fees flagged |
| `exams/NRE_COMPLETE.md` | Medical/dental 2024 standards, 2026 Step-I notice, 2023–24 threshold change | Complete; exact future notices remain mutable |
| `exams/NEB_COMPLETE.md` | Medical/dental target-year transfer exams, vacancy boundary, two-/three-month conflict | Complete for 2024-and-onwards standards |
| `exams/FCPS_EXAM_PATHWAY.md` | FCPS-I, induction, RTMC, IMM, FCPS-II, attempt and calendar rules | Complete at general level; specialty prospectus controls |
| `exams/IMM_AND_MCPS_EXAMS.md` | IMM role, MCPS pathway, specialty-dependent formats, qualification registration boundary | Complete at general level |
| `exams/INTERNATIONAL_EXAMS_USMLE_PLAB.md` | ECFMG/USMLE and GMC/PLAB high-level boundaries | Complete at high level; no immigration claims |
| `exams/EXAM_CALENDAR_2026.csv` | Dated PM&DC/CPSP schedule observations with non-inferred status | Structurally valid |
| `exams/EXAM_PATHWAY_GRAPH.json` | Machine-readable stage/edge model and prohibited equivalences | Valid JSON |

## Area 4 — Medical-student problems and wellbeing

| File | Coverage | Status |
|---|---|---|
| `student-problems/STUDENT_PROBLEMS_OVERVIEW.md` | Multidomain evidence map, Pakistan boundary, institutional responsibilities | Complete for reviewed evidence |
| `student-problems/DEPRESSION_ANXIETY_AND_SUICIDAL_IDEATION.md` | Global and Pakistan estimates, screening/diagnosis boundary, digital safety | Complete; crisis-contact gap explicit |
| `student-problems/BURNOUT_AND_LEARNING_ENVIRONMENT.md` | Global review, incompatible Pakistan instruments, learning-environment and system factors | Complete for reviewed studies |
| `student-problems/SLEEP_FATIGUE_AND_DIGITAL_DISTRACTION.md` | Sleep meta-analysis, Pakistan stress/sleep study, smartphone-use evidence | Complete with causal limits |
| `student-problems/MISTREATMENT_HARASSMENT_AND_DISCRIMINATION.md` | Global/Pakistan prevalence signals, hierarchy, HEC procedure, privacy boundary | Complete; current outcome-data gap explicit |
| `student-problems/FINANCIAL_PRESSURE_AND_CAREER_UNCERTAINTY.md` | Qualitative mechanisms, burnout association, support standard, cost gaps | Complete; no national prevalence claim |
| `student-problems/MEASUREMENT_AND_INTERPRETATION_LIMITS.md` | Screening, study-design and prohibited-inference rules | Complete |
| `student-problems/HELP_SEEKING_AND_SAFETY_BOUNDARIES.md` | Treatment gap, stigma, digital limits, distinct reporting/care routes | Complete; launch verification gaps explicit |
| `student-problems/PAKISTAN_EVIDENCE_GAPS.md` | National, longitudinal, service, suicide, harassment and equity gaps | Complete |
| `student-problems/PROBLEM_EVIDENCE_MATRIX.csv` | 23 study/guideline observations with design, sample and limitation fields | Structurally valid |
| `student-problems/STUDENT_PROBLEM_ONTOLOGY.json` | Non-diagnostic domains, typed associations, support nodes and product constraints | Valid JSON |

## Remaining research areas

| Area | Planned outputs | Status |
|---|---|---|
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
6. PM&DC's paginated college directories reported 178 entries, but the reviewed rendering exposed only the first ten rows per category; indexed snippets showed older/different dental values.
7. The March and August 2026 PM&DC fee notifications contain dated institution-specific observations; Al Aleem's later August value differs from its March value and must not be destructively merged.
8. HEC's official ranking page exposes archives through 2015; no current official national medical-college league table was found.
9. NRE's official threshold changed from 70% in 2023 to 60% plus Angoff wording in 2024; the 2024 medical basic-science table rows sum to 56 despite a stated total of 60.
10. The Registration Regulations 2023 say three months for a target-year NEB migration window while the later 2024 NEB standards say two months.
11. The Registration Regulations 2023 and current PM&DC FAQ display different local provisional-license and good-standing fees.
12. Pakistan depressive-symptom studies range from 9% to 94% with I²=99.15%; one national point estimate would conceal major instrument, cutoff, setting, and sampling differences.
13. Pakistan burnout studies use incompatible MBI-HSS, BCSQ-12, BAT-23, and dimension-specific measures; their percentages are not a trend series.

## Current integration assets

### Agent 1

- Program/regulator/qualification axes in `taxonomy/PROGRAMS_COMPLETE.md`
- CPSP labels and unresolved counts in `specializations/CPSP_SPECIALTY_GRAPH.json`
- Prohibited equivalence/inference edges in each specialty file
- Claim-specific college model and prohibited inference edges in `colleges/COLLEGE_COMPARISON_SCHEMA.yaml`
- Versioned recognition, seat, fee, hospital, and admission observations
- Exam and licence-stage nodes/edges in `exams/EXAM_PATHWAY_GRAPH.json`; scheduled events do not imply completion
- Non-diagnostic problem nodes and typed association/policy edges in `student-problems/STUDENT_PROBLEM_ONTOLOGY.json`

### Agent 2

- Recognition banners, dated evidence, conflict states, pathway timelines, and `not found` UX guidance
- Evidence-separated college comparison with no default composite rank
- Admission aggregate and historical-comparison UX without false probability
- Versioned exam cards separating syllabus, sitting, component, attempt, and result; no pass-rate promises
- Learner-controlled support discovery with no composite wellbeing score, college ranking, diagnosis, or causal rewrite

### Agent 3

- Patient-data boundaries for portfolios, images, radiographs, case logs, laboratory/imaging artifacts, and learning simulations
- Do not ingest applicant-level names, parent names, dates of birth, roll/form numbers, or identity numbers from merit-list PDFs when aggregate observations suffice
- Licensing and exam checklists should store verification status and minimum metadata, not CNIC/passport scans or patient-identifiable logbook cases
- Distress and harassment routes are separate; do not create silent risk monitoring or an unmandated complaint repository

### Agent 4

- No identifiable Agent 4 branch at setup; future cross-agent integration remains pending
