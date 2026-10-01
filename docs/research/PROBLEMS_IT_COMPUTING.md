# Problems of IT & Computing Students

**Agent 4 — Area 2.2** · Last updated 2026-09-30

---

## 1. CS1 failure rates — the real number is ~33%, and it has not moved in 30+ years

### Topic: Worldwide pass rate of introductory programming (CS1)
### Source: Bennedsen, J. & Caspersen, M. E. (2007). "Failure rates in introductory programming." *ACM SIGCSE Bulletin* 39(2):32–36. · Watson, C. & Li, F. W. B. (2014). "Failure rates in introductory programming revisited." *ITiCSE '14*, ACM.
### Key Finding **[HIGH — independently replicated]**

| Study | Scope | Mean CS1 pass rate |
|---|---|---|
| Bennedsen & Caspersen (2007) | 63 institutions, survey | **67%** |
| Watson & Li (2014) | **161 CS1 courses, 51 institutions, 15 countries**, systematic review | **67.7%** (95% CI 65.3–70.1) |

Two independent methodologies, a 7-year gap, essentially identical answers. **So ~1 in 3 students
fails or aborts CS1.**

Moderator findings from Watson & Li (2014):
- Pass rates **have not improved since the 1980s**.
- **Not** significantly affected by the **programming language** taught. (Kills the "just teach Python
  instead of Java" theory as a systemic fix.)
- Significantly affected by **class size**: small classes 80.1% vs large classes 65.4%.
- Significantly affected by **institution type**: colleges 79.9% vs universities 66.4%.
- Range across courses is enormous: **23.1% to 96%**. 61% of courses fall in 50–80%.

⚠ **Honest caveat** — Bennedsen & Caspersen themselves wrote: *"We did not find the failure-rate of
CS1 to be alarmingly high."* And a later paper ("Learning to Program is Easy", 2016) argues the
real problem is **unrealistic instructor expectations** producing excessive workload, plagiarism,
and drop-out — i.e. the course is mis-specified, not the students mis-abled. Both studies also note
**self-selection bias**: respondents were CS-education researchers, likely *better* than average
teachers. So 67% may be an **optimistic** estimate. **[CONTESTED interpretation, agreed number.]**

### Relevance to Learms
- **Class size is the one moderator Learms can actually attack.** 80.1% (small) vs 65.4% (large)
  is a ~15-point swing attributable to attention-per-student. A 1:1 AI tutor is, structurally, the
  "small class" condition. This is the cleanest available quantitative argument for the product in
  computing — and it pairs with the Pakistani 1:34 staff-student ratio (see `UNIVERSITY_COURSES.md`).
- **Language choice is not the lever.** Don't over-invest in "we teach Python so it's easier".
  Invest in feedback loops and workload calibration instead.
- Target the **23%-pass-rate tail**, not the median course. The variance is the opportunity.

### Citation
- https://cs.au.dk/~mec/publications/journal/25--bulletin2007.pdf (Bennedsen & Caspersen 2007, full text)
- https://dl.acm.org/doi/pdf/10.1145/2591708.2591749 (Watson & Li 2014, full text)
- https://www.researchgate.net/publication/305081807_Learning_to_Program_is_Easy (counter-interpretation)

---

## 2. Programming misconceptions — the catalogue is known; use it

### Topic: The "notional machine" and specific novice misconceptions
### Source: Sorva, J. (2013). "Notional machines and introductory programming education." *ACM TOCE* 13(2), Article 8. · du Boulay (1986) · Hermans & Aivaloglou (2018) · Swidan et al. · TechRxiv (2024) empirical study, n=95
### Key Finding **[HIGH]**

**The notional machine** = an abstract, *correct* model of how the computer executes programs for a
given language. Sorva's central claim: novices must build a mental model of a notional machine in
order to program at all, and their difficulties in writing and debugging code stem from that model
being **incomplete, unscientific, boundary-less, and often internally contradictory** — students
will use one model for integer assignment and a *different* one for records.

Key mechanisms:
- Novice models are built on **superficial cues** — keywords, identifier names — rather than semantics.
  ("A hidden intelligent mind inside the computer will work out what I meant.")
- **Tracing exceeds working memory.** A status representation of a non-trivial program contains more
  state than WM can hold — which is *why* experts use paper and debuggers. Novices need to trace
  constantly but are bad at choosing what to trace.

**Empirically measured misconception frequencies** (TechRxiv 2024, n = 95, Python CS1):

| Misconception | Frequency |
|---|---|
| Identify variable *name* correctly | 93% could |
| Identify variable *value* correctly (`"New York"` incl. quotes) | only **64%**; 24% dropped the quotes; 12% answered `city` |
| Assign number 123 to `amount` | **~31% wrote `amount = "123"`** (number/string confusion) |
| Assign string "Paris" to `city` | 95% correct; ~5% wrote `"Paris" = city` (assignment = maths equality) |
| Type of `num = 2.5` | 90% correct |
| Type of `num = "2.5"` | only **54%** correct |
| Data-type conversion (`input()`, `int()`, `float()`) | **~18%** struggle; 9% think `input()` returns a number |

Classic catalogued misconceptions:
- **M-multiple-values**: after `x = 5; x = 7`, the variable holds *both*. [Swidan et al.; Hermans]
- **Reversed assignment**: `temperature = 5` read as `5 = temperature` — imported from maths.
- **M15 (Sorva)**: "primitive assignment stores equations or unresolved expressions" — i.e. `a = b + 1`
  is read as a *permanent mathematical constraint*, so changing `b` should change `a`.
- Students **interpret programming puzzles as mathematics exercises** [Hermans & Aivaloglou, 2018].
- Belief that once initialised, a variable's value cannot change [TechRxiv 2024].

**Surprising, actionable experimental result**: Hermans & Aivaloglou ran a *controlled experiment*
comparing the **"box" metaphor vs the "label" metaphor** for variables. The **box metaphor
significantly INCREASED the multiple-values misconception**. The metaphor an instructor chooses
causally changes which bugs students develop.

Also: Sorva notes that explicitly teaching a notional machine is **rare** — most courses have one
implicitly and never make it visible. A classroom study using **Interactive Memory Diagrams (IMDs)**
found students must **participate in constructing** the diagrams; passively watching them doesn't work.

### Relevance to Learms — this is a directly buildable feature set
1. **Ship a visible notional machine.** A memory/state visualiser (variables, values, references,
   call stack) stepping through execution, where the learner **predicts the next state before
   revealing it**. This is the CS analogue of Hake's predict-commit-feedback and of the FCI.
2. **Use the "label" metaphor, not the "box" metaphor**, in all variable explanations and
   illustrations. Evidence-based copy decision for Agent 2.
3. **Build a misconception taxonomy table** and tag every wrong answer to it. Starter set (IDs are
   Learms-local, sourced from Sorva's catalogue):
   `MC-VAR-MULTIVALUE`, `MC-VAR-REVERSED-ASSIGN`, `MC-VAR-EQUATION` (M15), `MC-VAR-IMMUTABLE`,
   `MC-TYPE-STRNUM`, `MC-TYPE-INPUT-RETURNS-NUM`, `MC-CTRL-LOOP-TERMINATION`, `MC-SCOPE`,
   `MC-COMPUTER-INFERS-INTENT`.
4. **Auto-generate diagnostic items from the measured frequencies above.** The `num = "2.5"` item
   (54% correct) and the `amount = 123` item (31% get it wrong) are *free, validated, high-yield
   diagnostics* — literally copy the question design.
5. **Teach tracing as an explicit skill with external memory aids**, because tracing is a WM-overflow
   task by nature. Never require mental tracing of >2–3 state variables.
6. **Debugging is a separate curriculum**, not a by-product of programming. Sorva's framing implies
   debugging failure = notional-machine failure, so debugging exercises should be *state-prediction*
   exercises ("what does the machine think is true here?"), not "spot the typo".

### Citation
- https://www.researchgate.net/publication/259998496_Notional_Machines_and_Introductory_Programming_Education (Sorva 2013)
- https://www.felienne.com/wp-content/uploads/2018/08/box-label-vars.pdf (Hermans & Aivaloglou — box vs label experiment)
- https://dl.acm.org/doi/pdf/10.1145/3478431.3499320 (Interactive Memory Diagrams in the classroom)
- https://www.techrxiv.org/doi/pdf/10.36227/techrxiv.172296773.35779481/v1 (measured misconception rates, n=95)
- https://www.ppig.org/files/2016-PPIG-27th-Miller.pdf (reference-point errors and the notional machine)

---

## 3. Pakistan-specific: the employability catastrophe

### Topic: Pakistani IT/CS graduate employability and unemployment
### Source: State Bank of Pakistan half-year report (reported by The Express Tribune, 2023) · Ahsan, H. & Khan, M. J., "Disaggregating the Graduate Unemployment in Pakistan", PIDE · Pakistan Labour Force Survey via PIDE · Global Innovation Index 2025
### Key Finding **[HIGH on the numbers, MED on causal attribution]**

**The headline, from the central bank:**
> **Only 10% of Pakistani IT graduates are employable.** — State Bank of Pakistan half-year report

SBP's supporting detail:
- Pakistan produces **20,000–25,000 fresh engineering + IT graduates annually**.
- Firms report *considerable difficulty hiring skilled staff*; the shortage is called the biggest
  obstacle to growing software exports and startups.
- Weakness is in **both technical and soft skills**. Named soft-skill gaps: **problem-solving,
  critical thinking, marketing, entrepreneurial mindset, and English-language proficiency** —
  specifically *English for engaging international buyers and investors*.
- Small IT firms can't outbid large ones for the scarce competent minority.

**Unemployment data (PIDE, from Labour Force Survey):**

| Group | 2018-19 | 2020-21 | Change |
|---|---|---|---|
| All graduates | 14.9% | **16.1%** | ↑ |
| **Engineering** | 11% | **23.5%** | **doubled in 2 years** |
| **Computer science** | 14.2% | **22.6%** | ↑ 59% |
| Agriculture | 11.4% | **29.4%** | ↑ 158% |
| Medical | lowest of all disciplines | ↑ 68% relative | still lowest |
| Overall national unemployment | ~6.3% | — | — |

- **Graduate unemployment ≈ 3× the national average**; the gap between overall (6.3%) and graduate
  (16.1%) unemployment is ~10 percentage points.
- **The probability of unemployment in Pakistan rises with education level.** [PIDE]
- Over **31% of educated youth** are unemployed; women are **51%** of the total unemployed.
- PIDE's four causes: (1) misalignment of degrees with labour demand, (2) **weak university–industry
  linkage**, (3) growing labour force, (4) macroeconomic contraction.
- Pakistan ranks **99th of 139** on the Global Innovation Index 2025; innovation *inputs* fell to
  **124th** — infrastructure, education, institutional support all cited.

⚠ **[CONTESTED / caveat]** The "10% employable" figure is a widely-repeated SBP claim but the
underlying methodology is not public. The LFS-based unemployment numbers are more solid. The 2020-21
spike overlaps COVID, so some of the doubling is pandemic-driven rather than structural. Use the
direction confidently; use the exact percentages with attribution.

### Relevance to Learms — this reframes what the product is for
1. **The Pakistani CS problem is not "pass the exam", it is "be employable after passing".** A
   product that only optimises GPA is optimising the wrong variable for this segment. Learms should
   carry an explicit **job-readiness track**: projects, portfolio, Git, code review, system design,
   and — critically — **technical English communication**.
2. **English is named by the central bank as a technical barrier to export earnings.** That makes
   "English for tech work" (writing a clear PR description, a standup update, a client email, a
   README) a *revenue-relevant* skill, not a soft add-on. Strongly recommend as a Learms module.
3. **Problem-solving and critical thinking** are the other named gaps — which is exactly what
   Socratic tutoring and interactive engagement produce, and exactly what rote/recall study does not.
   The SBP report is, in effect, an independent endorsement of Learms' pedagogy.
4. **Freelancing is the escape valve.** With 22.6% CS unemployment and firms unable to absorb
   graduates, freelancing/remote work is where much of this cohort actually earns. Content on
   freelance workflow (scoping, invoicing, client English, portfolio) may have higher realised value
   than another DSA course. **[Flagged as a hypothesis — freelancing-market data was not researched
   in this pass.]**
5. **Framing for the app:** "Only 10% of IT graduates are employable" is a legitimate, sourced,
   motivating statistic for onboarding copy — but must be attributed to SBP, not asserted as fact.

### Gaps / Not found
- **The "NSCT data" referenced in the original brief could not be identified.** No organisation or
  dataset matching "NSCT" in the Pakistani IT-skills context was found. **Marked NOT FOUND** — if the
  user meant **NAVTTC** (National Vocational & Technical Training Commission) or **P@SHA**
  (Pakistan Software Houses Association), say so and it will be researched.
- P@SHA / Pakistan Software Export Board salary and demand data was not retrieved in this pass.
- No Pakistan-specific CS1 pass-rate study was found.

### Citation
- https://tribune.com.pk/story/2417643/only-10-it-graduates-employable-sbp
- https://pide.org.pk/research/disaggregating-the-graduate-unemployment-in-pakistan/
- https://www.livemint.com/news/world/graduates-face-higher-unemployment-in-pakistan-here-s-why-11681085527407.html
- https://www.dailycountrytodaybd.com/story/educated-unemployment-on-alarming-rise-in-pakistan
- https://english.khabarhub.com/2025/07/504959/ (GII 2025 ranking)

---

## 4. Framework fatigue & curriculum staleness

### Key Finding **[MED — inference from verified sources, not a dedicated study]**
- HEC revises curricula on a **3-year cycle** via National Curriculum Revision Committees
  [HEC Curriculum Division]. Computer Science was last revised **2025-26**, which is good — but the
  *previous* CS revision on the portal is **2016-17**, a nine-year gap. Cyber Security got its first
  dedicated curriculum only in 2025-26.
- Pakistani commentary consistently cites "outdated syllabi, inadequate training facilities, poor
  industry-academia linkages" as causes of technical-graduate unemployment [Khabarhub, 2025; PIDE].
- A 3-year (in practice 9-year) revision cycle cannot track a JS/ML ecosystem that turns over in 18 months.

### Relevance to Learms
- **This is Learms' structural advantage over the university.** Content that can be updated
  continuously is worth more in computing than in any other field.
- But it is also a trap: chasing frameworks means infinite content debt. **Recommendation: teach the
  slow-moving 80% (data structures, algorithms, the notional machine, OS, networks, SQL, Git, HTTP,
  testing, debugging) as durable core content, and treat frameworks as thin, disposable "recipe"
  layers** that can rot without damaging the core graph.

---

## 5. Actionable summary

| # | Finding | Build decision | Owner |
|---|---|---|---|
| I1 | CS1 pass ≈ 67.7%, static for 30 yrs; small class 80% vs large 65% | Position the AI tutor as "the small-class condition". Use the 15-pt gap in positioning. | All |
| I2 | Language taught doesn't move pass rates | Don't over-invest in language choice; invest in feedback loops | Agent 2 |
| I3 | Novice failure = broken notional machine | Ship a step-through memory/state visualiser with **predict-before-reveal** | **Agent 1 + 2** |
| I4 | Box metaphor *causes* multiple-values misconception | Use the **label** metaphor everywhere in copy and diagrams | Agent 2 |
| I5 | Measured misconception rates exist (54% fail `num="2.5"`) | Copy those items directly into the diagnostic bank | Agent 2 |
| I6 | Misconceptions are enumerable | `misconception_id` on distractors; remediation routed per misconception | **Agent 1** |
| I7 | Tracing overflows WM | Always provide external state; never require mental tracing >3 vars | Agent 2 |
| I8 | SBP: 10% of IT grads employable; English + problem-solving named | Build a **job-readiness + technical-English** track, not just exam prep | Agent 2 + 3 |
| I9 | CS unemployment 22.6%, engineering 23.5% | Career/portfolio features are core, not optional | Agent 3 |
| I10 | Curricula revised every 3–9 yrs | Durable core content + thin disposable framework layer | Agent 2 |

---

## Sources

| Type | Source | URL |
|---|---|---|
| Journal | Bennedsen & Caspersen (2007), *SIGCSE Bulletin* 39(2) | https://cs.au.dk/~mec/publications/journal/25--bulletin2007.pdf |
| Conference | Watson & Li (2014), *ITiCSE '14* — 161 courses, 15 countries | https://dl.acm.org/doi/pdf/10.1145/2591708.2591749 |
| Journal | Sorva (2013), *ACM TOCE* 13(2) Art.8 — notional machines | https://www.researchgate.net/publication/259998496_Notional_Machines_and_Introductory_Programming_Education |
| Conference | Hermans & Aivaloglou — box vs label metaphor experiment | https://www.felienne.com/wp-content/uploads/2018/08/box-label-vars.pdf |
| Conference | Interactive Memory Diagrams in the classroom (SIGCSE 2022) | https://dl.acm.org/doi/pdf/10.1145/3478431.3499320 |
| Preprint | Identifying and Correcting Early Misconceptions (2024), n=95 | https://www.techrxiv.org/doi/pdf/10.36227/techrxiv.172296773.35779481/v1 |
| Counterpoint | "Learning to Program is Easy" (2016) | https://www.researchgate.net/publication/305081807_Learning_to_Program_is_Easy |
| Official/News | State Bank of Pakistan — 10% IT graduates employable (Tribune) | https://tribune.com.pk/story/2417643/only-10-it-graduates-employable-sbp |
| Think tank | PIDE — Disaggregating Graduate Unemployment in Pakistan | https://pide.org.pk/research/disaggregating-the-graduate-unemployment-in-pakistan/ |
| News | Livemint / Dawn coverage of PIDE data | https://www.livemint.com/news/world/graduates-face-higher-unemployment-in-pakistan-here-s-why-11681085527407.html |
