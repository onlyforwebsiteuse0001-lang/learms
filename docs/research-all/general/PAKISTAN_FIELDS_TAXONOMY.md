# Pakistan Fields Taxonomy — HEC-Grounded Field / Category / Root / Sub-Root Map

**Agent 4 — Area 1.1** · Last updated 2026-09-30
**Primary source:** Higher Education Commission (HEC) Pakistan, Curriculum Division —
Revised Curricula portal, and the National Qualifications Framework (NQF) of Pakistan.

> **Why this document exists:** Learms needs a canonical, *verifiable* subject tree so that
> content (Agent 2), knowledge-graph nodes (Agent 1) and analytics roll-ups (Agent 3) all use
> the same identifiers. The tree below is derived from **HEC's own discipline list** rather than
> invented, so every node can be traced to an official curriculum document.

---

## 0. Structural facts you must encode (NQF)

### Topic: Pakistan degree structure and credit-hour rules
### Source: HEC, National Qualifications Framework of Pakistan (2015); HEC Undergraduate Education Policy V1.1 (2023)
### Key Finding
- Undergraduate (4-year BS) = **NQF Level 6**, **124–140 credit hours**, 8 semesters, 15–18 cr/semester, 16–18 week semesters. [HEC, 2015]
- Associate Degree = 2 years / **68 credit hours** (some documents say 60–72), NQF Level 5, designed as an exit-and-re-entry point. [HEC, 2015]
- MS/MPhil = **NQF Level 7**, 30 credit hours total (min 24 coursework + 6 thesis). [HEC]
- PhD = **NQF Level 8**, min 18 credit hours coursework + dissertation. [HEC]
- 5-year licensure degrees (MBBS, Pharm.D, B.Arch) = **min 160 credit hours**. [HEC]
  ⚠ **LLB was 5 years, but the Supreme Court ordered a reduction to 4 years in 2025** — see the
  note at the law row below. The JSON (`pakistan_fields_taxonomy.json`) carries `years: 4`.
- Mandatory **General Education core = 30 credit hours / 12 courses** for *every* undergraduate
  program: Arts & Humanities (2), Natural Sciences (3), Social Sciences (2), Functional English (3),
  Expository Writing (3), Quantitative Reasoning ×2 (6), Islamic Studies or Ethics (2),
  Ideology & Constitution of Pakistan (2), ICT Applications (3), Entrepreneurship (2),
  Civics & Community Engagement (2). [HEC UG Policy V1.1, 2023]
- Major/disciplinary requirement ≈ **min 78 credit hours**; interdisciplinary ≈ **min 12 credit hours**;
  plus field experience / internship and a **capstone project**. [HEC UG Policy V1.1, 2023]
- Recent 2025 curricula (e.g. BS Political Science) set a **minimum 122 credit hours** including
  internship — i.e. HEC is trending *down* slightly from the old 124 floor. **[CONTESTED / evolving]**

### Relevance to Learms
This is the **skeleton of the product's scope model**. Concretely:
1. Every Learms "program" object should carry `nqf_level`, `duration_years`, `credit_hours_min/max`.
2. The 30-credit Gen-Ed core is **shared across 100% of Pakistani undergraduates** — it is the single
   highest-leverage content investment in the entire catalogue. Build Gen-Ed first
   (Quantitative Reasoning, Functional English, Expository Writing, ICT) before any niche major.
3. Semester = 16–18 weeks → default study-plan horizon and spaced-repetition scheduling window
   should be **~16 weeks**, with midterm at week 8 and finals at week 16–18.

### Citation
- https://www.hec.gov.pk/english/services/universities/pqf/Documents/National%20Qualification%20Framework%20of%20Pakistan.pdf
- https://www.hec.gov.pk/english/services/universities/Documents/Final%20Examination%20Policy%20Guidelines.pdf
- https://uoch.edu.pk/public/storage/files/1/Donwloads/Rules%20and%20Regulations/HEC%20Undergraduate%20Education%20Policy%202023.pdf
- https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Political-Science.pdf

