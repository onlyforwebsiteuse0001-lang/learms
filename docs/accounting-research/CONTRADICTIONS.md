# Agent 7 — Contradictions Register

Where sources disagree, or where the task brief disagrees with a primary source, the conflict
is recorded here rather than silently resolved. Brief Rule 5 asks explicitly for
contradictions to be identified.

Resolution principle (`DECISIONS-7.md` D-003): **Tier-A primary sources win.**

---

## C-001 — Course count for the 12-year ICMAP entry route

| Source | Claim |
|---|---|
| Task brief | "12-Year Education: 09 Courses + 6 PTM" |
| **ICMAP Circular ICMAP/HO/Edu/106/2025, §2** | **"12-Year Education: 4-Year 18 Courses + 6 Mandatory Practical Training Modules."** |

**Resolution:** ICMAP is correct. 12-year entrants take **18 courses**. The "09 courses"
figure belongs to the **16-year** route.

**Severity: high.** This halves the apparent workload of the most common school-leaver route.
A student planning on 9 courses would be planning for ~PKR 464K and 2 years when the reality
is ~PKR 727K and 4 years.

---

## C-002 — Name of ICMAP course M2

| Source | Claim |
|---|---|
| Task brief | "M2: Tax Planning & Reporting" |
| **ICMAP syllabus page + circular** | **"M2 - Business Taxation"** |

**Resolution:** "Tax Planning & Reporting" does not exist in Study Scheme-2025. Official name
is Business Taxation.

---

## C-003 — Name of ICMAP course S2

| Source | Claim |
|---|---|
| Task brief | "S2: Business Taxation" |
| **ICMAP circular §2** | **"S2- Advance Taxation"** |
| ICMAP syllabus web page | "S2 - Advanced Taxation" |

**Resolution:** S2 is the *advanced* taxation paper at Strategic Level-1; **Business Taxation
is M2**, two sub-levels lower. ICMAP itself is inconsistent between "Advance" (circular) and
"Advanced" (web page) — a cosmetic, not substantive, difference.

**Severity: high for Agent 1.** Treating S2 as "Business Taxation" would create a prerequisite
edge pointing the wrong way through the tax syllabus.

---

## C-004 — "PKR 93,000 per module"

| Source | Claim |
|---|---|
| Task brief / community reports | "Modules costing approximately PKR 93,000 each" |
| **ICMAP fee circulars** | Per **course**: 23,000–39,500. Per **level (3 courses)**: 69,000–118,500 |

**Resolution:** Both are right about different units. ≈93,000 matches **one six-month level
of three subjects at Managerial stage under 2024–25 fees** (ML-2 2024 = 3 × 30,100 = 90,300;
ML-1 2025 = 96,000). It is **not** a per-paper price.

**Severity: medium.** Quoted as per-paper it inflates ICMAP's cost ~3×; dismissed as false it
erases a legitimate grievance. Full working in `cma-deep/STUDY_SCHEME_2025_COMPLETE.md` §13.

---

## C-005 — CMA (ICMAP) salary figures

| Source | Claim (entry level) |
|---|---|
| Task brief | **PKR 2,686,111/year ≈ 224,000/month** |
| Triangulated Pakistani market evidence (see `career/SALARY_DATA_2025_2026.md`) | Entry-level qualified/part-qualified CMA: roughly **PKR 60,000–150,000/month** |

**Resolution:** The brief's figures carry the signature of cost-of-living salary *models*
(ERI/salaryexpert-type products), which extrapolate from international data adjusted by
purchasing-power factors. They are **not surveys of actual Pakistani pay**.

Sanity checks that the brief's figure fails:
- It would put a fresh CMA entrant above the typical starting pay of a fresh **ICAP CA**, the
  highest-paid entry credential in the country — contradicting the brief's *own* comparison
  table (which lists CMA entry at PKR 80–120K/month and CA entry at 150–250K/month).
- **The brief contradicts itself**: Area 2.7 says CMA entry = PKR 224K/month while Area 5.1's
  matrix says CMA starting salary = PKR 80K–120K/month.
- PKR 2.69m/year for a fresh entrant is far above Pakistan's graduate-entry market across
  essentially all disciplines.

**Severity: critical.** Publishing these numbers in a career-guidance product would be
actively harmful. Rejected per `DECISIONS-7.md` D-004.

---

## C-006 — Internal inconsistency inside ICMAP's own circular (lecture hours)

| Statement in §7 | Implication |
|---|---|
| "90 lecture hours per course" × 24 modules | 2,160 hours |
| "90 lecture hours per course" × 18 courses | 1,620 hours |
| "totalling 1260 lecture hours" | implies 14 modules |
| "144 credit hours" ÷ 6 | implies 24 modules ✅ |

**Resolution:** The credit-hour figure is internally consistent (24 modules × 6). The
lecture-hour total is not reconcilable with any module count in the scheme. Use credit hours.
See `BLOCKERS-7.md` B-004.

---

## C-007 — Effective-date inconsistency inside ICMAP's own circular

| Section | Date |
|---|---|
| §1 Scheme Title and Effective Date | Scheme effective **16 July 2025** |
| §6 Switchover Plan | Existing students merged into Study Scheme-2025 **with effect from 15 July 2025** |

