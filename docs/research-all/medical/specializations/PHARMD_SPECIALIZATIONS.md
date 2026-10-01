# Pharm.D Specializations and Pharmacy Pathways in Pakistan

**Evidence cutoff:** 30 September 2026  
**Scope:** Optional Pharm.D specialization clusters and post-qualification pathway boundaries  
**Authorities:** Pharmacy Council of Pakistan (PCP) for professional recognition/registration; HEC for national curriculum standards

## 1. The current degree permits optional specialization

### Source

HEC and PCP, *Curriculum of Doctor of Pharmacy (Pharm.D)* (2025). [MED-006]

### Key Finding

The 2025 curriculum defines Pharm.D as a five-year program. It requires at least **195 credits without specialization** and **210 credits where an optional specialization is completed**. The specialization track is optional, depends on the student's and/or institution's choice, and requires institutional statutory approval. A selected track is to be shown in parentheses on the transcript or degree.

### Relevance to Learms

Learms must model a Pharm.D specialization as an optional curricular track, not as a separate professional license or a mandatory feature of every Pharm.D program.

### Citation

Higher Education Commission Pakistan and Pharmacy Council of Pakistan. *Curriculum of Doctor of Pharmacy (Pharm.D)*. 2025, pp. 2–9. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 2. The 12 nationally recommended specialization clusters

### Source

HEC/PCP 2025 Pharm.D curriculum. [MED-006]

### Key Finding

The curriculum recommends these 12 clusters:

1. Pharmacology
2. Pharmacy Practice
3. Pharmaceutics
4. Pharmacognosy
5. Pharmaceutical Chemistry / Medicinal Chemistry
6. Pharmaceutical Analysis / Quality Control
7. Industrial Pharmacy
8. Hospital and Community Pharmacy
9. Regulatory Affairs
10. Clinical Research in Pharmacy
11. Pharmaceutical Marketing
12. Pharmaceutical Management

Each specialization requires a minimum of five to six courses totaling 15 credits from its cluster. HEC permits institutions to introduce additional clusters or courses based on faculty, resources, market change, and approval by the institution's statutory bodies.

### Relevance to Learms

The graph needs a versioned `CurricularTrack` entity with `nationally_recommended` and `institution_defined` values. A track appearing in the national framework does not prove that a particular institution offers it.

### Citation

Higher Education Commission Pakistan and Pharmacy Council of Pakistan. *Curriculum of Doctor of Pharmacy (Pharm.D)*. 2025, “Optional Specialization Cluster Scheme,” p. 9. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 3. Specialization does not change generic Pharm.D equivalence

### Source

HEC/PCP 2025 Pharm.D curriculum. [MED-006]

### Key Finding

The curriculum states that Pharm.D degrees remain equivalent for employment where Pharm.D is required regardless of specialization. It separately notes that graduates may apply for niche roles where an employer demands relevant specialization.

### Relevance to Learms

Do not generate a false hierarchy such as `Pharm.D (Clinical) > Pharm.D`. Model specialization as additional transcripted study. Employer requirements remain job-specific and should not be presented as PCP license classes unless PCP says so.

### Citation

Higher Education Commission Pakistan and Pharmacy Council of Pakistan. *Curriculum of Doctor of Pharmacy (Pharm.D)*. 2025, p. 9. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 4. Foundation disciplines versus specialization tracks

### Source

HEC/PCP 2025 Pharm.D curriculum. [MED-006]

### Key Finding

The common curriculum has five foundation disciplines: Pharmaceutics, Pharmacology, Pharmaceutical Chemistry, Pharmacognosy, and Pharmacy Practice. These core disciplines are studied by all learners and also appear among optional specialization labels. Completing core courses in a discipline is not the same as completing the 15-credit specialization cluster.

### Relevance to Learms

Use separate edges:

- `DEGREE_HAS_CORE_DISCIPLINE`
- `STUDENT_COMPLETED_SPECIALIZATION_TRACK`

