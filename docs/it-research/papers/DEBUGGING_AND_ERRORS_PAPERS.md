# Debugging and Error Message Papers — Agent 5

- Status: Draft v0.1, Area 11 in progress
- Source anchors: S084-S086

## Topic: Novices can flail while debugging
### Source: Fitzgerald et al., 2008
### Key Finding: The multi-institutional study describes novice debugging as finding, fixing, and sometimes flailing.
### Relevance to Learms: The product should detect repeated run-without-change loops and prompt structured debugging.
### Citation: https://doi.org/10.1080/08993400802114508

## Topic: Debugging strategies vary in quality
### Source: Murphy et al., 2008
### Key Finding: The qualitative study documents good, bad, and quirky novice debugging approaches.
### Relevance to Learms: Learms should teach debugging checklists and reflective bug journals.
### Citation: https://doi.org/10.1145/1352322.1352191

## Topic: Compiler error messages are often unhelpful to novices
### Source: Becker et al., 2019
### Key Finding: The literature review frames compiler error messages as a persistent challenge in novice programming education.
### Relevance to Learms: Error UI should translate messages into conceptual explanations and next-step practice.
### Citation: https://doi.org/10.1145/3344429.3372508

## Product Feature Mapping

| Research Problem | Learms Feature |
|---|---|
| flailing | run-history detection and hypothesis prompt |
| poor localization | line/token highlighting and relevant context |
| opaque messages | plain-language translator |
| fragile fixes | similar-bug follow-up exercise |
| repeated errors | spaced error review queue |

## Gaps

- Need language-specific error-message studies for Python and JavaScript.
- Need empirical evaluation of Learms-style error explanations.