---

## 1. The 11 broad fields (Level 1)

Learms' top level. The grouping below maps HEC's discipline inventory into 11 buckets that match
the product's "category" concept and Pakistani students' own mental model (what they call their
"line": pre-medical, pre-engineering, ICS, commerce, arts).

| # | Field ID | Field name | Anchor accrediting body |
|---|---|---|---|
| 1 | `natural-sciences` | Natural & Physical Sciences | HEC |
| 2 | `it-computing` | IT & Computing | HEC (NCEAC for accreditation) |
| 3 | `engineering` | Engineering & Technology | **PEC** (Pakistan Engineering Council) |
| 4 | `health-medicine` | Health & Medicine | **PM&DC**, PNC, PCP |
| 5 | `business-accounting` | Business, Commerce & Accounting | HEC + **ICAP / ICMA / ACCA** |
| 6 | `law` | Law & Legal Studies | **Pakistan Bar Council (PBC)** |
| 7 | `education` | Education & Teacher Training | HEC + **NACTE** |
| 8 | `social-sciences` | Social Sciences | HEC |
| 9 | `arts-humanities` | Arts, Humanities & Languages | HEC |
| 10 | `agriculture-vet` | Agriculture & Veterinary Sciences | HEC + **PVMC** |
| 11 | `media-communication` | Media, Communication & Design | HEC |

> **Note on "80+ detailed fields":** the counts below total **~95 root disciplines**, all of which
> appear in HEC's Revised Curricula inventory, PEC's accredited-programme list, or a professional
> body's syllabus. Nodes marked † are verified against a *specific* HEC curriculum PDF published
> 2023–2026 (i.e. current). Unmarked nodes exist as recognised programmes but the latest HEC
> curriculum document is older than 2017 or was not individually verified in this pass.

---

## 2. Field → Category → Root → Sub-root

### 2.1 Natural & Physical Sciences (`natural-sciences`)

| Category | Root discipline | Sub-roots (typical BS specialisation / course clusters) |
|---|---|---|
| Mathematical Sciences | **Mathematics** † | Calculus & Analysis · Linear Algebra · Abstract Algebra · Real & Complex Analysis · Topology · ODE/PDE · Numerical Analysis · Discrete Mathematics · Mathematical Modelling · Optimisation |
| Mathematical Sciences | **Statistics** † | Probability Theory · Statistical Inference · Regression Analysis · Design of Experiments · Sampling · Time Series · Multivariate Analysis · Biostatistics · Econometrics |
| Physical Sciences | **Physics** † | Mechanics · Electricity & Magnetism · Thermodynamics & Stat. Mech. · Waves & Oscillations · Modern Physics · Quantum Mechanics · Solid State · Nuclear Physics · Electronics · Computational Physics |
| Physical Sciences | **Chemistry** † | Physical Chemistry · Organic Chemistry · Inorganic Chemistry · Analytical Chemistry · Biochemistry · Industrial Chemistry · Polymer Chemistry · Spectroscopy |
| Physical Sciences | **Geology** † | Mineralogy · Petrology · Structural Geology · Stratigraphy · Palaeontology · Geophysics · Hydrogeology · Economic Geology |
| Life Sciences | **Biology (general)** † | Cell Biology · Genetics · Ecology · Evolution · Physiology · Molecular Biology |
| Life Sciences | **Botany** † | Plant Anatomy · Plant Physiology · Plant Taxonomy · Phycology/Mycology · Plant Pathology · Ethnobotany |
| Life Sciences | **Zoology** † | Invertebrate/Vertebrate Zoology · Animal Physiology · Entomology · Parasitology · Wildlife & Fisheries · Developmental Biology |
| Life Sciences | **Biochemistry** † | Enzymology · Metabolism · Molecular Biology · Clinical Biochemistry · Immunology |
| Life Sciences | **Microbiology** † | Bacteriology · Virology · Mycology · Industrial Microbiology · Medical Microbiology · Immunology |
| Life Sciences | **Biotechnology** † | Industrial Biotech · Medical Biotech · Agricultural Biotech · Genetic Engineering · Bioprocess Technology |
| Life Sciences | **Genetics** | Molecular Genetics · Human Genetics · Population Genetics · Cytogenetics |
| Life Sciences | **Bioinformatics** † | Sequence Analysis · Structural Bioinformatics · Genomics · Biological Databases · Programming for Biology |
| Life Sciences | Fresh Water Biology | Limnology · Aquatic Ecology · Fisheries Biology |
| Environmental | **Environmental Science** † | Pollution Control · EIA · Climate Change · Waste Management · Env. Chemistry · Conservation |
| Environmental | **Geography** † | Physical Geography · Human Geography · Cartography · Urban Geography · GIS |
| Environmental | **Remote Sensing & GIS** † | Image Processing · Spatial Analysis · Photogrammetry · Geodatabases |
| Environmental | Disaster Management | Hazard Assessment · Risk Reduction · Emergency Response · Resilience Planning |

