# FSRS — Free Spaced Repetition Scheduler: Deep Dive

**Agent 4 — Area 8.2** · Last updated 2026-09-30
**Primary consumer: Agent 1 (Backend).** This document is intended to be implementable directly.

---

## 0. Recommendation up front

**Use FSRS. Specifically, start with FSRS-4.5 (17 parameters) using the published default weights,
and design the schema so you can move to FSRS-6 (21 parameters) later without a migration.**
Do not implement SM-2. Do not invent your own scheduler.

Rationale (all evidenced below): FSRS is ~**81% better than SM-2 on RMSE** with v4.5 defaults and
captures **98% of FSRS-6's improvement**, works well **without** per-user optimisation (which
matters enormously for a new product with no review history), and is available as permissively
licensed reference implementations in Rust, Python, TypeScript and more.

---

## 1. What FSRS is

### Topic: The DSR memory model
### Source: open-spaced-repetition project wiki (Jarrett Ye et al.); Anki implementation docs; `rs-fsrs` documentation
### Key Finding **[HIGH — open algorithm, open benchmark, open source]**

FSRS models each item's memory state with **three variables** (the **DSR model**), replacing SM-2's
single conflated "ease factor":

| Var | Meaning | Range / units |
|---|---|---|
| **D — Difficulty** | How inherently hard this item is *for this learner* | **1.0 – 10.0** |
| **S — Stability** | **Days until retrievability falls to 90%** | days, unbounded |
| **R — Retrievability** | Predicted probability of recall **right now** | 0 – 1 |

Only **D and S are stored** on the card. **R is computed on demand** from S and elapsed time.

**Why this matters (the core insight):** SM-2's ease factor "is simultaneously a measure of how hard
the card is, how stable the memory is, and how the memory responds to review timing. Three separate
phenomena, one variable." Separating them is what fixes **"ease hell"** — the SM-2 failure mode
where a card that is lapsed a few times has its ease permanently crushed and never recovers.
FSRS applies **mean reversion** to Difficulty, so after consecutive correct answers D drifts back
toward baseline. *Ease hell is eliminated architecturally, not patched.*

### Citation
- https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-fundamental-of-FSRS/8c793cefb3ec361cd6fa6ab8f750e31c3da57e8e
- https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm/5bf70e459e45152d40988c670fa7c4625b5e8577
- https://deepwiki.com/open-spaced-repetition/rs-fsrs/3.1-fsrs-algorithm-overview
- https://www.mindomax.com/spaced-repetition-algorithms

---

## 2. The formulas (implementable)

### 2.1 Forgetting curve

**FSRS v1–v3 (exponential):**
```
R(t, S) = 0.9 ^ (t / S)
```

**FSRS v4 (power law):**
```
R(t, S) = (1 + t / (9·S)) ^ -1
```

**FSRS-4.5 / 5 / 6 (generalised power law) — USE THIS:**
```
R(t, S) = (1 + FACTOR · t / S) ^ DECAY
```
with `FACTOR` and `DECAY` chosen (4.5/5) or **trainable** (6) such that **R = 0.9 exactly when
t = S**, by construction. In FSRS-6 the decay rate `C` is the 21st trainable parameter and is
**personalised per user** — this is the headline FSRS-6 change.

> **Power law beats exponential.** The `(1 + kx)^(-0.5)`-shaped power-law curve has been shown to
> model human forgetting more accurately than an exponential. This is one of the main reasons FSRS
> outperforms SM-2.

### 2.2 Interval calculation
Invert the forgetting curve for the desired retention `r*`:
```
I = (S / FACTOR) · ( r*^(1/DECAY) − 1 )
```
i.e. **schedule each card for the exact moment its predicted recall hits your retention target.**
This is the whole point: *"no sooner and no later."*

### 2.3 Grades
```
G ∈ {1: Again, 2: Hard, 3: Good, 4: Easy}
```

### 2.4 Initial state (FSRS v4/4.5)
```
S₀(G) = w[G−1]                       # w0..w3 are the four initial stabilities
D₀(G) = w4 − (G − 3) · w5            # D₀(3) = w4 when the first rating is "Good"
```

### 2.5 Difficulty update (with mean reversion — the anti-ease-hell mechanism)
```
D' = D − w6 · (G − 3)
D_new = w7 · D₀(3) + (1 − w7) · D'
D_new = clamp(D_new, 1, 10)
```

### 2.6 Stability after a successful recall
```
S'_r(D, S, R) = S · ( e^(w8) · (11 − D) · S^(−w9) · ( e^(w10·(1−R)) − 1 ) + 1 )
```
*(FSRS v3 form shown for readability — indices shift between versions; take exact indices from the
reference implementation, do not retype them.)*

