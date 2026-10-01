# Nursing and Midwifery Specializations in Pakistan

**Evidence cutoff:** 30 September 2026  
**Scope:** Post-basic nursing specialties, CNS status, MSN, leadership/education, and recognition boundaries  
**Authority:** Pakistan Nursing and Midwifery Council (PNMC); HEC for higher-education standards

## 1. “Specialization” has several meanings in nursing

Learms must separate:

- a clinical subject inside Generic BSN;
- a one-year PNMC-recognized post-basic specialty diploma;
- a two-year Post-RN bridge degree;
- a two-year MSN degree;
- a specialized clinical track supporting Clinical Nurse Specialist status;
- an institution's approved program offering;
- a nursing job/assignment such as ICU nurse;
- a PNMC registration or license status.

These are related but not interchangeable. [MED-008; MED-009; MED-010; MED-043]

---

## 2. Statutory definition of Clinical Nurse Specialist

### Source

Pakistan Nursing Council (Amendment) Act 2023. [MED-010]

### Key Finding

The amended Act defines a Clinical Nurse Specialist (CNS) as a registered nurse who successfully completes either a **one-year post-BSN diploma in a relevant discipline** or an **MSN degree in a specialized clinical track**, where the route is recognized by PNMC and the individual is registered and licensed by PNMC to practice within a defined scope.

### Relevance to Learms

A CNS badge requires evidence of the qualification route, PNMC recognition, individual registration/licensure, discipline, and scope. Learms must not infer CNS status from workplace assignment, BSN coursework, or an unverified certificate.

### Citation

Government of Pakistan. *Pakistan Nursing Council (Amendment) Act, 2023*, CNS definition and Schedule. 2023. https://pnmc.gov.pk/wp-content/uploads/2023/09/PNMC-Amended-Act-2023.pdf (accessed 2026-09-30).

---

## 3. Recognized qualification structure

### Source

PNMC amended Act and admission criteria. [MED-009; MED-010]

### Key Finding

The statutory schedule includes four-year BSN, two-year Post-RN BSN, two-year MSN, doctorate in nursing, and a one-year post-basic specialization diploma in different disciplines. PNMC's admissions page separately describes Generic BSN, Post-RN BSN/BSM, MSN, nurse-midwife/post-basic specialty, LHV, CMW, FWW, and CNA routes.

### Relevance to Learms

The pathway graph should not place every route under “specialization.” Generic BSN and Post-RN BSN are degree routes; post-basic specialties and specialized MSN tracks are specialization routes; CNA/LHV/CMW are distinct qualification/role routes.

### Citation

Government of Pakistan. *Pakistan Nursing Council (Amendment) Act, 2023*. https://pnmc.gov.pk/wp-content/uploads/2023/09/PNMC-Amended-Act-2023.pdf (accessed 2026-09-30); PNMC. *Admission Criteria*. https://pnmc.gov.pk/admission-criteria/ (accessed 2026-09-30).

---

## 4. Post-basic specialty labels found in the PNMC directory

### Source

PNMC recognized-institutes directory and its program-label legend. [MED-043]

### Key Finding

The live directory exposes institute-specific approval labels including:

### Clinical and care-setting labels

- Anaesthesia
- Cardiac / CCU
- Critical care / ICU
- Accident and emergency / trauma and emergency
- Operation theatre / peri-operative nursing
- Paediatric nursing
- Psychiatric / mental health nursing
- Nephrology nursing
- Oncology nursing
- Bone marrow nursing
- Ophthalmic nursing
- Orthopaedic nursing
- Neuro nursing
- Community health nursing

### Administration and education labels

- Ward Administration
- Teaching Administration

### Midwifery-related post-basic label

- Post Midwifery Diploma

The exact spelling and granularity vary across entries. A label attached to one institution is evidence of that directory entry, not proof that every label is nationally available at every institution.

### Relevance to Learms

Normalize aliases for search while preserving the source label. An offering must be keyed by institution, program label, approval status, and retrieval date.

### Citation

Pakistan Nursing and Midwifery Council. *Recognized Institutes*. https://pnmc.gov.pk/recognized-institutes/ (accessed 2026-09-30).

---

## 5. Generic BSN exposure is not post-basic specialization

### Source

HEC/PNMC BSN–MSN curriculum (2024) and PNMC BSN curriculum materials. [MED-008]

### Key Finding

