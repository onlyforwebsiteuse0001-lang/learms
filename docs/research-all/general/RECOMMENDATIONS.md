# Recommendations, Split by Agent

**Agent 4** · Last updated 2026-09-30
Each recommendation traces to a document and a sourced finding. Priority: **P0** = do first / blocks
others · **P1** = important · **P2** = later.

---

## Agent 1 — Backend

### P0 — Data model and core engine

| # | Recommendation | Why | Source doc |
|---|---|---|---|
| A1-1 | **Append-only `review_log` / `attempt` table from day one**, with `correct`, `latency_ms`, `hints_used`, `attempt_number`, `chosen_option_id`, `misconception_id`, `template_id`, `prev_item_template_id`, `context_timed`, `context_stakes`, `p_l_before/after`, `stability/difficulty_before`, `params_version`. Never delete rows. | FSRS parameter optimisation and BKT fitting are both **retrospective**. Deleting history is unrecoverable. This is the most valuable data asset Learms will own. | `FSRS_DEEP.md` F5; `BKT_DEEP.md` §7 |
| A1-2 | **Implement FSRS-4.5** with published default weights. Schema sized for 21 params (FSRS-6) to avoid a migration. | 81% better RMSE than SM-2; 98% of v6's benefit; works with **no training data**, which matters at launch. | `FSRS_DEEP.md` F1, F10 |
| A1-3 | **Implement BKT-ST, not plain BKT.** Store `template_id`; keep **two (guess, slip) pairs per skill** (same-template vs different-template). | Plain BKT is **worse than chance** on skills with ≥8 templates. Learms' content is templated by construction (past papers repeat). One column, +0.04–0.11 AUC. | `BKT_DEEP.md` K3 |
| A1-4 | **Clamp p(S) ≤ 0.1 and derive the p(G) bound from item format** (5-option MCQ → [0.05, 0.30]; 4-option → [0.05, 0.35]; numeric → [0.00, 0.10]). Assert in tests: `correct ⟹ p_l_after ≥ p_l_before`. | Prevents model degeneracy (Baker, Corbett & Aleven 2008). Learms knows the item format, so it can set a better-founded prior than the literature's generic bound. | `BKT_DEEP.md` K1 |
| A1-5 | **Log `attempt.context{timed, stakes}` and fit a separate, higher p(S) for timed/high-stakes contexts.** Anxiety-induced error is, definitionally, a *slip*. | Math anxiety ↔ WM r = −0.40; the effect appears only under WM load. **Anxiety ≠ ability.** Depressing a mastery estimate because a student panicked is both wrong and harmful. | `PROBLEMS_NATURAL_SCIENCES.md` N3; `BKT_DEEP.md` K6 |
| A1-6 | **Model `concept_mastery` and `expression_in_english` as two separate BKT chains** wherever a response requires English production. | Otherwise Learms will systematically mis-diagnose an EMI language gap as a knowledge gap — for a very large share of Pakistani students. | `PROBLEMS_BUSINESS.md` B7; `BKT_DEEP.md` K8 |
| A1-7 | **Step decomposition on every problem**, with a checkable state and immediate feedback per step. | The entire tutoring effect lives here: answer-based 0.31 → step-based **0.76**. | `SOCRATIC_DEEP.md` SO2 |
| A1-8 | **Mastery gating before unit advance** (`p(L) ≥ 0.95` internally). | Mastery learning *alone* was 1.2 SD in Bloom's own data — more than tutoring's 0.79. Cheap, deterministic, no LLM. | `SOCRATIC_DEEP.md` SO1 |

### P1 — Scheduling and adaptivity

