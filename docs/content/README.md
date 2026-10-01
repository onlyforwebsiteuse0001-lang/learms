# Content library

A curated, versioned course library for Pakistani higher education: 11 fields,
68 categories, 21 courses, 280 concepts with prerequisites, difficulty, Bloom level and
time estimates.

It ships as static JSON under `content/`, is mirrored into `frontend/public/content/` at
build time, and needs no backend — the Library page works with the API switched off.

---

## 1. Why the library exists

Agent 1's pipeline extracts concepts from whatever a student uploads. That is the core
product, but it has a cold-start problem: a student with no documents yet has nothing to
learn from, and an extracted graph has nothing to be measured against.

This library is the reference spine. Its concepts are drawn from published curricula
(HEC/NCEAC, PM&DC, PNC, ICAP, ICMAP, ACCA, PEC), so a prerequisite edge in it is a
statement about a real syllabus rather than a guess.

---

## 2. What is in it

| Field | Categories | Populated | Courses |
|---|---|---|---|
| `natural_sciences` | 6 | 1 | Physics: Mechanics |
| `it_computing` | 8 | 4 | Programming Fundamentals, Web Development, AI & Machine Learning, Cyber Security, Data Science |
| `health_medicine` | 7 | 3 | MBBS Foundation, Nursing Fundamentals, Pharmaceutics |
| `business_accounting` | 7 | 3 | ACCA Financial Accounting, CMA Management Accounting, CA Financial Reporting |
| `engineering` | 7 | 3 | Structural Analysis, Thermodynamics, Electrical Circuit Analysis |
| `law` | 5 | 1 | LLB Constitutional Law |
| `education` | 5 | 1 | Teaching Methods |
| `social_sciences` | 6 | 1 | Introduction to Psychology |
| `arts_humanities` | 6 | 1 | Urdu Literature |
| `agriculture_vet` | 5 | 1 | Principles of Agronomy |
| `media_communication` | 6 | 1 | Journalism & Reporting |

**21 courses, 280 concepts, 23 JSON files, 288 KB.**

All 68 categories are declared in the taxonomy; **20 of them have a course**. The other 48
are real, intentional gaps. The Library page states the coverage out loud
("20 of 68 categories have a curated course so far") and lists every empty category with a
"coming soon" badge — it does not hide them, and it does not fill them with placeholder
courses. That is RULE 5 of the project brief applied to content.

---

## 3. On-disk layout

```
content/
├─ taxonomy.json                     11 fields → 68 categories → course ids
├─ index.json                        flat list of every course, for search
├─ it_computing/
│  ├─ programming_fundamentals.json
│  └─ …
└─ <field>/<course_id>.json
```

A course file:

```jsonc
{
  "schema_version": "1.0.0",
  "course_id": "programming_fundamentals",
  "field": "it_computing",
  "category": "computer_science",
  "title": "Programming Fundamentals (Python)",
  "title_ur": "پروگرامنگ کے بنیادی اصول",
  "description": "…",
  "level": "undergraduate",              // foundation | undergraduate | postgraduate | professional
  "credit_hours": { "total": 4, "theory": 3, "lab": 1 },   // omitted where not applicable
  "estimated_hours": 11.2,               // derived from the concept minutes
  "accreditation": "HEC/NCEAC Computing Core",
  "source": { "name": "…", "url": "https://…", "retrieved": "2026-09-30" },
  "authoring": {
    "method": "curated",                 // curated | ai_generated
    "by": "HAAFIZ content team (Agent 2)",
    "date": "2026-09-30",
    "model": null,                       // required and non-empty when ai_generated
    "reviewed": true
  },
  "outcomes": ["Translate a problem statement into an algorithm.", "…"],
  "concepts": [
    {
      "id": "it_computing.programming_fundamentals.loops",
      "name": "Loops and iteration",
      "summary": "…",
      "bloom": "apply",                  // remember|understand|apply|analyze|evaluate|create
      "difficulty": 2,                   // 1–5
      "estimated_minutes": 60,           // 10–240
      "prerequisites": [
        { "id": "it_computing.programming_fundamentals.conditionals", "strength": "hard" }
      ],
      "assessment": "practical",         // mcq|short_answer|numerical|practical|essay|case_study
      "keywords": ["for", "while", "iteration"]
    }
  ]
}
```

Two conventions:

- **Concept ids are fully qualified** — `{field}.{course_id}.{slug}` — so they are unique
  across the whole library and can be referenced across courses.
- **Prerequisite strength**: within a course, `hard` (you genuinely cannot do B without A);
  across courses, `soft` (helpful background, not a hard gate). A soft edge should never
  block a student from starting a course they enrolled in.

---

## 4. Scripts

All under `scripts/content/`, all pure standard library, all runnable from the repo root.

### `build_library.py` — expand the curated source into JSON

```bash
python3 scripts/content/build_library.py            # write content/
python3 scripts/content/build_library.py --check    # CI: non-zero if content/ is stale
python3 scripts/content/build_library.py --date 2026-09-30
```

