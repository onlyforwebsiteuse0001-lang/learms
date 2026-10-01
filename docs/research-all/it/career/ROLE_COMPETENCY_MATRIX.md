# Role Competency Matrix — Agent 5

- Status: Draft v0.1, Area 9 in progress
- Source anchors: S001-S009, S121, S003

## Topic: Role competencies should map to tasks, not buzzwords
### Source: O*NET; SWEBOK; ACM/IEEE curricula
### Key Finding: O*NET describes software developer tasks and activities; SWEBOK defines software engineering knowledge areas; ACM/IEEE curricula define computing competencies.
### Relevance to Learms: Agent 1 should connect careers to competencies, concepts, projects, and evidence sources.
### Citation: https://www.onetonline.org/link/summary/15-1252.00 ; https://www.computer.org/education/bodies-of-knowledge/software-engineering ; https://csed.acm.org/

## Matrix

| Role | Must Know | Tools | Proof Artifact | Assessment Ideas |
|---|---|---|---|---|
| Frontend Developer | HTML/CSS/JS, accessibility, APIs | browser devtools, Git, React optional | responsive app | build from mockup, fix a11y issues |
| Backend Developer | HTTP, SQL, auth, testing | Python/Node, database, Git | API service | CRUD + auth + tests |
| Full-Stack Developer | frontend + backend + deployment | JS stack/cloud | deployed app | feature end-to-end |
| Data Analyst | SQL, spreadsheets, stats, visualization | SQL, Python/R, BI tool | dashboard/report | analyze messy dataset |
| ML Engineer | ML basics, math, evaluation, deployment | Python, sklearn/PyTorch, MLOps | model pipeline | avoid leakage, explain metrics |
| Cybersecurity Analyst | networking, Linux, logs, threats | SIEM/lab tools | investigation report | detect and explain incident |
| DevOps/Cloud | Linux, networking, CI/CD, monitoring | Docker, cloud, IaC | deployed monitored service | build pipeline and alert |
| QA/SDET | test design, automation, bug reporting | Playwright/Selenium, API tests | test suite | write tests and bug report |
| Mobile Developer | UI, storage, APIs, release | Kotlin/Swift/Flutter | app prototype | offline and API task |
| UI/UX Designer | research, IA, accessibility, prototyping | Figma, testing tools | case study | usability-test scenario |
| IT Support/Admin | OS, networking, troubleshooting | ticketing, Linux/Windows | runbook | diagnose incident |
| Business Analyst | requirements, domain, communication | docs, diagrams, SQL optional | requirements spec | convert problem to user stories |

## Knowledge Graph Fields

- `Role.requiresSkill`
- `Skill.hasPrerequisite`
- `Skill.evidencedByProject`
- `Project.assessesConcept`
- `Role.hasMarketEvidence`
- `MarketEvidence.confidenceLevel`

## Gaps

- Need employer interviews to weight competencies.
- Need Pakistan-specific role clusters from job data.
