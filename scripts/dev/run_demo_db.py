#!/usr/bin/env python3
"""Dockerless local PostgreSQL for HAAFIZ EDU development.

Starts a real PostgreSQL server from the pip-installable ``pgserver`` package
(no Docker, no root, no system packages required) and writes the app connection
URL to ``/tmp/haafiz-pg-uri.txt``.

Usage:
    pip install pgserver
    python scripts/dev/run_demo_db.py        # idempotent

The server keeps running after this script exits (cleanup_mode=None).
Stop it later with:  python -c "import pgserver; pgserver.pg_ctl(['stop','-D','/tmp/haafiz-pgdata','-m','fast'])"
"""
from __future__ import annotations

import sys
from pathlib import Path

PGDATA = Path("/tmp/haafiz-pgdata")
URI_FILE = Path("/tmp/haafiz-pg-uri.txt")
APP_DB = "haafiz"
APP_USER = "haafiz"
APP_PASSWORD = "haafiz-dev-password"  # dev-only, never for deployment


def main() -> int:
    import pgserver  # noqa: PLC0415 - dev convenience import

    pgserver.get_server(PGDATA, cleanup_mode=None)  # starts if not running

    def sql(stmt: str, db: str = "postgres", tsv: bool = False) -> str:
        args = ["-h", str(PGDATA), "-U", "postgres", "-d", db]
        if tsv:
            args += ["-tA"]
        args += ["-c", stmt]
        return pgserver.psql(args).strip()

    sql(
        "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='{u}') "
        "THEN CREATE ROLE {u} LOGIN PASSWORD '{p}'; END IF; END $$;".format(u=APP_USER, p=APP_PASSWORD)
    )
    if not sql(f"SELECT 1 FROM pg_database WHERE datname='{APP_DB}'", tsv=True):
        sql(f"CREATE DATABASE {APP_DB} OWNER {APP_USER}")

    # pgserver serves over a unix socket inside the pgdata dir (no TCP needed).
    app_uri = f"postgresql://{APP_USER}:{APP_PASSWORD}@/{APP_DB}?host={PGDATA}"
    URI_FILE.write_text(app_uri + "\n")
    print(f"postgres ready (unix socket): {app_uri}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