Three behaviours fall out of this formula and they are the pedagogically important part:
1. **Harder items (high D) get smaller stability boosts.**
2. **Already-stable items get proportionally smaller boosts** — *stabilization decay*.
3. **Items reviewed at LOWER retrievability (closer to being forgotten) get LARGER boosts** —
   which is exactly what **Bjork's desirable-difficulties** framework predicts. FSRS independently
   reproduces a core result of the cognitive-psychology literature. **[Strong convergent validity.]**

### 2.7 Stability after a lapse (post-lapse stability)
```
S'_f(D, S, R) = w11 · D^(−w12) · ((S + 1)^(w13) − 1) · e^(w14·(1−R))
```

### 2.8 Same-day review (FSRS-5+)
```
S'(S, G) = S · e^( w17 · (G − 3 + w18) )
```

### Citation
- https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm/5bf70e459e45152d40988c670fa7c4625b5e8577 (all versions, all formulas)
- Interactive playground: https://www.geogebra.org/calculator/ahqmqjvx

---

## 3. Version history and which to pick

| Version | Params | Key change |
|---|---|---|
| v1 | 7 | D, S **and Lapses** as state |
| v2 | 14 | Mean reversion on D introduced |
| v3 | 13 | Cleaner initial-state formulas |
| v4 | 17 | **Power-law forgetting curve** |
| **v4.5** | **17** | Curve refined so R=0.9 at t=S by construction |
| v5 | 19 | Same-day review handling |
| **v6** (2025) | **21** | **Per-user trainable decay** |

### Benchmark results **[HIGH — public benchmark, ~700M+ reviews, ~10k users, `anki-revlogs-10k`]**

| Algorithm | Log Loss | RMSE | Improvement vs SM-2 |
|---|---|---|---|
| SM-2 (Anki default) | 0.7317 | 0.4066 | — |
| **FSRS v4.5** | **0.3624** | **0.0764** | **~81%** |
| FSRS v6 | 0.3460 | 0.0653 | ~84% |

- **FSRS needs roughly 20–30% fewer reviews than SM-2 for the same retention rate**
  (Anki team benchmark over 500M+ review logs).
- **v4.5 captures ~98% of v6's benefit** (3% RMSE difference) with **fewer parameters, no same-day
  complexity, deterministic behaviour, and widely-deployed stable defaults.**

### Relevance to Learms — **decision F1: ship FSRS-4.5 first**
For a product with **zero review history**, "works excellently without requiring parameter
optimization" is worth more than the last 3% of RMSE. Ship 4.5 defaults; revisit v6 once you have
users with ~1,000+ reviews each.

### Citation
- https://www.npmjs.com/package/@squeakyrobot/fsrs (benchmark table)
- https://studyglen.com/guides/best-spaced-repetition-apps (20–30% fewer reviews)
- https://www.antiagent.io/blog/fsrs-vs-sm-2 (700M review benchmark)

---

## 4. Parameter optimisation

### Key Finding **[HIGH]**
- Parameters are trained from review history with **Backpropagation Through Time (BPTT)** +
  **Maximum Likelihood Estimation**, originally in PyTorch.
- The likelihood being maximised:
  `P(r=1, t, r⃗ᵢ₋₁, t⃗ᵢ₋₁ | θ⃗) = exp( −t / DSR(r⃗ᵢ₋₁, t⃗ᵢ₋₁) )`
- The trick that makes it work: raw logs record **ratings, not stability**. Stability is a latent
  statistical variable over reviews sharing a history. MLE recovers it **end to end** from the raw
  time series.
- **Per-user optimisation typically needs ~1,000 reviews.** Below that, use the defaults.
- Default weights were trained on ~700 million reviews from ~10,000 users.
- Anki exposes three relevant operations, which are a good API shape to copy:
  `ComputeFsrsParams` (train from history), `ComputeMemoryState` (D/S for one card),
  `ComputeOptimalRetention` (find the retention target that **minimises workload**).

### Relevance to Learms — **decision F2: optimise per *cohort* before per *user***
Learms will have a cold-start problem per user but **not** per content domain. Recommendation:
1. Ship global FSRS-4.5 defaults.
2. Once there is volume, train **per-subject / per-content-type parameter sets** (MDCAT biology
   facts behave differently from Urdu vocabulary, which behaves differently from physics formulae).
   This is a legitimate and underused use of FSRS — the library supports "optimized for individual
   learners **or specific content types**."