| # | Recommendation | Why | Source doc |
|---|---|---|---|
| A1-9 | **One shared "exam plan" subsystem** that sets both FSRS desired retention (0.85 far out → 0.92–0.95 near the exam) and mastery-vs-coverage triage. Expose as *exam date*, never as a retention slider. | Resolves the mastery-vs-deadline conflict; ties the scheduler to the outcome the student actually cares about. | `FSRS_DEEP.md` F3; `SOCRATIC_DEEP.md` SO10 |
| A1-10 | **Interleave review queues by default.** Never serve a blocked-by-chapter set. | Blocked: 99% in-session, "horrible" at 1 week. Interleaved: 68% in-session, **3× better** at 1 week. Every Pakistani study resource is blocked; every exam is interleaved. | `SOLUTIONS_BY_CATEGORY.md` S3 |
| A1-11 | **Derive FSRS grades from objective signals** (`correct`, `latency_ms`, `hints_used`, `attempts`) rather than asking the student to self-rate. Calibrate latency thresholds per item. | Learms is an MCQ/problem product, not a flashcard app. Self-rating doesn't fit the interaction. | `FSRS_DEEP.md` F4 |
| A1-12 | **Mandatory load balancing + quiet hours.** Never stack a large review queue late at night; cap session length. | Poor sleep and screen time are **two of the three** measured predictors of distress in Pakistani medical students. | `PROBLEMS_MEDICAL.md` M4; `FSRS_DEEP.md` F6 |
| A1-13 | **Route remediation off `distractor.misconception_id`**, not off `p(L)`. | BKT says *when* to intervene; the chosen distractor says *what* the student believes instead. | `PROBLEMS_NATURAL_SCIENCES.md` N6; `BKT_DEEP.md` K7 |
| A1-14 | **Individualise p(T) first**, p(L₀) second, **never** p(G)/p(S). | Learners differ more in learning *rate* than in prior knowledge. Student-level guess/slip invites degeneracy. | `BKT_DEEP.md` K2 |
| A1-15 | **Absolute privacy on wellness signals**: never shared with parents, teachers, institutions, leaderboards, or exports. | Stigma is a named driver of the Pakistani mental-health burden. A leak is not a bug; it's a harm. | `PROBLEMS_SOCIAL_SCIENCES.md` S5 |

### P2

| # | Recommendation | Why |
|---|---|---|
| A1-16 | Optimise FSRS parameters **per subject/content type before per user** (per-user needs ~1,000 reviews). | Solves cold start with data Learms will actually have. |
| A1-17 | Programme nodes carry `nqf_level`, `duration_years`, `credit_hours`, `accreditor`, `licensure_required`, `entry_test`. Model the taxonomy as a **DAG, not a tree**. | Real programmes have multiple parents and multiple accreditors. |
| A1-18 | Key PEC accreditation on `(university, programme, intake_batch)`. | PEC accredits per intake batch, not per programme. |
| A1-19 | Version-stamp every scheduling decision (`fsrs_version`, `param_set_id`). | Formulas change between FSRS versions; you need explainability. |
| A1-20 | Offline-first sync for the agriculture/rural vertical. | Agriculture students are disproportionately rural with the worst connectivity. **⚠ Gated on G19 — device/connectivity data has not been researched.** |

---

## Agent 2 — Frontend + Content

### P0

| # | Recommendation | Why | Source doc |
|---|---|---|---|
| A2-1 | **Every lesson is predict → commit → feedback. No passive video paths. Ever.** | Passive vs interactive differ by ~0.36 SD; "viewing without practice is functionally closer to reading than to tutoring." | `SOCRATIC_DEEP.md` SO6; `PROBLEMS_NATURAL_SCIENCES.md` N5 |
| A2-2 | **Do not build a highlighter, a re-reader, or AI summaries as the core value proposition.** Summarization is the **lowest-utility** of ten techniques; highlighting and rereading are low-utility and are what students already do. | Building the two things students already do badly is the default edtech failure. | `SOLUTIONS_BY_CATEGORY.md` S1, S10 |
| A2-3 | **Bilingual EN/UR is a first-class content dimension, not a toggle.** Technical terms stay in English; explanation in Urdu. Accept Urdu/Roman-Urdu answers and grade the *concept*. | EMI is a documented *cause* of rote learning. 65% of English teachers lack ELT training. | `PROBLEMS_BUSINESS.md` B5, B6 |
| A2-4 | **Ship Exam Mode and Mastery Mode as two explicit, honestly-labelled modes.** | MDCAT is 70% recall; board papers have no analytical items. Teaching for understanding may lower marks. Pretending otherwise is dishonest; hiding the choice is worse. **⚠ Founder decision required.** | `PROBLEMS_BUSINESS.md` B3; `GAPS.md` X11 |
| A2-5 | **Past-paper ingestion is table stakes.** Questions repeat. | This is the first thing any Pakistani student will look for. | `PROBLEMS_BUSINESS.md` B4 |
| A2-6 | **Never say "a variable is a box." Use "label."** Copy the validated diagnostic items (`num = "2.5"`, `amount = 123`). | A controlled experiment showed the box metaphor *increases* the multiple-values misconception. | `PROBLEMS_IT_COMPUTING.md` I4, I5 |
| A2-7 | **Show normalized gain `g`, not "% complete."** | Hake: ⟨g⟩ 0.23 traditional vs 0.48 interactive. Progress bars measure activity; `g` measures learning. | `PROBLEMS_NATURAL_SCIENCES.md` N7 |

### P1

