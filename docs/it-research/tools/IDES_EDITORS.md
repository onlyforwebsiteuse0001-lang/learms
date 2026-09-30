# IDEs and Editors for Learms Paths — Agent 5

- Status: Draft v0.1, Area 10 in progress
- Source anchors: S126, S128-S129

## Topic: VS Code is a practical default editor for many learners
### Source: Microsoft VS Code Docs, 2026
### Key Finding: The official getting-started guide explains installing VS Code, opening code, and choosing a hands-on path for first tasks; no account is needed for the core editor.
### Relevance to Learms: VS Code can be the default “real-world editor” track after browser exercises.
### Citation: https://code.visualstudio.com/docs/setup/setup-overview

## Topic: Browser IDEs reduce setup friction
### Source: StackBlitz Docs, 2024
### Key Finding: StackBlitz describes itself as an instant full-stack web IDE for JavaScript powered by WebContainers, booting Node.js in the browser.
### Relevance to Learms: Browser IDEs are valuable for instant practice, especially where device setup is hard.
### Citation: https://developer.stackblitz.com/guides/user-guide/what-is-stackblitz

## Tool Decision Matrix

| Scenario | Recommended Tool Type | Rationale |
|---|---|---|
| First 10 coding exercises | embedded playground | no setup friction |
| Web frontend | browser playground + VS Code | instant preview then real workflow |
| Python basics | browser runner or local VS Code | simple setup |
| Data analysis | notebooks/Colab/Jupyter | visual data workflow |
| Full-stack project | local VS Code or browser IDE | real file structure + Git |
| Mobile development | local Android Studio/Xcode/Flutter | emulator/build requirements |
| Cybersecurity labs | isolated VM/container labs | safety/legal isolation |
| Embedded/IoT | simulator then hardware IDE | hardware constraints |

## Learms UX Rule

- Do not force local setup before the learner understands why they need it.
- But do not keep learners forever in toy playgrounds; transition to Git/editor/project workflow.

## Gaps

- Need low-spec laptop/mobile feasibility tests.
- Need Pakistan lab/hardware access evidence.
