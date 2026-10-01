# Problems of Social Sciences Students

**Agent 4 — Area 2.8** · Last updated 2026-09-30

> This document also serves as the **general Pakistani university student mental-health baseline**
> for the whole project, because the best available evidence covers "university students" rather
> than any one discipline. `PROBLEMS_MEDICAL.md` covers the medical subset;
> `WELLNESS_PAKISTAN.md` covers the service/infrastructure side.

---

## 1. The headline: ~half of Pakistani university students screen positive for depression — and **non-medical students are worse off than medical students**

### Topic: Depression prevalence among Pakistani university students
### Source: "Prevalence and epidemiology of depression symptoms among Pakistani students: a systematic review and meta-analysis (2000–2025)", *Global Mental Health* (Cambridge University Press, 2025)
### Key Finding **[HIGH — 35 studies, 11,209 students, 25-year window]**

| Group | Pooled prevalence of depressive symptoms |
|---|---|
| **All Pakistani university students** | **≈51%** (random effects) / 56% (fixed effects) |
| Medical students | **48.72%** |
| **Non-medical students** | **60.33%** |

**This inverts the international assumption.** Global literature treats medical students as the
high-risk group (Rotenstein: 27.2%). In Pakistan, *non-medical* students are **~12 percentage points
worse** than medical students, and both are roughly **double** the global medical-student figure.
The review explicitly notes this "contrasts with other international research."

Named drivers in the review: **academic stress, financial hardship, social pressure, and cultural
stigma of mental illness.**

⚠ **[Heterogeneity caveat — the authors say this themselves]** Between-study heterogeneity is very
high; the review's own primary recommendation is the "acute necessity" of standardised diagnostic
criteria and **culturally competent assessment instruments**. So ~51% is a *symptom-screening*
figure aggregated over inconsistent instruments, not a clinical prevalence.

### Citation
- https://www.cambridge.org/core/journals/global-mental-health/article/prevalence-and-epidemiology-of-depression-symptoms-among-pakistani-students-a-systematic-review-and-metaanalysis-20002025/A50468BA43C9BCE332B0EAD821BFE22F

---

## 2. Corroborating primary studies

| Study | Location / sample | Depression | Anxiety | Stress |
|---|---|---|---|---|
| Asif et al. (2020), *Pak J Med Sci* 36(5):971 | Sialkot, 3 universities, **n=500**, DASS-21 | **75%** | **88.4%** | **84.4%** |
| Peshawar study (Pak J Med & Clin Res) | 2 public + 2 private universities, Peshawar | **84.5%** any level (20.5% severe; only 15.5% symptom-free) | **75.2%** | — |
| Psychology students study (2024), n=321, 90% female, Urdu DASS-21 + BBC Wellbeing | Pakistan | 51.6% | 62% | 41.4% |
| Ahmed et al. (2022) | multiple Pakistani universities | 41% moderate-to-severe | 34% | — |
| Afridi & Khan (2021) | Peshawar | ~43% | ~37% | — |

**Consistent cross-study patterns:**
- **Anxiety is usually MORE prevalent than depression** in Pakistani student samples (88.4% > 75%;
  62% > 51.6%; 75.2% ... ). Internationally the ordering is usually reversed. **If Learms builds any
  wellness feature, anxiety — not depression — is the modal presentation in this population.**
- **Female students and low-socioeconomic-status students show higher prevalence.**
- **Academic pressure is the strongest predictor**: at the highest academic-stress level (5),
  depression peaks at 11.26 and anxiety at 9.33 on the study's scale — a clean monotonic dose–response.
- Other named factors: financial strain, **parental expectations**, social disconnection, trauma
  history, conflict exposure and economic deprivation (Peshawar), lack of recreational spaces.

### Citation
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7372668/ (Asif et al. 2020, full text)
- https://pakjmcr.com/index.php/1/article/download/49/47/171 (Peshawar study)
- https://www.researchgate.net/publication/380503750_Depression_Anxiety_Stress_And_Wellbeing_Of_Young_Psychology_Students_In_Pakistan_A_Cross-Sectional_Descriptive_Study

---

## 3. There is almost nowhere to refer students to

### Key Finding **[HIGH — this is the single most important operational constraint on any Learms wellness feature]**

| Fact | Value | Source |
|---|---|---|
| **Universities in Pakistan with functioning counselling centres** | **fewer than 20%** | HEC, 2023 (cited in Pak J Med & Clin Res) |
| **Psychiatrists per 100,000 population** | **~1** | WHO, 2021 |
| Consequence | Students adopt maladaptive coping — including substance use | Khalid & Hussain, 2021 |
| Healthcare financing | out-of-pocket dominant → **delays help-seeking** | Siddiqui et al., 2026 |
| Most common coping strategy | **religion** | JPMA systematic review |

### Relevance to Learms — this changes the wellness design completely
The standard Western pattern for a wellness feature is: *detect signal → surface a hotline → hand
off to services.* **In Pakistan the services largely do not exist.** A referral to "your university
counselling centre" fails for >80% of users.

