# Bayesian Knowledge Tracing — Deep Dive

**Agent 4 — Area 8.1** · Last updated 2026-09-30
**Primary consumer: Agent 1 (Backend).** Intended to be implementable directly.

> **BKT ≠ FSRS.** FSRS answers *"when should this item be shown again?"*. BKT answers
> *"does this learner know this skill?"*. Learms needs both, as **separate subsystems sharing one
> append-only event log**. See `FSRS_DEEP.md` §6 and decision **F8**.

---

## 0. Recommendation up front

**Use BKT — the classical four-parameter Corbett & Anderson model — with bounded guess/slip,
per-skill parameters, and a `P(T)`-individualised variant added later.** Do not start with Deep
Knowledge Tracing.

Reasons, all evidenced below: BKT's parameters carry **psychological meaning** and are directly
explainable to a student ("you're at 78% mastery on stoichiometry"); deep models are "low/opaque"
in interpretability; BKT works with tiny data; and Learms has hard constraints (bounded guess rates
for 4/5-option MCQs, misconception routing, timed/untimed context separation) that are easy to
express in BKT and hard to express in a black box.

---

## 1. The model

### Topic: Classical BKT
### Source: Corbett, A. T. & Anderson, J. R. (1994/1995), "Knowledge tracing: Modeling the acquisition of procedural knowledge", *User Modeling and User-Adapted Interaction*; Abdelrahman, Wang & Nunes (2023), "Knowledge Tracing: A Survey", *ACM Computing Surveys* 55(11)
### Key Finding **[HIGH — foundational, thirty years of use]**

BKT is a **Hidden Markov Model per skill (per Knowledge Component, KC)**. The latent state
`L_t ∈ {0,1}` is binary: the skill is either **learned** or **unlearned**. Classical BKT assumes
**no forgetting**.

**Four parameters, one set per skill:**

| Param | Name | Meaning |
|---|---|---|
| `p(L₀)` | **prior / p-init** | Probability the learner knew the skill *before* the first opportunity |
| `p(T)` | **learn / p-transit** | Probability of transitioning unlearned → learned at each opportunity |
| `p(G)` | **guess** | Probability of a correct answer *despite* non-mastery |
| `p(S)` | **slip** | Probability of an incorrect answer *despite* mastery |

Some extensions add `p(F)` — **forget** — making the transition matrix full.

### 1.1 The update equations (implementable verbatim)

**Initialise:**
```
p(L₁)ᵘᵏ = p(L₀)ᵏ
```

**Posterior after observing the response** (Bayes):
```
                              p(Lt)·(1 − p(S))
p(Lt | correct) = ──────────────────────────────────────────
                   p(Lt)·(1 − p(S)) + (1 − p(Lt))·p(G)

                              p(Lt)·p(S)
p(Lt | wrong)   = ──────────────────────────────────────────
                   p(Lt)·p(S) + (1 − p(Lt))·(1 − p(G))
```

**Apply learning (the transition):**
```
p(L_{t+1}) = p(Lt | obs) + (1 − p(Lt | obs)) · p(T)
```

**Predict the next response:**
```
p(C_{t+1}) = p(L_{t+1})·(1 − p(S)) + (1 − p(L_{t+1}))·p(G)
```

That is the entire algorithm. It is about twenty lines of code.

### Citation
- https://en.wikipedia.org/wiki/Bayesian_Knowledge_Tracing (equations a–e, as above)
- https://dl.acm.org/doi/10.1145/3569576 (Knowledge Tracing: A Survey, ACM CSUR)
- https://arxiv.org/html/2105.15106v4 (A Survey of KT: Models, Variants, Applications)

---

## 2. The two failure modes you MUST guard against

### 2.1 The **Identifiability Problem**
### Source: Beck, J. & Chang, K.-m. (2007); explained analytically by van de Sande, B. (2013), "Properties of the Bayesian Knowledge Tracing Model", *Journal of Educational Data Mining* 5(2)
### Key Finding **[HIGH — with an analytical proof]**

Beck & Chang observed that **multiple different combinations of `p(G)` and `p(L₀)` produce exactly
the same student-averaged error curve** — i.e. the parameters are not uniquely recoverable from
aggregate data. They did not explain why.

**Van de Sande solved it analytically.** He showed the BKT Markov-chain form has the closed solution
```
p(Cj) = 1 − p(S) − A·e^(−βj)
```
— an **exponential with three effective parameters**, not four. Any `(p(G), p(L₀))` pair giving the
same `A` yields an *identical* model. That degeneracy **is** the identifiability problem.

