# Hint Ladders, Help-Seeking and Gaming the System — Deep Dive

**Agent 4 — Area 9.2** · Last updated 2026-09-30
**Primary consumers: Agent 1 (hint engine + detectors), Agent 2 (hint UX).**

This is the companion to `SOCRATIC_DEEP.md`. That document establishes *step-level feedback* as the
mechanism. This one establishes **what to put at each step when the learner is stuck** — and what
happens when they abuse it.

---

## 0. The bottom line

Hints work. **Hint *abuse* is frequent, measurable, and associated with learning only 2/3 as much.**
But the obvious fix — stopping the abuse — **did not produce learning gains** in the experiments
that tried it. And **bottom-out hints (the ones that give the answer) positively correlate with
learning when students spend time on them.**

The honest conclusion from twenty years of Carnegie Mellon work: **build the ladder, build the
detector, but intervene by prompting *self-explanation after the hint* — not by withholding help.**

---

## 1. The hint ladder

### Topic: Structure of on-demand help in intelligent tutors
### Source: Roll, Aleven, McLaren & Koedinger (2011), "Improving students' help-seeking skills using metacognitive feedback in an intelligent tutoring system", *Learning and Instruction*; Aleven, Roll, McLaren & Koedinger (2016), "Help Helps, But Only So Much: Research on Help Seeking with Intelligent Tutoring Systems", *IJAIED*
### Key Finding **[HIGH]**

Cognitive Tutors present **multi-level, on-demand hints per problem step**, typically **4 levels**,
progressing from a **principle-based** prompt to the **bottom-out hint** (Level 4) which states the
answer for that step.

Two named failure modes:
- **Help avoidance (underuse)** — refusing help when it is clearly needed.
- **Help abuse (overuse)** — "help use that avoids careful reading and sense making, for example,
  clicking through hints while spending very little time reading them, and then copying the answer
  provided in the bottom-out hint."

The literature also distinguishes **instrumental** help seeking (wanting to understand) from
**executive** help seeking (wanting the answer). *"One common form of executive help seeking is
rapidly clicking through hints to reach the bottom-out hint to get the answer."*

### Citation
- https://www.cs.cmu.edu/afs/cs/Web/People/bmclaren/pubs/RollEtAl-ImprovingHelpSeekingWithITS-LandI2011.pdf
- https://www.cs.cmu.edu/~aleven/Papers/2016/Aleven_etal_IJAIED2016-Helpseeking.pdf

---

## 2. The measured scale of the problem

### Key Finding **[HIGH — log data, replicated]**

| Finding | Value | Source |
|---|---|---|
| Hint levels students **skipped past** in the Geometry Cognitive Tutor | **68%** | Aleven & Koedinger, 2000/2001 |
| Hint episodes in which students went **all the way to the bottom-out hint** | **82%** | Koedinger, Aleven, Roll & Baker, 2009 |
| Learning by students who frequently **game the system**, vs similar students who don't | **only 2/3 as much** | Baker, Corbett & Koedinger, 2004 |
| Gaming on **difficult** skills vs easy skills, "gamed-hurt" students | **12% vs 2%** (t(7)=2.99, p<0.05) | Baker et al., 2004 |
| Same comparison for "gamed-not-hurt" students | 2% vs 4% (n.s.) | Baker et al., 2004 |

**Definition** [Baker et al., 2006]: *gaming the system* = **"attempting to succeed in an
interactive learning environment by exploiting properties of the system rather than by learning
the material."** Two observed behaviours: **help abuse** and **systematic trial-and-error guessing**.

**Three critical nuances:**
1. **Gaming is worse for learning than being off-task.** "Gaming the system has been found to have
   a greater negative impact on learning than several types of off-task behaviors." A student's
   gaming frequency was **strongly negatively correlated with learning but NOT correlated with
   other off-task behaviour** — they are different populations.
2. **Not all gaming hurts.** The literature separates **"gamed-hurt"** from **"gamed-not-hurt"**
   students. *"To be maximally useful, a metacognitive model should accurately identify the
   gamed-hurt students — it is not as important to identify the gamed-not-hurt students."*
