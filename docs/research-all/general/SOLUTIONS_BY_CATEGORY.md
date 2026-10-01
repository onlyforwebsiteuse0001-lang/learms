# Solutions — Evidence-Ranked Learning Techniques and Their Mapping to Learms

**Agent 4 — Area 3.1** · Last updated 2026-09-30
**Primary consumers: Agent 1 (scheduler/engine), Agent 2 (content & UX).**

This is the "what actually works" document. Every recommendation elsewhere in this research should
be traceable to a technique ranked here.

---

## 1. The canonical ranking

### Topic: Relative utility of ten learning techniques
### Source: Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J. & Willingham, D. T. (2013), "Improving Students' Learning With Effective Learning Techniques: Promising Directions From Cognitive and Educational Psychology", *Psychological Science in the Public Interest* 14(1):4–58
### Key Finding **[HIGH — the reference that operationalised evidence strength for learning-science design]**

Techniques were rated by whether benefits **generalise across four categories**: learning
conditions, student characteristics, materials, and criterion tasks.

| # | Technique | **Utility** |
|---|---|---|
| 1 | **Practice testing** (self-testing / practice tests) | **HIGH** |
| 2 | **Distributed practice** (spreading study over time) | **HIGH** |
| 3 | Elaborative interrogation (asking "why is this true?") | Moderate |
| 4 | Self-explanation (explaining your own processing) | Moderate |
| 5 | Interleaved practice (mixing problem types in a session) | Moderate |
| 6 | Summarization | **LOW** |
| 7 | **Highlighting / underlining** | **LOW** |
| 8 | Keyword mnemonic | **LOW** |
| 9 | Imagery use for text learning | **LOW** |
| 10 | **Rereading** | **LOW** |

**The finding that should drive product decisions:**
> "**Most students report rereading and highlighting**, yet these techniques do not consistently
> boost students' performance, so **other techniques should be used in their place** (e.g., practice
> testing instead of rereading)."

The two techniques students use most are among the five that work least. Dunlosky et al. (2013b) on
the low-utility set: they "failed to help students of all sorts", benefits can be short-lived and
narrow, and they do not provide "bang for the buck".

Moderate ratings were **not** negative verdicts — elaborative interrogation and self-explanation
simply "have not been adequately evaluated in educational contexts", and interleaving research
"has just begun".

### Citation
- https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf (full monograph)
- http://iverson.cm.utexas.edu/courses/310M/Handouts/Dunlosky%20et%20al.%20-%202013%20-%20Improving%20Students%92%20Learning%20With%20Effective%20Learni.pdf (mirror)
- https://www.psychologicalscience.org/journals/pspi/1529100612453266/
- https://bpb-us-e2.wpmucdn.com/sites.wustl.edu/dist/e/1431/files/2019/04/Dunlosky-Ame-Ed_Study-Strategies-to-Boost-Learning-196c2oq.pdf (*American Educator* practitioner version)

---

## 2. The effect sizes — Dunlosky's ratings, independently confirmed

### Source: Donoghue, G. M. & Hattie, J. A. C. (2021), "A Meta-Analysis of Ten Learning Techniques", *Frontiers in Education* — **242 studies, 1,619 effects, 169,179 unique participants**, overall mean d = 0.56
### Key Finding **[HIGH — large, independent, and it *validates* the 2013 ratings]**

| Technique | Dunlosky class | Cases | Unique N | **d** |
|---|---|---|---|---|
| **Distributed practice** | High | 150 | **152,952** | **0.85** |
| **Practice testing** | High | 374 | 6,033 | **0.74** |
| Elaborative interrogation | Moderate | 254 | 2,138 | 0.56 |
| Interleaved practice | Moderate | 104 | 972 | 0.47 |
| *Summarization* | Low | — | — | *lowest of the ten* |

The authors note the correspondence is close: **High = d > 0.70, Moderate = 0.54–0.69**, and the
"Low" techniques still cluster near Hattie's cross-education average of **d = 0.40** (from 1,200+
meta-analyses). Mnemonics, rereading and interleaving all sit **within 0.06** of the Moderate band.

⚠ **Two honest caveats:**
- Heterogeneity is very high (I² = 78–88% across techniques). These are noisy aggregates.
- Distributed practice's d = 0.85 rests on an enormous N (152,952) but only 150 cases; practice
  testing has 374 cases but N = 6,033. Different kinds of evidence.
- **Authors' own warning, which Learms must heed:** *"Practice Testing is among the top two
  techniques but it would be a mistake to then make claims that there should be more testing,
  especially high-stakes testing!"* The effect is for **low-stakes retrieval practice**, not for
  more exams. Given Pakistan's exam-saturated culture (`PROBLEMS_BUSINESS.md` §2), this distinction
  is critical: Learms should deliver **more retrieval, less examination**.

