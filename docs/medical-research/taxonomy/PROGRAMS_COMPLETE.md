# Medical and Health-Professions Programs in Pakistan — Regulator-Aware Taxonomy

**Evidence cut-off:** 2026-09-30  
**Status:** Area 1.1 research deliverable; authoritative program map, not an admission prospectus  
**Source convention:** `[MED-###]` resolves to `../sources/SOURCE_REGISTER.csv`. Web sources were accessed 2026-09-30.

> **Safety and completeness note:** “Complete” means complete against the national regulator/curriculum categories located during this review, not a guarantee that every institution offers every program. A discipline's presence in a statute or regulator list does **not** prove that a named institution, campus, intake, or qualification is recognized. Learners must verify the institution, campus, program, intake/session, and seat allocation directly with the responsible regulator before paying fees. [MED-007; MED-013; MED-020; MED-022; MED-025]

## Executive map

Pakistan's health-professions education is not one regulatory tree. It is a federation of profession-specific and level-specific systems. [MED-002; MED-007; MED-009; MED-012; MED-018; MED-022; MED-025]

| Domain | Core entry qualifications/programs | Primary national oversight evidenced here | Source |
|---|---|---|---|
| Medicine | MBBS | Pakistan Medical & Dental Council (PM&DC) | [MED-001; MED-002] |
| Dentistry | BDS | PM&DC | [MED-002; MED-003; MED-004] |
| Pharmacy | Pharm.D; technician pathways are distinct | Pharmacy Council of Pakistan (PCP), with HEC curriculum | [MED-006; MED-007] |
| Nursing and midwifery | Generic BSN, BSM, Post-RN routes, MSN, regulated diplomas | Pakistan Nursing & Midwifery Council (PNMC), with HEC | [MED-008–MED-011] |
| Allied health and rehabilitation | DPT; BS allied-health degrees; certificates/diplomas | Allied Health Professionals Council (AHPC), HEC, and provincial faculties for some diploma routes | [MED-005; MED-012–MED-017; MED-027–MED-029] |
| Public health | AD Public Health, BSPH, MSPH | HEC for academic framework; professional/employment rules can depend on role | [MED-017] |
| Veterinary medicine | DVM | Pakistan Veterinary Medical Council (PVMC) | [MED-018–MED-020] |
| Eastern/Unani medicine | BEMS; FTJ pathway | National Council for Tibb (NCT) | [MED-021–MED-023] |
| Homoeopathy | BHMS; DHMS pathway | National Council for Homoeopathy (NCH) | [MED-024–MED-026] |

## Terms Learms must not collapse

| Entity type | Meaning in this taxonomy | Example | Source |
|---|---|---|---|
| Profession | Regulated practice family | Medicine; pharmacy; nursing; physiotherapy | [MED-002; MED-007; MED-009; MED-012] |
| Program | Organized course leading to a qualification | Five-year DPT | [MED-005] |
| Qualification | Award earned on completion | MBBS; BSN; Pharm.D | [MED-001; MED-006; MED-008] |
| Curriculum discipline | Subject or academic domain inside a program | Anatomy; clinical pharmacy | [MED-001; MED-006] |
| Specialty | Focus obtained by formal postgraduate training or a recognized post-basic route | Post-basic critical-care nursing | [MED-010] |
| Technology | Allied-health practice/education category | Anesthesia technology; medical imaging technology | [MED-013; MED-014] |
| Role/job title | Employment function, not automatically a qualification | Hospital pharmacist; radiographer | [MED-006; MED-013] |
| License/registration | Regulator authorization/entry on register; separate from degree award | PCP Register A; AHPC registration | [MED-007; MED-012] |
| Academic level | National qualification level; “Doctor” in a professional bachelor's title is not a PhD | DPT and Pharm.D are professional qualifications, while doctoral research is separately classified | [MED-005; MED-006; MED-030] |

---

# A. Medicine and dentistry

## A1. MBBS — Bachelor of Medicine, Bachelor of Surgery

| Attribute | Verified description | Source |
|---|---|---|
| Program duration | Five years | [MED-001] |
| Minimum curriculum volume | 6,200 teaching hours over 36 weeks per year | [MED-001] |
| Regulator | PM&DC | [MED-001; MED-002] |
| Curriculum families recognized in the 2024 guideline | Traditional, integrated, and hybrid; PM&DC recommended transition toward integration | [MED-001] |
| Entry baseline in 2025 regulations | MDCAT; HSSC/equivalent with at least 60%; biology and chemistry mandatory, plus physics or mathematics, subject to specified exceptions | [MED-002] |
| Major curriculum groupings | Preclinical/para-clinical; medicine and allied clinical sciences; surgery and allied clinical sciences | [MED-001] |
| Professional training after degree | House-job/licensing requirements are separate lifecycle entities and should not be hidden inside program duration | [MED-002] |

