# Wellness — Safe Everyday Design and Language

**Agent 4 — Area 11.1** · Last updated 2026-09-30
**Primary consumers: Agent 3 (logic), Agent 2 (copy).**

Scope: everything *below* the crisis threshold — the everyday wellness surface. Crisis handling is
specified separately and more strictly in **`WELLNESS_CRISIS.md`, which takes precedence wherever
the two touch.**

---

## 1. Design principles from the mental-health-chatbot checklist

### Source: "A Checklist for Trustworthy, Safe, and User-Friendly Mental Health Chatbots" (arXiv, Jan 2026) — literature review + thematic analysis
### Key Finding **[MED — preprint; but it synthesises a real literature and is operationally useful]**

The checklist spans **transparency, boundary setting, contextual relevance, user-friendliness,
meaningful conversations, safety and ethics, diversity and inclusivity, and trust-building.**
The items that translate directly into Learms requirements:

| Checklist item | Learms implementation |
|---|---|
| **Set boundaries.** "Make clear what types of situations the chatbot can handle and direct users to appropriate resources or professionals when necessary." | A visible, plain-language scope statement on every wellness surface. Not buried in terms. |
| **Explicitly convey uncertainty.** Framing and presentation "can help calibrate user trust and reliance." | Never state a wellness inference as fact. See §2. |
| **Protect data.** "Ensure user data is kept confidential and not exploited." | Wellness data never trains a model, never leaves the wellness store, never appears in exports. |
| **Avoid speculative or potentially harmful responses during crises.** | Fixed copy only (`WELLNESS_CRISIS.md` W3). |
| **Avoid hallucination in unfamiliar situations; direct to professional support.** | Refuse-and-route is the correct default, not a failure. |
| **Be clinically informed, robust and relevant.** | Everything user-visible reviewed by a qualified Pakistani professional. |
| **Diversity and inclusivity.** | Urdu-first option; culturally congruent coping; no Western-default assumptions about family or therapy. |

### Citation
- https://arxiv.org/html/2601.15412v1

---

## 2. Language rules (binding)

These come from `PROBLEMS_MEDICAL.md` M9, `PROBLEMS_SOCIAL_SCIENCES.md`, and the uncertainty
guidance above. They are copy requirements, not suggestions.

**Never say / Always say**

| ❌ Never | ✅ Instead |
|---|---|
| "You have depression / anxiety." | "These answers **screen positive for symptoms** of low mood. A screening is not a diagnosis." |
| "You're burnt out." | "Your study pattern over the last two weeks looks heavier than usual." |
| "Your classmates are doing better." | *(nothing — never compare to peers)* |
| "Your parents will see your progress." | *(nothing — never invoke family observation)* |
| "You're falling behind." | "There's more left than there was. Here's the smallest next step." |
| "Don't worry." | "That sounds genuinely hard." |
| "I understand how you feel." | "I'm a program, so I can't really know — but what you're describing is common and it matters." |
| "Talk to me, I'm here for you." | "I can point you to people who can actually help." |
| Streak-loss shaming ("You lost your 40-day streak!") | "Welcome back." |

**Rationale, sourced:**
- Diagnostic language is unsupportable — the Pakistani prevalence literature is *symptom screening*
  with high heterogeneity and explicitly lacks culturally validated instruments
  (`PROBLEMS_SOCIAL_SCIENCES.md` §1).
- **Family expectations are a named stressor** in Pakistani student distress
  (`PROBLEMS_MEDICAL.md`), so family-comparison framing is actively harmful.
- **Peer pressure is one of the three top measured predictors** (Siddiqui, n=1,630). Leaderboards
  and peer comparison on wellness-adjacent surfaces are contraindicated by the data.
- **"I am a machine" disclosure** and avoidance of simulated intimacy follow directly from the
  companionship–alienation paradox (`WELLNESS_CRISIS.md` §3).

---

## 3. Prevention is the product

**The most defensible wellness feature Learms can build is not a wellness feature. It is a
workload feature.**

The three top measured predictors of distress in Pakistani medical students are **peer pressure,
poor sleep, and screen time** [Siddiqui et al., n=1,630]. Learms directly controls two of them and
influences the third. Concretely:

| Mechanism | Feature | Source |
|---|---|---|
| **Sleep** | Quiet hours **on by default**; never schedule or notify a large review queue late at night; FSRS load balancing is mandatory, not optional | `PROBLEMS_MEDICAL.md` M4; `FSRS_DEEP.md` F6 |
| **Screen time** | Session-length caps; a genuine "you're done for today" state; **no infinite feed** | M4 |
| **Peer pressure** | **No public leaderboards.** No visible peer comparison. Progress is private by default. | Siddiqui; `UNIVERSITY_COURSES.md` C7 |
| **Academic pressure** (clean monotonic dose–response with distress) | Overload detection from Learms' own workload data; proactive "this plan is unrealistic" honesty | `PROBLEMS_SOCIAL_SCIENCES.md` S3 |
| **Punitive gamification** | **No punitive streaks.** Streaks may reward, never punish. | M4 |
| Transition periods | Extra support at Year 1 and Year 3 | M7 |

