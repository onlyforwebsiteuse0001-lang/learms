# Islamic Finance and the 2028 Riba Deadline — A Curriculum Emergency

**Area:** 14 (Pakistan regulatory / taxation / Islamic finance)
**Researched:** 2026-09-30

---

## 1. Why this is the most time-critical finding in this research

Pakistan has a **constitutional deadline of 1 January 2028** to eliminate *riba* (interest) from
its financial system. That is **15 months from today**.

Every accounting student currently enrolled at ICMAP, ICAP or ACCA in Pakistan will qualify into
a financial system that is legally required to have been restructured. And **Islamic finance is
not a named core subject in ICMAP's Study Scheme-2025**, nor was it found as a core paper in
ICAP's Education Scheme 2025.

**A qualification launched in 2025 does not core-examine the thing the constitution requires the
entire banking system to become by 2028.** That is the gap.

---

## 2. The legal chain of events

| Date | Event |
|---|---|
| **28 April 2022** | **Federal Shariat Court** judgment, authored by **Justice Dr Syed Muhammad Anwer**, holds that Islam prohibits interest in all its forms and gives the government **five years** to eliminate riba — a 2027 horizon. The ruling extends to domestic *and* international borrowing, explicitly naming IMF and World Bank loans. |
| **20–21 October 2024** | Parliament passes the **26th Constitutional Amendment Bill, 2024** with a two-thirds majority in both houses (National Assembly 225 votes against a 224 threshold). It amends **Article 38(f)** of the Constitution. |
| **1 January 2028** | Constitutional deadline. |
| **Ongoing** | **SBP Vision 2028**, the State Bank's fourth strategic plan, carries **"Transforming to a Shariah-Compliant Banking System"** as strategic goal **SG-4**. SBP has begun preparations including a digital retail Islamic bank. |

Article 38(f) previously read "eliminate riba **as early as possible**" — an aspiration with no
date. It now carries a date.

---

## 3. ⚠️ Contradiction: the sources do not agree on the constitutional text

This matters legally, and it is not a trivial discrepancy.

| Rendering | Sources |
|---|---|
| **"eliminate riba completely before the first day of January, two thousand twenty-eight"** — **absolute** | Arab News (quoting the Bill directly); Express Tribune |
| **"as far as practicable, by the 1st of January, 2028"** — **qualified** | The News (print); The Islamic Information |

**One version is an unconditional constitutional command. The other contains an escape clause.**
"As far as practicable" is a materially weaker obligation and would change how a bank, regulator
or auditor assesses compliance risk.

**Resolution: unresolved.** The authoritative text of the 26th Amendment as enacted was **not
retrieved from an official source** (National Assembly, Senate, or the Gazette of Pakistan). The
sources quoting the Bill text directly favour the absolute rendering, but this is not sufficient
to settle it.

**Instruction:** Learms must **not** state either wording as the constitutional text until the
Gazette version is checked. Logged in `../CONTRADICTIONS.md`. See §7.

---

## 4. What this means for accounting education

### 4.1 The technical content that becomes mandatory
If conventional interest-based instruments are eliminated, the accounting, audit and taxation of
their Shariah-compliant replacements stops being a specialism and becomes core practice:

- **Murabaha** (cost-plus sale) — replaces much conventional lending
- **Ijarah** (leasing) — interacts directly with IFRS 16, already in ICMAP M1/S1
- **Mudarabah / Musharakah** (profit-and-loss sharing) — replaces deposit and partnership finance
- **Sukuk** — replaces conventional bonds; interacts with IFRS 9, already in ICMAP S1
- **Takaful** — replaces conventional insurance

Each has recognition, measurement, presentation and disclosure consequences, and each requires
audit procedures a conventional auditor has not been trained in.

### 4.2 The concepts already in the syllabus that are affected
Three concepts in `../data/accounting_concept_graph_seed.json` are directly implicated:
`acc.leases` (IFRS 16 / Ijarah), `acc.fin_instruments` (IFRS 9 / Sukuk), and `fin.risk_mgmt`
(conventional hedging instruments are themselves contested under Shariah).

**This is not additive content. It modifies concepts already being taught.**

### 4.3 The audit dimension is the least-discussed
Shariah compliance requires **Shariah audit** — a distinct assurance activity with its own
standards and its own practitioners. ICMAP S4 (Audit & Assurance) and PTM4 (Audit Procedures) are
built on ISAs. Nothing found in this research indicates Shariah audit is examined.

---

## 5. What ICMAP, ICAP and ACCA actually teach — the honest answer

