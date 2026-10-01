#!/usr/bin/env python3
"""Generate a syllabus for a course that is not yet curated, using an LLM.

    export OPENAI_API_KEY=sk-...            # or ANTHROPIC_API_KEY
    python3 scripts/content/generate_syllabus.py \
        --field it_computing --category networks_cloud \
        --course-id computer_networks --title "Computer Networks" \
        --level undergraduate \
        --accreditation "HEC/NCEAC Computing Core" \
        --source-name "HEC Curriculum of Computing Disciplines 2023"

Exit codes: 0 written, 1 refused/failed, 2 bad arguments.

READ THIS BEFORE USING IT
-------------------------
The committed library under `content/` is hand-curated from published curricula. This
script exists to extend it into the 48 categories that have no course yet, and its output
is *categorically different*:

  * every file it writes carries `authoring.method = "ai_generated"` and the model name;
  * the Library UI renders that provenance as an amber badge next to the course title;
  * `validate_content.py` rejects `ai_generated` content that does not name its model.

It will NOT invent content silently and it will NOT run without a real API key. There is
no `--offline`, no sample mode and no bundled fixture: a syllabus that nobody generated
and nobody curated is exactly the "fake output" this project forbids. Without a key the
script prints what it would have done and exits 1.

Everything it produces is unreviewed. Set `--reviewed` only after a human has actually
read the file, because that flag is what the UI and the validator treat as a claim of
editorial responsibility.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import textwrap
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
CONTENT_DIR = REPO_ROOT / "content"

sys.path.insert(0, str(SCRIPT_DIR))

from curated import FIELDS  # noqa: E402

SCHEMA_VERSION = "1.0.0"
BLOOM = ["remember", "understand", "apply", "analyze", "evaluate", "create"]
ASSESSMENT = ["mcq", "short_answer", "numerical", "practical", "essay", "case_study"]
LEVELS = ["foundation", "undergraduate", "postgraduate", "professional"]

PROVIDERS = {
    "openai": {
        "env": "OPENAI_API_KEY",
        "url": "https://api.openai.com/v1/chat/completions",
        "default_model": "gpt-4o-mini",
    },
    "anthropic": {
        "env": "ANTHROPIC_API_KEY",
        "url": "https://api.anthropic.com/v1/messages",
        "default_model": "claude-3-5-sonnet-latest",
    },
}

SYSTEM_PROMPT = """You are a curriculum designer for Pakistani higher education.
You write syllabi that match HEC, PEC, PM&DC, ICAP, ICMAP and ACCA published curricula.
You return JSON only — no prose, no markdown fences.
If you are not confident a topic belongs in the named course, leave it out rather than
padding the list."""

USER_TEMPLATE = """Produce a concept-level syllabus for this course.

field: {field}
category: {category}
course_id: {course_id}
title: {title}
level: {level}
accreditation: {accreditation}
reference curriculum: {source_name}

Return a JSON object with exactly these keys:

  "description": one or two sentences on what the course covers.
  "outcomes":    3-5 measurable learning outcomes, each starting with a verb.
  "concepts":    {count} objects, ordered so that prerequisites always come first.

Each concept object has:
  "slug":              lower_snake_case, unique within this course
  "name":              short title
  "summary":           one sentence on what the learner must be able to do or explain
  "bloom":             one of {bloom}
  "difficulty":        integer 1-5
  "estimated_minutes": integer 20-120, realistic focused study time
  "prerequisites":     list of slugs from THIS list that must be learned first (may be empty)
  "assessment":        one of {assessment}
  "keywords":          2-5 short keywords

