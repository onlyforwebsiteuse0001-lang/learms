#!/usr/bin/env python3
"""Validate the JSON course library under `content/`.

    python3 scripts/content/validate_content.py [--content-dir DIR] [--quiet]

Exit code 0 = valid, 1 = validation errors found, 2 = could not run.

WHY THIS IS SEPARATE FROM build_library.py
------------------------------------------
`build_library.py` validates its *own* input as it builds. This script validates the JSON
**as it exists on disk**, with no knowledge of the Python source. That matters because the
library will also receive files that the builder never produced:

  * output of `generate_syllabus.py` (AI-generated syllabi),
  * hand-edits and corrections made directly to a JSON file,
  * contributions from Agent 1 or anyone else.

So the checks here are deliberately structural rather than "does it round-trip":

  1. schema  — required keys, types, enum membership, value ranges;
  2. graph   — every prerequisite id resolves to a concept that exists, cross-file;
  3. cycles  — the prerequisite graph is a DAG, otherwise a learning path cannot be
               ordered and the UI would loop forever;
  4. wiring  — taxonomy/index agree with the course files they claim to describe;
  5. hygiene — duplicate ids, empty strings, orphan files, unreferenced categories.

Zero third-party dependencies: it must be runnable in CI or on a bare machine.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_CONTENT_DIR = REPO_ROOT / "content"

SCHEMA_VERSIONS = {"1.0.0"}
BLOOM = {"remember", "understand", "apply", "analyze", "evaluate", "create"}
ASSESSMENT = {"mcq", "short_answer", "numerical", "practical", "essay", "case_study"}
LEVELS = {"foundation", "undergraduate", "postgraduate", "professional"}
STRENGTHS = {"hard", "soft"}
METHODS = {"curated", "ai_generated"}


class Report:
    """Collects problems instead of raising, so one run reports everything."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, where: str, message: str) -> None:
        self.errors.append(f"{where}: {message}")

    def warn(self, where: str, message: str) -> None:
        self.warnings.append(f"{where}: {message}")

    @property
    def ok(self) -> bool:
        return not self.errors


def require(report: Report, where: str, obj: Any, key: str, types: tuple[type, ...]) -> Any:
    if not isinstance(obj, dict) or key not in obj:
        report.error(where, f"missing required key '{key}'")
        return None
    value = obj[key]
    if not isinstance(value, types):
        names = "/".join(t.__name__ for t in types)
        report.error(where, f"'{key}' must be {names}, got {type(value).__name__}")
        return None
    if isinstance(value, str) and not value.strip():
        report.error(where, f"'{key}' must not be empty")
        return None
    return value


def load_json(path: Path, report: Report) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        report.error(str(path), "file not found")
    except json.JSONDecodeError as exc:
        report.error(str(path), f"invalid JSON at line {exc.lineno}: {exc.msg}")
    return None


