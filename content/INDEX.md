# Content Library Index

**Validated:** `scripts/content/validate_content.py` → OK (21 course files, 48 taxonomy-gap warnings)
**Machine index:** `content/index.json` (11 fields · 68 categories · 21 courses · 280 concepts)

## Available courses (v1.5.0)

| Field | Courses | Examples |
|---|---|---|
| agriculture_vet | 1 | Principles of Agronomy |
| arts_humanities | 1 | Urdu Literature |
| business_accounting | 3 | ACCA Financial Accounting, CMA Management Accounting, CA Financial Reporting |
| education | 1 | Teaching Methods |
| engineering | 3 | Civil Structures, Circuits, Thermodynamics |
| health_medicine | 3 | MBBS Foundation, Nursing Fundamentals, Pharmacy Pharmaceutics |
| it_computing | 3 | Web Dev, AI/ML, Cybersecurity, Data Science (see `content/it_computing/`) |
| law | 1 | (see folder) |
| media_communication | 0* | categories exist, courses planned |
| natural_sciences | 1+ | (see folder) |
| social_sciences | 1+ | (see folder) |

\* 48 taxonomy-gap warnings = declared categories without courses yet — tracked honestly,
not hidden. Full list: run the validator.

## Research backing (concept-graph seeds for future content)

- `docs/research-all/it/synthesis/KNOWLEDGE_GRAPH_SEED.json`
- `docs/research-all/accounting/data/accounting_concept_graph_seed.json`
- `docs/research-all/general/pakistan_fields_taxonomy.json`
- `docs/research-all/medical/exams/EXAM_PATHWAY_GRAPH.json`

## Roadmap (v2.0 content expansion)

Priority by research demand (see `docs/research-all/*/RECOMMENDATIONS.md`):
1. IT/Computing tracks (web, AI/ML, data) — largest learner base
2. Accounting CMA/ACCA full coverage
3. Medical MDCAT + MBBS year-wise
4. media_communication, remaining taxonomy categories