3. **The signature of harmful gaming is gaming on HARD skills.** Gamed-hurt students gamed 6× more
   on difficult skills than easy ones; gamed-not-hurt students showed no such pattern. **This is a
   directly implementable discriminator**, and it makes intuitive sense: skipping the easy stuff is
   efficiency; skipping the hard stuff is avoidance.

### Citation
- http://pact.cs.cmu.edu/koedinger/pubs/Baker,%20Corbett,%20Koedinger%20ITS04.pdf
- https://pact.cs.cmu.edu/koedinger/pubs/Koedinger,%20Aleven,%20Roll%20&%20Baker%2009-v129.pdf

---

## 3. The counter-intuitive results — read these before building anything

### 3.1 **Bottom-out hints correlate POSITIVELY with learning** **[HIGH — and it reverses the obvious design]**
Shih, Koedinger & Scheines (2008) found that **time spent with bottom-out hints correlates
positively with learning**. The interpretation: *"some students take advantage of bottom-out hints
as opportunities for spontaneous self-explanation (i.e., unprompted and unsupported by the tutor),
similar to self-explaining worked examples"* [Chi et al., 1989; Renkl, 2013].

**It is not the hint that matters; it is the time spent thinking about it.** Bottom-out hints were
"found most useful to students who spontaneously self-explained following the hint."

Aleven et al.'s own recommendation (2016): *"We recommend that ITS developers continue to include
principle-based hints in tutors. **Bottom-out hints are useful, too.** They may help students to
continue when stuck, and may help learning when spontaneously self-explained."*

⚠ But: bottom-out hints are **not as effective as worked examples** — a separate line of studies
(McLaren et al. 2016; Razzaq & Heffernan 2009; Salden et al. 2010) "strongly suggests that
bottom-out hints are not as effective as worked examples."

### 3.2 **Fixing help-seeking did NOT improve domain learning** **[HIGH — and it is deflating]**
The **Help Tutor** — a metacognitive tutor giving real-time feedback on help-seeking behaviour —
*did* change behaviour: students "asked for fewer bottom-out hints", "spent more time per hint
level", and "requested fewer hint levels". **But: "we did not find improved domain-level learning
due to feedback on help seeking."**

Baker et al. (2006) reached the same conclusion: **"reducing help abuse (and other gaming
behaviors) might not contribute to learning gains by itself."**

**This is the most important result in this document.** The intuitive product feature — "detect
hint abuse and stop it" — has been built, tested, and **does not work.**

### 3.3 What *did* work: Scooter the Tutor **[MED — single study]**
Scooter the Tutor, built on Baker's machine-learned gaming detector, gave **supplementary exercises**
to students detected gaming on a given skill. Result: gaming students "**started out behind the
rest of the class, but caught up by the post-test**". In the control condition and in prior studies,
"frequent harmful gaming is associated with starting out lower than the rest of the class, and
**falling further behind** by the post-test, rather than catching up."

**And the part everyone remembers is the part that didn't matter:** Scooter also displayed emotional
expressions (e.g. anger) at gaming students. *"The emotional expressions, on the other hand, were
not associated with better or worse learning."* **Shaming had no effect. Extra practice did.**

### 3.4 Help avoidance is real too
Aleven & Koedinger (2000a): "after several consecutive errors on a step with no hints, students
were more likely to **try again rather than ask for a hint**", and "used the tutor's glossary very
rarely". So: *"students either ask [for everything, or for nothing]."* Both extremes are failures.

### Citation
- https://www.cs.cmu.edu/~aleven/Papers/2016/Aleven_etal_IJAIED2016-Helpseeking.pdf
- http://pact.cs.cmu.edu/koedinger/pubs/Roll,%20Baker,%20Aleven,%20McLaren,%20Koedinger%202005.pdf

---

## 4. Two detector architectures

### Source: Roll, Baker, Aleven, McLaren & Koedinger (2005), "Modeling Students' Metacognitive Errors in Two Intelligent Tutoring Systems"
### Key Finding **[HIGH]**

