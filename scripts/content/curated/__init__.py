"""Curated source data for the HAAFIZ course library.

WHY THIS LIVES IN PYTHON AND NOT DIRECTLY IN JSON
-------------------------------------------------
`content/**/*.json` is the deliverable and is committed. These modules are its *source*:
compact tuples that `scripts/content/build_library.py` expands into the full JSON shape
(namespacing IDs, resolving prerequisite slugs to fully-qualified IDs, summing estimated
hours, stamping provenance). Keeping the authored form compact is what makes it feasible
to curate ~20 courses accurately, and it means an ID scheme change is one edit in the
builder rather than hundreds across JSON files.

PROVENANCE
----------
Everything here is hand-curated against published curricula and each course records the
document it came from. Nothing is LLM-generated; `authoring.method` is `curated` for every
course in this package. The separate `generate_syllabus.py` script produces
`ai_generated` content and refuses to run without a real API key.

CONCEPT TUPLE SHAPE
-------------------
    (slug, name, summary, bloom, difficulty, minutes, prereq_slugs, assessment, keywords)

`prereq_slugs` are slugs local to the same course unless they contain a ".", in which case
they are treated as fully-qualified cross-course IDs.
"""

from __future__ import annotations

from .taxonomy import FIELDS
from .computing import COURSES as COMPUTING_COURSES
from .health import COURSES as HEALTH_COURSES
from .business_law import COURSES as BUSINESS_LAW_COURSES
from .engineering_sciences import COURSES as ENGINEERING_SCIENCE_COURSES
from .humanities_other import COURSES as HUMANITIES_COURSES

ALL_COURSES = [
    *COMPUTING_COURSES,
    *HEALTH_COURSES,
    *BUSINESS_LAW_COURSES,
    *ENGINEERING_SCIENCE_COURSES,
    *HUMANITIES_COURSES,
]

__all__ = ["FIELDS", "ALL_COURSES"]