**Learms root:** `health.medicine.mbbs`  
**Suggested phases:** foundation/basic sciences → systems/integration → para-clinical → core clinical rotations → elective/assessment → house job/licensing. The exact year placement must be university-versioned because PM&DC permits differing curriculum models. [MED-001; MED-002]

## A2. BDS — Bachelor of Dental Surgery

| Attribute | Verified description | Source |
|---|---|---|
| Regulator | PM&DC | [MED-002] |
| 2024 announced reform | PM&DC's press-release index records an extension from four to five years | [MED-003] |
| Conflicting 2025 operational document | The April 2025 BDS inspection proforma still distributes general education and curricular hours across “all four years” and lists BDS years 1–4 | [MED-004] |
| Research conclusion | Current cohort-specific duration is **not safely represented by one evergreen value** in Learms; store effective session and source, and prompt users to verify with PM&DC/university | [MED-003; MED-004] |
| Entry baseline | Covered by the 2025 MBBS/BDS admission regulations | [MED-002] |

**Learms root:** `health.dentistry.bds`  
**Core curriculum branches supported by the inspection standard:** basic medical sciences, oral biology/tooth morphology, dental materials, community dentistry, oral pathology/oral medicine, operative dentistry, prosthodontics, periodontology, orthodontics, oral and maxillofacial surgery, pediatric dentistry, radiology, and clinical practice. [MED-004]

### Contradiction register: BDS duration

1. PM&DC announced five years in November 2024. [MED-003]
2. PM&DC's 2025 inspection document still operationalizes a four-year curriculum. [MED-004]
3. A secondary report in September 2026 claimed reversal/postponement, but no corresponding primary PM&DC notification was located in this review; therefore that report is **not used as a finding**.
4. Product rule: ask for admission session and university, show the governing source date, and never compute graduation dates from a single global BDS duration field.

---

# B. Pharmacy

## B1. Pharm.D — Doctor of Pharmacy

| Attribute | Verified description | Source |
|---|---|---|
| Program duration | Five years | [MED-006] |
| Regulator/academic actors | PCP regulates pharmacy education/registration; HEC notified the 2025 curriculum with PCP input | [MED-006; MED-007] |
| Core domains | Pharmaceutics, pharmacology, pharmaceutical chemistry, pharmacognosy, and pharmacy practice | [MED-006] |
| Practice components | Clinical pharmacy clerkship/field experience and capstone requirements are built into the curriculum | [MED-006] |
| Optional transcript specialization | The curriculum provides optional specialization clusters; all remain Pharm.D degrees and the curriculum says they are equivalent where a Pharm.D is required | [MED-006] |
| Professional-registration distinction | Graduate pharmacist and pharmacy-technician routes belong to different register categories; they must not share one “pharmacist degree” node | [MED-007] |

**Learms root:** `health.pharmacy.pharmd`

### Curriculum branches

- Pharmaceutical chemistry: organic chemistry, biochemistry, pharmaceutical analysis, quality control, medicinal chemistry. [MED-006]
- Pharmaceutics: physical pharmacy, dosage-form/drug-delivery science, microbiology, industrial pharmacy, biopharmaceutics/pharmacokinetics, quality systems, technology. [MED-006]
- Pharmacognosy. [MED-006]
- Pharmacology and therapeutics, including basic medical sciences and clinical pharmacology. [MED-006]
- Pharmacy practice: dispensing, hospital, community, social/administrative, clinical, management/marketing, regulatory sciences, practice experience. [MED-006]

### Pharmacy technician/assistant pathways

PCP's public portal distinguishes Category `A` graduate professionals from Category `B` diploma practitioners/technicians. Learms should expose the difference in qualification, scope, and recognition rather than treating “pharmacy” as one interchangeable program. [MED-007]

---

# C. Nursing and midwifery

## C1. Degree pathways

| Program | Verified duration/status | Entry/pathway notes | Source |
|---|---|---|---|
| Generic BSN | Four-year professional degree leading toward registered-nurse practice | PNMC page lists FSc pre-medical/equivalent with biology and minimum 50%; current cohort criteria must be rechecked | [MED-008; MED-009] |
| BS Midwifery (BSM) | Four-year degree program | PNMC lists Generic BSN/BSM together for current admission baseline; HEC has a dedicated 2024 BSM curriculum | [MED-009; MED-011] |
| Post-RN BSN | Two-year degree route | Requires prior nursing qualification/registration route described by PNMC | [MED-009] |
| Post-RN BSM | Two-year degree route | Prior nursing/midwifery pathway described by PNMC | [MED-009] |
| MSN | Two-year graduate degree on PNMC's page | Entry differs for legacy diploma/Post-RN and Generic BSN pathways and includes practice experience | [MED-009] |
| Doctorate in Nursing | Recognized qualification category in amended statutory schedule | Program/institution-specific HEC recognition still requires verification | [MED-010] |

