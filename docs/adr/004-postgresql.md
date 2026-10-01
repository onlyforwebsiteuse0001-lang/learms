# ADR 004: PostgreSQL as durable system of record

## Context
The platform needs transactions, ownership constraints, graph provenance, JSON response logs, migrations and concurrent workers.

## Decision
Use PostgreSQL with async SQLAlchemy 2 and Alembic. Redis is ephemeral coordination/cache infrastructure, not the source of truth.

## Consequences
Strong relational integrity and mature operations outweigh embedded-database simplicity. Production requires pool monitoring, backups, migration discipline and tested restore procedures.
