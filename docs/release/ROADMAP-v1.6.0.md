# v1.6.0 Roadmap (drafted by Agent 8 at v1.5.0 release)

Ordered by learner impact. Each item maps to a GitHub issue created at release time.

## High priority — core learning loop completion

1. **Socratic Tutor module** — hint-ladder engine (`docs/research-all/general/HINT_LADDER_DEEP.md`, `SOCRATIC_DEEP.md`); wire `security/llm/` guardrails around every model call; frontend shell `pages/pending/Tutor.tsx` already exists.
2. **Quiz + Assessment engine** — item model on top of extracted concepts; MCQ + free response; evidence-linked feedback (`pages/pending/Quiz.tsx`).
3. **Planner + Exam Coach** — study schedule from target date + mastery (`pages/pending/Planner.tsx`, `MockExam.tsx`).
4. **FSRS scheduling** — dep already pinned (`fsrs>=5`); wire review queue next to BKT mastery.

## High priority — production hardening

5. **Wire `security/` package into request path** — rate limiting, request signing on sensitive routes, security headers audit, RLS policies for multi-tenant tables. (Package landed as tested library in v1.5.0; hot-wiring needs a dedicated regression pass.)
6. **WebSocket job progress** — frontend flag `VITE_ENABLE_WS` exists; implement `/api/v1/ws/jobs/{job_id}`.
7. **Remove legacy `backend/main.py`** — duplicate entrypoint, 0% coverage, confuses new contributors.

## Medium priority

8. **Multi-role dashboards** — parent/teacher/admin views on mastery data (RBAC blocks exist in `security/rbac.py`).
9. **Accessibility WCAG 2.2 + PWA offline polish** — research-ready (`docs/research-all/it/ui-ux/ACCESSIBILITY_INCLUSION.md`).
10. **Content expansion wave 1** — IT tracks, CMA/ACCA depth, MDCAT (seeds in `content/INDEX.md`); close the 48 taxonomy-gap warnings.

## Low priority

11. Gamification foundations (streaks, badges) — design against intrinsic-motivation findings in research.
12. Social features (study groups) — deferred until moderation capacity exists.
13. Mobile apps — PWA covers the base; native wrappers only if analytics justify.
