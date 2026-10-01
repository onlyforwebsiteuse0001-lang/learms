# BLOCKERS-8 — Live Blocker Register

| ID | Blocker | Severity | State | Resolution |
|---|---|---|---|---|
| B-1 | Docker unavailable in execution sandbox | Medium | OPEN-mitigated | Phase 4 uses native processes (uvicorn/vite) + static Docker config verification; docker-compose correctness argued from config review |
| B-2 | Agent branches share no history with main (root-based) | High | RESOLVED | Integrate via `git checkout <branch> -- <paths>` (tree-level), never plain merge |
| B-3 | `security/` built standalone, no wiring into `backend/app` | Medium | OPEN | Phase 2 decision: land package + tests; deep wiring deferred to v1.6.0 (documented in DECISIONS-8) |
| B-4 | Briefing inaccuracies (PR#1 already merged; venv junk absent) | Low | RESOLVED | Real state recorded in AUDIT-REPORT-8 §6 |

_GitHub auth: working (gh CLI OK). No credential blockers._