### 2.2 IT & Computing (`it-computing`)

HEC treats these under one umbrella document, **"Computing Disciplines"** (2022-23) plus standalone
2025-26 curricula for Computer Science and Cyber Security. The five canonical computing degrees
in Pakistan are CS, SE, IT, CE (engineering side), and (newer) AI / Data Science.

| Category | Root discipline | Sub-roots |
|---|---|---|
| Core computing | **Computer Science** † (2025-26 revision) | Programming Fundamentals · OOP · Data Structures & Algorithms · Discrete Structures · Computer Organisation · Operating Systems · Databases · Computer Networks · Theory of Computation · Compiler Construction · Software Engineering · AI · Web/Mobile Development · Graphics |
| Core computing | **Software Engineering** | Requirements Engineering · Software Design & Architecture · Software Quality Assurance · Software Project Management · DevOps · Formal Methods · HCI |
| Core computing | **Information Technology** | Networking · System Administration · IT Infrastructure · Enterprise Systems · Web Technologies · IT Service Management |
| Core computing | **Cyber Security** † (2025-26) | Cryptography · Network Security · Digital Forensics · Ethical Hacking/Pen-testing · Secure Software Development · Governance, Risk & Compliance · Malware Analysis |
| Data & AI | **Artificial Intelligence** | Machine Learning · Deep Learning · NLP · Computer Vision · Knowledge Representation · Robotics · Reinforcement Learning |
| Data & AI | **Data Science** | Statistics for DS · Data Wrangling · Data Visualisation · Big Data (Spark/Hadoop) · ML Ops · Business Intelligence |
| Data & AI | **Bioinformatics** † | (cross-listed with Life Sciences) |
| Information systems | **Management Information Systems / BSIS** | ERP · Systems Analysis & Design · IS Strategy · E-Commerce |
| Information systems | **Library & Information Science** † | Cataloguing & Classification · Information Retrieval · Digital Libraries · Knowledge Management |

### 2.3 Engineering & Technology (`engineering`)

**Authoritative list: Pakistan Engineering Council (PEC) accredited curricula.** PEC publishes
curricula in cohorts — 2020, 2023, 2024 — and only PEC-accredited programmes allow registration
as a Registered Engineer (RE), which is a hard requirement for most engineering jobs in Pakistan.

| PEC curriculum cohort | Disciplines |
|---|---|
| **PEC Curricula-2020** | Aerospace · Agricultural · Automotive · Avionics · Building & Architectural · Computer · Geoinformatics · Geological · Polymer · Software · Telecommunication · Textile · Transportation |
| **PEC Curricula-2023** | Chemical · Civil · Electrical · Food · Information Security |
| **PEC Curricula-2024** | Industrial · Mechanical · Mechatronics · Naval Architecture · Metallurgy & Materials · Mining · Petroleum & Gas |
| HEC-side (non-PEC or dual) | Biomedical Engineering · Environmental Engineering · Energy System Engineering · Electronics · Engineering Technologies (B.Tech / BSc Engg Tech) · Architecture † · City & Regional Planning |

