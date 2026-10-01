# Research Gaps and Open Questions

**Agent 4** · Last updated 2026-09-30 · **Living document — append, don't rewrite**

Per the ground rules: *if a source cannot be found, write "not found."* This file is the register of
everything that was looked for and not found, plus questions that need a decision from a human.

Priority key: **P0** = blocks a build decision · **P1** = materially affects quality ·
**P2** = nice to have.

---

## A. Things that do not appear to exist (data gaps)

| # | Gap | Pri | Why it matters | Suggested resolution |
|---|---|---|---|---|
| G01 | **No prevalence study of math anxiety in Pakistan** | P1 | The whole QR/math-anxiety thesis rests on US/international data | Learms could measure it in-product (AMAS is short and free) |
| G02 | **No Pakistani FCI / concept-inventory data** | P1 | Hake's 0.23→0.48 gain is assumed transferable | Run an FCI pre/post with a partner university |
| G03 | **No Pakistani CS1 pass-rate study** | P1 | Watson & Li's 67.7% is global; Pakistan likely worse | Ask a partner CS department |
| G04 | **ICAP does not publish paper-level pass rates**; ICMAP data never located | P1 | Can't identify "danger papers" for CA/CMA as was done for ACCA | FOI-style request to ICAP; scrape result gazettes |
| G05 | **Law-GAT pass rates not published anywhere** | P1 | Can't size or calibrate the highest-ROI law product | Ask HEC/DLE |
| G06 | **No official unemployment data for social-science or arts graduates** — the Labour Force Survey does not disaggregate them (PIDE says so explicitly) | P1 | Two large fields have no outcome data at all | Use PIDE aggregate + caveat; lobby for LFS change |
| G07 | **No study of Pakistani agriculture/veterinary students** (motivation, dropout, fieldwork) | P2 | `PROBLEMS_AGRICULTURE.md` is inferred from sector data only | Primary research |
| G08 | **No quantitative data on Pakistani arts/humanities students** | P2 | `PROBLEMS_ARTS.md` rests on one small qualitative study | Primary research |
| G09 | **Humanities proper — literature, history, philosophy, languages, and especially ISLAMIC STUDIES — has had no research at all** | **P0** | Islamic Studies is a very large Pakistani enrolment field (university + madrasa) and is entirely uncovered | **Must be researched before the taxonomy is called complete** |
| G10 | **No Pakistani teacher-burnout prevalence data**; no teacher device-ownership/connectivity data | **P0** | The "teachers are a 30–100× leverage user segment" thesis (`PROBLEMS_EDUCATION.md` E2) depends on teachers having usable devices | Research before committing to the teacher segment |
| G11 | **No ACCA/CA *dropout* study** (only pass rates) | P1 | Attrition ≠ failure; the retention argument is currently inferred | — |
| G12 | **No Pakistani objective-sleep study** in students (self-report only) | P2 | Quiet-hours design rests on self-report | — |
| G13 | **No remittance-linked willingness-to-pay data** | P1 | Pricing strategy for the diaspora-funded student segment | Market research |
| G14 | **No evaluation of any digital mental-health intervention with Pakistani students** | P1 | Wellness features have no local efficacy evidence | — |
| G15 | **No data on junior-advocate/pupillage pay** in Pakistan | P2 | Ability-to-pay for the law segment | — |
| G16 | **No enrolment figures for Pakistani journalism programmes**; no Pakistani creator-economy sizing | P2 | Media vertical sizing | — |
| G17 | **PEC registration/pass statistics not located** | P2 | Engineering vertical sizing | — |
| G18 | **No independent evaluation of Teach for Pakistan** | P2 | Cited as a positive case; currently self-reported | — |
| G19 | ~~Pakistani device ownership, data cost and connectivity~~ | ~~P0~~ | **SUBSTANTIALLY CLOSED 2026-09-30** — see `PAKISTAN_SOLUTIONS.md`. Data is USD ~0.12/GB (6th-cheapest worldwide), 8.9 GB/month average use, 81% mobile-broadband coverage. **Data cost is NOT the constraint** — device capability, network *quality* (−28 Mbps vs average) and the 25% gender gap are. Residual: no *student-specific* survey. | Closed |
| G20 | **Load-shedding / electricity availability and its effect on study time** | P1 | Likely argues for short sessions and offline content packs | No source found in this pass |
| G21 | **[CONTESTED] Smartphone penetration: 68% (PTA/GSMA) vs >56% (Mordor Intelligence)** | P1 | Materially changes addressable-market sizing | Resolve from the PTA/GSMA primary report |
| G22 | **Rural vs urban smartphone/connectivity breakdown** | P1 | Determines the scope of the offline-pack feature | Not located |
| G23 | **No data on any LLM's Urdu capability** | **P0** | The entire bilingual thesis (`PROBLEMS_BUSINESS.md` B5) and the content-factory architecture (`APIS_COMPARISON.md` AP3) assume a model can generate good Urdu explanations. **Completely unevidenced.** | Empirical test with real MDCAT/board content |
| G24 | **No LLM quality benchmarks retrieved** — `APIS_COMPARISON.md` compares price only | P1 | Whether the cheapest tier is adequate for grading or explanation is untested | Bench against real Learms tasks |
| G25 | **Open-weight / self-hosted models never researched** (Llama, Qwen, Gemma) | P1 | At ~USD 1/month ARPU, self-hosting a small model may beat any API | Dedicated research pass |
| G26 | **No Urdu / Nastaliq OCR benchmark exists for ANY engine** | **P0** | Nastaliq is the hardest major script for OCR; much Urdu-medium material exists only as scans. Blocks the bilingual ingestion roadmap. | Empirical benchmark — Tesseract-urd vs Gemini vs Google Vision on real board papers |
| G27 | **Mathematical OCR thinly evidenced** (one 2025 study, Tesseract ~68%) | P1 | MDCAT/FSc content is equation-dense; silently wrong formulae are the worst failure mode | Evaluate Mathpix / pix2tex / VLM-to-LaTeX |
| G28 | **Pakistani past-paper scan quality unknown** | P1 | Determines how often the VLM fallback fires, and therefore the real ingestion cost | Sample 100 real papers |
| G29 | **No verified list of Pakistani crisis helplines** | **P0** | `WELLNESS_CRISIS.md` W5 cannot ship without it. Needs a human to phone each number. | Manual verification |