Hard rules:
 - prerequisites must only reference slugs that appear earlier in the list;
 - no concept may reference itself;
 - cover the real syllabus, not a generic introduction to the subject."""


def fail(message: str, code: int = 1) -> int:
    print(f"generate_syllabus: {message}", file=sys.stderr)
    return code


def resolve_provider(requested: str | None) -> tuple[str, str] | None:
    """Return (provider, api_key), or None if no usable key is present."""
    candidates = [requested] if requested else list(PROVIDERS)
    for name in candidates:
        spec = PROVIDERS.get(name)
        if not spec:
            continue
        key = os.environ.get(spec["env"], "").strip()
        # Reject the obvious placeholders people leave in a .env file, otherwise the
        # script "runs" and produces a confusing HTTP 401 instead of a clear refusal.
        if key and not key.lower().startswith(("your", "sk-xxx", "changeme", "placeholder")):
            return name, key
    return None


def call_openai(url: str, key: str, model: str, prompt: str, timeout: int) -> str:
    payload = {
        "model": model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        body = json.loads(response.read().decode("utf-8"))
    return body["choices"][0]["message"]["content"]


def call_anthropic(url: str, key: str, model: str, prompt: str, timeout: int) -> str:
    payload = {
        "model": model,
        "max_tokens": 8000,
        "temperature": 0.2,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": prompt}],
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        body = json.loads(response.read().decode("utf-8"))
    return "".join(block.get("text", "") for block in body.get("content", []))


def parse_model_json(raw: str) -> dict[str, Any]:
    text = raw.strip()
    if text.startswith("```"):  # strip a fence the model was told not to add
        text = text.split("\n", 1)[1] if "\n" in text else text
        text = text.rsplit("```", 1)[0]
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("model response contained no JSON object")
    return json.loads(text[start : end + 1])


def shape_course(args: argparse.Namespace, generated: dict[str, Any], model: str) -> dict[str, Any]:
    """Convert the model's loose output into the strict library schema.

    The model is not trusted with ids, hours or provenance — those are computed here so
    an AI-generated file is structurally identical to a curated one and passes the same
    validator.
    """
    prefix = f"{args.field}.{args.course_id}."
    raw_concepts = generated.get("concepts")
    if not isinstance(raw_concepts, list) or not raw_concepts:
        raise ValueError("model returned no concepts")

    slugs: list[str] = []
    for item in raw_concepts:
        slug = str(item.get("slug", "")).strip()
        if not slug:
            raise ValueError("model returned a concept without a slug")
        if slug in slugs:
            raise ValueError(f"model returned duplicate slug '{slug}'")
        slugs.append(slug)

    concepts: list[dict[str, Any]] = []
    total_minutes = 0
    for position, item in enumerate(raw_concepts):
        slug = str(item["slug"]).strip()
        bloom = str(item.get("bloom", "")).strip()
        assessment = str(item.get("assessment", "")).strip()
        if bloom not in BLOOM:
            raise ValueError(f"{slug}: invalid bloom '{bloom}'")
        if assessment not in ASSESSMENT:
            raise ValueError(f"{slug}: invalid assessment '{assessment}'")

        difficulty = int(item.get("difficulty", 0))
        minutes = int(item.get("estimated_minutes", 0))
        if not 1 <= difficulty <= 5:
            raise ValueError(f"{slug}: difficulty {difficulty} outside 1-5")
        if not 10 <= minutes <= 240:
            raise ValueError(f"{slug}: estimated_minutes {minutes} outside 10-240")

        prerequisites = []
        for raw_prereq in item.get("prerequisites", []) or []:
            target = str(raw_prereq).strip()
            if target == slug:
                raise ValueError(f"{slug}: concept lists itself as a prerequisite")
            if target not in slugs:
                raise ValueError(f"{slug}: unknown prerequisite '{target}'")
            if slugs.index(target) >= position:
                raise ValueError(f"{slug}: prerequisite '{target}' is not defined earlier")
            prerequisites.append({"id": prefix + target, "strength": "hard"})

        total_minutes += minutes
        concepts.append(
            {
                "id": prefix + slug,
                "name": str(item.get("name", slug)).strip(),
                "summary": str(item.get("summary", "")).strip(),
                "bloom": bloom,
                "difficulty": difficulty,
                "estimated_minutes": minutes,
                "prerequisites": prerequisites,
                "assessment": assessment,
                "keywords": [str(k).strip() for k in item.get("keywords", []) if str(k).strip()],
            }
        )

    outcomes = [str(o).strip() for o in generated.get("outcomes", []) if str(o).strip()]
    if not outcomes:
        raise ValueError("model returned no learning outcomes")

    course: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "course_id": args.course_id,
        "field": args.field,
        "category": args.category,
        "title": args.title,
        "description": str(generated.get("description", "")).strip() or f"{args.title}.",
        "level": args.level,
        "estimated_hours": round(total_minutes / 60, 1),
        "accreditation": args.accreditation,
        "source": {"name": args.source_name, "retrieved": args.date},
        "authoring": {
            "method": "ai_generated",
            "by": "scripts/content/generate_syllabus.py",
            "date": args.date,
            "model": model,
            "reviewed": bool(args.reviewed),
        },
        "outcomes": outcomes,
        "concepts": concepts,
    }
    if args.source_url:
        course["source"]["url"] = args.source_url
    if args.title_ur:
        course["title_ur"] = args.title_ur
    return course


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate an AI syllabus for an uncurated course.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent(
            """\
            Requires OPENAI_API_KEY or ANTHROPIC_API_KEY. Without one the script explains
            what it would have generated and exits 1 — it never writes invented content
            under a curated-looking provenance stamp.
            """
        ),
    )
    parser.add_argument("--field", required=True)
    parser.add_argument("--category", required=True)
    parser.add_argument("--course-id", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--title-ur", default=None)
    parser.add_argument("--level", default="undergraduate", choices=LEVELS)
    parser.add_argument("--accreditation", default="Not accredited / general study")
    parser.add_argument("--source-name", required=True, help="the curriculum the model should follow")
    parser.add_argument("--source-url", default=None)
    parser.add_argument("--count", type=int, default=12, help="number of concepts to request (default 12)")
    parser.add_argument("--provider", choices=sorted(PROVIDERS), default=None)
    parser.add_argument("--model", default=None)
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--reviewed", action="store_true", help="only after a human has read the output")
    parser.add_argument("--dry-run", action="store_true", help="print the JSON instead of writing it")
    args = parser.parse_args()

    taxonomy = {f[0]: {c[0] for c in f[4]} for f in FIELDS}
    if args.field not in taxonomy:
        return fail(f"unknown field '{args.field}'. Known: {', '.join(sorted(taxonomy))}", 2)
    if args.category not in taxonomy[args.field]:
        known = ", ".join(sorted(taxonomy[args.field]))
        return fail(f"category '{args.category}' is not in field '{args.field}'. Known: {known}", 2)
    if not 4 <= args.count <= 40:
        return fail("--count must be between 4 and 40", 2)

    target = CONTENT_DIR / args.field / f"{args.course_id}.json"
    if target.exists():
        existing = json.loads(target.read_text(encoding="utf-8"))
        method = existing.get("authoring", {}).get("method")
        if method == "curated":
            return fail(
                f"{target.relative_to(REPO_ROOT)} is curated content. "
                "Refusing to overwrite hand-written material with generated text."
            )
        print(f"note: overwriting existing {method} file {target.relative_to(REPO_ROOT)}", file=sys.stderr)

    resolved = resolve_provider(args.provider)
    if not resolved:
        envs = ", ".join(spec["env"] for spec in PROVIDERS.values())
        print(
            textwrap.dedent(
                f"""\
                REFUSING TO GENERATE — no LLM API key found.

                  wanted : {args.count} concepts for "{args.title}"
                           ({args.field}/{args.category}, level {args.level})
                  target : content/{args.field}/{args.course_id}.json
                  needs  : one of {envs}

                This script has no offline or sample mode on purpose. Writing a plausible
                syllabus that no model produced and no human curated would be fabricated
                content, and the library's provenance stamps would then be lying.

                Either export a real key and re-run, or add the course by hand to
                scripts/content/curated/ and run build_library.py.
                """
            ),
            file=sys.stderr,
        )
        return 1

    provider, key = resolved
    spec = PROVIDERS[provider]
    model = args.model or spec["default_model"]
    prompt = USER_TEMPLATE.format(
        field=args.field,
        category=args.category,
        course_id=args.course_id,
        title=args.title,
        level=args.level,
        accreditation=args.accreditation,
        source_name=args.source_name,
        count=args.count,
        bloom=BLOOM,
        assessment=ASSESSMENT,
    )

    print(f"requesting {args.count} concepts from {provider}:{model} …", file=sys.stderr)
    try:
        caller = call_openai if provider == "openai" else call_anthropic
        raw = caller(spec["url"], key, model, prompt, args.timeout)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:400]
        return fail(f"{provider} returned HTTP {exc.code}: {detail}")
    except urllib.error.URLError as exc:
        return fail(f"could not reach {provider}: {exc.reason}")
    except (KeyError, IndexError, json.JSONDecodeError) as exc:
        return fail(f"unexpected response shape from {provider}: {exc}")

    try:
        course = shape_course(args, parse_model_json(raw), model)
    except (ValueError, TypeError, json.JSONDecodeError) as exc:
        return fail(f"model output rejected: {exc}")

    rendered = json.dumps(course, ensure_ascii=False, indent=2) + "\n"
    if args.dry_run:
        print(rendered)
        print(f"dry run — nothing written to {target.relative_to(REPO_ROOT)}", file=sys.stderr)
        return 0

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(rendered, encoding="utf-8")
    print(f"wrote {target.relative_to(REPO_ROOT)} ({len(course['concepts'])} concepts, ai_generated)")
    print(
        "next: add the course to a curated module or to taxonomy coverage, then run\n"
        "  python3 scripts/content/validate_content.py",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