**Crucially, van de Sande also shows the problem has limits:**
> "The Identifiability Problem for the [BKT] hidden Markov model does not exist, **so long as there
> are both correct and incorrect steps**. … all four model parameters affect model behavior
> separately."

So: **identifiability degenerates when fitting to aggregate learning curves, but not when running
the real-time algorithm on individual response sequences containing both correct and incorrect
answers.**

**Parameter constraints van de Sande derives** (valid models must satisfy these):
- `0 ≤ p(L₀) ≤ 1`, `0 ≤ p(G) ≤ 1`
- **`p(G) + p(S) < 1`** — otherwise "negative learning"
- A further, stronger constraint relating `p(T)` to `p(G)` and `p(S)` that **completely supersedes**
  `p(G) + p(S) < 1`. Valid parameters lie in a bounded region.
- **Negative learning is not allowed.** Violations of the constraints indicate a broken fit.
- Practical tip from the paper: fit in the **three-parameter** form (`A`, `β`, `p(S)`) for "speed and
  stability", then fix `p(G)` or `p(L₀)` by external constraint to recover the fourth.

### 2.2 **Model degeneracy**
### Source: Baker, R.S.J.d., Corbett, A. T. & Aleven, V. (2008)
### Key Finding **[HIGH]**

A model is **degenerate** when **a correct answer *decreases* the mastery estimate** — behaviour
that is obviously nonsense but which unconstrained fitting produces routinely.
**If `p(G) > 0.5` or `p(S) > 0.5`, the model degenerates.**

**Three standard fixes, with their trade-offs:**

| Approach | Method | Verdict |
|---|---|---|
| Baseline | Each parameter free in [0,1] | **Suffers both degeneracy and identifiability** |
| **Bounded Guess & Slip** (Corbett & Anderson 1994; Baker et al. 2008) | **`p(G) ∈ [0, 0.3]`, `p(S) ∈ [0, 0.1]`** | **Avoids degeneracy theoretically**, but "may be inconsistent" |
| Dirichlet Priors (Beck 2007; Baker et al. 2008) | Fit a Dirichlet prior over observed parameter values | Alleviates identifiability, **but still degenerate**, plus the problem of generating the prior |

### Relevance to Learms — **decision K1: bound guess and slip, and derive the guess bound from the item format**
Use **Bounded Guess & Slip** as the default. But Learms can do better than the literature's generic
`[0, 0.3]`, because **it knows the item format**:

| Item type | Chance level | Recommended `p(G)` bound |
|---|---|---|
| 5-option MCQ (MDCAT, most Pakistani papers) | 0.20 | `[0.05, 0.30]` |
| 4-option MCQ (ACCA, Law-GAT) | 0.25 | `[0.05, 0.35]` |
| True/False | 0.50 | **Avoid — or model separately; it violates the degeneracy bound by construction** |
| Numeric / short answer | ~0 | `[0.00, 0.10]` |
| Multi-step problem | ~0 | `[0.00, 0.05]` |

**This is a genuinely better-founded guess prior than the generic bound, and it falls straight out
of data Learms already has.** Enforce `p(S) ≤ 0.1` and `p(G) ≤ 0.35` as hard clamps, and
**assert non-degeneracy in tests**: a correct response must never lower `p(L)`.

### Citation
- https://files.eric.ed.gov/fulltext/EJ1115329.pdf (van de Sande 2013, full text)
- https://jedm.educationaldatamining.org/index.php/JEDM/article/download/35/pdf_27 (same, JEDM)
- https://aquila.usm.edu/cgi/viewcontent.cgi?article=1138&context=jetde (Knowledge Tracing: A Review of Available Technologies — the three fitting approaches table)

---

## 3. Individualisation — which parameters to personalise

### Source: Corbett & Anderson (1995); Yudelson, Koedinger & Gordon (2013) [ref 129 in ACM CSUR]; ACM Computing Surveys 55(11)
### Key Finding **[HIGH]**

Standard BKT fits **one parameter set per skill, shared across all students** — its main limitation.
Extensions add student-specific parameters. The survey's comparison of five individualisation
schemes yields one clean result:

> **"Adding a student-specific parameter for `p(T)` is more beneficial for model accuracy than
> adding a student-specific parameter for `p(L₀)`."**

