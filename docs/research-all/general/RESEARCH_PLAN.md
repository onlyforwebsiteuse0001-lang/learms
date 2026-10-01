# Learms — Deep Research Plan (Agent 4)

**Role:** Research-only agent. No application code is written by this agent. Output is
Markdown / JSON research artifacts under `docs/research/` intended to be consumed by:

- **Agent 1** — Backend (APIs, algorithms, data models, ML services)
- **Agent 2** — Frontend + Content (UI/UX, design system, content taxonomy, copy)
- **Agent 3** — Batch 3+4 (extended features: analytics, wellness, OCR pipeline, infra)

**Branch note:** This session is technically bound to branch `arena/01a0f452-learms`
(the Arena session branch). All research documents live in `docs/research/` and contain
**no application code**, so they can be cherry-picked or merged into `arena/deep-research`
without touching any code owned by Agents 1–3.

---

## Ground rules followed by this agent

| Rule | Implementation |
|---|---|
| No code | Only `.md` / `.json` files under `docs/research/` |
| Every finding cited | `[Author/Org, Year] — URL` inline, plus a Sources block per document |
| No fabrication | If a source could not be verified, it is listed under **Gaps / Not Found** |
| Depth over breadth | Multiple independent sources per claim; contradictions flagged explicitly |
| Structured output | Topic → Source → Key Finding → Relevance to Learms → Citation |
| Checkpointing | Git commit after each document batch: `research: <topic> — <what found>` |

### Confidence labels used throughout

- **[HIGH]** — multiple peer-reviewed sources or official primary source (HEC, PEC, ICAP, W3C).
- **[MED]** — single peer-reviewed study, or credible secondary reporting (major news, industry report).
- **[LOW]** — blog/vendor claim, small-N study, or self-reported survey. Treat as hypothesis.
- **[CONTESTED]** — sources disagree; both sides recorded.

---

## Research areas and deliverables

| # | Area | Documents |
|---|---|---|
| 1 | Pakistan fields taxonomy | `PAKISTAN_FIELDS_TAXONOMY.md`, `UNIVERSITY_COURSES.md`, `PROFESSIONAL_CERTIFICATIONS.md` |
| 2 | Problems by category | `PROBLEMS_*.md` (11) |
| 3 | Solutions by category | `SOLUTIONS_BY_CATEGORY.md`, `TECH_SOLUTIONS.md`, `PAKISTAN_SOLUTIONS.md` |
| 4 | Books / literature | `BOOKS_*.md` (6) |
| 5 | UI/UX | `UI_COLOR_PSYCHOLOGY.md`, `UI_UX_LEARNING_PLATFORMS.md`, `UI_TYPOGRAPHY.md`, `UI_VISUAL_DESIGN.md`, `UI_ACCESSIBILITY.md` |
| 6 | Student success factors | `SUCCESS_*.md` (6) |
| 7 | Learning analytics | `ANALYTICS_PREDICTIVE.md`, `ANALYTICS_FRAMEWORKS.md`, `ANALYTICS_EARLY_WARNING.md` |
| 8 | Knowledge tracing / adaptive | `BKT_DEEP.md`, `FSRS_DEEP.md`, `BANDITS_DEEP.md`, `KNOWLEDGE_GRAPH_DEEP.md` |
| 9 | Socratic tutoring | `SOCRATIC_DEEP.md`, `HINT_LADDER_DEEP.md`, `SOCRATIC_PROMPTS.md` |
| 10 | OCR / extraction | `OCR_TESSERACT.md`, `OCR_PDF_LIBRARIES.md`, `OCR_GEMINI_VISION.md` |
| 11 | Wellness | `WELLNESS_SAFE.md`, `WELLNESS_CRISIS.md`, `WELLNESS_PAKISTAN.md` |
| 12 | APIs & infrastructure | `APIS_COMPARISON.md`, `INFRASTRUCTURE.md`, `VECTOR_DB.md` |
| — | Synthesis | `MASTER_RESEARCH_INDEX.md`, `KEY_FINDINGS.md`, `RECOMMENDATIONS.md`, `GAPS.md`, `MORNING_REPORT_4.md` |

---

## Method

1. **Primary sources first** — HEC curriculum PDFs, PEC/ICAP/PMDC/ACCA official pages, W3C WCAG,
   arXiv/PubMed papers, algorithm reference implementations' own docs.
2. **Triangulate** — a claim that affects a product decision (e.g. "spacing beats massing")
   needs ≥2 independent sources or a meta-analysis.
3. **Extract decisions, not trivia** — each document ends with an **Actionable for Learms**
   table mapping findings to concrete build decisions with an owning agent.
4. **Record disagreement** — e.g. learning-styles, dyslexia fonts, and gamification literature
   all contain well-documented contradictions; these are flagged rather than smoothed over.

## Reading order for the coding agents

- Agent 1 (backend): Areas 7, 8, 10, 12 → then `RECOMMENDATIONS.md`
- Agent 2 (frontend/content): Areas 1, 4, 5, 9 → then `RECOMMENDATIONS.md`
- Agent 3 (batch 3+4): Areas 2, 3, 6, 11 → then `RECOMMENDATIONS.md`
