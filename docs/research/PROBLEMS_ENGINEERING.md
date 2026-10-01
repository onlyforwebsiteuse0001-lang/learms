# Problems of Engineering Students

**Agent 4 — Area 2.6** · Last updated 2026-09-30

---

## 1. Unemployment — the number doubled in two years

### Topic: Engineering graduate unemployment in Pakistan
### Source: Ahsan, H. & Khan, M. J., "Disaggregating the Graduate Unemployment in Pakistan" (PIDE), using Labour Force Survey data; coverage in Dawn/Livemint/Khabarhub
### Key Finding **[HIGH on the data, MED on attribution]**

| Group | 2018-19 | 2020-21 |
|---|---|---|
| **Engineering graduates** | **11%** | **23.5%** |
| Computer science | 14.2% | 22.6% |
| Agriculture | 11.4% | 29.4% |
| All graduates | 14.9% | 16.1% |
| National unemployment (all) | ~6.3% | — |

**Engineering graduate unemployment more than doubled in two years and is now ~3.7× the national
rate.** PIDE's four attributed causes: (1) degree–demand misalignment, (2) **weak university–industry
linkage**, (3) growing labour force, (4) macroeconomic contraction.

⚠ The 2018-19 → 2020-21 window overlaps COVID, so part of the doubling is cyclical. Subsequent
context (Pakistan ranked **99/139 on the Global Innovation Index 2025**, innovation *inputs* down to
**124th**) suggests the structural component is real. **[CONTESTED magnitude, agreed direction.]**

### Citation
- https://pide.org.pk/research/disaggregating-the-graduate-unemployment-in-pakistan/
- https://www.livemint.com/news/world/graduates-face-higher-unemployment-in-pakistan-here-s-why-11681085527407.html
- https://english.khabarhub.com/2025/07/504959/

---

## 2. Accreditation as a hidden failure mode

### Topic: PEC accreditation and its per-batch granularity
### Source: Pakistan Engineering Council — Accreditation pages
### Key Finding **[HIGH — primary source]**

- PEC accredits programmes at **Level-I** or **Level-II**; Level-II corresponds to the
  outcome-based-education (Washington Accord aligned) regime.
- Accreditation is granted **per intake batch**, and PEC's own lists are written as
  *"B.Sc. Civil Engineering (From Intake of Batch 2010 to 2017)"*. A student two batches later may
  be in a non-accredited cohort **at the same university, on the same programme**.
- PEC registration as an engineer is a hard employment gate in Pakistan.
- PEC publishes curricula in cohorts: 2020 (13 disciplines), 2023 (5), 2024 (7).

### Relevance to Learms
- Store accreditation at `(university, programme, intake_batch)`. A "**is my batch accredited?**"
  lookup is a cheap, genuinely differentiated, high-anxiety-relief feature. PEC's own site presents
  this data almost unusably.
- It also implies a **content-versioning** need: PEC-2020, PEC-2023 and PEC-2024 curricula differ,
  so "Mechanical Engineering" content must be tagged to a curriculum cohort.

### Citation
- https://www.pec.org.pk/accredition/
- https://www.pec.org.pk/accredition/programs-under-level-1/
- https://www.pec.org.pk/curriculum-fee-structure/all-curriculums/

---

## 3. Theory–practice disconnect and weak research foundation

### Key Finding **[MED]**
Converging, consistently-reported (but not experimentally measured) causes:
- "Outdated syllabi, inadequate training facilities, and poor industry-academia linkages" are cited
  directly as causes of engineering/CS unemployment [Khabarhub, 2025].
- **Research funding is minimal** and higher education is "disconnected from industry needs"
  [Pakistan Observer, 2026].
- **Apprenticeship programmes remain limited**, leaving graduates unprepared for employment; **58%
  of employers report difficulty finding appropriate workers** [Pakistan Observer, 2026] **[MED —
  methodology unpublished]**.
- Structural: HEC's national **1:34 staff–student ratio** (58,814 teachers / ~2m students,
  Economic Survey 2024-25) makes design-studio and lab supervision arithmetically thin.
