# BLOCKERS-2 — Agent 2

## B-001 — Branch name cannot be `arena/frontend-content` (RESOLVED / WORKED AROUND)
- Blocker: the brief asks for branch `arena/frontend-content`. The Arena platform pins this session to
  `arena/01a0f445-learms`; work committed to any other branch is not associated with the session and
  would be lost to the user's tooling.
- Tried: confirmed the pinned branch is already checked out and is the only branch this session may push.
- Need: nothing. All Agent 2 work is on `arena/01a0f445-learms`. Folder separation from Agent 1
  (`arena/01a0f3e4-learms`) is fully preserved, which is the part that actually prevents conflicts.
- Impact: none on conflict avoidance. Only the branch label differs from the brief.

## B-002 — Cannot run the frontend against the real backend (OPEN, MITIGATED)
- Blocker: Agent 1's backend lives on an unmerged branch. `main` (this branch's base) is an empty
  README. There is no Postgres/Redis/Celery in this sandbox either.
- Tried: read the full backend source and derived the exact contract; built MSW handlers that mirror
  it field-for-field; wrote integration tests against those handlers.
- Need: Agent 1's PR merged + `docker compose up` to verify end-to-end.
- Impact: every request shape is verified against Agent 1's source but NOT against a running server.
  Treated as unverified in MORNING_REPORT-2.md.

## B-003 — No LLM API keys for content generation (OPEN, MITIGATED)
- Blocker: GEMINI_API_KEY / GROQ_API_KEY / OPENROUTER_API_KEY are unset, so AI syllabus generation
  cannot run.
- Tried: implemented the generator fully; it detects missing keys and exits non-zero with instructions
  rather than emitting invented content.
- Need: an API key, then `python scripts/content/generate_syllabus.py --field it_computing`.
- Impact: the shipped library is hand-curated from published HEC/NCEAC/PEC curricula. Provenance is
  recorded per file in `authoring.method`.

## B-004 — 8 hours of wall-clock autonomy is not available (OPEN, DISCLOSED)
- Blocker: the agent runs in bounded turns, not an 8-hour daemon. The schedule was executed as an
  ordered work plan, compressed.
- Tried: prioritised the deliverable list by dependency order so partial completion still yields a
  coherent app.
- Need: further turns to finish anything listed as NOT DONE in MORNING_REPORT-2.md.
- Impact: see the honest scope list in the morning report.

## B-005 — GitHub push authentication expired mid-session (RESOLVED)
- Blocker: `git push` failed twice with
  `fatal: could not read Username for 'https://github.com': terminal prompts disabled`.
  Three commits sat locally, unpushed.
- Tried: re-running the push; checking `gh auth status`. Did not, and would not, ask the user for a
  token — credentials never belong in chat.
- Resolved: the token was refreshed out of band. All commits are now on
  `origin/arena/01a0f445-learms`.
- Impact: none on the deliverable. The RULE 2 checkpoint cadence was broken for one step.

## B-006 — Sandbox re-cloned mid-session (RESOLVED)
- Blocker: the workspace was re-provisioned. Local git history reset to the base commit
  `6821a7f`, every tracked file reverted to untracked, and `node_modules` was deleted
  (it is excluded from workspace snapshots).
- Tried: nothing was lost — the working tree survived intact, only git's view of it was reset.
- Resolved: `git reset origin/arena/01a0f445-learms` restored history onto the pushed remote tip, the
  outstanding work was re-committed, and `npm install` restored 548 packages.
- Gotcha worth recording: the fresh clone was **shallow**, so `git merge-base origin/main HEAD` returned
  nothing and `git merge-tree` reported `refusing to merge unrelated histories`. This is a local
  artefact, not repository damage. `git fetch --unshallow origin` fixed it and the true merge base
  (`6821a7f`) reappeared.
- Impact: none on the deliverable.
