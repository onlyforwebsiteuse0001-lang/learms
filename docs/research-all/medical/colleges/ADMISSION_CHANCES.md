# MBBS/BDS Admission Chances — Evidence Model, Not Unsupported Probability

**Evidence cutoff:** 2026-09-30
**Scope:** Pakistan undergraduate MBBS/BDS admission
**Safety statement:** Passing eligibility criteria does not establish admission probability. No unsupported individualized percentage is produced here.

## Topic

National minimum eligibility and merit formulation.

### Source

PM&DC Medical and Dental Undergraduate Education (Admissions, Curriculum and Conduct) Policy and Regulations 2025. [MED-002]

### Key Finding

For the ordinary domestic route described in regulation 3, an applicant must pass MDCAT, hold HSSC or a recognized equivalent with at least **60%**, and have passed biology and chemistry, with either physics or mathematics as the other specified subject option. Special foreign/overseas categories have separate provisions and examination alternatives; they must not be generalized to domestic open merit.

For both public and private colleges, the regulations state the following merit formulation:

\[
\text{aggregate} = 0.50(\text{MDCAT percentage}) + 0.40(\text{HSSC/equivalent percentage}) + 0.10(\text{SSC/equivalent percentage})
\]

This formula calculates an aggregate; it does **not** by itself predict selection.

### Relevance to Learms

Learms may implement a transparent aggregate calculator after confirming the applicable session's rules. It should separately display eligibility, calculated aggregate, and selection evidence.

### Citation

Pakistan Medical and Dental Council. *Medical and Dental Undergraduate Education (Admissions, Curriculum and Conduct) Policy and Regulations 2025*. Regulations 3–5. 2025. <https://pmdc.pk/Documents/Others/Admissions%20Regulations-2025.pdf>. Accessed 2026-09-30. MED-002.

---

## Topic

Why there is no single Pakistan “medical merit cutoff.”

### Source

PM&DC regulations and official 2025–26 admissions/list portals of UHS, KMU, and DUHS. [MED-002, MED-061–MED-063]

### Key Finding

Selection depends on, at minimum:

- admission session and list round;
- MBBS versus BDS;
- public versus private route;
- admitting authority;
- province/region and domicile;
- open merit versus a specifically defined quota/category;
- college preference order and upgradation;
- regulator-approved seats and over-and-above categories where legally provided;
- whether the evidence is a provisional merit list, final merit list, selection list, or final seat allocation.

The official portals demonstrate material segmentation. UHS publishes separate Punjab public MBBS/BDS lists and categories; KMU publishes open-merit, self-finance, backward-area, disability, minority, overseas/foreign, and other lists; DUHS publishes Karachi-division and reserved interior-Sindh material. These records cannot be pooled into one national cutoff. [MED-061–MED-063]

### Relevance to Learms

The UI must ask for jurisdiction, program, sector, category, domicile, and session before showing historical evidence. If those fields are missing, “chance” is **not computable from reviewed evidence**.

### Citation

University of Health Sciences Lahore. *MBBS/BDS Admissions 2025–26 — Government Medical and Dental Colleges of Punjab*. Official portal. Accessed 2026-09-30. MED-061.
Khyber Medical University. *Centralized Admissions Merit Lists*. Official portal. Accessed 2026-09-30. MED-062.
Dow University of Health Sciences. *Admissions 2025–26 — MBBS & BDS*. Official portal. Accessed 2026-09-30. MED-063.

---

## Topic

What counts as a historical closing merit.

### Source

Official admitting-authority list portals. [MED-061–MED-063]

### Key Finding

A defensible historical closing-merit observation must be the lowest selected aggregate in the **final applicable selection/allocation list** for one exact combination of:

`session + authority + program + college + category/quota + domicile/geography + list status`

The last row of a general final **order-of-merit** list is not necessarily a selected candidate. A provisional list is not final. An interview-call range is not a closing merit. A final list can still have category-specific and upgradation effects.

A consolidated official national dataset of college-by-college final closing merits was **not found**. This checkpoint therefore records source portals and methodology rather than extracting unsupported threshold claims.

### Relevance to Learms

Agent 1 should store a closing merit as a versioned observation with all dimensions above and the source document. Agent 2 should use the label “historical selected aggregate,” not “required marks” or “guaranteed cutoff.”

### Citation

Official UHS, KMU, and DUHS 2025–26 admissions/list portals, MED-061–MED-063.

---

## Topic

Evidence-safe admission-chance output.

### Source

PM&DC rules and official list structures. [MED-002, MED-051–MED-054, MED-061–MED-063]

### Key Finding

The following output levels are supportable:

| Output | Minimum evidence | Safe wording |
|---|---|---|
| Eligibility check | Exact current rule plus applicant inputs | “Meets/does not meet the reviewed minimum criteria”; not admission likelihood |
| Aggregate | Exact current formula plus normalized marks | “Calculated aggregate under the cited formula” |
| Historical comparison | Matching final selected aggregate for same dimensions | “Above/below the cited historical observation by X percentage points” |
| Range across list rounds | Multiple matching official final/intermediate selection lists | “Historical movement across published rounds”; not future guarantee |
| Probability | Calibrated multi-year applicant/selection dataset for same process, with validation | **Not found; do not display** |

Even a candidate above a prior selected aggregate may not be selected in a later session because applicant scores, preferences, categories, seat allocations, and rules change.

### Relevance to Learms

Learms can provide deterministic calculations and historical comparisons while refusing false precision. Use “insufficient evidence” when the exact category or final list is missing.

### Citation

PM&DC and admitting-authority source set MED-002, MED-051–MED-054, MED-061–MED-063.

---

## Topic

Required data model and privacy boundary.

### Source

The fields are derived from PM&DC rules and the structure of official merit/list portals. [MED-002, MED-061–MED-063]

### Key Finding

A minimum admission-evidence record should contain:

```yaml
session: "YYYY-YY"
authority: "official admitting authority"
program: "MBBS | BDS"
sector: "public | private"
college: "exact official name"
province_or_region: "..."
domicile_scope: "..."
category_or_quota: "..."
list_type: "provisional merit | final merit | selection | final allocation"
list_round: "..."
publication_date: "YYYY-MM-DD"
seat_allocation: null
historical_lowest_selected_aggregate: null
source_id: "MED-..."
source_url: "https://..."
review_status: "verified | incomplete | not found"
```

Official merit PDFs can expose names, parent names, dates of birth, domicile, roll/form numbers, or identity numbers. Learms does not need those identifiers to preserve an aggregate cutoff. Store the minimum derived observation and provenance; do not copy applicant-level personal data into the research graph.

### Relevance to Learms

This directly supports Agent 1's evidence model, Agent 2's comparison UI, and Agent 3's data-minimization controls.

### Citation

PM&DC admissions regulations, MED-002; official UHS/KMU/DUHS admissions/list portals, MED-061–MED-063.

## Required applicant inputs before any comparison

1. Target session.
2. MBBS or BDS.
3. Public or private route.
4. Province/region and admitting authority.
5. Domicile.
6. Exact category/quota.
7. SSC, HSSC/equivalent, and MDCAT percentages after applicable equivalence rules.
8. College preference set.
9. Matching official historical final selection evidence.

If any of items 1–6 or 9 is missing, an individualized probability remains **not found**.

## Known gaps

- No calibrated national probability model was found.
- No complete official national historical closing-merit dataset was found.
- Province/category rules and list URLs are mutable; only UHS, KMU, and DUHS source portals were sampled in this checkpoint.
- Gilgit-Baltistan, AJK, Balochistan, NUMS, federal/private, and other authority-specific final-list extraction remains incomplete.
