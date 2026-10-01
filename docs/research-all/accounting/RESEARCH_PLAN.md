# Agent 7 — Accounting Deep Research Plan

**Agent:** Agent 7 — Accounting Deep Research
**Repository:** `onlyforwebsiteuse0001-lang/learms` (HAAFIZ EDU / Learms)
**Branch:** `arena/01a0f47b-learms` (see "Branch deviation" below)
**Session start (UTC):** 2026-09-30T22:43Z
**Mandate:** Research only. No application code. Output limited to `.md`, `.json`, `.csv`, `.yaml`.

---

## Branch deviation (declared up front)

The brief requested branch `arena/accounting-research`. This Arena session is bound to
`arena/01a0f47b-learms`; work committed to any other branch is not tracked to the session and
would be invisible to the operator. **All research is therefore committed to
`arena/01a0f47b-learms`.** This is the only instruction in the brief that has been knowingly
varied, and it is recorded again in `DECISIONS-7.md` and `MORNING_REPORT-7.md`.

---

## Why accounting, and why CMA (ICMAP) specifically

Learms treats accounting as its second vertical after IT. Within Pakistani accounting
education the professional-qualification population is dominated by ACCA, ICAP (CA) and
ICMAP (CMA). ICMAP students are the least-researched of the three in published literature
and community discussion, so the brief assigns them the largest single block of effort.

---

## Evidence standard

Every factual claim in every deliverable carries a source. Sources are graded:

| Tier | Meaning | Examples |
|---|---|---|
| **A — Primary official** | Issued by the awarding body or regulator itself | icmap.com.pk syllabus/fee pages, ICMAP circulars (PDF), ICAP education scheme, ACCA Global, SECP/FBR |
| **B — Peer-reviewed / academic** | Journal article, thesis, conference paper with DOI or repository link | *Accounting Forum*, HEC repositories, SSRN |
| **C — Reputable secondary** | Established publisher, tuition provider, major news outlet | BPP, Kaplan, Gleim, Dawn, Business Recorder |
| **D — Community / anecdotal** | LinkedIn posts, Reddit, forums, student testimony | r/Accounting, LinkedIn posts, Facebook groups |
| **E — Unverified / modelled** | Aggregator estimate, my own arithmetic on Tier-A inputs | salaryexpert.com, my cost models |

Tier D is used **only** for lived-experience claims and is always labelled as such.
Tier E numbers are always labelled "modelled" or "unverified aggregator" and never presented
as fact. Where a figure supplied in the original brief conflicts with a Tier-A source, the
Tier-A source wins and the conflict is documented in `CONTRADICTIONS.md`.

**"Not found" is a valid result** and is written down rather than filled with plausible text.

---

## Currency of data

Target window: **2025–2026**. ICMAP Study Scheme-2025 (effective 16 July 2025) is the
reference scheme; the 2016/2018/2023 schemes are treated as legacy and only referenced for
transition rules. Fee figures are dated to the circular that set them.

---

## Area schedule

| # | Area | Primary deliverable folder |
|---|---|---|
| 0 | Setup + context (Agent 1 schema alignment) | root |
| 1 | Accounting taxonomy — programs, structures, specialisations | `taxonomy/` |
| 2 | **CMA (ICMAP) deep dive — highest priority** | `cma-deep/` |
| 3 | ACCA deep dive | `acca-deep/` |
| 4 | CA (ICAP) deep dive | `ca-deep/` |
| 5 | CMA vs ACCA vs CA comparison | `comparison/` |
| 6 | Student problems (6 dimensions) | `problems/` |
| 7 | Solutions (6 dimensions) | `solutions/` |
| 8 | Books and study resources | `books/` |
| 9 | UI/UX for accounting learning | `ui-ux/` |
| 10 | Pakistan accounting industry | `pakistan/` |
| 11 | Tools and platforms | `tools/` |
| 12 | Research papers | `papers/` |
| 13 | Career paths and salaries | `career/` |
| 14 | Pakistan regulatory / tax / Islamic finance | `pakistan/` |
| 15 | Synthesis, key findings, recommendations, gaps | root |

Machine-readable seed data for Agent 1 lives in `data/`.

---

## Consumers of this research

| Agent | What they get |
|---|---|
| **Agent 1 (Backend)** | Concept lists + prerequisite edges shaped to the existing `Concept` / `Prerequisite` SQLAlchemy models (`name`, `description`, `difficulty`, `phase`, `confidence`, `evidence`). Course keys, difficulty scales, phase vocabulary. |
| **Agent 2 (Frontend/Content)** | Accounting-specific UI patterns (T-accounts, journal-entry widgets, statement drill-down), content sequencing, exam-practice UX, and the constraints Pakistani students actually study under (mobile, data cost, load-shedding). |
| **Agent 3 (Security)** | What financial data a learning platform does and does not need to touch; PCI-DSS applicability boundary; Pakistani data-protection posture. |
| **Agent 4 (General)** | Non-overlapping complementary areas, with an explicit list of what Agent 7 did *not* cover. |

---

## Checkpoint protocol

Commit at every meaningful research milestone with message form:

```
research-accounting: [topic] - [finding]
```

`PROGRESS-7.md` is updated at each checkpoint. `BLOCKERS-7.md` records anything that could
not be verified. `SESSION-STATE-7.md` is the crash-recovery entry point.
