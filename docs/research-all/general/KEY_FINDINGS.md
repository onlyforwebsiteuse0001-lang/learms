# Key Findings — Top 50

**Agent 4** · Last updated 2026-09-30
Every finding below has a source. Confidence: **[HIGH]** **[MED]** **[LOW]** **[CONTESTED]**.
Ordered by *decision impact*, not by topic.

---

## Tier 1 — Findings that should change the product

**1. [HIGH] Interaction granularity, not humanness, drives tutoring gains — and it plateaus at the *step* level.**
Answer-based tutoring d = 0.31 → step-based **0.76** → sub-step 0.40 → human 0.79. Human vs
step-based = **0.21**; human vs sub-step = **−0.12**. *Build step decomposition. Do not build
free-form Socratic dialogue.* [VanLehn, 2011] — https://www.emergingedtech.com/-kvanlehn/Stringent/PDF/EffectivenessOfTutoring_Vanlehn.pdf

**2. [HIGH] Bloom's "2 sigma" is not 2 sigma. It's 0.79 — and the extra came from *mastery learning*, not tutoring.**
Mastery learning *without* tutoring already gave **1.2 SD** in Bloom's own data. *Mastery gating may
be worth more than the tutor, and it needs no LLM.* [VanLehn, 2011; Bloom, 1984]

**3. [HIGH] Distributed practice d = 0.85 and practice testing d = 0.74 are the two highest-utility learning techniques; rereading, highlighting and summarization are the lowest — and are what students actually do.**
242 studies, 169,179 participants. [Dunlosky et al., 2013; Donoghue & Hattie, 2021] — https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full

**4. [HIGH] Interleaving: blocked practice scored 99% in-session but "horribly" on a 1-week test; interleaved scored 68% in-session and 3× better on the test, with no decline.**
Every Pakistani textbook and past-paper booklet is blocked by chapter; every real exam is
interleaved. *This is the largest un-built lever available.* [Dunlosky, *American Educator*, 2013]

**5. [HIGH] FSRS beats SM-2 by ~81% on RMSE and needs 20–30% fewer reviews for the same retention.**
v4.5 captures 98% of v6's benefit with default weights and no training. *Use FSRS-4.5. Never
implement SM-2.* — https://www.npmjs.com/package/@squeakyrobot/fsrs

**6. [HIGH] Plain BKT can perform *worse than chance* (AUC < 0.5) on skills with ≥8 templates. BKT-ST — which adds one boolean, "same template as previous problem?" — never does, and gains +0.04–0.11 AUC.**
Learms' content is heavily templated (past papers repeat). *Implement BKT-ST, not BKT.*
[BKT20y workshop, 2014] — https://ceur-ws.org/Vol-1183/bkt20y2014_proceedings.pdf

**7. [HIGH] ~51% of Pakistani university students screen positive for depressive symptoms — and NON-medical students (60.3%) are worse off than medical students (48.7%).**
35 studies, 11,209 students. Inverts the international assumption. *Do not scope wellness to the
medical vertical.* [*Global Mental Health*, CUP, 2025]

**8. [HIGH] Fewer than 20% of Pakistani universities have functioning counselling centres; there is ~1 psychiatrist per 100,000 people.**
*The standard "detect → refer to services" wellness pattern fails for >80% of users. Weight toward
self-management and verified resources.* [HEC 2023; WHO 2021, via Pak J Med & Clin Res]