| Body | Islamic finance in the current scheme | Confidence |
|---|---|---|
| **ICMAP Scheme-2025** | **Not a named core course** among the 18 courses or 6 PTMs. No dedicated Islamic finance subject was identified in the syllabus list. | High — the full course list was captured from the Tier-A circular |
| **ICAP Education Scheme 2025** | **Not identified as a core paper.** CFAP-03 is *Sustainability* Reporting and Assurance, not Islamic finance. | **Moderate — the eight CAF paper titles were not captured** (`../BLOCKERS-7.md` B-010). If Islamic finance sits inside a CAF paper, this research would have missed it. |
| **ACCA** | Not part of the core 13 exams. ACCA has historically offered Islamic finance certificates separately. | Moderate — not investigated this session |

**I want to be precise about the strength of this claim.** What is established is that Islamic
finance does **not appear as a named core subject** in the schemes examined. What is **not**
established is that it is absent from syllabus *content* inside other papers — that would require
reading the 18 ICMAP per-subject syllabus PDFs and ICAP's CAF/CFAP syllabi, which was not done.

The claim is therefore: **Islamic finance has no dedicated core paper in the 2025 schemes of
either Pakistani body, despite a constitutional deadline 15 months away.** That is defensible.
A stronger claim would not be.

---

## 6. Recommendations

| # | Recommendation | Consumer |
|---|---|---|
| 1 | **Seed Islamic finance concepts into the knowledge graph** — Murabaha, Ijarah, Mudarabah, Musharakah, Sukuk, Takaful, Shariah audit — even though no body core-examines them. The graph should model the field, not only the exam. | Agent 1 |
| 2 | **Link them as siblings of existing concepts**, not as an isolated cluster: Ijarah↔`acc.leases`, Sukuk↔`acc.fin_instruments`, Shariah audit↔`aud.objective`. | Agent 1 |
| 3 | **Treat this as the highest-value differentiating content area.** The market has a constitutional deadline and the institutes have not responded. No competitor advantage is more defensible than being first. | Agent 2 |
| 4 | **Do not quote the constitutional text** until the Gazette version is verified. | All |
| 5 | **Verify §5 before publishing it.** Read the ICMAP per-subject syllabus PDFs and ICAP CAF/CFAP syllabi. The claim is currently at moderate confidence for ICAP. | Continuation |

---

## 7. What was not done — stated plainly

- **The authoritative text of the 26th Constitutional Amendment was not retrieved.** All five
  sources are news media. No Gazette, National Assembly or Senate document was fetched. **This is
  the single most important follow-up in this file**, given §3.
- **No AAOIFI standards were consulted.** Their status in Pakistan (adopted? adapted? mandatory?)
  is **not established** by this research.
- **Islamic Financial Accounting Standards (IFAS)** are believed to exist in Pakistan and to be
  connected to ICAP and SECP. **This was NOT verified** and no IFAS number, title or adoption
  status is asserted here. Treat as unresearched.
- **No SBP Islamic banking statistics** (share of assets, deposits, conversion progress) were
  gathered, so no assessment of whether the 2028 deadline is achievable is offered.
- **No search of ICMAP/ICAP syllabus PDFs for Islamic finance content inside other papers.**
- **No review of the separate Islamic finance certifications** available in Pakistan.

---

## 8. Sources

All accessed 2026-09-30. **All Tier C — media reporting. No primary legal or regulatory source
was retrieved for this file.** That limitation is why §3 is unresolved and why §7 leads with it.

| Source | Tier |
|---|---|
| Express Tribune, "26th amendment mandates elimination of Riba by 2028" — https://tribune.com.pk/story/2504265/26th-amendment-mandates-elimination-of-riba-by-2028 | C |
| Arab News Pakistan, "Pakistan sets Jan. 1, 2028 deadline to eliminate 'riba'" — https://www.arabnews.pk/pakistan/pakistan-sets-jan-1-2028-deadline-to-eliminate-riba-or-interest-from-country-2576082 | C |
| The News (print), "Jan 1, 2028 deadline to end interest-based banking" — https://www.thenews.com.pk/print/1242303-jan-1-2028-deadline-to-end-interest-based-banking | C |
| Aaj English TV — https://english.aaj.tv/news/330385109/pakistan-sets-deadline-to-eliminate-interest-based-practices-by-2028 | C |
| The Islamic Information — https://theislamicinformation.com/news/pakistan-to-become-interest-free-country-by-2028/ | D |
| **Gazette of Pakistan / National Assembly text of the 26th Amendment** | **NOT RETRIEVED** |
| **AAOIFI standards** | **NOT CONSULTED** |
| **SBP Vision 2028 document** | **NOT RETRIEVED** (referenced second-hand in sources above) |