The BSN curriculum includes adult health, paediatric, mental health, community health, and critical-care learning and clinical exposure. Those courses prepare a general graduate; they do not automatically confer a post-basic specialty diploma or CNS registration.

### Relevance to Learms

Use distinct graph relations:

- `BSN_CURRICULUM_COVERS_DOMAIN`
- `NURSE_HOLDS_POST_BASIC_SPECIALTY`
- `NURSE_LICENSED_AS_CNS`

### Citation

Higher Education Commission Pakistan and Pakistan Nursing and Midwifery Council. *Curriculum of BS Nursing and MS Nursing*. 2024. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2023-2024/HEC%20Curriculum%20BSN-MSN%202024.pdf (accessed 2026-09-30).

---

## 6. Post-RN BSN is a bridge degree, not a specialty diploma

### Source

PNMC, *Post-RN BSN Curriculum* (2019). [MED-049]

### Key Finding

The curriculum describes Post-RN BSN as a two-year, four-semester, 60-credit pathway for diploma-qualified registered nurses. It broadens theoretical, clinical, research, and population-health preparation. Its use of “specialty in lieu of midwifery” in entry rules does not transform Post-RN BSN itself into a specialty award.

### Relevance to Learms

The prerequisite graph may accept a PNMC-recognized specialty diploma as an entry-route component where the official rule permits it, but the final credential node remains Post-RN BSN.

### Citation

Pakistan Nursing and Midwifery Council. *Curriculum Post RN BSN (02 Years Degree Program)*. 2019. https://pnmc.gov.pk/wp-content/uploads/2023/03/Post-RN-BSN-29.10.2019.pdf (accessed 2026-09-30).

---

## 7. MSN route

### Source

HEC/PNMC BSN–MSN curriculum and PNMC admissions page. [MED-008; MED-009]

### Key Finding

PNMC describes MSN as a two-year degree and gives category-specific entry requirements. The amended Act allows an MSN in a specialized clinical track to contribute to CNS status where recognized and registered. A consolidated current national list of all PNMC-recognized MSN clinical tracks was **not found** on the reviewed admissions or directory pages.

### Relevance to Learms

Do not convert “MSN” into a specialty without a track label. Store `degree = MSN`, `track`, `institution`, `recognition`, and `CNS_registration` independently.

### Citation

HEC and PNMC. *Curriculum of BS Nursing and MS Nursing*. 2024. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2023-2024/HEC%20Curriculum%20BSN-MSN%202024.pdf (accessed 2026-09-30); PNMC. *Admission Criteria*. https://pnmc.gov.pk/admission-criteria/ (accessed 2026-09-30).

---

## 8. Institution recognition controls

### Source

PNMC recognized-institutes directory and parent/student alert. [MED-043; MED-044]

### Key Finding

PNMC instructs applicants to verify an institution's status and says institutions recognized by PNMC are authorized to provide nursing, midwifery, and LHV education. The alert explicitly rejects relying on unrelated skill-development councils for nursing qualifications.

### Relevance to Learms

Program search must join `institution × program × current PNMC status`; an institution-level badge without the program label is insufficient. The UI should link users to PNMC and warn that directory content is mutable.

### Citation

PNMC. *Recognized Institutes*. https://pnmc.gov.pk/recognized-institutes/ (accessed 2026-09-30); PNMC. *Parent & Student Alert*. https://pnmc.gov.pk/parent-student-alert/ (accessed 2026-09-30).

---

## 9. HEC equivalence is not specialist licensure

### Source

HEC, policy guidelines on nursing degree programs (22 April 2022). [MED-045]

### Key Finding

HEC issued equivalence and faculty policy for nursing degree pathways, including combinations involving diploma, midwifery/specialization, and Post-RN education. Academic equivalence addresses education level; PNMC remains the source for recognized nursing qualification and practice/registration status.

### Relevance to Learms

Do not infer `HEC_EQUIVALENT → PNMC_SPECIALIST_LICENSED`. These are distinct authorities and claims.

### Citation

Higher Education Commission Pakistan. *HEC Issues Policy Guidelines to Varsities on Nursing Degree Programmes*. 22 April 2022. https://www.hec.gov.pk/english/news/news/Pages/Guidelines-Nursing-Programmes.aspx (accessed 2026-09-30).

---

## 10. Midwifery is its own profession/pathway axis

### Source