3. Only then train per-user, gated on ≥1,000 reviews, falling back to the cohort set.

Store `fsrs_param_set_id` on the review record so historical scheduling is explainable.

---

## 5. Desired retention — a product lever, not a constant

### Key Finding **[HIGH]**
Unlike SM-2, FSRS takes **desired retention as an explicit input** (default 0.9). Lower retention →
longer intervals → fewer reviews → more forgetting. Anki ships `ComputeOptimalRetention` because
there is a **workload-minimising** retention level that differs per user and per deck.

### Relevance to Learms — **decision F3: bind desired retention to the exam date**
This is the single most valuable FSRS feature for a Pakistani exam-prep product, and almost nobody
uses it well:
- **Far from the exam** (>6 months): retention 0.85 → fewer reviews, cheaper maintenance, more time
  for new material.
- **Approaching the exam** (<8 weeks): retention 0.92–0.95 → tighter intervals, everything fresh.
- **Post-exam / maintenance**: 0.80.

Because MDCAT is **70% recall** (see `PROFESSIONAL_CERTIFICATIONS.md`), the exam-date-conditioned
retention target is directly and measurably tied to the outcome the student cares about. Expose it
as **"exam date"**, never as a retention slider.

---

## 6. Where FSRS is the WRONG tool

**[Important — do not over-apply this.]**
FSRS schedules **retrieval of discrete items**. It says nothing about whether the learner
*understands* anything. Per `PROBLEMS_NATURAL_SCIENCES.md` N9:

| Use FSRS heavily | Use FSRS lightly or not at all |
|---|---|
| Biology terminology and facts | Physics conceptual understanding |
| MDCAT recall items | Engineering problem-solving |
| Urdu/English vocabulary | Legal reasoning (IRAC) |
| Formulae, drug names, anatomy | Programming (needs the notional machine, not recall) |
| ACCA/CA definitions, standards | Design, critique, writing |

**FSRS ≠ knowledge tracing.** FSRS answers *"when should I show this item again?"*. BKT/DKT answer
*"does the learner know this skill?"*. Learms needs **both**, and they must be separate subsystems
sharing an event log. See `BKT_DEEP.md`.

Also note `PROBLEMS_MEDICAL.md` **M4**: sleep and screen time are two of the three measured
predictors of distress in Pakistani students. **Never let the scheduler stack a large review queue
late at night.** Anki's **load balancing** and **"easy days"** features exist for exactly this and
should be treated as mandatory, not optional.

---

## 7. Implementation options

| Language | Package | Notes |
|---|---|---|
| Rust | `fsrs` crate / `rs-fsrs` | The reference used by Anki itself; `fsrs-rs` adds training |
| Python | `fsrs` (open-spaced-repetition) | Easiest for the optimiser / batch jobs |
| TypeScript | `ts-fsrs`, `@squeakyrobot/fsrs` | Edge-runtime ready (Cloudflare Workers, Vercel Edge, Deno) |

`@squeakyrobot/fsrs` notes two useful extras: **continuous grading** (1.0–4.0, not just 1–4) and
**auto-rating from response time**. Both are attractive for Learms, where a 4-button Again/Hard/
Good/Easy self-rating is a poor fit for MCQ-based Pakistani exam prep — **the student answers a
question; they don't rate their own memory.**

### **Decision F4: derive the grade, don't ask for it.**
Map objective outcomes to FSRS grades, e.g.:
```
wrong                              → 1 (Again)
correct but slow / after a hint    → 2 (Hard)
correct, normal latency            → 3 (Good)
correct, fast, first try, no hint  → 4 (Easy)
```
Calibrate latency thresholds per item from observed data, not a global constant. Log the raw
signals (`correct`, `latency_ms`, `hints_used`, `attempts`) so the mapping can be retuned later
without losing history.

### Known deployment costs **[MED — from a comparison article, but plausible]**
"More state, evolving formulas, an optimizer workflow, and possible conflicts with add-ons that
modify scheduling." For Learms the real costs are: (a) you must store per-card D/S and a full review
log forever, (b) the optimiser is a batch job needing its own infrastructure, (c) formula versions
change, so **version-stamp every scheduling decision**.

---

## 8. Schema recommendation for Agent 1

