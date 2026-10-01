# LLM API Comparison — Cost, Limits and Model Selection for Learms

**Agent 4 — Area 12.1** · Last updated 2026-09-30
**Primary consumer: Agent 1 (Backend).**

> ⚠ **Volatile data.** LLM pricing changed materially several times during 2026 and a scheduled
> price *doubling* lands on **1 January 2027**. Every figure below carries its observation date.
> **Re-verify against the provider's own pricing page before committing to a cost model.**

---

## 1. Rate card (observed September 2026, USD per 1M tokens)

### Source: Fello AI Gemini pricing guide (2026-09-23); Maxim AI (2026-09-12); MetaCTO (2026-06-11); CloudInsight (2026-09-02)
### Key Finding **[MED — secondary aggregators, mutually corroborating; primary provider pages not fetched]**

| Model | Provider | Input | Output (incl. thinking) | Cached input | Context |
|---|---|---|---|---|---|
| **Gemini 2.5 Flash-Lite** | Google | **$0.10** (audio $0.30) | **$0.40** | $0.01 | 1M |
| **Gemini 3.1 Flash-Lite** | Google | **$0.25** (audio $0.50) | **$1.50** | $0.025 | 1M |
| Gemini 2.5 Flash | Google | $0.30 (audio $1.00) | $2.50 | $0.03 | 1M |
| Gemini 3.5 Flash-Lite | Google | $0.30 | $2.50 | $0.03 | 1M |
| Gemini 3 Flash Preview | Google | $0.50 (audio $1.00) | $3.00 | $0.05 | 1M |
| **Gemini 3.6 / 3.7 / 3.8 Flash** | Google | **$0.75** | **$3.75** | $0.075 | 1M |
| Gemini 3.1 Pro Preview | Google | $2.00 (≤200K) / $4.00 (>200K) | $12.00 / $18.00 | $0.20 / $0.40 | — |
| **GPT-5 Nano** | OpenAI | **$0.05** | **$0.40** | — | — |
| GPT-5 Mini | OpenAI | $0.25 | $2.00 | — | — |
| GPT-5.4-mini | OpenAI | $0.75 | $4.50 | — | — |
| Claude Haiku 4.5 | Anthropic | $1.00 | $5.00 | $0.10 | — |

### ⚠ The pricing cliff
**Gemini 3.6, 3.7 and 3.8 Flash all double on 1 January 2027** — $0.75 → $1.50 input,
$3.75 → $7.50 output, and cached input $0.075 → $0.15. Current rates are *introductory*.
**Any cost model built on the current Flash rate is wrong from January.**

⚠ **Also note:** Gemini **output pricing includes thinking tokens**. A reasoning-heavy prompt can
cost several times the naive estimate. Budget output tokens pessimistically.

### Citation
- https://felloai.com/gemini-pricing/
- https://www.getmaxim.ai/articles/gemini-api-pricing-in-2026-and-how-to-cut-what-you-pay/
- https://www.metacto.com/blogs/the-true-cost-of-google-gemini-a-guide-to-api-pricing-and-integration
- https://cloudinsight.cc/en/blog/ai-api-pricing-comparison

---

## 2. Free tiers

| Feature | Gemini (Free) | OpenAI ($5 credit) | Claude ($5 credit) |
|---|---|---|---|
| RPM | **5–15** | 500 (Tier 1) | 50 (Tier 1) |
| RPD | **100–1,000** | 10,000 | 1,000 |
| TPM | **250,000** | 200,000 | 40,000 |
| Context window | **1M tokens** | 128K | 200K |
| Free models | 5 (3 stable + 2 preview) | GPT-4o, 4o-mini | Sonnet, Haiku |
| **Duration** | **Unlimited, no credit card** | 3 months | 30 days |

Gemini free-tier per-model limits: 2.5 Pro **5 RPM / 100 RPD**; 2.5 Flash **10 RPM / 250 RPD**;
**2.5 Flash-Lite 15 RPM / 1,000 RPD** — all at 250,000 TPM and 1M context.

⚠ **The free tier's real price:** "your data may be used to improve Google products on the free
tier." **Tier 1 (billing account linked, no minimum spend) does NOT use your data for training**,
and unlocks 150–300 RPM plus **context caching and the Batch API**.

### Relevance to Learms — **decision AP1: go to Tier 1 immediately, even at near-zero spend**
For an education product handling minors' work, wellness-adjacent signals, and Pakistani students'
personal data, **training on user data is not acceptable**. Tier 1 costs nothing extra at low
volume, removes the training clause, and unlocks the two features that actually control cost
(caching and batch). *The free tier is for prototyping only.*