I.e. **learners differ more in *how fast they learn* than in *what they already knew*.**

### Relevance to Learms — **decision K2: individualise `p(T)` first, `p(L₀)` second, never `p(G)`/`p(S)`**
- `p(T)` per student × skill-family is the highest-value personalisation and is cheap.
- `p(G)` and `p(S)` should stay **item-level**, not student-level — they are properties of the
  question format and the content, and making them student-level invites degeneracy.
- A per-student learning-rate estimate is also directly useful to *show the student*: "you pick up
  organic chemistry faster than you pick up physics" is a true, motivating, non-judgemental statement.

---

## 4. How good is BKT, really?

### Key Finding **[HIGH, and sobering]**

| Model / setting | AUC | Source |
|---|---|---|
| **BKT at skill level, 51 skills (ASSISTments)** | **very low — some skills below 0.5 (worse than chance)** | BKT20y workshop proceedings |
| BKT (overall, ASSISTments 67 skill-builders) | AUC **0.5909**, MAE 0.3830, RMSE 0.4240 | BKT20y |
| **BKT-ST** (adds "same template as previous problem" as an observed binary) | AUC **0.6314**, MAE 0.3751, RMSE 0.4205 | BKT20y |
| BKT-ST advantage on skills with 5 / 10 templates | **+0.1086 / +0.0980 AUC** | BKT20y |
| BKT on English reading sub-skills, 7 sub-skills, college | AUC **0.692** | ACM 2025 |

**Two findings here matter enormously and are usually ignored:**

1. **Plain BKT can perform WORSE THAN CHANCE at the individual-skill level.** "BKT performs worse
   than chance (AUC < 0.5) on skills with eight or more templates." A mastery number that is
   worse than a coin flip, displayed confidently to a student, is an actively harmful product.
2. **BKT-ST — which does nothing more than add a binary flag for "was the previous problem from the
   same template?" — never performs worse than chance and beats BKT on every metric.** The
   mechanism: repeated items from one template are answered correctly through *pattern matching on
   surface features*, not mastery, so the model must be told when that is happening.
   BKT-ST learns **two sets of guess/slip rates**: one for same-template, one for different-template.
   Learned means across 67 skill-builders: `p(L₀) = 0.6030 (SD 0.2617)`, `p(T) = 0.2966 (SD 0.2500)`.
   Typical initialisation: `p(L₀) = 0.5`, other three = `0.1`; BKT-ST used slip = 0.2 for
   same-template.

### Relevance to Learms — **decision K3: implement BKT-ST, not plain BKT. This is the single highest-value finding in this document.**
Learms' content will be **heavily templated** — past papers repeat (see `PROBLEMS_BUSINESS.md` B4),
generated item variants share stems, MDCAT items recycle. Plain BKT will therefore systematically
**over-estimate mastery** in exactly Learms' most common situation.

Implementation: store `template_id` (or `item_family_id`) on every item; pass
`previous_item_same_template: bool` into the update; keep **two (guess, slip) pairs per skill**.
Cost: one extra column and one extra branch. Benefit: +0.04 to +0.11 AUC and the elimination of
sub-chance behaviour.

**Decision K4: do not display a mastery percentage until the estimate is trustworthy.** Require a
minimum number of opportunities *across distinct templates* before surfacing a number; before that,
show a qualitative state ("still learning"). Per `PROBLEMS_NATURAL_SCIENCES.md` N7, prefer showing
**normalized gain** over a raw mastery percentage anyway.

### Citation
- https://ceur-ws.org/Vol-1183/bkt20y2014_proceedings.pdf (BKT-ST, all figures above)
- https://dl.acm.org/doi/10.1145/3764206.3764277 (BKT for language learning, AUC 0.692)

---

## 5. BKT vs deep knowledge tracing

### Source: ACM Computing Surveys 55(11); emergentmind BKT topic review
### Key Finding **[HIGH]**

| Feature | Classical BKT | Extended / Hierarchical BKT | Deep KT (DKT etc.) |
|---|---|---|---|
| Knowledge state | Binary (Markov) | Binary + hierarchy, forgetting | **Real-valued vector** |
| Item difficulty | **No** | Yes (clustering / item params) | Often implicit |
| Slip / guess | Fixed per skill | Per item/group, learned | **Not explicit** |
| Predictive uncertainty | Implicit | **Posterior credible intervals** | **Not explicit** |
| **Interpretability** | **High** | **High — parameters have psychological meaning** | **Low / opaque** |
| Real-time adaptation | Moderate | Yes (online inference) | Limited in standard DKT |
| Multi-skill items | **No** | Supported (hierarchical/group) | Yes, in some architectures |
| Equity / fairness | Uniform policy only | Individualised adaptation possible | **Not explicitly modeled** |

