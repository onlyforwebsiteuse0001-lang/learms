-- Safe PostgreSQL extensions used by HAAFIZ.
-- Vector support will be enabled only when the deployed image provides pgvector.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
