# Debugging and Error Handling — Agent 5

- Status: Draft v0.1, Area 4 in progress
- Date accessed: 2026-09-30 UTC
- Source anchors: S084-S086, S083

## Topic: Novice debuggers often flail without effective strategies
### Source: Fitzgerald et al., 2008
### Key Finding: The multi-institutional study of novice debuggers examined how students find, fix, and sometimes flail during debugging tasks.
### Relevance to Learms: Debugging should be taught explicitly as a process, not assumed to emerge automatically.
### Citation: https://doi.org/10.1080/08993400802114508

## Topic: Novices use both productive and unproductive debugging strategies
### Source: Murphy et al., 2008
### Key Finding: A qualitative study found novices using strategies such as tracing, diagnostic prints, testing, debuggers, and pattern matching, but some used few strategies ineffectively or introduced new bugs.
### Relevance to Learms: Learms should track strategy use and provide a debugging checklist with reflection.
### Citation: https://doi.org/10.1145/1352322.1352191

## Topic: Compiler/error messages create substantial novice difficulty
### Source: Becker et al., 2019
### Key Finding: The literature on text-based programming error messages reports that compiler/interpreter diagnostic messages create substantial difficulty and could be more effective for novices.
### Relevance to Learms: Learms should translate error messages into beginner-friendly explanations, likely causes, and next actions.
### Citation: https://doi.org/10.1145/3344429.3372508

## Debugging Process Learms Should Teach

1. Reproduce the bug.
2. Read the full error message.
3. Identify the first meaningful error.
4. State expected vs actual behavior.
5. Create a minimal example.
6. Trace variables/state step by step.
7. Form one hypothesis.
8. Make one small change.
9. Re-run tests.
10. Write a bug note: cause, fix, prevention.

## Debugging UI Ideas for Agent 2

- Error-message explainer pane.
- “First failing line” highlighter.
- Step-by-step trace table.
- Bug journal and repeated-error stats.
- Toggle from hint → concept explanation → answer.

## Security Note

Debugging examples should not teach unsafe copy-paste from unknown sources without dependency/security checks.
