#!/usr/bin/env python3
"""Copy the canonical `content/` tree into `frontend/public/content/`.

The repository root holds the single source of truth for the course library so that the
Python validator and the React UI read the same bytes. Vite can only serve files from
`frontend/public`, so this mirrors them at dev/build time instead of maintaining a second
copy in Git that would silently drift.

`frontend/public/content/` is gitignored for exactly that reason.

Usage:
    python scripts/content/sync_to_frontend.py [--check]

    --check  exit non-zero if the mirror is missing or stale, copying nothing.
"""

from __future__ import annotations

import argparse
import filecmp
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE = REPO_ROOT / "content"
TARGET = REPO_ROOT / "frontend" / "public" / "content"


def iter_json_files(root: Path) -> list[Path]:
    return sorted(path for path in root.rglob("*.json") if path.is_file())


def sync(check_only: bool = False) -> int:
    if not SOURCE.is_dir():
        print(f"error: content directory not found at {SOURCE}", file=sys.stderr)
        return 1

    sources = iter_json_files(SOURCE)
    if not sources:
        print(f"error: no JSON files under {SOURCE}", file=sys.stderr)
        return 1

    stale: list[str] = []
    copied = 0

    for source_path in sources:
        relative = source_path.relative_to(SOURCE)
        target_path = TARGET / relative

        if check_only:
            if not target_path.exists() or not filecmp.cmp(source_path, target_path, shallow=False):
                stale.append(str(relative))
            continue

        target_path.parent.mkdir(parents=True, exist_ok=True)
        # shallow=False compares contents, so an unchanged file is not rewritten and the
        # Vite dev server does not fire a pointless reload.
        if not target_path.exists() or not filecmp.cmp(source_path, target_path, shallow=False):
            shutil.copy2(source_path, target_path)
            copied += 1

    # Remove mirrored files whose source was deleted, so the UI never serves a course
    # that no longer exists in the repository.
    removed = 0
    if not check_only and TARGET.is_dir():
        expected = {path.relative_to(SOURCE) for path in sources}
        for existing in iter_json_files(TARGET):
            if existing.relative_to(TARGET) not in expected:
                existing.unlink()
                removed += 1

    if check_only:
        if stale:
            print(f"content mirror is stale ({len(stale)} file(s)):", file=sys.stderr)
            for name in stale[:10]:
                print(f"  - {name}", file=sys.stderr)
            print("run: python scripts/content/sync_to_frontend.py", file=sys.stderr)
            return 1
        print(f"content mirror is up to date ({len(sources)} files)")
        return 0

    print(f"synced {len(sources)} file(s) to {TARGET.relative_to(REPO_ROOT)} "
          f"({copied} updated, {removed} removed)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify without copying")
    args = parser.parse_args()
    return sync(check_only=args.check)


if __name__ == "__main__":
    raise SystemExit(main())