---

## B. Contradictions found (recorded, unresolved)

| # | Contradiction | Status |
|---|---|---|
| X1 | **Education spend: 0.8% of GDP** (Pakistan Economic Survey 2024-25 Ch.10) vs **1.9%** (Pakistan Observer report, 2026) | Unresolved — almost certainly different scopes (federal vs federal+provincial, or different years). **Always attribute; never quote a bare number.** |
| X2 | **ACCA Dec-2025 pass rates differ across five aggregators** (learnsignal, eduyush, lakshyacommerce, preppergurukul, BPP) | Unresolved — ACCA's own release is authoritative but was not located |
| X3 | **Law-GAT attempt limits: 5 vs 7** across adalatonline / accesstojustice / legalacademy | Unresolved |
| X4 | **Universities: 269** (Economic Survey) vs **271 HEIs** (HEC Annual Report 2024-25) | Minor; different definitions of "HEI" |
| X5 | **Credit hours for a bachelor's: 122 vs 124 minimum** (Political Science curriculum vs NQF) | Resolved by convention: model as a range **122–140** |
| X6 | **NCEAC vs PEC:** BS Software Engineering ≠ BE Software Engineering; different accreditors, different rights | Real, structural — must be modelled, not resolved |
| X7 | **Engineering/CS unemployment doubling (2018-19 → 2020-21) overlaps COVID** | Direction agreed, magnitude contested |
| X8 | **Non-medical students more depressed than medical students in Pakistan (60.3% vs 48.7%)** — inverts the international pattern (Rotenstein 27.2% for medical) | The meta-analysis flags it itself; high heterogeneity. **Do not scope wellness to medicine.** |
| X9 | **LLB duration: HEC portal still shows a 2024-25 five-year LLB curriculum; the Supreme Court reduced it to four years in 2025** | Live contradiction. **Re-check before building law content.** |
| X10 | **Arts education: "students face resistance" vs "19 of the interviewed students had no difficulty"** in the same study | Barrier is class-stratified, not universal |
| X11 | **Exam Mode vs Mastery Mode** — teaching for understanding may *lower* marks in a recall-only exam system (70% of MDCAT is recall) | **Deliberate product tension. Flagged to the founder.** Current recommendation: ship both modes, honestly labelled. |