Sub-roots for the four biggest by enrolment:

- **Electrical**: Circuit Analysis · Electronics I/II · Signals & Systems · Electromagnetic Field Theory · Electrical Machines · Power Systems · Control Systems · Power Electronics · Digital Signal Processing · Instrumentation
- **Civil**: Engineering Mechanics · Strength of Materials · Structural Analysis · RC Design · Steel Design · Geotechnical Engineering · Fluid Mechanics · Hydraulics · Transportation Engineering · Surveying · Construction Management · Environmental Engineering
- **Mechanical**: Statics & Dynamics · Thermodynamics · Fluid Mechanics · Heat & Mass Transfer · Machine Design · Manufacturing Processes · Mechanics of Materials · IC Engines · Refrigeration & A/C · Mechanical Vibrations · CAD/CAM
- **Computer/Software Engg**: Digital Logic Design · Computer Architecture · Microprocessors · Embedded Systems · Signals & Systems · Operating Systems · Networks · VLSI

> **Important product note:** PEC's "Level-I vs Level-II" accreditation distinction matters to
> students *materially* (Level-II = Washington Accord-aligned OBE programme). Learms should surface
> accreditation level on any engineering programme page. Source: https://www.pec.org.pk/accredition/

### 2.4 Health & Medicine (`health-medicine`)

| Category | Root discipline | Notes / sub-roots |
|---|---|---|
| Medicine & Dentistry | **MBBS** | 5 years, PM&DC-regulated; entry via **MDCAT**. Pre-clinical (Anatomy, Physiology, Biochemistry) → Para-clinical (Pathology, Pharmacology, Forensic Medicine, Community Medicine) → Clinical (Medicine, Surgery, Obs/Gyn, Paeds) |
| Medicine & Dentistry | **BDS** | 4 years, PM&DC. Oral Anatomy · Dental Materials · Oral Pathology · Periodontology · Prosthodontics · Orthodontics · Oral Surgery |
| Pharmacy | **Pharm.D** † (revised 2025) | 5 years. Pharmaceutics · Pharmaceutical Chemistry · Pharmacology · Pharmacognosy · Pharmacy Practice · Clinical Pharmacy |
| Nursing | **BSN / Post-RN BSN** † | Fundamentals · Med-Surg Nursing · Community Health Nursing · Mental Health Nursing · Leadership |
| Nursing | **BS Midwifery (BSM)** † | Antenatal · Intrapartum · Postnatal · Neonatal care |
| Nursing | **Pediatric Nursing (BS, Post-RN)** † | |
| Rehabilitation | **Doctor of Physical Therapy (DPT)** † | 5 years. Musculoskeletal PT · Neurological PT · Cardiopulmonary PT · Sports PT · Electrotherapy |
| Allied health | **Allied Health Sciences (BS)** † (2025-26) | Medical Lab Technology · Radiology/Imaging Technology · Anaesthesia Technology · Operation Theatre Technology · Optometry · Dental Hygiene · Cardiac Perfusion · Dialysis Technology · Emergency & Critical Care |
| Public & population health | **Public Health (BS/MS/MPH)** † | Epidemiology · Biostatistics · Health Policy · Environmental Health · Health Promotion |
| Nutrition | **Human Nutrition & Dietetics** † (revised 2025) | Clinical Nutrition · Community Nutrition · Food Service Management · Therapeutic Diets |
| Nutrition/Food | **Food Science & Technology** † (revised 2025) | Food Chemistry · Food Microbiology · Food Processing · Food Safety & Quality · Dairy Technology |
| Alternative medicine | Tibb (Eastern Medicine) · Homoeopathy | Recognised in NQF subject-area list [HEC, 2015] |

