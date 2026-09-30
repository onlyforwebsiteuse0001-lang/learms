# Programming Learning Difficulties — Agent 5

- Status: Draft v0.1, Area 4 in progress
- Date accessed: 2026-09-30 UTC
- Source anchors: S079-S086

## Topic: Many CS1 students cannot independently program after introductory courses
### Source: McCracken et al., 2001
### Key Finding: A multi-national, multi-institutional assessment found disappointing results in first-year programming skill; Semantic Scholar summary reports a combined sample of 216 students from four universities with an average score of 22.89 out of 110 on the study criteria.
### Relevance to Learms: Learms should not equate course completion or tutorial completion with programming competence; it should assess independent problem solving and code construction.
### Citation: https://doi.org/10.1145/572133.572137

## Topic: Programming learning requires mental models, strategies, generation, and comprehension
### Source: Robins, Rountree, and Rountree, 2003
### Key Finding: The review identifies novice/expert differences, programming knowledge and strategies, program generation, program comprehension, and procedural vs object-oriented issues as central to learning programming.
### Relevance to Learms: Learms should teach code reading, tracing, explanation, and strategy selection, not just syntax.
### Citation: https://doi.org/10.1076/csed.13.2.137.14200

## Topic: Introductory programming has a large research base but persistent challenges
### Source: Luxton-Reilly et al., 2018
### Key Finding: The systematic literature review covers introductory programming research and summarizes persistent challenges for the computing education community.
### Relevance to Learms: Learms should maintain evidence tags for interventions and avoid assuming any single pedagogy solves CS1 failure.
### Citation: https://doi.org/10.1145/3293881.3295779

## Topic: Novice logic errors often reflect misconceptions
### Source: Brown and Altadmri, 2018
### Key Finding: In an analysis of 15,000 novice code fragments with logic errors, misconceptions were reported as the most frequent source of logic errors and among the hardest for students to resolve.
### Relevance to Learms: Learms should diagnose misconceptions such as off-by-one boundaries, integer division, initialization, and loop inclusivity with targeted exercises.
### Citation: https://doi.org/10.1145/3160489.3160493

## Common Learner Problem Map

| Problem | Learms Detection Idea | Intervention Candidate | Source |
|---|---|---|---|
| Syntax-only learning | Ask learner to explain code and modify it without tutorial | code tracing and Parsons/problems | S080, S081 |
| Weak problem decomposition | Require plain-English plan before code | worked examples then faded scaffolding | S079, S080 |
| Misconceptions in loops/variables | targeted misconception quizzes | minimal counterexamples | S083 |
| Error-message overload | track repeated compiler/interpreter errors | enhanced error explanation | S086 |
| Debugging flailing | observe strategy: tracing vs random edits | explicit debugging checklist | S084, S085 |
| Tutorial dependence | blank-editor project tasks | project-based learning with constraints | Source gap: academic source pending |

## Pakistan-Specific Notes

- Pakistan-specific novice programming misconception data: **not found in current pass**.
- Need university CS1 pass/fail or withdrawal data from HEC/universities if accessible.
- Learms should collect anonymized exercise telemetry to build local evidence.