### Citation
- https://www.aifreeapi.com/en/posts/gemini-api-free-tier-complete-guide

---

## 3. Worked costs

**A 50-page PDF (100,000 input + 2,000 output tokens)** — directly relevant to past-paper and
textbook ingestion:

| Model | Cost per run |
|---|---|
| Gemini 3.6 Flash | **$0.165** |
| Gemini 2.5 Flash-Lite | **$0.011** |

**15× cheaper.** At Learms' likely ingestion scale (thousands of past papers), that is the
difference between a rounding error and a real line item.

**A high-volume generation workload** (aggregator's worked example, 3M input / 1.2M output per day
scale): Gemini 2.5 Flash ≈ **$16.20/month** at one scale; at 10× volume, 2.5 Flash-Lite ≈
**$348/month**, falling to **~$174/month with the Batch API** — a **50% saving**.

### Relevance to Learms — sanity check against the market
Pakistani telecom ARPU is **PKR 306/month ≈ USD 1.10** (`PAKISTAN_SOLUTIONS.md` P7). If a paying
Learms user is worth on the order of a dollar a month, **the inference budget per active user must
land in cents, not dollars.** That single constraint drives every recommendation below.

---

## 4. Cost-control levers, ranked by impact for Learms

| # | Lever | Saving | Learms fit |
|---|---|---|---|
| **1** | **Route by task to the cheapest adequate model** | up to **15×** | The biggest lever by far. See AP2. |
| **2** | **Batch API for anything not user-facing** | **~50%** | Content generation, past-paper ingestion, item tagging, nightly FSRS/BKT jobs — all batchable |
| **3** | **Context caching** | cached input is **1/10** of fresh input | Huge for Learms: the same syllabus/textbook context is re-sent constantly. **⚠ But see the trap below.** |
| **4** | **Don't use Priority tier on Vertex** | Priority costs **+80%** | "Guaranteed throughput most apps do not require" |
| **5** | Cap output tokens; avoid reasoning where not needed | output is 4–5× input price, and *includes thinking tokens* | |

### ⚠ The context-caching trap
Caching has **two meters**: a cheap read rate ($0.075/M on 3.8 Flash) **and a storage rate**
($0.50–$1.00 per 1M tokens **per hour**, $4.50/hr on 3.1 Pro). **"A cache that is written and
rarely read is a net loss."**
→ Only cache contexts with **high read-to-write ratios**: a shared syllabus, a frequently-used
textbook chapter, a system prompt. **Never cache per-user context.** Compute the break-even read
count before enabling it anywhere.

---

## 5. Recommended model routing for Learms

**Decision AP2 — a routing table, not a model choice.** Most of Learms' LLM work is cheap
classification and templated generation, not reasoning. Default to the cheapest tier and escalate
only on evidence.

| Task | Recommended tier | Why |
|---|---|---|
| Item tagging, KC mapping, misconception classification | **Gemini 2.5 Flash-Lite** ($0.10/$0.40) | Classification. The aggregator's own advice: "Try 2.5 Flash-Lite for ultra-cheap classification." |
| Past-paper / PDF ingestion (batch) | **2.5 Flash-Lite + Batch API** | $0.011 vs $0.165 per 50-page PDF, then −50% |
| Urdu ⇄ English explanation generation (batch, cached, reviewed) | 2.5 Flash-Lite → escalate if quality fails | Generate offline, human-review, store. **Never at request time.** |
| Short-answer / free-recall grading | **2.5 Flash or 3.1 Flash-Lite** | Quality matters — it feeds the BKT chain. Worth a tier up. |
| Step-level hint generation | **Pre-authored, not generated** | See AP3 |
| Socratic dialogue | **Not built** | `SOCRATIC_DEEP.md` SO3 — sub-step dialogue measured 0.40 vs step-based 0.76 |
| Wellness-adjacent text | **Never free-form generated** | `PROBLEMS_MEDICAL.md` M9, `PROBLEMS_SOCIAL_SCIENCES.md` S4 — must be reviewed, fixed copy |

### **Decision AP3 — generate offline, serve static. This is the central architectural recommendation.**
The research already points here from three independent directions:
1. **Pedagogically**, the gain is in *step-level structure* (0.76), which is **authored**, not
   generated (`SOCRATIC_DEEP.md` SO2–SO3).
2. **Economically**, per-user-per-request inference cannot fit inside a ~USD 1/month ARPU.
3. **Operationally**, Pakistani network quality is 28 Mbps below average
   (`PAKISTAN_SOLUTIONS.md` P2) — a synchronous LLM round trip is a bad interaction there.

