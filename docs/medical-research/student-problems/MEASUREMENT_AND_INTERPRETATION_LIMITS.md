# Measurement and interpretation limits for student-problem evidence

## Topic
Screening symptoms are not diagnoses

### Source
Global and Pakistan reviews using PHQ-9, DASS-21, HADS, AKUADS and other instruments. [MED-087, MED-088, MED-092, MED-094]

### Key Finding
Prevalence changes with instrument, cutoff, recall period and case definition. Rotenstein et al. pooled “depression or depressive symptoms”; the Pakistan review reported 9%–94% across tools and I²=99.15%; Jadoon et al. used a locally validated combined anxiety/depression scale. None supports translating a positive research screen directly into a clinical diagnosis.

### Relevance to Learms
If screening is ever considered, it requires clinical governance, validated language/version, consent, score interpretation, escalation, retention limits and false-positive/false-negative review. For a learning product, self-described needs and resource navigation are safer defaults.

### Citation
Rotenstein et al. (2016), doi:10.1001/jama.2016.17324. Quek et al. (2019), doi:10.3390/ijerph16152735. Ebrahimi et al. (2026), doi:10.1136/bmjopen-2026-116544. Jadoon et al. (2010), PMID:20726214.

## Topic
Cross-sectional association does not establish causality

### Source
Pakistan cross-sectional studies of sleep/stress, burnout/income, learning environment/wellbeing and mistreatment. [MED-096, MED-098, MED-099, MED-100]

### Key Finding
The studies measure exposure and outcome at one period and cannot establish temporal order. “Associated with” must not be rewritten as “caused by,” “predicts future illness,” or “fixing X will eliminate Y.” Even regression models do not overcome cross-sectional temporality.

### Relevance to Learms
Knowledge-graph edges need a `relation_type` field such as `cross_sectional_association`, not a generic causal arrow.

### Citation
Irshad et al. (2022), doi:10.12669/pjms.38.4.5052. Shoukat et al. (2010), doi:10.1371/journal.pone.0013429. Waqas et al. (2015), doi:10.7717/peerj.840. Shahzad & Wajid (2024), doi:10.1136/bmjopen-2023-080440.

## Topic
Qualitative evidence offers mechanism, not prevalence

### Source
Pakistan qualitative studies of burnout and financial stress. [MED-095, MED-102]

### Key Finding
Purposive interviews/focus groups identify experiences, meanings, barriers and desired support. They do not support statements such as “most Pakistani students” unless sampling and analysis were designed to estimate prevalence.

### Relevance to Learms
Use qualitative themes to design discovery and co-design questions. Validate feature priority with local users instead of assigning percentages to themes.

### Citation
Khurshid et al. (2025), doi:10.1186/s12909-025-07762-y. Asim et al. (2025), doi:10.12669/pjms.41.2.9286.

## Topic
Old evidence is historical, not current surveillance

### Source
Pakistan bullying/mistreatment studies published in 2008 and 2010, plus the current HEC policy page. [MED-097, MED-098, MED-105]

### Key Finding
Older studies establish that problems were documented and identify hypotheses about hierarchy and support. They do not establish 2026 prevalence or current policy implementation. The current HEC policy establishes expected procedures but not outcome effectiveness.

### Relevance to Learms
Every institutional problem statistic and policy must display study/policy year. Never imply that a policy's existence proves that reporting is safe, accessible or effective.

### Citation
Ahmer et al. (2008), doi:10.1371/journal.pone.0003889. Shoukat et al. (2010), doi:10.1371/journal.pone.0013429. Higher Education Commission Pakistan, revised harassment policy, accessed 2026-09-30.

## Topic
Prohibited inferences

### Source
Methodological synthesis of Area 4 evidence. [MED-087–MED-109]

### Key Finding
Unsupported transformations include: summing overlapping prevalence estimates; diagnosing from app behavior; using attendance or grades as mental-health proxies; ranking colleges from convenience samples; treating correlation as causation; generalizing qualitative themes to prevalence; treating an elapsed date or old study as current; and treating support-policy presence as service effectiveness.

### Relevance to Learms
Encode these constraints in research QA and analytics specifications before any wellbeing feature is built.

### Citation
See `student-problems/PROBLEM_EVIDENCE_MATRIX.csv`, `STUDENT_PROBLEM_ONTOLOGY.json`, and registered sources [MED-087–MED-109].
