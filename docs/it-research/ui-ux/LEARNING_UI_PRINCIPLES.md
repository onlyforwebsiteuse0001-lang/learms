# Learning UI Principles for Learms — Agent 5

- Status: Draft v0.1, Area 7 in progress
- Date accessed: 2026-09-30 UTC
- Source anchors: S105-S109

## Topic: Basic usability heuristics apply to learning products
### Source: Nielsen Norman Group, 2024
### Key Finding: Nielsen's 10 usability heuristics include visibility of system status, match with real world, user control/freedom, consistency, error prevention, recognition over recall, flexibility, minimalist design, error recovery, and help/documentation.
### Relevance to Learms: Learms screens should make progress visible, use learner language, prevent irreversible mistakes, and explain errors constructively.
### Citation: https://www.nngroup.com/articles/ten-usability-heuristics/

## Topic: Cognitive load matters for programming UI
### Source: Sweller, 1988
### Key Finding: Cognitive load theory emphasizes limited working memory and schema acquisition; high means-ends problem solving can consume capacity needed for learning.
### Relevance to Learms: Do not show full IDE complexity to beginners; reveal concepts progressively.
### Citation: https://doi.org/10.1207/s15516709cog1202_4

## Topic: Multimedia learning principles matter for course content
### Source: Mayer, 2021
### Key Finding: Mayer's *Multimedia Learning* summarizes 15 instructional design principles based on experimental research in learning from words and pictures.
### Relevance to Learms: Combine diagrams, narration/text, and worked examples carefully; avoid decorative overload.
### Citation: https://doi.org/10.1017/9781316941355

## Learms UI Principles

| Principle | UI Pattern | Source |
|---|---|---|
| Show learner status | current module, next action, confidence | S105 |
| Reduce extraneous load | one concept per exercise, progressive disclosure | S109 |
| Prefer recognition | command palettes, cheat sheets, examples | S105 |
| Make errors teachable | plain-language error explanation and fix path | S105, S086 |
| Scaffold autonomy | hint ladder, then independent task | S095 |
| Make learning active | embedded coding/tracing/quiz tasks | S093 |
| Support accessibility | keyboard, contrast, captions, semantics | S106 |
| Offer multiple representations | text, code, diagram, analogy | S107, S108 |

## UI Anti-Patterns

- Giant path maps with 200 technologies on first screen.
- Video-only progress bars without skill evidence.
- Public shame leaderboards for beginners.
- Error messages that repeat compiler output without explanation.
- Dark patterns pushing certificates before mastery.

## Gaps

- Need learner usability testing.
- Need low-bandwidth Pakistan mobile-device research.
