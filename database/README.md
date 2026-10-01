# Database

PostgreSQL is the primary durable store. Schema changes are managed by Alembic;
files in `init/` only enable database-level extensions on a fresh Docker volume.

Phase 1 tables will include students, documents, concepts, prerequisites,
quizzes, quiz attempts, mastery state, and review schedules. Their first
migration is delivered with the upload pipeline so the schema and working
behavior arrive together rather than as unused placeholder tables.
