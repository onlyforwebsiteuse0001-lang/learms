# Allied Health Specializations and Discipline Boundaries in Pakistan

**Evidence cutoff:** 30 September 2026  
**Scope:** AHPC-regulated disciplines, nested labels, BS curriculum standards, DPT, and specialization evidence gaps  
**Authority:** Allied Health Professionals Council (AHPC); HEC for national degree curricula

## 1. A regulated discipline is not automatically a specialization

### Source

Allied Health Professionals Council Act 2022 and AHPC current “Our Disciplines” page. [MED-012; MED-013]

### Key Finding

AHPC regulates allied-health professions and currently displays 30 top-level discipline groups. Some groups include nested labels. The list mixes broad professional domains, technologies, therapy fields, and named subareas. It is not a national postgraduate-specialization catalog.

### Relevance to Learms

Use `RegulatedDiscipline`, `NestedDisciplineLabel`, `DegreeProgram`, `CurricularConcentration`, `PostgraduateQualification`, and `JobRole` as separate entity types.

### Citation

Government of Pakistan. *Allied Health Professionals Council Act, 2022*. Act IX of 2022. https://pakistancode.gov.pk/pdffiles/administrator85ca72c783ea32f5ab4b113a704d9662.pdf (accessed 2026-09-30); AHPC. *Our Disciplines*. https://www.ahpc.org.pk/our-disciplines.html (accessed 2026-09-30).

---

## 2. Current discipline groups

### Source

AHPC current disciplines page. [MED-013]

### Key Finding

The 30 displayed groups are:

1. Anesthesia Technology
2. Blood Banking Technology
3. Medical Laboratory Technology
4. Surgical Technology, including Operating Room Technology
5. Cardiac Care Technology
6. Dental Technology
7. Renal and Dialysis Technology
8. Aesthetics and Skin Care Technology
9. Endoscopy Technology
10. Audiology and Speech Technology
11. Medical Informatics
12. Optometry Technology
13. Physiotherapy and Rehabilitation
14. Occupational and Speech Therapy
15. Public Health Technology
16. Radiography and Imaging Technology, including Radiology Technology
17. Radiotherapy Technology
18. Respiratory Therapy, including Pulmonary Function Testing
19. Nuclear Medicine Technology
20. EKG Technology
21. Neurophysiology Technology
22. Nutrition (Human Nutrition and Dietetics)
23. Podiatric Medicine
24. Psychology and Counseling
25. Sports Therapy
26. Biomedical Technology
27. Emergency Clinical Medicine Technology, including Emergency and Intensive Care Technology
28. Ophthalmic Technology
29. Dispenser Technology
30. Primary Health Care Technology, including Health Technology

### Relevance to Learms

Preserve AHPC's source labels and retrieval date. Do not rewrite each “Technology” as an independent four-year BS degree without a curriculum and recognized offering.

### Citation

Allied Health Professionals Council. *Our Disciplines*. https://www.ahpc.org.pk/our-disciplines.html (accessed 2026-09-30).

---

## 3. Nested labels on the current AHPC page

### Source

AHPC current disciplines page. [MED-013]

### Key Finding

AHPC explicitly nests these labels:

- **Medical Laboratory Technology:** Histopathology, Cytopathology, Hematology, Clinical Chemistry and Biochemistry, Medical Microbiology, Medical Virology, Medical Molecular Biology, Biotechnology (Health).
- **Cardiac Care Technology:** Cardiac Surgery, Cardiology Technology, Cardiac Perfusion Technology, Cardiovascular Technology.
- **Dental Technology:** Dental Hygiene.
- **Optometry Technology:** Refraction Technology.
- **Physiotherapy and Rehabilitation:** Orthotics and Prosthetics.
- **Neurophysiology Technology:** EEG, NCS, EMG.
- Additional “including” relationships are stated for operating-room technology, radiology technology, pulmonary-function testing, emergency/intensive-care technology, and primary-health-care/health technology.

These are current web labels. Their naming alone does not prove separate credentials, licenses, or curricular tracks.

### Relevance to Learms

Represent the relationship as `AHPC_PAGE_NESTS_LABEL`, not automatically `SPECIALTY_OF` or `QUALIFICATION_IN`.

### Citation

Allied Health Professionals Council. *Our Disciplines*. https://www.ahpc.org.pk/our-disciplines.html (accessed 2026-09-30).

---

## 4. Ten HEC-standardized allied-health BS programs

### Source

