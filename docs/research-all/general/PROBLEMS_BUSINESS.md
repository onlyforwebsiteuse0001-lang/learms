# Problems of Business, Commerce & Accounting Students

**Agent 4 — Area 2.4** · Last updated 2026-09-30

---

## 1. Professional-qualification attrition (ACCA / CA / CMA)

### Topic: Where business students actually fail
### Source: ACCA Global Dec-2025 results via aggregators; ICAP FAQs & IFAC/ICAP filing; Pakistani industry commentary (2026). Full detail and caveats in `PROFESSIONAL_CERTIFICATIONS.md`.
### Key Finding

**ACCA — the failure is concentrated and predictable:**

| Band | Papers | Pass rate (Dec 2025) |
|---|---|---|
| Safe | BT 87%, LW 82% | high |
| Mid | FA, MA, TX, FR, FM, SBL, SBR, ATX | ~46–68% |
| **Danger zone** | **PM 40%, AA 43–46%, AFM 42–45%, APM 36–41%, AAA 32–38%** | **~1 in 3 fail repeatedly** |

**CA (ICAP) — the failure is structural, not paper-specific:**
- Overall pass rates estimated **25–35%**, "some papers below 20%" — but **ICAP publishes no
  paper-level statistics**, so this is industry estimate, not data. **[CONTESTED]**
- Realistic completion time **5–8 years**, involving a **42-month articleship** studied around
  full-time audit work.
- **Hard attempt limits**: AFC 3 attempts/paper; CFAP 6 attempts/paper; must pass ≥4 CFAP papers
  within **10 years** of starting training. Failing out is a real, terminal outcome.
- Four levels (AFC/PRC → CAF → CFAP → MSA); CAF Group A must be partly cleared before Group B.

### Relevance to Learms
- **Dropout in professional accounting is not a motivation problem, it is a "studying while working
  full time, with a countdown clock" problem.** The product features that matter are therefore:
  (a) micro-sessions that survive a 20-minute commute, (b) offline access, (c) a planner that knows
  the sitting date and the attempts remaining, (d) ruthless prioritisation by syllabus weight × past
  failure.
- Build depth on the **danger-zone papers** (PM, AA, AFM, APM, AAA) and only thin coverage on BT/LW.
  Difficulty-weighted content investment is the whole content strategy here.
- Surface `attempts_remaining` and `deadline` as first-class UI state. This is an **anxiety-generating
  design surface** — see §5 and `WELLNESS_SAFE.md` for how to present it without making it worse.

### Citation
See `PROFESSIONAL_CERTIFICATIONS.md` §1–3 for full source list.

---

## 2. Rote learning — measured, not anecdotal

### Topic: The washback of Pakistan's examination system
### Source: *Bulletin of Education and Research* (Aug 2023) 45(2):93–106, systematic review of Pakistani exam-system studies (ERIC EJ1408636); Pakistan National Human Development Report (UNDP) cited in *The Friday Times* (2025); ASER 2023; Rind et al. (2019); Summro & Shah (2016); Khattak et al. (2022); Rehman (2011)
### Key Finding **[HIGH — converging evidence from a systematic review plus a UNDP national report]**

1. **"Four out of five students rely on rote memorisation to pass exams."**
   — Pakistan National Human Development Report (UNDP), cited in *The Friday Times*, Mar 2025.
2. **Rind et al. (2019) analysed 10 years of Grade 10 and Grade 12 English board papers and found
   "hardly any analytical or creative-level questions."** This is the strongest single piece of
   evidence: the assessment instrument itself contains no higher-order items, so rote is the
   *rational* student strategy, not a failure of effort.
3. Summro & Shah (2016) analysed seven high-stakes-prep tests and found **only items expected to be
   tested were taught**, the grammar-translation method dominated, and students were directed to
   revise past papers — practices that "increase grades and destroy learning."
4. In KPK, **most assessments are non-standardised**, which the review directly links to rote.
5. Questions **repeat after a few years**, so "guides" and past papers are a rational shortcut.
6. **ASER 2023: only 40% of public-school teachers have satisfactory subject-specific knowledge.**
7. Pakistan has ~1.83 million teachers, "the majority lack proper training."
8. HEC has "repeatedly warned about declining university admission standards, where even top scorers
   struggle with basic comprehension and reasoning."

