# Technology Solutions for IT Learning — Agent 5

- Status: Draft v0.1, Area 5 in progress
- Date accessed: 2026-09-30 UTC
- Source anchors: S086, S084-S085, S012, S024, S031-S033

## Topic: Error-message support is a high-impact learning technology area
### Source: Becker et al., 2019
### Key Finding: Compiler/interpreter diagnostics create substantial novice difficulty, and error-message research has a long history.
### Relevance to Learms: Build an error-message explainer that maps errors to likely misconception, minimal fix, and practice task.
### Citation: https://doi.org/10.1145/3344429.3372508

## Topic: Debugging tools need explicit strategy scaffolding
### Source: Fitzgerald et al., 2008; Murphy et al., 2008
### Key Finding: Novices use varied debugging strategies, and some flail or introduce new bugs.
### Relevance to Learms: Code playgrounds should include trace tables, hypothesis prompts, and bug journals, not just run buttons.
### Citation: https://doi.org/10.1080/08993400802114508 ; https://doi.org/10.1145/1352322.1352191

## Topic: AI coding assistants need guardrails
### Source: GitHub Octoverse, 2024; Stack Overflow, 2024
### Key Finding: Global developer surveys/reports show AI tool adoption is changing programming activity, but learner competence still requires independent understanding.
### Relevance to Learms: AI help should be explanation-first and require learner edits/tests before marking completion.
### Citation: https://github.blog/news-insights/octoverse/octoverse-2024/ ; https://survey.stackoverflow.co/2024/

## Technology Feature Matrix

| Tool Type | Learms Feature | Risk | Guardrail | Source |
|---|---|---|---|---|
| Code playground | instant run, tests, trace | shallow trial-and-error | require explanation and tests | S084-S086 |
| Adaptive quiz | spaced retrieval | memorization without transfer | mix recall + code construction | S094 |
| AI tutor | hints/explanations | answer outsourcing | staged hints and reflection | S031-S033 |
| Project tracker | milestones | scope creep | rubric and checklists | S096 |
| Peer review tool | comments/rubric | low-quality feedback | review examples and prompts | S092 |
| Analytics dashboard | error patterns | surveillance concerns | privacy-by-design | S021 |

## Recommended Learms MVP Technology Stack (Research Concept, Not Code)

1. Browser-based code exercises for Python and JavaScript.
2. Error-message explainer mapped to misconception taxonomy.
3. Spaced retrieval queue for concepts and commands.
4. Project milestone checklist.
5. Simple peer/code review rubric.
6. Progress dashboard focused on mastery, not shame.

## Gaps

- Need comparison of existing platforms: Replit, CodeSandbox, StackBlitz, freeCodeCamp, Codecademy, LeetCode, HackerRank.
- Need AI tutor evaluation studies in programming education.