- Curriculum revision cycle is nominally 3 years; in practice several PEC/HEC curricula run much longer.

### Relevance to Learms
- **Engineering is problem-solving-dominant**, the *inverse* of MDCAT's 70%-recall profile. The
  pedagogy weighting must flip: Socratic/worked-example/problem-solving heavy, flashcards light.
  (See `PROFESSIONAL_CERTIFICATIONS.md` B3 and `BOOKS_COGNITIVE_PSYCHOLOGY.md` on the
  worked-example effect and its expertise reversal.)
- **Hake's FCI result (0.23 → 0.48 normalized gain) is directly transferable** to engineering
  mechanics, thermodynamics, circuits and statics — the same conceptual-inventory tradition exists
  for those subjects (Concept Inventories for Statics, Thermodynamics, Signals & Systems, Dynamics).
  **Recommendation: adopt the concept-inventory pattern per engineering subject** —
  pre-test → interactive engagement → post-test → show normalized gain.
- **Simulation > equipment.** With weak lab provision, circuit/structure/thermo simulators are a
  genuine substitute good, not a gimmick. But per `PROBLEMS_NATURAL_SCIENCES.md` §5, they must
  bridge observation → model → symbol, not just animate.
- **Design projects and FYP support** map directly onto HEC's mandatory capstone requirement
  (3–6 credit hours in every BS). Every engineering student in Pakistan does a final-year project
  and almost none get adequate supervision at a 1:34 ratio. **This is an obvious, under-served,
  high-intent product surface.**

---

## 4. Actionable summary

| # | Finding | Build decision | Owner |
|---|---|---|---|
| G1 | Engineering unemployment 23.5%, ~3.7× national | Career/portfolio/industry-skills layer is core | Agent 3 |
| G2 | PEC accreditation is per intake batch | `(university, programme, batch)` accreditation lookup | **Agent 1** |
| G3 | PEC curricula in 2020/2023/2024 cohorts | Tag engineering content to a curriculum cohort | Agent 2 |
| G4 | Engineering = problem-solving dominant | Flip pedagogy weights vs MDCAT; worked examples + Socratic | **Agent 1** |
| G5 | Concept inventories exist for engineering subjects | Pre/post concept-inventory pattern; show normalized gain | Agent 2 |
| G6 | Weak labs | Simulators as bridge artefacts, not decoration | Agent 2 |
| G7 | Mandatory capstone + 1:34 supervision ratio | **FYP support** is an obvious under-served surface | Agent 3 |
| G8 | Weak industry linkage, limited apprenticeships | Industry-skills content (CAD, PLC, MATLAB, site practice, standards) | Agent 3 |

## Gaps / Not found
- No Pakistani FCI-equivalent conceptual-gain data.
- No survey of engineering lab equipment provision.
- No Pakistani engineering-student attrition/dropout rate.
- PEC pass/registration statistics not located.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Think tank | PIDE — Disaggregating Graduate Unemployment in Pakistan | https://pide.org.pk/research/disaggregating-the-graduate-unemployment-in-pakistan/ |
| Primary | Pakistan Engineering Council — Accreditation (Level-I/II, per batch) | https://www.pec.org.pk/accredition/ |
| Primary | PEC — All curricula (2020/2023/2024) | https://www.pec.org.pk/curriculum-fee-structure/all-curriculums/ |
| Primary | Pakistan Economic Survey 2024-25 Ch.10 (58,814 teachers) | https://www.finance.gov.pk/survey/chapter_25/10_Education.pdf |
| News/analysis | Khabarhub (2025) — GII 2025 rank 99/139, inputs 124th | https://english.khabarhub.com/2025/07/504959/ |
| Report (secondary) | Pakistan Observer via The Hawk (2026) — 58% employers, apprenticeships | https://www.thehawk.in/news/science/pakistans-education-system-stifles-productivity-262-mn-children-out-of-school |
| Journal | Hake (1998) — transferable IE evidence | https://web.mit.edu/jrankin/www/Active_Learning/hake_active_phys.pdf |