**Learms roots:** `health.nursing.bsn`, `health.midwifery.bsm`, `health.nursing.post_rn_bsn`, `health.midwifery.post_rn_bsm`, `health.nursing.msn`.

## C2. Diploma and post-basic pathways

| Program/pathway | Verified duration or status | Source |
|---|---|---|
| Nurse Midwife / Post-Basic Specialty | One-year diploma for an RN according to current PNMC criteria page | [MED-009] |
| Lady Health Visitor (LHV) | Two-year diploma | [MED-009] |
| Community Midwife (CMW) | Eighteen-month diploma on current PNMC criteria page | [MED-009] |
| Family Welfare Worker (FWW) | Two-year diploma | [MED-009] |
| Certified Nursing Assistant (CNA; formerly LPN) | Two-year diploma; page labels it female-only | [MED-009] |
| Legacy General Nursing diploma | PNMC curriculum page reports the three-year program closed by 2018; retain as historical, not a current default route | [MED-009] |
| Clinical Nurse Specialist (CNS) | Amended Act defines a registered nurse with a recognized post-BSN clinical-specialty diploma and/or specialized clinical-track MSN, plus registration/licensing | [MED-010] |
| Post-basic specialty examples | Cardiac care and oncology appear in the statutory schedule; PNMC's recognized-institute data also uses ICU/critical care, psychiatric, pediatric, A&E, OT, and other labels | [MED-010] |

### Nursing curriculum concepts

The 2024 BSN curriculum spans foundational nursing, adult health, community health, pediatric health, mental health, critical care, health assessment, pharmacology, research, leadership/management, communication, ethics, and clinical skills. A concept graph should separate knowledge from supervised clinical competence and avoid marking a student “mastered” solely from MCQs. [MED-008]

---

# D. Allied health, rehabilitation, diagnostics, and health technologies

## D1. Legal/regulatory discipline universe

The AHPC Act created a framework for education, training, practice, registration, institutional recognition, and discipline-specific licensing. Its original Schedule I listed allied-health disciplines; AHPC's current website lists an expanded set. Because web-list changes can represent later notifications, Learms should store both `statutory_basis` and `list_accessed_at`. [MED-012; MED-013]

### Current AHPC discipline list mapped to Learms roots

| # | AHPC category | Recommended root | Included labels expressly shown by AHPC | Source |
|---:|---|---|---|---|
| 1 | Anesthesia Technology | `health.allied.anesthesia_technology` | — | [MED-013] |
| 2 | Blood Banking Technology | `health.allied.blood_banking` | — | [MED-013] |
| 3 | Medical Laboratory Technology | `health.allied.medical_laboratory` | histopathology; cytopathology; hematology; clinical chemistry/biochemistry; medical microbiology; virology; molecular biology; health biotechnology | [MED-013] |
| 4 | Surgical Technology | `health.allied.surgical_technology` | operating-room technology | [MED-013] |
| 5 | Cardiac Care Technology | `health.allied.cardiac_care` | cardiac surgery; cardiology; cardiac perfusion; cardiovascular technology | [MED-013] |
| 6 | Dental Technology | `health.allied.dental_technology` | dental hygiene | [MED-013] |
| 7 | Renal and Dialysis Technology | `health.allied.renal_dialysis` | — | [MED-013] |
| 8 | Aesthetics and Skin Care Technology | `health.allied.aesthetics_skin` | — | [MED-013] |
| 9 | Endoscopy Technology | `health.allied.endoscopy` | — | [MED-013] |
| 10 | Audiology and Speech Technology | `health.allied.audiology_speech_technology` | — | [MED-013] |
| 11 | Medical Informatics | `health.allied.medical_informatics` | — | [MED-013] |
| 12 | Optometry Technology | `health.allied.optometry` | refraction technology | [MED-013] |
| 13 | Physiotherapy and Rehabilitation | `health.rehabilitation.physiotherapy` | orthotics and prosthetics | [MED-013] |
| 14 | Occupational and Speech Therapy | `health.rehabilitation.occupational_speech` | occupational therapy; speech therapy | [MED-013] |
| 15 | Public Health Technology | `health.allied.public_health_technology` | — | [MED-013] |
| 16 | Radiography and Imaging Technology | `health.allied.medical_imaging` | radiology technology | [MED-013] |
| 17 | Radiotherapy Technology | `health.allied.radiotherapy` | — | [MED-013] |
| 18 | Respiratory Therapy | `health.allied.respiratory_therapy` | pulmonary-function testing | [MED-013] |
| 19 | Nuclear Medicine Technology | `health.allied.nuclear_medicine` | — | [MED-013] |
| 20 | EKG Technology | `health.allied.ekg` | — | [MED-013] |
| 21 | Neurophysiology Technology | `health.allied.neurophysiology` | EEG; NCS; EMG | [MED-013] |
| 22 | Nutrition | `health.nutrition.human_nutrition_dietetics` | human nutrition and dietetics | [MED-013; MED-016] |
| 23 | Podiatric Medicine | `health.allied.podiatric_medicine` | — | [MED-013] |
| 24 | Psychology and Counseling | `health.behavioral.psychology_counseling` | — | [MED-013] |
| 25 | Sports Therapy | `health.rehabilitation.sports_therapy` | — | [MED-013] |
| 26 | Biomedical Technology | `health.allied.biomedical_technology` | — | [MED-013] |
| 27 | Emergency Clinical Medicine Technology | `health.allied.emergency_critical_care` | emergency and intensive-care technology | [MED-013] |
| 28 | Ophthalmic Technology | `health.allied.ophthalmic_technology` | — | [MED-013] |
| 29 | Dispenser Technology | `health.allied.dispenser_technology` | — | [MED-013] |
| 30 | Primary Health Care Technology | `health.allied.primary_health_care` | health technology | [MED-013] |