→ **Use the LLM as a content *factory* (batch, cached, human-reviewed, stored), not as a runtime
*oracle*.** Generate hints, explanations, distractor rationales and bilingual variants offline;
serve them as static, cacheable, reviewable content. This also makes the product auditable, which
matters for a system that will be used by minors preparing for high-stakes exams.

Reserve runtime inference for the few things that genuinely require it: grading a free-text answer,
and handling a novel student question.

### **Decision AP4 — build a provider abstraction on day one.**
Given prices doubled/halved repeatedly through 2026 and another doubling lands 2027-01-01, **do not
couple to one vendor's SDK.** Route through a thin internal interface with per-task model
selection in configuration, log `model_id` and token counts on every call, and keep a
cost-per-active-user dashboard from the first week.

---

## 6. Actionable summary

| # | Decision | Detail | Owner |
|---|---|---|---|
| **AP1** | **Tier 1 immediately, never the free tier in production** | Free tier may train on user data. Tier 1 has no minimum spend and unlocks caching + Batch. | **Agent 1** |
| **AP2** | **Route by task; default to the cheapest tier** (2.5 Flash-Lite, $0.10/$0.40) | Up to 15× on the same job. Most Learms tasks are classification, not reasoning. | **Agent 1** |
| **AP3** | **LLM as content factory, not runtime oracle** — generate offline, human-review, serve static | Converges from pedagogy, economics and network quality simultaneously | **Agent 1 + 2** |
| **AP4** | **Provider abstraction + per-call token/cost logging from day one** | Prices doubled and halved repeatedly in 2026; another doubling on 2027-01-01 | **Agent 1** |
| AP5 | **Batch API for everything non-interactive** | ~50% saving; ingestion, tagging, generation, nightly jobs | Agent 1 |
| AP6 | **Cache only high-read-ratio contexts**; compute break-even first | Storage is charged **per hour**; a rarely-read cache is a net loss | Agent 1 |
| AP7 | **Budget output tokens pessimistically** | Output is 4–5× input, and Gemini bills thinking tokens as output | Agent 1 |
| AP8 | **Target inference cost in cents per active user per month** | Telecom ARPU is ~USD 1.10/month; that's the willingness-to-pay ceiling | Product |
| AP9 | Never use Vertex Priority tier | +80% for throughput guarantees Learms doesn't need | Agent 1 |
| AP10 | **Re-verify all pricing before committing** | These figures are from secondary aggregators and expire 2027-01-01 | Agent 1 |

## Gaps / Not found
- **Provider primary pricing pages were not fetched** — all figures are from secondary aggregators
  (four, mutually consistent). **Must be verified against ai.google.dev, openai.com/pricing and
  anthropic.com/pricing before any commitment.**
- **No quality benchmarks** retrieved — this document compares *price only*. Whether Gemini 2.5
  Flash-Lite is adequate for Urdu explanation generation or short-answer grading is **completely
  unevidenced** and must be tested empirically.
- **No data on any model's Urdu capability**, which is central to the bilingual thesis
  (`PROBLEMS_BUSINESS.md` B5). **This is a P0 gap — added to `GAPS.md`.**
- Open-weight/self-hosted options (Llama, Qwen, Gemma) were **not researched**; at Pakistani price
  points, self-hosting a small model may beat any API. Worth a dedicated pass.
- Regional availability, latency from Pakistan, and data-residency constraints: **not researched**.
- OpenAI and Anthropic caching/batch discounts were not examined in the same detail as Google's.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Aggregator | Fello AI — Gemini pricing 2026, full model table, Jan 2027 price rise | https://felloai.com/gemini-pricing/ |
| Aggregator | Maxim AI — Gemini pricing 2026, caching two-meter trap, thinking tokens | https://www.getmaxim.ai/articles/gemini-api-pricing-in-2026-and-how-to-cut-what-you-pay/ |
| Aggregator | MetaCTO — Gemini API pricing May 2026, free vs paid tiers, competitor table | https://www.metacto.com/blogs/the-true-cost-of-google-gemini-a-guide-to-api-pricing-and-integration |
| Aggregator | CloudInsight — OpenAI/Claude/Gemini comparison, 50-page PDF worked example | https://cloudinsight.cc/en/blog/ai-api-pricing-comparison |
| Aggregator | AIFreeAPI — Gemini free-tier rate limits, Tier 1 data-privacy difference | https://www.aifreeapi.com/en/posts/gemini-api-free-tier-complete-guide |
