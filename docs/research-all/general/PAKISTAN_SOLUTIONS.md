# Pakistan-Specific Solutions: Devices, Connectivity, Cost and Delivery

**Agent 4 — Area 3.3** · Last updated 2026-09-30
**Closes gap G19 (P0)** from `GAPS.md` — the single most load-bearing unresearched assumption in
the corpus. Several earlier recommendations (offline-first, video-vs-text, model choice, pricing)
were explicitly gated on this.

---

## 1. The connectivity picture — better than assumed, and cheap

### Topic: Pakistani mobile and broadband indicators
### Source: Pakistan Telecommunication Authority (PTA) "State of Mobile 2024" and FY25 indicators, as reported by PhoneWorld and Daily K2; PACRA Telecommunication Sector Study (Jul 2026); GSMA assessments cited in the PTA report; World Bank (2024), "Pakistan: Evaluating Private Capital Mobilization Potential"; ITU IDI 2023; Cable.co.uk global mobile data pricing survey
### Key Finding **[HIGH — regulator primary data, corroborated by World Bank and a credit-rating sector study]**

| Indicator | Value | Period |
|---|---|---|
| Total telecom subscriptions | **200.3 million** | mid-2025 |
| Cellular subscribers | 197.8m (FY25) → **206.0m** | 11MFY26 |
| **Broadband users** | **150 million** | mid-2025 |
| **Broadband penetration** | **57%** | FY24-25 |
| Teledensity | **~81%** (cellular ~80%); AJK & GB **>94%** | FY25 |
| **Smartphone adoption** | **68%** (GSMA, via PTA) — **[CONTESTED:** Mordor Intelligence says ">56%"]** | 2025 |
| 3G/4G-capable handsets on network | **71%** (FY24: 65%) | FY25 |
| 4G users as share of subscribers | ~60% | 2025 |
| **Mobile broadband population coverage** | **81%** | 2025 |
| Fixed broadband subscriptions per 100 people | **1.4** (vs 30 in high-income, 4.4 in LMICs) | 2024 |
| FTTH connections | >2 million | mid-2025 |
| **Average data use per subscriber** | **8.4 GB/month** (2024), **8.9 GB/month** (9MFY26); up **71%** from 4.9 GB in 2020 | — |
| Total mobile data usage | 13,002 PB (FY24-25) → ~27,700 PB (Jun 2025) | — |
| **Price per GB** | **PKR ~29** ≈ **USD ~0.12** — **lowest in the region, 6th-lowest worldwide** | FY25 |
| Price per GB trend | PKR 25.5 (FY23 trough) → 26.6 (FY24) → **29.0 (FY25)**, "accelerated sharply in 6MFY26" | rising |
| ARPU | PKR **276/mo** (FY24) → **306/mo** (FY25) | — |
| **Mobile internet gender gap** | **~25%** (narrowing) | GSMA, 2025 |

### The decisive finding
**Mobile data in Pakistan is among the cheapest on Earth (USD ~0.12/GB, 6th-lowest of ~230
countries), the average user already consumes ~8.9 GB/month, and 81% of the population has mobile
broadband coverage.**

**This overturns the default assumption.** Data cost is *not* the binding constraint. The binding
constraints are **device capability, network quality, and electricity** — not bytes.

### Citation
- https://www.phoneworld.com.pk/pakistans-telecom-industry-in-2025-revenue-growth-challenges-and-the-road-to-5g/
- https://dailyk2.com/pta-releases-new-report-on-monthly-internet-data-use-in-pakistan/
- https://www.pacra.com/view/storage/app/Telecommunication-%20PACRA%20Research%20-%20Jul'26%201_1784631941.pdf
- https://documents1.worldbank.org/curated/en/099062824080037094/pdf/P18110511eac280ae1af8715b95bc9d719b.pdf

---

## 2. What is actually broken

### Key Finding **[HIGH — World Bank gap analysis]**
The World Bank's digital-development gap analysis scores Pakistan against comparator averages:

| Gap | Deficit vs average |
|---|---|
| Mobile broadband penetration | **−15.68 pp** (similar to India, Bangladesh) |
| **4G coverage** | **−25 pp** |
| Tower density | **2,270 more people per tower** |
| Fixed broadband household penetration | −18.14 pp |
| **Quality of service** | **−28 Mbps** below average |
| Price (relative to PPP) | 2.6× higher in relative terms |
| **Affordability** | **the ONLY pillar scoring well** |