**Interpretation rule:** This table is a regulator discipline universe, **not** a claim that each category has a nationally notified four-year BS curriculum or that every similarly named course is recognized. [MED-012–MED-014]

## D2. HEC-notified allied-health BS curricula in 2026

HEC notified ten NQF-level-6 BS curricula, each structured over eight semesters in the document. [MED-014]

| HEC standard program | Major concept clusters for Learms | Source |
|---|---|---|
| BS Medical Laboratory Technology | specimen lifecycle; hematology; histo/cytopathology; chemistry; microbiology; immunology; molecular diagnostics; quality systems | [MED-014] |
| BS Anesthesia Technology | equipment; anesthetic drugs; monitoring; perioperative support; critical care; specialty anesthesia; simulation/safety | [MED-014] |
| BS Aesthetics and Skin Care Technology | skin science; infection/pigmentation; procedures; supervised practice; safety and ethics | [MED-014] |
| BS Cardiac Care Technology | electrophysiology; cardiology diagnostics; cardiac surgery/perfusion support; monitoring | [MED-014] |
| BS Dental Technology | dental materials; laboratory prostheses/appliances; digital workflows; infection control | [MED-014] |
| BS Medical Imaging Technology | imaging physics; radiography; CT/MRI/ultrasound exposure; patient/radiation safety; image quality | [MED-014] |
| BS Prosthetics & Orthotics | assessment; biomechanics; design/fabrication; fitting; gait; rehabilitation | [MED-014] |
| BS Renal Dialysis Technology | renal science; dialysis equipment/water; vascular access; patient monitoring; infection/safety | [MED-014] |
| BS Speech and Language Pathology | communication development; assessment; speech/language/voice/swallowing disorders; intervention | [MED-014] |
| BS Surgical Technology | asepsis; instruments; operating-room workflows; perioperative support; specialties; safety | [MED-014] |

## D3. DPT — Doctor of Physical Therapy

| Attribute | Verified description | Source |
|---|---|---|
| Duration | Five-year semester-based professional degree | [MED-005] |
| Core learning domains | anatomy, physiology, pathology, biomechanics/kinesiology, exercise, manual therapy, electrotherapy, medicine/surgery, evidence-based practice, professional practice | [MED-005] |
| Clinical branches | musculoskeletal, neurological, cardiopulmonary, pediatric/neonatal, geriatric, integumentary, sports, and women's-health physical therapy | [MED-005] |
| Practice learning | Six supervised clinical-practice components are listed | [MED-005] |
| Degree-title caution | The curriculum separately addresses use of the prefix “Dr”; Learms must not map the professional title to research doctorate/PhD | [MED-005; MED-030] |

**Learms root:** `health.rehabilitation.dpt`

## D4. Occupational therapy

HEC announced on 6 May 2026 that it had finalized a Bachelor of Occupational Therapy curriculum with AHPC involvement and strengthened supervised clinical practice. During this review, the corresponding published curriculum booklet was not found in HEC's revised-curriculum index, so exact credits and duration are **not asserted here**. [MED-015]

**Learms root:** `health.rehabilitation.occupational_therapy`  
**Evidence status:** curriculum-finalization announcement; booklet needed before encoding semester-level prerequisites.

## D5. Human Nutrition and Dietetics

