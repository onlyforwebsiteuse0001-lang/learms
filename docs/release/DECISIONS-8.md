# DECISIONS-8 — Release Decisions Log

## D-1 (Phase 0): Session-branch confinement
All work lands on `arena/01a0f682-learms`. GitHub-side actions restricted to: PR reviews/comments, PR creation, issue creation, release creation, merging MY OWN integration PR. Other agents' branches are read-only sources for me (no push/force-push/delete). Stale-branch deletion requested by brief is DEFERRED and left for the repo owner (destructive, out of my allowed ref scope).

## D-2 (Phase 0): Tree-level integration instead of merges
Agent branches are rooted at an empty base; plain merges would delete main's backend/frontend/content. Decision: integrate files via `git checkout <branch> -- <paths>` and commit on the integration branch with provenance noted in commit messages. Trade-off: agent commit history isn't preserved on main (acceptable; full branches remain on origin for archaeology; PRs #2/#3/#4 remain open until owner closes/consolidates).

## D-3 (Phase 0): Research consolidation layout
Per brief Phase 2.4: `docs/research-all/{general,it,medical,accounting}`. Original per-domain folders are moved there; `docs/SESSION-STATE-{5,6,7}.md` stay at `docs/` root (matches existing `SESSION-STATE-2.md` convention).

## D-4 (Phase 0): README conflict handling
Agent 3 README is a placeholder (`# learms`); main's README is substantive. Take main's README; append security section during Phase 6 rewrite. No true conflict.

## D-5 (Phase 4, anticipated): Docker
Sandbox lacks Docker → demo/readiness proven via native services + static inspection of Dockerfiles/compose; CI workflow `docker.yml` added so build is exercised on GitHub runners where Docker exists.

## D-6 (anticipated): Security package scope for v1.5.0
Land `security/` as a tested library + document integration contract; do NOT hot-wire into `backend/app` mid-release without full regression capacity — verified during Phase 3 testing. (Final call recorded after test run.)