HEC, *Allied Health Sciences BS Programs Curricula* (2026). [MED-014]

### Key Finding

HEC's February 2026 booklet standardizes eight-semester curricula for ten named programs:

1. BS Medical Laboratory Technology
2. BS Anesthesia Technology
3. BS Aesthetic and Skin Care Technology
4. BS Cardiac Care Technology
5. BS Dental Technology
6. BS Medical Imaging Technology
7. BS Prosthetics and Orthotics
8. BS Renal Dialysis Technology
9. BS Speech and Language Pathology
10. BS Surgical Technology

The existence of 30 AHPC categories and ten curricula demonstrates that `regulated discipline` and `national curriculum booklet` are not the same dataset.

### Relevance to Learms

Never generate a degree program merely by prefixing every AHPC label with “BS.” Link each official curriculum to its exact title and version.

### Citation

Higher Education Commission Pakistan. *HEC Curricula for Allied Health Sciences BS Programs*. 2026. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2025-2026/Allied-Health-Sciences.pdf (accessed 2026-09-30).

---

## 5. DPT is a general professional degree with specialty-domain exposure

### Source

HEC, *Doctor of Physical Therapy* curriculum (2025). [MED-005]

### Key Finding

DPT is a five-year, 189-credit professional program with supervised clinical practice and internship. Its curriculum includes musculoskeletal, neurological, cardiopulmonary, paediatric, geriatric, sports, and other practice domains. Study in those domains does not by itself establish a separately licensed specialist credential.

### Relevance to Learms

Use `CURRICULUM_COVERS_DOMAIN`, not `GRADUATE_IS_SPECIALIST_IN_DOMAIN`. “DPT” must not be modeled as PhD.

### Citation

Higher Education Commission Pakistan. *Doctor of Physical Therapy: Five-Year Semester-Based Degree Program*. 2025. https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/DPT.pdf (accessed 2026-09-30).

---

## 6. Occupational therapy evidence status

### Source

HEC announcement on Bachelor of Occupational Therapy (May 2026). [MED-015]

### Key Finding

HEC announced that it and AHPC finalized the Bachelor of Occupational Therapy curriculum. A final booklet was not located in the reviewed revised-curricula index at the time of research.

### Relevance to Learms

Store `curriculum_finalization_announced = true` and `public_booklet_located = false`. Do not invent exact credits, duration, or specialty tracks.

### Citation

Higher Education Commission Pakistan. *HEC Finalises Curriculum for Bachelor of Occupational Therapy Programme*. May 2026. https://www.hec.gov.pk/english/news/news/Pages/Therapy-Programme.aspx (accessed 2026-09-30).

---

## 7. Scope-of-practice documents are incomplete across the public list

### Source

AHPC downloads page. [MED-046]

### Key Finding

The current downloads page exposes scope-of-practice notices for psychology and physiotherapy, alongside nomenclature, discipline, registration, and accreditation documents. Comparable public scope documents for every one of the 30 categories were **not located** on that page.

### Relevance to Learms

Do not extrapolate one profession's scope to another. Each procedure/role claim needs a profession-specific scope source; absent evidence must be marked `not_found`.

### Citation

Allied Health Professionals Council. *Downloads*. https://ahpc.org.pk/downloads.html (accessed 2026-09-30).

---

## 8. Higher qualifications do not create a universal national specialty taxonomy

### Source

AHPC accreditation manual (2025) and AHPC Act. [MED-012; MED-050]

### Key Finding

AHPC's accreditation standards refer to MS/MPhil and PhD qualifications in allied-health disciplines for faculty roles, showing that higher study exists. The reviewed sources did not provide a single national list of postgraduate clinical specialties, training durations, entry rules, and practice titles across all allied-health professions.

### Relevance to Learms

An MS/MPhil program title must be stored as an institution-specific academic qualification. Do not infer a protected clinical-specialist title or added scope unless AHPC provides that rule.

### Citation

Allied Health Professionals Council. *Accreditation Manual for Institutions*. revised September 2025. https://www.ahpc.org.pk/assets/revised-accreditation-manual-september-2025.pdf (accessed 2026-09-30); Government of Pakistan. *AHPC Act 2022*.

---

## 9. Recognition and registration model

### Source

AHPC Act, accreditation manual, current disciplines page, and HEC curricula. [MED-012; MED-013; MED-014; MED-050]

### Key Finding