**Resolution:** One-day discrepancy, immaterial in practice, but noted because it means the
transition date quoted by different ICMAP staff may differ by a day.

---

## C-008 — ICMAP institutional name

| Usage | Name |
|---|---|
| Statutory / circular letterhead | Institute of Cost & Management Accountants of Pakistan (ICMAP) |
| Current web branding, model papers | **ICMA International** |
| Designation awarded under Study Scheme-2025 | **Chartered** Management Accountant (CMA) |

**Resolution:** Same body. Note the designation wording: Study Scheme-2025's roadmap calls
the final award "**Chartered** Management Accountant", historically "Cost and Management
Accountant". Learms search and content should index all three name forms plus "ICMAP", or
students will fail to find their own qualification.

---

## C-009 — "CMA students are the most numerous in Pakistan"

| Source | Claim |
|---|---|
| Task brief | "CMA walon ki tadaad sab se zyada hai" (CMA students are the most numerous) |
| Evidence found | **None.** No body publishes comparable registered-student counts. |

**Resolution:** Unverified. See `BLOCKERS-7.md` B-005. The defensible justification for
prioritising ICMAP is that it is the **least-researched** of the three major bodies, not
demonstrably the largest. Available indirect evidence (ACCA's published Pakistan market
figures, ICAP's published student numbers) does not support ICMAP being the largest, but the
bases are not comparable so no counter-claim is made either.

---

## C-010 — CMA duration: "2–5 years" vs official

| Source | Claim |
|---|---|
| Task brief comparison matrix | CMA duration "2-5 years" |
| **ICMAP circular §2** | **4 years** (12-yr entry), **2.5 years** (14-yr), **2 years** (16-yr) — these are *minimum* elapsed times assuming no failures |

**Resolution:** The official figures are floors for three distinct routes, not a range for one
route. Real-world completion is longer; ICMAP publishes no time-to-completion statistics
(related to B-003), so the upper bound of "5 years" has no published basis.

---

## C-011 — The brief's CA structure is obsolete

| Source | Claim |
|---|---|
| Task brief | CA route described as AFC / CAF / **CFAP + MSA** (Multi-Subject Assessments) |
| **ICAP Education Scheme 2025** | **PRC (3) → CAF (8) → CFAP (6) → Strategic Case Study**, plus 2 Hands-on Courses and 2 Integrated Modules. **MSA-1, MSA-2 and SPM are abolished.** New **CFAP-03 Sustainability Reporting and Assurance.** |

**Resolution:** The brief describes the superseded scheme. ICAP's official transition rules give
legacy MSA/SPM holders sittings up to and including **Winter 2026 as the last chance**, after
which they are mapped onto the new structure.

**Why this is urgent, not merely stale:** any Learms content built to the brief's structure would
be wrong *and* would mislead precisely the cohort facing a hard deadline. Flagged to Agent 2 as a
time-critical content requirement. Detail in `ca-deep/COMPLETE_GUIDE.md`.

**Source:** ICAP Education Scheme 2025 — Principles and Structure; ICAP FAQs on Education Scheme
2025. Accessed 2026-09-30.

---

## C-012 — "Pakistan has a shortage of 40,000–50,000 accountants"

| Source | Claim |
|---|---|
| Task brief | Pakistan faces a shortage of 40,000–50,000 qualified accountants |
| **Search for origin** | **Not found.** No ICAP, ICMAP, PIPFA, SECP, HEC, Pakistan Bureau of Statistics, World Bank or peer-reviewed publication stating this figure was located. |

**Resolution:** **Unsourced.** The figure circulates in Pakistani coaching-centre and careers
content without attribution. It may originate in a real study, but none was found.

**What can be said instead, honestly:** membership numbers for all three bodies are small relative
to a ~240-million population and a documented emigration outflow of qualified finance
professionals exists. That supports a qualitative claim of undersupply. **It does not support a
specific number.**

**Instruction to downstream agents:** do not reproduce "40,000–50,000" as fact anywhere in Learms.
If market-demand framing is needed, use the qualitative statement and cite the absence of a
quantified figure. Related: `BLOCKERS-7.md` B-005, B-008.

---

## C-013 — IMA CMA (USA) student exam fee: four sources, four numbers

| Source | Claimed student exam fee per part |
|---|---|
| VoraPrep (2026) | **$415** |
| Eduyush (2026) | **$407** |
| Miami Herald careers (2026) | **$370** |
| Xylem Learning (2026) | **$480.26** |

**Spread:** ~30% between lowest and highest, all claiming to describe 2026.

**Resolution:** **Unresolved and deliberately not resolved.** No figure is adopted; the range
$370–480 is reported as a range. Xylem is treated as a Tier-D outlier because its membership
($500) and professional exam ($643.10) figures also diverge from the other four sources, which
suggests region-specific mark-ups or bundled pricing presented as IMA's own fees.

**Fix:** fetch imanet.org directly. Not done this session. See `BLOCKERS-7.md` B-012.

**Note:** the *professional* figures ($300 entrance, $295 membership, $495/part) show 4–5 source
agreement and are used with moderate-to-high confidence in
`cma-deep/CMA_PAKISTAN_VS_USA.md`. The contradiction is confined to student rates.