HEC's 2025 document covers an Associate Degree and BS Human Nutrition & Dietetics; the BS includes a mandatory field experience/internship and clinical, community, food-system, assessment, and research domains. [MED-016]

**Learms root:** `health.nutrition.human_nutrition_dietetics`

---

# E. Public health

HEC's 2025 curriculum covers Associate Degree in Public Health, Bachelor of Science in Public Health (BSPH), and Master of Science in Public Health (MSPH). The BSPH minimum is 125 credit hours in that framework and includes a capstone/research project and field experience. [MED-017]

## Program roots

- `health.public_health.ad_public_health` [MED-017]
- `health.public_health.bsph` [MED-017]
- `health.public_health.msph` [MED-017]

## BSPH concept families

Epidemiology; biostatistics; population health; social/behavioral determinants; environmental and occupational health; infectious and noncommunicable disease; maternal/child/reproductive health; health promotion; policy/management; surveillance; research; global health; humanitarian health; nutrition; climate and urban health. [MED-017]

**Distinction:** `BSPH` is an academic public-health degree; `Public Health Technology` is also an AHPC allied-health category; the two labels must not be merged automatically. [MED-013; MED-017]

---

# F. Veterinary medicine and animal health

## F1. DVM — Doctor of Veterinary Medicine

| Attribute | Verified description | Source |
|---|---|---|
| Curriculum structure | Ten semesters, with internship shown in semester ten | [MED-018] |
| Regulator | PVMC | [MED-018–MED-020] |
| Recognition boundary | PVMC accreditation for DVM does not automatically authorize postgraduate/doctorate programs; those require separate permission | [MED-019] |
| Core families | anatomy/histology, physiology/biochemistry, microbiology, pathology, parasitology, pharmacology/toxicology, epidemiology/zoonoses/food safety, medicine, surgery/anesthesia, theriogenology, nutrition, breeding/genetics, livestock/poultry production, clinics and internship | [MED-018] |
| Institution verification | PVMC maintains a mutable recognized-institution list; use it at decision time | [MED-020] |

**Learms root:** `health.veterinary.dvm`

## F2. Animal-health adjacent programs

Animal husbandry and veterinary/livestock sciences can exist as distinct academic programs, but PVMC's recognized DVM record notes historical B.V.Sc./B.Sc.(A.H.) pathways merging into DVM at listed institutions. Learms should retain legacy qualifications for alumni records without presenting them as the current default DVM route. [MED-020]

---

# G. Eastern/Unani medicine and homoeopathy

> **Neutral taxonomy note:** Listing regulated education pathways does not establish clinical efficacy, equivalence to MBBS, or interchangeability of scopes. Learms must display the relevant regulator and must not infer authority to practice modern medicine from a traditional/complementary qualification. [MED-002; MED-022; MED-025]

## G1. BEMS and FTJ under National Council for Tibb

| Program/pathway | Verified description | Source |
|---|---|---|
| BEMS | Five-year/ten-semester program, 222 credit hours, followed by a one-year house job in the located NCT/HEC curriculum | [MED-021] |
| BEMS registration | NCT's current process asks for verified academic records and house-job certificate | [MED-023] |
| FTJ | NCT maintains a distinct Fazil-ut-Tibb-wal-Jarahat pathway and registration process | [MED-022; MED-023] |
| Admission warning | NCT explicitly advises students to confirm BEMS program recognition before admission | [MED-022] |

**Learms roots:** `health.traditional.bems`, `health.traditional.ftj`.

## G2. BHMS and DHMS under National Council for Homoeopathy

| Program/pathway | Verified description | Source |
|---|---|---|
| BHMS | Five years/ten semesters and 176 credit hours in the located curriculum | [MED-024] |
| DHMS | NCH continues to publish DHMS examination and college information; treat it as a separate diploma route | [MED-025; MED-026] |
| Regulator | NCH states that it regulates qualifications and practitioner registration under the Unani, Ayurvedic and Homoeopathic Practitioners Act 1965 | [MED-025] |
| Institution verification | NCH publishes separate recognized-college and BHMS degree-awarding institution lists | [MED-026] |

**Learms roots:** `health.complementary.bhms`, `health.complementary.dhms`.

---

# H. Paramedical and technician diplomas

Pakistan's paramedical diploma catalog is province-sensitive. A Punjab list must not be presented as a national list, and a two-year technician diploma must not be treated as equivalent to a four-year BS technology degree. [MED-012; MED-014; MED-027–MED-029]

## H1. Punjab Medical Faculty new-scheme pathways

### Listed as equal to F.Sc Medical Technology Group on PMF's page

- Dispenser
- Medical Laboratory Technician
- Radiography & Imaging Technician
- Operation Theatre Technician
- Physiotherapy Technician
- Ophthalmic Technician
- Cardiac Technician
- Dental Hygienist