**9. [HIGH] 94% of Pakistan's education budget goes to salaries; only 19% of schools have digital tools.**
*A public-school B2B/B2G sales motion is structurally impossible. Go B2C, mobile-first.*
[Girls' Education Statistics and Trends Report 2023-24] — https://www.dawn.com/news/amp/1975945

**10. [HIGH] Only 10% of Pakistani IT graduates are employable (State Bank of Pakistan); CS graduate unemployment rose 14.2% → 22.6%; engineering 11% → 23.5%; agriculture 11.4% → 29.4%.**
Graduate unemployment (16.1%) is **~2.6× the national rate** (6.3%). [SBP via Tribune; PIDE]

---

## Tier 2 — Pakistan context that constrains everything

**11. [HIGH] 4 out of 5 Pakistani students rote-memorise to pass.** [UNDP NHDR, via The Friday Times]

**12. [HIGH] Ten years of Grade 10/12 English board papers contained essentially *no* analytical or creative-level questions.** [Rind et al., 2019, in *Bulletin of Education & Research* 45(2)] — https://files.eric.ed.gov/fulltext/EJ1408636.pdf

**13. [HIGH] MDCAT is 70% recall by design** (180 MCQ/3h; 15/70/15 difficulty split; Bio 45 / Chem 25 / Phys 20 / Eng 5 / LR 5). — https://www.cas.kmu.edu.pk/sitedocuments/Uniform-Curriculum-MDCAT-2025-Final-26-05-2025.pdf

**14. [HIGH] English-medium instruction is a primary *cause* of rote learning**: exams are in English, so students memorise verbatim — "especially in science". ~65% of Pakistani English teachers lack ELT training. [ERIC systematic review; British Council 2021]

**15. [HIGH] Pakistan's staff–student ratio is ~1:34** (58,814 teachers / ~2.08m students) and **education spend is 0.8% of GDP** (Economic Survey) — **[CONTESTED:** another source says 1.9%; always attribute]. — https://www.finance.gov.pk/survey/chapter_25/10_Education.pdf

**16. [HIGH] University enrolment fell 11.8%** — 2.23m (2020-21) → 1.96m (2024-25) — **driven by cost**. *A free tier is not marketing; it is the product.*

**17. [HIGH] 47% of Pakistani university students are women.** *Private-by-default profiles.* [HEC Annual Report 2024-25]

**18. [HIGH] 26.2 million children are out of school (39%)** — and the absolute number *rose* from 22.02m (2016-17) despite the percentage falling. [Pakistan Education Statistics 2021-22] — https://pie.gov.pk/SiteImage/Downloads/PES%20Highlights%202021-22%20New.pdf

**19. [HIGH] Only 40% of Pakistani public-school teachers have satisfactory subject knowledge** — across ~1.83 million teachers, with no functioning CPD system. *Teachers are a 30–100× leverage user segment.* [ASER 2023]

**20. [HIGH] BE&OE 2024-25: 13,000+ accountants emigrated — the largest professional group — plus 11,000 engineers and 5,000 doctors.** Nurses up 2,144% since 2011. *Accountancy is the highest-willingness-to-pay segment because the credential is internationally portable.*

**21. [HIGH] Supreme Court of Pakistan (2025): LLB reduced from 5 years to 4; the Competency Licensing Examination for foreign law graduates abolished; Law-GAT retained as the universal gate.** *The taxonomy had this wrong; it has been patched.* — https://opportunities-insight.britishcouncil.org/short-articles/news/reforms-legal-education-pakistan

**22. [HIGH] The Gen-Ed core is uniform across every Pakistani undergraduate degree: 30 credits / 12 courses, including 6 cr Quantitative Reasoning, 3 cr Functional English, 3 cr Expository Writing, 3 cr ICT.** *Highest-leverage shared content track in the country; QR is the best nationwide math-anxiety target.* [HEC Undergraduate Education Policy 2023]

**23. [HIGH] PEC accredits engineering programmes *per intake batch*** — "B.Sc. Civil (From Intake of Batch 2010 to 2017)". A student two batches later can be non-accredited on the same programme at the same university. *An "is my batch accredited?" lookup is cheap and high-anxiety-relief.* — https://www.pec.org.pk/accredition/

**24. [MED] Journalism departments in Pakistan are closing** — several shelved in KP, at least five more at risk — and media workers commonly go 6+ months unpaid. [Bakar, Yousaf & Ali, 2024, *Global Regional Review*; DW 2024]

**25. [MED] For arts students, *parental disapproval* — not money — is the #1 barrier; and arts education costs *more* than other fields because of materials.** [*Voyage Journal of Educational Studies*]

**26. [HIGH] Pakistani agriculture: livestock is 62.45% of value added and grew 3.75%, while "important crops" grew 0.65%.** 2025 floods: PKR 430bn in agricultural damage. *Weight agriculture content toward livestock/veterinary, against the way curricula are weighted.*

**27. [HIGH] Only 15.7% of medical students with depression seek treatment** [Rotenstein et al., *JAMA* 2016, 195 studies / 129,123 students] — https://jamanetwork.com/journals/jama/fullarticle/2589340

**28. [HIGH] In Pakistani student samples, ANXIETY is consistently more prevalent than depression** (88.4% vs 75%; 62% vs 51.6%) — the reverse of the international ordering. *Design wellness around anxiety first.* [Asif et al., 2020, *Pak J Med Sci*]

**29. [HIGH] The top three measured predictors of distress in Pakistani medical students are peer pressure, poor sleep, and screen time.** *A study app is implicated in two of the three.* [Siddiqui et al., n=1,630, Islamabad]

**30. [HIGH] Religion is the most common coping strategy among Pakistani students.** [JPMA systematic review, 2004–2019]

---

## Tier 3 — Mechanism findings that shape the engine

**31. [HIGH] Math anxiety ↔ working memory r = −0.40; math anxiety ↔ achievement r = −0.31; the performance effect appears *only* on WM-loaded problems.** *Anxiety ≠ ability. Timed/high-stakes failures must not depress mastery estimates.* [Ashcraft & Kirk, 2001; Hembree meta-analysis]

**32. [HIGH] High-working-memory children are hurt MOST by math anxiety** — the counter-intuitive result. [Ramirez et al., 2013]

**33. [HIGH] Hake (1998), N=6,542 across 62 physics courses: traditional instruction normalized gain ⟨g⟩ = 0.23 ± 0.04; interactive engagement ⟨g⟩ = 0.48 ± 0.14.** *Show normalized gain, not "% complete".* — https://web.mit.edu/jrankin/www/Active_Learning/hake_active_phys.pdf

**34. [HIGH] Johnstone's triplet: it is "psychological folly to introduce all three levels [macro / sub-micro / symbolic] simultaneously."** *One apex at a time; sub-micro last.* [Taber, 2013]

**35. [HIGH] Global CS1 pass rate is 67.7% (CI 65.3–70.1) across 161 courses in 15 countries — but small classes pass at 80.1% vs large classes at 65.4%.** No effect of language taught or contact hours. *Position the AI tutor as "the small-class condition".* [Watson & Li, 2014] — https://dl.acm.org/doi/pdf/10.1145/2591708.2591749

**36. [HIGH] A controlled experiment found the "box" metaphor for variables *increases* the multiple-values misconception; "label" does not.** *Never say "a variable is a box".* [Hermans et al.] — https://www.felienne.com/wp-content/uploads/2018/08/box-label-vars.pdf

**37. [HIGH] Only 54% of novice programmers (n=95) identify `num = "2.5"` as a string; 31% write `amount = "123"` for a number.** *Validated diagnostic items — copy them.*

**38. [HIGH] BKT's identifiability problem is real for curve-fitting but NOT for the real-time algorithm, "so long as there are both correct and incorrect steps."** The Markov form collapses to three effective parameters. [van de Sande, *JEDM* 2013] — https://files.eric.ed.gov/fulltext/EJ1115329.pdf

**39. [HIGH] BKT degenerates (a correct answer *lowers* mastery) when p(G) > 0.5 or p(S) > 0.5. Standard fix: bound p(G) ∈ [0, 0.3], p(S) ∈ [0, 0.1].** *Learms can do better by deriving the guess bound from the item format — 5-option MDCAT MCQ = 0.20 chance.* [Baker, Corbett & Aleven, 2008]

**40. [HIGH] Individualising p(T) (learning rate) improves BKT accuracy more than individualising p(L₀) (prior knowledge).** *Learners differ in how fast they learn, not in what they knew.* [ACM Computing Surveys 55(11)]

**41. [HIGH] FSRS gives LARGER stability boosts to items reviewed at LOWER retrievability** — independently reproducing Bjork's desirable-difficulties prediction from pure data fitting. *Strong convergent validity for the whole spacing paradigm.*

**42. [HIGH] Passive viewing vs interactive engagement differ by ~0.36 SD; survey-style ITS (questions only at task completion) sit at ~0.30 SD.** *"Viewing without practice is functionally closer to reading than to tutoring."* [VanLehn, 2011]

**43. [MED] ITS that encourage students to reflect on their own progress outperform ITS that don't (η² = 0.078).** *Nearly free to build.* [npj Science of Learning, 2025] — https://www.nature.com/articles/s41539-025-00320-7

**44. [HIGH] ITS ≈ individual human instruction (g = −0.11, n.s.) but ITS >> large-group instruction (g = +0.44).** *The honest positioning: not better than a tutor; much better than a class of 90.* [Ma et al., 2014, 107 studies, N=14,321]

**45. [HIGH] Practice testing transfers even when the practice format doesn't match the exam format** — but **recall beats recognition**. *MCQ-only is a compromise; add free-recall items.*

---

## Tier 4 — Structural / commercial

**46. [HIGH] Licensure gates bind harder than degrees in Pakistan** (PEC, PM&DC, PBC/Law-GAT, ICAP, ACCA, PNC, PVMC, PCATP). *Exam prep is the highest-intent vertical, and the gate — not the degree — is the product.*

**47. [HIGH] ACCA Dec-2025 pass rates are reported differently by five separate aggregators.** **[CONTESTED]** *Never quote a pass rate without naming the source.*

**48. [HIGH] Law students cannot access primary case law** — "there is not a single library where a law student can find PLD, ALD, MLD or SCMR." *⚠ Those reporters are copyrighted; use public-domain judgment sources only, after legal review.*

**49. [HIGH] HEC publishes ~50 discipline curriculum PDFs and revises on a nominal 3-year cycle that in practice runs to 9 years (CS: 2016-17 → 2025-26).** *The canonical content spine; university catalogues are overrides. Highest-ROI legal scrape target.* — https://www.hec.gov.pk/english/services/universities/RevisedCurricula/Pages/default.aspx

**50. [CONTESTED — flagged for founder] Teaching for understanding may LOWER marks in a recall-only exam system.**
MDCAT is 70% recall; board papers contain no analytical items. An honest product must either
optimise for marks (and teach rote) or for understanding (and risk lower marks).
**Recommendation: ship Exam Mode and Mastery Mode as two explicit, honestly-labelled modes, with the
exam date setting a budget and the system visibly triaging.** This is the central product tension in
the entire research corpus.