**The causal chain is explicit in the literature: non-standardised, recall-only exams → negative
washback → teaching to the test → rote → students who cannot reason.** This is *systemic design*,
not student laziness. Any Learms copy that blames students for "cramming" is both wrong and insulting.

### Relevance to Learms — a genuine strategic tension
There is a real conflict here that the product must resolve deliberately:
- **If Learms teaches for understanding, it may lower short-term exam marks**, because the exams
  reward reproduction. Students will churn.
- **If Learms teaches for the exam, it reproduces the pathology** the SBP and PIDE reports blame for
  10% employability.

**Recommended resolution (a real product decision, flag for the founder):** run **two explicit
modes** — *Exam Mode* (past-paper patterns, high-yield, predicted questions, marks-optimised) and
*Mastery Mode* (understanding, application, transfer) — and make Exam Mode the *hook* while Mastery
Mode is the *retention and outcome* engine. Do not pretend the tension doesn't exist. Students will
trust a product that is honest about "this will get you marks" vs "this will get you a job."

Also concretely: **past-paper mining is table stakes in Pakistan.** Questions repeat; students know
it; a product without past papers is not credible locally. Ingest BISE/university past papers and
tag them to the knowledge graph (see `OCR_TESSERACT.md` for the pipeline).

### Citation
- https://files.eric.ed.gov/fulltext/EJ1408636.pdf
- https://thefridaytimes.com/29-Mar-2025/is-pakistan-s-education-system-producing-thinkers-or-followers

---

## 3. Language barrier — English-medium instruction is a measured comprehension tax

### Topic: EMI in Pakistan and its effect on learning
### Source: Siddiqui, K. A., "English medium instruction in higher education in Pakistan: a ROAD-MAPPING retrospective"; *Reorienting English Language Education in Pakistan* (Iris Publishers, 2025); UNESCO Global Education Monitoring Report 2016; British Council (2021) survey; Regional Tribune study on EMI barriers at secondary level (Gujrat); Mansoor (2004), Mahboob (2017), Irfan (2017); Fareed, Khan & Ghangro (2022)
### Key Finding **[HIGH]**

1. **HEC enforces an English-only model of instruction**, yet "many students from diverse linguistic
   backgrounds find it difficult to qualify for entry tests conducted in English and then to survive
   in an EMI classroom." [Irfan 2017; Mahboob 2017; Mansoor 2004]
2. **Pakistani government-school students show considerably lower comprehension and memory when
   taught in English rather than Urdu or regional languages.** UNESCO's 2016 GEM Report independently
   finds pupils achieve better when taught in their first language, especially in early years.
3. **The teachers can't do it either.** A study of public secondary schools (Gujrat) found writing
   in English and explaining concepts in English are barriers *for the teachers*; their own
   experience is in mother tongue and Urdu. Punjab's 2010 blanket switch of all primary/elementary/
   secondary schools to English medium is identified as a shock that "confused teachers as well as
   students."
4. **~65% of English teachers in Pakistan lack professional ELT pedagogical training.**
   [British Council, 2021]
5. **The exam system converts the language barrier directly into rote**: the 2023 systematic review
   states that because exams are in English, "some students are afraid of English, others fail to
   understand it, and some cannot elaborate on their answers in their own words. **So they memorise
   the questions and answers from textbooks as they are without understanding them**" — and this is
   specifically noted as happening **in science subjects**.
6. EMI is analysed in the critical-applied-linguistics literature as a vehicle of *epistemic and
   linguistic* stratification inherited from colonial history, not a neutral choice.
7. **SBP independently names English proficiency as a technical barrier to IT export earnings**
   (see `PROBLEMS_IT_COMPUTING.md`).

**This is arguably the single most important Pakistan-specific finding in the entire research set:
the language barrier is the *mechanism* that converts a weak exam system into rote memorisation,
and it operates most strongly in exactly the STEM subjects Learms cares most about.**