Design consequences (binding — see `WELLNESS_CRISIS.md`):
1. **Maintain a curated, verified list of Pakistan-specific resources** (national helplines, a small
   number of tele-mental-health providers, city-level services) — and **verify they answer** before
   listing them. An unanswered helpline is worse than none.
2. **Weight toward self-management and social support**, which are available, over professional
   referral, which mostly isn't: sleep, workload, study-load rebalancing, peer connection,
   family/community, and — where the user opts in — **religiously-framed coping**, which is what
   Pakistani students already use.
3. **Never create dependency on Learms as a substitute therapist.** The product must be explicit
   that it is not a clinician, especially *because* there is no clinician behind it.
4. **Stigma is named as a driver.** Privacy must be absolute: no wellness signal visible to parents,
   teachers, institutions, or in any shared/leaderboard surface. Ever.

---

## 4. Job-market saturation for social-science graduates

### Key Finding **[MED]**
- Graduate unemployment 16.1% (2020-21) vs 6.3% national; **the probability of unemployment rises
  with education level in Pakistan** [PIDE].
- **The Labour Force Survey does not disaggregate social sciences at all** — PIDE explicitly notes
  LFS provides breakdowns only for engineering, medicine, computer and agriculture, and recommends
  adding social and natural sciences. **So there is literally no official unemployment statistic for
  Pakistani social-science graduates.** This is a genuine data gap, not an oversight in this research.
- Proxy signals: 31%+ of educated youth unemployed; 64% of graduates report employment difficulty
  from skill gaps; competitive government exams (CSS/PMS) attract "thousands for a few seats" — and
  social-science graduates are the core CSS cohort.

### Relevance to Learms
- **CSS / PMS preparation is the natural career destination content for this field**, and it is
  large, high-intent, and underserved (see `PROFESSIONAL_CERTIFICATIONS.md` §7).
- Employability content for social-science students should emphasise transferable, verifiable
  skills: research methods, **data analysis (SPSS/R/Excel)**, survey design, report writing,
  and English writing — precisely the things NGOs, think tanks, market research and development
  organisations in Pakistan hire for.

---

## 5. Actionable summary

| # | Finding | Build decision | Owner |
|---|---|---|---|
| S1 | ~51% pooled depression; **non-medical 60.3% > medical 48.7%** | Do not scope wellness to the medical vertical. It's *more* needed elsewhere. | **Agent 3** |
| S2 | **Anxiety > depression** in Pakistani samples | Design wellness around anxiety first (worry, exam dread, avoidance), not low mood | Agent 3 |
| S3 | Academic pressure shows a monotonic dose–response with distress | Workload/overload detection is a legitimate, high-value signal — and Learms *has* that data | **Agent 1 + 3** |
| S4 | **<20% of universities have counselling; ~1 psychiatrist/100k** | Referral-first design fails. Verify every listed resource. Weight to self-management. | **Agent 3** |
| S5 | Stigma is a named driver | Absolute privacy on any wellness signal; never shared, never exported | **Agent 1** |
| S6 | Female and low-SES students at higher risk | Don't gate support behind payment; keep wellness in the free tier | All |
| S7 | Religion is the dominant coping strategy | Offer culturally-congruent coping as an opt-in, expert-reviewed option | Agent 2 |
| S8 | No official unemployment data for social sciences | Don't quote a number. Use PIDE's aggregate with the caveat. | Agent 2 |
| S9 | CSS/PMS is the destination exam | High-priority candidate vertical | Agent 3 |

## Gaps / Not found
- No disaggregated unemployment data for social-science graduates (LFS doesn't collect it).
- No evaluation of any digital mental-health intervention with Pakistani students.
- No data on Pakistani students' actual usage of the counselling centres that do exist.
- Culturally-validated Urdu screening instruments: the meta-analysis says these are *needed*,
  implying they are not standard. AKUADS (Aga Khan University Anxiety and Depression Scale) exists
  and is Pakistan-developed — **worth further research before any screening feature is built.**

---

## Sources

| Type | Source | URL |
|---|---|---|
| Meta-analysis | *Global Mental Health* (CUP, 2025) — 35 studies, 11,209 Pakistani students, 51% pooled | https://www.cambridge.org/core/journals/global-mental-health/article/prevalence-and-epidemiology-of-depression-symptoms-among-pakistani-students-a-systematic-review-and-metaanalysis-20002025/A50468BA43C9BCE332B0EAD821BFE22F |
| Journal | Asif, Mudassar, Shahzad, Raouf & Pervaiz (2020), *Pak J Med Sci* 36(5):971, n=500 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7372668/ |
| Journal | Peshawar universities study (HEC <20% counselling; WHO 1 psychiatrist/100k) | https://pakjmcr.com/index.php/1/article/download/49/47/171 |
| Journal | Psychology students DASS-21 + BBC Wellbeing (2024), n=321 | https://www.researchgate.net/publication/380503750_Depression_Anxiety_Stress_And_Wellbeing_Of_Young_Psychology_Students_In_Pakistan_A_Cross-Sectional_Descriptive_Study |
| Think tank | PIDE — graduate unemployment; LFS lacks social-science breakdown | https://pide.org.pk/research/disaggregating-the-graduate-unemployment-in-pakistan/ |
