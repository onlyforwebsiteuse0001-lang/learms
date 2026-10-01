# PM&DC-Recognized Medical and Dental Colleges — Dated Directory Guide

**Evidence cutoff:** 2026-09-30
**Scope:** Pakistan MBBS/BDS colleges appearing in the four current PM&DC sector/program directories
**Important:** This is a regulator-grounded directory guide, not a quality ranking and not a guarantee that a college may admit a new cohort in every session.

## Topic

National recognition inventory at the evidence cutoff.

### Source

PM&DC's four live college directories: public medical, private medical, public dental, and private dental, accessed 2026-09-30. [MED-051–MED-054]

### Key Finding

At retrieval, the PM&DC pages reported **178 program-sector directory entries**: 50 public medical, 71 private medical, 17 public dental, and 40 private dental. The 178 total is a sum of directory entries, **not a count of unique institutions**: one institution may have separate medical and dental entries.

| Program | Sector | Page-reported entries | Canonical live directory | Source ID |
|---|---|---:|---|---|
| MBBS/medical | Public | 50 | <https://pmdc.pk/Colleges/PublicMedicalColleges> | MED-051 |
| MBBS/medical | Private | 71 | <https://pmdc.pk/Colleges/PrivateMedicalColleges> | MED-052 |
| BDS/dental | Public | 17 | <https://pmdc.pk/Colleges/PublicDentalColleges> | MED-053 |
| BDS/dental | Private | 40 | <https://pmdc.pk/Colleges/PrivateDentalColleges> | MED-054 |
| **Total directory entries** | — | **178** | — | — |

The live tables expose province, college name, city, and seat allocation. They are paginated and mutable. The research capture could independently verify the totals and the 10 visible rows in each category, but the available retrieval path did not expose all pages. Therefore, this repository does **not** pretend that its row-level mirror is complete. The machine-readable evidence capture is `PMDC_COLLEGE_REGISTER_2026-09-30.json`; its `complete_row_capture` fields are all `false`.

### Relevance to Learms

Learms should query or refresh the regulator directory at decision time. A stale copied list must never become an evergreen “all colleges” database. The interface should display program, sector, access date, source link, and capture completeness together.

### Citation

Pakistan Medical and Dental Council. *Public Medical Colleges; Private Medical Colleges; Public Dental Colleges; Private Dental Colleges*. Live official directories. Accessed 2026-09-30. URLs and metadata: MED-051–MED-054.

---

## Topic

What “recognized college” does and does not establish.

### Source

PM&DC college directories [MED-051–MED-054], PM&DC 2025 undergraduate regulations [MED-002], and PM&DC's 7 November 2025 teaching-hospital list [MED-055].

### Key Finding

These are different claims and must remain separate:

1. **Directory appearance:** the college appears under a PM&DC program/sector directory on a stated access date.
2. **Seat allocation:** the live row gives a regulator-displayed seat count on that date.
3. **Teaching-hospital relationship:** a dated PM&DC document identifies own and/or affiliated hospitals at the time of the last inspection.
4. **Session-specific admission permission:** the relevant admitting authority and regulator permit intake for an exact session and category.
5. **Awarding or affiliating university:** a separate institutional relationship requiring its own evidence.
6. **Quality or rank:** not established merely by recognition, seats, or a hospital attachment.

The 2025 admissions regulations prohibit a public or private college from admitting beyond PM&DC's allocated seats. They also require final admissions to be reported through PM&DC processes. Directory appearance alone is not evidence of a particular student's valid admission. [MED-002]

### Relevance to Learms

Agent 1 should model each claim as a versioned relation, not as one `is_recognized=true` property. Agent 2 should show separate badges such as “PM&DC directory entry,” “seat value accessed on …,” “hospital evidence dated …,” and “session intake not verified.”

### Citation

Pakistan Medical and Dental Council. *Medical and Dental Undergraduate Education (Admissions, Curriculum and Conduct) Policy and Regulations 2025*. Regulations 3–7. 2025. MED-002.
Pakistan Medical and Dental Council. *List of Medical & Dental Colleges with Attached Teaching Hospital(s)*. Dated 7 November 2025. MED-055.

---

## Topic

Teaching hospitals and mutable status notes.

### Source

PM&DC's dated teaching-hospital list, 7 November 2025. [MED-055]

### Key Finding

The hospital document identifies hospitals as **own** or **affiliated** and describes them as the hospitals recorded at the time of last inspection. Some college rows carry additional status wording. For example, the Swat Medical College row says a letter was sent for ministry notification and that notification was still awaited. This wording is not equivalent to unconditional current admission permission and must be preserved verbatim as a dated status note rather than normalized away.

Court orders, stop-admission directions, pending notifications, and similar annotations are mutable legal/regulatory events. **No complete current institution-by-institution court/stop-admission register was found in the sources reviewed for this checkpoint.** Such fields remain `not found` unless an exact dated notice is attached.

### Relevance to Learms

A college card should not reduce hospital evidence to a simple yes/no. Store hospital name, relationship type, source date, inspection-context wording, and any unresolved status note. Never infer clinical capacity or educational quality merely from the number of hospitals listed.

### Citation

Pakistan Medical and Dental Council. *List of Medical & Dental Colleges with Attached Teaching Hospital(s)*. Final list dated 7 November 2025. <https://pmdc.pk/Documents/Others/Recognised%20Institutes%20with%20attached%20Hospitals%20(Final%20List%20)%20%2007-11-2025%20for%20web%20-.pdf>. Accessed 2026-09-30. MED-055.

---

## Topic

Safe verification workflow for an applicant.

### Source

PM&DC directories, regulations, FAQs, and hospital list. [MED-002, MED-051–MED-055, MED-059]

### Key Finding

Before treating a college option as verified, record all of the following:

| Check | Evidence required | If unavailable |
|---|---|---|
| Exact program | Current PM&DC medical or dental directory entry | `not found`; do not infer from institution name |
| Sector and location | Same live directory row | Show retrieval date |
| Seat allocation | Same live row for the relevant session/check date | `not verified for session` |
| Admission route | Admitting authority's current prospectus/portal | Do not infer from prior-year process |
| Category/quota | Current rules and authority prospectus | `not found` |
| Teaching hospital | Dated PM&DC attached-hospital list | `not found`; do not substitute marketing claims |
| Affiliation/awarder | Current university/regulator evidence | `not found` |
| Stop-admission/court/pending note | Exact order or regulator notice | `not found`, not “none” |
| Fees | Current PM&DC cap plus college-published complete schedule | Show both; see `FEE_STRUCTURES.md` |

### Relevance to Learms

This workflow gives Learms a defensible “verify before applying” tool without converting a mutable register into a promise. It also supports audit history when a college's status, seats, hospitals, or fee treatment changes.

### Citation

Pakistan Medical and Dental Council official directories and guidance, MED-002, MED-051–MED-055, and MED-059; all accessed 2026-09-30 unless a dated PDF states otherwise.

## Data-quality limitations

- The official directory UI showed only ten rows per rendered page during capture even when 17–71 total entries were reported. A complete authoritative row export was **not found**.
- Search-engine snippets showed older or differently indexed dental seat/status values. Those values were not silently merged into the current capture.
- A current, complete, official register of institution-level court orders and stop-admission status was **not found** in this checkpoint.
- Recognition at one point in time is not proof of uninterrupted recognition, a permitted new intake, or educational quality.
