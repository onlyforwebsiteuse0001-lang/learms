# Research: Agent and sandbox capabilities

Date: 2026-10-01 (Asia/Karachi)

## Available capabilities

- Repository-scoped file read/write/edit and Bash execution under `/home/user/learms`.
- Real-time web search and page retrieval.
- Git and authenticated GitHub CLI access; work is restricted to `arena/01a0f3e4-learms`.
- Background process management for preview servers.
- Python 3.11.2 and Node.js 22.22.3 are available.

## Constraints observed

- Docker, PostgreSQL, Redis, Tesseract, and Poppler are not guaranteed in the sandbox; Compose and migrations can be statically validated, while true container integration must run on a Docker host.
- API credentials are absent by design. Provider calls must be mocked in tests, and deterministic fallback must identify itself.
- Long-running servers must use process tools. One-shot test/build commands use bounded Bash timeouts.
- Workspace snapshots can restore Git metadata differently between turns; before each commit the tracked branch is reconciled with `origin/arena/01a0f3e4-learms` without discarding working files.
- No work can continue after the assistant turn ends; “eight hours” is treated as an autonomous scope goal, not a claim of background execution.

## Tool policy used

Research findings are cited in domain documentation. Package installs and tests are bounded. No secrets are requested, generated, or committed.