### Relevance to Learms — design mandates, not nice-to-haves
| Mandate | Detail |
|---|---|
| **Bilingual by default** | Every explanation available in **English and Urdu**, and ideally code-switched "Urdish" — which is how Pakistani classrooms *actually* function. Not a translation toggle bolted on later; a first-class content dimension. |
| **Answer in any language** | Let students respond in Urdu, Roman Urdu, or English and grade the *concept*, not the language. Roman Urdu is how young Pakistanis type. LLM grading makes this genuinely feasible for the first time. |
| **Terminology anchoring** | Keep technical terms in English (they will be examined in English) but explain them in Urdu. Show both: *photosynthesis (ضیائی تالیف)*. Never translate the exam term away. |
| **Separate language failure from content failure** | If a student understands the concept but cannot express it in English, that is a *writing* gap, and the learner model must record it separately. Otherwise Learms will mis-diagnose a language problem as a knowledge problem — the exact error the Pakistani system already makes. **Agent 1: two competence dimensions per skill, `concept_mastery` and `expression_in_english`.** |
| **Academic-English writing track** | "Elaborate in your own words" is the specific failure named. Scaffolded answer-writing (sentence frames, model answers, structure templates) is a distinct high-value product. |
| **Do not romanticise Urdu-only** | The evidence says first-language learning improves comprehension, *and* the exams/jobs are in English. The honest product answer is bilingual scaffolding with English output, not Urdu replacement. |

### Citation
- https://files.eric.ed.gov/fulltext/EJ1408636.pdf (rote ← English mechanism)
- https://irispublishers.com/abeb/pdf/ABEB.MS.ID.000683.pdf (British Council 65% figure; UNESCO 2016)
- https://www.researchgate.net/publication/357917346_English_medium_instruction_in_the_higher_education_in_Pakistan_A_retrospective_analysis_using_the_ROAD-MAPPING_framework
- https://submissions.regionaltribune.com/index.php/trt/article/download/74/159 (teacher-side EMI barriers)

---

## 4. Academia–industry gap and brain drain

### Topic: Where business/accounting graduates go
### Source: Bureau of Emigration & Overseas Employment (BE&OE) data reported by *The Express Tribune*, NDTV, News18, News Karnataka (Dec 2025 – Jan 2026); PIDE graduate-unemployment research
### Key Finding **[HIGH on BE&OE numbers, MED on interpretation]**

**Emigration of skilled professionals, 2024–2025 (BE&OE official registrations):**

| Profession | Departures 2024–25 |
|---|---|
| **Accountants** | **>13,000 — the largest single professional group** |
| Engineers | ~11,000 |
| Doctors | ~5,000 |
| Nurses | migration up **2,144% between 2011 and 2024** |

- **727,381** Pakistanis registered for overseas employment in **2024**; **687,246** by end-Nov **2025**
  — roughly **1.4–1.5 million in under two years**.
- *The Express Tribune* labelled 2025 the year Pakistan became a **"Brain Drain Economy."**
- Analysts note a **structural shift**: outflow is no longer mainly low-skilled Gulf labour but
  "doctors, engineers, IT specialists, accountants and researchers."
- Political framing is contested: the Army Chief called the diaspora "brain gain" (Apr 2025); the
  data is widely read as contradicting that. **[POLITICALLY CONTESTED — Learms should cite the BE&OE
  numbers and stay out of the political framing entirely.]**

**Why accountants lead the exodus:** ACCA and (to a lesser extent) ICAP are *internationally
portable*. An ACCA holder in Karachi can work in Dubai, London or Toronto. This is the clearest
case in Pakistan of a qualification whose value is realised **abroad**.

### Relevance to Learms
1. **Accountancy students are studying for an international labour market.** They will pay for
   quality, they need IFRS/international standards (not just Pakistani tax law), and they need
   professional English. Price and position accordingly — this is one of the few genuinely
   *monetisable* Pakistani segments.
2. **Remittance-funded willingness to pay**: families with a member abroad are the most likely to
   pay for education. Pricing research should segment on this. **[Hypothesis — not researched.]**
3. **Ethical note:** a product that accelerates emigration of doctors and accountants has real
   social consequences in Pakistan. Worth a conscious position rather than an accident.
4. PIDE's diagnosis — weak university–industry linkage, degrees misaligned with demand — means the
   *employability* layer (internships, case studies, real financial statements, Excel/ERP skills,
   client communication) is where Learms adds value beyond the syllabus.