def validate_concept(report: Report, where: str, concept: Any, course_prefix: str) -> str | None:
    if not isinstance(concept, dict):
        report.error(where, "concept must be an object")
        return None

    cid = require(report, where, concept, "id", (str,))
    where = f"{where} [{cid or '?'}]"
    require(report, where, concept, "name", (str,))
    require(report, where, concept, "summary", (str,))

    if cid and not cid.startswith(course_prefix):
        report.error(where, f"id must be namespaced '{course_prefix}<slug>'")

    bloom = require(report, where, concept, "bloom", (str,))
    if bloom and bloom not in BLOOM:
        report.error(where, f"bloom '{bloom}' not one of {sorted(BLOOM)}")

    assessment = require(report, where, concept, "assessment", (str,))
    if assessment and assessment not in ASSESSMENT:
        report.error(where, f"assessment '{assessment}' not one of {sorted(ASSESSMENT)}")

    difficulty = require(report, where, concept, "difficulty", (int,))
    if isinstance(difficulty, int) and not 1 <= difficulty <= 5:
        report.error(where, f"difficulty {difficulty} outside 1-5")

    minutes = require(report, where, concept, "estimated_minutes", (int,))
    if isinstance(minutes, int):
        if minutes <= 0:
            report.error(where, "estimated_minutes must be positive")
        elif minutes > 240:
            report.warn(where, f"estimated_minutes {minutes} is very long for one concept")

    keywords = require(report, where, concept, "keywords", (list,))
    if isinstance(keywords, list) and not all(isinstance(k, str) and k.strip() for k in keywords):
        report.error(where, "keywords must all be non-empty strings")

    prereqs = require(report, where, concept, "prerequisites", (list,))
    if isinstance(prereqs, list):
        seen: set[str] = set()
        for prereq in prereqs:
            if not isinstance(prereq, dict):
                report.error(where, "each prerequisite must be an object")
                continue
            pid = require(report, where, prereq, "id", (str,))
            strength = require(report, where, prereq, "strength", (str,))
            if strength and strength not in STRENGTHS:
                report.error(where, f"prerequisite strength '{strength}' not one of {sorted(STRENGTHS)}")
            if pid:
                if pid == cid:
                    report.error(where, "concept lists itself as a prerequisite")
                if pid in seen:
                    report.error(where, f"duplicate prerequisite '{pid}'")
                seen.add(pid)

    return cid


def validate_course(report: Report, path: Path, data: Any, content_dir: Path) -> dict[str, Any] | None:
    where = str(path.relative_to(content_dir))
    if not isinstance(data, dict):
        report.error(where, "course file must contain a JSON object")
        return None

    version = require(report, where, data, "schema_version", (str,))
    if version and version not in SCHEMA_VERSIONS:
        report.error(where, f"unsupported schema_version '{version}'")

    course_id = require(report, where, data, "course_id", (str,))
    field = require(report, where, data, "field", (str,))
    require(report, where, data, "category", (str,))
    require(report, where, data, "title", (str,))
    require(report, where, data, "description", (str,))
    require(report, where, data, "accreditation", (str,))

    level = require(report, where, data, "level", (str,))
    if level and level not in LEVELS:
        report.error(where, f"level '{level}' not one of {sorted(LEVELS)}")

    if course_id and field:
        expected = content_dir / field / f"{course_id}.json"
        if path != expected:
            report.error(where, f"file should be at {expected.relative_to(content_dir)}")

    source = require(report, where, data, "source", (dict,))
    if isinstance(source, dict):
        require(report, f"{where} source", source, "name", (str,))
        require(report, f"{where} source", source, "retrieved", (str,))

    authoring = require(report, where, data, "authoring", (dict,))
    if isinstance(authoring, dict):
        method = require(report, f"{where} authoring", authoring, "method", (str,))
        if method and method not in METHODS:
            report.error(where, f"authoring.method '{method}' not one of {sorted(METHODS)}")
        require(report, f"{where} authoring", authoring, "by", (str,))
        require(report, f"{where} authoring", authoring, "date", (str,))
        # RULE 5: AI output must never be silently presented as curated material.
        if method == "ai_generated" and not authoring.get("model"):
            report.error(where, "ai_generated content must record the model that produced it")

    credit = data.get("credit_hours")
    if credit is not None:
        if not isinstance(credit, dict):
            report.error(where, "credit_hours must be an object")
        else:
            for key in ("total", "theory", "lab"):
                value = credit.get(key)
                if not isinstance(value, int) or value < 0:
                    report.error(where, f"credit_hours.{key} must be a non-negative integer")
            if all(isinstance(credit.get(k), int) for k in ("total", "theory", "lab")):
                if credit["theory"] + credit["lab"] != credit["total"]:
                    report.warn(where, "credit_hours theory + lab does not equal total")

    outcomes = require(report, where, data, "outcomes", (list,))
    if isinstance(outcomes, list):
        if not outcomes:
            report.error(where, "a course needs at least one learning outcome")
        if not all(isinstance(o, str) and o.strip() for o in outcomes):
            report.error(where, "outcomes must all be non-empty strings")

    concepts = require(report, where, data, "concepts", (list,))
    ids: list[str] = []
    if isinstance(concepts, list):
        if not concepts:
            report.error(where, "a course needs at least one concept")
        prefix = f"{field}.{course_id}." if field and course_id else ""
        for concept in concepts:
            cid = validate_concept(report, where, concept, prefix)
            if cid:
                ids.append(cid)
        duplicates = {i for i in ids if ids.count(i) > 1}
        for dup in sorted(duplicates):
            report.error(where, f"duplicate concept id '{dup}'")

    hours = data.get("estimated_hours")
    if not isinstance(hours, (int, float)) or hours <= 0:
        report.error(where, "estimated_hours must be a positive number")
    elif isinstance(concepts, list):
        minutes = sum(c.get("estimated_minutes", 0) for c in concepts if isinstance(c, dict))
        if abs(hours - round(minutes / 60, 1)) > 0.15:
            report.error(
                where,
                f"estimated_hours {hours} does not match concept minutes ({minutes} min "
                f"= {round(minutes / 60, 1)} h)",
            )

    return data


