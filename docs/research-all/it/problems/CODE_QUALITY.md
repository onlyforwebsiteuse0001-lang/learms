# Code Quality and Best Practices — Agent 5

- Status: Draft v0.1, Area 4 in progress
- Date accessed: 2026-09-30 UTC
- Source anchors: S003, S092, S087

## Topic: Code quality is part of software engineering, not an optional polish step
### Source: IEEE Computer Society, 2024
### Key Finding: SWEBOK v4.0 includes software quality, testing, maintenance, construction, architecture, security, and professional practice as core software engineering areas.
### Relevance to Learms: Learms should require quality practices in beginner projects: naming, tests, small functions, reviews, and maintainability.
### Citation: https://www.computer.org/education/bodies-of-knowledge/software-engineering

## Topic: Code review can support quality and knowledge transfer
### Source: Jureczko, Kajda, and Górecki, 2020
### Key Finding: Code review effectiveness research studies factors affecting defect detection and knowledge transfer, including review size and reviewer-related factors.
### Relevance to Learms: Learms should use lightweight peer/code review rubrics as learning interventions.
### Citation: https://doi.org/10.1049/iet-sen.2020.0134

## Topic: Pair programming has evidence as an educational intervention
### Source: Salleh, Mendes, and Grundy, 2011
### Key Finding: The systematic literature review/meta-analysis found pair programming often improves student satisfaction and can improve programming assignment outcomes, with effects depending on context and student skill level.
### Relevance to Learms: Pair tasks should be available but structured; pairing is not a magic fix.
### Citation: https://doi.org/10.1109/TSE.2010.59

## Learms Code Quality Rubric

| Dimension | Beginner Evidence | Intermediate Evidence | Source |
|---|---|---|---|
| Correctness | passes visible tests | passes hidden/edge tests | S003 |
| Readability | clear names, simple functions | consistent style and docs | S003 |
| Maintainability | no giant copy-paste blocks | modular architecture | S003 |
| Testability | has basic tests | unit/integration tests | S003 |
| Security | avoids obvious unsafe patterns | threat model/security checklist | S003, S077 |
| Reviewability | small submission | responds to review comments | S092 |
| Collaboration | pair/peer feedback | pull request workflow | S087, S092 |

## Gaps

- Need source-backed examples of code smells and refactoring pedagogy.
- Need beginner-friendly rubrics for Pakistan bootcamp/university settings.
