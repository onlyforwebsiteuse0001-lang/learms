# Learms Product Requirements from IT Research — Agent 5

- Status: Draft v0.1
- Date: 2026-09-30 UTC

## Topic: Product requirements must follow evidence, not hype
### Source: Source register S001-S129
### Key Finding: The strongest evidence supports active learning, debugging/error support, accessible learning UX, structured projects, code quality practice, and evidence-labeled career guidance.
### Relevance to Learms: Product roadmap should prioritize learning mechanics and trustworthy guidance before broad content expansion.
### Citation: docs/it-research/sources/SOURCE_REGISTER.csv

## MVP Requirements

| Requirement | Evidence | Priority |
|---|---|---|
| Path recommender with limited choices | choice overload caveat + curriculum distinctions | P0 |
| Concept/prerequisite graph | ACM/IEEE curricula and taxonomy artifacts | P0 |
| Active coding exercises | active learning and CS1 evidence | P0 |
| Debugging/error explainer | debugging/compiler-error papers | P0 |
| Spaced retrieval | Dunlosky et al. | P0 |
| Project milestones | PBL and career evidence | P0 |
| Accessible low-data UX | WCAG/UDL + Pakistan connectivity | P0 |
| Mastery dashboard | learning analytics + wellbeing | P1 |
| Peer/code review workflow | code review/pair programming papers | P1 |
| Pakistan salary/job evidence labels | P@SHA/PSEB/PayScale caveats | P1 |
| Book/resource recommender | book catalog/rubric | P2 |
| AI tutor guardrails | Stack Overflow/GitHub AI adoption; security gaps | P2 |

## Non-Goals for Early MVP

- Do not promise jobs or salaries.
- Do not rank all technologies universally.
- Do not build every course from scratch when high-quality free resources exist.
- Do not use public leaderboards for beginner motivation.
- Do not let AI produce unverified final answers without learner reasoning.

## Learner Modes

1. New-to-IT mode.
2. University companion mode.
3. Freelance portfolio mode.
4. Job interview mode.
5. Skill-gap remediation mode.

## Product Risks

| Risk | Mitigation |
|---|---|
| too many paths | progressive disclosure and recommender |
| poor local evidence | confidence labels and updates |
| tutorial dependency | active tasks and project defense |
| AI overreliance | hint ladder and required explanations |
| low bandwidth | text-first/offline/optional video |
| attrition | early wins and recovery paths |