Reads `scripts/content/curated/*.py` (the hand-written source of record) and writes the
JSON tree. It is **deterministic**: the build date is pinned, so rebuilding produces a
byte-identical tree and no diff churn in review. It writes only files whose content
changed, and deletes orphaned files and empty directories.

It refuses to produce a broken library, raising `BuildError` on a duplicate slug or course
id, an invalid enum or out-of-range value, a course naming a category that does not exist
in its field, or an unresolvable prerequisite.

### `validate_content.py` — check the JSON on disk

```bash
python3 scripts/content/validate_content.py
# content OK — 21 course files, 48 warning(s)
```

Exit 0 clean, 1 errors, 2 usage. It reads **only the JSON**, never the curated Python, so
it also covers AI-generated and hand-edited files.

Errors on: schema violations, bad enums or ranges, unresolvable prerequisites, a cycle in
the prerequisite graph (iterative DFS, so a deep graph cannot blow the stack), taxonomy /
index / course-file disagreement, `estimated_hours` not matching the concept minutes, a
file in the wrong path, duplicate ids, empty required strings, and
`authoring.method == "ai_generated"` with no `model`.

Warns on: a concept over 240 estimated minutes, `theory + lab != total`, and categories
with no courses (that last one is the 48 gaps, and is expected).

### `generate_syllabus.py` — extend the library with an LLM

```bash
export OPENAI_API_KEY=sk-…        # or ANTHROPIC_API_KEY
python3 scripts/content/generate_syllabus.py \
  --field it_computing --category networks_cloud \
  --course-id computer_networks --title "Computer Networks" \
  --source-name "HEC Curriculum of Computing Disciplines 2023" \
  --count 14
```

**It will not run without a real API key.** There is no offline mode, no sample mode and
no bundled fixture: a syllabus that no model produced and no human curated is exactly the
fabricated content this project forbids, and writing one would make the provenance stamps
a lie. Without a key it prints what it would have generated and exits 1.

It also refuses to overwrite a file whose `authoring.method` is `curated`.

Output is structurally identical to a curated file and passes the same validator, but it
is stamped `"method": "ai_generated"` with the model name, and `"reviewed": false` unless
you pass `--reviewed` — which you should only do after a human has actually read it. The
Library page renders that provenance as an amber badge next to the course title, so a
student can always tell generated material from curated material.

The model is not trusted with ids, hours or provenance; those are computed locally. Its
output is rejected outright if a concept has a duplicate slug, an invalid Bloom level or
assessment type, a difficulty or duration out of range, a self-referencing prerequisite,
or a prerequisite that is not defined earlier in the list.

### `sync_to_frontend.py` — mirror into the app

```bash
python3 scripts/content/sync_to_frontend.py
python3 scripts/content/sync_to_frontend.py --check
```

Copies `content/` → `frontend/public/content/`, comparing content rather than timestamps,
and removing orphans. `frontend/public/content/` is **generated and gitignored**; never
edit it. The frontend's `predev`, `prebuild` and `pretest` hooks run this automatically.

---

## 5. Adding a course

1. Pick the field and an existing category id from `scripts/content/curated/taxonomy.py`.
2. Add a course dict to the matching module (`computing.py`, `health.py`,
   `business_law.py`, `engineering_sciences.py`, `humanities_other.py`) — or create a new
   module and register it in `curated/__init__.py`.
3. Cite a real published curriculum in `source`. An uncited course is not curated content.
4. Order concepts so prerequisites come first, and use fully-qualified ids for any
   cross-course prerequisite.
5. Rebuild and check:

```bash
python3 scripts/content/build_library.py
python3 scripts/content/validate_content.py
python3 -m unittest discover -s tests/content
python3 scripts/content/sync_to_frontend.py
```

A concept tuple in the curated source is:

```python
(slug, name, summary, bloom, difficulty, minutes, prereq_slugs, assessment, keywords)
```

A prerequisite slug containing a `.` is treated as a fully-qualified cross-course id.

---

## 6. Tests

```bash
python3 -m unittest discover -s tests/content -v      # 36 tests
```

`tests/content/test_content_library.py` covers the curated source (uniqueness, coverage,
citations), the built library as data (ids, enums, ranges, prerequisite resolution,
acyclicity, hour arithmetic, taxonomy/index agreement, Urdu titles actually being in
Arabic script), builder determinism, and the generator's refusal to run without a key or
to overwrite curated material.

Standard library only — `pytest` is not a dependency of this repository.

---

## 7. Known limitations

- **48 of 68 categories have no course.** Deliberate: real curricula take real time to
  transcribe accurately. The UI says so rather than hiding it.
- **Nothing has been reviewed by a subject-matter expert.** Every course is transcribed
  from a published curriculum by a non-specialist. `authoring.reviewed` is `true` in the
  sense of "a human wrote and checked this against a source document", not "a professor of
  pharmacology signed it off".
- **Urdu titles only.** Concept names and summaries are English-only. Full Urdu
  translation of 280 concepts is a large, separate piece of work.
- **No exercises or question banks.** Concepts declare an `assessment` type but carry no
  items. Diagnostic and practice questions come from the backend's own generation.
- **Time estimates are judgement calls**, informed by credit hours where a curriculum
  publishes them.
