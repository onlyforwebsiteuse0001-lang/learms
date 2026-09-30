# Operations and Runbook

## Deployment checks

1. Configure a unique 32+ character `SECRET_KEY`, HTTPS, production CORS, PostgreSQL, Redis and private upload storage.
2. Run `alembic upgrade head` before API/worker rollout.
3. Start API and Celery worker as separate least-privilege processes.
4. Restrict `/metrics` and database/Redis ports at ingress/network level.
5. Verify `/api/health/live`, `/api/health`, one authenticated upload, and worker completion.

## Backup and restore

- Use PostgreSQL-native consistent backups (`pg_dump` for logical backups or managed snapshots/PITR).
- Back up upload object storage with matching retention and encryption.
- Record migration revision with every backup.
- Restore into an isolated environment, run integrity counts, sample document provenance, then perform a controlled cutover.
- Test restore quarterly; an untested backup is not considered recoverable.

## Monitoring and alerts

Scrape `/metrics`; alert on 5xx rate, P95 latency, process restarts, DB pool exhaustion, Redis failures, Celery queue depth/oldest age, failed documents, disk/storage capacity and backup age. Process-local counters require per-worker scraping and aggregation.

## Incident runbook

- **API unhealthy:** inspect structured logs by request ID, deployment secret/config validation, DB pool, memory and event-loop saturation.
- **Uploads queued:** verify Redis broker, worker heartbeat, queue age and storage access. Retry only failed job documents.
- **Extraction failures:** inspect sanitized durable errors, Tesseract languages, Poppler, file validity and provider availability. Never mark success manually without text provenance.
- **Provider outage:** deterministic extraction remains labeled; monitor fallback rate and do not disguise it as AI.
- **Suspected credential exposure:** rotate environment secret/provider key, restart processes, revoke affected external keys, and investigate access logs. Existing JWTs cannot yet be centrally revoked, so rotate JWT signing secret if necessary.

## Troubleshooting validation

Run `pytest`, Ruff, Python compilation, Alembic offline SQL and `pip-audit -r requirements.txt`. Docker/live-stack steps cannot be replaced by mocks for release acceptance.