### Citation
- https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full
- https://www.researchgate.net/publication/350528590_A_Meta-Analysis_of_Ten_Learning_Techniques

---

## 3. Mechanism details worth building against

### 3.1 Practice testing **[HIGH]**
- Works **regardless of test form** (MCQ or essay), and **even when the practice format doesn't
  match the criterion format**. → *Learms can use MCQs to prepare for written exams and vice versa.*
- Works for **all ages and ability levels**.
- Works even when **massed**, but is **better when spaced**.
- Effects shown not just on experimenter-devised quizzes but on **actual summative course
  assessments**.
- **Recall beats recognition**: students "benefit most from tests that require recall from memory,
  and not from tests that merely ask them to recognize the correct answer." **⚠ This is a direct
  challenge to an MCQ-only product.**
- Example magnitude: Runquist (1983) — practice test **56%** vs restudy **42%** on later recall.
- Mechanism: increases retrievability from long-term memory, **improves how students mentally
  organize information**, and improves processing of idiosyncratic item features.
- **"Get it right on more than one occasion"** — successful retrieval should be repeated, not retired.

### 3.2 Distributed practice **[HIGH]**
- Works across ages, materials, and criterion tasks including higher-level cognition.
- Practitioner prescriptions from Dunlosky's *American Educator* article, directly implementable:
  - **"Two short study blocks per week may be enough"** per class.
  - Each block should cover **recently introduced material AND material from previous sessions**.
  - **Cumulative exams** encourage distributed restudy (he concedes they "may seem punitive" —
    mitigate by highlighting what is most likely to be retested).
  - Students should build a **"study planner"** so they "rely less on cramming."
- Textbook design critique: US textbooks "grouped to-be-worked problems together … as opposed to
  distributing them throughout the pages", and had **less variability** in problem sets than
  comparable Soviet textbooks. *This is precisely the flaw in Pakistani textbook/past-paper drilling.*

### 3.3 Interleaving — the most counter-intuitive and most exploitable **[MED→HIGH]**
The geometry-solids study (Taylor & Rohrer) is the canonical demonstration:

| | During practice | On the delayed test (1 week later) |
|---|---|---|
| **Blocked/massed** | **99%** (partial problems) — looks great | **performed horribly** |
| **Interleaved** | **68%** — looks worse | **3× better than massed**, with *no decline* from practice level |

> "**Massed practice leads to quick learning and quick forgetting, whereas interleaved practice
> slows learning but leads to much greater retention.**"

Mechanism: blocked practice "robs students of the opportunity to practice **identifying** which
kind of problem they face". Interleaved students "were better at discriminating among the kinds of
problems and consistently applied the correct formula to each one." Confirmed across 25 sessions
with college students learning algebra rules — the advantage held both for **new versions of
practised problems** and for **novel combinations of rules**.

**This is the single most important technique for Pakistani exam prep**, because MDCAT, ACCA and
board exams present problems *unlabelled and mixed*, while every Pakistani textbook, academy and
past-paper booklet drills them **blocked by chapter**. The mismatch is exactly the failure mode
interleaving fixes.

⚠ **And it explains why students resist it.** Blocked practice *feels* better (99% vs 68%), so
students and teachers prefer it. **Learms will be adopting a technique that makes users feel worse
in the moment and better at the exam.** That is a product-design problem, not just an engine
problem — see **S8** below.

### 3.4 Elaborative interrogation & self-explanation **[MED]**
- Both work by making the learner integrate new information with prior knowledge.
- **"Even young students should have little trouble using elaborative interrogation, because it
  simply involves encouraging them to ask 'why' questions."** Extremely cheap to implement.
- ⚠ Dosage caveat found in the monograph: benefits weaken when prompts are **infrequent**
  (e.g. one prompt every 1–2 pages).
- ⚠ A negative result worth remembering: in one study, telling students explicitly about the
  logical connection between concrete practice problems and forthcoming abstract problems produced
  **no benefit** (28%). Transfer is hard; simply *announcing* the connection does not create it.

---

## 4. Mapping techniques → Learms subsystems

| Technique | d | Learms implementation | Already specified in |
|---|---|---|---|
| **Distributed practice** | **0.85** | **FSRS scheduler** | `FSRS_DEEP.md` F1–F3 |
| **Practice testing** | **0.74** | Every lesson is predict→commit→feedback; derived FSRS grades | `FSRS_DEEP.md` F4; `PROBLEMS_NATURAL_SCIENCES.md` N5 |
| **Interleaved practice** | 0.47 | **Mixed-topic review queues; never blocked-by-chapter** | **new — S3 below** |
| Elaborative interrogation | 0.56 | "Why is that the answer?" prompts after correct responses | `SOCRATIC_DEEP.md` |
| Self-explanation | — | Step-level explain-your-reasoning prompts | `SOCRATIC_DEEP.md` SO2 |
| **Mastery learning** | **1.2 SD** | Mastery gate before unit advance | `SOCRATIC_DEEP.md` SO1 |
| **Step-based feedback** | **0.76** | Step decomposition on every problem | `SOCRATIC_DEEP.md` SO2 |
| Interactive engagement | ⟨g⟩ 0.48 vs 0.23 | Predict→commit→reveal in physics/conceptual content | `PROBLEMS_NATURAL_SCIENCES.md` |
| ~~Rereading~~ | LOW | **Do not build "read the notes again" flows** | — |
| ~~Highlighting~~ | LOW | **Do not build a highlighter and call it studying** | — |
| ~~Summarization~~ | LOWEST | Don't make AI-generated summaries the core value prop | — |