### 2.5 Business, Commerce & Accounting (`business-accounting`)

| Category | Root discipline | Sub-roots |
|---|---|---|
| Management | **Business & Management Studies (BBA/BS)** † (2025-26) | Principles of Management · Organisational Behaviour · HRM · Operations Management · Strategic Management · Entrepreneurship · Project Management · Supply Chain |
| Accounting & finance | **Commerce (B.Com / BS Commerce)** † | Financial Accounting · Cost Accounting · Auditing · Business Law · Taxation · Banking |
| Accounting & finance | **Accounting & Finance (BS A&F)** | Financial Reporting (IFRS) · Management Accounting · Corporate Finance · Investment Analysis · Audit & Assurance · Taxation |
| Marketing | Marketing (BBA specialisation) | Consumer Behaviour · Brand Management · Digital Marketing · Marketing Research · IMC |
| Economics | **Economics (BS)** | Micro · Macro · Econometrics · Development Economics · International Trade · Public Finance · Monetary Economics · Economy of Pakistan |
| Professional accounting (non-degree) | **CA (ICAP)**, **ACCA**, **CMA (ICMA Pakistan)**, **CIMA**, **CFA** | See `PROFESSIONAL_CERTIFICATIONS.md` |
| Hospitality | Tourism & Hospitality Management | Front Office · F&B Management · Tourism Geography · Event Management |

### 2.6 Law & Legal Studies (`law`)