[MED-027]

### Listed by PMF as not equal to F.Sc on the same page

- Public Health Technician
- Renal Dialysis Technician
- Anesthesia Technician
- Endoscopy Technician
- Centralized Sterilization System Department (CSSD) Technician
- Mortuary Assistant

[MED-027]

PMF states that its new scheme uses two-year programs and a shared core course; the 2024 affiliation criteria provides program-specific institutional requirements. [MED-027; MED-028]

## H2. Khyber Pakhtunkhwa diploma technologies

The KP Faculty of Paramedical and Allied Health Sciences describes itself as the provincial statutory regulator and lists a broader technology catalog, including anesthesia, cardiac, mother/child health, neurophysiology, ophthalmology, physiotherapy, prosthetic/orthotic, psychiatry, pulmonology, radiology/radiotherapy, surgical, dental-surgical assistant, pathology, pharmacy, dialysis, and others. [MED-029]

**Product consequence:** use `jurisdiction = Punjab | KP | Sindh | Balochistan | federal/other` on diploma-program nodes; do not infer equivalence across provincial faculties. [MED-027–MED-029]

---

# I. Evidence-backed findings in required format

## Topic: Pakistan does not have one universal “medical programs” regulator

### Source: Government of Pakistan and national professional regulators, 2022–2026

### Key Finding
Medicine/dentistry, pharmacy, nursing/midwifery, allied health, veterinary medicine, Tibb, and homoeopathy have distinct statutory/regulatory pathways. HEC curriculum publication does not replace profession-specific accreditation or registration. [MED-002; MED-007; MED-009; MED-012; MED-019; MED-022; MED-025]

### Relevance to Learms
Agent 1 should model regulator and jurisdiction as first-class entities. Agent 2 should make “verify recognition” contextual to the selected profession. Agent 3 should authorize regulator-review workflows separately from general content editing.

### Citation
- https://pmdc.pk/Documents/law/Admissions%20Regulations-2025.pdf
- https://pcpisb.gov.pk/
- https://pnmc.gov.pk/admission-criteria/
- https://pakistancode.gov.pk/pdffiles/administrator85ca72c783ea32f5ab4b113a704d9662.pdf
- https://pvmc.gov.pk/SiteImage/Downloads/PVMC-Accreditation-and-Equivalence-Regulations-2015.pdf
- https://www.nct.gov.pk/
- https://nchpakistan.gov.pk/

## Topic: MBBS has a regulator-defined minimum curricular volume

### Source: Pakistan Medical & Dental Council, 2024

### Key Finding
The 2024 PM&DC MBBS guideline defines a five-year program with a minimum 6,200 teaching hours and recognizes traditional, integrated, and hybrid curricular approaches. [MED-001]

### Relevance to Learms
Knowledge-graph sequence cannot assume every university uses the same year/subject layout. Tag concepts by competency, system, discipline, and local curriculum version.

### Citation
https://pmdc.pk/Documents/Others/PM%26DC%20GUIDELINES%20FOR%20UG%20M.EDUCATION-06242024035407.pdf

## Topic: BDS duration is a live contradiction

### Source: Pakistan Medical & Dental Council, 2024 and 2025

### Key Finding
PM&DC announced a five-year BDS reform in 2024, while its April 2025 inspection proforma still describes a four-year curriculum. No primary source resolving cohort-specific implementation was found in this review. [MED-003; MED-004]

### Relevance to Learms
Never store BDS duration as an unversioned scalar. Use effective session, institution, source date, status, and review deadline.

### Citation
- https://pmdc.pk/Publication/PressReleases
- https://pmdc.pk/Documents/Others/BDS%20Inspection%20Performa%20for%20Dental%20College%20up%20to%20100%20Admission%20per%20year.pdf

## Topic: Allied-health legal scope is broader than the ten newly standardized HEC BS curricula

### Source: Government of Pakistan/AHPC, 2022–2026; HEC, 2026

### Key Finding
AHPC's current discipline list contains 30 top-level categories, whereas HEC's February 2026 allied-health booklet standardizes ten named BS programs. A discipline-list entry is therefore not proof of a corresponding HEC curriculum or recognized institutional intake. [MED-012–MED-014]

### Relevance to Learms
Model `regulated_discipline`, `curriculum_standard`, `qualification`, and `institution_offering` separately; require evidence at every link.

### Citation
- https://pakistancode.gov.pk/pdffiles/administrator85ca72c783ea32f5ab4b113a704d9662.pdf
- https://www.ahpc.org.pk/our-disciplines.html
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2025-2026/Allied-Health-Sciences.pdf

## Topic: Professional “Doctor” titles are not PhDs

### Source: HEC, 2015 and 2025