**⚠ The uncomfortable one:** AI-generated **summaries** are the most common LLM edtech feature, and
summarization is the **lowest-scoring technique of the ten**. Summaries are fine as *navigation*;
they must not be sold as *learning*.

---

## 5. Actionable summary

| # | Decision | Detail | Owner |
|---|---|---|---|
| **S1** | **Replace rereading/highlighting with retrieval** | The two most-used student techniques are low utility. Learms' core loop must be retrieval, not review. | **Agent 2** |
| **S2** | **Spacing + testing are the two pillars** (d = 0.85, 0.74) | They are FSRS + practice items. Build these before anything else. | **Agent 1** |
| **S3** | **Interleave review queues by default** | Never serve a blocked-by-chapter review set. Mix problem types within a session. Highest-leverage un-built feature. | **Agent 1** |
| **S4** | **Recall > recognition** | MCQ-only is a compromise. Add free-recall/short-answer items with AI grading, especially for Bio/definitions. | **Agent 2** |
| **S5** | Practice-test format need not match exam format | Frees content design; MCQ practice still transfers to written papers | Agent 2 |
| **S6** | **More retrieval, LESS examination** | The authors warn explicitly against reading this as "more high-stakes testing" — vital in Pakistan | **All** |
| **S7** | Elaborative interrogation is nearly free | Add "why?" prompts after correct answers; frequent, not occasional | Agent 2 |
| **S8** | **Design for the interleaving paradox** | Blocked feels better (99% vs 68%) but tests 3× worse. Show delayed-retention evidence in-product; never let in-session accuracy be the headline metric. | **Agent 1 + 2** |
| S9 | Build the **study planner** | Dunlosky's explicit prescription: 2 short blocks/week per subject, mixing new + old | Agent 2 |
| S10 | **Don't sell summaries as learning** | Summarization is the lowest-utility technique of the ten | Product |
| S11 | Successful retrieval is not "done" | "Get it right on more than one occasion" — matches FSRS's stability growth | Agent 1 |

## Gaps / Not found
- **No study of any of these techniques with Pakistani students** or in an Urdu/English bilingual
  context. Effect sizes are from predominantly Western samples.
- **Heterogeneity is very high (I² 78–88%)** in the Donoghue & Hattie meta-analysis — the point
  estimates are less precise than they look.
- Dunlosky & Rawson (2015) noted interleaving evidence has grown since 2013 and its "Low/Moderate"
  rating may now be **understated** — not re-researched here.
- **No evidence located on how to make students accept interleaving** despite its worse in-session
  feel (S8). This is a real open design problem.
- The "desirable difficulties" literature (Bjork) is referenced via FSRS but **not researched
  directly** — should be, as it is the theoretical umbrella over spacing, interleaving and testing.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Peer-reviewed (landmark) | Dunlosky et al. (2013), *PSPI* 14(1):4–58 — full monograph | https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf |
| Peer-reviewed (mirror) | Dunlosky et al. (2013) | http://iverson.cm.utexas.edu/courses/310M/Handouts/Dunlosky%20et%20al.%20-%202013%20-%20Improving%20Students%92%20Learning%20With%20Effective%20Learni.pdf |
| Journal record | APS — Improving Students' Learning With Effective Learning Techniques | https://www.psychologicalscience.org/journals/pspi/1529100612453266/ |
| Peer-reviewed | Donoghue & Hattie (2021), "A Meta-Analysis of Ten Learning Techniques", *Frontiers in Education* — 242 studies / 169,179 participants | https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full |
| Peer-reviewed (mirror) | Donoghue & Hattie (2021) | https://www.researchgate.net/publication/350528590_A_Meta-Analysis_of_Ten_Learning_Techniques |
| Practitioner | Dunlosky, *American Educator* (Fall 2013) — interleaving geometry study, study-planner prescriptions | https://bpb-us-e2.wpmucdn.com/sites.wustl.edu/dist/e/1431/files/2019/04/Dunlosky-Ame-Ed_Study-Strategies-to-Boost-Learning-196c2oq.pdf |
| Reference | Textbook of Usability — Dunlosky 2013 summary record | https://www.textbookofusability.com/references/dunlosky2013.html |
