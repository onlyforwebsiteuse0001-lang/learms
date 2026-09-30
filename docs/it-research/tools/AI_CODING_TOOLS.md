# AI Coding Tools for Learners — Agent 5

- Status: Draft v0.1, Area 10 in progress
- Source anchors: S031-S033, S123

## Topic: AI coding tools are now part of developer practice
### Source: Stack Overflow Developer Survey, 2024
### Key Finding: Stack Overflow reports AI-tool usage and sentiment among developers, with ChatGPT and GitHub Copilot prominent in survey sections.
### Relevance to Learms: Learms should teach AI-assisted coding literacy, but not replace learner reasoning.
### Citation: https://survey.stackoverflow.co/2024/

## Topic: GitHub activity reports show AI is changing developer workflows
### Source: GitHub Octoverse, 2024
### Key Finding: GitHub reports macro trends in developer ecosystems and AI/tooling adoption.
### Relevance to Learms: Include AI assistant use as a professional skill with verification and ethics.
### Citation: https://github.blog/news-insights/octoverse/octoverse-2024/

## Learms AI Tool Guardrails

| Risk | Guardrail |
|---|---|
| answer copying | require explanation, tests, and diff review |
| hallucinated APIs | require official docs check |
| insecure code | security checklist and scanner prompts |
| shallow debugging | ask learner to state hypothesis before AI hint |
| dependency on AI | independent retry tasks |
| privacy leakage | warn against pasting secrets/private code |

## AI Tutor Hint Ladder

1. Restate the problem in simpler words.
2. Identify relevant concept.
3. Ask learner to predict behavior.
4. Show minimal example.
5. Suggest next line/pseudocode.
6. Only then reveal a possible fix.
7. Require learner reflection.

## Gaps

- Need peer-reviewed AI tutoring/coding assistant studies.
- Need Agent 3 security/privacy review for AI prompt handling.