### Key Finding
DPT and Pharm.D are professional degree programs; the NQF separately classifies research doctoral qualifications. The lexical prefix “Doctor” must not create a `same_as PhD` edge. [MED-005; MED-006; MED-030]

### Relevance to Learms
Prevents qualification inflation and incorrect career/admission recommendations.

### Citation
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/DPT.pdf
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Pharm.D.pdf
- https://www.hec.gov.pk/english/services/universities/pqf/Documents/National%20Qualification%20Framework%20of%20Pakistan.pdf

## Topic: Degree and technician tracks are not interchangeable

### Source: AHPC/HEC/PMF, 2022–2026

### Key Finding
The allied-health system contains certificates/diplomas and NQF-level-6 BS programs, while PMF lists specific two-year technician diplomas. Similar labels—such as medical laboratory, imaging, anesthesia, or dialysis—can therefore represent different qualification levels and scopes. [MED-012; MED-014; MED-027; MED-028]

### Relevance to Learms
Display award type and level next to every title; block recommendations that infer scope from keyword similarity.

### Citation
- https://pakistancode.gov.pk/pdffiles/administrator85ca72c783ea32f5ab4b113a704d9662.pdf
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2025-2026/Allied-Health-Sciences.pdf
- https://pmfpunjab.edu.pk/PMF/SchemesOfStudies

## Topic: Paramedical taxonomies are province-sensitive

### Source: Punjab Medical Faculty and KP Faculty of Paramedical & Allied Health Sciences, accessed 2026

### Key Finding
Punjab and KP publish different technology catalogs and structures. A national UI assembled from one province's list would be misleading. [MED-027–MED-029]

### Relevance to Learms
Ask for province before showing technician pathways, eligibility, equivalence, or institutions.

### Citation
- https://pmfpunjab.edu.pk/PMF/SchemesOfStudies
- https://pmfpunjab.edu.pk/Downloads/AffiliationCriteria.pdf
- https://kpmf.edu.pk/fpma/

## Topic: Nursing contains parallel entry and bridge routes

### Source: PNMC and HEC, 2023–2026

### Key Finding
Generic BSN, Post-RN BSN, BS Midwifery, Post-RN BSM, graduate nursing, diplomas, and post-basic specialties have distinct prerequisites and purposes. [MED-008–MED-011]

### Relevance to Learms
Career-path recommendations must start from the learner's existing registration and qualification, not only desired specialty.

### Citation
- https://pnmc.gov.pk/admission-criteria/
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2023-2024/HEC%20Curriculum%20BSN-MSN%202024.pdf
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2023-2024/HEC%20Curriculum%20Midwifery%202024.pdf

## Topic: Public health degree and public-health technology are different nodes

### Source: HEC, 2025; AHPC, accessed 2026

### Key Finding
HEC defines AD/BSPH/MSPH academic pathways, while AHPC lists Public Health Technology as an allied-health discipline. [MED-013; MED-017]

### Relevance to Learms
Avoid false equivalence in search, prerequisites, job matching, and accreditation labels.

### Citation
- https://www.ahpc.org.pk/our-disciplines.html
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Public-Health.pdf

## Topic: Traditional/complementary pathways require regulator-specific recognition

### Source: NCT and NCH, accessed 2026

### Key Finding
BEMS/FTJ and BHMS/DHMS belong to distinct regulator pathways; NCT explicitly warns applicants to confirm program recognition. Neither should be represented as MBBS equivalence without an explicit authoritative equivalence decision. [MED-021–MED-026]

### Relevance to Learms
Use neutral labeling, disclose regulator, prevent cross-scope inference, and separate evidence about education regulation from evidence about treatment efficacy.

### Citation
- https://www.nct.gov.pk/
- https://nct.gov.pk/documents/HEC-Approved-Syllabus-for-BEMS_fb5e.pdf
- https://nchpakistan.gov.pk/
- https://nchpakistan.gov.pk/images/UploadImages/BHMS-Syllabusea2.pdf

---

# J. Knowledge-graph implementation guidance for Agent 1

## Required node types

1. `Profession`
2. `Program`
3. `Qualification`
4. `Regulator`
5. `Institution`
6. `Campus`
7. `RecognizedIntake`
8. `CurriculumVersion`
9. `ProgramPhase`
10. `Discipline`
11. `BodySystem`
12. `Concept`
13. `Competency`
14. `ClinicalSkill`
15. `AssessmentType`
16. `LicenseOrRegister`
17. `Jurisdiction`
18. `CareerRole`
19. `Source`
20. `ContradictionReview`

## Required edge types