### Relevance to Learms — **decision K5: BKT now, DKT never (probably)**
1. **Interpretability is a product requirement, not a nicety.** A Pakistani student who has been
   told for twelve years that they are "weak at maths" needs a system that can say *why* it thinks
   what it thinks. "Low/opaque" is disqualifying.
2. **Explicit slip/guess is required** because Learms has 5-option MCQs at 20% chance level.
   A model with no explicit guess term will read guessing as learning.
3. **Uncertainty is required** because of K4 — you must know when *not* to show a number.
4. **Fairness is explicitly unmodelled in deep KT.** For a platform serving an EMI-disadvantaged
   population where language ability and subject knowledge are confounded
   (`PROBLEMS_BUSINESS.md` B7), an opaque model is a liability.
5. Deep KT also needs far more data than Learms will have at launch.

**The one real gap:** classical BKT **cannot handle multi-skill items** — and most real exam
questions touch several KCs. Handle this with **hierarchical / group BKT**, which the survey notes
supports multi-skill mapping, rather than by jumping to a neural model. See `KNOWLEDGE_GRAPH_DEEP.md`.

---

## 6. Learms-specific design decisions

### **K6 — Timed/high-stakes failures must not depress mastery** *(carried from `PROBLEMS_NATURAL_SCIENCES.md` N3)*
Math anxiety correlates with working memory at **r = −0.40** and depresses performance *only* on
WM-loaded items under load. A student who fails a timed item may have full mastery and no working
memory left. **Anxiety ≠ ability.**
Implementation: log `context.{timed, stakes}` on every attempt. Either (a) exclude high-stakes timed
failures from the BKT update, or (b) better, **fit a separate, higher `p(S)` for timed contexts** —
which is exactly the BKT-ST mechanism generalised. A slip is, by definition, "an error despite
mastery"; anxiety-induced error *is a slip*. This is the theoretically correct place to put it.

### **K7 — Route remediation off `distractor.misconception_id`, not off `p(L)`**
*(carried from N6)* BKT tells you *whether* the learner knows the skill. The chosen distractor tells
you *what they believe instead*. Store `misconception_id` on every wrong option and branch
remediation on it. BKT chooses *when* to remediate; the misconception chooses *what to show*.

### **K8 — Separate `concept_mastery` from `expression_in_english`**
*(carried from `PROBLEMS_BUSINESS.md` B7)* Run **two BKT chains** where the response requires
English production: one over the concept KC, one over the language KC. Otherwise Learms will
diagnose a language gap as a knowledge gap for a large fraction of Pakistani students.
Conveniently, this is just "one HMM per KC" — no new machinery.

### **K9 — Mastery threshold**
Corbett & Anderson's classic threshold is `p(L) ≥ 0.95` for "mastered". Keep 0.95 as the *internal*
gate for advancing the curriculum, but see K4 for what is *displayed*.

---

## 7. Schema recommendation for Agent 1

```
knowledge_component            -- skill / KC
  id, subject_id, name, parent_id            -- hierarchy for multi-skill (K5)
  kc_type enum(concept, procedure, fact, language)

bkt_params                     -- one row per (kc, context), versioned
  kc_id
  p_l0, p_t, p_g, p_s          -- p_g, p_s CLAMPED (K1)
  p_g_same_template, p_s_same_template       -- BKT-ST (K3)
  p_g_timed, p_s_timed                       -- anxiety-as-slip (K6)
  item_format                                -- drives the p_g bound (K1)
  fitted_at, fit_method, n_observations, version

bkt_user_params                -- individualisation (K2)
  user_id, kc_family_id, p_t_user            -- p(T) ONLY. never p_g/p_s.

user_kc_state
  user_id, kc_id
  p_l                          -- current mastery estimate
  n_opportunities
  n_distinct_templates         -- gate for display (K4)
  last_updated_at
  display_ready bool

attempt                        -- append-only; shared with FSRS review_log
  user_id, item_id, kc_ids[], template_id
  correct, chosen_option_id, misconception_id     -- (K7)
  latency_ms, hints_used
  context_timed, context_stakes                   -- (K6)
  prev_item_template_id                           -- (K3)
  p_l_before, p_l_after, params_version
```

