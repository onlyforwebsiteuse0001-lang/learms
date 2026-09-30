# Agent 7 — Session State (crash-recovery entry point)

**Agent:** Agent 7 — Accounting Deep Research
**Branch:** `arena/01a0f47b-learms`
**Session start (UTC):** 2026-09-30T22:43Z
**Mode:** Research only. No application code. Outputs are `.md`, `.json`, `.csv`, `.yaml`.

---

## If you are resuming after a crash, do this in order

1. Read this file.
2. Read `docs/accounting-research/PROGRESS-7.md` → the checkpoint table is the source of truth
   for what is finished.
3. Read `docs/accounting-research/BLOCKERS-7.md` → do not re-attempt anything listed as
   permanently blocked; it will waste the session.
4. Read `docs/accounting-research/DECISIONS-7.md` → standing decisions, including the branch
   deviation, must be honoured.
5. Run `git log --oneline -20` on `arena/01a0f47b-learms`.
6. Resume at the first area marked ⬜ or 🟡 in `PROGRESS-7.md`.

---

## Fixed context (do not re-derive)

### Repository

`onlyforwebsiteuse0001-lang/learms` — product name **HAAFIZ EDU / Learms**. `main` contains
only a stub `README.md`. All substance lives on agent branches.

### Agent 1's branch (`arena/01a0f3e4-learms`, open PR #1)

Fetched locally as `origin/agent1`. Read with `git show origin/agent1:<path>`.
Relevant artefacts already reviewed:
- `docs/ARCHITECTURE.md` — FastAPI + async SQLAlchemy + PostgreSQL; Redis split for
  cache/broker/results; Celery for OCR/extraction; React PWA behind Nginx proxying `/api`.
- `docs/RESEARCH_DOMAIN.md` — BKT, FSRS, contextual bandits (Beta Thompson Sampling),
  Socratic tutor ladder, evidence-grounded LLM extraction, prerequisite DAG with online cycle
  rejection via NetworkX.
- `backend/app/models/learning.py` — **the schema Agent 7's taxonomy must fit.**

### The schema Agent 7 is writing for

```
Concept(concept_id, student_id, course_key, name, normalized_name, description,
        difficulty:int=1, phase:str="foundation", extraction_method, confidence:float,
        evidence:text, created_at)

Prerequisite(prerequisite_id, student_id, prerequisite_concept_id, concept_id,
             confidence:float, evidence:text, extraction_method, approved:bool=False)

ConceptDocument(concept_id, document_id, evidence)
DiagnosticSession(...), PathStatus{active,superseded,complete}
```

Design constraints inherited from Agent 1 that Agent 7's data must respect:
- Prerequisite edges are **directed and must form a DAG**; cycles are rejected online.
- Every concept and every edge requires `evidence` (a source snippet) and a `confidence`.
- `extraction_method` must honestly record provenance. Agent 7's seeds should use a value
  such as `agent7_curriculum_research` so they are never mistaken for LLM extractions.
- Concepts are **student-owned** (`student_id` is non-null). Agent 7 ships *templates*;
  Agent 1 must clone them per student or relax the ownership model. **This is a real design
  question flagged to Agent 1 in `RECOMMENDATIONS.md`.**

### Vocabulary Agent 7 has standardised on

- `course_key`: `icmap.cma2025.<CODE>`, `acca.2025.<CODE>`, `icap.ca.<CODE>`
- `phase`: `foundation` | `intermediate` | `advanced` | `applied`
- `difficulty`: integer 1–5

---

## Standing rules for this agent

- Every finding carries a source with a tier grade (A–E, defined in `RESEARCH_PLAN.md`).
- Tier-A (official body) beats the task brief whenever they conflict; the conflict goes into
  `docs/accounting-research/CONTRADICTIONS.md`.
- "Not found" is written down, never filled in with plausible text.
- Aggregator salary figures (salaryexpert, ERI, Payscale) are **Tier E** and must be labelled
  as unverified wherever used.
- Commit message form: `research-accounting: [topic] - [finding]`.
