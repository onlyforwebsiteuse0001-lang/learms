# Agent Handoffs — Agent 5 IT Research

- Status: Draft v0.1
- Date: 2026-09-30 UTC

## Topic: Agent 1 backend knowledge graph handoff
### Source: ACM/IEEE CS2023; IT2017; SWEBOK; NIST NICE; O*NET
### Key Finding: Computing domains, software engineering areas, cybersecurity work roles, and occupational tasks can be represented as nodes/edges with source confidence.
### Relevance to Learms: Agent 1 should model concepts, prerequisites, careers, projects, tools, sources, and confidence levels.
### Citation: https://csed.acm.org/ ; https://www.acm.org/binaries/content/assets/education/curricula-recommendations/it2017.pdf ; https://www.computer.org/education/bodies-of-knowledge/software-engineering ; https://doi.org/10.6028/NIST.SP.800-181r1 ; https://www.onetonline.org/link/summary/15-1252.00

### Agent 1 Actions

- Ingest `taxonomy/IT_ROOTS_COMPLETE.md`, `taxonomy/IT_SUBROOTS_COMPLETE.md`, `taxonomy/ROOT_PREREQUISITES.md`.
- Convert `languages/*.md` and `sub-domains/*.md` into `Language`, `Domain`, `Concept`, `Tool`, `Project`, `CareerRole` nodes.
- Add evidence fields: source URL/DOI, date accessed, confidence, scope (global/Pakistan).
- Treat `not found` and pending gaps as first-class missing-data flags.

## Topic: Agent 2 UI/UX handoff
### Source: Nielsen Norman Group; WCAG 2.2; CAST UDL; Sweller; Mayer
### Key Finding: Learning UX should reduce cognitive load, be accessible, support multiple representations, and guide error recovery.
### Relevance to Learms: Agent 2 should design guided paths, error-feedback UI, accessible content, and private mastery dashboards.
### Citation: https://www.nngroup.com/articles/ten-usability-heuristics/ ; https://www.w3.org/TR/WCAG22/ ; http://udlguidelines.cast.org ; https://doi.org/10.1207/s15516709cog1202_4 ; https://doi.org/10.1017/9781316941355

### Agent 2 Actions

- Use `ui-ux/LEARNING_UI_PRINCIPLES.md` as baseline.
- Design onboarding that limits initial choices and reveals paths progressively.
- Design error message UI using `ui-ux/ERROR_FEEDBACK_UI.md`.
- Make dashboard private-by-default and mastery-focused.
- Include low-data mode and optional video.

## Topic: Agent 3 security handoff
### Source: OWASP Top 10; NIST NICE; Learms AI tool/security notes
### Key Finding: Cybersecurity and privacy are cross-cutting requirements, not a later specialization.
### Relevance to Learms: Agent 3 should review code playgrounds, AI prompts, analytics data, auth flows, and project security checklists.
### Citation: https://owasp.org/Top10/ ; https://doi.org/10.6028/NIST.SP.800-181r1

### Agent 3 Actions

- Review AI tutor privacy and prompt handling.
- Review learner analytics dashboard data minimization.
- Define safe sandboxing for code execution.
- Add security checklist to web/backend projects.
- Ensure cybersecurity labs are legal and isolated.

## Topic: Agent 4 general research handoff
### Source: Current Agent 5 gap logs
### Key Finding: Agent 5 has technical/domain evidence but still needs complementary general market, learner, and Pakistan data.
### Relevance to Learms: Agent 4 can validate user personas, language preferences, affordability, and motivational barriers.
### Citation: docs/it-research/PROGRESS-5.md ; docs/it-research/MORNING_REPORT-5.md

### Agent 4 Actions

- Pakistan learner interviews/surveys.
- Device/internet affordability research.
- Bootcamp/university ecosystem mapping.
- Gender/inclusion barriers and support resources.
- Current job-post/salary validation.