On the Mobile Connectivity Index pillars (Availability, Affordability, Relevance, Readiness),
Pakistan's score is dragged down by **availability** and **relevance to citizens** — *not* price.
And: "**A massive gender gap in both internet access and mobile phone access for females was noted
as a major issue.**"

⚠ The **relevance** finding deserves attention. Pakistan scores badly on *relevance of the internet
to citizens* — meaning there isn't enough content that matters to people in their language and
context. **That is precisely the gap Learms fills**, and it means the market failure is a content
failure, not an infrastructure failure.

---

## 3. What this means for Learms — corrected recommendations

### **P1 — Data cost is not the constraint. Stop designing around it.**
An 8.9 GB/month average and PKR 29/GB mean a student can afford a **text- and image-heavy app
easily**, and can afford **moderate video**. A 500 MB month of Learms usage costs about **PKR 15**
— trivial against ARPU of PKR 306. *Earlier hedging about payload size was over-cautious.*

### **P2 — But bandwidth *quality* IS the constraint. Design for bad networks, not for no network.**
Quality of service runs **28 Mbps below comparator average**, 4G coverage is **25 pp** short, and
tower density is poor. The right posture is **resilience, not frugality**:
- Aggressive caching and optimistic UI; never block the interaction on a round trip.
- **Queue attempts locally and sync opportunistically** — this also protects the append-only
  `attempt` log (`RECOMMENDATIONS.md` A1-1), which must not lose rows to a dropped connection.
- Retry with backoff; make failure states honest and non-punitive ("saved, will sync").
- **Avoid streaming-video-dependent learning paths.** Not because of cost, but because a 28-Mbps
  deficit plus tower congestion makes video unreliable. *This reinforces `SOCRATIC_DEEP.md` SO6
  and `PROBLEMS_NATURAL_SCIENCES.md` N5 for a completely independent reason: no passive video.*

### **P3 — Full offline-first is justified for the rural/agriculture vertical, not universally.**
81% mobile-broadband population coverage means most urban and peri-urban students are reachable.
The 19% uncovered plus poor-quality regions map closely to the rural cohort identified in
`PROBLEMS_AGRICULTURE.md` A4. **Recommendation: build sync-resilient by default (P2) for everyone,
and a true offline content-pack download for the rural vertical.** This is a meaningful downgrade
in scope from "offline-first everywhere".

### **P4 — Smartphone capability, not smartphone ownership, is the real filter.**
Adoption is 68% (contested: 56%) and **71% of handsets are 3G/4G-capable** — implying **~29% of
devices on the network are 2G feature phones**. Combined with the poorest students being the least
likely to have a good device:
- **Target low-end Android aggressively.** Old Android WebView, 2–3 GB RAM, small storage.
- **Keep the bundle small and the memory footprint low** — this is about the *device*, not the data
  plan.
- **Do not require the latest OS.** Do not ship a heavy SPA.
- **[CONTESTED]** the 68% vs 56% smartphone figure materially changes addressable market sizing.
  Resolve it from the PTA/GSMA primary report before any funding model depends on it.

### **P5 — The gender gap is a first-class product constraint, not a diversity note.**
A **~25% mobile internet gender gap**, called "a major issue" by the World Bank, sits alongside
**47% female university enrolment** (`UNIVERSITY_COURSES.md` C7) and **higher measured distress
among female students** (`PROBLEMS_SOCIAL_SCIENCES.md`). The implications:
- **Shared-device use is common** — a woman may use a household phone, not her own. Therefore:
  fast account switching, PIN/biometric lock on the profile, **no sensitive content in
  notifications**, and **no wellness signal on any surface another household member can see**
  (this hardens `RECOMMENDATIONS.md` A1-15 with a concrete threat model).
- **Low-data, low-storage, quick-session design** suits borrowed-device usage: a productive
  5-minute session must be possible.
- Female users are **more likely to be data-constrained even where data is cheap**, because they
  may not control the top-up.

### **P6 — Electricity, not mentioned in these sources, is the unresearched sibling risk.**
Load-shedding is a known feature of Pakistani life and directly affects study time and device
charging. **No source in this pass covered it. Marked NOT FOUND — added to `GAPS.md`.** If real,
it argues further for short sessions and offline packs.

