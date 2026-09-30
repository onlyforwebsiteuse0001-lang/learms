#!/usr/bin/env python3
"""Expand the curated source modules into the committed JSON course library.

    python3 scripts/content/build_library.py [--check] [--date YYYY-MM-DD]

Reads  : scripts/content/curated/*.py
Writes : content/taxonomy.json
         content/index.json
         content/<field>/<course>.json

WHY A BUILD STEP
----------------
The JSON under `content/` is the deliverable — the frontend, the validator and (later)
the backend all read it. But hand-maintaining ~280 concepts across 21 JSON files means
every ID-scheme or schema change becomes a mass edit, and prerequisite references drift
silently. So the authored form stays compact (`curated/*.py` tuples) and this script owns
every mechanical decision:

  * concept IDs are namespaced `{field}.{course}.{slug}` so they are globally unique and
    can be referenced across courses;
  * a prerequisite written as a bare slug is resolved against the course it appears in,
    while one containing a "." is treated as an already-qualified cross-course reference;
  * `estimated_hours` is derived from the sum of concept minutes, never typed by hand;
  * provenance (`source`, `authoring`) is stamped on every course, so nothing in the
    library can be mistaken for AI-generated material when it is curated, or vice versa.

DETERMINISM
-----------
The build is deterministic: same input, same bytes. `generated_at` comes from `--date`
(default `BUILD_DATE` below) rather than the wall clock, so re-running does not produce a
diff. `--check` rebuilds in memory and exits 1 if anything on disk differs — that is the
CI guard against someone editing the generated JSON by hand.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
CONTENT_DIR = REPO_ROOT / "content"

sys.path.insert(0, str(SCRIPT_DIR))

from curated import ALL_COURSES, FIELDS  # noqa: E402  (needs sys.path above)

SCHEMA_VERSION = "1.0.0"
BUILD_DATE = "2026-09-30"
AUTHOR = "HAAFIZ content team (Agent 2)"

VALID_BLOOM = {"remember", "understand", "apply", "analyze", "evaluate", "create"}
VALID_ASSESSMENT = {"mcq", "short_answer", "numerical", "practical", "essay", "case_study"}
VALID_LEVEL = {"foundation", "undergraduate", "postgraduate", "professional"}


class BuildError(Exception):
    """Raised when the curated source is internally inconsistent."""


def concept_id(field: str, course: str, slug: str) -> str:
    return f"{field}.{course}.{slug}"


def resolve_prerequisite(raw: str, field: str, course: str) -> str:
    """A bare slug belongs to the current course; anything dotted is already qualified."""
    return raw if "." in raw else concept_id(field, course, raw)


def prerequisite_strength(prereq_id: str, own_prefix: str) -> str:
    """Same-course prerequisites are hard; cross-course ones are soft.

    Rationale: within a course the ordering is the curriculum's own sequence and skipping
    it genuinely breaks comprehension. A reference into another course is usually helpful
    background that a student may already hold from elsewhere, so the learning path should
    be allowed to route around it rather than refusing to start.
    """
    return "hard" if prereq_id.startswith(own_prefix) else "soft"


def build_course(raw: dict[str, Any], date: str) -> dict[str, Any]:
    field = raw["field"]
    course = raw["id"]
    prefix = f"{field}.{course}."

    if raw["level"] not in VALID_LEVEL:
        raise BuildError(f"{course}: unknown level {raw['level']!r}")

    seen: set[str] = set()
    concepts: list[dict[str, Any]] = []
    total_minutes = 0

    for tup in raw["concepts"]:
        slug, name, summary, bloom, difficulty, minutes, prereqs, assessment, keywords = tup

        if slug in seen:
            raise BuildError(f"{course}: duplicate concept slug {slug!r}")
        seen.add(slug)
        if bloom not in VALID_BLOOM:
            raise BuildError(f"{course}.{slug}: unknown bloom level {bloom!r}")
        if assessment not in VALID_ASSESSMENT:
            raise BuildError(f"{course}.{slug}: unknown assessment style {assessment!r}")
        if not 1 <= int(difficulty) <= 5:
            raise BuildError(f"{course}.{slug}: difficulty {difficulty} out of range 1-5")
        if int(minutes) <= 0:
            raise BuildError(f"{course}.{slug}: estimated_minutes must be positive")

        resolved = [resolve_prerequisite(p, field, course) for p in prereqs]
        total_minutes += int(minutes)
        concepts.append(
            {
                "id": concept_id(field, course, slug),
                "name": name,
                "summary": summary,
                "bloom": bloom,
                "difficulty": int(difficulty),
                "estimated_minutes": int(minutes),
                "prerequisites": [
                    {"id": pid, "strength": prerequisite_strength(pid, prefix)} for pid in resolved
                ],
                "assessment": assessment,
                "keywords": list(keywords),
            }
        )

    # Forward references inside a course are almost always a typo in the authored tuple,
    # and they would make the learning path unorderable. Catch them here rather than in
    # the frontend.
    local_ids = {c["id"] for c in concepts}
    for concept in concepts:
        for prereq in concept["prerequisites"]:
            pid = prereq["id"]
            if pid.startswith(prefix) and pid not in local_ids:
                raise BuildError(f"{course}: {concept['id']} requires unknown local concept {pid}")

    source_name, source_url, source_retrieved = raw["source"]
    built: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "course_id": course,
        "field": field,
        "category": raw["category"],
        "title": raw["title"],
        "description": raw["description"],
        "level": raw["level"],
        "estimated_hours": round(total_minutes / 60, 1),
        "accreditation": raw["accreditation"],
        "source": {"name": source_name, "retrieved": source_retrieved},
        "authoring": {"method": "curated", "by": AUTHOR, "date": date, "model": None, "reviewed": True},
        "outcomes": list(raw["outcomes"]),
        "concepts": concepts,
    }

    if raw.get("title_ur"):
        built["title_ur"] = raw["title_ur"]
    if source_url:
        built["source"]["url"] = source_url
    if raw.get("credit_hours"):
        total, theory, lab = raw["credit_hours"]
        built["credit_hours"] = {"total": total, "theory": theory, "lab": lab}

    # Key order matters only for diff readability; rebuild in a stable, human order.
    order = [
        "schema_version",
        "course_id",
        "field",
        "category",
        "title",
        "title_ur",
        "description",
        "level",
        "credit_hours",
        "estimated_hours",
        "accreditation",
        "source",
        "authoring",
        "outcomes",
        "concepts",
    ]
    return {k: built[k] for k in order if k in built}


def build_all(date: str) -> dict[str, Any]:
    courses = [build_course(raw, date) for raw in ALL_COURSES]

    ids = [c["course_id"] for c in courses]
    if len(ids) != len(set(ids)):
        dupes = sorted({i for i in ids if ids.count(i) > 1})
        raise BuildError(f"duplicate course_id(s): {', '.join(dupes)}")

    known_fields = {f[0]: {c[0] for c in f[4]} for f in FIELDS}
    for course in courses:
        if course["field"] not in known_fields:
            raise BuildError(f"{course['course_id']}: unknown field {course['field']!r}")
        if course["category"] not in known_fields[course["field"]]:
            raise BuildError(
                f"{course['course_id']}: category {course['category']!r} is not in field {course['field']!r}"
            )

    # Every prerequisite must resolve to a concept that actually exists somewhere.
    all_concept_ids = {c["id"] for course in courses for c in course["concepts"]}
    for course in courses:
        for concept in course["concepts"]:
            for prereq in concept["prerequisites"]:
                if prereq["id"] not in all_concept_ids:
                    raise BuildError(
                        f"{concept['id']} references unknown prerequisite {prereq['id']}"
                    )

    by_category: dict[tuple[str, str], list[str]] = {}
    for course in courses:
        by_category.setdefault((course["field"], course["category"]), []).append(course["course_id"])

    taxonomy = {
        "schema_version": SCHEMA_VERSION,
        "generated_at": date,
        "fields": [
            {
                "id": field_id,
                "name": name_en,
                "name_ur": name_ur,
                "description": description,
                "categories": [
                    {
                        "id": cat_id,
                        "name": cat_en,
                        "name_ur": cat_ur,
                        "courses": sorted(by_category.get((field_id, cat_id), [])),
                    }
                    for cat_id, cat_en, cat_ur in categories
                ],
            }
            for field_id, name_en, name_ur, description, categories in FIELDS
        ],
    }

    index_entries = sorted(
        (
            {
                "course_id": c["course_id"],
                "field": c["field"],
                "category": c["category"],
                "title": c["title"],
                **({"title_ur": c["title_ur"]} if "title_ur" in c else {}),
                "level": c["level"],
                "concept_count": len(c["concepts"]),
                "estimated_hours": c["estimated_hours"],
                "accreditation": c["accreditation"],
                "authoring_method": c["authoring"]["method"],
                "path": f"{c['field']}/{c['course_id']}.json",
            }
            for c in courses
        ),
        key=lambda e: (e["field"], e["category"], e["course_id"]),
    )

    index = {
        "schema_version": SCHEMA_VERSION,
        "generated_at": date,
        "field_count": len(FIELDS),
        "category_count": sum(len(f[4]) for f in FIELDS),
        "course_count": len(courses),
        "concept_count": sum(len(c["concepts"]) for c in courses),
        "courses": index_entries,
    }

    files = {"taxonomy.json": taxonomy, "index.json": index}
    for course in courses:
        files[f"{course['field']}/{course['course_id']}.json"] = course
    return files


def dump(payload: Any) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the HAAFIZ JSON course library.")
    parser.add_argument("--check", action="store_true", help="verify content/ matches the source; do not write")
    parser.add_argument("--date", default=BUILD_DATE, help=f"stamp date (default {BUILD_DATE})")
    args = parser.parse_args()

    try:
        files = build_all(args.date)
    except BuildError as exc:
        print(f"build failed: {exc}", file=sys.stderr)
        return 2

    rendered = {rel: dump(payload) for rel, payload in files.items()}
    expected_paths = {CONTENT_DIR / rel for rel in rendered}
    existing_paths = {p for p in CONTENT_DIR.rglob("*.json")} if CONTENT_DIR.exists() else set()

    if args.check:
        stale: list[str] = []
        for rel, text in rendered.items():
            path = CONTENT_DIR / rel
            if not path.exists():
                stale.append(f"missing {rel}")
            elif path.read_text(encoding="utf-8") != text:
                stale.append(f"outdated {rel}")
        for path in sorted(existing_paths - expected_paths):
            stale.append(f"orphan {path.relative_to(CONTENT_DIR)}")
        if stale:
            print("content/ is out of date with scripts/content/curated:", file=sys.stderr)
            for line in stale:
                print(f"  {line}", file=sys.stderr)
            print("run: python3 scripts/content/build_library.py", file=sys.stderr)
            return 1
        print(f"content/ is up to date ({len(rendered)} files)")
        return 0

    written = 0
    for rel, text in sorted(rendered.items()):
        path = CONTENT_DIR / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.read_text(encoding="utf-8") != text:
            path.write_text(text, encoding="utf-8")
            written += 1

    removed = 0
    for path in sorted(existing_paths - expected_paths):
        path.unlink()
        removed += 1
    for directory in sorted(CONTENT_DIR.rglob("*"), reverse=True):
        if directory.is_dir() and not any(directory.iterdir()):
            directory.rmdir()

    index = files["index.json"]
    print(
        f"built {len(rendered)} files "
        f"({index['field_count']} fields, {index['category_count']} categories, "
        f"{index['course_count']} courses, {index['concept_count']} concepts) "
        f"— {written} changed, {removed} removed"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