---

## C. Things named in the brief that could not be found

| # | Item | Status |
|---|---|---|
| N1 | **"NSCT"** — an organisation named in the original brief | **NOT FOUND.** No Pakistani body with this acronym surfaced in any search. Most likely intended: **NAVTTC** (National Vocational & Technical Training Commission) or **P@SHA** (Pakistan Software Houses Association). **Needs user confirmation.** |
| N2 | **PNC** (Pakistan Nursing Council), **PCP** (Pakistan Council of Pharmacy / Pharmacy Council of Pakistan), **PCATP** (Pakistan Council of Architects & Town Planners), **PVMC** (Pakistan Veterinary Medical Council) | Carried over from Area 1.3 — **not yet researched.** Each is a licensure gate and therefore a potential high-intent vertical. |
| N3 | **FPSC CSS full syllabus** | Identified as recommended vertical B6 but the detailed subject/paper structure was **not yet fetched**. |
| N4 | **ICMAP** | Never successfully retrieved despite two attempts. |

---

## D. Questions that need a human decision

1. **What is "NSCT"?** (see N1) — blocks correct citation of the brief's own reference.
2. **Exam Mode vs Mastery Mode** (X11) — is Learms willing to ship a mode that optimises for board
   marks even where that means drilling recall? *Recommendation: yes, but labelled honestly.*
3. **Case-law licensing** (`PROBLEMS_LAW.md` L4) — PLD/MLD/SCMR are copyrighted commercial products.
   Is there appetite to license, or should Learms restrict to public-domain judgment sources?
   **Legal review required before any ingestion.**
4. **Teacher segment** (`PROBLEMS_EDUCATION.md` E2) — committing to teachers as a first-class user
   segment is a significant product bet that currently rests on an unverified assumption about
   teacher device access (G10).
5. **Journalism safety content** (`PROBLEMS_MEDIA.md` D5) — teaching digital security and source
   protection in Pakistan is politically sensitive. Does Learms want that exposure?
6. **Wellness scope** (`PROBLEMS_SOCIAL_SCIENCES.md` S4) — with <20% of universities having
   counselling and ~1 psychiatrist per 100,000, the standard "detect and refer" pattern fails.
   How much self-management support is Learms willing to own, and with what clinical review?

---

## E. Methodological limitations of this research run

- **Search-based, not systematic.** Findings are what surfaced in targeted web searches; this is not
  a systematic literature review and has publication/indexing bias.
- **Several Pakistani sources are practitioner commentary or press, not peer-reviewed.** These are
  labelled `[MED]` or `[LOW]` and the limitation is stated inline, but readers should not treat a
  well-written blog as evidence.
- **Some secondary sources report primary data without published methodology** (e.g. "58% of
  employers report difficulty finding workers"). Labelled `[MED]`.
- **Paywalled and non-indexed Pakistani sources were not reachable** — most notably ICAP/ICMAP
  result gazettes and HEC internal statistics.
- **No primary research was conducted.** Everything here is secondary.