### Citation
- https://www.ndtv.com/world-news/pakistan-sees-mass-exodus-of-skilled-workers-amid-asim-munirs-brain-gain-claim-10033858
- https://newskarnataka.com/world/pakistan-loses-5000-doctors-11000-engineers-amid-brain-gain-debate/28122025
- https://www.thehawk.in/news/world/skilled-professionals-leaving-pakistan-in-record-numbers-in-search-of-stability-dignity-and-opportunity
- https://pide.org.pk/research/disaggregating-the-graduate-unemployment-in-pakistan/

---

## 5. Actionable summary

| # | Finding | Build decision | Owner |
|---|---|---|---|
| B1 | ACCA failure concentrated in PM/AA/AFM/APM/AAA | Difficulty-weighted content depth; thin BT/LW | Agent 2 |
| B2 | CA = 5–8 yrs, 42-mo articleship, hard attempt limits | Deadline- and attempt-aware planner; micro-sessions; offline | **Agent 1** |
| B3 | 4 in 5 students rote-memorise; board papers contain ~no analytical items | Ship **Exam Mode** + **Mastery Mode** as explicit, honest modes | **Product decision — all agents** |
| B4 | Past-paper questions repeat | Past-paper ingestion + tagging is table stakes | Agent 3 |
| B5 | EMI causes comprehension loss and *causes* rote in science | Bilingual EN/UR content as a first-class dimension, not a toggle | **Agent 2** |
| B6 | Students can't "elaborate in their own words" | Accept Urdu / Roman Urdu answers; grade the concept | **Agent 1** |
| B7 | Language failure ≠ knowledge failure | Model `concept_mastery` and `expression_in_english` separately | **Agent 1** |
| B8 | 65% of English teachers untrained in ELT | Academic-English writing track has real, unmet demand | Agent 2 |
| B9 | 13,000 accountants emigrated 2024–25; ACCA is portable | Accountancy = highest-willingness-to-pay segment; go international-standard | All |
| B10 | Weak university–industry linkage | Employability layer (Excel, IFRS, ERP, client English) beyond syllabus | Agent 3 |

## Gaps / Not found
- ICAP paper-level pass rates (not published).
- ICMAP syllabus/pass rates (not verified — see `PROFESSIONAL_CERTIFICATIONS.md` §3).
- No study measuring ACCA/CA *dropout* (as distinct from per-paper failure) in Pakistan.
- No data on remittance-linked willingness to pay for education.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Systematic review | *Bulletin of Education and Research* 45(2):93-106 (2023) — exam washback in Pakistan | https://files.eric.ed.gov/fulltext/EJ1408636.pdf |
| National report | UNDP Pakistan NHDR ("4 of 5 rote-memorise") + ASER 2023, via The Friday Times | https://thefridaytimes.com/29-Mar-2025/is-pakistan-s-education-system-producing-thinkers-or-followers |
| Journal | Iris Publishers (2025) — Reorienting English Language Education in Pakistan (British Council 65%, UNESCO 2016) | https://irispublishers.com/abeb/pdf/ABEB.MS.ID.000683.pdf |
| Journal | Siddiqui — EMI in Pakistani higher education, ROAD-MAPPING | https://www.researchgate.net/publication/357917346_English_medium_instruction_in_the_higher_education_in_Pakistan_A_retrospective_analysis_using_the_ROAD-MAPPING_framework |
| Journal | Regional Tribune — barriers to EMI at secondary level, Gujrat | https://submissions.regionaltribune.com/index.php/trt/article/download/74/159 |
| Official data (via press) | Bureau of Emigration & Overseas Employment 2024-25 | https://www.ndtv.com/world-news/pakistan-sees-mass-exodus-of-skilled-workers-amid-asim-munirs-brain-gain-claim-10033858 |
| News | News Karnataka / The Hawk — BE&OE breakdown, nurse +2,144% | https://newskarnataka.com/world/pakistan-loses-5000-doctors-11000-engineers-amid-brain-gain-debate/28122025 |
| Think tank | PIDE — graduate unemployment | https://pide.org.pk/research/disaggregating-the-graduate-unemployment-in-pakistan/ |