HEC/PNMC BS Midwifery curriculum; PNMC admissions criteria; PNMC amended Act. [MED-009; MED-010; MED-011]

### Key Finding

Pakistan has midwifery routes including BS Midwifery, community midwife, and other PNMC-listed pathways. These should not be reduced to “a nursing specialty,” even where nurse-midwife or post-midwifery pathways connect the professions.

### Relevance to Learms

Use `Profession = Midwifery` and explicit bridge/dual-qualification relations. Do not place CMW, BSM, or nurse-midwife under a generic nursing-specialty list.

### Citation

HEC and PNMC. *Curriculum of BS in Midwifery*. 2024. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2023-2024/HEC%20Curriculum%20Midwifery%202024.pdf (accessed 2026-09-30); PNMC. *Admission Criteria*. https://pnmc.gov.pk/admission-criteria/ (accessed 2026-09-30).

---

## 11. Competency taxonomy

A safe learning taxonomy can organize content by:

- population: neonatal, paediatric, adult, older adult;
- setting: community, ward, emergency, ICU/CCU, operating theatre;
- system/service: cardiac, renal, oncology, mental health, orthopaedic, neuro, ophthalmic;
- function: direct care, education, administration, quality, research;
- acuity: routine, acute, critical;
- credential state: pre-registration, general RN, post-basic diploma, MSN track, CNS.

This taxonomy supports discovery; it does not create credentials.

---

## 12. Demand, work-life, and earnings

### Source

PNMC and HEC official sources reviewed. [MED-008–MED-011; MED-043–MED-045]

### Key Finding

A national specialty-by-specialty dataset for approved seats, applicants, fill rates, vacancies, staffing ratios, work hours, burnout, or earnings was **not found** in these sources. Directory presence does not establish labor-market demand.

### Relevance to Learms

Do not rank critical care, cardiac, paediatric, or other nursing specialties by demand or income without dated workforce/payroll evidence. Separate a training-offering count from a vacancy count.

### Citation

PNMC. *Recognized Institutes*. https://pnmc.gov.pk/recognized-institutes/ (accessed 2026-09-30); HEC/PNMC. *BSN–MSN Curriculum*. 2024. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2023-2024/HEC%20Curriculum%20BSN-MSN%202024.pdf (accessed 2026-09-30).

---

## 13. Learms recommendations

### Agent 1

- Add `NursingQualification`, `SpecialtyTrack`, `ProgramOffering`, `PNMCRecognition`, and `PracticeScope` nodes.
- Preserve aliases such as ICU/critical care and OT/peri-operative without declaring them identical unless PNMC maps them.
- Represent CNS as a status requiring recognized education plus registration/licensure.

### Agent 2

- Show “course exposure,” “post-basic qualification,” and “licensed CNS” as visibly different.
- Display institution-specific approvals, not a generic “PNMC recognized” badge.
- Give midwifery an independent navigation axis.

### Agent 3

- Clinical portfolios should use de-identified competencies and supervisor attestations.
- Never solicit patient charts, names, bed numbers, images, or exact encounter dates into a general learning app.

---

## 14. Evidence gaps

- One current PNMC page enumerating every post-basic specialty with standard title and curriculum: **not found**.
- Current curriculum and scope document for every directory specialty label: **not found**.
- Consolidated recognized MSN specialized-clinical-track list: **not found**.
- National CNS register searchable by discipline: **not found in reviewed sources**.
- Specialty seat counts, selection ratios, demand, hours, and earnings: **not found**.
- Formal alias mapping (ICU vs critical care; OT vs peri-operative): **not found**.

## 15. Source ledger

| ID | Authority | Source | Use |
|---|---|---|---|
| MED-008 | HEC/PNMC | BSN–MSN curriculum | Degree structure and subject exposure |
| MED-049 | PNMC | Post-RN BSN curriculum | Bridge-degree structure |
| MED-009 | PNMC | Admission criteria | Route and duration context |
| MED-010 | Government/PNMC | 2023 amended Act | CNS and recognized qualifications |
| MED-011 | HEC/PNMC | BS Midwifery | Separate midwifery axis |
| MED-043 | PNMC | Recognized institutes | Institution-specific specialty labels |
| MED-044 | PNMC | Parent/student alert | Recognition warning |
| MED-045 | HEC | Nursing policy guidelines | Academic equivalence boundary |