- `REGULATED_BY`
- `HAS_CURRICULUM_VERSION`
- `LEADS_TO_QUALIFICATION`
- `OFFERED_AT_CAMPUS`
- `RECOGNIZED_FOR_INTAKE`
- `HAS_PHASE`
- `CONTAINS_DISCIPLINE`
- `CONTAINS_CONCEPT`
- `REQUIRES_COMPETENCY`
- `ASSESSED_BY`
- `REQUIRES_PRIOR_QUALIFICATION`
- `ELIGIBLE_FOR_REGISTRATION`
- `PRACTICES_WITHIN_SCOPE`
- `VALID_IN_JURISDICTION`
- `SUPERSEDES`
- `CONTRADICTS`
- `SUPPORTED_BY_SOURCE`

## Minimum provenance fields on mutable facts

```yaml
claim_id: string
subject_id: string
predicate: string
object: string
jurisdiction: string
effective_from: date_or_null
effective_to: date_or_null
cohort_or_session: string_or_null
source_id: string
source_url: uri
published_at: date_or_null
accessed_at: datetime
status: verified|conflicting|superseded|not_found
review_after: date
reviewed_by: string_or_null
```

## High-risk invalid edges to reject

- `DPT SAME_AS PhD`
- `PharmacyTechnician SAME_AS PharmD`
- `BSMedicalLaboratoryTechnology SAME_AS two-year MLT diploma`
- `BEMS SAME_AS MBBS`
- `BHMS SAME_AS MBBS`
- `AHPC_DISCIPLINE IMPLIES HEC_CURRICULUM`
- `UNIVERSITY_RECOGNIZED IMPLIES PROGRAM_INTAKE_RECOGNIZED`
- `CURRICULUM_SEQUENCE IMPLIES UNIVERSAL_PREREQUISITE`

[MED-005–MED-007; MED-012–MED-014; MED-021–MED-030]

---

# K. UI/content guidance for Agent 2

1. Start with profession and province, not a flat “medical” list. [MED-002; MED-012; MED-027–MED-029]
2. Show qualification type and duration beside the title; add cohort-specific warning where conflicting. [MED-003–MED-006]
3. Put regulator and recognition-check link on every program card. [MED-007; MED-013; MED-020; MED-022; MED-025]
4. Use separate tabs for degree, diploma/technician, bridge/post-RN, postgraduate, and historical pathways. [MED-007–MED-010; MED-027]
5. Mark mutable data “checked on 30 Sep 2026,” not “current forever.”
6. For clinical curricula, distinguish `know`, `demonstrate in simulation`, `perform under supervision`, and `licensed for independent practice`. [MED-001; MED-005; MED-008; MED-014]
7. On traditional/complementary programs, show neutral scope/regulator language and do not imply MBBS equivalence or therapeutic efficacy. [MED-021–MED-026]

---

# L. Data-security guidance for Agent 3

1. Program browsing is ordinary profile data; registration IDs, student records, clinical logbooks, patient encounters, disability accommodations, and wellbeing disclosures require progressively stronger classification.
2. A clinical logbook can contain patient identifiers even when uploaded as “study notes”; route it through PHI detection/redaction and restricted retention.
3. Institution/regulator reviewer roles must be scoped by profession, program, jurisdiction, and effective session; one reviewer must not gain blanket access to all student or patient content.
4. Recognition claims need tamper-evident source/version audit records because altered status can cause financial and career harm.
5. Never expose public verification search results as bulk downloadable identity datasets without legal/security review.

These recommendations follow from the distinct registration and institutional-recognition systems documented by PM&DC, PCP, PNMC, AHPC, PVMC, NCT, and NCH. [MED-002; MED-007; MED-009; MED-012; MED-020; MED-022; MED-025]

---

# M. Gaps and “not found” register

1. **BDS current duration by 2026 intake:** not resolved from consistent primary PM&DC documents; primary sources conflict. [MED-003; MED-004]
2. **Published HEC Bachelor of Occupational Therapy booklet:** finalization announcement found; final booklet not found in the reviewed index. [MED-015]
3. **National curriculum booklet for every AHPC category:** not found; only ten programs are in HEC's February 2026 combined allied-health booklet. [MED-013; MED-014]
4. **Uniform national equivalence across provincial paramedical diplomas:** not found. [MED-027–MED-029]
5. **Current intake and campus recognition:** intentionally not frozen in this document; query regulator lists at point of use.
6. **A single official exhaustive list spanning every health-related university degree:** not found; responsibility is distributed across regulators and HEC.
7. **Treatment efficacy of Tibb/homoeopathy:** outside this education taxonomy and not inferred from regulatory recognition.

## Next research step

Proceed to specialty taxonomies using CPSP, PM&DC postgraduate regulations, specialty colleges, PNMC, PCP, AHPC, and PVMC sources. For every specialty, separate credential, training pathway, recognized institution, examination, scope, and current status.