Never infer the second from the first.

### Citation

Higher Education Commission Pakistan and Pharmacy Council of Pakistan. *Curriculum of Doctor of Pharmacy (Pharm.D)*. 2025, pp. 2–9. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 5. Field experience and capstone remain degree-wide requirements

### Source

HEC/PCP 2025 Pharm.D curriculum. [MED-006]

### Key Finding

The curriculum includes a three-credit clinical-pharmacy clerkship/field experience and a three-credit capstone project. Its capstone description connects the five major pharmacy disciplines. These requirements do not by themselves certify specialist clinical practice.

### Relevance to Learms

A portfolio should distinguish `field_experience`, `capstone`, `specialization_electives`, and `professional_registration`. A capstone label must never become a clinical-specialist badge.

### Citation

Higher Education Commission Pakistan and Pharmacy Council of Pakistan. *Curriculum of Doctor of Pharmacy (Pharm.D)*. 2025, pp. 2, 8–9. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 6. Regulatory and institutional verification

### Source

PCP official portal and institutional-recognition pages; HEC/PCP curriculum. [MED-006; MED-007]

### Key Finding

PCP regulates pharmacy education, institutional accreditation, and pharmacist registration. Recognition is institution/program/intake-sensitive. The presence of an HEC curriculum or specialization cluster is not evidence that a particular institution has PCP approval to enroll a particular intake or offer that cluster.

### Relevance to Learms

A program card needs:

- PCP-recognized institution and program;
- approved shift/intake where published;
- HEC-recognized campus;
- curriculum version;
- specialization offered by the institution;
- university statutory approval evidence;
- retrieval/effective date.

### Citation

Pharmacy Council of Pakistan. *Official Portal and Regulatory Mandate*. https://pcpisb.gov.pk/ (accessed 2026-09-30); HEC/PCP. *Curriculum of Doctor of Pharmacy*. 2025. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 7. Postgraduate pharmacy routes

### Source

PCP portal and the HEC National Qualifications Framework. [MED-007; MED-030]

### Key Finding

Pharm.D is a professional bachelor-level qualification in Pakistan's NQF, despite “Doctor” in its title. Postgraduate MS/MPhil and PhD study is a different level and can be offered in pharmacy disciplines. A complete current national PCP directory pairing every postgraduate pharmacy specialty, program, institution, and intake was **not found** in the reviewed sources.

### Relevance to Learms

Prohibited edges include:

- `PharmD SAME_AS PhD`
- `PharmD_SPECIALIZATION SAME_AS MPhil`
- `TRACK_COMPLETION IMPLIES SPECIALIST_LICENSE`

Postgraduate search results require HEC/PCP and institution-specific verification.

### Citation

Higher Education Commission Pakistan. *National Qualifications Framework of Pakistan*. 2015. https://www.hec.gov.pk/english/services/universities/pqf/Documents/National%20Qualification%20Framework%20of%20Pakistan.pdf (accessed 2026-09-30); Pharmacy Council of Pakistan. https://pcpisb.gov.pk/ (accessed 2026-09-30).

---

## 8. Learning-domain map

| Track | Suggested concept families from the official label | Boundary |
|---|---|---|
| Pharmacology | Pharmacodynamics, pharmacokinetics, toxicology, therapeutics | Does not create physician prescribing authority |
| Pharmacy Practice | Medication use, patient counseling, care processes, evidence appraisal | Clinical activities remain within pharmacist scope and setting |
| Pharmaceutics | Formulation, drug delivery, biopharmaceutics, production | Not synonymous with Industrial Pharmacy |
| Pharmacognosy | Natural products, crude drugs, phytochemistry | Evidence standards for efficacy remain separate |
| Pharmaceutical/Medicinal Chemistry | Drug structure, synthesis, medicinal chemistry | Distinct from general chemistry qualifications |
| Pharmaceutical Analysis/Quality Control | Analytical methods, specifications, validation, quality testing | Distinct from regulatory authorization |
| Industrial Pharmacy | Manufacturing systems, scale-up, quality systems | Institution-specific elective details vary |
| Hospital and Community Pharmacy | Distribution, medication systems, counseling, population access | Hospital and community settings should remain facets |
| Regulatory Affairs | Drug law, registration, compliance, pharmacovigilance interfaces | Learms must version legal content |
| Clinical Research in Pharmacy | Protocols, ethics, data, evidence synthesis | Educational study does not authorize unsupervised human research |
| Pharmaceutical Marketing | Markets, communication, ethical promotion | Must not promote misleading medicine claims |
| Pharmaceutical Management | Operations, leadership, supply systems | Distinct from licensure and clinical competency |