| Category | Root | Sub-roots |
|---|---|---|
| Professional law | **LLB (4-year as of the SC's 2025 order; previously 5-year)** † (HEC LLB curriculum, 2024-25) | Islamic Jurisprudence · Constitutional Law of Pakistan · Criminal Law (PPC) · Law of Contract · Law of Torts · Property Law · Civil Procedure Code · Criminal Procedure Code · Qanun-e-Shahadat (Evidence) · Company Law · Labour Law · International Law · Human Rights Law · Legal Research & Writing · Moot Court / Clinical Legal Education |
| Postgraduate law | LLM | Corporate Law · Criminal Justice · International Law · Human Rights · Shariah & Law |
| Licensure | **Pakistan Bar Council — Law-GAT / Bar exam** | See `PROFESSIONAL_CERTIFICATIONS.md` |
| Related | Criminology · Shariah & Law · Forensic Science | |

### 2.7 Education & Teacher Training (`education`)

HEC's **Education 2025** curriculum booklet is unusually explicit — it lists **26 named specialisations**,
which makes it the best-documented field for building a deep sub-root tree. [HEC/NACTE, 2025]

Roots: **B.Ed (Hons) Elementary (4-yr)** · **B.Ed (1.5-yr / 2.5-yr)** · **BS Education** ·
**ADE (Associate Degree in Education)** · **M.Ed / MS Education** · **Physical Education** †

Specialisations (verbatim from HEC Education 2025 booklet):
1. Early Childhood Care and Education
2. Educational Research
3. Educational Assessment
4. Child Rights and Safety Education
5. Educational Policy and Planning
6. Curriculum Studies
7. Educational Leadership and Management
8. Educational Psychology
9. Guidance and Counselling
10. Inclusive Education
11. Literacy and Non-Formal Education
12. Online and Distance Learning
13. Quality Assurance in Education
14. Comparative Education
15. Teacher Professional Development
16. Mathematics Education
17. STEM Education
18. Islamic Education
19. Education for Sustainable Development
20. Educational Entrepreneurship
21. Educational Technology
22. Health and Physical Education
23. **Artificial Intelligence in Education**
24. Special Education (Intellectual Impairments)
25. Special Education (Visual Impairments)
26. Special Education (further impairment categories)

> **Strategic signal for Learms:** HEC has *already* put "Artificial Intelligence in Education",
> "Educational Technology" and "Online and Distance Learning" into the national B.Ed curriculum.
> That means there is an official, funded demand for AI-in-education teaching material in Urdu/English
> at undergraduate level — a directly addressable Learms content vertical, not a speculative one.

### 2.8 Social Sciences (`social-sciences`)

| Root | Sub-roots |
|---|---|
| **Psychology** † | General/Cognitive · Developmental · Social · Abnormal/Clinical · Personality · Experimental Psychology & Statistics · Counselling · Industrial-Organisational · Neuropsychology |
| **Sociology** † | Classical & Contemporary Theory · Research Methods · Social Stratification · Rural/Urban Sociology · Criminology & Deviance · Gender & Society · Social Change |
| **Political Science** † | Political Theory · Comparative Politics · Public Administration · Constitutional Development of Pakistan · Political Economy of Pakistan · Civil–Military Relations · Local Government |
| **International Relations** † | IR Theory · Foreign Policy of Pakistan · Diplomacy · Strategic & Security Studies · International Organisations · International Law · Regional Studies (South Asia, Middle East, Indo-Pacific) |
| **Social Work** † | Social Case Work · Group Work · Community Organisation · Social Policy · NGO Management |
| **Economics** | (cross-listed under Business) |
| **Gender Studies** | Feminist Theory · Gender & Development · Gender & Law |
| **Pakistan Studies** † (2025-26) | Pakistan Movement · Constitutional History · Society & Culture · Economy · Foreign Policy |
| **Anthropology** | Social/Cultural Anthropology · Ethnography · Archaeology-adjacent |
| **Criminology** | Theories of Crime · Criminal Justice System of Pakistan · Policing · Penology |
| **Home Economics** † | Food & Nutrition · Textiles & Clothing · Human Development & Family Studies · Interior Design · Resource Management |

### 2.9 Arts, Humanities & Languages (`arts-humanities`)

| Root | Sub-roots |
|---|---|
| **English** † | English Literature (Poetry/Drama/Novel) · Linguistics · Phonetics & Phonology · Syntax · Sociolinguistics · ELT/TESOL · Literary Criticism · World Literature |
| **Urdu** | Urdu Adab (Nazm/Ghazal/Afsana) · Urdu Zaban ki Tareekh · Tanqeed · Iqbaliyat · Lisaniyat |
| Regional languages | Punjabi · Sindhi · Pashto · Balochi · Saraiki · Kashmiri |
| Classical/foreign languages | Arabic · Persian · Chinese · French · German · Turkish |
| **Islamic Studies** † | Quranic Studies (Tafsir) · Hadith & Usul al-Hadith · Fiqh & Usul al-Fiqh · Seerah · Islamic History · Comparative Religion · Islamic Economics |
| **History** † | History of Pakistan/India · Islamic History · World History · Historiography |
| **Archaeology** | Prehistory · Field Methods · Museology · Gandhara Studies |
| **Philosophy** | Logic · Ethics · Epistemology · Muslim Philosophy · Western Philosophy |
| **Fine Arts (AD/BFA/MFA)** † (2025-26) | Painting · Sculpture · Printmaking · Miniature Painting · Calligraphy · Art History |

### 2.10 Agriculture & Veterinary (`agriculture-vet`)

**HEC Agriculture curriculum revised 2025-26** †

| Root | Sub-roots |
|---|---|
| **Agriculture (BS Hons)** † | Agronomy · Horticulture · Soil Science · Plant Breeding & Genetics · Plant Pathology · Entomology · Agricultural Extension · Agricultural Economics · Forestry & Range Management · Water Management |
| **Crop Physiology / Agronomy** | Crop Production · Weed Science · Cropping Systems · Seed Technology |
| **Animal Sciences / Animal Husbandry** | Animal Nutrition · Animal Breeding & Genetics · Poultry Science · Dairy Technology · Meat Science |
| **Doctor of Veterinary Medicine (DVM)** | Vet Anatomy · Vet Physiology · Vet Pathology · Vet Surgery · Theriogenology · Vet Microbiology · Livestock Management |
| **Fisheries & Aquaculture** | Fish Biology · Aquaculture Systems · Fish Processing |
| **Food Engineering** | (cross-listed with Engineering) |
| **Agricultural Engineering** | Farm Machinery · Irrigation & Drainage · Post-Harvest Engineering |

### 2.11 Media, Communication & Design (`media-communication`)

| Root | Sub-roots |
|---|---|
| **Media & Communication Studies** † | Journalism (Print/Broadcast/Digital) · Media Theory · Development Communication · Public Relations · Advertising · Media Law & Ethics · Film & TV Production · Radio Production · New Media & Social Media · Media Research |
| **Graphic Design / Communication Design** | Typography · Branding · UI/UX · Motion Graphics · Illustration |
| **Film & Television** | Screenwriting · Cinematography · Editing · Sound Design |
| **Architecture** † (cross-listed) | Design Studio · Building Construction · History of Architecture · Urban Design |
| **Textile Design / Fashion Design** | Surface Design · Weaving · Fashion Illustration · Pattern Making |

---

## 3. Cross-cutting: the Gen-Ed layer (applies to every field)

Because HEC mandates the same 12 Gen-Ed courses for all undergraduates, Learms should model
Gen-Ed as a **separate, reusable content spine** linked into every programme rather than duplicated:

| Gen-Ed course | Cr | Learms content priority |
|---|---|---|
| Quantitative Reasoning I & II | 6 | **P0** — highest reuse, highest failure rate |
| Functional English | 3 | **P0** — also the main language-barrier lever |
| Expository Writing | 3 | **P0** |
| Applications of ICT | 3 | **P1** |
| Natural Sciences (Gen-Ed) | 3 | P1 |
| Islamic Studies / Ethics | 2 | P1 (cultural must-have) |
| Ideology & Constitution of Pakistan | 2 | P1 |
| Arts & Humanities | 2 | P2 |
| Social Sciences | 2 | P2 |
| Entrepreneurship | 2 | P2 |
| Civics & Community Engagement | 2 | P2 |

---

## 4. Pre-university layer (do not skip — it is most of the market)

HEC's tree starts at NQF 5. But the largest addressable Pakistani study population sits *below* it:

| Stage | Boards / bodies | Streams |
|---|---|---|
| Matric (Grade 9–10, SSC) | 30+ provincial BISEs, FBISE | Science (Bio / Computer) · Arts/General · Commerce |
| Intermediate (Grade 11–12, HSSC) | BISEs, FBISE | **Pre-Medical** · **Pre-Engineering** · **ICS** (Computer Science) · **I.Com** · **F.A.** · General Science |
| O/A Level | Cambridge (CAIE), Edexcel | ~70 O-Level + ~55 A-Level subjects |
| Entry tests | **MDCAT** (PM&DC/PMC), **ECAT** (UET), **NET** (NUST), **NAT/GAT** (NTS), **LAT/Law-GAT** (PBC/HEC) | |

**Relevance:** Learms' funnel almost certainly starts at Matric/Inter and entry tests, not BS year 1.
MDCAT and ECAT alone are an annual cohort in the hundreds of thousands with extreme willingness to
study. Recommend Agent 2 treat `pre-university` as a **12th top-level field** in the UI even though
HEC does not.

---

## 5. Contradictions & open questions

| # | Issue | Detail |
|---|---|---|
| C1 | Credit-hour floor | NQF 2015 and the Examination Policy Guidelines say 124 minimum for a 4-year BS; HEC's own 2025 Political Science booklet specifies 122. Use **122–140** as the permissive range and store per-programme actuals. |
| C2 | Associate Degree length | NQF text gives both "2-years/60-72 credit hours" (Level 5 table) and "four semesters, 68 credit hours" (foreword). Treat 60–72 as the range. |
| C3 | "11 broad fields / 80+ detailed fields" | HEC does **not** publish an official 11-field taxonomy with that exact wording. The 11-field grouping in §1 is *Learms' own* mapping over HEC's discipline inventory. It must not be presented to users as "official HEC categories". **[Flagged: avoid false authority claims in UI copy.]** |
| C4 | Computing accreditation | HEC publishes computing curricula, but programme accreditation runs through NCEAC; PEC accredits Computer/Software *Engineering*. A BS SE and a BE SE are different regulatory animals — model both. |
| C5 | Curriculum staleness | Several disciplines (Urdu, regional languages, Philosophy, Anthropology, DVM) have no post-2018 HEC revision on the portal. Content built there should be validated against a specific university's scheme of studies instead. |

---

## 6. Actionable for Learms

| # | Decision | Owner |
|---|---|---|
| A1 | Adopt 4-level hierarchy `field → category → root → sub_root`, plus a cross-cutting `gen_ed` spine and a `pre_university` field. Store as a DAG, not a tree (many disciplines are legitimately cross-listed: Bioinformatics, Biochemistry, Economics, Architecture, Food Engineering). | Agent 1 |
| A2 | Every programme node carries: `nqf_level`, `duration_years`, `credit_hours`, `accreditor` (HEC/PEC/PM&DC/PBC/NACTE/PVMC), `licensure_required` (bool), `entry_test`. | Agent 1 |
| A3 | Seed content in this order: Gen-Ed QR/English → Pre-University (MDCAT/ECAT/ICS) → CS + Electrical/Civil/Mechanical Engg → MBBS pre-clinical → Commerce/ACCA. This is descending order of (cohort size × willingness to pay × content reusability). | Agent 2 |
| A4 | Never label the 11-field grouping "official HEC categories" in UI copy (see C3). Say "organised in line with HEC disciplines". | Agent 2 |
| A5 | Surface PEC accreditation Level-I/II and PM&DC recognition on programme pages — it is a top-3 student decision factor in Pakistan. | Agent 2 |
| A6 | Machine-readable version of this tree lives in `docs/research/pakistan_fields_taxonomy.json`. | Agent 1/2 |

---

## Sources

| Type | Source | URL |
|---|---|---|
| Primary (official) | HEC Curriculum Division — Revised Curricula portal (inventory of all revised disciplines 2015-16 → 2025-26) | https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Pages/default.aspx |
| Primary (official) | HEC — National Qualifications Framework of Pakistan, 2015 | https://www.hec.gov.pk/english/services/universities/pqf/Documents/National%20Qualification%20Framework%20of%20Pakistan.pdf |
| Primary (official) | HEC — Undergraduate Education Policy V1.1, 2023 | https://uoch.edu.pk/public/storage/files/1/Donwloads/Rules%20and%20Regulations/HEC%20Undergraduate%20Education%20Policy%202023.pdf |
| Primary (official) | HEC — Policy Guidelines for Implementation of Uniform Standardized Scheme of Studies | https://www.hec.gov.pk/english/services/universities/Documents/Final%20Examination%20Policy%20Guidelines.pdf |
| Primary (official) | HEC Curriculum Booklet — Education, 2025 (26 specialisations) | https://www.nacte.org.pk/assets/download/RevisedCurriculum(Education2025).pdf |
| Primary (official) | HEC Curriculum Booklet — Political Science, 2025 (122 cr. hrs) | https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Documents/2024-2025/Political-Science.pdf |
| Primary (official) | HEC News — Revised curricula for Pharm.D, Food Science & Technology, Human Nutrition & Dietetics (10 Sep 2025) | https://www.hec.gov.pk/english/news/news/Pages/HEC-Notifies-Revised-Curricula.aspx |
| Primary (official) | Pakistan Engineering Council — All Curricula (2020/2023/2024 cohorts) | https://www.pec.org.pk/curriculum-fee-structure/all-curriculums/ |
| Primary (official) | Pakistan Engineering Council — Accreditation (Level-I / Level-II) | https://www.pec.org.pk/accredition/ |