| | **Help-Seeking Model** | **Gaming Detector** |
|---|---|---|
| Type | **Prescriptive, rational** — models *ideal* behaviour and flags deviations | **Descriptive, machine-learned** — models what bad users actually do |
| Goal | Improve help-seeking | Eliminate gaming |
| Strength | Captures a **larger variety** of faulty behaviours; better at characterising *which problems* are gamed | **Much better at identifying gaming students who do NOT learn** (the gamed-hurt group) |
| Portability | **"The help-seeking model is domain independent"**, and student behaviour is fairly consistent across tutors | Trained per system |

Correlation between the two is **low (r = 0.20, p < 0.1)** — they capture genuinely different
things. **"Combining the models yields better results than either of the models can obtain alone."**

Key features used: **average hint level requested** (high ⇒ executive help seeking) and
**time to take action** (rapid actions ⇒ guessing or clicking through without reading).

---

## 5. Specification for Learms

### **H1 — Build a 4-level principle-based ladder, and keep the bottom-out hint.**
```
L1  Orient      — "What is this step asking you to find?"        (no content given)
L2  Principle   — the rule/concept that applies, stated generally (no application)
L3  Applied     — the principle applied to THIS problem's quantities (no answer)
L4  Bottom-out  — the answer for this step, with the reasoning shown
```
Do **not** withhold L4. It correlates positively with learning, helps students continue when stuck,
and withholding it is what drives systematic guessing — the *other*, worse gaming behaviour.

### **H2 — The intervention is a self-explanation prompt AFTER the hint, not a barrier before it.**
This is the single highest-value design decision in this document. The evidence says bottom-out
hints help *when self-explained*, and that blocking abuse doesn't help. So: after L4, require a
short commitment before the step is marked done — *"In one line: why does that work?"* or
*"Which principle did that use?"*

This also aligns with `SOLUTIONS_BY_CATEGORY.md` S7 (elaborative interrogation, d = 0.56) and
implements the "reflection after applying the help" finding directly.

### **H3 — Detect gaming, and use "gaming on HARD skills" as the harm discriminator.**
Log per step: `hint_level_reached`, `time_on_each_hint_level_ms`, `time_to_first_action_ms`,
`consecutive_wrong_attempts`, `skill_difficulty`. Flag as *likely gamed-hurt* when a student
reaches L4 rapidly **and disproportionately on difficult skills** (the 12%-vs-2% signature).
Reaching L4 slowly, or mostly on easy skills, is **not** a problem — do not treat it as one.

### **H4 — Respond with extra practice, never with shaming.**
Scooter's supplementary exercises let gaming students *catch up*; its emotional expressions did
nothing. **No angry mascots, no "you're cheating" copy, no hint-usage guilt.** This also aligns
with `WELLNESS_SAFE.md` WS3 (no punitive mechanics) and with the Pakistani context, where academic
shame is already a measured stressor.

### **H5 — Detect help AVOIDANCE too, and offer proactively.**
Multiple consecutive errors with no hint request is the documented signature. Offer the hint
rather than waiting to be asked. Rare-glossary-use is a second signal.

### **H6 — Hints should not depress the mastery estimate the way a plain wrong answer does.**
Feed `hints_used` into the BKT update as a distinct signal, not as a simple failure — and into the
FSRS grade mapping as "Hard" rather than "Again" (`FSRS_DEEP.md` F4). A student who asked for a
principle hint and then solved the step is in a different state from one who guessed wrong.

### **H7 — Prefer worked examples over bottom-out hints where the format allows.**
Worked examples measured more effective than bottom-out hints. For a new skill, lead with a worked
example; reserve the hint ladder for practice.

### **H8 — Build the Help-Seeking Model first; it is domain-independent.**
The rational model transfers across subjects and requires no training data — decisive for a
cold-start product covering eleven fields. Add a machine-learned gaming detector later, once
there is log volume, and combine them.

### **H9 — Set expectations honestly.** The 2016 paper's title is *"Help Helps, But Only So Much."*
Do not over-promise the hint system internally. Its measured job is to let students continue when
stuck, not to transform outcomes.