```
card_memory_state
  user_id, item_id
  stability            float   -- days
  difficulty           float   -- 1..10
  last_review_at       timestamptz
  due_at               timestamptz
  state                enum(new, learning, review, relearning)
  reps                 int
  lapses               int
  fsrs_version         text    -- '4.5' | '6'
  param_set_id         uuid    -- FK → fsrs_param_set (global | subject | user)
  desired_retention    float   -- resolved at schedule time

review_log             -- APPEND ONLY. never delete. the optimiser needs all of it.
  user_id, item_id, reviewed_at
  grade                smallint  -- 1..4, derived (see F4)
  correct              bool
  latency_ms           int
  hints_used           int
  attempt_number       int
  elapsed_days         float
  scheduled_days       float
  stability_before, difficulty_before, retrievability_before
  context_timed        bool      -- see PROBLEMS_NATURAL_SCIENCES.md N3
  context_stakes       text
  fsrs_version, param_set_id
```
The `review_log` is the most valuable data asset Learms will ever own. **Treat it as append-only
from day one** — FSRS parameter optimisation is retrospective and irreversibly damaged by deletion.

---

## 9. Actionable summary

| # | Decision | Detail | Owner |
|---|---|---|---|
| **F1** | **Ship FSRS-4.5 with default weights** | 81% better than SM-2, 98% of v6's benefit, no training needed | **Agent 1** |
| **F2** | Optimise **per content-type/subject before per-user** | Per-user needs ~1,000 reviews; per-subject solves cold start | Agent 1 |
| **F3** | **Bind desired retention to the exam date** (0.85 → 0.95) | Expose as "exam date", never a retention slider | **Agent 1 + 2** |
| **F4** | **Derive the grade from objective signals**, don't ask | MCQ product, not a flashcard app | **Agent 1** |
| F5 | **Append-only `review_log`** with full context | The optimiser is retrospective; deletion is unrecoverable | **Agent 1** |
| F6 | Mandatory **load balancing + quiet hours** | Sleep is a measured distress predictor (`PROBLEMS_MEDICAL.md` M4) | Agent 1 |
| F7 | **Apply FSRS selectively by subject** | Heavy for biology/vocab/facts; light for physics/engineering/law | Agent 2 |
| F8 | **FSRS ≠ knowledge tracing** | Keep the scheduler and the mastery model as separate subsystems | Agent 1 |
| F9 | Version-stamp every scheduling decision | Formulas change between versions; you need explainability | Agent 1 |
| F10 | Design the schema for 17→21 params now | Avoids a migration when moving to FSRS-6 | Agent 1 |

## Gaps / Not found
- **No study of FSRS (or spaced repetition generally) with Pakistani students** or in an
  Urdu/English bilingual context. The 20–30% efficiency gain is from a self-selected, global,
  heavily-Anki-using population — **almost certainly not representative of a Pakistani MDCAT
  cohort.** Treat the magnitude as unverified for this population.
- The original KDD paper for FSRS was referenced but not retrieved in this pass — **should be read
  directly before implementation.**
- No evidence on FSRS performance with **derived** grades (F4) rather than self-reported ones.
  This is a real unknown in the recommended design and should be monitored.
- `ComputeOptimalRetention`'s workload model was not examined in detail.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Primary (algorithm) | open-spaced-repetition — The Algorithm (all versions, all formulas) | https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm/5bf70e459e45152d40988c670fa7c4625b5e8577 |
| Primary (algorithm) | fsrs4anki wiki — The fundamental of FSRS (BPTT + MLE training) | https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-fundamental-of-FSRS/8c793cefb3ec361cd6fa6ab8f750e31c3da57e8e |
| Implementation docs | `rs-fsrs` algorithm overview (power-law curve, 19 weights, code mapping) | https://deepwiki.com/open-spaced-repetition/rs-fsrs/3.1-fsrs-algorithm-overview |
| Implementation docs | Anki FSRS scheduler implementation (RPC surface, memory state) | https://deepwiki.com/ankitects/anki/4.1-fsrs-scheduler-implementation |
| Benchmark | `@squeakyrobot/fsrs` — Log Loss / RMSE table, v4.5 vs v6 | https://www.npmjs.com/package/@squeakyrobot/fsrs |
| Analysis | Mindomax — SM-0→SM-20 history, ease hell, DSR convergence | https://www.mindomax.com/spaced-repetition-algorithms |
| Analysis | Anti-Agent — 700M-review public benchmark | https://www.antiagent.io/blog/fsrs-vs-sm-2 |
| Analysis | StudyGlen — 20–30% fewer reviews; app landscape | https://studyglen.com/guides/best-spaced-repetition-apps |
| Analysis | SmartRecallAI — deployment complexity, comparison table | https://smartrecallai.com/blog/sm2-vs-fsrs-vs-leitner-vs-anki-2026 |