### **P7 — Price the product against ARPU, not against Western SaaS.**
Monthly telecom ARPU is **PKR 306 (~USD 1.10)**. That is what a Pakistani consumer is demonstrably
willing to spend per month on a digital service they use daily. Combined with enrolment falling
11.8% on cost (`UNIVERSITY_COURSES.md` C6), **any paid tier priced above a few hundred rupees per
month is priced out of the mass market.** The exceptions identified in this research —
**ACCA/CA candidates** (internationally portable credential, 13,000 emigrated) and
**diaspora-funded students** — are the willingness-to-pay segments.

### **P8 — "Relevance" is the market gap.**
Pakistan scores badly on *relevance of the internet to citizens*, while scoring well on
affordability. Cheap data plus nothing worth reading in Urdu is the shape of the opportunity.
This is the strongest external validation found for the bilingual-content thesis
(`PROBLEMS_BUSINESS.md` B5).

---

## 4. Actionable summary

| # | Decision | Detail | Owner |
|---|---|---|---|
| **P1** | **Stop optimising for data cost** | USD 0.12/GB, 6th-cheapest worldwide; 8.9 GB/month average usage. Text and images are free in practice. | All |
| **P2** | **Design for bad networks, not no network** | −28 Mbps QoS gap. Optimistic UI, local queueing, opportunistic sync, honest non-punitive failure states. | **Agent 1** |
| **P3** | **Offline packs for the rural vertical only**; sync-resilient everywhere | 81% mobile-broadband coverage. Downgrades "offline-first everywhere" to a targeted feature. | Agent 1 |
| **P4** | **Optimise for low-end Android devices, not for bytes** | 29% of handsets are still 2G-only; low RAM/storage is the filter. Small bundle, old WebView support. | **Agent 2** |
| **P5** | **Design for shared devices and the 25% gender gap** | Fast profile switching, profile lock, no sensitive notifications, productive 5-minute sessions. | **Agent 1 + 2** |
| **P6** | Research load-shedding impact | Not covered by any source found. Likely argues for short sessions + offline packs. | Agent 4 (open) |
| **P7** | **Price against ARPU of PKR ~306/month** | A paid tier above a few hundred rupees is priced out. Free tier is the product. | Product |
| **P8** | **Relevance, not infrastructure, is the market gap** | Pakistan scores well on affordability, badly on relevance. Bilingual Urdu content *is* the moat. | Agent 2 |
| P9 | Resolve the 68% vs 56% smartphone contradiction | Materially changes addressable-market sizing | Agent 4 (open) |

## Gaps / Not found
- **Load-shedding / electricity availability and its effect on study time** — no source found.
- **Student-specific** device ownership and connectivity (all figures above are population-level).
  G19 is now *substantially* closed but not *fully* — no survey of Pakistani students specifically.
- **Teacher** device ownership (G10) — still **not found**; the teacher-segment thesis remains
  gated, though 68% national smartphone adoption makes it more plausible.
- Rural vs urban breakdown of smartphone adoption — not located.
- **[CONTESTED]** smartphone penetration: PTA/GSMA **68%** vs Mordor Intelligence **>56%**.

---

## Sources

| Type | Source | URL |
|---|---|---|
| Regulator (primary, via press) | PTA "State of Mobile 2024" — 8.4 GB/month, 57% broadband penetration, PKR 26.6/GB | https://dailyk2.com/pta-releases-new-report-on-monthly-internet-data-use-in-pakistan/ |
| Industry analysis of PTA data | PhoneWorld (2026) — 200.3m subs, 150m broadband, 68% smartphone, 81% coverage, PKR 29/GB, 25% gender gap | https://www.phoneworld.com.pk/pakistans-telecom-industry-in-2025-revenue-growth-challenges-and-the-road-to-5g/ |
| Credit-rating sector study | PACRA Telecommunication Sector Study (Jul 2026) — USD 0.12/GB, 71% 3G/4G handsets, 8.9 GB/month, rising prices | https://www.pacra.com/view/storage/app/Telecommunication-%20PACRA%20Research%20-%20Jul'26%201_1784631941.pdf |
| Multilateral | World Bank (2024) — digital development gap analysis, QoS −28 Mbps, 4G −25 pp, gender gap, relevance pillar | https://documents1.worldbank.org/curated/en/099062824080037094/pdf/P18110511eac280ae1af8715b95bc9d719b.pdf |
| Market research | Mordor Intelligence — Pakistan Telecom MNO market (contested 56% smartphone figure, 4.3 GB/sub FY24-25) | https://www.mordorintelligence.com/industry-reports/pakistan-telecom-market |