---

## 6. Actionable summary

| # | Decision | Detail | Owner |
|---|---|---|---|
| **H1** | **4-level ladder; KEEP the bottom-out hint** | Bottom-out time correlates *positively* with learning; withholding it drives guessing | **Agent 1 + 2** |
| **H2** | **Self-explanation prompt AFTER the hint** — the intervention, not a barrier before it | Blocking abuse was tested and did **not** improve learning; self-explanation is what makes hints work | **Agent 2 — highest value here** |
| **H3** | **Detect gaming; use "gaming on hard skills" as the harm signal** | 12% vs 2% is the gamed-hurt signature; gaming easy skills is harmless | **Agent 1** |
| **H4** | **Respond with extra practice; never shame** | Scooter: exercises worked, emotional expressions did nothing | Agent 1 + 2 |
| **H5** | **Detect help AVOIDANCE**; offer proactively after consecutive errors | Students "try again rather than ask" — the opposite failure | Agent 1 |
| **H6** | **Hints ≠ failure** in BKT/FSRS updates | Log `hints_used` as a distinct signal; map to "Hard", not "Again" | **Agent 1** |
| **H7** | **Worked examples > bottom-out hints** for new skills | Directly measured across several studies | Agent 2 |
| **H8** | **Help-Seeking Model first** (rational, domain-independent, no training data) | Cold start across 11 fields; add the ML detector later and combine (r = 0.20 — they're complementary) | Agent 1 |
| **H9** | "Help helps, but only so much" | Don't over-promise the hint system internally | All |

## Gaps / Not found
- **No study of hint ladders with Pakistani students** or in a bilingual setting. Given that
  `PROBLEMS_BUSINESS.md` B7 shows language and concept are confounded for many Pakistani students,
  **a student may click to the bottom-out hint because they cannot read the earlier levels in
  English, not because they are gaming.** Serving hints in Urdu before concluding "abuse" is a
  non-obvious requirement. **Unevidenced but strongly implied.**
- **No evidence on LLM-generated hints** vs authored hint ladders. All of this literature predates
  LLMs. Whether a generated hint can be reliably pitched at L2 vs L3 is untested.
- Shih, Koedinger & Scheines (2008) is cited throughout but **was not retrieved directly**.
- No data on the optimal *number* of hint levels — 4 is convention, not a measured optimum.
- Baker's gaming detector was built for a specific tutor; transferability to Learms' item types is
  unknown.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Peer-reviewed (review) | Aleven, Roll, McLaren & Koedinger (2016), "Help Helps, But Only So Much", *IJAIED* | https://www.cs.cmu.edu/~aleven/Papers/2016/Aleven_etal_IJAIED2016-Helpseeking.pdf |
| Peer-reviewed | Roll, Aleven, McLaren & Koedinger (2011), *Learning and Instruction* — the Help Tutor experiment | https://www.cs.cmu.edu/afs/cs/Web/People/bmclaren/pubs/RollEtAl-ImprovingHelpSeekingWithITS-LandI2011.pdf |
| Peer-reviewed | Baker, Corbett & Koedinger (2004), "Detecting Student Misuse of Intelligent Tutoring Systems", *ITS* — 2/3 learning, hard-skill signature | http://pact.cs.cmu.edu/koedinger/pubs/Baker,%20Corbett,%20Koedinger%20ITS04.pdf |
| Peer-reviewed | Roll, Baker, Aleven, McLaren & Koedinger (2005) — Help-Seeking Model vs Gaming Detector | http://pact.cs.cmu.edu/koedinger/pubs/Roll,%20Baker,%20Aleven,%20McLaren,%20Koedinger%202005.pdf |
| Peer-reviewed | Koedinger, Aleven, Roll & Baker (2009) — in vivo metacognition experiments, Scooter the Tutor, 82% bottom-out | https://pact.cs.cmu.edu/koedinger/pubs/Koedinger,%20Aleven,%20Roll%20&%20Baker%2009-v129.pdf |
