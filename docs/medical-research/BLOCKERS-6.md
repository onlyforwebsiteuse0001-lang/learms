# Agent 6 Blockers and Constraints

**Last updated:** 2026-09-30T23:05:00Z

| ID | Constraint | Impact | Response |
|---|---|---|---|
| B-001 | Arena fixes this session to `arena/01a0f474-learms`; user requested `arena/medical-research`. | Requested branch name cannot be used. | Remain on the Arena-bound branch and disclose this in plan/report/PR. |
| B-002 | A chat turn cannot remain active autonomously for 24 hours or schedule 48 wall-clock checkpoints. | Cannot truthfully claim 24-hour unattended execution. | Produce maximum verified research in-session; commit coherent milestones; record actual timestamps and incomplete work honestly. |
| B-003 | Agent 4 branch was not identifiable among remote branches at setup. | Agent 4 research could not be read. | Recheck remotes later; avoid guessing which branch belongs to Agent 4. |
| B-004 | `main` contains only a README; `docs/ARCHITECTURE.md` exists on Agent 1's unmerged branch. | Context is not locally merged. | Read files with `git show origin/arena/01a0f3e4-learms:<path>`; do not merge or switch. |
| B-005 | Pakistan regulator pages and notices are mutable; some search results expose PDFs with OCR errors. | Risk of stale or misread requirements. | Prefer official PDFs, retain title/year/access date, and flag current-status checks. |
| B-006 | Requested statistics (for example “70%+ doctors leaving”) arrive without citations. | High hallucination/generalization risk. | Treat each as an unverified hypothesis until an original source is found; write “not verified” otherwise. |
| B-007 | CPSP's current fellowship page states 98 programs but enumerates 92; its program and accreditation directories also expose different label sets. | A definitive specialty count or active-offering inference would be unsafe. | Preserve each official representation with retrieval date; flag conflict; verify the exact program/site directly. |