This reframing matters commercially too: it is buildable by Agent 1 without clinical sign-off,
carries no crisis liability, and reduces the number of crises Learms ever has to handle.

---

## 4. What Learms may legitimately offer

Ranked by evidence and by safety:

1. **Workload and sleep protection** (above) — strongest, safest, no clinical review needed.
2. **Paced breathing / nervous-system reset** — "Stop, Drop and Roll": stop escalating actions,
   drop into sleep, cold water, or paced breathing [Psychiatric Times, 2026]. Simple, evidence-based,
   no model required.
3. **Safety planning and Caring Contacts-style check-ins** — established suicide-prevention
   practice, explicitly recommended for AI developers to draw on. **Requires clinical review.**
4. **Lived-experience survival stories from Pakistani students** — "can help break the isolation
   and tunnel vision of crisis". Culturally resonant. **Requires careful curation and review** so
   they do not become unsafe portrayals.
5. **Religiously-framed coping, opt-in** — religion is the *most common* documented coping strategy
   among Pakistani students [JPMA review]. Offering it is meeting users where they are. **Must be
   opt-in, must be expert-reviewed, must never be imposed**, and must not assume a single tradition.
6. **Connection prompts toward real people** — belonging is "among the most reliable lifelines"
   [CMAJ, 2026]. Nudging a student toward a friend, family member, teacher or imam is better
   supported than anything Learms can say itself.

## 5. What Learms must not offer

- A companion, persona, named "therapist", or any relationship-simulating agent.
- Diagnosis, clinical claims, or symptom tracking presented as assessment.
- Engagement-optimised wellness surfaces. **Engagement optimisation is the documented root cause of
  the harms in §3 of `WELLNESS_CRISIS.md`.**
- Free-form LLM generation on any wellness surface.
- Anything that makes a distressed user *more* likely to stay in the app rather than reach a human.

---

## 6. Actionable summary

| # | Decision | Owner |
|---|---|---|
| **WS1** | **Prevention over intervention**: quiet hours, session caps, load balancing, overload detection | **Agent 1** |
| **WS2** | **No public leaderboards or peer comparison anywhere** | **Agent 2** |
| **WS3** | **No punitive streaks**; streaks reward only | Agent 2 |
| **WS4** | **Screening language only** — never diagnostic, never family-comparative | **Agent 2** |
| **WS5** | **Visible scope statement** on every wellness surface | Agent 2 |
| **WS6** | **Explicitly convey uncertainty** in every inference | Agent 2 |
| **WS7** | Offer breathing/reset, safety planning, Caring Contacts, lived-experience stories, opt-in faith-based coping — all **clinician-reviewed** | Agent 3 |
| **WS8** | **Route toward real people**; belonging is the protective factor | Agent 3 |
| **WS9** | **No companion, no persona, no free-form generation** | All |
| **WS10** | Wellness data never trains a model, never exports, never surfaces to third parties | **Agent 1** |

## Gaps / Not found
- **No validated Urdu screening instrument confirmed.** AKUADS (Aga Khan University Anxiety and
  Depression Scale) is Pakistan-developed and a promising candidate — **not researched**. The
  2025 meta-analysis explicitly calls for "culturally competent mental health assessment
  instruments", implying none is standard.
- No evidence on whether any of these interventions work with Pakistani students.
- No Pakistani clinician has reviewed anything in this document. **That review is a prerequisite
  to shipping, not a nice-to-have.**
- The distinction between "discouraged" and "confused" (`SOCRATIC_DEEP.md` SO8) sits exactly at
  the boundary of this document and has no evidence base for how to act on it.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Preprint (checklist) | arXiv (2026) — A Checklist for Trustworthy, Safe, and User-Friendly Mental Health Chatbots | https://arxiv.org/html/2601.15412v1 |
| Clinical interview | *Psychiatric Times* (2026) — Stop/Drop/Roll, Caring Contacts, lived-experience stories | https://www.psychiatrictimes.com/view/making-chatbots-safe-for-suicidal-patients |
| Peer-reviewed | *CMAJ* (2026) — belonging as protective factor; transparency requirements | https://pmc.ncbi.nlm.nih.gov/articles/PMC13102457/ |
| Cross-ref | `PROBLEMS_MEDICAL.md`, `PROBLEMS_SOCIAL_SCIENCES.md`, `WELLNESS_CRISIS.md` | — |
