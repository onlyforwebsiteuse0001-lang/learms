# Error and Feedback UI for Programming Learners — Agent 5

- Status: Draft v0.1, Area 7 in progress
- Source anchors: S084-S086, S105, S109

## Topic: Error recovery is a core usability heuristic
### Source: Nielsen Norman Group, 2024
### Key Finding: Nielsen's heuristics include helping users recognize, diagnose, and recover from errors.
### Relevance to Learms: Compiler/runtime feedback should be translated into plain language and next steps.
### Citation: https://www.nngroup.com/articles/ten-usability-heuristics/

## Topic: Novice debugging needs explicit scaffolding
### Source: Fitzgerald et al., 2008; Murphy et al., 2008
### Key Finding: Novices often struggle to find/fix bugs and may flail; debugging strategies vary in quality.
### Relevance to Learms: Feedback UI should ask learners to predict, inspect, hypothesize, test, and reflect.
### Citation: https://doi.org/10.1080/08993400802114508 ; https://doi.org/10.1145/1352322.1352191

## Topic: Compiler errors are often unhelpful for learners
### Source: Becker et al., 2019
### Key Finding: The literature shows extensive learner difficulty with compiler error messages.
### Relevance to Learms: Build an error-message taxonomy and beginner-friendly explanation layer.
### Citation: https://doi.org/10.1145/3344429.3372508

## Error UI Pattern

| Step | UI Copy/Component | Purpose |
|---|---|---|
| 1. Localize | highlight line/token and related lines | reduce search space |
| 2. Translate | “This usually means…” | plain language |
| 3. Diagnose | ask: expected type/value/output? | activate reasoning |
| 4. Hint | staged hints: concept, location, fix pattern | avoid answer dump |
| 5. Practice | short similar bug exercise | transfer |
| 6. Log | add to learner bug journal | spaced review |

## Example Feedback Template

- Error name.
- Where it occurred.
- What the computer expected.
- What it found.
- One minimal example.
- One fix pattern.
- One misconception warning.
- One follow-up practice item.

## Agent 2 UI Notes

- Avoid red-only/error-only emotional tone.
- Show “bugs are part of programming” microcopy.
- Use collapsible advanced details for stack traces.
- Make copy button and repro steps visible.

## Gaps

- Need language-specific error-message datasets.
- Need usability tests on novice error explanations.
