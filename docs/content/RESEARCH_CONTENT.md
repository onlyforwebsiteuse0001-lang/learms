# Research — content library (Agent 2, Phase 0)

Date: 2026-09-30.

## 1. What the curriculum actually looks like in Pakistan

Searched HEC / NCEAC / PEC primary sources. Key structural findings that shaped the schema:

- HEC's **Computing Curricula 2023** (HEC + NCEAC, Ref. No. 5-4/HEC/CURR/COMP/2023/4394, 16 Feb 2023)
  merged all previously separate computing curricula into one document and groups courses into
  **Computing Core (46 cr / 14 courses)**, **Domain Core (18 cr / 6 courses)**, **Domain Elective
  (21 cr / 7 courses)**, plus maths/science and general-education buckets
  ([NCEAC PDF](https://nceac.org.pk/Documents/Curriculums/BS%20Curriculm%20Computing%20Disciplines-2023.pdf)).
- Courses carry **credit hours written as `4 (3-1)`** — total (theory–lab). That is a real, usable
  signal for study-time estimation and is captured as `credit_hours: {total, theory, lab}`.
- Curricula state **prerequisites per course** (e.g. Object Oriented Programming requires Programming
  Fundamentals; Advanced DBMS requires Database Systems) — see the
  [UET Narowal BSCS 2023/24 mapping](https://nwl.uet.edu.pk/wp-content/uploads/2024/10/BSCS-Curriculum-for-Session-2023-and-2024-and-onwards.pdf).
  Prerequisites are a first-class edge type in the schema.
- Course specs are written as **CLOs tagged with Bloom levels** — `C1 (Remember)`, `C2 (Understand)`,
  `C3 (Apply)`, `C4 (Analyze)` — and mapped to PLOs
  ([PUCIT BS CS 2024](https://pucit.edu.pk/wp-content/uploads/2024/09/BS-Computer-Science.pdf)).
  Bloom level is therefore stored per concept: it is the single best predictor of item difficulty and
  it is what the curriculum authors themselves used.
- Course outlines decompose into **topic lists** at roughly the granularity a BKT concept node wants
  (e.g. DSA → "Hashing techniques", "Binary Heap and its applications", "Depth-first traversal")
  ([PEC Software Engineering curriculum](https://www.pec.org.pk/wp-content/uploads/2021/03/Software-Engineering.pdf)).
- Professional streams are **not** HEC-governed: PMDC governs MBBS, PEC governs engineering,
  ACCA/ICMAP/ICAP govern accountancy, HEC + Pakistan Bar Council govern the 5-year LLB. The schema
  keeps `accreditation` free-text per course so a field can name its real regulator.

Conclusion: model the unit of learning as a **concept** (a topic inside a course), not a course. A
course is a container with an ordered concept list; prerequisites form a DAG over concepts and may
cross course boundaries.

## 2. Concept granularity

A concept node is useful to a BKT engine only if a learner can plausibly be right-or-wrong about it in
a handful of items. Rules adopted:

- One concept ≈ **20–120 minutes** of study. Anything larger is split.
- A concept has exactly one Bloom level; "understand recursion" and "apply recursion" are two nodes.
- 8–20 concepts per course. Fewer means the graph cannot route around a weakness; more means the
  diagnostic cannot cover it.
- Every concept names its **assessment style** so the quiz layer knows what item type to render.

## 3. Prerequisite graph

- Must be a **DAG**. A cycle makes topological ordering impossible and Agent 1's
  `graph_service.bandit_topological_order` would have nothing to order.
  `scripts/content/validate_content.py` enforces acyclicity with an explicit cycle report.
- Cross-course edges are allowed and expected (Data Structures → Machine Learning), so IDs are
  **globally unique and namespaced**: `{field}.{course}.{concept}`.
- Edges carry `strength` (`hard` = cannot start without it, `soft` = easier with it) so the path
  generator can relax soft edges when a learner is time-boxed.

## 4. Relationship to Agent 1's extraction pipeline

Agent 1's `Concept` model is **per-student and source-grounded**: `student_id`, `course_key`,
`extraction_method`, `confidence`, `evidence`. Concepts are extracted from the student's own uploads.

The content library is a **different thing** and must not be confused with it:

| | Agent 1 concepts | Agent 2 content library |
| --- | --- | --- |
| Scope | one student | global reference |
| Origin | OCR + extraction of uploaded files | curated from published curricula |
| Trust | `confidence` + `evidence` per node | editorially curated, `source` cited |
| Storage | PostgreSQL | versioned JSON in `content/` |

They meet at `course_key`. The library supplies the **canonical skeleton** — a curriculum-backed
concept list, prerequisite DAG and time estimates — that extracted per-student concepts can be aligned
to. That alignment is a backend job and is **not implemented** by Agent 2; the library is the input it
will need. This is stated plainly rather than implied to be wired up.

## 5. Generation strategy — and why most of the library is hand-curated

The brief asked for AI generation via Gemini/Groq. `scripts/content/generate_syllabus.py` implements
exactly that, including provider selection, JSON-schema-constrained prompting, retry and validation.

**No API keys are present in this sandbox** (`GEMINI_API_KEY` / `GROQ_API_KEY` / `OPENROUTER_API_KEY`
are all unset). Per Rule 5 (no fake outputs) the script **exits non-zero with a clear message** rather
than emitting invented content, and the shipped library is **hand-curated from the published curricula
cited above**. Every course file records `"authoring": {"method": "curated", ...}` or
`"method": "ai_generated"` so provenance is never ambiguous. See `DECISIONS-2.md` D-007.

## 6. Field taxonomy

The 11 top-level fields are fixed by the brief. Categories inside each field were chosen to match how
Pakistani institutions actually advertise programmes (so a student recognises their own path) rather
than an abstract ontology. `content/taxonomy.json` is the single source of truth; the frontend reads
it directly and `validate_content.py` checks every course file is reachable from it.