def find_cycles(edges: dict[str, set[str]]) -> list[list[str]]:
    """Return prerequisite cycles as node lists. Iterative DFS: the graph is small but a
    recursive version would still be the wrong shape for a validator that must never
    crash on bad input."""
    WHITE, GREY, BLACK = 0, 1, 2
    colour = {node: WHITE for node in edges}
    cycles: list[list[str]] = []

    for root in sorted(edges):
        if colour[root] != WHITE:
            continue
        stack: list[tuple[str, list[str]]] = [(root, [])]
        path: list[str] = []
        while stack:
            node, _ = stack[-1]
            if colour[node] == WHITE:
                colour[node] = GREY
                path.append(node)
                for nxt in sorted(edges.get(node, ())):
                    if colour.get(nxt) == GREY:
                        start = path.index(nxt)
                        cycles.append(path[start:] + [nxt])
                    elif colour.get(nxt, BLACK) == WHITE:
                        stack.append((nxt, []))
            else:
                stack.pop()
                if colour[node] == GREY:
                    colour[node] = BLACK
                    if path and path[-1] == node:
                        path.pop()
    return cycles


def validate(content_dir: Path) -> Report:
    report = Report()

    if not content_dir.is_dir():
        report.error(str(content_dir), "content directory does not exist — run build_library.py")
        return report

    taxonomy_path = content_dir / "taxonomy.json"
    index_path = content_dir / "index.json"
    taxonomy = load_json(taxonomy_path, report) if taxonomy_path.exists() else None
    index = load_json(index_path, report) if index_path.exists() else None
    if taxonomy is None:
        report.error("taxonomy.json", "missing — run build_library.py")
    if index is None:
        report.error("index.json", "missing — run build_library.py")

    course_paths = sorted(p for p in content_dir.rglob("*.json") if p.parent != content_dir)
    courses: dict[str, dict[str, Any]] = {}
    for path in course_paths:
        data = load_json(path, report)
        if data is None:
            continue
        validated = validate_course(report, path, data, content_dir)
        if validated and isinstance(validated.get("course_id"), str):
            cid = validated["course_id"]
            if cid in courses:
                report.error(str(path.relative_to(content_dir)), f"duplicate course_id '{cid}'")
            courses[cid] = validated

    # --- cross-file prerequisite graph -------------------------------------------------
    all_concepts: dict[str, str] = {}
    for course in courses.values():
        for concept in course.get("concepts", []):
            if isinstance(concept, dict) and isinstance(concept.get("id"), str):
                all_concepts[concept["id"]] = course["course_id"]

    edges: dict[str, set[str]] = {cid: set() for cid in all_concepts}
    for course in courses.values():
        where = f"{course.get('field')}/{course.get('course_id')}.json"
        for concept in course.get("concepts", []):
            if not isinstance(concept, dict):
                continue
            cid = concept.get("id")
            for prereq in concept.get("prerequisites", []) or []:
                if not isinstance(prereq, dict):
                    continue
                pid = prereq.get("id")
                if not isinstance(pid, str):
                    continue
                if pid not in all_concepts:
                    report.error(where, f"{cid} requires '{pid}' which does not exist in the library")
                elif isinstance(cid, str):
                    edges[cid].add(pid)

    for cycle in find_cycles(edges):
        report.error("prerequisite graph", "cycle: " + " -> ".join(cycle))

    # --- taxonomy / index consistency --------------------------------------------------
    if isinstance(taxonomy, dict):
        field_ids: set[str] = set()
        category_ids: set[tuple[str, str]] = set()
        listed_courses: set[str] = set()
        for field in taxonomy.get("fields", []):
            fid = field.get("id")
            if not isinstance(fid, str):
                report.error("taxonomy.json", "field without an id")
                continue
            if fid in field_ids:
                report.error("taxonomy.json", f"duplicate field '{fid}'")
            field_ids.add(fid)
            for category in field.get("categories", []):
                cat_id = category.get("id")
                if not isinstance(cat_id, str):
                    report.error("taxonomy.json", f"{fid}: category without an id")
                    continue
                if (fid, cat_id) in category_ids:
                    report.error("taxonomy.json", f"duplicate category '{fid}.{cat_id}'")
                category_ids.add((fid, cat_id))
                for course_id in category.get("courses", []):
                    listed_courses.add(course_id)
                    if course_id not in courses:
                        report.error("taxonomy.json", f"{fid}.{cat_id} lists unknown course '{course_id}'")
                if not category.get("courses"):
                    report.warn("taxonomy.json", f"{fid}.{cat_id} has no courses yet")

        for course_id, course in courses.items():
            if course.get("field") not in field_ids:
                report.error(f"{course_id}", f"field '{course.get('field')}' is not in the taxonomy")
            elif (course.get("field"), course.get("category")) not in category_ids:
                report.error(
                    f"{course_id}",
                    f"category '{course.get('category')}' is not under field '{course.get('field')}'",
                )
            if course_id not in listed_courses:
                report.error("taxonomy.json", f"course '{course_id}' exists but is not listed")

    if isinstance(index, dict):
        entries = index.get("courses", [])
        indexed = {e.get("course_id") for e in entries if isinstance(e, dict)}
        for missing in sorted(set(courses) - indexed):
            report.error("index.json", f"course '{missing}' is missing from the index")
        for extra in sorted(indexed - set(courses)):
            report.error("index.json", f"indexed course '{extra}' has no file")
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            course = courses.get(entry.get("course_id"))
            if not course:
                continue
            path = entry.get("path")
            expected_path = f"{course['field']}/{course['course_id']}.json"
            if path != expected_path:
                report.error("index.json", f"{entry.get('course_id')}: path should be '{expected_path}'")
            if entry.get("concept_count") != len(course.get("concepts", [])):
                report.error("index.json", f"{entry.get('course_id')}: concept_count is stale")
            if entry.get("estimated_hours") != course.get("estimated_hours"):
                report.error("index.json", f"{entry.get('course_id')}: estimated_hours is stale")
        if index.get("course_count") != len(courses):
            report.error("index.json", "course_count does not match the number of course files")
        if index.get("concept_count") != len(all_concepts):
            report.error("index.json", "concept_count does not match the concepts on disk")

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the HAAFIZ content library.")
    parser.add_argument("--content-dir", default=str(DEFAULT_CONTENT_DIR))
    parser.add_argument("--quiet", action="store_true", help="only print on failure")
    args = parser.parse_args()

    content_dir = Path(args.content_dir).resolve()
    report = validate(content_dir)

    for warning in report.warnings:
        print(f"warning: {warning}", file=sys.stderr)
    for error in report.errors:
        print(f"error:   {error}", file=sys.stderr)

    if not report.ok:
        print(f"\n{len(report.errors)} error(s), {len(report.warnings)} warning(s)", file=sys.stderr)
        return 1

    if not args.quiet:
        courses = [p for p in content_dir.rglob("*.json") if p.parent != content_dir]
        print(f"content OK — {len(courses)} course files, {len(report.warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