Professional discipline recognition, curriculum standardization, institutional accreditation, degree award, and individual registration are separate controls. A name on the discipline list alone does not prove an institution's recognized offering or an individual's registration.

### Relevance to Learms

Minimum graph entities:

- `AHPCDisciplineVersion`
- `HECCurriculumVersion`
- `ProgramOffering`
- `InstitutionAccreditation`
- `ProfessionalRegistration`
- `ScopeDocument`
- `AcademicPostgraduateProgram`

### Citation

Government of Pakistan. *AHPC Act 2022*; AHPC. *Our Disciplines*; AHPC. *Accreditation Manual*; HEC. *Allied Health Sciences Curricula 2026* (all accessed 2026-09-30).

---

## 10. Diploma/technician routes are not BS specializations

### Source

Punjab Medical Faculty and KP Faculty of Paramedical and Allied Health Sciences. [MED-027; MED-029]

### Key Finding

Provincial faculties operate technician/diploma schemes whose titles may resemble AHPC or HEC degree labels. Similar naming does not establish equivalence to a four-year BS or a specialization after that BS.

### Relevance to Learms

Require `qualification_level`, `duration`, `awarding/qualifying body`, `province`, and `regulator` on every program. Reject edges such as `MedicalLabTechnician SAME_AS BS_MLT`.

### Citation

Punjab Medical Faculty. *New Scheme of Studies*. https://pmfpunjab.edu.pk/PMF/SchemesOfStudies (accessed 2026-09-30); Faculty of Paramedical and Allied Health Sciences KP. https://kpmf.edu.pk/fpma/ (accessed 2026-09-30).

---

## 11. Demand, scope, work-life, and earnings

### Source

AHPC, HEC, and provincial-faculty sources reviewed. [MED-005; MED-012–MED-015; MED-027; MED-029; MED-046]

### Key Finding

A comparable national dataset for specialization seats, job vacancies, scope by seniority, working hours, or earnings was **not found**. AHPC category presence and HEC curriculum publication do not measure labor demand.

### Relevance to Learms

Avoid “high demand,” “best scope,” and salary rankings. Any future workforce comparison must name profession, exact qualification, province, sector, role, experience, data year, and source.

### Citation

AHPC. *Our Disciplines*. https://www.ahpc.org.pk/our-disciplines.html; HEC. *Allied Health Sciences BS Programs Curricula*. 2026 (accessed 2026-09-30).

---

## 12. Learms recommendations

### Agent 1

- Import the 30 categories as versioned regulator labels.
- Keep the ten HEC BS curricula as separate program standards.
- Represent nested web labels with a weak, source-specific relation pending scope/curriculum proof.
- Keep diploma, BS, DPT, MS/MPhil, and PhD levels distinct.

### Agent 2

- Build profession-first navigation; avoid putting all disciplines under “paramedical.”
- Show evidence badges for `scope located`, `curriculum located`, and `institution recognized` separately.
- Do not call broad undergraduate domain exposure a specialization.

### Agent 3

- Simulation and portfolio evidence should be synthetic or de-identified.
- Imaging, lab, neurophysiology, psychology, and rehabilitation artifacts can contain sensitive patient data; disable casual upload by default.

---

## 13. Evidence gaps

- National curriculum booklet for every AHPC category: **not found**.
- Public scope-of-practice notice for every category: **not found**.
- National postgraduate clinical-specialty catalog across allied health: **not found**.
- Protected specialist titles and added-scope rules by profession: **not found in one consolidated source**.
- Institution-by-program current accreditation export: **not found in a stable downloadable format**.
- Specialty-level seats, competitiveness, demand, work hours, and earnings: **not found**.

## 14. Source ledger

| ID | Authority | Source | Use |
|---|---|---|---|
| MED-005 | HEC | DPT curriculum | General degree and domain exposure |
| MED-012 | Pakistan Code/AHPC | AHPC Act | Statutory authority |
| MED-013 | AHPC | Current disciplines | 30 groups and nested labels |
| MED-014 | HEC | Ten BS curricula | Standardized degree programs |
| MED-015 | HEC/AHPC | Occupational therapy announcement | Published-booklet gap |
| MED-027 | Punjab Medical Faculty | Diploma schemes | Qualification-level boundary |
| MED-029 | FPAHS KP | Provincial diploma catalog | Jurisdiction boundary |
| MED-046 | AHPC | Downloads | Public scope-document coverage |
| MED-050 | AHPC | Accreditation manual | Program and higher-qualification standards |