| # | Recommendation | Why |
|---|---|---|
| A2-8 | **Design for the interleaving paradox**: in-session accuracy must never be the headline metric, because interleaving lowers it (68% vs 99%) while tripling retention. Show delayed-retention evidence in-product. | Otherwise users will demand the blocked mode that feels good and teaches less. **No evidence was found on how to do this well — genuine open design problem.** |
| A2-9 | **Add free-recall / short-answer items**, not just MCQs. | Practice testing works regardless of format match, but **recall beats recognition**. |
| A2-10 | **Elaborative interrogation prompts ("why is that the answer?") after correct responses**, frequently — not one every few pages. | d = 0.56, nearly free to build, and dosage-sensitive. |
| A2-11 | **Add progress reflection.** | ITS-with-reflection beat ITS-without at η² = 0.078. |
| A2-12 | **Build the study planner**: 2 short blocks per week per subject, each mixing new and previously-studied material. | Dunlosky's explicit practitioner prescription for distributed practice. |
| A2-13 | **One Johnstone apex at a time; sub-micro last.** | "Psychological folly to introduce all three levels simultaneously." |
| A2-14 | **Never require mental tracing of more than 3 variables.** Ship a step-through state visualiser with predict-before-reveal. | Novice tracing overflows working memory (Sorva, notional machines). |
| A2-15 | **Per-subject pedagogy weights.** Biology → FSRS-heavy retrieval. Physics/engineering → interactive engagement + worked examples. Law → IRAC/Socratic. Programming → notional machine. | FSRS is for discrete retrieval; it is the wrong tool for conceptual understanding. |
| A2-16 | **Copy tone rules**: never say "you have depression" — say "screened positive for symptoms". Never use family-comparison or parent-report framing for performance. Never frame teacher features as audit or replacement. | Only 15.7% seek help; family expectations are a named stressor; teacher dignity is a real adoption constraint. |
| A2-17 | **Stop quoting "2 sigma."** It is 0.79 — or 0.40 across meta-analyses. Position as *"as good as a private tutor, far better than a class of 90."* | ITS vs 1:1 human g = −0.11 n.s.; ITS vs large group g = +0.44. Quoting 2.0 is a credibility risk with any informed reader. |
| A2-18 | **Parent-facing career-information artefacts in Urdu** (arts, humanities, social sciences) containing **no student data**. | Parental disapproval is the #1 barrier for arts students. Strictly distinct from A1-15, which forbids sharing *student data*. |

### P2

| # | Recommendation | Why |
|---|---|---|
| A2-19 | Seed content in order: **Gen-Ed QR/English → pre-university → CS + EE/Civil/Mech → MBBS pre-clinical → Commerce/ACCA**. | Gen-Ed (30 cr, incl. 6 cr Quantitative Reasoning) is uniform across *every* Pakistani undergraduate degree — the single highest-leverage shared track. |
| A2-20 | MDCAT content budget mirrors the real paper: Bio 45 / Chem 25 / Phys 20 / Eng 5 / LR 5. | Match the actual instrument. |
| A2-21 | Parse `3(2+1)` into `{credit_hours_total, theory_cr, lab_cr}`; support both CGPA/4.0 and annual-division grading. | Pakistani course conventions. |
| A2-22 | Weight agriculture content to **livestock/dairy/poultry/veterinary**, against how curricula are weighted. | Livestock = 62% of agricultural value added, +3.75%; crops +0.65%. |
| A2-23 | Use **law as the flagship Socratic demo**; build IRAC problem-questions and procedure simulators. | Law is natively Socratic, and "know the law, can't use it" is the documented gap. |

---

## Agent 3 — Batch 3 + 4 (wellness, careers, analytics, growth)

### P0

| # | Recommendation | Why | Source doc |
|---|---|---|---|
| A3-1 | **Wellness is routing to help, not treating.** Referral must be **one tap**. | Only 15.7% of affected students seek treatment. | `PROBLEMS_MEDICAL.md` M2 |
| A3-2 | **But referral-first design FAILS in Pakistan.** <20% of universities have counselling; ~1 psychiatrist/100k. **Maintain a curated list of Pakistan-specific resources and VERIFY they answer.** An unanswered helpline is worse than none. | The standard Western wellness pattern assumes services exist. They largely don't. | `PROBLEMS_SOCIAL_SCIENCES.md` S4 |
| A3-3 | **Weight wellness toward self-management and social support**, not professional referral: sleep, workload rebalancing, peer connection, and — opt-in — **religiously-framed coping**, which is what Pakistani students already use. **Requires expert review.** | Religion is the most common documented coping strategy. | `PROBLEMS_SOCIAL_SCIENCES.md` S7 |
| A3-4 | **Design wellness around ANXIETY first**, not low mood. | Anxiety consistently exceeds depression in Pakistani samples (88.4% vs 75%) — the reverse of the international ordering. | `PROBLEMS_SOCIAL_SCIENCES.md` S2 |
| A3-5 | **Do not scope wellness to the medical vertical.** | Non-medical students are *more* affected (60.3% vs 48.7%). | `PROBLEMS_SOCIAL_SCIENCES.md` S1 |
| A3-6 | **Wellness stays in the free tier.** | Female and low-SES students are at higher risk and lower ability to pay. | `PROBLEMS_SOCIAL_SCIENCES.md` S6 |

