"""Tests for the content pipeline.

    python3 -m unittest discover -s tests/content -v

Only the standard library is used: `pytest` is not a dependency of this repository, and
these need to run in CI next to Agent 1's backend without adding one.

Three things are checked, in order of importance:
  1. the committed library under `content/` is internally consistent (this is the
     artefact the frontend actually ships, so it is validated as data, not as source);
  2. the builder is deterministic and rejects malformed input;
  3. the AI generator refuses to run without a real API key, and refuses to overwrite
     curated material.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_DIR = REPO_ROOT / "content"
SCRIPTS_DIR = REPO_ROOT / "scripts" / "content"

sys.path.insert(0, str(SCRIPTS_DIR))

import build_library  # noqa: E402
import validate_content  # noqa: E402
from curated import ALL_COURSES, FIELDS  # noqa: E402

BLOOM = {"remember", "understand", "apply", "analyze", "evaluate", "create"}
ASSESSMENT = {"mcq", "short_answer", "numerical", "practical", "essay", "case_study"}
LEVELS = {"foundation", "undergraduate", "postgraduate", "professional"}


def run_script(name: str, *args: str, env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    """Run one of the content scripts and capture its output."""
    environment = {**os.environ, **(env or {})}
    return subprocess.run(
        [sys.executable, str(SCRIPTS_DIR / name), *args],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
        env=environment,
    )


def load_course_files() -> list[tuple[Path, dict]]:
    files = []
    for path in sorted(CONTENT_DIR.rglob("*.json")):
        if path.name in {"taxonomy.json", "index.json"}:
            continue
        files.append((path, json.loads(path.read_text(encoding="utf-8"))))
    return files


class TestCuratedSource(unittest.TestCase):
    """The hand-written source the library is generated from."""

    def test_every_field_is_declared_once(self):
        ids = [field[0] for field in FIELDS]
        self.assertEqual(len(ids), len(set(ids)), "duplicate field id")
        self.assertEqual(len(ids), 11, "the brief specifies 11 fields")

    def test_all_68_categories_are_present(self):
        total = sum(len(field[4]) for field in FIELDS)
        self.assertEqual(total, 68, "the brief specifies 68 categories")

    def test_category_ids_are_globally_unique(self):
        ids = [category[0] for field in FIELDS for category in field[4]]
        self.assertEqual(len(ids), len(set(ids)))

    def test_every_field_has_at_least_one_course(self):
        covered = {course["field"] for course in ALL_COURSES}
        missing = sorted({field[0] for field in FIELDS} - covered)
        self.assertEqual(missing, [], f"fields with no course at all: {missing}")

    def test_course_ids_are_unique(self):
        ids = [course["id"] for course in ALL_COURSES]
        self.assertEqual(len(ids), len(set(ids)))

    def test_every_course_names_a_real_category(self):
        pairs = {(field[0], category[0]) for field in FIELDS for category in field[4]}
        for course in ALL_COURSES:
            with self.subTest(course=course["id"]):
                self.assertIn((course["field"], course["category"]), pairs)

    def test_every_course_cites_a_source(self):
        # Provenance is the point of a curated library; an uncited course is unusable.
        # In the curated source a source is the tuple (name, url, retrieved).
        for course in ALL_COURSES:
            with self.subTest(course=course["id"]):
                name, url, retrieved = course["source"]
                self.assertTrue(name.strip())
                self.assertTrue(retrieved.strip())
                if url:
                    self.assertTrue(url.startswith("http"))

    def test_every_course_has_outcomes_and_concepts(self):
        for course in ALL_COURSES:
            with self.subTest(course=course["id"]):
                self.assertGreaterEqual(len(course["outcomes"]), 3)
                self.assertGreaterEqual(len(course["concepts"]), 10)


class TestBuiltLibrary(unittest.TestCase):
    """The generated JSON under content/ — what the frontend actually loads."""

    @classmethod
    def setUpClass(cls):
        cls.courses = load_course_files()
        cls.taxonomy = json.loads((CONTENT_DIR / "taxonomy.json").read_text(encoding="utf-8"))
        cls.index = json.loads((CONTENT_DIR / "index.json").read_text(encoding="utf-8"))

    def test_library_exists(self):
        self.assertTrue(self.courses, "content/ is empty — run scripts/content/build_library.py")

    def test_index_matches_the_files_on_disk(self):
        indexed = {entry["path"] for entry in self.index["courses"]}
        actual = {str(path.relative_to(CONTENT_DIR)) for path, _ in self.courses}
        self.assertEqual(indexed, actual)

    def test_index_counts_are_accurate(self):
        self.assertEqual(self.index["course_count"], len(self.courses))
        self.assertEqual(
            self.index["concept_count"],
            sum(len(course["concepts"]) for _, course in self.courses),
        )

    def test_each_course_lives_at_the_path_its_ids_imply(self):
        for path, course in self.courses:
            with self.subTest(path=str(path)):
                expected = CONTENT_DIR / course["field"] / f"{course['course_id']}.json"
                self.assertEqual(path, expected)

    def test_concept_ids_are_fully_qualified_and_unique(self):
        seen: set[str] = set()
        for _, course in self.courses:
            prefix = f"{course['field']}.{course['course_id']}."
            for concept in course["concepts"]:
                with self.subTest(concept=concept["id"]):
                    self.assertTrue(concept["id"].startswith(prefix))
                    self.assertNotIn(concept["id"], seen)
                    seen.add(concept["id"])

    def test_enums_and_ranges_are_valid(self):
        for _, course in self.courses:
            self.assertIn(course["level"], LEVELS)
            for concept in course["concepts"]:
                with self.subTest(concept=concept["id"]):
                    self.assertIn(concept["bloom"], BLOOM)
                    self.assertIn(concept["assessment"], ASSESSMENT)
                    self.assertTrue(1 <= concept["difficulty"] <= 5)
                    self.assertTrue(10 <= concept["estimated_minutes"] <= 240)

    def test_every_prerequisite_resolves(self):
        known = {
            concept["id"] for _, course in self.courses for concept in course["concepts"]
        }
        for _, course in self.courses:
            for concept in course["concepts"]:
                for prereq in concept["prerequisites"]:
                    with self.subTest(concept=concept["id"], prereq=prereq["id"]):
                        self.assertIn(prereq["id"], known)
                        self.assertIn(prereq["strength"], {"hard", "soft"})

    def test_prerequisite_graph_is_acyclic(self):
        graph = {
            concept["id"]: [p["id"] for p in concept["prerequisites"]]
            for _, course in self.courses
            for concept in course["concepts"]
        }
        cycles = validate_content.find_cycles(graph)
        self.assertEqual(cycles, [], f"prerequisite cycle: {cycles}")

    def test_no_concept_is_its_own_prerequisite(self):
        for _, course in self.courses:
            for concept in course["concepts"]:
                ids = [p["id"] for p in concept["prerequisites"]]
                self.assertNotIn(concept["id"], ids)

    def test_estimated_hours_matches_the_concept_minutes(self):
        for _, course in self.courses:
            expected = round(sum(c["estimated_minutes"] for c in course["concepts"]) / 60, 1)
            with self.subTest(course=course["course_id"]):
                self.assertAlmostEqual(course["estimated_hours"], expected, delta=0.15)

    def test_authoring_provenance_is_stamped(self):
        for _, course in self.courses:
            authoring = course["authoring"]
            with self.subTest(course=course["course_id"]):
                self.assertIn(authoring["method"], {"curated", "ai_generated"})
                # An AI-generated course that cannot name its model is unattributable.
                if authoring["method"] == "ai_generated":
                    self.assertTrue(authoring.get("model"))

    def test_urdu_titles_are_actually_urdu(self):
        # The UI swaps to title_ur in the Urdu locale; a Latin string there is a bug.
        for _, course in self.courses:
            title_ur = course.get("title_ur")
            if title_ur:
                with self.subTest(course=course["course_id"]):
                    self.assertTrue(
                        any("\u0600" <= ch <= "\u06ff" for ch in title_ur),
                        f"{course['course_id']}: title_ur has no Arabic-script characters",
                    )

    def test_taxonomy_lists_every_course_under_its_category(self):
        listed = {
            course_id
            for field in self.taxonomy["fields"]
            for category in field["categories"]
            for course_id in category["courses"]
        }
        actual = {course["course_id"] for _, course in self.courses}
        self.assertEqual(listed, actual)


class TestValidator(unittest.TestCase):
    def test_the_committed_library_passes_validation(self):
        result = run_script("validate_content.py")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_find_cycles_detects_a_simple_cycle(self):
        self.assertTrue(validate_content.find_cycles({"a": ["b"], "b": ["a"]}))

    def test_find_cycles_accepts_a_dag(self):
        self.assertEqual(validate_content.find_cycles({"a": [], "b": ["a"], "c": ["b", "a"]}), [])

    def test_find_cycles_detects_a_self_loop(self):
        self.assertTrue(validate_content.find_cycles({"a": ["a"]}))

    def test_find_cycles_handles_an_empty_graph(self):
        self.assertEqual(validate_content.find_cycles({}), [])


class TestBuilder(unittest.TestCase):
    def test_check_mode_reports_the_library_is_current(self):
        # If this fails, someone edited content/ by hand instead of the curated source.
        result = run_script("build_library.py", "--check")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_build_is_deterministic(self):
        # A fixed --date means rebuilding produces no diff churn in review.
        first = run_script("build_library.py", "--check")
        second = run_script("build_library.py", "--check")
        self.assertEqual(first.returncode, second.returncode)
        self.assertEqual(first.stdout, second.stdout)

    def test_concept_id_helper(self):
        self.assertEqual(
            build_library.concept_id("it_computing", "programming_fundamentals", "loops"),
            "it_computing.programming_fundamentals.loops",
        )


class TestSyllabusGenerator(unittest.TestCase):
    """RULE 5 / D-007: no key means no output, never invented output."""

    NO_KEYS = {"OPENAI_API_KEY": "", "ANTHROPIC_API_KEY": ""}

    def test_refuses_to_run_without_an_api_key(self):
        result = run_script(
            "generate_syllabus.py",
            "--field", "it_computing",
            "--category", "networks_cloud",
            "--course-id", "computer_networks",
            "--title", "Computer Networks",
            "--source-name", "HEC Computing 2023",
            env=self.NO_KEYS,
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("REFUSING TO GENERATE", result.stderr)

    def test_writes_nothing_when_it_refuses(self):
        target = CONTENT_DIR / "it_computing" / "computer_networks.json"
        existed = target.exists()
        run_script(
            "generate_syllabus.py",
            "--field", "it_computing",
            "--category", "networks_cloud",
            "--course-id", "computer_networks",
            "--title", "Computer Networks",
            "--source-name", "HEC Computing 2023",
            env=self.NO_KEYS,
        )
        self.assertEqual(target.exists(), existed)

    def test_rejects_an_unknown_field(self):
        result = run_script(
            "generate_syllabus.py",
            "--field", "not_a_field",
            "--category", "x",
            "--course-id", "y",
            "--title", "Z",
            "--source-name", "S",
            env=self.NO_KEYS,
        )
        self.assertEqual(result.returncode, 2)

    def test_rejects_a_category_from_a_different_field(self):
        result = run_script(
            "generate_syllabus.py",
            "--field", "it_computing",
            "--category", "civil_engineering",
            "--course-id", "y",
            "--title", "Z",
            "--source-name", "S",
            env=self.NO_KEYS,
        )
        self.assertEqual(result.returncode, 2)

    def test_refuses_to_overwrite_a_curated_course(self):
        result = run_script(
            "generate_syllabus.py",
            "--field", "it_computing",
            "--category", "computer_science",
            "--course-id", "programming_fundamentals",
            "--title", "Programming Fundamentals",
            "--source-name", "S",
            env={"OPENAI_API_KEY": "sk-not-a-real-key-for-tests"},
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("curated", result.stderr)

    def test_placeholder_keys_are_treated_as_absent(self):
        # A leftover "your-key-here" in a .env must refuse, not produce a confusing 401.
        result = run_script(
            "generate_syllabus.py",
            "--field", "it_computing",
            "--category", "networks_cloud",
            "--course-id", "computer_networks",
            "--title", "Computer Networks",
            "--source-name", "S",
            env={"OPENAI_API_KEY": "your-api-key-here"},
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("REFUSING TO GENERATE", result.stderr)


class TestFrontendSync(unittest.TestCase):
    def test_public_content_mirrors_the_library(self):
        result = run_script("sync_to_frontend.py", "--check")
        self.assertEqual(
            result.returncode,
            0,
            "frontend/public/content is stale — run scripts/content/sync_to_frontend.py",
        )


if __name__ == "__main__":
    unittest.main()