**Invariant to assert in tests:** `correct == true ⟹ p_l_after ≥ p_l_before`. If this ever fails,
the model is degenerate and the parameters are invalid (Baker et al., 2008).

---

## 8. Actionable summary

| # | Decision | Detail | Owner |
|---|---|---|---|
| **K1** | **Bound guess & slip; derive the guess bound from the item format** | `p(S) ≤ 0.1`; `p(G)` bound from 5-option/4-option/numeric. Assert non-degeneracy. | **Agent 1** |
| **K2** | Individualise **`p(T)` first**, `p(L₀)` second, **never** `p(G)`/`p(S)` | Learners differ in learning *rate*, not prior knowledge | Agent 1 |
| **K3** | **Implement BKT-ST, not plain BKT** | Plain BKT is sub-chance on templated content, which is most of Learms' content. +0.04–0.11 AUC for one column. | **Agent 1 — highest value** |
| **K4** | **Don't display mastery until it's trustworthy** | Gate on distinct templates; show qualitative state before that; prefer normalized gain | Agent 1 + 2 |
| **K5** | **BKT, not deep KT** | Interpretability, explicit guess/slip, uncertainty, fairness, small data | Agent 1 |
| **K6** | **Anxiety-induced failure = slip, not non-mastery** | Separate `(p_g, p_s)` for timed/high-stakes context | **Agent 1** |
| **K7** | Remediate off **`misconception_id`**, not `p(L)` | BKT says *when*; the distractor says *what* | Agent 1 + 2 |
| **K8** | Two chains: **concept vs English expression** | Prevents mis-diagnosing a language gap as a knowledge gap | **Agent 1** |
| **K9** | Internal mastery gate at `p(L) ≥ 0.95` | Corbett & Anderson's classic threshold | Agent 1 |
| K10 | Fit in the 3-parameter form for stability | van de Sande: faster, more stable MLE/RSS fits | Agent 1 |

## Gaps / Not found
- **No knowledge-tracing study on Pakistani students or Pakistani curricula** — the AUC figures come
  from ASSISTments (US middle-school maths) and a Chinese college English-reading dataset.
  Transferability unverified.
- **No study of BKT with bilingual learners** where language and concept are confounded — K8 is a
  reasoned design, not an evidenced one.
- Corbett & Anderson (1994/95) original paper referenced throughout but **not retrieved in full**;
  should be read directly before implementation.
- No comparison of BKT-ST against modern deep models on the same data.
- `pyBKT` (the standard open-source implementation, Baker's lab) was **not examined** — should be
  evaluated before writing an implementation from scratch.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Peer-reviewed | van de Sande, B. (2013), *JEDM* 5(2) — analytical solution, identifiability, parameter constraints | https://files.eric.ed.gov/fulltext/EJ1115329.pdf |
| Peer-reviewed (mirror) | Same, JEDM canonical | https://jedm.educationaldatamining.org/index.php/JEDM/article/download/35/pdf_27 |
| Survey | Abdelrahman, Wang & Nunes (2023), "Knowledge Tracing: A Survey", *ACM CSUR* 55(11) | https://dl.acm.org/doi/10.1145/3569576 |
| Survey | "A Survey of Knowledge Tracing: Models, Variants, and Applications" (arXiv) | https://arxiv.org/html/2105.15106v4 |
| Review | "Knowledge Tracing: A Review of Available Technologies" (JETDE) — Baseline / Bounded / Dirichlet | https://aquila.usm.edu/cgi/viewcontent.cgi?article=1138&context=jetde |
| Workshop proceedings | BKT20y (2014) — **BKT-ST results, sub-chance AUC, learned parameter means** | https://ceur-ws.org/Vol-1183/bkt20y2014_proceedings.pdf |
| Reference | Wikipedia — BKT update equations (a)–(e) | https://en.wikipedia.org/wiki/Bayesian_Knowledge_Tracing |
| Peer-reviewed | BKT for college language learning (2025), AUC 0.692 | https://dl.acm.org/doi/10.1145/3764206.3764277 |
| Review | Emergentmind — BKT capability comparison table (interpretability, fairness) | https://www.emergentmind.com/topics/bayesian-knowledge-tracing |