### P1

| # | Recommendation | Why |
|---|---|---|
| A3-7 | **Workload/overload detection.** Academic pressure shows a clean monotonic dose–response with distress, and Learms is the system that *has* the workload data. | This is a legitimate, high-value, uniquely-available signal. |
| A3-8 | **Distinguish "discouraged" from "confused."** Signals: latency, hint exhaustion, session abandonment, time of day, streak break after a long streak. | The one thing human tutors do that ITS research explicitly does **not** cover — and the likely binding constraint on 6-month retention. |
| A3-9 | **Transition support at Year 1 and Year 3** (medical); Year-1 generally. | Distress peaks at those transitions [Azim & Baig, Karachi]. |
| A3-10 | **Build a job-readiness + technical-English track** across all verticals. | 10% IT employability; 64% of graduates report skill-gap employment difficulty; 58% of employers can't find suitable workers. English is named in the SBP finding. |
| A3-11 | **Freelance / self-employment literacy** — pricing, contracts, client management, invoicing, international payment rails. | Highest-value teachable for arts, media and CS graduates given unpaid internships are a documented cross-field norm. Generalises everywhere. |
| A3-12 | **FYP (final-year project) support** for engineering. | Every BS requires a 3–6 cr capstone; almost nobody gets adequate supervision at 1:34. Obvious, under-served, high-intent. |
| A3-13 | **"Is my batch PEC-accredited?" lookup.** | PEC's own data is nearly unusable; high anxiety relief; cheap. |
| A3-14 | **Teacher segment** — lesson-plan generation against the board syllabus, item generation, private subject-knowledge refreshers, marking assistance. 30–100× reach per user. **⚠ Gated on G10: teacher device ownership is unresearched.** | 1.83m teachers, 40% with adequate subject knowledge, no CPD system, and HEC's B.Ed already has an "AI in Education" specialisation slot. |

### P2

| # | Recommendation | Why |
|---|---|---|
| A3-15 | **CSS/PMS preparation as a vertical.** | The natural destination for social-science graduates; large, high-intent, underserved. Syllabus not yet fetched (`GAPS.md` N3). |
| A3-16 | Target **Tier-2 (large public) and Tier-4 (AIOU + Virtual University)** institutions first. | Scale plus existing distance-learning behaviour. |
| A3-17 | **Financial-hardship-aware features**: pause, free tier, no payment nags. | Enrolment fell 11.8% on cost; climate events cause household income shocks for agriculture students. |
| A3-18 | Scrape the ~50 HEC curriculum PDFs as the canonical content spine; treat university catalogues as overrides. | Highest-ROI legal data acquisition available. |
| A3-19 | **⚠ Legal review before ingesting any case law.** PLD/ALD/MLD/SCMR are copyrighted commercial products. Public-domain routes: supremecourt.gov.pk, High Court sites, pakistancode.gov.pk. | Real legal exposure. |
| A3-20 | **Journalism digital-security/ethics content requires expert review and a deliberate decision** — politically sensitive in Pakistan (64 journalists killed since 1992). | Founder call, not an engineering call. |

---

## Cross-cutting: the three things most likely to be got wrong

1. **Building free-form Socratic chat.** The evidence says step-level feedback is where the gain is
   (0.76) and sub-step dialogue measured *worse* (0.40). This is the most expensive, least reliable,
   hardest-to-evaluate thing on the roadmap and **the data do not support it.**
2. **Shipping plain BKT.** It is worse than chance on templated content, which is what Learms has.
   BKT-ST costs one column.
3. **Treating "AI summarises your notes" as the product.** Summarization is the lowest-utility
   technique of the ten studied.

## The three things most likely to be under-valued

1. **Mastery gating** (1.2 SD, no LLM required).
2. **Interleaved review queues** (3× delayed retention, one scheduling change).
3. **The append-only event log** (irreplaceable; every model downstream depends on it).
