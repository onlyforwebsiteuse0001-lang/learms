# Medical-student problems: evidence overview

Evidence cutoff: **2026-09-30**. Population: undergraduate medical students unless a source says otherwise. This is an evidence map, not a diagnostic instrument or a claim that every student experiences every problem.

## Topic
Burden is multidomain, but prevalence is not a product truth for an individual

### Source
Global systematic reviews/meta-analyses of depression and suicidal ideation, anxiety, burnout, sleep, and mistreatment. [MED-087, MED-088, MED-089, MED-090, MED-091]

### Key Finding
The reviews report substantial symptom burdens across multiple domains: depression/depressive symptoms 27.2% and suicidal ideation 11.1% in Rotenstein et al.; anxiety 33.8% in Quek et al.; burnout 44.2% in Frajerman et al.; poor sleep quality 55% in Jahrami et al.; and at least one form of harassment or discrimination 59.4% in Fnais et al. These are pooled group estimates from different periods, instruments, thresholds, countries, and samples. They must not be added together, treated as diagnoses, or converted into an individual learner's probability.

### Relevance to Learms
Model the domains separately and let a learner choose support without requiring a mental-health label. Never create a composite “wellbeing risk score” from prevalence estimates.

### Citation
Rotenstein LS et al. (2016), *JAMA* 316(21):2214–2236, doi:10.1001/jama.2016.17324. Quek TTC et al. (2019), *International Journal of Environmental Research and Public Health* 16(15):2735, doi:10.3390/ijerph16152735. Frajerman A et al. (2019), *European Psychiatry* 55:36–42, doi:10.1016/j.eurpsy.2018.08.006. Jahrami H et al. (2020), *Journal of Public Health* 28:605–622, doi:10.1007/s10389-019-01064-6. Fnais N et al. (2014), *Academic Medicine* 89(5):817–827, doi:10.1097/ACM.0000000000000200.

## Topic
Pakistan evidence confirms concern but resists a single national prevalence

### Source
Pakistan-specific systematic reviews and primary studies. [MED-092, MED-093, MED-094, MED-095, MED-097, MED-098, MED-099, MED-100, MED-102]

### Key Finding
The 2026 Pakistan depression review found 71 studies, approximately 23,000 students, estimates from 9% to 94%, and I²=99.15%. Its authors explicitly cautioned that one pooled value may not summarize the evidence. Other Pakistan studies identify academic/exam pressure, poor sleep, mistreatment, financial pressure, lack of trusted support, and career uncertainty. Most primary studies are cross-sectional or qualitative, urban, institution-specific, and based on self-report.

### Relevance to Learms
Use Pakistan studies to define locally plausible problem categories, not to claim “Pakistan's rate” or rank colleges. Record city, institution type, year, instrument, threshold, study period, and design with every estimate.

### Citation
Ebrahimi H et al. (2026), *BMJ Open* 16:e116544, doi:10.1136/bmjopen-2026-116544. Azim SR et al. (2022), *Journal of the Pakistan Medical Association* 72:2048–2053, doi:10.47391/JPMA.4042. Other primary citations are listed in the topic files and `PROBLEM_EVIDENCE_MATRIX.csv`.

## Topic
Problem ontology for product and research use

### Source
Synthesis of the registered global and Pakistan evidence. [MED-087–MED-103]

### Key Finding
The supported top-level domains are: (1) depression, anxiety and suicidal ideation; (2) burnout/exhaustion and learning environment; (3) sleep/fatigue; (4) mistreatment, harassment and discrimination; (5) academic workload and assessment pressure; (6) financial pressure; (7) career uncertainty; (8) digital overuse/distraction; and (9) help-seeking barriers. These domains overlap, but the reviewed evidence does not establish a universal causal chain.

### Relevance to Learms
Use `STUDENT_PROBLEM_ONTOLOGY.json` as a non-diagnostic concept map. Preserve association edges separately from intervention claims.

### Citation
See `student-problems/STUDENT_PROBLEM_ONTOLOGY.json` and sources [MED-087–MED-103] in `sources/SOURCE_REGISTER.csv`.

## Topic
Institutions have support obligations; an app is not the institution

### Source
PM&DC undergraduate guidance and 2024 medical-college accreditation standards; HEC harassment policy. [MED-001, MED-105, MED-106]

### Key Finding
PM&DC guidance calls for accessible and confidential academic, social, psychological and financial support plus career guidance. The 2024 accreditation standard requires access to psychological, academic and career counselling and mechanisms for student/faculty wellbeing. HEC's harassment policy requires institutional prevention, reporting, inquiry and confidentiality arrangements. These are institutional responsibilities.

### Relevance to Learms
Learms may make verified institutional support routes easier to find, but must not represent itself as a counsellor, inquiry committee, emergency service, regulator, or confidential institutional reporting channel unless it actually has that mandate and workflow.

### Citation
Pakistan Medical and Dental Council (2024), *Guidelines for Undergraduate Medical Education MBBS Curriculum*, official PDF. Pakistan Medical and Dental Council (2024), *Accreditation Standards for Medical College up to 100 MBBS Students*, official PDF. Higher Education Commission Pakistan (n.d.), *Revised Policy on Protection against Harassment in Higher Education Institutions*, official policy, accessed 2026-09-30.

## Evidence boundary

- Screening-scale positivity is not a clinical diagnosis.
- Cross-sectional association does not establish direction or causality.
- Pooled estimates with high heterogeneity do not support a college, city, or individual prediction.
- Older Pakistan studies remain useful historical evidence, not current prevalence surveillance.
- Current national longitudinal data on dropout, suicide attempts/deaths, disability, rural/urban differences, and intervention uptake were **not found** in this pass.