The “suggested concept families” are organization labels derived from the official tracks; they are not replacement curricula.

---

## 9. Entry, assessment, and certification gaps

### Source

HEC/PCP 2025 Pharm.D curriculum. [MED-006]

### Key Finding

The curriculum provides the national structure but leaves actual cluster availability and added courses to approved institutional implementation. A consolidated official list of institutions offering each specialization, track-specific intake numbers, track-specific selection rules, or a separate PCP specialist examination was **not found**.

### Relevance to Learms

Every specialization card should say “availability varies by institution” until the institution's statutory approval and current scheme are verified.

### Citation

Higher Education Commission Pakistan and Pharmacy Council of Pakistan. *Curriculum of Doctor of Pharmacy (Pharm.D)*. 2025, p. 9. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 10. Careers, demand, work-life, and earnings

### Source

HEC/PCP curriculum and PCP official portal. [MED-006; MED-007]

### Key Finding

The curriculum names broad employment settings—hospitals, community pharmacies, industry, regulation, government, NGOs, disease-control programs, international organizations, entrepreneurship, and further study. It does not supply national job counts, employment rates, salaries, specialty premiums, working hours, or work-life measures. Those measures are **not found** for the 12 tracks in the reviewed official sources.

### Relevance to Learms

Display settings as possible pathways, not guaranteed outcomes. Suppress salary or “demand” rankings until dated role-, sector-, city-, and experience-specific evidence exists.

### Citation

Higher Education Commission Pakistan and Pharmacy Council of Pakistan. *Curriculum of Doctor of Pharmacy (Pharm.D)*. 2025, program description. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf (accessed 2026-09-30).

---

## 11. Learms recommendations

### For Agent 1

- Add `CurricularTrack` below `ProgramVersion`, not below professional license.
- Represent the 195/210-credit distinction explicitly.
- Link track offerings to institution and approval evidence.
- Preserve institution-defined clusters without promoting them to national standards.

### For Agent 2

- Show “optional,” “institution availability,” and “transcript notation” visibly.
- Compare curricula, not prestige or income.
- Keep pharmacy technician and Pharm.D routes separate.

### For Agent 3

- Clinical clerkship reflections must omit patient identifiers.
- Medication-error exercises require de-identified/synthetic cases.
- Regulatory and formulary content needs effective dates and provenance.

---

## 12. Evidence gaps

- Institution-by-institution availability of all 12 clusters: **not found in one official national directory**.
- Track-specific admissions and selection rules: **not found**.
- Separate specialist registration classes for the 12 tracks: **not found**.
- Current national directory of postgraduate pharmacy programs by specialty/intake: **not found**.
- Track-specific labor demand, hours, and salary distributions: **not found**.
- Outcome comparisons between specialized and generic Pharm.D graduates: **not found**.

## 13. Source ledger

| ID | Authority | Source | Use |
|---|---|---|---|
| MED-006 | HEC/PCP | Pharm.D curriculum | Structure, clusters, credits, employment settings |
| MED-007 | PCP | Official portal | Regulatory mandate and mutable recognition |
| MED-030 | HEC | National Qualifications Framework | Pharm.D versus graduate/research levels |
